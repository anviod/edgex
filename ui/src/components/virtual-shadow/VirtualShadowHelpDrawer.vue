<template>
  <a-drawer
    :visible="visible"
    :width="800"
    :footer="false"
    unmount-on-close
    class="help-drawer virtual-shadow-help-drawer"
    render-to-body
    @update:visible="(v) => emit('update:visible', v)"
    @cancel="onCancel"
  >
    <template #title>
      <span class="help-drawer__title">虚拟影子设备帮助</span>
    </template>

    <article class="help-doc">
      <header class="help-doc__hero">
        <span class="protocol-tag protocol-tag--accent">影子设备</span>
        <p class="help-doc__lead">
          从多台真实设备选点拼积木：直接映射来源点位，或通过公式计算生成新的虚拟点位。虚拟设备结果写入 Shadow Core，供边缘计算规则、北向接口与 UI 实时查询统一消费。
        </p>
      </header>

      <div class="help-doc__sections">
        <ChannelHelpBlock title="数据流与架构">
          <div class="help-doc-arch" role="img" aria-label="虚拟影子设备数据流">
            <span class="help-doc-arch__node">南向采集</span>
            <span class="help-doc-arch__arrow">→</span>
            <span class="help-doc-arch__node help-doc-arch__node--real">真实影子设备</span>
            <span class="help-doc-arch__arrow">→</span>
            <span class="help-doc-arch__node help-doc-arch__node--engine">Virtual Shadow Engine</span>
            <span class="help-doc-arch__arrow">→</span>
            <span class="help-doc-arch__node help-doc-arch__node--virtual">虚拟影子设备</span>
            <span class="help-doc-arch__arrow">→</span>
            <span class="help-doc-arch__node help-doc-arch__node--out">边缘计算 / 北向 / UI</span>
          </div>
          <HelpDocFlow :steps="dataFlowSteps" aria-label="单点位更新链路" />
          <p class="help-doc-example">
            <strong>示例</strong>：泵 A 的 <code>flow</code> 与泵 B 的 <code>flow</code> 映射到虚拟设备后，用公式 <code>ch1.pump_a.flow + ch1.pump_b.flow</code> 生成 <code>total_flow</code>，供 MQTT 北向上报。
          </p>
        </ChannelHelpBlock>

        <ChannelHelpBlock title="图例说明">
          <div class="help-doc-legend">
            <div class="help-doc-legend__item">
              <span class="help-doc-legend__badge help-doc-legend__badge--map">映射</span>
              <span class="help-doc-legend__text">1:1 转发真实点位值，表达式即来源引用</span>
            </div>
            <div class="help-doc-legend__item">
              <span class="help-doc-legend__badge help-doc-legend__badge--formula">计算</span>
              <span class="help-doc-legend__text">基于一个或多个来源引用做四则运算</span>
            </div>
            <div class="help-doc-legend__item">
              <span class="help-doc-legend__badge help-doc-legend__badge--ref">来源引用</span>
              <span class="help-doc-legend__text"><code>channel_id.device_id.point_id</code> 格式，拖拽点位自动插入</span>
            </div>
            <div class="help-doc-legend__item">
              <span class="help-doc-legend__badge help-doc-legend__badge--version">版本</span>
              <span class="help-doc-legend__text">配置保存后引擎递增 version，列表页可查看运行时版本号</span>
            </div>
          </div>
        </ChannelHelpBlock>

        <ChannelHelpBlock title="设备级配置">
          <ChannelHelpParamList :items="deviceFields" />
        </ChannelHelpBlock>

        <ChannelHelpBlock title="点位模式详解">
          <a-collapse
            class="help-doc-faq"
            :bordered="false"
            expand-icon-position="right"
            :default-active-key="['map']"
          >
            <a-collapse-item
              v-for="item in pointModes"
              :key="item.key"
              :header="item.header"
            >
              <div class="help-doc-section__text">
                <HelpDocFlow :steps="item.flow" />
                <p class="help-doc-example"><strong>示例</strong>：{{ item.example }}</p>
                <p><strong>说明</strong>：{{ item.intro }}</p>
                <ul>
                  <li v-for="(bullet, idx) in item.bullets" :key="idx">
                    <strong>{{ bullet.term }}</strong>：<template v-if="bullet.desc">{{ bullet.desc }}</template><code v-if="bullet.code">{{ bullet.code }}</code><template v-if="bullet.suffix">{{ bullet.suffix }}</template>
                  </li>
                </ul>
              </div>
            </a-collapse-item>
          </a-collapse>
        </ChannelHelpBlock>

        <ChannelHelpBlock title="积木编辑器操作指引">
          <HelpDocFlow :steps="builderFlow" />
          <p class="help-doc-example">
            <strong>示例</strong>：选择通道 → 选中「1# 冷水机组」→ 勾选 3 个温度点 → 拖入批量映射区 → 再添加计算块求平均值。
          </p>
          <ol class="help-doc-steps">
            <li><strong>选择源设备</strong>：在左侧按通道加载设备列表，可搜索名称或 ID；进入设备后勾选或拖拽点位。</li>
            <li><strong>批量映射</strong>：将单个或多个点位拖入「批量映射区」，自动创建映射积木（已存在的来源会跳过）。</li>
            <li><strong>精调积木</strong>：每个积木可切换「直接映射 / 公式计算」，设置虚拟点位 ID、显示名称与单位。</li>
            <li><strong>公式编辑</strong>：拖入点位插入引用，或使用工具栏插入运算符；依赖引用会在下方自动解析展示。</li>
            <li><strong>保存启用</strong>：至少配置 1 个点位；保存后引擎按依赖图增量计算，禁用的设备不会参与计算。</li>
          </ol>
        </ChannelHelpBlock>

        <ChannelHelpBlock title="常见场景最佳实践">
          <a-collapse class="help-doc-faq" :bordered="false" expand-icon-position="right">
            <a-collapse-item
              v-for="scene in practiceScenes"
              :key="scene.key"
              :header="scene.header"
            >
              <div class="help-doc-section__text">
                <HelpDocFlow :steps="scene.flow" />
                <p class="help-doc-example"><strong>示例</strong>：{{ scene.example }}</p>
                <p><strong>目标</strong>：{{ scene.goal }}</p>
                <ul>
                  <li v-for="(line, idx) in scene.lines" :key="idx">
                    <strong v-if="line.term">{{ line.term }}</strong><template v-if="line.term">：</template>{{ line.desc }}<code v-if="line.code">{{ line.code }}</code><template v-if="line.suffix">{{ line.suffix }}</template>
                  </li>
                </ul>
                <p v-if="scene.note"><strong>注意</strong>：{{ scene.note }}</p>
              </div>
            </a-collapse-item>
          </a-collapse>
        </ChannelHelpBlock>

        <ChannelHelpBlock title="公式语法参考">
          <HelpDocFlow :steps="syntaxFlow" />
          <p class="help-doc-example">
            <strong>示例</strong>：引用 <code>modbus.chiller_01.supply_temp</code> 与 <code>modbus.chiller_02.supply_temp</code>，计算 <code>(modbus.chiller_01.supply_temp + modbus.chiller_02.supply_temp) / 2</code> 得到平均供水温度。
          </p>
          <ChannelHelpParamList :items="syntaxItems" />
        </ChannelHelpBlock>

        <ChannelHelpBlock title="配置建议">
          <HelpDocFlow :steps="configAdviceFlow" />
          <p class="help-doc-example">
            <strong>示例</strong>：先建仅含映射点位的虚拟设备验证实时值，确认引用正确后再叠加跨设备求和等公式点位。
          </p>
          <ol class="help-doc-steps">
            <li><strong>一设备一主题</strong>：每台虚拟设备对应一个业务实体（如「冷站汇总」「产线 A 能耗」），便于维护与排查。</li>
            <li><strong>映射优先</strong>：仅需转发的点位用映射模式，比公式更直观且开销更低。</li>
            <li><strong>命名规范</strong>：设备 ID 使用字母开头（如 <code>virtual-pump-sum</code>）；点位 ID 简短且唯一，避免与真实点位混淆。</li>
            <li><strong>避免循环依赖</strong>：公式只能引用真实影子或其它已存在来源，不可引用本设备自身的虚拟点位。</li>
            <li><strong>拓扑变更</strong>：修改通道/设备/点位后引擎会自动重载；若来源点位被删除，对应虚拟点位 quality 会降级，需及时修正配置。</li>
            <li><strong>调试顺序</strong>：保存后在列表展开行或「查看值」抽屉确认运行时值，再接入边缘计算规则或北向推送。</li>
          </ol>
        </ChannelHelpBlock>
      </div>
    </article>
  </a-drawer>
</template>

<script setup>
import ChannelHelpBlock from '@/components/channel-help/ChannelHelpBlock.vue'
import ChannelHelpParamList from '@/components/channel-help/ChannelHelpParamList.vue'
import HelpDocFlow from '@/components/channel-help/HelpDocFlow.vue'

defineProps({
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible', 'cancel'])

const dataFlowSteps = [
  { type: 'node', text: '真实点位值更新' },
  { type: 'arrow' },
  { type: 'node', text: '解析公式依赖图', variant: 'cond' },
  { type: 'arrow' },
  { type: 'node', text: '增量重算虚拟点位', variant: 'cond' },
  { type: 'arrow' },
  { type: 'node', text: '写入 virtual-{id} 影子', variant: 'action' },
]

const deviceFields = [
  {
    label: '设备 ID',
    example: 'virtual-pump-sum',
    desc: '唯一标识，字母开头，仅含字母、数字、下划线与连字符；创建后不可修改。',
  },
  {
    label: '名称',
    example: '双泵流量汇总',
    desc: '列表与详情中的显示名称；留空则使用设备 ID。',
  },
  {
    label: '描述',
    desc: '可选说明，便于团队协作识别设备用途。',
  },
  {
    label: '启用',
    example: 'true / false',
    desc: '禁用后引擎停止计算，已有配置保留，可随时重新启用。',
  },
]

const pointModes = [
  {
    key: 'map',
    header: '直接映射 (Map)',
    intro: '将真实点位的当前值 1:1 暴露为虚拟点位，不做任何变换。',
    example: '映射 modbus.plc_01.run_status → 虚拟点位 run_status',
    flow: [
      { type: 'node', text: '来源点位 channel.dev.point' },
      { type: 'arrow' },
      { type: 'node', text: '读取真实影子值', variant: 'muted' },
      { type: 'arrow' },
      { type: 'node', text: '写入虚拟点位（同名或自定义 ID）', variant: 'action' },
    ],
    bullets: [
      { term: '适用场景', desc: '跨设备汇聚开关量、将远端点位映射到统一命名空间、北向暴露前的点位整理。' },
      { term: '核心配置', desc: '映射来源（', code: 'source_ref', suffix: '），格式 channel_id.device_id.point_id。' },
      { term: '表达式展示', desc: '列表展开行与详情中直接显示来源引用。' },
      { term: '性能', desc: '无公式解析开销，适合大批量点位转发。' },
    ],
  },
  {
    key: 'formula',
    header: '公式计算 (Formula)',
    intro: '引用一个或多个来源点位，通过数学表达式计算派生值。',
    example: 'total_power = modbus.meter_a.voltage * modbus.meter_a.current',
    flow: [
      { type: 'node', text: '解析公式中的来源引用' },
      { type: 'arrow' },
      { type: 'node', text: '读取各依赖点位当前值', variant: 'cond' },
      { type: 'arrow' },
      { type: 'node', text: '执行四则运算', variant: 'cond' },
      { type: 'arrow' },
      { type: 'node', text: '输出虚拟点位结果', variant: 'action' },
    ],
    bullets: [
      { term: '适用场景', desc: '跨设备求和/差值/平均、倍率换算、简单派生指标。' },
      { term: '核心配置', desc: '计算公式（', code: 'formula', suffix: '），支持 + - * / 与括号。' },
      { term: '依赖解析', desc: '编辑器自动识别 ', code: 'channel.device.point', suffix: ' 格式的引用并展示实时值。' },
      { term: '内置模板', desc: '可使用「公式模板」快速生成求和、差值、平均值、倍率等常见表达式。' },
    ],
  },
]

const builderFlow = [
  { type: 'node', text: '① 选择源设备通道' },
  { type: 'arrow' },
  { type: 'node', text: '② 勾选 / 拖拽点位', variant: 'muted' },
  { type: 'arrow' },
  { type: 'node', text: '③ 批量映射或手动添加积木', variant: 'cond' },
  { type: 'arrow' },
  { type: 'node', text: '④ 保存并查看运行时值', variant: 'action' },
]

const practiceScenes = [
  {
    key: 'scene-sum',
    header: '场景 A: 跨设备流量汇总',
    goal: '将两台泵的流量相加，生成统一的 total_flow 虚拟点位。',
    example: 'pump_a.flow + pump_b.flow → virtual-pumps.total_flow',
    flow: [
      { type: 'node', text: '映射 pump_a.flow → a_flow' },
      { type: 'arrow' },
      { type: 'node', text: '映射 pump_b.flow → b_flow', variant: 'muted' },
      { type: 'arrow' },
      { type: 'node', text: '计算 total_flow = a + b', variant: 'action' },
    ],
    lines: [
      { term: '映射块', desc: '各创建一个映射积木，或使用批量映射拖入两个流量点' },
      { term: '计算块', code: 'ch1.pump_a.flow + ch1.pump_b.flow', desc: ' 作为 total_flow 公式' },
      { term: '验证', desc: '保存后在「查看值」确认 total_flow 随源点位实时变化' },
    ],
  },
  {
    key: 'scene-avg',
    header: '场景 B: 多路温度平均',
    goal: '对 3 路温度传感器取算术平均，供边缘计算越限规则使用。',
    example: '(t1 + t2 + t3) / 3 → avg_temp',
    flow: [
      { type: 'node', text: '批量映射 3 个温度点' },
      { type: 'arrow' },
      { type: 'node', text: '公式模板「平均值」', variant: 'cond' },
      { type: 'arrow' },
      { type: 'node', text: '边缘计算引用 avg_temp', variant: 'action' },
    ],
    lines: [
      { term: '快捷方式', desc: '使用公式模板生成 ', code: '(a + b) / 2', suffix: ' 再扩展为三路' },
      { term: '规则接入', desc: '在边缘计算中将虚拟设备点位作为数据源，别名如 ', code: 'avg_temp' },
    ],
    note: '虚拟点位 quality 取决于所有依赖点位；任一路离线会导致计算结果 quality 降级。',
  },
  {
    key: 'scene-passthrough',
    header: '场景 C: 点位整理与北向暴露',
    goal: '将分散在不同设备上的关键点位整理到一台虚拟设备，统一北向 MQTT/OPC UA 上报。',
    example: '10 个映射块 → virtual-factory-overview',
    flow: [
      { type: 'node', text: '多设备批量映射' },
      { type: 'arrow' },
      { type: 'node', text: '统一命名 point_id / name', variant: 'cond' },
      { type: 'arrow' },
      { type: 'node', text: '北向订阅 virtual-{id}', variant: 'action' },
    ],
    lines: [
      { term: '建议', desc: '全部使用映射模式，避免不必要的计算开销' },
      { term: '命名', desc: '虚拟点位 ID 采用业务语义（如 ', code: 'line1_speed', suffix: '）而非源点位原名' },
      { term: '数量', desc: '单台虚拟设备建议控制在合理规模（如 &lt; 200 点），超大汇总可拆分多台' },
    ],
  },
  {
    key: 'scene-scale',
    header: '场景 D: 工程单位换算',
    goal: '将原始传感器值乘以系数，转换为工程单位。',
    example: 'raw_value * 0.1 → pressure_bar',
    flow: [
      { type: 'node', text: '映射 raw_value' },
      { type: 'arrow' },
      { type: 'node', text: '公式 raw * 0.1', variant: 'cond' },
      { type: 'arrow' },
      { type: 'node', text: '设置 unit = bar', variant: 'action' },
    ],
    lines: [
      { term: '公式', code: 'modbus.sensor_01.raw * 0.1' },
      { term: '单位', desc: '在积木中填写 unit 字段，便于 UI 与北向展示' },
    ],
  },
]

const syntaxFlow = [
  { type: 'node', text: 'channel.device.point 引用' },
  { type: 'arrow' },
  { type: 'node', text: '+ - * / ( ) 运算', variant: 'cond' },
  { type: 'arrow' },
  { type: 'node', text: '数值结果写入虚拟点位', variant: 'action' },
]

const syntaxItems = [
  { label: '来源引用', example: 'ch1.dev1.temp', desc: 'channel_id.device_id.point_id，拖拽点位自动插入' },
  { label: '四则运算', example: 'a + b - c', desc: '加、减、乘、除' },
  { label: '括号分组', example: '(a + b) / 2', desc: '控制运算优先级' },
  { label: '常量', example: 'a * 1.8 + 32', desc: '支持整数与小数常量' },
  { label: '不支持', desc: '函数调用（如 sin、avg）、位运算、字符串操作；复杂逻辑请用边缘计算规则。' },
]

const configAdviceFlow = [
  { type: 'node', text: '规划虚拟设备结构' },
  { type: 'arrow' },
  { type: 'node', text: '映射验证 → 公式叠加', variant: 'cond' },
  { type: 'arrow' },
  { type: 'node', text: '接入规则 / 北向', variant: 'action' },
  { type: 'arrow' },
  { type: 'node', text: '监控 quality 与版本', variant: 'muted' },
]

const onCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}
</script>

<style scoped>
/* v3.0 — src/styles/help-drawer.css */
</style>
