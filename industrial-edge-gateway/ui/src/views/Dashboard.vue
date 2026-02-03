<template>
  <div>
    <!-- System Info -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card class="glass-card pa-4" height="100%">
          <div class="text-overline mb-1">CPU 使用率</div>
          <div class="text-h4 font-weight-bold text-primary">{{ system.cpu_usage.toFixed(1) }}%</div>
          <v-progress-linear :model-value="system.cpu_usage" color="primary" height="4" class="mt-2"></v-progress-linear>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="glass-card pa-4" height="100%">
          <div class="text-overline mb-1">内存使用</div>
          <div class="text-h4 font-weight-bold text-info">{{ system.memory_usage.toFixed(0) }} MB</div>
          <!-- Mock max memory 1024MB for visualization -->
          <v-progress-linear :model-value="(system.memory_usage / 1024) * 100" color="info" height="4" class="mt-2"></v-progress-linear>
        </v-card>
      </v-col>
       <v-col cols="12" md="3">
        <v-card class="glass-card pa-4" height="100%">
          <div class="text-overline mb-1">协程数量</div>
          <div class="text-h4 font-weight-bold text-success">{{ system.goroutines }}</div>
        </v-card>
      </v-col>
       <v-col cols="12" md="3">
        <v-card class="glass-card pa-4" height="100%">
          <div class="text-overline mb-1">磁盘使用率</div>
          <div class="text-h4 font-weight-bold text-warning">{{ system.disk_usage.toFixed(1) }}%</div>
           <v-progress-linear :model-value="system.disk_usage" color="warning" height="4" class="mt-2"></v-progress-linear>
        </v-card>
      </v-col>
    </v-row>

    <!-- Southbound Channels -->
    <v-row class="mt-4">
      <v-col cols="12">
        <div class="text-h6 mb-4">采集通道</div>
      </v-col>
      <v-col v-for="ch in channels" :key="ch.id" cols="12" md="6">
        <v-card class="glass-card" hover @click="$router.push(`/channels/${ch.id}/devices`)">
            <v-card-title class="d-flex justify-space-between align-center">
                {{ ch.name }}
                <v-chip size="small" :color="ch.status === 'Running' ? 'success' : 'grey'">{{ ch.status }}</v-chip>
            </v-card-title>
            <v-card-subtitle>{{ ch.protocol }}</v-card-subtitle>
            <v-card-text>
                <div class="d-flex justify-space-between mt-2">
                    <div>
                        <div class="text-caption text-grey">设备总数</div>
                        <div class="text-h6">{{ ch.device_count }}</div>
                    </div>
                     <div>
                        <div class="text-caption text-success">在线</div>
                        <div class="text-h6">{{ ch.online_count }}</div>
                    </div>
                     <div>
                        <div class="text-caption text-error">离线</div>
                        <div class="text-h6">{{ ch.offline_count }}</div>
                    </div>
                </div>
            </v-card-text>
        </v-card>
      </v-col>
       <v-col v-if="channels.length === 0" cols="12">
          <v-alert type="info" variant="tonal" class="glass-card">
              暂无采集通道配置。 <router-link to="/channels">添加通道</router-link>.
          </v-alert>
      </v-col>
    </v-row>

    <!-- Northbound -->
    <v-row class="mt-4">
       <v-col cols="12">
        <div class="text-h6 mb-4">北向数据上报</div>
      </v-col>
      <v-col v-for="nb in northbound" :key="nb.id" cols="12" md="4">
         <v-card class="glass-card">
            <v-card-title class="d-flex justify-space-between align-center">
                {{ nb.name }}
                <v-chip size="small" :color="nb.status === 'Running' ? 'success' : (nb.status === 'Disabled' ? 'grey' : 'error')">{{ nb.status }}</v-chip>
            </v-card-title>
             <v-card-subtitle>{{ nb.type }}</v-card-subtitle>
             <v-card-actions>
                 <v-spacer></v-spacer>
                 <v-btn variant="text" color="primary" to="/northbound">配置</v-btn>
             </v-card-actions>
         </v-card>
      </v-col>
       <v-col v-if="northbound.length === 0" cols="12">
          <v-alert type="info" variant="tonal" class="glass-card">
              暂无北向数据上报配置。 <router-link to="/northbound">配置北向</router-link>.
          </v-alert>
      </v-col>
    </v-row>
    
    <!-- Edge Compute Stats Summary -->
    <v-row class="mt-4">
         <v-col cols="12">
            <div class="text-h6 mb-4">边缘计算状态</div>
            <v-card class="glass-card pa-4" @click="$router.push('/edge-compute/metrics')" hover>
                <v-row>
                    <v-col cols="6" md="3">
                        <div class="text-caption">规则数</div>
                        <div class="text-h5">{{ edgeRules.rule_count || 0 }}</div>
                    </v-col>
                     <v-col cols="6" md="3">
                        <div class="text-caption">已触发</div>
                        <div class="text-h5 text-primary">{{ edgeRules.rules_triggered || 0 }}</div>
                    </v-col>
                     <v-col cols="6" md="3">
                        <div class="text-caption">已执行</div>
                        <div class="text-h5 text-success">{{ edgeRules.rules_executed || 0 }}</div>
                    </v-col>
                     <v-col cols="6" md="3">
                        <div class="text-caption">工作池负载</div>
                         <v-progress-linear 
                            :model-value="(edgeRules.worker_pool_usage / (edgeRules.worker_pool_size || 1)) * 100" 
                            color="warning" height="10" striped class="mt-1">
                         </v-progress-linear>
                    </v-col>
                </v-row>
            </v-card>
         </v-col>
    </v-row>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import request from '@/utils/request'

const system = ref({
    cpu_usage: 0,
    memory_usage: 0,
    disk_usage: 0,
    goroutines: 0
})
const channels = ref([])
const northbound = ref([])
const edgeRules = ref({})

let timer = null

const fetchData = async () => {
    try {
        const data = await request.get('/api/dashboard/summary')
        system.value = data.system
        channels.value = (data.channels || []).sort((a, b) => a.name.localeCompare(b.name))
        northbound.value = data.northbound || []
        edgeRules.value = data.edge_rules || {}
    } catch (e) {
        console.error(e)
    }
}

onMounted(() => {
    fetchData()
    timer = setInterval(fetchData, 2000)
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})
</script>
