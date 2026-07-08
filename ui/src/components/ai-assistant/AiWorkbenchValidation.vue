<template>
  <div class="ai-workbench-validation">
    <div class="ai-workbench-section">
      <h4 class="ai-workbench-section__title">Schema 校验 · G2</h4>
      <p class="ai-workbench-section__hint">
        导入前校验 Protocol Model / Point Definition / Driver Parameter，目标通过率 ≥ 95%
      </p>
      <a-button type="primary" size="small" :disabled="!deliverables" :loading="loading" @click="$emit('validate')">
        {{ validation ? '重新校验' : '运行校验' }}
      </a-button>
    </div>

    <div v-if="loading && !validation" class="ai-skeleton ai-skeleton--card"></div>

    <template v-else-if="validation">
      <div class="ai-validation-summary">
        <div class="ai-validation-ring" :class="{ 'ai-validation-ring--pass': validation.passed }">
          <svg viewBox="0 0 36 36" class="ai-validation-ring__svg">
            <path
              class="ai-validation-ring__bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              class="ai-validation-ring__fill"
              :stroke-dasharray="`${validation.pass_rate}, 100`"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span class="ai-validation-ring__text">{{ validation.pass_rate?.toFixed(0) }}%</span>
        </div>
        <div class="ai-validation-summary__info">
          <strong :class="validation.passed ? 'ai-text-pass' : 'ai-text-fail'">
            {{ validation.passed ? '校验通过' : '需修正' }}
          </strong>
          <p>检查 {{ validation.total_checks }} 项 · 失败 {{ validation.failed_checks }} 项</p>
          <div class="ai-validation-filter">
            <button
              v-for="f in filters"
              :key="f.id"
              type="button"
              class="ai-filter-chip"
              :class="{ 'ai-filter-chip--active': filter === f.id }"
              @click="filter = f.id"
            >
              {{ f.label }} ({{ countByFilter(f.id) }})
            </button>
          </div>
        </div>
      </div>

      <div class="ai-validation-table-wrap">
        <table class="ai-validation-table" aria-label="校验结果">
          <thead>
            <tr>
              <th scope="col">状态</th>
              <th scope="col">字段</th>
              <th scope="col">路径</th>
              <th scope="col">说明</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(field, i) in filteredFields" :key="i">
              <tr
                class="ai-validation-table__row"
                :class="rowClass(field)"
                tabindex="0"
                @click="toggleExpand(i)"
                @keydown.enter="toggleExpand(i)"
              >
                <td>
                  <span class="ai-validation-table__icon" :class="rowClass(field)">
                    {{ field.passed ? '✓' : field.severity === 'error' ? '✗' : '!' }}
                  </span>
                </td>
                <td><strong>{{ field.field }}</strong></td>
                <td><code class="ai-validation-table__path">{{ field.path || '—' }}</code></td>
                <td>{{ field.message }}</td>
              </tr>
              <tr v-if="expandedRows.has(i)" class="ai-validation-table__detail">
                <td colspan="4">
                  <div class="ai-validation-table__detail-body">
                    <span>严重级别: {{ field.severity }}</span>
                    <span v-if="field.confidence">置信度: {{ (field.confidence * 100).toFixed(0) }}%</span>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </template>

    <AiEmptyState
      v-else
      icon="✓"
      title="等待校验"
      description="运行协议分析任务后，校验结果将自动显示；也可手动触发重新校验"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AiEmptyState from './AiEmptyState.vue'

const props = defineProps({
  deliverables: { type: Object, default: null },
  validation: { type: Object, default: null },
  loading: { type: Boolean, default: false }
})

defineEmits(['validate'])

const filter = ref('all')
const expandedRows = ref(new Set())

const filters = [
  { id: 'all', label: '全部' },
  { id: 'pass', label: '通过' },
  { id: 'fail', label: '失败' },
  { id: 'warn', label: '警告' }
]

const filteredFields = computed(() => {
  const fields = props.validation?.fields || []
  if (filter.value === 'pass') return fields.filter((f) => f.passed)
  if (filter.value === 'fail') return fields.filter((f) => !f.passed && f.severity === 'error')
  if (filter.value === 'warn') return fields.filter((f) => !f.passed && f.severity === 'warning')
  return fields
})

const countByFilter = (id) => {
  const fields = props.validation?.fields || []
  if (id === 'pass') return fields.filter((f) => f.passed).length
  if (id === 'fail') return fields.filter((f) => !f.passed && f.severity === 'error').length
  if (id === 'warn') return fields.filter((f) => !f.passed && f.severity === 'warning').length
  return fields.length
}

const rowClass = (field) => {
  if (field.passed) return 'ai-validation-table__row--pass'
  if (field.severity === 'error') return 'ai-validation-table__row--fail'
  return 'ai-validation-table__row--warn'
}

const toggleExpand = (i) => {
  const next = new Set(expandedRows.value)
  if (next.has(i)) next.delete(i)
  else next.add(i)
  expandedRows.value = next
}
</script>
