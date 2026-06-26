<template>
  <a-modal
    v-model:visible="visible"
    title="Sparkplug B"
    :width="960"
    modal-class="northbound-settings-modal"
    unmount-on-close
    :footer="true"
    :mask-closable="false"
    :ok-loading="loading"
    @ok="saveSettings"
  >
    <div class="nb-mode-banner nb-mode-banner--push">
      <span class="nb-mode-banner__tag">主动上报</span>
      <span>基于 MQTT 的 Sparkplug B 工业协议，自动发布 NBIRTH/DBIRTH 等标准消息</span>
    </div>

    <a-tabs v-model:active-key="activeTab" type="rounded" size="small">
      <a-tab-pane key="basic">
        <template #title>连接配置</template>
        <a-form :model="form" layout="vertical" class="industrial-form form-controls-md">
          <a-row :gutter="16">
            <a-col :span="16">
              <a-form-item label="通道名称" required>
                <a-input v-model="form.name" placeholder="例如: 工厂 Sparkplug B 网关" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="启用"><a-switch v-model="form.enable" /></a-form-item>
            </a-col>
          </a-row>

          <div class="nb-form-section">
            <div class="nb-form-section__title">Broker 连接</div>
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item label="Broker 地址" required>
                  <a-input v-model="form.broker" placeholder="127.0.0.1" class="mono-text" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="端口" required>
                  <a-input-number v-model="form.port" :min="1" :max="65535" placeholder="1883" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="Client ID" required>
                  <a-input v-model="form.client_id" class="mono-text" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="用户名"><a-input v-model="form.username" /></a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="密码"><a-input-password v-model="form.password" /></a-form-item>
              </a-col>
            </a-row>
          </div>

          <div class="nb-form-section">
            <div class="nb-form-section__title">Sparkplug 标识</div>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="Group ID" required>
                  <a-input v-model="form.group_id" class="mono-text" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Node ID" required>
                  <a-input v-model="form.node_id" class="mono-text" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="选项">
                  <a-space direction="vertical" size="mini" fill>
                    <a-checkbox v-model="form.group_path">Group Path</a-checkbox>
                    <a-checkbox v-model="form.enable_alias">启用别名</a-checkbox>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </div>

          <a-collapse :bordered="false">
            <a-collapse-item header="SSL/TLS 与离线缓存（可选）" key="advanced">
              <a-form-item label="启用 SSL/TLS"><a-switch v-model="form.ssl" /></a-form-item>
              <template v-if="form.ssl">
                <a-form-item label="CA 证书"><a-textarea v-model="form.ca_cert" :auto-size="{ minRows: 2 }" class="mono-text" /></a-form-item>
                <a-row :gutter="16">
                  <a-col :span="12"><a-form-item label="客户端证书"><a-textarea v-model="form.client_cert" :auto-size="{ minRows: 2 }" class="mono-text" /></a-form-item></a-col>
                  <a-col :span="12"><a-form-item label="客户端密钥"><a-textarea v-model="form.client_key" :auto-size="{ minRows: 2 }" class="mono-text" /></a-form-item></a-col>
                </a-row>
              </template>
              <a-divider style="margin: 12px 0" />
              <a-form-item label="启用离线缓存"><a-switch v-model="form.offline_cache" /></a-form-item>
              <a-row :gutter="16" v-if="form.offline_cache">
                <a-col :span="8"><a-form-item label="内存 (MB)"><a-input-number v-model="form.cache_mem_size" :min="1" style="width: 100%" /></a-form-item></a-col>
                <a-col :span="8"><a-form-item label="磁盘 (MB)"><a-input-number v-model="form.cache_disk_size" :min="1" style="width: 100%" /></a-form-item></a-col>
                <a-col :span="8"><a-form-item label="重发 (ms)"><a-input-number v-model="form.cache_resend_int" :min="100" style="width: 100%" /></a-form-item></a-col>
              </a-row>
            </a-collapse-item>
          </a-collapse>
        </a-form>
      </a-tab-pane>

      <a-tab-pane key="subscription">
        <template #title>设备订阅</template>
        <div class="table-header table-header--strategy">
          <span class="table-header__hint">启用设备默认周期上报 10s</span>
          <div class="table-header__actions">
            <a-input
              v-model="batchInterval"
              size="small"
              placeholder="10s"
              class="mono-text batch-interval-input"
              @press-enter="batchSetInterval"
            />
            <a-button type="outline" size="small" @click="batchSetInterval">批量设置周期</a-button>
            <a-button type="outline" size="small" @click="autoFillDevices">全部启用 (10s)</a-button>
          </div>
        </div>
        <div class="table-container saas-table nb-device-table">
          <a-table :columns="deviceColumns" :data="deviceTableData" size="small" :bordered="false" :pagination="false" class="industrial-table-inline">
            <template #empty>
              <a-empty description="暂无南向设备，请先在通道管理中创建设备" />
            </template>
            <template #state="{ record }">
              <a-tag v-if="record.state === 0" color="green" size="small">在线</a-tag>
              <a-tag v-else-if="record.state === 1" color="orangered" size="small">不稳定</a-tag>
              <a-tag v-else color="red" size="small">离线</a-tag>
            </template>
            <template #enable="{ record }">
              <a-switch v-model="record._enable" size="small" @change="updateDeviceEnable(record)" />
            </template>
            <template #strategy="{ record }">
              <a-select v-model="record._strategy" size="small" :disabled="!record._enable" @change="updateDeviceStrategy(record)" class="mono-text strategy-select">
                <a-option value="periodic">周期上报</a-option>
                <a-option value="change">变化上报</a-option>
              </a-select>
            </template>
            <template #interval="{ record }">
              <a-input
                v-if="record._strategy === 'periodic'"
                v-model="record._interval"
                size="small"
                :disabled="!record._enable"
                placeholder="10s"
                class="mono-text strategy-interval-input"
                @change="updateDeviceInterval(record)"
              />
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>

    <template #footer>
      <div class="industrial-modal-footer">
        <a-button @click="visible = false">取消</a-button>
        <a-button type="primary" :loading="loading" @click="saveSettings">保存</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { showMessage } from '@/composables/useGlobalState'
import request from '@/utils/request'

const props = defineProps({
  visible: { type: Boolean, default: false },
  config: { type: Object, default: null },
  allDevices: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:visible', 'saved'])

const visible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})
const loading = ref(false)
const form = ref({})
const activeTab = ref('basic')
const deviceTableData = ref([])
const batchInterval = ref('10s')

const DEFAULT_INTERVAL = '10s'

const deviceColumns = [
  { title: '设备', dataIndex: 'name', width: 180, ellipsis: true, tooltip: true },
  { title: '通道', dataIndex: 'channelName', width: 120 },
  { title: '状态', slotName: 'state', width: 80, align: 'center' },
  { title: '启用', slotName: 'enable', width: 70, align: 'center' },
  { title: '策略', slotName: 'strategy', width: 130 },
  { title: '上报周期', slotName: 'interval', width: 100 }
]

watch(() => props.visible, (val) => {
  if (val) {
    activeTab.value = 'basic'
    if (props.config) {
      form.value = JSON.parse(JSON.stringify(props.config))
    } else {
      form.value = {
        enable: true,
        name: 'New Sparkplug B',
        broker: '127.0.0.1',
        port: 1883,
        client_id: 'sparkplug_client_' + Date.now(),
        group_id: 'Sparkplug B Devices',
        node_id: 'Edge Gateway',
        devices: {},
        enable_alias: false,
        group_path: false,
        offline_cache: false,
        cache_mem_size: 100,
        cache_disk_size: 500,
        cache_resend_int: 5000,
        ssl: false,
        username: '',
        password: '',
        ca_cert: '',
        client_cert: '',
        client_key: '',
        key_password: ''
      }
    }
    if (!form.value.devices) form.value.devices = {}
    batchInterval.value = DEFAULT_INTERVAL
    buildDeviceTable()
  }
})

const buildDeviceTable = () => {
  deviceTableData.value = props.allDevices.map(dev => {
    const current = form.value.devices[dev.id]
    let _enable = false, _strategy = 'periodic', _interval = DEFAULT_INTERVAL
    if (current === undefined || current === null) {
      _enable = false
    } else if (typeof current === 'boolean') {
      _enable = current
      if (_enable) {
        _strategy = 'periodic'
        _interval = DEFAULT_INTERVAL
      }
    } else if (typeof current === 'object') {
      _enable = !!current.enable
      _strategy = current.strategy || 'periodic'
      _interval = current.interval || DEFAULT_INTERVAL
    }
    return { ...dev, _enable, _strategy, _interval }
  })
}

const syncRecordToForm = (record) => {
  form.value.devices[record.id] = {
    enable: record._enable,
    strategy: record._strategy,
    interval: record._interval || DEFAULT_INTERVAL
  }
}

const updateDeviceEnable = (record) => {
  if (record._enable) {
    record._strategy = 'periodic'
    record._interval = record._interval || DEFAULT_INTERVAL
  }
  if (!form.value.devices[record.id] || typeof form.value.devices[record.id] === 'boolean') {
    syncRecordToForm(record)
  } else {
    form.value.devices[record.id].enable = record._enable
    if (record._enable) {
      form.value.devices[record.id].strategy = 'periodic'
      form.value.devices[record.id].interval = record._interval
    }
  }
}

const updateDeviceStrategy = (record) => {
  if (record._strategy === 'periodic' && !record._interval) {
    record._interval = DEFAULT_INTERVAL
  }
  if (!form.value.devices[record.id] || typeof form.value.devices[record.id] === 'boolean') {
    syncRecordToForm(record)
  } else {
    form.value.devices[record.id].strategy = record._strategy
    if (record._strategy === 'periodic') {
      form.value.devices[record.id].interval = record._interval
    }
  }
}

const updateDeviceInterval = (record) => {
  record._interval = record._interval || DEFAULT_INTERVAL
  if (!form.value.devices[record.id] || typeof form.value.devices[record.id] === 'boolean') {
    syncRecordToForm(record)
  } else {
    form.value.devices[record.id].interval = record._interval
  }
}

const batchSetInterval = () => {
  const interval = (batchInterval.value || DEFAULT_INTERVAL).trim()
  if (!interval) {
    showMessage('请输入上报周期', 'warning')
    return
  }
  let count = 0
  deviceTableData.value.forEach(record => {
    if (!record._enable) return
    record._strategy = 'periodic'
    record._interval = interval
    syncRecordToForm(record)
    count++
  })
  if (count === 0) {
    showMessage('请先启用至少一个设备', 'warning')
    return
  }
  showMessage(`已为 ${count} 个设备设置周期 ${interval}`, 'success')
}

const autoFillDevices = () => {
  deviceTableData.value.forEach(record => {
    record._enable = true
    record._strategy = 'periodic'
    record._interval = DEFAULT_INTERVAL
    syncRecordToForm(record)
  })
  showMessage('已启用全部设备，周期 10s', 'success')
}

const saveSettings = async () => {
  loading.value = true
  try {
    await request.post('/api/northbound/sparkplugb', { ...form.value })
    showMessage('Sparkplug B 配置已保存', 'success')
    visible.value = false
    emit('saved')
  } catch (e) {
    showMessage('保存失败: ' + e.message, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* v3.0 — styles in src/styles/ */
</style>
