<template>
  <div class="page-shell node-sync-page">
    <div class="page-header">
      <div>
        <h2 class="page-title">节点同步</h2>
        <p class="page-subtitle">管理边缘节点配置同步、网络发现与集群状态</p>
      </div>
    </div>

    <a-tabs v-model:active-key="activeTab" type="rounded" size="small" class="main-tabs">
      <a-tab-pane key="sync" title="同步控制" />
      <a-tab-pane key="cluster" title="集群总览" />
      <a-tab-pane key="tree" title="配置树" />
      <a-tab-pane key="diff" title="配置差异" />
    </a-tabs>

    <div class="node-sync-body">
      <SyncControl v-if="activeTab === 'sync'" @refresh="refreshData" />
      <ClusterView v-if="activeTab === 'cluster'" />
      <NodeTree v-if="activeTab === 'tree'" />
      <ConfigDiffView v-if="activeTab === 'diff'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SyncControl from './components/SyncControl.vue'
import ClusterView from './components/ClusterView.vue'
import NodeTree from './sync/NodeTree.vue'
import ConfigDiffView from './components/ConfigDiffView.vue'

const activeTab = ref('sync')

const refreshData = () => {}
</script>

<style scoped>
/* v3.0 — styles in src/styles/node-sync.css */
</style>
