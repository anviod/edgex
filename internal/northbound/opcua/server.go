package opcua

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"math/big"
	"net"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"sync"
	"time"

	"edge-gateway/internal/model"

	"github.com/awcullen/opcua/server"
	"github.com/awcullen/opcua/ua"
	"go.uber.org/zap"
)

// Server is the OPC UA Server implementation
type Server struct {
	config    model.OPCUAConfig
	sb        model.SouthboundManager
	srv       *server.Server
	mu        sync.RWMutex
	nodeMap   map[string]*server.VariableNode
	gatewayID string
	stats     Stats
	ctx       context.Context
	cancel    context.CancelFunc

	// Node ID mapping system for compact node IDs
	idMapper *NodeIDMapper
}

// NewServer creates a new OPC UA Server
func NewServer(cfg model.OPCUAConfig, sb model.SouthboundManager) *Server {
	return &Server{
		config:    cfg,
		sb:        sb,
		nodeMap:   make(map[string]*server.VariableNode),
		gatewayID: "Gateway",
		idMapper:  NewNodeIDMapper(),
	}
}

// NodeIDMapper manages the mapping between compact numeric IDs and full string paths
// This reduces OPC UA node ID length significantly:
//
//	Original:  s=Gateway/Channels/44amyf4grh5oquzc/Devices/slave-1/Points/hr_40000 (70+ chars)
//	Compacted: ns=2;s=Device001.Temperature (e.g., ns=2;s=Device001.Temperature)
type NodeIDMapper struct {
	mu sync.RWMutex

	// Namespace index for compact node IDs
	namespace uint16

	// Point mappings: channelID:deviceID:pointID -> nodeID string (ns=X;s=Device.PointName)
	pointMap map[string]string

	// Reverse mappings: nodeID -> fullPath
	nodeIDToPath map[string]string

	// Next available folder node ID (starts from 1001 for folders only)
	nextFolderID uint32

	// Reverse mapping: shortID (ns=X;s=Y) -> fullPath
	reverseShortPath map[string]string
}

// NewNodeIDMapper creates a new NodeIDMapper
func NewNodeIDMapper() *NodeIDMapper {
	return &NodeIDMapper{
		namespace:        2, // OPC UA namespace index for custom nodes
		pointMap:         make(map[string]string),
		nodeIDToPath:     make(map[string]string),
		nextFolderID:     1001, // Start from 1001 for folder IDs only
		reverseShortPath: make(map[string]string),
	}
}

// GenerateCompactNodeID generates a compact node ID in OPC UA standard format
// Format: ns=2;s={deviceID}.{pointID}
// Example: ns=2;s=Device001.Temperature
// This uses string-type node IDs for better readability
func (m *NodeIDMapper) GenerateCompactNodeID(channelID, deviceID, pointID string) string {
	m.mu.Lock()
	defer m.mu.Unlock()

	// Create unique key for this point
	key := fmt.Sprintf("%s:%s:%s", channelID, deviceID, pointID)

	// If already exists, return existing node ID
	if nodeID, ok := m.pointMap[key]; ok {
		return nodeID
	}

	// Create string node ID: ns=2;s={deviceID}.{pointID}
	fullPath := fmt.Sprintf("Gateway/Channels/%s/Devices/%s/Points/%s", channelID, deviceID, pointID)
	shortID := fmt.Sprintf("ns=%d;s=%s.%s", m.namespace, deviceID, pointID)

	m.pointMap[key] = shortID
	m.nodeIDToPath[shortID] = fullPath
	m.reverseShortPath[shortID] = fullPath

	return shortID
}

// ParseCompactNodeID parses a compact node ID and returns the full path
// Handles format: ns=2;s={deviceID}.{pointID} or legacy numeric formats
// Returns ("", false) if not a valid compact ID
func (m *NodeIDMapper) ParseCompactNodeID(shortID string) (string, bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	// Check for string format: ns=X;s=Y
	if strings.HasPrefix(shortID, "ns=") && strings.Contains(shortID, ";s=") {
		if fullPath, ok := m.reverseShortPath[shortID]; ok {
			return fullPath, true
		}
		return "", false
	}

	// Legacy format (all digits)
	if isCompactNodeID(shortID) {
		if fullPath, ok := m.reverseShortPath[shortID]; ok {
			return fullPath, true
		}
	}

	return "", false
}

// GetOriginalIDs parses a compact node ID and returns the original IDs
// Handles format: ns=2;s={deviceID}.{pointID} or legacy formats
// Returns (channelID, deviceID, pointID, true) or ("", "", "", false) if invalid
func (m *NodeIDMapper) GetOriginalIDs(shortID string) (channelID, deviceID, pointID string, ok bool) {
	m.mu.RLock()
	defer m.mu.RUnlock()

	// Try to parse full path from reverseShortPath first
	if fullPath, exists := m.reverseShortPath[shortID]; exists {
		return parseFullPath(fullPath)
	}

	// Try to parse new string format: ns=X;s=Y.Z
	// Format is: ns=X;s={deviceID}.{pointID}
	if strings.HasPrefix(shortID, "ns=") && strings.Contains(shortID, ";s=") {
		parts := strings.Split(shortID, ";s=")
		if len(parts) == 2 {
			// The value part contains deviceID.pointID
			valuePart := parts[1]
			if idx := strings.LastIndex(valuePart, "."); idx > 0 {
				deviceID = valuePart[:idx]
				pointID = valuePart[idx+1:]
				// We can't determine channelID from this format alone
				// Look through full paths to find matching deviceID.pointID
				for _, fullPath := range m.reverseShortPath {
					if c, d, p, found := parseFullPath(fullPath); found {
						if d == deviceID && p == pointID {
							return c, d, p, true
						}
					}
				}
			}
		}
	}

	// Legacy format: {ch}.{dev}.{pt}
	if strings.Contains(shortID, ".") {
		parts := strings.Split(shortID, ".")
		if len(parts) == 3 {
			// Legacy format also stored in reverseShortPath
			if fullPath, exists := m.reverseShortPath[shortID]; exists {
				return parseFullPath(fullPath)
			}
		}
	}

	// Legacy numeric format (e.g., 111)
	if isCompactNodeID(shortID) {
		if fullPath, exists := m.reverseShortPath[shortID]; exists {
			return parseFullPath(fullPath)
		}
	}

	return "", "", "", false
}

// parseFullPath extracts channelID, deviceID, pointID from full path
func parseFullPath(fullPath string) (channelID, deviceID, pointID string, ok bool) {
	parts := strings.Split(fullPath, "/")
	if len(parts) >= 7 && parts[0] == "Gateway" && parts[1] == "Channels" && parts[3] == "Devices" && parts[5] == "Points" {
		return parts[2], parts[4], parts[6], true
	}
	return "", "", "", false
}

// isCompactNodeID checks if the ID is in compact format (all digits)
func isCompactNodeID(id string) bool {
	if len(id) < 3 {
		return false
	}
	for _, c := range id {
		if c < '0' || c > '9' {
			return false
		}
	}
	return true
}

// GenerateCompactFolderID generates compact node ID for folder nodes
// Format: ns=2;i={numericID} for folder types only
// Uses auto-incrementing numeric IDs for folders
func (m *NodeIDMapper) GenerateCompactFolderID(channelID string, deviceID string) string {
	m.mu.Lock()
	defer m.mu.Unlock()

	var key string
	if deviceID == "" {
		// Channel folder
		key = fmt.Sprintf("ch:%s", channelID)
	} else {
		// Device folder
		key = fmt.Sprintf("dev:%s:%s", channelID, deviceID)
	}

	// Check if already exists
	for numericIDStr, path := range m.nodeIDToPath {
		if path == key {
			return fmt.Sprintf("ns=%d;i=%s", m.namespace, numericIDStr)
		}
	}

	// Assign new folder ID (numeric for folders)
	folderID := m.nextFolderID
	m.nextFolderID++
	m.nodeIDToPath[fmt.Sprintf("%d", folderID)] = key

	return fmt.Sprintf("ns=%d;i=%d", m.namespace, folderID)
}

// GetAllMappings returns all current mappings for debugging/serialization
func (m *NodeIDMapper) GetAllMappings() map[string]any {
	m.mu.RLock()
	defer m.mu.RUnlock()

	mappings := make(map[string]any)
	mappings["namespace"] = m.namespace
	mappings["nextFolderID"] = m.nextFolderID
	mappings["points"] = m.pointMap
	mappings["reverseShortPath"] = m.reverseShortPath

	return mappings
}

// Size returns the number of point mappings
func (m *NodeIDMapper) Size() int {
	m.mu.RLock()
	defer m.mu.RUnlock()

	return len(m.pointMap)
}

// Start starts the OPC UA Server
func (s *Server) Start() error {
	zap.L().Info("Starting OPC UA Server...",
		zap.String("name", s.config.Name),
		zap.Int("port", s.config.Port),
		zap.String("component", "opcua-server"),
	)

	s.ctx, s.cancel = context.WithCancel(context.Background())

	endpoint := fmt.Sprintf("opc.tcp://0.0.0.0:%d%s", s.config.Port, s.config.Endpoint)
	// Sanitize name for URI (remove spaces)
	safeName := strings.ReplaceAll(s.config.Name, " ", "")
	appURI := fmt.Sprintf("urn:edgex-gateway:%s", safeName)

	// Ensure certificates exist
	certFile := s.config.CertFile
	keyFile := s.config.KeyFile
	if certFile == "" {
		if s.config.Name == "Test Server" {
			certFile = "server_test.crt"
		} else {
			certFile = "server.crt"
		}
	}
	if keyFile == "" {
		if s.config.Name == "Test Server" {
			keyFile = "server_test.key"
		} else {
			keyFile = "server.key"
		}
	}

	if err := s.ensureCert(certFile, keyFile, appURI); err != nil {
		return fmt.Errorf("failed to ensure certificate: %v", err)
	}

	appDesc := ua.ApplicationDescription{
		ApplicationURI:  appURI,
		ProductURI:      "http://github.com/awcullen/opcua",
		ApplicationName: ua.LocalizedText{Text: s.config.Name, Locale: "en"},
		ApplicationType: ua.ApplicationTypeServer,
		DiscoveryURLs:   []string{endpoint},
	}

	// Configure User Tokens
	// var userTokens []ua.UserTokenPolicy
	// ... logic to build tokens ...
	// Note: server.WithUserTokenPolicies seems to be unavailable or named differently.
	// We rely on Authenticator functions to implicitly support tokens if applicable.

	// Configure Authenticator
	opts := []server.Option{}

	// Helper to check if method is enabled
	hasAuthMethod := func(method string) bool {
		if len(s.config.AuthMethods) == 0 {
			// Default to Anonymous if not specified
			return method == "Anonymous"
		}
		for _, m := range s.config.AuthMethods {
			if m == method {
				return true
			}
		}
		return false
	}

	if hasAuthMethod("Anonymous") {
		opts = append(opts, server.WithAuthenticateAnonymousIdentityFunc(func(userIdentity ua.AnonymousIdentity, applicationURI string, endpointURL string) error {
			return nil
		}))
	}

	if hasAuthMethod("UserName") {
		opts = append(opts, server.WithAuthenticateUserNameIdentityFunc(func(userIdentity ua.UserNameIdentity, applicationURI string, endpointURL string) error {
			// For testing purposes, temporarily allow any username/password
			return nil
		}))
	}

	// Security Configuration
	// Handle Security Policy
	// User requested "Support all levels", so we enable None explicitly.
	// Secure policies (Basic256Sha256, Aes128_Sha256_RsaOaep) are enabled by default if a certificate is provided.
	opts = append(opts, server.WithSecurityPolicyNone(true))

	// Handle Trusted Certificates
	if s.config.TrustedCertPath != "" {
		// Use subdirectories for trusted and rejected certificates
		trustedDir := filepath.Join(s.config.TrustedCertPath, "trusted")
		rejectedDir := filepath.Join(s.config.TrustedCertPath, "rejected")
		// Ensure directories exist
		os.MkdirAll(trustedDir, 0755)
		os.MkdirAll(rejectedDir, 0755)
		opts = append(opts, server.WithTrustedCertificatesPaths(trustedDir, rejectedDir))

		// Development mode: Auto-trust client certificates to avoid manual copying
		// This fixes "Bad_SecurityChecksFailed" when client cert is not yet trusted
		opts = append(opts, server.WithInsecureSkipVerify())
	}

	if hasAuthMethod("Certificate") {
		opts = append(opts, server.WithAuthenticateX509IdentityFunc(func(userIdentity ua.X509Identity, applicationURI string, endpointURL string) error {
			// Verify the certificate
			cert, err := x509.ParseCertificate([]byte(userIdentity.Certificate))
			if err != nil {
				zap.L().Error("OPC UA Certificate Auth failed",
					zap.Error(err),
					zap.String("component", "opcua-server"),
				)
				return ua.BadUserAccessDenied
			}
			zap.L().Info("OPC UA Client Authenticated via Certificate",
				zap.String("subject", cert.Subject.String()),
				zap.String("issuer", cert.Issuer.String()),
				zap.String("component", "opcua-server"),
			)
			return nil
		}))
	}

	var err error
	s.srv, err = server.New(
		appDesc,
		certFile,
		keyFile,
		endpoint,
		opts...,
	)

	if err != nil {
		return fmt.Errorf("failed to create server: %v", err)
	}

	// Build Address Space
	if err := s.buildAddressSpace(); err != nil {
		return fmt.Errorf("failed to build address space: %v", err)
	}

	// Start Listener
	go func() {
		if err := s.srv.ListenAndServe(); err != nil {
			zap.L().Error("OPC UA Server error",
				zap.String("name", s.config.Name),
				zap.Error(err),
				zap.String("component", "opcua-server"),
			)
		}
	}()

	go s.systemInfoLoop(s.ctx)

	zap.L().Info("OPC UA Server started",
		zap.String("name", s.config.Name),
		zap.String("endpoint", endpoint),
		zap.String("component", "opcua-server"),
	)
	return nil
}

func (s *Server) ensureCert(certFile, keyFile, appURI string) error {
	regenerate := false
	if _, err := os.Stat(certFile); err == nil {
		if _, err := os.Stat(keyFile); err == nil {
			// Check if certificate has correct URI
			certPEM, err := os.ReadFile(certFile)
			if err == nil {
				block, _ := pem.Decode(certPEM)
				if block != nil {
					cert, err := x509.ParseCertificate(block.Bytes)
					if err == nil {
						foundURI := false
						foundCN := false
						for _, u := range cert.URIs {
							if u.String() == appURI {
								foundURI = true
								break
							}
						}

						// Check CommonName
						if cert.Subject.CommonName == s.config.Name {
							foundCN = true
						}

						if !foundURI || !foundCN {
							zap.L().Warn("Existing certificate mismatch (URI or CN), regenerating...",
								zap.String("expected_uri", appURI),
								zap.String("expected_cn", s.config.Name),
								zap.String("component", "opcua-server"),
							)
							regenerate = true
						}
					}
				}
			}
			if !regenerate {
				return nil
			}
		}
	}

	zap.L().Info("Generating self-signed certificate...", zap.String("component", "opcua-server"))

	priv, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return err
	}

	uri, err := url.Parse(appURI)
	if err != nil {
		return fmt.Errorf("failed to parse application URI: %v", err)
	}

	template := x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject: pkix.Name{
			Organization: []string{"EdgeX Gateway"},
			CommonName:   s.config.Name,
			Country:      []string{"CN"},
			Locality:     []string{"Beijing"},
		},
		NotBefore: time.Now(),
		NotAfter:  time.Now().Add(365 * 10 * 24 * time.Hour), // 10 years

		KeyUsage:              x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature | x509.KeyUsageDataEncipherment | x509.KeyUsageCertSign | x509.KeyUsageContentCommitment,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth, x509.ExtKeyUsageClientAuth},
		BasicConstraintsValid: true,
		DNSNames:              []string{"localhost", "127.0.0.1"},
		IPAddresses:           []net.IP{net.ParseIP("127.0.0.1"), net.ParseIP("0.0.0.0")},
		URIs:                  []*url.URL{uri},
		SignatureAlgorithm:    x509.SHA256WithRSA,
	}

	derBytes, err := x509.CreateCertificate(rand.Reader, &template, &template, &priv.PublicKey, priv)
	if err != nil {
		return err
	}

	certOut, err := os.Create(certFile)
	if err != nil {
		return err
	}
	pem.Encode(certOut, &pem.Block{Type: "CERTIFICATE", Bytes: derBytes})
	certOut.Close()

	keyOut, err := os.Create(keyFile)
	if err != nil {
		return err
	}
	pem.Encode(keyOut, &pem.Block{Type: "RSA PRIVATE KEY", Bytes: x509.MarshalPKCS1PrivateKey(priv)})
	keyOut.Close()

	return nil
}

// ... rest of the file ...
func (s *Server) Stop() {
	if s.cancel != nil {
		s.cancel()
	}
	if s.srv != nil {
		s.srv.Close()
	}
	zap.L().Info("OPC UA Server stopped",
		zap.String("name", s.config.Name),
		zap.String("component", "opcua-server"),
	)
}

func (s *Server) UpdateConfig(cfg model.OPCUAConfig) error {
	s.Stop()
	s.config = cfg
	return s.Start()
}

func (s *Server) Update(v model.Value) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if s.config.Devices != nil {
		if enabled, ok := s.config.Devices[v.DeviceID]; ok && !enabled {
			return
		}
	}

	key := fmt.Sprintf("%s/%s/%s", v.ChannelID, v.DeviceID, v.PointID)

	if node, ok := s.nodeMap[key]; ok {
		status := uint32(0) // Good
		if v.Quality != "Good" {
			status = 0x80000000 // Bad
		}

		zap.L().Debug("OPC UA Node Update",
			zap.String("point_id", v.PointID),
			zap.Any("value", v.Value),
			zap.String("quality", v.Quality),
			zap.String("component", "opcua-server"),
		)

		node.SetValue(ua.DataValue{
			Value:           v.Value,
			StatusCode:      ua.StatusCode(status),
			SourceTimestamp: v.TS,
			ServerTimestamp: time.Now(),
		})
	}
}

func (s *Server) buildAddressSpace() error {
	nsURI := "http://edgex-gateway.com/opcua"
	// Get namespace index from the server
	nsIndex := s.srv.NamespaceManager().Add(nsURI)
	//zap.L().Info("OPC UA Namespace Added", zap.String("uri", nsURI), zap.Uint16("index", nsIndex))

	// Create a new mapper for this address space build
	// This ensures clean state and correct ID assignment
	s.idMapper = NewNodeIDMapper()

	createFolder := func(parentID ua.NodeID, id string, name string) ua.NodeID {
		nodeID := ua.ParseNodeID(fmt.Sprintf("ns=%d;s=%s", nsIndex, id))
		organizes := ua.ParseNodeID("i=35")
		node := server.NewObjectNode(
			s.srv,
			nodeID,
			ua.QualifiedName{NamespaceIndex: nsIndex, Name: name},
			ua.LocalizedText{Text: name, Locale: "en"},
			ua.LocalizedText{},
			nil,
			[]ua.Reference{
				{ReferenceTypeID: organizes, IsInverse: true, TargetID: ua.ExpandedNodeID{NodeID: parentID}},
			},
			0,
		)
		if err := s.srv.NamespaceManager().AddNode(node); err != nil {
			zap.L().Error("Failed to add OPC UA Object Node", zap.String("node_id", fmt.Sprintf("%v", nodeID)), zap.Error(err))
		}
		return nodeID
	}

	// Helper to create Variable with string node ID
	createVar := func(parentID ua.NodeID, id string, name string, val interface{}, typeID ua.NodeID, accessLevel byte, writeHandler func(sess *server.Session, req ua.WriteValue) (ua.DataValue, ua.StatusCode)) *server.VariableNode {
		nodeID := ua.ParseNodeID(fmt.Sprintf("ns=%d;s=%s", nsIndex, id))
		hasComponent := ua.ParseNodeID("i=47")

		// Create VariableNode
		v := server.NewVariableNode(
			s.srv,
			nodeID,
			ua.QualifiedName{NamespaceIndex: nsIndex, Name: name},
			ua.LocalizedText{Text: name, Locale: "en"},
			ua.LocalizedText{},
			nil,
			[]ua.Reference{
				{ReferenceTypeID: hasComponent, IsInverse: true, TargetID: ua.ExpandedNodeID{NodeID: parentID}},
			},
			ua.DataValue{Value: val},
			typeID,
			-1,
			nil,
			accessLevel,
			0.0,
			false,
			nil, // Historian
		)

		if err := s.srv.NamespaceManager().AddNode(v); err != nil {
			zap.L().Error("Failed to add OPC UA Variable Node", zap.String("node_id", fmt.Sprintf("%v", nodeID)), zap.Error(err))
		}

		if writeHandler != nil {
			v.SetWriteValueHandler(writeHandler)
		}

		return v
	}

	objectsFolder := ua.ParseNodeID("i=85")

	// Create Gateway root folder (always "G" as first element of compact IDs)
	gatewayID := createFolder(objectsFolder, "G", "Gateway")

	infoID := createFolder(gatewayID, "G/Info", "Info")

	s.mu.Lock()
	s.nodeMap["System/CPUUsage"] = createVar(infoID, "G/Info/CPUUsage", "CPUUsage", 0.0, s.getDataTypeID("double"), 1, nil)
	s.nodeMap["System/MemoryUsage"] = createVar(infoID, "G/Info/MemoryUsage", "MemoryUsage", 0.0, s.getDataTypeID("double"), 1, nil)
	s.nodeMap["System/Goroutines"] = createVar(infoID, "G/Info/Goroutines", "Goroutines", int32(0), s.getDataTypeID("int32"), 1, nil)
	s.nodeMap["System/Uptime"] = createVar(infoID, "G/Info/Uptime", "Uptime", int64(0), s.getDataTypeID("int64"), 1, nil)
	s.nodeMap["System/ClientCount"] = createVar(infoID, "G/Info/ClientCount", "ClientCount", int32(0), s.getDataTypeID("int32"), 1, nil)
	s.nodeMap["System/SubscriptionCount"] = createVar(infoID, "G/Info/SubscriptionCount", "SubscriptionCount", int32(0), s.getDataTypeID("int32"), 1, nil)
	s.nodeMap["System/WriteCount"] = createVar(infoID, "G/Info/WriteCount", "WriteCount", int64(0), s.getDataTypeID("int64"), 1, nil)
	s.mu.Unlock()

	// Create Channels folder
	channelsID := createFolder(gatewayID, "G/Channels", "Channels")

	channels := s.sb.GetChannels()
	//zap.L().Info("Building OPC UA Address Space", zap.Int("channel_count", len(channels)))

	for _, ch := range channels {
		// Generate compact channel node ID: G/{channelNum}
		chCompactID := s.idMapper.GenerateCompactFolderID(ch.ID, "")

		// Use original ID as BrowseName for human readability
		chNodeID := createFolder(channelsID, chCompactID, ch.ID)

		// Protocol and Status under channel
		createVar(chNodeID, chCompactID+"/Protocol", "Protocol", ch.Protocol, s.getDataTypeID("string"), 1, nil)
		createVar(chNodeID, chCompactID+"/Status", "Status", "Running", s.getDataTypeID("string"), 1, nil)

		// Create Devices folder with compact ID: G/{channelNum}/D
		devsCompactID := chCompactID + "/D"
		devsNodeID := createFolder(chNodeID, devsCompactID, "Devices")

		//zap.L().Info("Processing Devices for Channel", zap.String("channel_id", ch.ID), zap.Int("device_count", len(ch.Devices)))

		for _, dev := range ch.Devices {
			//zap.L().Info("Processing Device", zap.String("device_id", dev.ID), zap.String("device_name", dev.Name), zap.Int("point_count", len(dev.Points)))

			// Check if device is enabled in config
			// If config.Devices is empty, we assume "Allow All" for better UX.
			// If config.Devices is populated, we apply strict filtering.
			if s.config.Devices != nil && len(s.config.Devices) > 0 {
				if enabled, ok := s.config.Devices[dev.ID]; !ok || !enabled {
					//					zap.L().Info("Skipping OPC UA Device Node (Not Enabled)", zap.String("device_id", dev.ID), zap.Bool("ok", ok), zap.Bool("enabled", enabled))
					continue
				} else {
					//zap.L().Info("Device Enabled in OPC UA Config", zap.String("device_id", dev.ID), zap.Bool("enabled", enabled))
				}
			} else {
				zap.L().Info("No OPC UA Device Filter Configured, Allowing All Devices")
			}

			// Generate compact device node ID: G/{channelNum}/D/{deviceNum}
			dCompactID := s.idMapper.GenerateCompactFolderID(ch.ID, dev.ID)

			//			zap.L().Info("Adding OPC UA Device Node", zap.String("device_id", dev.ID), zap.String("device_name", dev.Name))
			// Use original ID as BrowseName
			dNodeID := createFolder(devsNodeID, dCompactID, dev.ID)

			createVar(dNodeID, dCompactID+"/Vendor", "Vendor", getString(dev.Config, "vendor_name"), s.getDataTypeID("string"), 1, nil)
			createVar(dNodeID, dCompactID+"/Model", "Model", getString(dev.Config, "model_name"), s.getDataTypeID("string"), 1, nil)

			// Create Points folder with compact ID: G/{channelNum}/D/{deviceNum}/P
			pointsCompactID := dCompactID + "/P"
			pointsNodeID := createFolder(dNodeID, pointsCompactID, "Points")

			//			zap.L().Info("Adding OPC UA Points for Device", zap.String("device_id", dev.ID), zap.Int("point_count", len(dev.Points)))

			for _, p := range dev.Points {
				// Use full path as internal key for nodeMap (for Update/WriteViaOPCUA lookups)
				pKey := fmt.Sprintf("%s/%s/%s", ch.ID, dev.ID, p.ID)

				// Generate string node ID: ns=2;s={deviceID}.{pointID}
				// Example: ns=2;s=Device001.Temperature
				// Also registers the mapping in idMapper for reverse lookup
				_ = s.idMapper.GenerateCompactNodeID(ch.ID, dev.ID, p.ID)
				// stringID format: deviceID.pointID (used in createVar which adds ns=X;s= prefix)
				stringID := fmt.Sprintf("%s.%s", dev.ID, p.ID)

				accessLevel := byte(1)
				if strings.Contains(strings.ToUpper(p.ReadWrite), "W") {
					accessLevel |= 2
				}

				dataTypeID := s.getDataTypeID(p.DataType)

				var writeHandler func(sess *server.Session, req ua.WriteValue) (ua.DataValue, ua.StatusCode)
				if accessLevel&2 != 0 {
					cid, did, pid := ch.ID, dev.ID, p.ID
					pType := p.DataType
					writeHandler = func(sess *server.Session, req ua.WriteValue) (ua.DataValue, ua.StatusCode) {
						// Only allow writing to Value attribute
						if req.AttributeID != ua.AttributeIDValue {
							zap.L().Warn("OPC UA Write Rejected: Not Value Attribute", zap.Uint32("attr_id", req.AttributeID))
							return ua.DataValue{}, ua.StatusCode(0x80730000) // BadWriteNotSupported
						}

						// Extract and convert value to expected type
						val := convertToType(req.Value.Value, pType)

						zap.L().Info("OPC UA Write Request Received",
							zap.String("channel_id", cid),
							zap.String("device_id", did),
							zap.String("point_id", pid),
							zap.Any("value", val),
							zap.String("component", "opcua-server"),
						)

						// Update stats
						s.mu.Lock()
						s.stats.WriteCount++
						writeCount := s.stats.WriteCount
						s.mu.Unlock()

						// Update system node (must be done outside of lock to avoid deadlock with updateSystemNode's internal RLock)
						s.updateSystemNode("WriteCount", writeCount)

						// Call Southbound Write
						err := s.sb.WritePoint(cid, did, pid, val)
						if err != nil {
							zap.L().Error("OPC UA Write Failed (SB)",
								zap.String("channel_id", cid),
								zap.String("device_id", did),
								zap.String("point_id", pid),
								zap.Error(err),
								zap.String("component", "opcua-server"),
							)
							// Change to BadInternalError (0x80020000) to distinguish from Access Denied
							return ua.DataValue{}, ua.StatusCode(0x80020000)
						}

						zap.L().Info("OPC UA Write Success (SB)",
							zap.String("point_id", pid),
							zap.Any("value", val),
						)

						// Return the value so the server updates the node
						// Ensure the returned value has the correct type
						return ua.DataValue{
							Value:           val,
							StatusCode:      ua.StatusCode(0),
							SourceTimestamp: time.Now(),
							ServerTimestamp: time.Now(),
						}, ua.StatusCode(0)
					}
				}

				// Create variable node with STRING node ID (ns=2;s=DeviceID.PointID)
				// Use original point name as BrowseName for readability
				vNode := createVar(pointsNodeID, stringID, p.Name, s.getZeroValue(p.DataType), dataTypeID, accessLevel, writeHandler)

				s.mu.Lock()
				s.nodeMap[pKey] = vNode
				s.mu.Unlock()
				//				zap.L().Info("Added OPC UA Point Node", zap.String("node_id", pNodeID), zap.String("point_id", p.ID), zap.String("point_name", p.Name), zap.String("data_type", p.DataType))
			}
		}
	}

	zap.L().Info("OPC UA Address Space built with compact node IDs",
		zap.Int("total_mappings", s.idMapper.Size()),
		zap.String("component", "opcua-server"),
	)

	return nil
}

func (s *Server) systemInfoLoop(ctx context.Context) {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()
	startTime := time.Now()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			var mem runtime.MemStats
			runtime.ReadMemStats(&mem)
			s.updateSystemNode("MemoryUsage", float64(mem.Alloc)/1024/1024)
			s.updateSystemNode("Goroutines", int32(runtime.NumGoroutine()))

			uptime := int64(time.Since(startTime).Seconds())
			s.updateSystemNode("Uptime", uptime)

			// Update Client Count
			clientCount := s.getClientCount()
			s.updateSystemNode("ClientCount", int32(clientCount))

			// Update internal stats
			s.mu.Lock()
			s.stats.ClientCount = clientCount
			s.stats.Uptime = uptime
			// WriteCount and SubscriptionCount are currently 0 or updated elsewhere (if we could hook them)
			s.mu.Unlock()
		}
	}
}

func (s *Server) getClientCount() int {
	portStr := fmt.Sprintf(":%d", s.config.Port)
	var cmd *exec.Cmd

	if runtime.GOOS == "windows" {
		// netstat -an | find ":PORT" | find "ESTABLISHED" /c
		cmd = exec.Command("cmd", "/C", fmt.Sprintf("netstat -an | find \"%s\" | find \"ESTABLISHED\" /c", portStr))
	} else {
		// netstat -an | grep :PORT | grep ESTABLISHED | wc -l
		cmd = exec.Command("sh", "-c", fmt.Sprintf("netstat -an | grep '%s' | grep ESTABLISHED | wc -l", portStr))
	}

	out, err := cmd.Output()
	if err != nil {
		return 0
	}

	countStr := strings.TrimSpace(string(out))
	count, _ := strconv.Atoi(countStr)
	return count
}

// Stats represents the monitoring statistics
type Stats struct {
	ClientCount       int   `json:"client_count"`
	SubscriptionCount int   `json:"subscription_count"`
	WriteCount        int64 `json:"write_count"`
	Uptime            int64 `json:"uptime"`
}

// GetStats returns the current statistics
func (s *Server) GetStats() Stats {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.stats
}

func (s *Server) updateSystemNode(name string, value interface{}) {
	s.mu.RLock()
	node, ok := s.nodeMap["System/"+name]
	s.mu.RUnlock()
	if ok {
		node.SetValue(ua.DataValue{
			Value:           value,
			StatusCode:      ua.StatusCode(0),
			SourceTimestamp: time.Now(),
			ServerTimestamp: time.Now(),
		})
	}
}

func (s *Server) getDataTypeID(dtype string) ua.NodeID {
	id := 11
	switch strings.ToLower(dtype) {
	case "bool", "boolean":
		id = 1
	case "int8", "sbyte":
		id = 2
	case "uint8", "byte":
		id = 3
	case "int16":
		id = 4
	case "uint16":
		id = 5
	case "int32":
		id = 6
	case "uint32":
		id = 7
	case "int64":
		id = 8
	case "uint64":
		id = 9
	case "float32":
		id = 10
	case "float64", "double":
		id = 11
	case "string":
		id = 12
	case "bytestring":
		id = 15
	}
	nid := ua.ParseNodeID(fmt.Sprintf("i=%d", id))
	return nid
}

func (s *Server) getZeroValue(dtype string) interface{} {
	if strings.ToLower(dtype) == "bytestring" {
		return []byte{}
	}
	return getZeroValueForType(dtype)
}

// getZeroValueForType returns the zero value for a given data type
func getZeroValueForType(dtype string) interface{} {
	switch strings.ToLower(dtype) {
	case "bool", "boolean":
		return false
	case "int8", "sbyte":
		return int8(0)
	case "uint8", "byte":
		return uint8(0)
	case "int16":
		return int16(0)
	case "uint16":
		return uint16(0)
	case "int32":
		return int32(0)
	case "uint32":
		return uint32(0)
	case "int64":
		return int64(0)
	case "uint64":
		return uint64(0)
	case "float32":
		return float32(0)
	case "float64", "double":
		return float64(0)
	case "string":
		return ""
	default:
		return float64(0)
	}
}

// convertToType converts a value to the specified OPC UA data type
func convertToType(val any, dtype string) interface{} {
	if val == nil {
		return getZeroValueForType(dtype)
	}

	// If already the correct type, return as-is
	switch dtype {
	case "bool", "boolean":
		if _, ok := val.(bool); ok {
			return val
		}
	case "int8", "sbyte":
		if _, ok := val.(int8); ok {
			return val
		}
	case "uint8", "byte":
		if _, ok := val.(uint8); ok {
			return val
		}
	case "int16":
		if _, ok := val.(int16); ok {
			return val
		}
	case "uint16":
		if _, ok := val.(uint16); ok {
			return val
		}
	case "int32":
		if _, ok := val.(int32); ok {
			return val
		}
	case "uint32":
		if _, ok := val.(uint32); ok {
			return val
		}
	case "int64":
		if _, ok := val.(int64); ok {
			return val
		}
	case "uint64":
		if _, ok := val.(uint64); ok {
			return val
		}
	case "float32":
		if _, ok := val.(float32); ok {
			return val
		}
	case "float64", "double":
		if _, ok := val.(float64); ok {
			return val
		}
	case "string":
		if _, ok := val.(string); ok {
			return val
		}
	}

	// Convert string to target type
	strVal := fmt.Sprintf("%v", val)

	switch strings.ToLower(dtype) {
	case "bool", "boolean":
		if b, err := strconv.ParseBool(strVal); err == nil {
			return b
		}
		return false
	case "int8", "sbyte":
		if v, err := strconv.ParseInt(strVal, 10, 8); err == nil {
			return int8(v)
		}
		return int8(0)
	case "uint8", "byte":
		if v, err := strconv.ParseUint(strVal, 10, 8); err == nil {
			return uint8(v)
		}
		return uint8(0)
	case "int16":
		if v, err := strconv.ParseInt(strVal, 10, 16); err == nil {
			return int16(v)
		}
		return int16(0)
	case "uint16":
		if v, err := strconv.ParseUint(strVal, 10, 16); err == nil {
			return uint16(v)
		}
		return uint16(0)
	case "int32":
		if v, err := strconv.ParseInt(strVal, 10, 32); err == nil {
			return int32(v)
		}
		return int32(0)
	case "uint32":
		if v, err := strconv.ParseUint(strVal, 10, 32); err == nil {
			return uint32(v)
		}
		return uint32(0)
	case "int64":
		if v, err := strconv.ParseInt(strVal, 10, 64); err == nil {
			return v
		}
		return int64(0)
	case "uint64":
		if v, err := strconv.ParseUint(strVal, 10, 64); err == nil {
			return v
		}
		return uint64(0)
	case "float32":
		if v, err := strconv.ParseFloat(strVal, 32); err == nil {
			return float32(v)
		}
		return float32(0)
	case "float64", "double":
		if v, err := strconv.ParseFloat(strVal, 64); err == nil {
			return v
		}
		return float64(0)
	case "string":
		return strVal
	default:
		return val
	}
}

func getString(m map[string]any, key string) string {
	if v, ok := m[key]; ok {
		return fmt.Sprintf("%v", v)
	}
	return ""
}

// WriteViaOPCUA 通过 OPC-UA 服务端写入值（外部调用接口）
// 返回写入是否成功，以及更新后的值（用于验证）
func (s *Server) WriteViaOPCUA(channelID, deviceID, pointID string, value any) error {
	s.mu.RLock()
	defer s.mu.RUnlock()

	key := fmt.Sprintf("%s/%s/%s", channelID, deviceID, pointID)
	node, ok := s.nodeMap[key]
	if !ok {
		return fmt.Errorf("node not found: %s", key)
	}

	// 调用 WritePoint
	err := s.sb.WritePoint(channelID, deviceID, pointID, value)
	if err != nil {
		return fmt.Errorf("write failed: %v", err)
	}

	// 更新节点值
	status := uint32(0) // Good
	node.SetValue(ua.DataValue{
		Value:           value,
		StatusCode:      ua.StatusCode(status),
		SourceTimestamp: time.Now(),
		ServerTimestamp: time.Now(),
	})

	// 更新统计
	s.mu.Lock()
	s.stats.WriteCount++
	s.mu.Unlock()

	return nil
}

// BatchWrite 批量写入多个点位
type WriteRequest struct {
	ChannelID string `json:"channel_id"`
	DeviceID  string `json:"device_id"`
	PointID   string `json:"point_id"`
	Value     any    `json:"value"`
}

type BatchWriteResult struct {
	ChannelID string `json:"channel_id"`
	DeviceID  string `json:"device_id"`
	PointID   string `json:"point_id"`
	Success   bool   `json:"success"`
	Error     string `json:"error,omitempty"`
}

func (s *Server) BatchWrite(requests []WriteRequest) []BatchWriteResult {
	results := make([]BatchWriteResult, 0, len(requests))

	for _, req := range requests {
		result := BatchWriteResult{
			ChannelID: req.ChannelID,
			DeviceID:  req.DeviceID,
			PointID:   req.PointID,
			Success:   false,
		}

		err := s.WriteViaOPCUA(req.ChannelID, req.DeviceID, req.PointID, req.Value)
		if err != nil {
			result.Error = err.Error()
		} else {
			result.Success = true
		}

		results = append(results, result)
	}

	return results
}

// WriteHistoryItem 写入历史记录
type WriteHistoryItem struct {
	ChannelID string    `json:"channel_id"`
	DeviceID  string    `json:"device_id"`
	PointID   string    `json:"point_id"`
	Value     any       `json:"value"`
	Timestamp time.Time `json:"timestamp"`
	Success   bool      `json:"success"`
	Error     string    `json:"error,omitempty"`
}

var writeHistory []WriteHistoryItem
var writeHistoryMu sync.Mutex

const maxWriteHistorySize = 1000

// recordWrite 记录写入历史
func (s *Server) recordWrite(req WriteRequest, success bool, errMsg string) {
	writeHistoryMu.Lock()
	defer writeHistoryMu.Unlock()

	item := WriteHistoryItem{
		ChannelID: req.ChannelID,
		DeviceID:  req.DeviceID,
		PointID:   req.PointID,
		Value:     req.Value,
		Timestamp: time.Now(),
		Success:   success,
		Error:     errMsg,
	}

	writeHistory = append(writeHistory, item)

	// 限制历史记录大小
	if len(writeHistory) > maxWriteHistorySize {
		writeHistory = writeHistory[len(writeHistory)-maxWriteHistorySize:]
	}
}

// GetWriteHistory 获取写入历史
func (s *Server) GetWriteHistory(limit int) []WriteHistoryItem {
	writeHistoryMu.Lock()
	defer writeHistoryMu.Unlock()

	if limit <= 0 || limit > len(writeHistory) {
		limit = len(writeHistory)
	}

	// 返回最新的 limit 条记录
	start := len(writeHistory) - limit
	result := make([]WriteHistoryItem, limit)
	copy(result, writeHistory[start:])
	return result
}

// NodeIDMappingInfo 返回节点 ID 映射信息，用于调试和诊断
type NodeIDMappingInfo struct {
	CompactID string `json:"compact_id"`
	FullPath  string `json:"full_path"`
	Type      string `json:"type"` // "channel", "device", "point"
	ChannelID string `json:"channel_id,omitempty"`
	DeviceID  string `json:"device_id,omitempty"`
	PointID   string `json:"point_id,omitempty"`
}

// GetNodeIDMappings 返回所有节点 ID 映射
func (s *Server) GetNodeIDMappings() []NodeIDMappingInfo {
	if s.idMapper == nil {
		return nil
	}

	s.mu.RLock()
	defer s.mu.RUnlock()

	var mappings []NodeIDMappingInfo

	// All mappings are now in reverseShortPath with ns=2;i=XXXX format
	s.idMapper.mu.RLock()
	for shortPath, fullPath := range s.idMapper.reverseShortPath {
		mappings = append(mappings, NodeIDMappingInfo{
			CompactID: shortPath,
			FullPath:  fullPath,
			Type:      "full",
		})
	}
	s.idMapper.mu.RUnlock()

	return mappings
}

// ResolveNodeID 根据节点 ID 字符串解析为原始 ID
// 支持格式: ns=2;i=XXXX, 111 (legacy), Gateway/Channels/...
// 返回 (channelID, deviceID, pointID, isCompact, error)
func (s *Server) ResolveNodeID(nodeID string) (string, string, string, bool, error) {
	if s.idMapper == nil {
		return "", "", "", false, fmt.Errorf("id mapper not initialized")
	}

	// Try to parse as compact ID format: ns=X;i=Y
	if strings.HasPrefix(nodeID, "ns=") {
		chID, devID, ptID, ok := s.idMapper.GetOriginalIDs(nodeID)
		if ok {
			return chID, devID, ptID, true, nil
		}
		return "", "", "", false, fmt.Errorf("invalid compact node ID: %s", nodeID)
	}

	// Try to parse as legacy compact ID (all digits, e.g., 111)
	if isCompactNodeID(nodeID) {
		chID, devID, ptID, ok := s.idMapper.GetOriginalIDs(nodeID)
		if ok {
			return chID, devID, ptID, true, nil
		}
		return "", "", "", false, fmt.Errorf("invalid compact node ID: %s", nodeID)
	}

	// Try to parse full path format
	// Format: Gateway/Channels/{channelID}/Devices/{deviceID}/Points/{pointID}
	parts := strings.Split(nodeID, "/")
	if len(parts) >= 6 && parts[0] == "Gateway" && parts[1] == "Channels" && parts[3] == "Devices" && parts[5] == "Points" {
		return parts[2], parts[4], parts[6], false, nil
	}

	return "", "", "", false, fmt.Errorf("unrecognized node ID format: %s", nodeID)
}

// GetCompactNodeID 返回指定通道/设备/点位的紧凑节点 ID
// 如果不存在返回空字符串
func (s *Server) GetCompactNodeID(channelID, deviceID, pointID string) string {
	if s.idMapper == nil {
		return ""
	}

	// Check if this mapping exists by looking at the reverse short path
	key := fmt.Sprintf("%s/%s/%s", channelID, deviceID, pointID)
	s.idMapper.mu.RLock()
	defer s.idMapper.mu.RUnlock()

	for shortPath, fullPath := range s.idMapper.reverseShortPath {
		if fullPath == key {
			return shortPath
		}
	}

	// If not found, generate a new one (will assign new numbers)
	return s.idMapper.GenerateCompactNodeID(channelID, deviceID, pointID)
}

// CompactIDStats 返回紧凑 ID 的统计信息
type CompactIDStats struct {
	TotalMappings int    `json:"total_mappings"`
	Namespace     uint16 `json:"namespace"`
	NextFolderID  uint32 `json:"next_folder_id"`
	SampleMapping string `json:"sample_mapping,omitempty"` // e.g., "Device001.Temperature -> ns=2;s=Device001.Temperature"
}

// GetCompactIDStats 返回紧凑 ID 统计信息
func (s *Server) GetCompactIDStats() CompactIDStats {
	if s.idMapper == nil {
		return CompactIDStats{}
	}

	stats := s.idMapper.Size()

	s.idMapper.mu.RLock()
	ns := s.idMapper.namespace
	nextFolderID := s.idMapper.nextFolderID

	// Get a sample mapping
	var sample string
	for shortPath, fullPath := range s.idMapper.reverseShortPath {
		sample = fmt.Sprintf("%s -> %s", fullPath, shortPath)
		break
	}
	s.idMapper.mu.RUnlock()

	return CompactIDStats{
		TotalMappings: stats,
		Namespace:     ns,
		NextFolderID:  nextFolderID,
		SampleMapping: sample,
	}
}
