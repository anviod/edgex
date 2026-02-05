import urllib.request
import urllib.parse
import urllib.error
import json
import hashlib
import time

BASE_URL = "http://localhost:8082/api"
USERNAME = "admin"
PASSWORD = "passwd@123"

class Session:
    def __init__(self):
        self.headers = {
            "Content-Type": "application/json"
        }
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor())

    def request(self, method, url, data=None):
        try:
            if data:
                data_bytes = json.dumps(data).encode('utf-8')
            else:
                data_bytes = None
            
            req = urllib.request.Request(url, data=data_bytes, headers=self.headers, method=method)
            with self.opener.open(req) as resp:
                status = resp.status
                body = resp.read().decode('utf-8')
                return status, body
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode('utf-8')
        except Exception as e:
            print(f"Request error: {e}")
            return 0, str(e)

    def get(self, url):
        return self.request("GET", url)

    def post(self, url, data=None):
        return self.request("POST", url, data)

def login():
    session = Session()
    
    # 1. Get Nonce
    status, body = session.get(f"{BASE_URL}/auth/nonce")
    if status != 200:
        print(f"Failed to get nonce: {status} {body}")
        return None
    
    data = json.loads(body)
    nonce = data['data']['nonce']
    print(f"Got nonce: {nonce}")

    # 2. Hash Password
    raw = PASSWORD + nonce
    hashed = hashlib.sha256(raw.encode('utf-8')).hexdigest()
    
    # 3. Login
    login_payload = {
        "data": {
            "username": USERNAME,
            "password": hashed,
            "nonce": nonce
        }
    }
    
    status, body = session.post(f"{BASE_URL}/auth/login", data=login_payload)
    if status != 200:
        print(f"Login failed: {status} {body}")
        return None
        
    result = json.loads(body)
    if result.get('code') != '0': # Note: Server returns string "0" or "1"
        print(f"Login logic failed: {result}")
        return None

    token = result['data']['token']
    print(f"Login successful. Token: {token[:10]}...")
    session.headers["Authorization"] = f"Bearer {token}"
    return session

def test_scan_channel(session, channel_id):
    print(f"\n--- Testing Scan Channel: {channel_id} ---")
    status, body = session.post(f"{BASE_URL}/channels/{channel_id}/scan")
    print(f"Status: {status}")
    print(f"Response: {body[:500]}")

def test_scan_device(session, channel_id, device_id):
    print(f"\n--- Testing Scan Device: {device_id} ---")
    status, body = session.post(f"{BASE_URL}/channels/{channel_id}/devices/{device_id}/scan")
    print(f"Status: {status}")
    print(f"Response: {body[:500]}")

def test_write_point(session, channel_id, device_id, point_id, value):
    print(f"\n--- Testing Write Point: {point_id} = {value} ---")
    payload = {
        "channel_id": channel_id,
        "device_id": device_id,
        "point_id": point_id,
        "value": value
    }
    status, body = session.post(f"{BASE_URL}/write", data=payload)
    print(f"Status: {status}")
    print(f"Response: {body}")

def test_read_point(session, channel_id, device_id):
    print(f"\n--- Testing Read Points ---")
    status, body = session.get(f"{BASE_URL}/channels/{channel_id}/devices/{device_id}/points")
    print(f"Status: {status}")
    if status == 200:
        points = json.loads(body)
        for p in points:
            if p['id'] == 'Setpoint.1':
                print(f"Point Setpoint.1 Value: {p.get('value')}")
    
    # Realtime
    status, body = session.get(f"{BASE_URL}/values/realtime")
    if status == 200:
        print(f"Realtime Data Sample: {body[:200]}")

if __name__ == "__main__":
    session = login()
    if session:
        channel_id = "bac-test-1"
        device_id = "Room_FC_2014_2228318"
        
        test_scan_channel(session, channel_id)
        test_scan_device(session, channel_id, device_id)
        
        # Write 88.5
        test_write_point(session, channel_id, device_id, "Setpoint.1", 88.5)
        
        # Wait a bit
        print("Waiting 6s...")
        time.sleep(6)
        
        test_read_point(session, channel_id, device_id)
