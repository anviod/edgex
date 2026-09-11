#!/bin/bash
# 安装后处理脚本（安全版）
set -e

DATA_DIR="/usr/local/bin/edgeCore/data"
CONFIG_DIR="/usr/local/bin/edgeCore/config"
BACKUP_DIR="/tmp/edgeCore_backup"

echo "[postinstall] Running postinstall script..."

restore_dir() {
    local src="$1"
    local dst="$2"

    if [ -d "$src" ]; then
        echo "[postinstall] Restoring $dst from backup..."
        mkdir -p "$dst"
        cp -rf "$src/"* "$dst/" 2>/dev/null || true
    else
        echo "[postinstall] No backup found for $dst, ensuring directory exists."
        mkdir -p "$dst"
    fi
}

# 仅在 systemctl 存在时执行 systemd 操作
if command -v systemctl >/dev/null 2>&1; then
    echo "[postinstall] Reloading systemd..."
    systemctl daemon-reload || true

    echo "[postinstall] Enabling service..."
    systemctl enable edgeCore || true

    # 关键：通过 Web UI 升级时，dpkg/postinst 由 edgeCore 进程派生，
    # 运行于 edgeCore.service 的 CGroup 内。直接 systemctl restart 会连同
    # postinst/dpkg 一并终止（dpkg 状态卡在 half-configured，升级误报失败）。
    # 用 systemd-run --wait 创建独立 transient unit 执行 systemd 操作：
    # unit 生命周期由 systemd 管理、与调用者解耦（不能用 --scope）。
    if command -v systemd-run >/dev/null 2>&1; then
        # 先停止旧服务：旧进程持有 data/config.db、runtime.db 的 bbolt 文件锁，
        # 若在运行期间直接覆盖恢复文件会与旧进程写入竞态、导致数据库损坏。
        # 停止后旧进程退出、文件释放，恢复与启动都在稳定状态下进行。
        systemd-run --wait --quiet --slice=system.slice systemctl stop edgeCore || true

        # 恢复 data 和 config（旧进程已退出，文件处于稳定状态）
        restore_dir "$BACKUP_DIR/data" "$DATA_DIR"
        restore_dir "$BACKUP_DIR/config" "$CONFIG_DIR"

        # 启动新版本服务
        systemd-run --wait --quiet --slice=system.slice systemctl start edgeCore || true
    else
        # 无 systemd-run 环境：保持先恢复再重启的顺序，避免服务长时间停摆
        restore_dir "$BACKUP_DIR/data" "$DATA_DIR"
        restore_dir "$BACKUP_DIR/config" "$CONFIG_DIR"
        systemctl restart edgeCore || true
    fi
else
    # 非 systemd 环境：无服务进程持有 bbolt 文件锁，直接恢复配置即可
    restore_dir "$BACKUP_DIR/data" "$DATA_DIR"
    restore_dir "$BACKUP_DIR/config" "$CONFIG_DIR"
fi

echo "[postinstall] Completed."
