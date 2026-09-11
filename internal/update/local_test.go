package update

import (
	"archive/tar"
	"compress/gzip"
	"os"
	"path/filepath"
	"runtime"
	"testing"
)

func writeTestTar(t *testing.T, path string, binName string) {
	t.Helper()
	f, err := os.Create(path)
	if err != nil {
		t.Fatal(err)
	}
	defer f.Close()
	gz := gzip.NewWriter(f)
	tw := tar.NewWriter(gz)
	body := []byte("#!/bin/sh\necho edgeCore test binary\n")
	if err := tw.WriteHeader(&tar.Header{Name: binName, Mode: 0o755, Size: int64(len(body))}); err != nil {
		t.Fatal(err)
	}
	if _, err := tw.Write(body); err != nil {
		t.Fatal(err)
	}
	if err := tw.Close(); err != nil {
		t.Fatal(err)
	}
	if err := gz.Close(); err != nil {
		t.Fatal(err)
	}
}

func writeHeadFile(t *testing.T, path string, head []byte) {
	t.Helper()
	if err := os.WriteFile(path, head, 0o644); err != nil {
		t.Fatal(err)
	}
}

func TestParseLocalName(t *testing.T) {
	cases := []struct {
		name, format string
		wantVer      string
		wantArch     string
		wantOK       bool
	}{
		{"edgeCore-0.1.0-linux-arm64.tar.gz", "tar.gz", "0.1.0", "arm64", true},
		{"edgeCore-0.1.0-linux-amd64.tar.gz", "tar.gz", "0.1.0", "amd64", true},
		{"edgeCore-v0.1.0-arm64.deb", "deb", "0.1.0", "arm64", true},
		{"edgeCore-v0.1.0-arm64.rpm", "rpm", "0.1.0", "arm64", true},
		{"edgeCore-v0.1.0-SNAPSHOT-a02b75d8-arm64.deb", "deb", "0.1.0-SNAPSHOT-a02b75d8", "arm64", true},
		{"random-file.txt", "txt", "", "", false},
		{"edgeCore-0.1.0-linux-arm64.zip", "tar.gz", "", "", false},
		{"edgeCore-0.1.0-arm64.exe", "deb", "", "", false},
	}
	for _, c := range cases {
		ver, arch, ok := parseLocalName(c.name, c.format)
		if ok != c.wantOK || ver != c.wantVer || arch != c.wantArch {
			t.Errorf("parseLocalName(%q,%q)=%q,%q,%v want %q,%q,%v",
				c.name, c.format, ver, arch, ok, c.wantVer, c.wantArch, c.wantOK)
		}
	}
}

func TestValidateLocalTarGz(t *testing.T) {
	m := NewManager("", "", nil)
	dir := t.TempDir()
	p := filepath.Join(dir, "edgeCore-0.1.0-linux-amd64.tar.gz")

	writeTestTar(t, p, "edgeCore")
	pkg, err := m.ValidateLocal(p)
	if err != nil {
		t.Fatal(err)
	}
	if pkg.Compatible != packageArchCompat("amd64") {
		t.Fatalf("compatible mismatch: got %v, packageArchCompat(amd64)=%v (platform %s/%s)",
			pkg.Compatible, packageArchCompat("amd64"), runtime.GOOS, runtime.GOARCH)
	}
	if pkg.Version != "0.1.0" || pkg.Format != "tar.gz" {
		t.Fatalf("unexpected pkg: %+v", pkg)
	}
}

func TestValidateLocalInvalidContent(t *testing.T) {
	m := NewManager("", "", nil)
	dir := t.TempDir()
	p := filepath.Join(dir, "edgeCore-0.1.0-linux-amd64.tar.gz")
	// 写一个非法的 gzip
	if err := os.WriteFile(p, []byte("not a gzip file at all"), 0o644); err != nil {
		t.Fatal(err)
	}
	pkg, err := m.ValidateLocal(p)
	if err != nil {
		t.Fatal(err)
	}
	if pkg.Compatible {
		t.Fatalf("expected incompatible for bad gzip, got %+v", pkg)
	}
}

func TestValidateLocalDebRpmMagic(t *testing.T) {
	m := NewManager("", "", nil)
	dir := t.TempDir()

	deb := filepath.Join(dir, "edgeCore-v0.1.0-arm64.deb")
	writeHeadFile(t, deb, []byte("!<arch>\n"))
	p, err := m.ValidateLocal(deb)
	if err != nil {
		t.Fatal(err)
	}
	if p.Format != "deb" || p.Version != "0.1.0" || p.Arch != "arm64" {
		t.Fatalf("unexpected deb pkg: %+v", p)
	}

	rpm := filepath.Join(dir, "edgeCore-v0.1.0-arm64.rpm")
	writeHeadFile(t, rpm, []byte{0xED, 0xAB, 0xEE, 0xDB})
	p2, err := m.ValidateLocal(rpm)
	if err != nil {
		t.Fatal(err)
	}
	if p2.Format != "rpm" {
		t.Fatalf("unexpected rpm pkg: %+v", p2)
	}
}

// TestValidateLocalInSubdir 模拟 handleUploadPackage 的暂存场景：文件保存于
// MkdirTemp 子目录并保留原始文件名。ValidateLocal 依据 Base(path) 解析，
// 子目录名不得污染 deb/rpm 的 edgeCore-v 命名解析。
func TestValidateLocalInSubdir(t *testing.T) {
	m := NewManager("", "", nil)
	dir := t.TempDir()
	sub := filepath.Join(dir, "edgeCore-upload-abc123")
	if err := os.MkdirAll(sub, 0o755); err != nil {
		t.Fatal(err)
	}

	deb := filepath.Join(sub, "edgeCore-v0.1.1-arm64.deb")
	writeHeadFile(t, deb, []byte("!<arch>\n"))
	p, err := m.ValidateLocal(deb)
	if err != nil {
		t.Fatal(err)
	}
	if p.Format != "deb" || p.Version != "0.1.1" || p.Arch != "arm64" {
		t.Fatalf("unexpected deb pkg: %+v", p)
	}

	tgz := filepath.Join(sub, "edgeCore-0.1.1-linux-arm64.tar.gz")
	writeTestTar(t, tgz, "edgeCore")
	p2, err := m.ValidateLocal(tgz)
	if err != nil {
		t.Fatal(err)
	}
	if p2.Format != "tar.gz" || p2.Version != "0.1.1" || p2.Arch != "arm64" {
		t.Fatalf("unexpected tar.gz pkg: %+v", p2)
	}

	// 防御性：若历史遗留暂存路径将前缀拼入文件名，必须被识别为不合规而非误解析。
	legacy := filepath.Join(dir, "edgeCore-upload-edgeCore-v0.1.1-arm64.deb")
	writeHeadFile(t, legacy, []byte("!<arch>\n"))
	p3, err := m.ValidateLocal(legacy)
	if err != nil {
		t.Fatal(err)
	}
	if p3.Compatible {
		t.Fatalf("legacy prefixed name must not be accepted: %+v", p3)
	}
	if p3.Reason != "文件名不符合规范，无法识别版本号" {
		t.Fatalf("unexpected reason: %q", p3.Reason)
	}
}

func TestArchIncompatibleFilenameStillParsed(t *testing.T) {
	m := NewManager("", "", nil)
	dir := t.TempDir()
	// arm7 包在当前常见平台（amd64/arm64）下不兼容，但文件名应仍可解析出版本与架构
	p := filepath.Join(dir, "edgeCore-0.1.0-linux-arm7.tar.gz")
	writeTestTar(t, p, "edgeCore")
	pkg, err := m.ValidateLocal(p)
	if err != nil {
		t.Fatal(err)
	}
	if pkg.Version != "0.1.0" || pkg.Format != "tar.gz" || pkg.Arch != "arm7" {
		t.Fatalf("unexpected pkg: %+v", pkg)
	}
	if pkg.Compatible != packageArchCompat("arm7") {
		t.Fatalf("compatible mismatch: %v vs %v", pkg.Compatible, packageArchCompat("arm7"))
	}
	if !pkg.Compatible && pkg.Reason == "" {
		t.Fatal("incompatible package should carry a reason")
	}
}
