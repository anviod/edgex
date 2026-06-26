package model

import (
	"fmt"
	"regexp"
	"strings"
)

var virtualShadowIDPattern = regexp.MustCompile(`^[a-zA-Z][a-zA-Z0-9_-]{0,63}$`)

// MakePointRef 构造公式/依赖引用：channel.device.point
func MakePointRef(channelID, deviceID, pointID string) string {
	return fmt.Sprintf("%s.%s.%s", channelID, deviceID, pointID)
}

// BuildVirtualShadowFormulas 将 UI 点位定义转换为引擎公式表。
func BuildVirtualShadowFormulas(points []VirtualShadowPointDef) (map[string]string, error) {
	result := make(map[string]string, len(points))
	seen := make(map[string]struct{}, len(points))

	for _, p := range points {
		pid := strings.TrimSpace(p.PointID)
		if pid == "" {
			return nil, fmt.Errorf("point_id is required")
		}
		if _, ok := seen[pid]; ok {
			return nil, fmt.Errorf("duplicate point_id: %s", pid)
		}
		seen[pid] = struct{}{}

		mode := strings.TrimSpace(p.Mode)
		if mode == "" {
			mode = "map"
		}

		switch mode {
		case "map":
			ref := strings.TrimSpace(p.SourceRef)
			if ref == "" {
				return nil, fmt.Errorf("point %s: source_ref is required for map mode", pid)
			}
			result[pid] = ref
		case "formula":
			formula := strings.TrimSpace(p.Formula)
			if formula == "" {
				return nil, fmt.Errorf("point %s: formula is required for formula mode", pid)
			}
			result[pid] = formula
		default:
			return nil, fmt.Errorf("point %s: invalid mode %q", pid, mode)
		}
	}

	return result, nil
}

// NormalizeVirtualShadowDevice 校验并规范化虚拟影子设备配置。
func NormalizeVirtualShadowDevice(cfg *VirtualShadowDeviceConfig) error {
	if cfg == nil {
		return fmt.Errorf("config is nil")
	}
	cfg.ID = strings.TrimSpace(cfg.ID)
	cfg.Name = strings.TrimSpace(cfg.Name)
	cfg.ChannelID = strings.TrimSpace(cfg.ChannelID)
	if cfg.ID == "" {
		return fmt.Errorf("id is required")
	}
	if !virtualShadowIDPattern.MatchString(cfg.ID) {
		return fmt.Errorf("invalid id: use letters, numbers, underscore, hyphen")
	}
	if cfg.Name == "" {
		cfg.Name = cfg.ID
	}
	if cfg.ChannelID == "" {
		return fmt.Errorf("channel_id is required")
	}
	if len(cfg.Points) == 0 {
		return fmt.Errorf("at least one point is required")
	}
	if _, err := BuildVirtualShadowFormulas(cfg.Points); err != nil {
		return err
	}
	return nil
}

// MatchSearchQuery 多关键词模糊检索（空格分词，子串或字符顺序匹配）。
func MatchSearchQuery(haystack, query string) bool {
	query = strings.TrimSpace(query)
	if query == "" {
		return true
	}
	haystack = strings.ToLower(haystack)
	for _, token := range strings.Fields(strings.ToLower(query)) {
		if token == "" {
			continue
		}
		if strings.Contains(haystack, token) {
			continue
		}
		if fuzzyContains(haystack, token) {
			continue
		}
		return false
	}
	return true
}

func fuzzyContains(text, pattern string) bool {
	if pattern == "" {
		return true
	}
	ti := 0
	for i := 0; i < len(pattern); i++ {
		idx := strings.Index(text[ti:], string(pattern[i]))
		if idx == -1 {
			return false
		}
		ti += idx + 1
	}
	return true
}
