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

type LoginRequest struct {
	LoginFlag bool `json:"loginFlag"`
	Data      struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Nonce    string `json:"nonce"`
	} `json:"data"`
}

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
	// 1. Get Nonce
	nonce, err := getNonce()
	if err != nil {
		return "", fmt.Errorf("failed to get nonce: %v", err)
	}

	// 2. Hash Password: sha256(password + nonce)
	hash := sha256.Sum256([]byte(password + nonce))
	hashedPassword := hex.EncodeToString(hash[:])

	// 3. Login
	reqBody := LoginRequest{
		LoginFlag: true,
	}
	reqBody.Data.Username = username
	reqBody.Data.Password = hashedPassword
	reqBody.Data.Nonce = nonce

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

func getChannels(token string) ([]map[string]interface{}, error) {
	req, _ := http.NewRequest("GET", baseURL+"/channels", nil)
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("get channels failed: %d", resp.StatusCode)
	}

	var result []map[string]interface {
		// The API returns the array directly or wrapped?
		// Usually /api/channels returns []Channel
	}
	// Let's assume it returns standard list
	bodyBytes, _ := io.ReadAll(resp.Body)
	if err := json.Unmarshal(bodyBytes, &result); err != nil {
		return nil, err
	}
	return result, nil
}

func scanChannel(token, channelID string) ([]interface{}, error) {
	url := fmt.Sprintf("%s/channels/%s/scan", baseURL, channelID)
	req, _ := http.NewRequest("POST", url, nil)
	req.Header.Set("Authorization", "Bearer "+token)

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
	// 1. Login
	token, err := login("admin", "passwd@123")
	if err != nil {
		log.Fatalf("Login failed: %v", err)
	}
	log.Println("Login successful")

	if token == "" {
		log.Fatal("Login returned empty token")
	}

	// 2. Get Channels to find BACnet channel ID
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

	// 3. Trigger Scan
	log.Println("Triggering Scan...")
	devices, err := scanChannel(token, bacnetChannelID)
	if err != nil {
		log.Fatalf("Scan failed: %v", err)
	}

	log.Printf("Scan Result: Found %d devices", len(devices))
	for _, dev := range devices {
		jsonBytes, _ := json.MarshalIndent(dev, "", "  ")
		fmt.Println(string(jsonBytes))
	}
}
