package core

import (
	"bytes"
	"encoding/json"
	"fmt"
	"industrial-edge-gateway/internal/model"
	"industrial-edge-gateway/internal/storage"
	"log"
	"net/http"
	"os"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/expr-lang/expr"
)

type ruleTask struct {
	rule model.EdgeRule
	val  model.Value
}

type EdgeComputeManager struct {
	rules      map[string]model.EdgeRule
	pipeline   *DataPipeline
	nbm        *NorthboundManager
	cm         *ChannelManager
	store      *storage.Storage
	mu         sync.RWMutex
	saveFunc   func([]model.EdgeRule) error
	ruleStates map[string]*model.RuleRuntimeState
	windows    map[string][]model.Value
	stateMu    sync.RWMutex
	valueCache map[string]model.Value
	cacheMu    sync.RWMutex

	// Shared Source Index
	ruleIndex map[string][]string // Key: "ChannelID/DeviceID/PointID", Value: []RuleID
	indexMu   sync.RWMutex

	// Worker Pool
	workerPool  chan *ruleTask
	workerCount int
	wg          sync.WaitGroup

	// Metrics
	statsMu        sync.RWMutex
	rulesTriggered int64
	rulesExecuted  int64
	rulesDropped   int64
}

type EdgeComputeMetrics struct {
	WorkerPoolSize    int   `json:"worker_pool_size"`
	WorkerPoolUsage   int   `json:"worker_pool_usage"`
	RuleCount         int   `json:"rule_count"`
	SharedSourceCount int   `json:"shared_source_count"`
	CacheSize         int   `json:"cache_size"`
	RulesTriggered    int64 `json:"rules_triggered"`
	RulesExecuted     int64 `json:"rules_executed"`
	RulesDropped      int64 `json:"rules_dropped"`
}

func NewEdgeComputeManager(pipeline *DataPipeline, saveFunc func([]model.EdgeRule) error) *EdgeComputeManager {
	return &EdgeComputeManager{
		rules:       make(map[string]model.EdgeRule),
		pipeline:    pipeline,
		saveFunc:    saveFunc,
		ruleStates:  make(map[string]*model.RuleRuntimeState),
		windows:     make(map[string][]model.Value),
		valueCache:  make(map[string]model.Value),
		ruleIndex:   make(map[string][]string),
		workerPool:  make(chan *ruleTask, 1000), // Buffer size 1000
		workerCount: 10,                         // Default 10 workers
	}
}

type SharedSourceInfo struct {
	SourceID        string   `json:"source_id"`
	Subscribers     []string `json:"subscribers"`
	SubscriberCount int      `json:"subscriber_count"`
}

func (em *EdgeComputeManager) GetSharedSources() []SharedSourceInfo {
	em.indexMu.RLock()
	defer em.indexMu.RUnlock()

	var result []SharedSourceInfo
	for source, rules := range em.ruleIndex {
		info := SharedSourceInfo{
			SourceID:        source,
			Subscribers:     make([]string, len(rules)),
			SubscriberCount: len(rules),
		}
		copy(info.Subscribers, rules)
		result = append(result, info)
	}
	return result
}

func (em *EdgeComputeManager) GetMetrics() EdgeComputeMetrics {
	em.statsMu.RLock()
	defer em.statsMu.RUnlock()
	em.mu.RLock()
	ruleCount := len(em.rules)
	em.mu.RUnlock()
	em.indexMu.RLock()
	sourceCount := len(em.ruleIndex)
	em.indexMu.RUnlock()
	em.cacheMu.RLock()
	cacheSize := len(em.valueCache)
	em.cacheMu.RUnlock()

	return EdgeComputeMetrics{
		WorkerPoolSize:    cap(em.workerPool),
		WorkerPoolUsage:   len(em.workerPool),
		RuleCount:         ruleCount,
		SharedSourceCount: sourceCount,
		CacheSize:         cacheSize,
		RulesTriggered:    em.rulesTriggered,
		RulesExecuted:     em.rulesExecuted,
		RulesDropped:      em.rulesDropped,
	}
}

func (em *EdgeComputeManager) SetNorthboundManager(nbm *NorthboundManager) {
	em.nbm = nbm
}

func (em *EdgeComputeManager) SetChannelManager(cm *ChannelManager) {
	em.cm = cm
}

func (em *EdgeComputeManager) SetStorage(s *storage.Storage) {
	em.store = s
}

func (em *EdgeComputeManager) LoadRules(rules []model.EdgeRule) {
	em.mu.Lock()
	defer em.mu.Unlock()
	for _, r := range rules {
		em.rules[r.ID] = r
	}
	em.rebuildIndex()
	log.Printf("Loaded %d edge computing rules", len(rules))
}

func (em *EdgeComputeManager) Start() {
	// Restore state from DB
	em.restoreState()

	// Start Workers
	for i := 0; i < em.workerCount; i++ {
		em.wg.Add(1)
		go em.workerLoop(i)
	}

	// Register handler to data pipeline
	em.pipeline.AddHandler(em.handleValue)

	// Start retry loop
	go em.retryLoop()

	log.Println("Edge Compute Manager started with", em.workerCount, "workers")
}

func (em *EdgeComputeManager) Stop() {
	close(em.workerPool)
	em.wg.Wait()
}

func (em *EdgeComputeManager) workerLoop(id int) {
	defer em.wg.Done()
	for task := range em.workerPool {
		em.executeRule(task.rule, task.val)
		em.statsMu.Lock()
		em.rulesExecuted++
		em.statsMu.Unlock()
	}
}

func (em *EdgeComputeManager) rebuildIndex() {
	em.indexMu.Lock()
	defer em.indexMu.Unlock()

	em.ruleIndex = make(map[string][]string)
	for _, rule := range em.rules {
		em.indexRule(rule)
	}
}

func (em *EdgeComputeManager) indexRule(rule model.EdgeRule) {
	// Helper to add key
	addKey := func(cid, did, pid string) {
		key := fmt.Sprintf("%s/%s/%s", cid, did, pid)
		// Check duplicates
		for _, id := range em.ruleIndex[key] {
			if id == rule.ID {
				return
			}
		}
		em.ruleIndex[key] = append(em.ruleIndex[key], rule.ID)
	}

	if len(rule.Sources) > 0 {
		for _, src := range rule.Sources {
			addKey(src.ChannelID, src.DeviceID, src.PointID)
		}
	} else {
		// Legacy
		addKey(rule.Source.ChannelID, rule.Source.DeviceID, rule.Source.PointID)
	}
}

func (em *EdgeComputeManager) removeFromIndex(ruleID string) {
	em.indexMu.Lock()
	defer em.indexMu.Unlock()

	for key, ids := range em.ruleIndex {
		newIDs := make([]string, 0)
		for _, id := range ids {
			if id != ruleID {
				newIDs = append(newIDs, id)
			}
		}
		if len(newIDs) == 0 {
			delete(em.ruleIndex, key)
		} else {
			em.ruleIndex[key] = newIDs
		}
	}
}

func (em *EdgeComputeManager) restoreState() {
	if em.store == nil {
		return
	}

	// Restore Rule States
	em.store.LoadAll("RuleState", func(k, v []byte) error {
		var state model.RuleRuntimeState
		if err := json.Unmarshal(v, &state); err == nil {
			em.stateMu.Lock()
			em.ruleStates[string(k)] = &state
			em.stateMu.Unlock()
		}
		return nil
	})

	// Restore Window Data
	em.store.LoadAll("WindowData", func(k, v []byte) error {
		var data []model.Value
		if err := json.Unmarshal(v, &data); err == nil {
			em.stateMu.Lock()
			em.windows[string(k)] = data
			em.stateMu.Unlock()
		}
		return nil
	})

	log.Println("Edge Compute Manager state restored")
}

func (em *EdgeComputeManager) saveWindowData(ruleID string) {
	if em.store == nil {
		return
	}
	em.stateMu.RLock()
	data, exists := em.windows[ruleID]
	em.stateMu.RUnlock()

	if exists {
		if err := em.store.SaveData("WindowData", ruleID, data); err != nil {
			log.Printf("Failed to save window data: %v", err)
		}
	}
}

func (em *EdgeComputeManager) handleValue(val model.Value) {
	// Update Cache (Thread Safe)
	cacheKey := fmt.Sprintf("%s/%s/%s", val.ChannelID, val.DeviceID, val.PointID)
	em.cacheMu.Lock()
	em.valueCache[cacheKey] = val
	em.cacheMu.Unlock()

	// Find Matched Rules via Index (O(1) lookup)
	em.indexMu.RLock()
	ruleIDs, exists := em.ruleIndex[cacheKey]
	em.indexMu.RUnlock()

	if !exists || len(ruleIDs) == 0 {
		return
	}

	em.mu.RLock()
	var matchedRules []model.EdgeRule
	for _, id := range ruleIDs {
		if rule, ok := em.rules[id]; ok {
			if rule.Enable {
				matchedRules = append(matchedRules, rule)
			}
		}
	}
	em.mu.RUnlock()

	// Sort by Priority (High to Low)
	if len(matchedRules) > 1 {
		sort.Slice(matchedRules, func(i, j int) bool {
			return matchedRules[i].Priority > matchedRules[j].Priority
		})
	}

	// Dispatch to Worker Pool
	for _, rule := range matchedRules {
		em.statsMu.Lock()
		em.rulesTriggered++
		em.statsMu.Unlock()

		select {
		case em.workerPool <- &ruleTask{rule: rule, val: val}:
			// Queued successfully
		default:
			em.statsMu.Lock()
			em.rulesDropped++
			em.statsMu.Unlock()
			log.Printf("[EdgeCompute] Worker pool full, dropping rule execution for rule %s", rule.ID)
		}
	}
}

func matchRule(rule model.EdgeRule, val model.Value) bool {
	// New Multi-source match
	if len(rule.Sources) > 0 {
		for _, src := range rule.Sources {
			if matchSource(src, val) {
				return true
			}
		}
		return false
	}
	// Legacy match
	return matchSource(rule.Source, val)
}

func matchSource(src model.RuleSource, val model.Value) bool {
	// If ID is empty, it matches all (wildcard) - but usually we want specific match
	// For now, strict match if ID is provided
	if src.ChannelID != "" && src.ChannelID != val.ChannelID {
		return false
	}
	if src.DeviceID != "" && src.DeviceID != val.DeviceID {
		return false
	}
	if src.PointID != "" && src.PointID != val.PointID {
		return false
	}
	return true
}

func (em *EdgeComputeManager) saveRuleState(state *model.RuleRuntimeState) {
	if em.store != nil {
		if err := em.store.SaveData("RuleState", state.RuleID, state); err != nil {
			log.Printf("Failed to save rule state: %v", err)
		}
	}
}

func (em *EdgeComputeManager) executeRule(rule model.EdgeRule, val model.Value) {
	em.stateMu.Lock()
	state, exists := em.ruleStates[rule.ID]
	if !exists {
		state = &model.RuleRuntimeState{
			RuleID:        rule.ID,
			RuleName:      rule.Name,
			Enable:        rule.Enable,
			CurrentStatus: "NORMAL",
		}
		em.ruleStates[rule.ID] = state
	}
	em.stateMu.Unlock()

	// Prepare Env for Expression
	env := make(map[string]any)
	env["value"] = val.Value // Current triggering value

	// Populate env with aliases from cache
	if len(rule.Sources) > 0 {
		em.cacheMu.RLock()
		for _, src := range rule.Sources {
			if src.Alias == "" && src.PointID == "" {
				continue
			}

			var srcVal any
			found := false

			// Check if the triggering value belongs to this source
			// If so, use the triggering value as it is the most up-to-date
			if matchSource(src, val) {
				srcVal = val.Value
				found = true
			} else {
				key := fmt.Sprintf("%s/%s/%s", src.ChannelID, src.DeviceID, src.PointID)
				if v, ok := em.valueCache[key]; ok {
					srcVal = v.Value
					found = true
				}
			}

			if found {
				if src.Alias != "" {
					env[src.Alias] = srcVal
				}
				if src.PointID != "" {
					env[src.PointID] = srcVal
				}
			} else {
				// Missing value
				if src.Alias != "" {
					env[src.Alias] = nil
				}
				if src.PointID != "" {
					env[src.PointID] = nil
				}
			}
		}
		em.cacheMu.RUnlock()
	}

	// Logic refactored: Logic is now fully determined by the Condition expression using aliases.
	// AND/OR branching is removed.

	var triggered bool
	var err error
	var outputVal model.Value = val

	switch rule.Type {
	case "threshold":
		triggered, err = evaluateThreshold(rule.Condition, env)
	case "calculation":
		// Calculation rules always "trigger" if calculation succeeds,
		// and they output a new value.
		var res any
		res, err = evaluateCalculation(rule.Expression, env)
		if err == nil {
			outputVal.Value = res
			triggered = true
		}
	case "window":
		triggered, outputVal, err = em.evaluateWindow(rule, val, env)
	case "state":
		triggered, err = em.evaluateState(rule, val, state, env)
	default:
		// Default to threshold if condition exists, otherwise ignore
		if rule.Condition != "" {
			triggered, err = evaluateThreshold(rule.Condition, env)
		}
	}

	em.stateMu.Lock()
	defer em.stateMu.Unlock()

	// Persist state changes
	defer em.saveRuleState(state)

	if err != nil {
		state.ErrorMessage = err.Error()
		log.Printf("Rule %s evaluation error: %v", rule.Name, err)
		return
	}

	if triggered {
		prevStatus := state.CurrentStatus

		state.LastTrigger = time.Now()
		state.TriggerCount++
		state.CurrentStatus = "ALARM"
		state.LastValue = outputVal.Value
		state.ErrorMessage = ""

		// Check TriggerMode
		shouldExecute := true
		if rule.TriggerMode == "on_change" {
			// Only execute if previous status was NOT ALARM
			if prevStatus == "ALARM" {
				shouldExecute = false
			}
		}

		if shouldExecute {
			go em.executeActions(rule.ID, rule.Actions, outputVal, env)
		}
	} else {
		// For State rules, we might be in "Pending" state (waiting for duration),
		// but if triggered is false, it means we are either NORMAL or PENDING.
		// If we are resetting, we are NORMAL.
		if rule.Type == "state" {
			// Check internal state to decide if NORMAL or WARNING
			if !state.ConditionStart.IsZero() {
				state.CurrentStatus = "WARNING"
			} else {
				state.CurrentStatus = "NORMAL"
			}
		} else {
			state.CurrentStatus = "NORMAL"
		}
	}
}

func (em *EdgeComputeManager) evaluateWindow(rule model.EdgeRule, val model.Value, baseEnv map[string]any) (bool, model.Value, error) {
	if rule.Window == nil {
		return false, val, fmt.Errorf("missing window config")
	}

	em.stateMu.Lock()
	history := em.windows[rule.ID]
	history = append(history, val)

	// Window Logic (Simplified: Count based or Time based)
	// For now, assume Size is duration "10s" or count "10"
	// Parse Size
	sizeDur, errDur := time.ParseDuration(rule.Window.Size)
	isTimeWindow := errDur == nil

	var filtered []model.Value
	if isTimeWindow {
		cutoff := val.TS.Add(-sizeDur)
		for _, v := range history {
			if v.TS.After(cutoff) || v.TS.Equal(cutoff) {
				filtered = append(filtered, v)
			}
		}
	} else {
		// Count window
		count := 10 // Default
		fmt.Sscanf(rule.Window.Size, "%d", &count)
		if len(history) > count {
			filtered = history[len(history)-count:]
		} else {
			filtered = history
		}
	}

	em.windows[rule.ID] = filtered
	em.stateMu.Unlock()

	// Persist window data asynchronously
	go em.saveWindowData(rule.ID)

	// Aggregation
	var result float64
	var count int
	var minVal, maxVal float64
	var firstVal, lastVal float64
	var firstTime, lastTime time.Time

	for i, v := range filtered {
		f, ok := toFloat(v.Value)
		if ok {
			if i == 0 {
				minVal = f
				maxVal = f
				firstVal = f
				firstTime = v.TS
			}
			lastVal = f
			lastTime = v.TS

			switch rule.Window.AggrFunc {
			case "sum", "avg":
				result += f
			case "max":
				if f > maxVal {
					maxVal = f
				}
			case "min":
				if f < minVal {
					minVal = f
				}
			}
			count++
		}
	}

	switch rule.Window.AggrFunc {
	case "max":
		result = maxVal
	case "min":
		result = minVal
	case "avg":
		if count > 0 {
			result = result / float64(count)
		}
	case "count":
		result = float64(count)
	case "rate":
		// (Last - First) / Duration (in seconds)
		if count > 1 {
			duration := lastTime.Sub(firstTime).Seconds()
			if duration > 0 {
				result = (lastVal - firstVal) / duration
			} else {
				result = 0
			}
		} else {
			result = 0
		}
	}

	// Evaluate Condition against Result
	env := make(map[string]any)
	for k, v := range baseEnv {
		env[k] = v
	}
	env["value"] = result

	triggered, err := evaluateThreshold(rule.Condition, env)

	outputVal := val
	outputVal.Value = result

	return triggered, outputVal, err
}

func (em *EdgeComputeManager) evaluateState(rule model.EdgeRule, val model.Value, state *model.RuleRuntimeState, baseEnv map[string]any) (bool, error) {
	// First check basic condition
	env := make(map[string]any)
	for k, v := range baseEnv {
		env[k] = v
	}
	env["value"] = val.Value

	conditionMet, err := evaluateThreshold(rule.Condition, env)
	if err != nil {
		return false, err
	}

	em.stateMu.Lock()
	defer em.stateMu.Unlock()

	if !conditionMet {
		// Condition not met, reset state
		state.ConditionStart = time.Time{}
		state.ConditionCount = 0
		return false, nil
	}

	// Condition is met
	if state.ConditionStart.IsZero() {
		state.ConditionStart = time.Now()
	}
	state.ConditionCount++

	// Check constraints
	if rule.State != nil {
		// Check Duration
		if rule.State.Duration != "" {
			dur, err := time.ParseDuration(rule.State.Duration)
			if err == nil {
				if time.Since(state.ConditionStart) < dur {
					return false, nil // Wait for duration
				}
			}
		}

		// Check Count
		if rule.State.Count > 0 {
			if state.ConditionCount < rule.State.Count {
				return false, nil // Wait for count
			}
		}
	}

	// All constraints met
	return true, nil
}

func toFloat(v any) (float64, bool) {
	switch i := v.(type) {
	case float64:
		return i, true
	case float32:
		return float64(i), true
	case int:
		return float64(i), true
	case int64:
		return float64(i), true
	default:
		return 0, false
	}
}

func (em *EdgeComputeManager) GetRuleStates() map[string]*model.RuleRuntimeState {
	em.stateMu.RLock()
	defer em.stateMu.RUnlock()

	copy := make(map[string]*model.RuleRuntimeState)
	for k, v := range em.ruleStates {
		// Deep copy or shallow copy? Ptr is fine if we don't modify it outside
		c := *v
		copy[k] = &c
	}
	return copy
}

func (em *EdgeComputeManager) GetWindowData(ruleID string) []model.Value {
	em.stateMu.RLock()
	defer em.stateMu.RUnlock()

	if data, ok := em.windows[ruleID]; ok {
		// Return a copy
		res := make([]model.Value, len(data))
		copy(res, data)
		return res
	}
	return []model.Value{}
}

func evaluateThreshold(condition string, env map[string]any) (bool, error) {
	program, err := expr.Compile(condition, expr.Env(env))
	if err != nil {
		return false, err
	}
	output, err := expr.Run(program, env)
	if err != nil {
		return false, err
	}
	if res, ok := output.(bool); ok {
		return res, nil
	}
	return false, fmt.Errorf("condition must return boolean")
}

func evaluateCalculation(expression string, env map[string]any) (any, error) {
	program, err := expr.Compile(expression, expr.Env(env))
	if err != nil {
		return nil, err
	}
	output, err := expr.Run(program, env)
	if err != nil {
		return nil, err
	}
	return output, nil
}

func (em *EdgeComputeManager) executeActions(ruleID string, actions []model.RuleAction, val model.Value, env map[string]any) {
	for _, action := range actions {
		go func(act model.RuleAction) {
			err := em.executeSingleAction(ruleID, act, val, env)
			if err != nil {
				log.Printf("[EdgeAction] Action failed: %v", err)
				em.saveFailedAction(ruleID, act, val, env, err.Error())
			}
		}(action)
	}
}

func (em *EdgeComputeManager) resolveValueTemplate(val any, env map[string]any) any {
	strVal, ok := val.(string)
	if !ok {
		return val
	}
	// Check if it looks like a template
	if !strings.Contains(strVal, "${") {
		return val
	}

	// Resolve template
	resolved := os.Expand(strVal, func(k string) string {
		if v, ok := env[k]; ok {
			return fmt.Sprintf("%v", v)
		}
		return ""
	})

	return resolved
}

func (em *EdgeComputeManager) executeSingleAction(ruleID string, action model.RuleAction, val model.Value, env map[string]any) error {
	switch action.Type {
	case "database":
		if em.store == nil {
			return fmt.Errorf("storage not available")
		}
		bucket, _ := action.Config["bucket"].(string)
		if bucket == "" {
			bucket = "rule_events"
		}
		// Use timestamp as key if not provided
		key := fmt.Sprintf("%s_%d", ruleID, time.Now().UnixNano())

		data := map[string]interface{}{
			"rule_id": ruleID,
			"value":   val,
			"time":    time.Now(),
		}

		return em.store.SaveData(bucket, key, data)
	case "log":
		log.Printf("[EdgeAction] LOG: Rule triggered for %s, Value: %v", val.PointID, val.Value)
		return nil
	case "mqtt":
		if em.nbm == nil {
			return fmt.Errorf("NorthboundManager not available")
		}
		topic, _ := action.Config["topic"].(string)
		if topic == "" {
			return nil // Skip if no topic
		}
		clientID, _ := action.Config["client_id"].(string)
		strategy, _ := action.Config["send_strategy"].(string)

		var payload []byte
		var err error

		if strategy == "batch" {
			// Send all source values from env
			// Filter out "value" which is a duplicate of one source
			batchData := make(map[string]any)
			for k, v := range env {
				if k != "value" {
					batchData[k] = v
				}
			}
			// If env only had "value" (no aliases), use val
			if len(batchData) == 0 {
				payload, err = json.Marshal(val)
			} else {
				payload, err = json.Marshal(batchData)
			}
		} else {
			// Default: Send triggering value
			payload, err = json.Marshal(val)
		}
		if err != nil {
			return err
		}

		// If message is provided in config, use it (Template overrides payload)
		if msg, ok := action.Config["message"].(string); ok && msg != "" {
			// Resolve templates
			resolvedMsg := os.Expand(msg, func(k string) string {
				if v, ok := env[k]; ok {
					return fmt.Sprintf("%v", v)
				}
				return ""
			})
			payload = []byte(resolvedMsg)
		}

		return em.nbm.PublishMQTT(clientID, topic, payload)
	case "device_control":
		if em.cm == nil {
			return fmt.Errorf("ChannelManager not available")
		}

		// Check for multiple targets
		if targets, ok := action.Config["targets"].([]interface{}); ok && len(targets) > 0 {
			var errs []error
			for _, t := range targets {
				targetMap, ok := t.(map[string]interface{})
				if !ok {
					continue
				}
				cid, _ := targetMap["channel_id"].(string)
				did, _ := targetMap["device_id"].(string)
				pid, _ := targetMap["point_id"].(string)
				valToWrite := targetMap["value"]

				if cid != "" && did != "" && pid != "" {
					// Resolve value template if string
					if valToWrite != nil {
						valToWrite = em.resolveValueTemplate(valToWrite, env)
					} else {
						valToWrite = val.Value
					}

					if err := em.cm.WritePoint(cid, did, pid, valToWrite); err != nil {
						errs = append(errs, fmt.Errorf("failed to write %s/%s/%s: %v", cid, did, pid, err))
					}
				}
			}
			if len(errs) > 0 {
				return fmt.Errorf("batch control errors: %v", errs)
			}
			return nil
		}

		// Single target (Legacy)
		channelID, _ := action.Config["channel_id"].(string)
		deviceID, _ := action.Config["device_id"].(string)
		pointID, _ := action.Config["point_id"].(string)
		valToWrite := action.Config["value"]

		if channelID == "" || deviceID == "" || pointID == "" {
			return fmt.Errorf("missing channel_id, device_id or point_id")
		}

		// Resolve value if it is a string template or nil
		if valToWrite == nil {
			valToWrite = val.Value
		} else {
			// Try to resolve template if valToWrite is string
			valToWrite = em.resolveValueTemplate(valToWrite, env)
		}

		return em.cm.WritePoint(channelID, deviceID, pointID, valToWrite)
	case "http":
		url, _ := action.Config["url"].(string)
		if url == "" {
			return nil
		}
		method, _ := action.Config["method"].(string)
		if method == "" {
			method = "POST"
		}
		strategy, _ := action.Config["send_strategy"].(string)

		var payload []byte
		var err error

		if strategy == "batch" {
			batchData := make(map[string]any)
			for k, v := range env {
				if k != "value" {
					batchData[k] = v
				}
			}
			if len(batchData) == 0 {
				payload, err = json.Marshal(val)
			} else {
				payload, err = json.Marshal(batchData)
			}
		} else {
			payload, err = json.Marshal(val)
		}
		if err != nil {
			return err
		}

		if msg, ok := action.Config["body"].(string); ok && msg != "" {
			// Resolve templates
			resolvedMsg := os.Expand(msg, func(k string) string {
				if v, ok := env[k]; ok {
					return fmt.Sprintf("%v", v)
				}
				return ""
			})
			payload = []byte(resolvedMsg)
		}

		req, err := http.NewRequest(method, url, bytes.NewBuffer(payload))
		if err != nil {
			return err
		}
		req.Header.Set("Content-Type", "application/json")
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		return nil
	}
	return nil
}

func (em *EdgeComputeManager) saveFailedAction(ruleID string, action model.RuleAction, val model.Value, env map[string]any, errStr string) {
	if em.store == nil {
		return
	}
	// Only retry idempotent actions or safe ones
	// For now support mqtt and device_control
	if action.Type != "mqtt" && action.Type != "device_control" {
		return
	}

	fa := model.FailedAction{
		ID:         fmt.Sprintf("%d", time.Now().UnixNano()),
		RuleID:     ruleID,
		Action:     action,
		Value:      val,
		Timestamp:  time.Now(),
		RetryCount: 0,
		LastError:  errStr,
		Env:        env,
	}
	if err := em.store.SaveData("DataCache", fa.ID, fa); err != nil {
		log.Printf("Failed to save failed action: %v", err)
	}
}

func (em *EdgeComputeManager) retryLoop() {
	ticker := time.NewTicker(30 * time.Second)
	for range ticker.C {
		em.processFailedActions()
	}
}

func (em *EdgeComputeManager) processFailedActions() {
	if em.store == nil {
		return
	}
	em.store.LoadAll("DataCache", func(k, v []byte) error {
		var fa model.FailedAction
		if err := json.Unmarshal(v, &fa); err != nil {
			return nil
		}

		// Retry logic
		err := em.executeSingleAction(fa.RuleID, fa.Action, fa.Value, fa.Env)
		if err == nil {
			// Success, remove
			em.store.DeleteData("DataCache", fa.ID)
			log.Printf("Retry success for action %s", fa.ID)
		} else {
			// Fail, update count
			fa.RetryCount++
			fa.LastError = err.Error()
			if fa.RetryCount > 10 { // Max retries
				em.store.DeleteData("DataCache", fa.ID)
				log.Printf("Max retries reached for action %s, dropping", fa.ID)
			} else {
				em.store.SaveData("DataCache", fa.ID, fa)
			}
		}
		return nil
	})
}

func (em *EdgeComputeManager) GetFailedActions() []model.FailedAction {
	var result []model.FailedAction
	if em.store == nil {
		return result
	}
	em.store.LoadAll("DataCache", func(k, v []byte) error {
		var fa model.FailedAction
		if err := json.Unmarshal(v, &fa); err == nil {
			result = append(result, fa)
		}
		return nil
	})
	return result
}

// CRUD Operations

func (em *EdgeComputeManager) UpsertRule(rule model.EdgeRule) error {
	em.mu.Lock()
	defer em.mu.Unlock()

	// If update, remove old index entries first
	if _, exists := em.rules[rule.ID]; exists {
		// Note: We need to remove index entries for the OLD rule, not the new one
		// But here we are holding the lock and overwriting.
		// Ideally we should have removed it before.
		// Since we overwrite the map, let's just use removeFromIndex with ruleID
		// But removeFromIndex locks indexMu, so we need to be careful about deadlock if we hold mu.
		// Actually, removeFromIndex uses indexMu, UpsertRule uses mu. Separate locks.
		// BUT we need to call removeFromIndex OUTSIDE of mu if possible or just handle it carefully.
		// However, removeFromIndex iterates ruleIndex.

		// To be safe and clean:
		// 1. We have the old rule in em.rules[rule.ID]
		// 2. We can't call removeFromIndex while holding mu if removeFromIndex might need mu?
		//    No, removeFromIndex only needs indexMu. UpsertRule holds mu.
		//    So it is safe to call removeFromIndex inside UpsertRule.
		em.removeFromIndex(rule.ID)
	}

	em.rules[rule.ID] = rule

	// Add new index
	em.indexRule(rule)

	return em.persist()
}

func (em *EdgeComputeManager) DeleteRule(id string) error {
	em.mu.Lock()
	defer em.mu.Unlock()

	if _, ok := em.rules[id]; !ok {
		return fmt.Errorf("rule not found")
	}

	em.removeFromIndex(id)
	delete(em.rules, id)

	return em.persist()
}

func (em *EdgeComputeManager) GetRules() []model.EdgeRule {
	em.mu.RLock()
	defer em.mu.RUnlock()

	rules := make([]model.EdgeRule, 0, len(em.rules))
	for _, r := range em.rules {
		rules = append(rules, r)
	}
	return rules
}

func (em *EdgeComputeManager) persist() error {
	if em.saveFunc == nil {
		return nil
	}
	rules := make([]model.EdgeRule, 0, len(em.rules))
	for _, r := range em.rules {
		rules = append(rules, r)
	}
	return em.saveFunc(rules)
}
