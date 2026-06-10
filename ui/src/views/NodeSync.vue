<template>
  <div class="node-sync-container">
    <!-- Tab 导航 -->
    <a-tabs v-model:active-key="activeTab" class="main-tabs">
      <a-tab-pane key="sync" title="同步控制" />
      <a-tab-pane key="cluster" title="集群总览" />
      <a-tab-pane key="tree" title="配置树" />
      <a-tab-pane key="diff" title="配置差异" />
    </a-tabs>

    <!-- 同步控制 -->
    <SyncControl 
      v-if="activeTab === 'sync'" 
      @refresh="refreshData"
    />

    <!-- 集群总览 -->
    <ClusterView 
      v-if="activeTab === 'cluster'" 
    />

    <!-- 配置树 -->
    <NodeTree 
      v-if="activeTab === 'tree'" 
    />

    <!-- 配置差异 -->
    <ConfigDiffView 
      v-if="activeTab === 'diff'" 
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

// 导入子组件
import SyncControl from './components/SyncControl.vue'
import ClusterView from './components/ClusterView.vue'
import NodeTree from './sync/NodeTree.vue'
import ConfigDiffView from './components/ConfigDiffView.vue'

const activeTab = ref('sync')

const refreshData = () => {
  console.log('Refreshing data...')
}

watch(activeTab, (newTab) => {
  console.log('Switched to tab:', newTab)
})

onMounted(() => {
  console.log('NodeSync page mounted')
})
</script>

<style scoped>
.node-sync-container {
  min-height: calc(100vh - 56px);
  background: #f8fafc;
}

.main-tabs {
  padding: 16px 20px 0;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.main-tabs :deep(.arco-tabs-tab) {
  font-size: 14px;
  font-weight: 500;
}

.main-tabs :deep(.arco-tabs-tab-active) {
  color: #0ea5e9;
}
</style>
