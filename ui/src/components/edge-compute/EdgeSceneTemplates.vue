<template>
  <div class="edge-compute-flow">
    <section class="edge-compute-panel" aria-label="场景模版">
      <div class="edge-compute-toolbar edge-compute-toolbar--view">
        <div class="edge-compute-toolbar__left">
          <a-input-search
            v-model="search"
            placeholder="搜索模版名称或描述"
            allow-clear
            size="small"
            style="max-width: 280px"
          />
          <span class="edge-compute-panel-meta">{{ filteredTemplates.length }} 个模版</span>
        </div>
      </div>

      <div class="edge-compute-tertiary-block">
        <a-radio-group
          v-model="category"
          type="button"
          size="small"
          class="edge-scene-category-toggle"
        >
          <a-radio
            v-for="cat in EDGE_SCENE_CATEGORIES"
            :key="cat.value"
            :value="cat.value"
          >
            {{ cat.label }}
          </a-radio>
        </a-radio-group>

        <a-empty v-if="filteredTemplates.length === 0" class="empty-wrap">
          <template #image><IconStorage :size="48" class="empty-icon-muted" /></template>
          <div class="empty-title">未找到匹配模版</div>
          <div class="empty-desc">尝试更换分类或搜索关键词</div>
        </a-empty>

        <div v-else class="edge-scene-grid">
          <article
            v-for="tpl in filteredTemplates"
            :key="tpl.id"
            class="edge-scene-card"
          >
            <header class="edge-scene-card__header">
              <div class="edge-scene-card__title-row">
                <h4 class="edge-scene-card__name">{{ tpl.name }}</h4>
                <a-tag size="small" color="arcoblue">{{ tpl.category }}</a-tag>
              </div>
              <p class="edge-scene-card__desc">{{ tpl.description }}</p>
            </header>

            <div class="edge-scene-card__meta">
              <a-tag
                v-for="rt in tpl.ruleTypes"
                :key="rt"
                size="small"
                color="gray"
              >
                {{ formatSceneRuleType(rt) }}
              </a-tag>
              <span class="edge-scene-card__actions-hint">
                {{ getFlowSummary(tpl) }}
              </span>
            </div>

            <div v-if="getPreviewText(tpl)" class="edge-scene-card__preview">
              <code>{{ getPreviewText(tpl) }}</code>
            </div>

            <footer class="edge-scene-card__footer">
              <a-button type="primary" size="small" @click="$emit('apply', tpl)">
                <template #icon><IconPlus /></template>
                从模版创建
              </a-button>
              <a-button type="text" size="small" @click="showDetail(tpl)">
                查看详情
              </a-button>
            </footer>
          </article>
        </div>
      </div>
    </section>

    <a-modal
      v-model:visible="detailVisible"
      :title="detailTemplate?.name || '模版详情'"
      width="680px"
      :footer="false"
    >
      <template v-if="detailTemplate">
        <a-descriptions :column="1" size="small" bordered class="edge-scene-detail">
          <a-descriptions-item label="场景类别">{{ detailTemplate.category }}</a-descriptions-item>
          <a-descriptions-item label="描述">{{ detailTemplate.description }}</a-descriptions-item>
          <a-descriptions-item label="规则类型">
            {{ detailTemplate.ruleTypes.map(formatSceneRuleType).join('、') }}
          </a-descriptions-item>
        </a-descriptions>

        <div class="edge-scene-flow-sections">
          <section class="edge-scene-flow-section">
            <h5 class="edge-scene-flow-section__title">输入源</h5>
            <ul class="edge-scene-flow-section__list">
              <li
                v-for="(src, index) in detailTemplate.rule.sources || []"
                :key="index"
              >
                {{ formatSceneSourceLine(src) }}
              </li>
            </ul>
          </section>

          <section class="edge-scene-flow-section">
            <h5 class="edge-scene-flow-section__title">判断条件</h5>
            <code class="edge-scene-flow-section__code">{{ formatSceneCondition(detailTemplate.rule) }}</code>
          </section>

          <section class="edge-scene-flow-section">
            <h5 class="edge-scene-flow-section__title">执行周期</h5>
            <p class="edge-scene-flow-section__text">{{ formatSceneSchedule(detailTemplate.rule) }}</p>
          </section>

          <section class="edge-scene-flow-section">
            <h5 class="edge-scene-flow-section__title">执行动作</h5>
            <ul
              v-if="detailActionLines.length"
              class="edge-scene-flow-section__list"
            >
              <li
                v-for="(item, index) in detailActionLines"
                :key="index"
                :style="{ paddingLeft: `${item.depth * 12}px` }"
              >
                {{ item.line }}
              </li>
            </ul>
            <p v-else class="edge-scene-flow-section__text edge-scene-flow-section__text--muted">无</p>
          </section>
        </div>

        <div class="edge-scene-detail__footer">
          <a-button type="primary" @click="applyFromDetail">
            从模版创建
          </a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { IconPlus, IconStorage } from '@arco-design/web-vue/es/icon'
import {
  EDGE_SCENE_CATEGORIES,
  EDGE_SCENE_TEMPLATES,
  formatSceneCondition,
  formatSceneRuleType,
  formatSceneSchedule,
  formatSceneSourceLine,
  listSceneActions,
} from '@/utils/edgeSceneTemplates'

const emit = defineEmits(['apply'])

const search = ref('')
const category = ref('all')
const detailVisible = ref(false)
const detailTemplate = ref(null)

const filteredTemplates = computed(() => {
  const q = search.value.trim().toLowerCase()
  return EDGE_SCENE_TEMPLATES.filter(tpl => {
    if (category.value !== 'all' && tpl.category !== category.value) return false
    if (!q) return true
    return (
      tpl.name.toLowerCase().includes(q)
      || tpl.description.toLowerCase().includes(q)
      || tpl.category.toLowerCase().includes(q)
    )
  })
})

const detailActionLines = computed(() => {
  if (!detailTemplate.value?.rule?.actions) return []
  return listSceneActions(detailTemplate.value.rule.actions)
})

const getPreviewText = (tpl) => formatSceneCondition(tpl.rule)

const getFlowSummary = (tpl) => {
  const rule = tpl.rule
  const sourceCount = rule.sources?.length || 0
  const actionCount = tpl.actions?.length || rule.actions?.length || 0
  return `${sourceCount} 输入 · ${rule.check_interval || '—'} · ${actionCount} 类动作`
}

const showDetail = (tpl) => {
  detailTemplate.value = tpl
  detailVisible.value = true
}

const applyFromDetail = () => {
  if (detailTemplate.value) {
    emit('apply', detailTemplate.value)
    detailVisible.value = false
  }
}
</script>

<style scoped>
/* v3.0 — styles in src/styles/edge-compute.css */
</style>
