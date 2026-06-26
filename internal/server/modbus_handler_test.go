package server

import "testing"

func TestParseBatchModbusSlavesRequest_CamelCase(t *testing.T) {
	body := []byte(`{
		"slaveStart": 1,
		"slaveEnd": 7,
		"regStart": 0,
		"regEnd": 199,
		"interval": "1s",
		"datatype": "int16"
	}`)
	req, err := parseBatchModbusSlavesRequest(body)
	if err != nil {
		t.Fatal(err)
	}
	if req.SlaveStart != 1 || req.SlaveEnd != 7 {
		t.Fatalf("slave range: %d-%d", req.SlaveStart, req.SlaveEnd)
	}
	if req.RegStart != 0 || req.RegEnd != 199 {
		t.Fatalf("reg range: %d-%d", req.RegStart, req.RegEnd)
	}
}

func TestParseBatchModbusSlavesRequest_SnakeCase(t *testing.T) {
	body := []byte(`{"slave_start":2,"slave_end":5,"reg_start":10,"reg_end":20}`)
	req, err := parseBatchModbusSlavesRequest(body)
	if err != nil {
		t.Fatal(err)
	}
	if req.SlaveStart != 2 || req.SlaveEnd != 5 || req.RegStart != 10 || req.RegEnd != 20 {
		t.Fatalf("unexpected: %+v", req)
	}
}
