package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"math"
	"net/http"
	"strings"
	"time"
)

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

type PointData struct {
	ID        string      `json:"id"`
	Name      string      `json:"name"`
	Address   string      `json:"address"`
	DataType  string      `json:"datatype"`
	Value     interface{} `json:"value"`
	Quality   string      `json:"quality"`
	ReadWrite string      `json:"readwrite"`
}

type WriteRequest struct {
	ChannelID string      `json:"channel_id"`
	DeviceID  string      `json:"device_id"`
	PointID   string      `json:"point_id"`
	Value     interface{} `json:"value"`
}

func testValueFor(dt string) (interface{}, bool) {
	dt = strings.ToLower(dt)
	switch {
	case dt == "bool" || dt == "boolean":
		return true, true
	case strings.Contains(dt, "uint16") || dt == "unsignedshort" || dt == "word":
		return 10, true
	case strings.Contains(dt, "int16") || dt == "short":
		return 10, true
	case strings.Contains(dt, "uint32") || dt == "unsignedint" || dt == "dword":
		return 10, true
	case strings.Contains(dt, "int32") || dt == "int":
		return 10, true
	case strings.Contains(dt, "float32") || dt == "float":
		return 12.34, true
	case strings.Contains(dt, "float64") || dt == "double":
		return 12.34, true
	case dt == "string":
		return "hello", true
	case dt == "byte" || dt == "uint8":
		return 1, true
	case dt == "sbyte" || dt == "int8":
		return -1, true
	default:
		return nil, false
	}
}

func approxEqual(a, b float64) bool {
	return math.Abs(a-b) < 1e-3
}

func main() {
	// Wait for server to start
	fmt.Println("Waiting 5s for server to stabilize...")
	time.Sleep(5 * time.Second)

	client := &http.Client{Timeout: 60 * time.Second}

	// Step 1: Get Nonce
	base := "http://127.0.0.1:8082/api"
	nonceUrl := base + "/auth/nonce"
	fmt.Printf("Getting nonce from %s...\n", nonceUrl)
	nonceResp, err := client.Get(nonceUrl)
	if err != nil {
		fmt.Printf("Get nonce failed: %v\n", err)
		return
	}
	defer nonceResp.Body.Close()

	var nonceRes NonceResponse
	if err := json.NewDecoder(nonceResp.Body).Decode(&nonceRes); err != nil {
		fmt.Printf("Failed to decode nonce response: %v\n", err)
		return
	}
	nonce := nonceRes.Data.Nonce
	fmt.Printf("Got nonce: %s\n", nonce)

	// Step 2: Login
	password := "passwd@123"
	hash := sha256.Sum256([]byte(password + nonce))
	hashedPassword := hex.EncodeToString(hash[:])

	loginUrl := base + "/auth/login"
	loginPayload := LoginRequest{
		LoginFlag: true,
	}
	loginPayload.Data.Username = "admin"
	loginPayload.Data.Password = hashedPassword
	loginPayload.Data.Nonce = nonce

	loginJson, _ := json.Marshal(loginPayload)

	fmt.Printf("Logging in to %s...\n", loginUrl)
	loginReq, _ := http.NewRequest("POST", loginUrl, bytes.NewBuffer(loginJson))
	loginReq.Header.Set("Content-Type", "application/json")

	loginResp, err := client.Do(loginReq)
	if err != nil {
		fmt.Printf("Login failed: %v\n", err)
		return
	}
	defer loginResp.Body.Close()

	if loginResp.StatusCode != 200 {
		body, _ := io.ReadAll(loginResp.Body)
		fmt.Printf("Login failed with status %s: %s\n", loginResp.Status, string(body))
		return
	}

	var loginRes LoginResponse
	if err := json.NewDecoder(loginResp.Body).Decode(&loginRes); err != nil {
		fmt.Printf("Failed to decode login response: %v\n", err)
		return
	}

	if loginRes.Code != "0" {
		fmt.Printf("Login failed with code %s: %s\n", loginRes.Code, loginRes.Msg)
		return
	}

	token := loginRes.Data.Token
	fmt.Printf("Login successful. Token: %s...\n", token[:10])

	channelID := "opcua-test-1"
	deviceID := "opcua-dev-1"

	// Step 3: Fetch device points
	pointsURL := fmt.Sprintf("%s/channels/%s/devices/%s/points", base, channelID, deviceID)
	fmt.Printf("Fetching points from %s\n", pointsURL)
	req, _ := http.NewRequest("GET", pointsURL, nil)
	req.Header.Set("Authorization", "Bearer "+token)
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("Fetch points error: %v\n", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		body, _ := io.ReadAll(resp.Body)
		fmt.Printf("Fetch points failed: %s\n%s\n", resp.Status, string(body))
		return
	}

	var points []PointData
	if err := json.NewDecoder(resp.Body).Decode(&points); err != nil {
		fmt.Printf("Decode points failed: %v\n", err)
		return
	}
	fmt.Printf("Found %d points. Starting write tests on RW points...\n", len(points))

	writeURL := base + "/write"

	success := 0
	fail := 0

	for _, p := range points {
		if strings.ToUpper(p.ReadWrite) != "RW" {
			continue
		}
		val, ok := testValueFor(p.DataType)
		if !ok {
			fmt.Printf("Skip %s (%s): unsupported datatype %s\n", p.ID, p.Name, p.DataType)
			continue
		}
		payload := WriteRequest{
			ChannelID: channelID,
			DeviceID:  deviceID,
			PointID:   p.ID,
			Value:     val,
		}
		jsonData, _ := json.Marshal(payload)
		req, _ := http.NewRequest("POST", writeURL, bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+token)

		resp, err := client.Do(req)
		if err != nil {
			fmt.Printf("[WRITE][%s] error: %v\n", p.ID, err)
			fail++
			continue
		}
		body, _ := io.ReadAll(resp.Body)
		resp.Body.Close()

		if resp.StatusCode != 200 {
			fmt.Printf("[WRITE][%s] failed: %s | %s\n", p.ID, resp.Status, string(body))
			fail++
			continue
		}
		fmt.Printf("[WRITE][%s] success, verifying read...\n", p.ID)

		// Wait for subscription update
		time.Sleep(1 * time.Second)

		// Read back points and locate this point
		reqGet, _ := http.NewRequest("GET", pointsURL, nil)
		reqGet.Header.Set("Authorization", "Bearer "+token)
		respGet, err := client.Do(reqGet)
		if err != nil {
			fmt.Printf("[READ][%s] error: %v\n", p.ID, err)
			fail++
			continue
		}
		if respGet.StatusCode != 200 {
			body2, _ := io.ReadAll(respGet.Body)
			respGet.Body.Close()
			fmt.Printf("[READ][%s] failed: %s | %s\n", p.ID, respGet.Status, string(body2))
			fail++
			continue
		}
		var points2 []PointData
		if err := json.NewDecoder(respGet.Body).Decode(&points2); err != nil {
			respGet.Body.Close()
			fmt.Printf("[READ][%s] decode error: %v\n", p.ID, err)
			fail++
			continue
		}
		respGet.Body.Close()

		// Find point and compare value
		found := false
		match := false
		for _, p2 := range points2 {
			if p2.ID == p.ID {
				found = true
				switch v := p2.Value.(type) {
				case float64:
					switch exp := payload.Value.(type) {
					case float64:
						match = approxEqual(v, exp)
					case int:
						match = approxEqual(v, float64(exp))
					case int32:
						match = approxEqual(v, float64(exp))
					case int64:
						match = approxEqual(v, float64(exp))
					case float32:
						match = approxEqual(v, float64(exp))
					default:
						match = false
					}
				case bool:
					if exp, ok := payload.Value.(bool); ok {
						match = v == exp
					}
				case string:
					if exp, ok := payload.Value.(string); ok {
						match = v == exp
					}
				default:
					// Fallback: string compare
					match = fmt.Sprintf("%v", p2.Value) == fmt.Sprintf("%v", payload.Value)
				}
				break
			}
		}

		if !found {
			fmt.Printf("[VERIFY][%s] point not found in readback\n", p.ID)
			fail++
			continue
		}
		if match {
			fmt.Printf("[VERIFY][%s] OK\n", p.ID)
			success++
		} else {
			fmt.Printf("[VERIFY][%s] MISMATCH. expected=%v got=%v\n", p.ID, payload.Value, p.Value)
			fail++
		}
	}

	fmt.Printf("Write verification complete. Success=%d Fail=%d\n", success, fail)
}
