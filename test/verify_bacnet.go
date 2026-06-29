package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

const (
	baseURL  = "http://127.0.0.1:8082/api"
	username = "admin"
	password = "passwd@123"
)

type CommonResponse struct {
	Code string      `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}

type LoginResponse struct {
	Code string `json:"code"`
	Msg  string `json:"msg"`
	Data struct {
		Token string `json:"token"`
	} `json:"data"`
}

type Device struct {
	ID           string                 `json:"id"`
	Name         string                 `json:"name"`
	Enable       bool                   `json:"enable"`
	State        int                    `json:"state"`
	QualityScore int                    `json:"quality_score"`
	NodeRuntime  map[string]interface{} `json:"node_runtime"`
}

type Point struct {
	ID      string      `json:"id"`
	Value   interface{} `json:"value"`
	Quality string      `json:"quality"`
}

var token string

func main() {
	fmt.Println("Starting BACnet Verification Test...")

	// 1. Login
	if err := login(); err != nil {
		fmt.Printf("Login failed: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("Login successful.")

	// 2. Get Channels
	channelID := "jxy3kvpohmetzct0"
	fmt.Printf("Verifying Channel %s...\n", channelID)

	fmt.Println("Waiting 10 seconds for driver to poll devices...")
	time.Sleep(10 * time.Second)

	// 3. Get Devices
	devices, err := getDevices(channelID)
	if err != nil {
		fmt.Printf("Failed to get devices: %v\n", err)
		os.Exit(1)
	}

	targetDevices := []string{"bacnet-18", "bacnet-16", "bacnet-17", "Room_FC_2014_19"}
	allGood := true

	fmt.Printf("\n%-20s %-10s %-10s %-10s\n", "DeviceID", "Enable", "State", "Score")
	fmt.Println("---------------------------------------------------------------")

	for _, targetID := range targetDevices {
		found := false
		for _, dev := range devices {
			if dev.ID == targetID {
				found = true
				score := dev.QualityScore
				if score == 0 && dev.NodeRuntime != nil {
					if s, ok := dev.NodeRuntime["quality_score"].(float64); ok {
						score = int(s)
					}
				}

				fmt.Printf("%-20s %-10v %-10d %-10d\n", dev.ID, dev.Enable, dev.State, score)

				if !dev.Enable {
					fmt.Printf("[FAIL] Device %s is disabled!\n", dev.ID)
					allGood = false
				}

				// Check points
				points, err := getPoints(channelID, dev.ID)
				if err != nil {
					fmt.Printf("[FAIL] Failed to get points for %s: %v\n", dev.ID, err)
					allGood = false
				} else {
					validCount := 0
					for _, p := range points {
						if p.Value != nil {
							validCount++
						}
					}
					fmt.Printf("    Points: %d total, %d with values\n", len(points), validCount)
					if validCount == 0 {
						fmt.Printf("[FAIL] No valid point values for %s\n", dev.ID)
						allGood = false
					} else {
						fmt.Printf("    Sample Point: %s = %v (Quality: %s)\n", points[0].ID, points[0].Value, points[0].Quality)
					}
				}
				break
			}
		}
		if !found {
			fmt.Printf("[FAIL] Device %s not found in channel!\n", targetID)
			allGood = false
		}
	}

	fmt.Println("\n---------------------------------------------------------------")
	if allGood {
		fmt.Println("SUCCESS: All target devices found and responding.")
	} else {
		fmt.Println("FAILURE: Some devices failed verification.")
	}
}

func login() error {
	// 1. Get Nonce
	nonceURL := baseURL + "/auth/nonce"
	resp, err := http.Get(nonceURL)
	if err != nil {
		return fmt.Errorf("failed to get nonce: %v", err)
	}
	defer resp.Body.Close()

	var nonceRes struct {
		Code string `json:"code"`
		Data struct {
			Nonce string `json:"nonce"`
		} `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&nonceRes); err != nil {
		return err
	}
	if nonceRes.Code != "0" {
		return fmt.Errorf("nonce error: %v", nonceRes)
	}
	nonce := nonceRes.Data.Nonce

	// 2. Hash Password
	hash := sha256.Sum256([]byte(password + nonce))
	hashedPassword := hex.EncodeToString(hash[:])

	// 3. Login
	loginURL := baseURL + "/auth/login"
	body := map[string]interface{}{
		"loginFlag": true,
		"loginType": "local",
		"data": map[string]string{
			"username": username,
			"password": hashedPassword,
			"nonce":    nonce,
		},
	}
	jsonBody, _ := json.Marshal(body)
	req, _ := http.NewRequest("POST", loginURL, bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err = client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	var loginRes LoginResponse
	if err := json.NewDecoder(resp.Body).Decode(&loginRes); err != nil {
		return err
	}

	if loginRes.Code != "0" {
		return fmt.Errorf("login failed: %s", loginRes.Msg)
	}

	token = loginRes.Data.Token
	return nil
}

func getDevices(channelID string) ([]Device, error) {
	url := fmt.Sprintf("%s/channels/%s/devices", baseURL, channelID)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("token", token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		b, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("status %d: %s", resp.StatusCode, string(b))
	}

	var devices []Device
	if err := json.NewDecoder(resp.Body).Decode(&devices); err != nil {
		return nil, err
	}
	return devices, nil
}

func getPoints(channelID, deviceID string) ([]Point, error) {
	url := fmt.Sprintf("%s/channels/%s/devices/%s/points", baseURL, channelID, deviceID)
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("token", token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("status %d", resp.StatusCode)
	}

	var points []Point
	if err := json.NewDecoder(resp.Body).Decode(&points); err != nil {
		return nil, err
	}
	return points, nil
}
