package core

import (
	"fmt"
	"industrial-edge-gateway/internal/model"
	"os"
	"strings"
	"sync"
	"testing"
	"time"

	"gopkg.in/yaml.v3"
)

func TestEdgeRulesCoverage(t *testing.T) {
	// 1. Setup Report File
	if err := os.MkdirAll("../../test", 0755); err != nil {
		t.Fatalf("Failed to create test directory: %v", err)
	}

	reportFile, err := os.Create("../../test/边缘测试结果.md")
	if err != nil {
		t.Fatalf("Failed to create report file: %v", err)
	}
	defer reportFile.Close()

	writeLine := func(s string) {
		reportFile.WriteString(s + "\n")
	}

	writeLine("# 边缘计算规则测试覆盖报告")
	writeLine(fmt.Sprintf("测试时间: %s", time.Now().Format("2006-01-02 15:04:05")))
	writeLine("")

	// 2. Load Rules
	rulesData, err := os.ReadFile("../../conf/edge_rules.yaml")
	if err != nil {
		t.Fatalf("Failed to read rules file: %v", err)
	}

	var rules []model.EdgeRule
	if err := yaml.Unmarshal(rulesData, &rules); err != nil {
		t.Fatalf("Failed to parse rules: %v", err)
	}

	writeLine(fmt.Sprintf("共加载 %d 条规则。", len(rules)))
	writeLine("")

	// 3. Setup Engine
	pipeline := NewDataPipeline(100)
	em := NewEdgeComputeManager(pipeline, nil, func(rules []model.EdgeRule) error { return nil })
	em.Start()
	defer em.Stop()

	// Capture Actions
	var actionMu sync.Mutex
	var capturedActions []string

	em.SetActionHook(func(ruleID string, action model.RuleAction, val model.Value, env map[string]any, err error) {
		actionMu.Lock()
		defer actionMu.Unlock()

		status := "✅"
		if err != nil {
			// Expected failure in test env (no managers), but we mark it as triggered
			if strings.Contains(err.Error(), "not available") {
				status = "⚠️ (Triggered but Manager missing)"
			} else {
				status = fmt.Sprintf("❌ (%v)", err)
			}
		}

		details := ""
		switch action.Type {
		case "mqtt":
			details = fmt.Sprintf("Topic: %v, Msg: %v", action.Config["topic"], action.Config["message"])
		case "device_control":
			targets, _ := action.Config["targets"].([]interface{})
			details = fmt.Sprintf("Targets: %d devices", len(targets))
		case "log":
			details = "Log output"
		}

		capturedActions = append(capturedActions, fmt.Sprintf("- **Action**: %s | %s | %s", action.Type, details, status))
	})

	// 4. Test Each Rule
	for _, rule := range rules {
		writeLine(fmt.Sprintf("## 规则: %s (%s)", rule.Name, rule.ID))
		writeLine(fmt.Sprintf("- 类型: %s", rule.Type))
		writeLine(fmt.Sprintf("- 条件: `%s`", rule.Condition))
		writeLine(fmt.Sprintf("- 启用: %v", rule.Enable))

		if !rule.Enable {
			writeLine("- 状态: **跳过 (未启用)**")
			continue
		}

		// Modify Rule for Testing
		if rule.State != nil {
			writeLine(fmt.Sprintf("- 原始约束: Duration=%s, Count=%d", rule.State.Duration, rule.State.Count))
			rule.State.Duration = "1s"
			rule.State.Count = 2
			writeLine("- **测试调整**: Duration=1s, Count=2")
		}

		em.LoadRules([]model.EdgeRule{rule})

		writeLine("### 测试执行流程")
		writeLine("| 步骤 | 输入 | 预期状态 | 实际状态 | 结果 | 触发动作 |")
		writeLine("|---|---|---|---|---|---|")

		passed := true

		// Helper to feed
		feed := func(alias string, val any) {
			var src model.RuleSource
			found := false
			for _, s := range rule.Sources {
				if s.Alias == alias {
					src = s
					found = true
					break
				}
			}
			if !found && rule.Source.Alias == alias {
				src = rule.Source
				found = true
			}

			if !found {
				t.Logf("Warning: Alias %s not found in rule sources", alias)
				return
			}

			v := model.Value{
				ChannelID: src.ChannelID,
				DeviceID:  src.DeviceID,
				PointID:   src.PointID,
				Value:     val,
				TS:        time.Now(),
			}
			em.handleValue(v)
			time.Sleep(50 * time.Millisecond) // Wait for worker
		}

		// Initial State Check
		checkState(t, em, rule.ID, "NORMAL", "初始化 (无状态)", writeLine, &passed, true, nil)

		// Specific Test Logic for "TMPW"
		if rule.Name == "TMPW" {
			// Clear previous actions
			actionMu.Lock()
			capturedActions = nil
			actionMu.Unlock()

			// Scene 1: Fail Condition
			feed("t1", "0")
			feed("t2", "0")
			checkState(t, em, rule.ID, "NORMAL", "输入 t1=0, t2=0", writeLine, &passed, false, getActions(&actionMu, &capturedActions))

			// Scene 2: Meet Condition (Count 1)
			feed("t1", "2")
			feed("t2", "4")
			checkState(t, em, rule.ID, "WARNING", "输入 t1=2, t2=4 (第1次)", writeLine, &passed, false, getActions(&actionMu, &capturedActions))

			// Scene 3: Meet Condition (Count 2) - But Duration not met
			feed("t1", "2")
			feed("t2", "4")
			checkState(t, em, rule.ID, "WARNING", "输入 t1=2, t2=4 (第2次, 此时耗时<1s)", writeLine, &passed, false, getActions(&actionMu, &capturedActions))

			// Scene 4: Wait Duration
			time.Sleep(1100 * time.Millisecond)

			// Scene 5: Trigger after Duration
			feed("t1", "2")
			feed("t2", "4")
			// Wait extra for actions
			time.Sleep(100 * time.Millisecond)
			checkState(t, em, rule.ID, "ALARM", "输入 t1=2, t2=4 (耗时>1s)", writeLine, &passed, false, getActions(&actionMu, &capturedActions))

			// Scene 6: Reset
			feed("t1", "0")
			checkState(t, em, rule.ID, "NORMAL", "输入 t1=0 (条件失效)", writeLine, &passed, false, getActions(&actionMu, &capturedActions))
		} else {
			writeLine("未定义的测试场景 (Generic Test Skipped)")
		}

		if passed {
			writeLine("\n**测试结果: ✅ 通过**")
		} else {
			writeLine("\n**测试结果: ❌ 失败**")
		}
		writeLine("\n---\n")
	}
}

func getActions(mu *sync.Mutex, actions *[]string) []string {
	mu.Lock()
	defer mu.Unlock()
	res := make([]string, len(*actions))
	copy(res, *actions)
	*actions = nil // Clear after reading
	return res
}

func checkState(t *testing.T, em *EdgeComputeManager, ruleID, expected, stepName string, logFunc func(string), passed *bool, allowNil bool, actions []string) {
	states := em.GetRuleStates()
	s := states[ruleID]
	actual := "NORMAL"

	if s != nil {
		actual = s.CurrentStatus
	} else if allowNil && expected == "NORMAL" {
		actual = "NORMAL"
	} else if s == nil {
		actual = "NOT_CREATED"
	}

	resIcon := "✅"
	if actual != expected {
		resIcon = "❌"
		*passed = false
	}

	actionStr := ""
	if len(actions) > 0 {
		actionStr = "<br>" + strings.Join(actions, "<br>")
	}

	logFunc(fmt.Sprintf("| %s | %s | %s | %s | %s |", stepName, expected, actual, resIcon, actionStr))
}
