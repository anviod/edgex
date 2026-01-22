package core

import (
	"log"
)

// Scheduler coordinates the execution of data collection tasks
// In this simple implementation, the scheduling logic is embedded in the DeviceManager's deviceLoop
// However, a separate Scheduler component can be useful for global coordination, load balancing, or complex triggers.
type Scheduler struct {
	dm *DeviceManager
}

func NewScheduler(dm *DeviceManager) *Scheduler {
	return &Scheduler{
		dm: dm,
	}
}

func (s *Scheduler) Start() {
	log.Println("Scheduler started")
	// Could implement global tasks here
}

func (s *Scheduler) Stop() {
	log.Println("Scheduler stopped")
}
