<template>
  <a-card class="settings-panel system-maintenance-card">
    <a-card-header>
      <div class="card-title">
        <icon-settings :size="18" class="title-icon" />
        系统维护
      </div>
    </a-card-header>
    <a-card-body>
      <a-alert type="success" class="status-alert mb-8">
        <template #icon>
          <icon-check-circle-fill />
        </template>
        系统运行正常
      </a-alert>
      <a-row :gutter="20">
        <a-col :span="12" class="metrics-col">
          <a-card class="maintenance-card restart-card" @click="showRestartConfirm">
            <div class="card-icon">
              <icon-refresh :size="32" />
            </div>
            <div class="card-content">
              <div class="card-title-text">重启系统</div>
              <div class="card-description">立即重启 Edge Gateway 硬件终端</div>
            </div>
            <div class="card-actions">
              <a-button type="outline" status="warning" size="small" class="action-btn">
                <template #icon>
                  <icon-refresh />
                </template>
                执行重启
              </a-button>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12" class="metrics-col">
          <a-card class="maintenance-card reset-card" @click="showResetConfirm">
            <div class="card-icon">
              <icon-delete :size="32" />
            </div>
            <div class="card-content">
              <div class="card-title-text">恢复出厂设置</div>
              <div class="card-description">清除所有本地配置并恢复出厂镜像</div>
            </div>
            <div class="card-actions">
              <a-button type="outline" status="danger" size="small" class="action-btn">
                <template #icon>
                  <icon-delete />
                </template>
                执行清除
              </a-button>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-card-body>
  </a-card>

  <!-- 重启确认弹窗 -->
  <a-modal
    v-model:visible="restartModalVisible"
    title="重启系统"
    ok-text="确认重启"
    cancel-text="取消"
    status="warning"
    @ok="handleRestart"
  >
    <div class="modal-content">
      <p class="modal-message">确定要重启系统吗？</p>
      <p class="modal-warning">服务将暂时不可用，重启过程可能需要几分钟时间。</p>
    </div>
  </a-modal>

  <!-- 恢复出厂设置确认弹窗 -->
  <a-modal
    v-model:visible="resetModalVisible"
    title="恢复出厂设置"
    ok-text="确认恢复"
    cancel-text="取消"
    status="danger"
    @ok="handleReset"
  >
    <div class="modal-content">
      <p class="modal-message">确定要恢复出厂设置吗？</p>
      <p class="modal-warning">此操作将清除所有配置且无法撤销。系统将恢复到初始状态。</p>
    </div>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import {
  IconSettings,
  IconCheckCircleFill,
  IconRefresh,
  IconDelete
} from '@arco-design/web-vue/es/icon'

const restartModalVisible = ref(false)
const resetModalVisible = ref(false)

const showRestartConfirm = () => {
  restartModalVisible.value = true
}

const showResetConfirm = () => {
  resetModalVisible.value = true
}

const handleRestart = () => {
  Message.loading({
    content: '正在重启系统...',
    duration: 0
  })
  // 这里可以添加实际的重启逻辑
  setTimeout(() => {
    Message.success('系统重启指令已发送')
  }, 2000)
  restartModalVisible.value = false
}

const handleReset = () => {
  Message.loading({
    content: '正在恢复出厂设置...',
    duration: 0
  })
  // 这里可以添加实际的重置逻辑
  setTimeout(() => {
    Message.success('出厂设置恢复指令已发送')
  }, 2000)
  resetModalVisible.value = false
}
</script>

<style scoped>
/* v3.0 — styles in src/styles/ */
</style>
