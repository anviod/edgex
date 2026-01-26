package mqtt

import (
	"encoding/json"
	"industrial-edge-gateway/internal/model"
	"log"
	"sync"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

const (
	StatusDisconnected = 0
	StatusConnected    = 1
	StatusReconnecting = 2
	StatusError        = 3
)

type Client struct {
	config     model.MQTTConfig
	client     mqtt.Client
	lastValues sync.Map

	status   int
	statusMu sync.RWMutex
	stopChan chan struct{}

	bufferMu sync.Mutex
	buffers  map[string]*bufferItem

	periodicMu sync.Mutex
	periodic   map[string]*periodicItem
}

type AggregatedPayload struct {
	Timestamp int64          `json:"timestamp"`
	Node      string         `json:"node"`
	Group     string         `json:"group"`
	Values    map[string]any `json:"values"`
	Errors    map[string]any `json:"errors"`
	Metas     map[string]any `json:"metas"`
}

type bufferItem struct {
	payload *AggregatedPayload
	timer   *time.Timer
}

type periodicItem struct {
	channelID string
	values    map[string]model.Value
	ticker    *time.Ticker
	stop      chan struct{}
}

func NewClient(cfg model.MQTTConfig) *Client {
	c := &Client{
		config:   cfg,
		stopChan: make(chan struct{}),
		buffers:  make(map[string]*bufferItem),
		periodic: make(map[string]*periodicItem),
	}
	return c
}

func (c *Client) GetStatus() int {
	c.statusMu.RLock()
	defer c.statusMu.RUnlock()
	return c.status
}

func (c *Client) setStatus(s int) {
	c.statusMu.Lock()
	defer c.statusMu.Unlock()
	c.status = s
}

func (c *Client) UpdateConfig(cfg model.MQTTConfig) error {
	needRestart := c.config.Broker != cfg.Broker ||
		c.config.ClientID != cfg.ClientID ||
		c.config.Username != cfg.Username ||
		c.config.Password != cfg.Password

	c.config = cfg

	if needRestart {
		c.Stop()
		// Re-init stop chan
		c.stopChan = make(chan struct{})
		return c.Start()
	}

	// Update periodic tasks if devices config changed (but no full restart)
	c.updatePeriodicTasks()

	return nil
}

func (c *Client) Start() error {
	// Start connection in background to support custom retry logic
	go c.connectLoop()
	c.updatePeriodicTasks()
	return nil
}

func (c *Client) updatePeriodicTasks() {
	c.periodicMu.Lock()
	defer c.periodicMu.Unlock()

	// Stop removed or changed tasks
	for devID, item := range c.periodic {
		devCfg, ok := c.config.Devices[devID]
		if !ok || !devCfg.Enable || devCfg.Strategy != "periodic" || time.Duration(devCfg.Interval) <= 0 {
			close(item.stop)
			item.ticker.Stop()
			delete(c.periodic, devID)
		}
	}

	// Start new tasks
	for devID, devCfg := range c.config.Devices {
		if !devCfg.Enable || devCfg.Strategy != "periodic" || time.Duration(devCfg.Interval) <= 0 {
			continue
		}

		if _, exists := c.periodic[devID]; !exists {
			item := &periodicItem{
				values: make(map[string]model.Value),
				ticker: time.NewTicker(time.Duration(devCfg.Interval)),
				stop:   make(chan struct{}),
			}
			c.periodic[devID] = item

			go c.runPeriodicTask(devID, item)
		}
	}
}

func (c *Client) runPeriodicTask(deviceID string, item *periodicItem) {
	for {
		select {
		case <-item.stop:
			return
		case <-c.stopChan:
			return
		case <-item.ticker.C:
			c.flushPeriodic(deviceID, item)
		}
	}
}

func (c *Client) flushPeriodic(deviceID string, item *periodicItem) {
	c.periodicMu.Lock()
	if len(item.values) == 0 {
		c.periodicMu.Unlock()
		return
	}

	// Construct payload
	payload := &AggregatedPayload{
		Timestamp: time.Now().UnixMilli(),
		Node:      deviceID,
		Group:     item.channelID,
		Values:    make(map[string]any),
		Errors:    make(map[string]any),
		Metas:     make(map[string]any),
	}

	for _, v := range item.values {
		payload.Values[v.PointID] = v.Value
	}
	c.periodicMu.Unlock()

	data, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Failed to marshal periodic value for MQTT: %v", err)
		return
	}

	if c.client == nil || !c.client.IsConnected() {
		return
	}

	token := c.client.Publish(c.config.Topic, 0, false, data)
	go func() {
		if token.Wait() && token.Error() != nil {
			log.Printf("Failed to publish to MQTT: %v", token.Error())
		}
	}()
}

// PublishRaw publishes raw data to a specific topic
func (c *Client) PublishRaw(topic string, payload []byte) error {
	if c.client == nil || !c.client.IsConnected() {
		return mqtt.ErrNotConnected
	}

	token := c.client.Publish(topic, 0, false, payload)
	if token.Wait() && token.Error() != nil {
		return token.Error()
	}
	return nil
}

func (c *Client) connectLoop() {
	c.setStatus(StatusReconnecting)

	opts := mqtt.NewClientOptions()
	opts.AddBroker(c.config.Broker)
	opts.SetClientID(c.config.ClientID)
	if c.config.Username != "" {
		opts.SetUsername(c.config.Username)
		opts.SetPassword(c.config.Password)
	}
	// Disable auto reconnect to control it manually
	opts.SetAutoReconnect(false)

	opts.SetOnConnectHandler(func(client mqtt.Client) {
		log.Printf("Connected to MQTT Broker: %s", c.config.Broker)
		c.setStatus(StatusConnected)
	})

	opts.SetConnectionLostHandler(func(client mqtt.Client, err error) {
		log.Printf("MQTT Connection Lost: %v", err)
		c.setStatus(StatusDisconnected)
		// Trigger reconnection
		go c.reconnectLogic()
	})

	c.client = mqtt.NewClient(opts)

	// Initial connection attempt
	if token := c.client.Connect(); token.Wait() && token.Error() != nil {
		log.Printf("Initial MQTT connection failed: %v", token.Error())
		c.setStatus(StatusDisconnected)
		go c.reconnectLogic()
	}
}

func (c *Client) reconnectLogic() {
	retryCount := 0

	for {
		select {
		case <-c.stopChan:
			return
		default:
		}

		c.setStatus(StatusReconnecting)

		token := c.client.Connect()
		if token.Wait() && token.Error() == nil {
			// Connected successfully
			return
		}

		retryCount++

		// Logic: 3s interval for 10 times, then 60s wait
		if retryCount <= 10 {
			time.Sleep(3 * time.Second)
		} else {
			c.setStatus(StatusError) // Failed after 10 retries
			time.Sleep(60 * time.Second)
			retryCount = 0 // Reset to try again
		}
	}
}

func (c *Client) Publish(v model.Value) {
	if c.client == nil || !c.client.IsConnected() {
		return
	}

	// Filter based on device config if configured
	if len(c.config.Devices) > 0 {
		devCfg, ok := c.config.Devices[v.DeviceID]
		if !ok || !devCfg.Enable {
			return
		}

		// Strategy: COV (Change of Value)
		if devCfg.Strategy == "cov" {
			key := v.DeviceID + ":" + v.PointID
			lastVal, loaded := c.lastValues.Load(key)
			if loaded && lastVal == v.Value {
				return
			}
			c.lastValues.Store(key, v.Value)
		} else if devCfg.Strategy == "periodic" && time.Duration(devCfg.Interval) > 0 {
			// Periodic with Interval: Cache value only
			c.periodicMu.Lock()
			if item, ok := c.periodic[v.DeviceID]; ok {
				item.channelID = v.ChannelID
				item.values[v.PointID] = v
			}
			c.periodicMu.Unlock()
			return // Don't publish immediately
		}
	}

	c.bufferMu.Lock()
	defer c.bufferMu.Unlock()

	item, ok := c.buffers[v.DeviceID]
	if !ok {
		payload := &AggregatedPayload{
			Timestamp: v.TS.UnixMilli(),
			Node:      v.DeviceID,  // Node maps to DeviceID
			Group:     v.ChannelID, // Group maps to ChannelID
			Values:    make(map[string]any),
			Errors:    make(map[string]any),
			Metas:     make(map[string]any),
		}
		item = &bufferItem{
			payload: payload,
		}
		// Start timer to flush (100ms delay to aggregate points)
		item.timer = time.AfterFunc(100*time.Millisecond, func() {
			c.flushDevice(v.DeviceID)
		})
		c.buffers[v.DeviceID] = item
	}

	// Add value to buffer
	item.payload.Values[v.PointID] = v.Value
	if v.Quality != "Good" {
		// Optionally record errors
		// item.payload.Errors[v.PointID] = v.Quality
	}
}

func (c *Client) flushDevice(deviceID string) {
	c.bufferMu.Lock()
	item, ok := c.buffers[deviceID]
	if !ok {
		c.bufferMu.Unlock()
		return
	}
	delete(c.buffers, deviceID)
	c.bufferMu.Unlock()

	data, err := json.Marshal(item.payload)
	if err != nil {
		log.Printf("Failed to marshal value for MQTT: %v", err)
		return
	}

	if c.client == nil || !c.client.IsConnected() {
		return
	}

	token := c.client.Publish(c.config.Topic, 0, false, data)
	go func() {
		if token.Wait() && token.Error() != nil {
			log.Printf("Failed to publish to MQTT: %v", token.Error())
		}
	}()
}

func (c *Client) Stop() {
	close(c.stopChan)
	if c.client != nil && c.client.IsConnected() {
		c.client.Disconnect(250)
	}
	c.setStatus(StatusDisconnected)
}
