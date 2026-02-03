package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

const baseURL = "http://localhost:8082/api"

type NonceResponse struct {
	Code string `json:"code"`
	Data struct {
		Nonce string `json:"nonce"`
	} `json:"data"`
}

type LoginRequest struct {
	LoginFlag bool `json:"loginFlag"`
	Data      struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Nonce    string `json:"nonce"`
	} `json:"data"`
}

type LoginResponse struct {
	Code string `json:"code"`
	Msg  string `json:"msg"`
	Data struct {
		Token string `json:"token"`
	} `json:"data"`
}

type Channel struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Protocol string `json:"protocol"`
}

type ScanResult struct {
	DeviceID   int    `json:"device_id"`
	IP         string `json:"ip"`
	Port       int    `json:"port"`
	VendorName string `json:"vendor_name"`
	ModelName  string `json:"model_name"`
	Status     string `json:"status"`
}

type DeviceConfig struct {
	DeviceID      int    `json:"device_id"`
	IP            string `json:"ip"`
	Port          int    `json:"port"`
	VendorName    string `json:"vendor_name"`
	ModelName     string `json:"model_name"`
	NetworkNumber int    `json:"network_number"`
	VendorID      int    `json:"vendor_id"`
}

type AddDevicePayload struct {
	Name     string        `json:"name"`
	Enable   bool          `json:"enable"`
	Interval string        `json:"interval"`
	Config   DeviceConfig  `json:"config"`
	Points   []interface{} `json:"points"`
}

func main() {
	// 1. Login
	token, err := login("admin", "passwd@123")
	if err != nil {
		log.Fatalf("Login failed: %v", err)
	}
	log.Println("Login successful")

	// 2. Get Channels
	channels, err := getChannels(token)
	if err != nil {
		log.Fatalf("Get channels failed: %v", err)
	}

	var bacnetChanID string
	// Prioritize "bac-test-1"
	for _, ch := range channels {
		if ch.ID == "bac-test-1" {
			bacnetChanID = ch.ID
			break
		}
	}
	// Fallback to first bacnet-ip channel
	if bacnetChanID == "" {
		for _, ch := range channels {
			if ch.Protocol == "bacnet-ip" {
				bacnetChanID = ch.ID
				break
			}
		}
	}

	if bacnetChanID == "" {
		log.Fatal("No BACnet channel found")
	}
	log.Printf("Found BACnet channel: %s", bacnetChanID)

	// 3. Scan Devices
	log.Println("Starting scan...")
	devices, err := scanDevices(token, bacnetChanID)
	if err != nil {
		log.Fatalf("Scan failed: %v", err)
	}
	log.Printf("Scan found %d devices", len(devices))

	if len(devices) == 0 {
		log.Fatal("No devices found during scan")
	}

	// 4. Add Device (Register the first one)
	targetDev := devices[0]
	// Use 2228318 if present, as requested
	for _, d := range devices {
		if d.DeviceID == 2228318 {
			targetDev = d
			break
		}
	}

	log.Printf("Registering device: %d (%s)", targetDev.DeviceID, targetDev.IP)
	err = addDevice(token, bacnetChanID, targetDev)
	if err != nil {
		log.Fatalf("Add device failed: %v", err)
	}
	log.Println("Device added successfully")

	// 5. Verify Data Collection (Wait and check status)
	// Since we don't have points, we can't check points.
	// But we can check if the device is listed in /channels/:id/devices and status is online.
	time.Sleep(2 * time.Second)

	status, err := getDeviceStatus(token, bacnetChanID, targetDev.DeviceID)
	if err != nil {
		log.Printf("Failed to get device status: %v", err)
	} else {
		log.Printf("Device Status: %s", status)
	}
}

func getNonce() (string, error) {
	resp, err := http.Get(baseURL + "/auth/nonce")
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var res NonceResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return "", err
	}
	return res.Data.Nonce, nil
}

func login(username, password string) (string, error) {
	nonce, err := getNonce()
	if err != nil {
		return "", fmt.Errorf("get nonce failed: %v", err)
	}

	hash := sha256.Sum256([]byte(password + nonce))
	passHex := hex.EncodeToString(hash[:])

	reqPayload := LoginRequest{
		LoginFlag: true,
	}
	reqPayload.Data.Username = username
	reqPayload.Data.Password = passHex
	reqPayload.Data.Nonce = nonce

	data, _ := json.Marshal(reqPayload)

	resp, err := http.Post(baseURL+"/auth/login", "application/json", bytes.NewBuffer(data))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("login status %d: %s", resp.StatusCode, string(body))
	}

	var res LoginResponse
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		return "", err
	}

	if res.Code != "0" {
		return "", fmt.Errorf("login error: %s", res.Msg)
	}

	return res.Data.Token, nil
}

func getChannels(token string) ([]Channel, error) {
	req, _ := http.NewRequest("GET", baseURL+"/channels", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("status %d", resp.StatusCode)
	}

	var channels []Channel
	if err := json.NewDecoder(resp.Body).Decode(&channels); err != nil {
		return nil, err
	}
	return channels, nil
}

func scanDevices(token, channelID string) ([]ScanResult, error) {
	reqBody := []byte(`{"low_limit": 0, "high_limit": 4194303}`)
	req, _ := http.NewRequest("POST", baseURL+"/channels/"+channelID+"/scan", bytes.NewBuffer(reqBody))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	log.Printf("Scanning channel %s...", channelID)
	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	log.Printf("Scan response status: %d", resp.StatusCode)
	log.Printf("Scan response body: %s", string(body))

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("scan failed: %s", string(body))
	}

	var results []ScanResult
	if err := json.Unmarshal(body, &results); err != nil {
		return nil, err
	}
	return results, nil
}

func addDevice(token, channelID string, dev ScanResult) error {
	payload := AddDevicePayload{
		Name:     fmt.Sprintf("%s_%d", dev.ModelName, dev.DeviceID),
		Enable:   true,
		Interval: "5s",
		Config: DeviceConfig{
			DeviceID:      dev.DeviceID,
			IP:            dev.IP,
			Port:          dev.Port,
			VendorName:    dev.VendorName,
			ModelName:     dev.ModelName,
			NetworkNumber: 0,
			VendorID:      0,
		},
		Points: []interface{}{},
	}

	data, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", baseURL+"/channels/"+channelID+"/devices", bytes.NewBuffer(data))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 && resp.StatusCode != 201 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("add device failed: %s", string(body))
	}

	return nil
}

type Device struct {
	ID     string `json:"id"`
	Config struct {
		DeviceID int `json:"device_id"`
	} `json:"config"`
	State int `json:"state"` // 0: Online, 1: Unstable, 2: Offline
}

func getDeviceStatus(token, channelID string, targetDeviceID int) (string, error) {
	req, _ := http.NewRequest("GET", baseURL+"/channels/"+channelID+"/devices", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("status %d", resp.StatusCode)
	}

	var devices []Device
	if err := json.NewDecoder(resp.Body).Decode(&devices); err != nil {
		return "", err
	}

	for _, d := range devices {
		if d.Config.DeviceID == targetDeviceID {
			switch d.State {
			case 0:
				return "Online", nil
			case 1:
				return "Unstable", nil
			case 2:
				return "Offline", nil
			default:
				return fmt.Sprintf("Unknown(%d)", d.State), nil
			}
		}
	}

	return "Not Found", nil
}
