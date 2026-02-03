#!/bin/sh
# 简化版 gateway 启动与守护脚本（纯 BusyBox 兼容版）

PROCESS_NAME="gateway"
PROCESS_DIR="/home/gateway"
PROCESS_PATH="$PROCESS_DIR/$PROCESS_NAME"
LOG_FILE="$PROCESS_DIR/watchdog.log"

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') $1" | tee -a "$LOG_FILE"
}

restart_process() {
    NEW_PATH="$PROCESS_DIR/${PROCESS_NAME}New"
    OLD_PATH="$PROCESS_DIR/${PROCESS_NAME}Old"

    if [ -f "$NEW_PATH" ]; then
        log "检测到新版本，执行热更新..."
        if [ -f "$PROCESS_PATH" ]; then
            mv -f "$PROCESS_PATH" "$OLD_PATH"
        fi
        chmod 755 "$NEW_PATH"
        mv -f "$NEW_PATH" "$PROCESS_PATH"
        log "新版本替换完成，旧版已备份为 $OLD_PATH"
    fi

    log "正在重启 $PROCESS_NAME ..."
    killall "$PROCESS_NAME" 2>/dev/null
    sleep 1
    "$PROCESS_PATH" &
    log "$PROCESS_NAME 已重启"
}

# 启动前的清理和准备
if pidof "$PROCESS_NAME" >/dev/null; then
    log "$PROCESS_NAME 正在运行，准备停止..."
    killall -q "$PROCESS_NAME"
    sleep 1
fi

cd "$PROCESS_DIR" || exit 1
chmod +x "$PROCESS_PATH"
"$PROCESS_PATH" &
sleep 2

log "启动进程监控..."

# 固定页大小为 4096（适用于大多数系统）
PAGE_SIZE=4096

while true; do
    PID=$(pidof "$PROCESS_NAME")

    if [ -z "$PID" ]; then
        log "$PROCESS_NAME 进程不存在，准备重启..."
        restart_process
    else
        # BusyBox 兼容的内存监控
        if [ -f "/proc/$PID/statm" ]; then
            RESIDENT=$(awk '{print $2}' /proc/"$PID"/statm)
            MEM_KB=$((RESIDENT * PAGE_SIZE / 1024))

            if [ "$MEM_KB" -gt 102400 ]; then
                log "内存过高 (MEM=${MEM_KB}KB)，准备重启..."
                restart_process
            fi
        fi
    fi

    sleep 10
done