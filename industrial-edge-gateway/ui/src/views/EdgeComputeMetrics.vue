<template>
  <div>
    <v-row>
      <v-col cols="12" md="2">
        <v-card class="glass-card pa-4" height="100%">
          <div class="text-overline mb-1">规则总数</div>
          <div class="text-h4 font-weight-bold text-primary">{{ metrics.rule_count }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card class="glass-card pa-4" height="100%">
          <div class="text-overline mb-1">共享源数量</div>
          <div class="text-h4 font-weight-bold text-success">{{ metrics.shared_source_count }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card class="glass-card pa-4" height="100%">
          <div class="text-overline mb-1">缓存大小</div>
          <div class="text-h4 font-weight-bold text-info">{{ metrics.cache_size }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="glass-card pa-4" height="100%">
          <div class="text-overline mb-1">执行/触发/丢弃</div>
          <div class="d-flex align-baseline">
            <span class="text-h5 font-weight-bold text-primary mr-2">{{ metrics.rules_executed }}</span>
            <span class="text-caption text-grey">/ {{ metrics.rules_triggered }} / {{ metrics.rules_dropped }}</span>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card class="glass-card pa-4" height="100%">
            <div class="text-overline mb-1">并发执行 (使用/总量)</div>
            <div class="text-h5 font-weight-bold text-warning mb-1">
                {{ metrics.worker_pool_usage }} / {{ metrics.worker_pool_size }}
            </div>
            <v-progress-linear
                :model-value="workerUsagePercent"
                color="warning"
                height="4"
                striped
            ></v-progress-linear>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card class="glass-card pa-4" title="共享源详情">
            <v-data-table
                :headers="headers"
                :items="sharedSources"
                density="compact"
                class="bg-transparent"
            >
                <template v-slot:item.subscribers="{ item }">
                    <v-chip
                        v-for="sub in item.subscribers"
                        :key="sub"
                        size="x-small"
                        color="primary"
                        class="mr-1"
                        variant="outlined"
                    >
                        {{ sub }}
                    </v-chip>
                </template>
            </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import request from '@/utils/request'
const metrics = ref({
    worker_pool_size: 0,
    worker_pool_usage: 0,
    rule_count: 0,
    shared_source_count: 0,
    cache_size: 0,
    rules_triggered: 0,
    rules_executed: 0,
    rules_dropped: 0
})

const sharedSources = ref([])
const headers = [
    { title: '数据源 ID', key: 'source_id' },
    { title: '订阅数量', key: 'subscriber_count' },
    { title: '订阅规则', key: 'subscribers' }
]

const workerUsagePercent = computed(() => {
    if (metrics.value.worker_pool_size === 0) return 0;
    return (metrics.value.worker_pool_usage / metrics.value.worker_pool_size) * 100;
})

let timer = null

const fetchMetrics = async () => {
    try {
        const data = await request.get('/api/edge/metrics')
        if (data) {
            metrics.value = data
        }
    } catch (e) {
        console.error(e)
    }
}

const fetchSharedSources = async () => {
    try {
        const data = await request.get('/api/edge/shared-sources')
        if (data) {
            sharedSources.value = data || []
        }
    } catch (e) {
        console.error(e)
    }
}

const fetchData = () => {
    fetchMetrics()
    fetchSharedSources()
}

onMounted(() => {
    fetchData()
    timer = setInterval(fetchData, 2000)
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})
</script>
