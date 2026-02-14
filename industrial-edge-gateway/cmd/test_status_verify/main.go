package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const (
	BaseURL  = "http://127.0.0.1:8083" // Assuming 8083, will adjust if needed
	Username = "admin"
	Password = "passwd@123"
)

func main() {
	// Wait for server to start
	fmt.Println("Waiting for server to start...")
	time.Sleep(5 * time.Second)

	client := &http.Client{Timeout: 5 * time.Second}

	// 1. Get Nonce
	resp, err := client.Get(BaseURL + "/api/auth/nonce")
	if err != nil {
		fmt.Printf("Failed to get nonce: %v\n", err)
		return
	}
	defer resp.Body.Close()
	var nonceResp struct {
		Data struct {
			Nonce string `json:"nonce"`
		} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&nonceResp); err != nil {
		fmt.Printf("Failed to decode nonce: %v\n", err)
		return
	}

	// 2. Hash Password
	hash := sha256.Sum256([]byte(Password + nonceResp.Data.Nonce))
	hashedPwd := hex.EncodeToString(hash[:])

	// 3. Login
	loginReq := struct {
		LoginFlag bool `json:"loginFlag"`
		Data      struct {
			Username string `json:"username"`
			Password string `json:"password"`
			Nonce    string `json:"nonce"`
		} `json:"data"`
	}{
		LoginFlag: true,
	}
	loginReq.Data.Username = Username
	loginReq.Data.Password = hashedPwd
	loginReq.Data.Nonce = nonceResp.Data.Nonce

	jsonData, _ := json.Marshal(loginReq)
	resp, err = client.Post(BaseURL+"/api/auth/login", "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Printf("Failed to login: %v\n", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		fmt.Printf("Login failed: %s\n", string(body))
		return
	}

	body, _ := io.ReadAll(resp.Body)
	// Re-create reader for decoder
	resp.Body = io.NopCloser(bytes.NewBuffer(body))

	fmt.Printf("Login response: %s\n", string(body))

	var loginResp struct {
		Code string `json:"code"`
		Msg  string `json:"msg"`
		Data struct {
			Token string `json:"token"`
		} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&loginResp); err != nil {
		fmt.Printf("Failed to decode login response: %v\n", err)
		return
	}
	if loginResp.Code != "0" {
		fmt.Printf("Login failed with code %s: %s\n", loginResp.Code, loginResp.Msg)
		return
	}
	token := loginResp.Data.Token
	fmt.Println("Login successful, token received.")

	// 4. Verify /api/channels
	fmt.Println("4. Verifying /api/channels...")
	req, _ := http.NewRequest("GET", BaseURL+"/api/channels", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err = client.Do(req)
	if err != nil {
		fmt.Printf("Get channels failed: %v\n", err)
		return
	}
	defer resp.Body.Close()

	var channels []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&channels); err != nil {
		fmt.Printf("Decode channels failed: %v\n", err)
		return
	}

	var targetChannelID string
	found := false
	for i, ch := range channels {
		name, _ := ch["name"].(string)
		state, _ := ch["status"].(float64) // JSON numbers are floats
		fmt.Printf("[%d] Channel '%s' status: %v (ID: %s)\n", i, name, state, ch["id"])
		if name == "Modbus TCP Channel 1" {
			targetChannelID, _ = ch["id"].(string)
			found = true
			statusDesc := getStatusDesc(int(state))
			fmt.Printf("=> TARGET FOUND: Status is %s (%v). Expecting Fair/Good/Excellent (NOT Offline/4).\n", statusDesc, state)
		}
	}

	if !found {
		fmt.Println("Error: 'Modbus TCP Channel 1' not found!")
		return
	}

	// 5. Verify /api/dashboard/summary
	fmt.Println("\n5. Verifying /api/dashboard/summary...")
	req, _ = http.NewRequest("GET", BaseURL+"/api/dashboard/summary", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err = client.Do(req)
	if err != nil {
		fmt.Printf("Get dashboard summary failed: %v\n", err)
		return
	}
	defer resp.Body.Close()

	var summary struct {
		Channels []map[string]interface{} `json:"channels"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&summary); err != nil {
		fmt.Printf("Decode dashboard summary failed: %v\n", err)
		return
	}

	foundSummary := false
	for _, ch := range summary.Channels {
		name, _ := ch["name"].(string)
		if name == "Modbus TCP Channel 1" {
			state, _ := ch["status"].(float64)
			statusDesc := getStatusDesc(int(state))
			fmt.Printf("=> DASHBOARD SUMMARY: Channel '%s' status is %s (%v).\n", name, statusDesc, state)
			foundSummary = true
		}
	}
	if !foundSummary {
		fmt.Println("Error: 'Modbus TCP Channel 1' not found in dashboard summary!")
	}

	// 6. Verify /api/channels/:id/devices
	fmt.Printf("\n6. Verifying devices for channel %s...\n", targetChannelID)
	req, _ = http.NewRequest("GET", fmt.Sprintf("%s/api/channels/%s/devices", BaseURL, targetChannelID), nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err = client.Do(req)
	if err != nil {
		fmt.Printf("Get devices failed: %v\n", err)
		return
	}
	defer resp.Body.Close()

	var devices []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&devices); err != nil {
		fmt.Printf("Decode devices failed: %v\n", err)
		return
	}

	onlineCount := 0
	totalCount := 0
	for _, dev := range devices {
		name, _ := dev["name"].(string)
		status, _ := dev["status"].(float64) // 0=Online, 1=Unstable, 2=Offline, 3=Quarantine

		statusStr := "Unknown"
		switch int(status) {
		case 0:
			statusStr = "Online"
		case 1:
			statusStr = "Unstable"
		case 2:
			statusStr = "Offline"
		case 3:
			statusStr = "Quarantine"
		}

		fmt.Printf("Device '%s': %s (%v)\n", name, statusStr, status)
		totalCount++
		if int(status) == 0 {
			onlineCount++
		}
	}

	fmt.Printf("Online Ratio: %d/%d\n", onlineCount, totalCount)
}

func getStatusDesc(status int) string {
	switch status {
	case 0:
		return "Excellent"
	case 1:
		return "Good"
	case 2:
		return "Fair"
	case 3:
		return "Poor"
	case 4:
		return "Offline"
	default:
		return fmt.Sprintf("Unknown(%d)", status)
	}
}
