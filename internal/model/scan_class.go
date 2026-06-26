package model

import "time"

const (
	ScanClassFast   = "fast"
	ScanClassNormal = "normal"
	ScanClassSlow   = "slow"
)

// ScanClassInterval 返回扫描类对应的采集周期；未知类回退到设备默认间隔。
func ScanClassInterval(scanClass string, deviceInterval Duration) time.Duration {
	deviceDur := time.Duration(deviceInterval)
	switch scanClass {
	case ScanClassFast:
		return 100 * time.Millisecond
	case ScanClassSlow:
		return 10 * time.Second
	case ScanClassNormal:
		if deviceDur > 0 {
			return deviceDur
		}
		return 1 * time.Second
	default:
		if deviceDur > 0 {
			return deviceDur
		}
		return 1 * time.Second
	}
}

// NormalizeScanClass 归一化扫描类名称；空值视为 normal。
func NormalizeScanClass(scanClass string) string {
	switch scanClass {
	case ScanClassFast, ScanClassNormal, ScanClassSlow:
		return scanClass
	case "":
		return ScanClassNormal
	default:
		return ScanClassNormal
	}
}

// GroupPointsByScanClass 按扫描类分组点位；未标注的点位归入 normal。
func GroupPointsByScanClass(points []Point) map[string][]Point {
	groups := make(map[string][]Point)
	for _, p := range points {
		class := NormalizeScanClass(p.ScanClass)
		groups[class] = append(groups[class], p)
	}
	if len(groups) == 0 {
		groups[ScanClassNormal] = nil
	}
	return groups
}
