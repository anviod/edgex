package core

import (
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	"github.com/anviod/edgex/internal/model"

	"github.com/expr-lang/expr"
)

type VirtualShadowEngine struct {
	mu sync.RWMutex

	virtualDevices  map[string]*model.VirtualDevice
	dependencyGraph map[string][]string
	shadowCore      *ShadowCore

	formulaCache map[string]interface{}
}

func NewVirtualShadowEngine(sc *ShadowCore) *VirtualShadowEngine {
	vse := &VirtualShadowEngine{
		virtualDevices:  make(map[string]*model.VirtualDevice),
		dependencyGraph: make(map[string][]string),
		shadowCore:      sc,
		formulaCache:    make(map[string]interface{}),
	}

	sc.Subscribe(vse.handleShadowUpdate)

	return vse
}

func (vse *VirtualShadowEngine) CreateVirtualDevice(deviceID string, formulaPoints map[string]string) error {
	vse.mu.Lock()
	defer vse.mu.Unlock()

	if _, exists := vse.virtualDevices[deviceID]; exists {
		return fmt.Errorf("virtual device already exists: %s", deviceID)
	}

	dependencies := vse.extractDependencies(formulaPoints)

	device := &model.VirtualDevice{
		VirtualDeviceID: deviceID,
		Version:         0,
		UpdatedAt:       time.Now(),
		FormulaPoints:   formulaPoints,
		Dependencies:    dependencies,
		Points:          make(map[string]model.ShadowPoint),
	}

	vse.virtualDevices[deviceID] = device

	for _, dep := range dependencies {
		vse.dependencyGraph[dep] = append(vse.dependencyGraph[dep], deviceID)
	}

	log.Printf("[VirtualShadowEngine] Created virtual device: %s with %d dependencies", deviceID, len(dependencies))

	return nil
}

func (vse *VirtualShadowEngine) extractDependencies(formulaPoints map[string]string) []string {
	depSet := make(map[string]bool)

	for _, formula := range formulaPoints {
		refs := vse.parseFormulaReferences(formula)
		for _, ref := range refs {
			depSet[ref] = true
		}
	}

	deps := make([]string, 0, len(depSet))
	for dep := range depSet {
		deps = append(deps, dep)
	}
	return deps
}

func (vse *VirtualShadowEngine) parseFormulaReferences(formula string) []string {
	var refs []string

	parts := strings.FieldsFunc(formula, func(r rune) bool {
		return r == '+' || r == '-' || r == '*' || r == '/' || r == '(' || r == ')' || r == ' ' || r == ',' || r == '=' || r == '<' || r == '>' || r == '&' || r == '|'
	})

	for _, part := range parts {
		if strings.Contains(part, ".") && !isNumber(part) {
			refs = append(refs, part)
		}
	}

	return refs
}

func isNumber(s string) bool {
	return strings.Contains(s, ".") && len(strings.Split(s, ".")) == 2
}

func (vse *VirtualShadowEngine) handleShadowUpdate(deviceID string, points map[string]model.ShadowPoint) {
	vse.mu.RLock()
	affectedDevices := vse.dependencyGraph[deviceID]
	vse.mu.RUnlock()

	for _, vdID := range affectedDevices {
		go vse.recomputeVirtualDevice(vdID)
	}
}

func (vse *VirtualShadowEngine) recomputeVirtualDevice(deviceID string) {
	vse.mu.Lock()
	defer vse.mu.Unlock()

	device, exists := vse.virtualDevices[deviceID]
	if !exists {
		return
	}

	env := vse.buildEvaluationEnv(device.Dependencies)

	updated := false
	for pointID, formula := range device.FormulaPoints {
		result, err := vse.evaluateFormula(formula, env)
		if err != nil {
			log.Printf("[VirtualShadowEngine] Formula evaluation failed for %s.%s: %v", deviceID, pointID, err)
			continue
		}

		device.Version++
		device.Points[pointID] = model.ShadowPoint{
			Value:     result,
			Timestamp: time.Now(),
			Version:   device.Version,
			Quality:   "good",
		}
		updated = true
	}

	if updated {
		device.UpdatedAt = time.Now()
		log.Printf("[VirtualShadowEngine] Recomputed virtual device: %s, version: %d", deviceID, device.Version)
	}
}

func (vse *VirtualShadowEngine) buildEvaluationEnv(dependencies []string) map[string]interface{} {
	env := make(map[string]interface{})

	for _, dep := range dependencies {
		parts := strings.Split(dep, ".")
		if len(parts) < 3 {
			continue
		}

		deviceID := parts[1]
		pointID := strings.Join(parts[2:], ".")

		shadowDeviceID := fmt.Sprintf("shadow-%s", deviceID)
		shadowDevice, err := vse.shadowCore.GetShadowDevice(shadowDeviceID)
		if err != nil {
			continue
		}

		point, exists := shadowDevice.Points[pointID]
		if !exists {
			continue
		}

		env[dep] = point.Value

		if _, exists := env[pointID]; !exists {
			env[pointID] = point.Value
		}
	}

	return env
}

func (vse *VirtualShadowEngine) evaluateFormula(formula string, env map[string]interface{}) (interface{}, error) {
	program, err := expr.Compile(formula, expr.Env(env))
	if err != nil {
		return nil, fmt.Errorf("compile error: %w", err)
	}

	result, err := expr.Run(program, env)
	if err != nil {
		return nil, fmt.Errorf("run error: %w", err)
	}

	return result, nil
}

func (vse *VirtualShadowEngine) GetVirtualDevice(deviceID string) (*model.VirtualDevice, error) {
	vse.mu.RLock()
	defer vse.mu.RUnlock()

	device, exists := vse.virtualDevices[deviceID]
	if !exists {
		return nil, fmt.Errorf("virtual device not found: %s", deviceID)
	}

	copy := *device
	return &copy, nil
}

func (vse *VirtualShadowEngine) GetAllVirtualDevices() []*model.VirtualDevice {
	vse.mu.RLock()
	defer vse.mu.RUnlock()

	result := make([]*model.VirtualDevice, 0, len(vse.virtualDevices))
	for _, device := range vse.virtualDevices {
		copy := *device
		result = append(result, &copy)
	}
	return result
}

func (vse *VirtualShadowEngine) DeleteVirtualDevice(deviceID string) error {
	vse.mu.Lock()
	defer vse.mu.Unlock()

	device, exists := vse.virtualDevices[deviceID]
	if !exists {
		return fmt.Errorf("virtual device not found: %s", deviceID)
	}

	for _, dep := range device.Dependencies {
		affected := vse.dependencyGraph[dep]
		newAffected := make([]string, 0)
		for _, vdID := range affected {
			if vdID != deviceID {
				newAffected = append(newAffected, vdID)
			}
		}
		vse.dependencyGraph[dep] = newAffected
	}

	delete(vse.virtualDevices, deviceID)

	log.Printf("[VirtualShadowEngine] Deleted virtual device: %s", deviceID)

	return nil
}

func (vse *VirtualShadowEngine) UpdateFormula(deviceID, pointID, newFormula string) error {
	vse.mu.Lock()
	defer vse.mu.Unlock()

	device, exists := vse.virtualDevices[deviceID]
	if !exists {
		return fmt.Errorf("virtual device not found: %s", deviceID)
	}

	oldFormula := device.FormulaPoints[pointID]
	oldDeps := vse.parseFormulaReferences(oldFormula)

	for _, dep := range oldDeps {
		affected := vse.dependencyGraph[dep]
		newAffected := make([]string, 0)
		for _, vdID := range affected {
			if vdID != deviceID {
				newAffected = append(newAffected, vdID)
			}
		}
		if len(newAffected) == 0 {
			delete(vse.dependencyGraph, dep)
		} else {
			vse.dependencyGraph[dep] = newAffected
		}
	}

	device.FormulaPoints[pointID] = newFormula

	newDeps := vse.parseFormulaReferences(newFormula)
	for _, dep := range newDeps {
		vse.dependencyGraph[dep] = append(vse.dependencyGraph[dep], deviceID)
	}

	device.Dependencies = vse.extractDependencies(device.FormulaPoints)
	device.Version++
	device.UpdatedAt = time.Now()

	go vse.recomputeVirtualDevice(deviceID)

	log.Printf("[VirtualShadowEngine] Updated formula for %s.%s", deviceID, pointID)

	return nil
}

func (vse *VirtualShadowEngine) GetDependencyGraph() map[string][]string {
	vse.mu.RLock()
	defer vse.mu.RUnlock()

	result := make(map[string][]string)
	for k, v := range vse.dependencyGraph {
		result[k] = append([]string{}, v...)
	}
	return result
}

func (vse *VirtualShadowEngine) GetMetrics() map[string]interface{} {
	vse.mu.RLock()
	defer vse.mu.RUnlock()

	totalFormulas := 0
	for _, device := range vse.virtualDevices {
		totalFormulas += len(device.FormulaPoints)
	}

	return map[string]interface{}{
		"virtual_device_count": len(vse.virtualDevices),
		"total_formulas":       totalFormulas,
		"dependency_count":     len(vse.dependencyGraph),
	}
}
