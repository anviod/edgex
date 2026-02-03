package sparkplugb

import (
	"crypto/tls"
	"crypto/x509"
	"encoding/json"
	"fmt"
	"industrial-edge-gateway/internal/model"
	"log"
	"os"
	"sync"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

const (
	StatusDisconnected = 0
	StatusConnected    = 1
	StatusError        = 3
)

type Client struct {
	config   model.SparkplugBConfig
	client   mqtt.Client
	status   int
	statusMu sync.RWMutex
	stopChan chan struct{}
}

func NewClient(cfg model.SparkplugBConfig) *Client {
	return &Client{
		config:   cfg,
		stopChan: make(chan struct{}),
	}
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

func (c *Client) Start() error {
	if !c.config.Enable {
		return nil
	}

	opts := mqtt.NewClientOptions()
	broker := fmt.Sprintf("tcp://%s:%d", c.config.Broker, c.config.Port)
	if c.config.SSL {
		broker = fmt.Sprintf("ssl://%s:%d", c.config.Broker, c.config.Port)
		tlsConfig, err := c.createTLSConfig()
		if err != nil {
			return err
		}
		opts.SetTLSConfig(tlsConfig)
	}
	opts.AddBroker(broker)
	opts.SetClientID(c.config.ClientID)
	opts.SetUsername(c.config.Username)
	opts.SetPassword(c.config.Password)
	opts.SetCleanSession(true) // Sparkplug B usually requires CleanSession=true initially, but uses state management

	// Sparkplug B Last Will and Testament (NDEATH)
	// Topic: spBv1.0/group_id/NDEATH/node_id
	deathTopic := fmt.Sprintf("spBv1.0/%s/NDEATH/%s", c.config.GroupID, c.config.NodeID)
	// Payload: bdSeq (metric)
	deathPayload := c.createDeathPayload()
	opts.SetWill(deathTopic, string(deathPayload), 0, false)

	opts.SetOnConnectHandler(c.onConnect)
	opts.SetConnectionLostHandler(c.onConnectionLost)

	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		c.setStatus(StatusError)
		return token.Error()
	}

	c.client = client
	c.setStatus(StatusConnected)
	log.Printf("Sparkplug B Client connected to %s", broker)

	return nil
}

func (c *Client) Stop() {
	if c.client != nil && c.client.IsConnected() {
		// Publish NDEATH before disconnecting (optional, usually LWT handles it, but good practice for graceful shutdown)
		// Actually Sparkplug B spec says we should publish NDEATH on graceful shutdown?
		// "The Edge Node MUST publish a NDEATH message on the NDEATH topic... before disconnecting"
		deathTopic := fmt.Sprintf("spBv1.0/%s/NDEATH/%s", c.config.GroupID, c.config.NodeID)
		deathPayload := c.createDeathPayload()
		c.client.Publish(deathTopic, 0, false, deathPayload).Wait()

		c.client.Disconnect(250)
	}
	c.setStatus(StatusDisconnected)
	close(c.stopChan)
}

func (c *Client) UpdateConfig(cfg model.SparkplugBConfig) error {
	// Simple restart if config changed
	c.Stop()
	c.config = cfg
	c.stopChan = make(chan struct{})
	return c.Start()
}

func (c *Client) Publish(v model.Value) {
	if c.client == nil || !c.client.IsConnected() {
		return
	}

	// Check if device is enabled in Sparkplug B config
	// The config uses map[string]bool where Key is DeviceID
	if enabled, ok := c.config.Devices[v.DeviceID]; !ok || !enabled {
		return
	}

	// Topic: spBv1.0/group_id/DDATA/node_id/device_id
	// Note: DDATA is for Device Data. NDATA is for Node Data.
	// We assume values come from devices.
	topic := fmt.Sprintf("spBv1.0/%s/DDATA/%s/%s", c.config.GroupID, c.config.NodeID, v.DeviceID)

	// Payload construction
	payload, err := c.createDataPayload(v)
	if err != nil {
		log.Printf("Error creating Sparkplug B payload: %v", err)
		return
	}

	token := c.client.Publish(topic, 0, false, payload)
	if token.Wait() && token.Error() != nil {
		log.Printf("Error publishing to Sparkplug B: %v", token.Error())
	}
}

func (c *Client) onConnect(client mqtt.Client) {
	c.setStatus(StatusConnected)
	log.Println("Sparkplug B Connected")

	// Publish NBIRTH
	// Topic: spBv1.0/group_id/NBIRTH/node_id
	birthTopic := fmt.Sprintf("spBv1.0/%s/NBIRTH/%s", c.config.GroupID, c.config.NodeID)
	birthPayload := c.createBirthPayload()
	client.Publish(birthTopic, 0, false, birthPayload)
}

func (c *Client) onConnectionLost(client mqtt.Client, err error) {
	c.setStatus(StatusError)
	log.Printf("Sparkplug B Connection Lost: %v", err)
}

// Helpers for payload creation (MOCKED for now as we lack Protobuf generation)

func (c *Client) createDeathPayload() []byte {
	// Should contain bdSeq metric
	m := map[string]interface{}{
		"timestamp": time.Now().UnixMilli(),
		"metrics": []map[string]interface{}{
			{
				"name":  "bdSeq",
				"type":  "UInt64",
				"value": 0, // In real impl, this should increment
			},
		},
	}
	b, _ := json.Marshal(m)
	return b
}

func (c *Client) createBirthPayload() []byte {
	// Should contain node metrics, reboot, etc.
	m := map[string]interface{}{
		"timestamp": time.Now().UnixMilli(),
		"metrics": []map[string]interface{}{
			{
				"name":  "bdSeq",
				"type":  "UInt64",
				"value": 0,
			},
			{
				"name":  "Node Control/Rebirth",
				"type":  "Boolean",
				"value": false,
			},
		},
	}
	b, _ := json.Marshal(m)
	return b
}

func (c *Client) createDataPayload(v model.Value) ([]byte, error) {
	// DDATA payload
	m := map[string]interface{}{
		"timestamp": v.TS.UnixMilli(),
		"metrics": []map[string]interface{}{
			{
				"name":  v.PointID,
				"type":  "String", // Simplified type mapping
				"value": v.Value,
			},
			// Static data points as requested
			{
				"name":  "location",
				"type":  "String",
				"value": "sh",
			},
			{
				"name":  "number",
				"type":  "String",
				"value": "12345613",
			},
		},
	}
	return json.Marshal(m)
}

func (c *Client) createTLSConfig() (*tls.Config, error) {
	// Create tls.Config with CA, Cert, Key if provided
	tlsConfig := &tls.Config{
		InsecureSkipVerify: false, // Should be configurable
	}

	if c.config.CACert != "" {
		caCert, err := os.ReadFile(c.config.CACert)
		if err != nil {
			return nil, fmt.Errorf("failed to read CA cert: %v", err)
		}
		caCertPool := x509.NewCertPool()
		caCertPool.AppendCertsFromPEM(caCert)
		tlsConfig.RootCAs = caCertPool
	}

	if c.config.ClientCert != "" && c.config.ClientKey != "" {
		cert, err := tls.LoadX509KeyPair(c.config.ClientCert, c.config.ClientKey)
		if err != nil {
			return nil, fmt.Errorf("failed to load client keypair: %v", err)
		}
		tlsConfig.Certificates = []tls.Certificate{cert}
	}

	return tlsConfig, nil
}
