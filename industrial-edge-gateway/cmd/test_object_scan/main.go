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

const baseURL = "http://127.0.0.1:8082/api"

// --- Auth Utils ---

func getNonce() (string, error) {
	resp, err := http.Get(baseURL + "/auth/nonce")
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("get nonce failed: %d", resp.StatusCode)
	}
	var result struct {
		Code string `json:"code"`
		Data struct {
			Nonce string `json:"nonce"`
		} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return "", err
	}
	return result.Data.Nonce, nil
}

func login(username, password string) (string, error) {
	nonce, err := getNonce()
	if err != nil {
		return "", fmt.Errorf("failed to get nonce: %v", err)
	}
	hash := sha256.Sum256([]byte(password + nonce))
	hashedPassword := hex.EncodeToString(hash[:])

	reqBody := map[string]interface{}{
		"loginFlag": true,
		"data": map[string]string{
			"username": username,
			"password": hashedPassword,
			"nonce":    nonce,
		},
	}
	jsonBody, _ := json.Marshal(reqBody)
	resp, err := http.Post(baseURL+"/auth/login", "application/json", bytes.NewBuffer(jsonBody))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("login failed status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var result struct {
		Code string `json:"code"`
		Msg  string `json:"msg"`
		Data struct {
			Token string `json:"token"`
		} `json:"data"`
	}
	if err := json.Unmarshal(bodyBytes, &result); err != nil {
		return "", err
	}
	if result.Code != "0" {
		return "", fmt.Errorf("login failed: %s", result.Msg)
	}
	return result.Data.Token, nil
}

// --- API Utils ---

func getChannels(token string) ([]map[string]interface{}, error) {
	req, _ := http.NewRequest("GET", baseURL+"/channels", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result []map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	return result, nil
}

func getDevices(token, channelID string) ([]map[string]interface{}, error) {
	req, _ := http.NewRequest("GET", fmt.Sprintf("%s/channels/%s/devices", baseURL, channelID), nil)
	req.Header.Set("Authorization", "Bearer "+token)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result []map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	return result, nil
}

func scanObjects(token, channelID string, deviceID int) ([]interface{}, error) {
	url := fmt.Sprintf("%s/channels/%s/scan", baseURL, channelID)

	reqBody := map[string]interface{}{
		"device_id": deviceID,
	}
	jsonBody, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonBody))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	bodyBytes, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("scan failed status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var result []interface{}
	if err := json.Unmarshal(bodyBytes, &result); err != nil {
		return nil, fmt.Errorf("failed to unmarshal scan result: %v", err)
	}
	return result, nil
}

func main() {
	token, err := login("admin", "passwd@123")
	if err != nil {
		log.Fatalf("Login failed: %v", err)
	}
	log.Println("Login successful")

	channels, err := getChannels(token)
	if err != nil {
		log.Fatalf("Failed to get channels: %v", err)
	}

	var bacnetChannelID string
	for _, ch := range channels {
		if protocol, ok := ch["protocol"].(string); ok && protocol == "bacnet-ip" {
			bacnetChannelID = ch["id"].(string)
			break
		}
	}
	if bacnetChannelID == "" {
		log.Fatal("No BACnet channel found")
	}
	log.Printf("Found BACnet Channel: %s", bacnetChannelID)

	devices, err := getDevices(token, bacnetChannelID)
	if err != nil {
		log.Fatalf("Failed to get devices: %v", err)
	}
	if len(devices) == 0 {
		log.Fatal("No devices found in BACnet channel. Please add a device first.")
	}

	// Use the first device
	log.Printf("Found %d devices in BACnet channel", len(devices))

	targetDeviceID := 2228316 // Target the existing device
	var targetDev map[string]interface{}

	for _, dev := range devices {
		config, ok := dev["config"].(map[string]interface{})
		if !ok {
			continue
		}
		devIDFloat, ok := config["device_id"].(float64)
		if !ok {
			continue
		}
		id := int(devIDFloat)
		log.Printf("Found Device: %s (ID: %d)", dev["name"], id)

		if id == targetDeviceID {
			targetDev = dev
		}
	}

	if targetDev == nil {
		log.Printf("Target device %d not found in config, using first device", targetDeviceID)
		if len(devices) > 0 {
			targetDev = devices[0]
		} else {
			log.Fatal("No devices available")
		}
	}

	config, _ := targetDev["config"].(map[string]interface{})
	devID := int(config["device_id"].(float64))
	log.Printf("Scanning Device ID: %d", devID)

	// Trigger Scan
	log.Println("Triggering Object Scan...")
	results, err := scanObjects(token, bacnetChannelID, devID)
	if err != nil {
		log.Fatalf("Scan failed: %v", err)
	}

	log.Printf("Scan Result: Found %d objects", len(results))
	for i, obj := range results {
		objMap, _ := obj.(map[string]interface{})
		fmt.Printf("[%d] %s:%v Status: %s\n", i, objMap["type"], objMap["instance"], objMap["diff_status"])
	}
}
