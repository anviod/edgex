<template>
  <v-card variant="outlined" class="mb-2 pa-3 action-editor-card">
    <v-row density="compact" align="center">
      <!-- Type Selection -->
      <v-col cols="12" md="4">
        <v-select
          v-model="action.type"
          :items="actionTypes"
          label="动作类型"
          density="compact"
          hide-details
          variant="outlined"
          color="primary"
          @update:model-value="onTypeChange"
        ></v-select>
      </v-col>
      
      <!-- Interval (Rate Limit) -->
      <v-col cols="12" md="3">
        <v-text-field
          v-model="action.config.interval"
          label="频率限制 (Interval)"
          placeholder="e.g. 1s"
          density="compact"
          hide-details
          variant="outlined"
        ></v-text-field>
      </v-col>
      
      <!-- Remove Button -->
      <v-col cols="12" md="5" class="d-flex justify-end">
        <v-btn 
          icon="mdi-delete" 
          size="small" 
          color="error" 
          variant="text" 
          @click="$emit('remove')"
          title="删除动作"
        ></v-btn>
      </v-col>

      <!-- Config Area -->
      <v-col cols="12">
        
        <!-- 1. Sequence -->
        <div v-if="action.type === 'sequence'" class="pl-2">
          <div class="d-flex align-center mb-2">
            <span class="text-subtitle-2 mr-2">执行步骤 (Steps)</span>
            <v-chip size="x-small" color="primary" variant="outlined">{{ (action.config.steps || []).length }}</v-chip>
          </div>
          <div class="pl-3 border-s-md" style="border-color: #eee;">
            <div v-for="(step, idx) in (action.config.steps || [])" :key="idx" class="mb-2">
              <ActionEditor 
                v-model="action.config.steps[idx]" 
                :channels="channels" 
                @remove="removeStep(idx)"
              />
            </div>
            <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-plus" @click="addStep">添加步骤</v-btn>
          </div>
        </div>

        <!-- 2. Check -->
        <div v-if="action.type === 'check'" class="pl-2">
           <v-row density="compact">
             <!-- Device Selection -->
             <v-col cols="12" md="4">
               <v-select 
                 v-model="action.config.channel_id" 
                 :items="channels" 
                 item-title="name" 
                 item-value="id" 
                 label="通道" 
                 density="compact" 
                 variant="outlined"
                 @update:model-value="onChannelChange(action.config)"
               ></v-select>
             </v-col>
             <v-col cols="12" md="4">
               <v-select 
                 v-model="action.config.device_id" 
                 :items="deviceList" 
                 item-title="name" 
                 item-value="id" 
                 label="设备" 
                 density="compact" 
                 variant="outlined"
                 @update:model-value="onDeviceChange(action.config)"
               ></v-select>
             </v-col>
             <v-col cols="12" md="4">
               <v-combobox 
                 v-model="action.config.point_id" 
                 :items="pointList" 
                 item-title="name" 
                 item-value="id" 
                 label="点位" 
                 density="compact" 
                 variant="outlined"
               ></v-combobox>
             </v-col>

             <v-col cols="12" md="6">
                <v-text-field v-model="action.config.expression" label="校验表达式" placeholder="v == 1" density="compact" variant="outlined" hint="v 代表当前点位值" persistent-hint></v-text-field>
             </v-col>
             <v-col cols="6" md="2">
                <v-text-field v-model="action.config.timeout" label="超时" placeholder="5s" density="compact" variant="outlined"></v-text-field>
             </v-col>
             <v-col cols="6" md="2">
                <v-text-field v-model.number="action.config.retry" label="重试次数" type="number" density="compact" variant="outlined"></v-text-field>
             </v-col>
             <v-col cols="6" md="2">
                <v-text-field v-model="action.config.interval" label="重试间隔" placeholder="1s" density="compact" variant="outlined"></v-text-field>
             </v-col>
           </v-row>
           
           <!-- On Fail -->
           <div class="mt-2">
             <div class="text-subtitle-2 text-error mb-2">失败回退 (On Fail):</div>
             <div class="pl-3 border-s-md border-error" style="border-color: #ff5252;">
                <div v-for="(step, idx) in (action.config.on_fail || [])" :key="idx" class="mb-2">
                  <ActionEditor 
                    v-model="action.config.on_fail[idx]" 
                    :channels="channels" 
                    @remove="removeFailStep(idx)"
                  />
                </div>
                <v-btn size="small" variant="tonal" color="error" prepend-icon="mdi-plus" @click="addFailStep">添加回退动作</v-btn>
             </div>
           </div>
        </div>

        <!-- 3. Delay -->
        <div v-if="action.type === 'delay'" class="pl-2">
            <v-text-field 
              v-model="action.config.duration" 
              label="延时时长 (Duration)" 
              placeholder="e.g. 30s, 1m" 
              density="compact" 
              variant="outlined"
              prepend-inner-icon="mdi-clock-outline"
            ></v-text-field>
        </div>

        <!-- 4. Log -->
        <div v-if="action.type === 'log'" class="pl-2">
           <v-row density="compact">
             <v-col cols="12" md="3">
               <v-select 
                 v-model="action.config.level" 
                 :items="['info', 'warn', 'error']" 
                 label="日志级别" 
                 density="compact" 
                 variant="outlined"
               ></v-select>
             </v-col>
             <v-col cols="12" md="9">
               <v-text-field 
                 v-model="action.config.message" 
                 label="日志内容" 
                 placeholder="支持模板变量 ${v}" 
                 density="compact" 
                 variant="outlined"
               ></v-text-field>
             </v-col>
           </v-row>
        </div>

        <!-- 5. Device Control -->
        <div v-if="action.type === 'device_control'" class="pl-2">
            <div class="d-flex align-center mb-2">
                <v-switch 
                    v-model="isBatchMode" 
                    label="批量控制 (Batch)" 
                    color="primary" 
                    density="compact" 
                    hide-details 
                    class="mr-4"
                    @update:model-value="toggleBatchMode"
                ></v-switch>
            </div>

            <!-- Single Mode -->
            <div v-if="!isBatchMode">
               <v-row density="compact">
                 <v-col cols="12" md="4">
                   <v-select 
                     v-model="action.config.channel_id" 
                     :items="channels" 
                     item-title="name" 
                     item-value="id" 
                     label="通道" 
                     density="compact" 
                     variant="outlined"
                     @update:model-value="onChannelChange(action.config)"
                   ></v-select>
                 </v-col>
                 <v-col cols="12" md="4">
                   <v-select 
                     v-model="action.config.device_id" 
                     :items="deviceList" 
                     item-title="name" 
                     item-value="id" 
                     label="设备" 
                     density="compact" 
                     variant="outlined"
                     @update:model-value="onDeviceChange(action.config)"
                   ></v-select>
                 </v-col>
                 <v-col cols="12" md="4">
                   <v-combobox 
                     v-model="action.config.point_id" 
                     :items="pointList" 
                     item-title="name" 
                     item-value="id" 
                     label="点位" 
                     density="compact" 
                     variant="outlined"
                   ></v-combobox>
                 </v-col>
                 <v-col cols="12">
                   <v-text-field 
                     v-model="action.config.value" 
                     label="写入值 (Value Template)" 
                     placeholder="可以是固定值(1) 或 模板(${v})" 
                     density="compact" 
                     variant="outlined"
                   ></v-text-field>
                 </v-col>
               </v-row>
            </div>

            <!-- Batch Mode -->
            <div v-else>
               <div v-for="(target, tIdx) in (action.config.targets || [])" :key="tIdx" class="mb-2 pa-2 border rounded">
                  <div class="d-flex justify-space-between mb-1">
                      <span class="text-caption">目标 {{ tIdx + 1 }}</span>
                      <v-btn icon="mdi-close" size="x-small" variant="text" color="grey" @click="removeTarget(tIdx)"></v-btn>
                  </div>
                  <TargetEditor :target="target" :channels="channels" />
               </div>
               <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" @click="addTarget">添加控制目标</v-btn>
            </div>
        </div>

        <!-- 6. MQTT -->
        <div v-if="action.type === 'mqtt'" class="pl-2">
            <v-row density="compact">
                <v-col cols="12" md="6">
                    <v-text-field v-model="action.config.topic" label="Topic" density="compact" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                    <v-select v-model="action.config.send_strategy" :items="['single', 'batch']" label="发送策略" density="compact" variant="outlined"></v-select>
                </v-col>
                <v-col cols="12">
                    <v-textarea v-model="action.config.message" label="消息内容 (Message Template)" rows="2" density="compact" variant="outlined" placeholder="留空则发送默认 JSON"></v-textarea>
                </v-col>
            </v-row>
        </div>

        <!-- 7. HTTP -->
        <div v-if="action.type === 'http'" class="pl-2">
            <v-row density="compact">
                <v-col cols="12" md="2">
                    <v-select v-model="action.config.method" :items="['POST', 'PUT', 'GET']" label="Method" density="compact" variant="outlined"></v-select>
                </v-col>
                <v-col cols="12" md="10">
                    <v-text-field v-model="action.config.url" label="URL" density="compact" variant="outlined"></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-textarea v-model="action.config.body" label="Body Template" rows="2" density="compact" variant="outlined"></v-textarea>
                </v-col>
            </v-row>
        </div>

        <!-- 8. Database -->
        <div v-if="action.type === 'database'" class="pl-2">
            <v-text-field v-model="action.config.bucket" label="Bucket Name" placeholder="rule_events" density="compact" variant="outlined"></v-text-field>
        </div>

      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import request from '@/utils/request'
// Recursive component self-reference
import ActionEditor from './ActionEditor.vue'
import TargetEditor from './TargetEditor.vue' // Extract target editor for reuse

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  channels: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'remove'])

const action = ref(props.modelValue)
const deviceList = ref([])
const pointList = ref([])

// Sync props to local state
watch(() => props.modelValue, (val) => {
  action.value = val
  // Load devices/points if needed
  if (action.value.type === 'device_control' && !isBatchMode.value) {
     loadDevices(action.value.config)
  } else if (action.value.type === 'check') {
     loadDevices(action.value.config)
  }
}, { deep: true })

// Sync local state to props
watch(action, (val) => {
  emit('update:modelValue', val)
}, { deep: true })

const actionTypes = [
  { title: 'Log (日志)', value: 'log' },
  { title: 'Device Control (设备控制)', value: 'device_control' },
  { title: 'Sequence (顺序执行)', value: 'sequence' },
  { title: 'Check (校验)', value: 'check' },
  { title: 'Delay (延时)', value: 'delay' },
  { title: 'MQTT Push (MQTT推送)', value: 'mqtt' },
  { title: 'HTTP Push (HTTP推送)', value: 'http' },
  { title: 'Database (存储)', value: 'database' },
]

const onTypeChange = () => {
    if (!action.value.config) action.value.config = {}
    // Set defaults based on type
    if (action.value.type === 'sequence') {
        if (!action.value.config.steps) action.value.config.steps = []
    } else if (action.value.type === 'check') {
        if (!action.value.config.retry) action.value.config.retry = 3
        if (!action.value.config.interval) action.value.config.interval = '1s'
        if (!action.value.config.timeout) action.value.config.timeout = '5s'
    } else if (action.value.type === 'log') {
        if (!action.value.config.level) action.value.config.level = 'info'
    }
}

// --- Sequence / Check Steps Management ---
const addStep = () => {
    if (!action.value.config.steps) action.value.config.steps = []
    action.value.config.steps.push({ type: 'device_control', config: {} })
}
const removeStep = (idx) => {
    action.value.config.steps.splice(idx, 1)
}
const addFailStep = () => {
    if (!action.value.config.on_fail) action.value.config.on_fail = []
    action.value.config.on_fail.push({ type: 'log', config: { level: 'error', message: 'Check failed, rolling back...' } })
}
const removeFailStep = (idx) => {
    action.value.config.on_fail.splice(idx, 1)
}

// --- Device Control Logic ---
const isBatchMode = ref(false)

const toggleBatchMode = () => {
    if (isBatchMode.value) {
        if (!action.value.config.targets) action.value.config.targets = []
        // Migrate single to batch target 1
        if (action.value.config.channel_id) {
            action.value.config.targets.push({
                channel_id: action.value.config.channel_id,
                device_id: action.value.config.device_id,
                point_id: action.value.config.point_id,
                value: action.value.config.value
            })
            action.value.config.channel_id = ''
        }
    }
}

const addTarget = () => {
    if (!action.value.config.targets) action.value.config.targets = []
    action.value.config.targets.push({ channel_id: '', device_id: '', point_id: '', value: '' })
}
const removeTarget = (idx) => {
    action.value.config.targets.splice(idx, 1)
}

// --- Device/Point Loading ---
const onChannelChange = async (cfg) => {
    cfg.device_id = ''
    cfg.point_id = ''
    deviceList.value = []
    pointList.value = []
    if (cfg.channel_id) {
        const data = await request.get(`/api/channels/${cfg.channel_id}/devices`)
        deviceList.value = data || []
    }
}

const onDeviceChange = (cfg) => {
    cfg.point_id = ''
    pointList.value = []
    if (cfg.device_id && deviceList.value.length > 0) {
        const dev = deviceList.value.find(d => d.id === cfg.device_id)
        if (dev && dev.points) {
            pointList.value = dev.points.filter(p => p.readwrite !== 'R')
        }
    }
}

const loadDevices = async (cfg) => {
    if (cfg.channel_id && deviceList.value.length === 0) {
        const data = await request.get(`/api/channels/${cfg.channel_id}/devices`)
        deviceList.value = data || []
        if (cfg.device_id) {
            onDeviceChange(cfg)
        }
    }
}

onMounted(() => {
    // Init batch mode check
    if (action.value.type === 'device_control' && action.value.config && action.value.config.targets && action.value.config.targets.length > 0) {
        isBatchMode.value = true
    }
    // Init device list loading
    if ((action.value.type === 'device_control' && !isBatchMode.value) || action.value.type === 'check') {
        loadDevices(action.value.config)
    }
})

</script>

<style scoped>
.action-editor-card {
    border-left: 4px solid #1976D2;
}
</style>