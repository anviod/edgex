package storage

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func testOutputDir(tb testing.TB) string {
	tb.Helper()
	root := projectRoot(tb)
	testRoot := filepath.Join(root, "test")
	if err := os.MkdirAll(testRoot, 0o755); err != nil {
		tb.Fatal(err)
	}
	name := strings.ReplaceAll(tb.Name(), "/", "_")
	name = strings.ReplaceAll(name, "\\", "_")
	dir, err := os.MkdirTemp(testRoot, name+"_*")
	if err != nil {
		tb.Fatal(err)
	}
	tb.Cleanup(func() { os.RemoveAll(dir) })
	return dir
}

func projectRoot(tb testing.TB) string {
	tb.Helper()
	dir, err := os.Getwd()
	if err != nil {
		tb.Fatal(err)
	}
	for {
		if _, err := os.Stat(filepath.Join(dir, "go.mod")); err == nil {
			return dir
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			tb.Fatal("project root not found")
		}
		dir = parent
	}
}
