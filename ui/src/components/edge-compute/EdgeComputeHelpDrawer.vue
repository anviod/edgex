<template>
  <a-drawer
    :visible="visible"
    :width="560"
    :footer="false"
    unmount-on-close
    class="help-drawer"
    render-to-body
    @update:visible="(v) => emit('update:visible', v)"
    @cancel="onCancel"
  >
    <template #title>
      <span class="help-drawer__title">边缘计算规则帮助</span>
    </template>

    <article class="help-doc">
      <header class="help-doc__hero">
        <span class="protocol-tag protocol-tag--accent">边缘计算</span>
        <p class="help-doc__lead">
          规则类型、触发条件、动作链路与表达式语法说明，便于配置阈值报警、联动控制与数据计算。
        </p>
      </header>

      <div class="help-doc__sections">
        <ChannelHelpBlock title="基础概念">
          <ChannelHelpParamList :items="basicConcepts" />
        </ChannelHelpBlock>

        <ChannelHelpBlock title="规则类型详解">
          <a-collapse
            class="help-doc-faq"
            :bordered="false"
            expand-icon-position="right"
            :default-active-key="['threshold']"
          >
            <a-collapse-item header="Threshold (阈值触发)" key="threshold">
              <div class="help-doc-section__text">
                <p><strong>说明</strong>：当数据源数值满足布尔条件表达式时触发动作。最常用的规则类型。</p>
                <ul>
                  <li><strong>适用场景</strong>：温度/压力越限报警、开关量状态检测、多点位组合逻辑判断。</li>
                  <li><strong>核心配置</strong>：数据源 + 触发条件（如 <code>t1 &gt; 80</code>）。</li>
                  <li><strong>支持运算</strong>：数值比较（&gt;、&lt;、≥、≤、==、!=）、逻辑组合（&amp;&amp;、||、!）、位操作（bitget、bitset、bitand、bitor）。</li>
                  <li><strong>可选防抖动</strong>：在「状态维持」中设置持续时间或连续次数，避免瞬时波动误触发。</li>
                </ul>
              </div>
            </a-collapse-item>
            <a-collapse-item header="Calculation (计算公式)" key="calculation">
              <div class="help-doc-section__text">
                <p><strong>说明</strong>：对输入数据执行数学表达式计算，输出派生值。每次检查周期都会执行计算。</p>
                <ul>
                  <li><strong>适用场景</strong>：单位换算（℃→℉）、能耗折算、多传感器加权平均、数据预处理。</li>
                  <li><strong>核心配置</strong>：数据源 + 计算公式（如 <code>t1 * 1.8 + 32</code>）。</li>
                  <li><strong>支持运算</strong>：四则运算（+、-、*、/、%、^）、函数调用、复杂嵌套表达式。</li>
                  <li><strong>注意</strong>：无触发条件字段；计算结果通过动作（如 MQTT 推送、数据库存储）输出。</li>
                </ul>
              </div>
            </a-collapse-item>
            <a-collapse-item header="Window (时间/计数窗口)" key="window">
              <div class="help-doc-section__text">
                <p><strong>说明</strong>：在指定时间窗口或计数窗口内对数据进行聚合统计，再对聚合结果评估触发条件。</p>
                <ul>
                  <li><strong>适用场景</strong>：滑动平均监控、峰值检测、流量速率统计、时段能耗汇总。</li>
                  <li><strong>窗口类型</strong>：<code>sliding</code>（滑动窗口）/ <code>tumbling</code>（跳跃窗口）。</li>
                  <li><strong>窗口大小</strong>：时间格式如 <code>10s</code>、<code>5m</code>，或计数格式如 <code>100</code>。</li>
                  <li><strong>聚合函数</strong>：avg、min、max、sum、count、rate（变化率）。</li>
                  <li><strong>示例</strong>：窗口 avg &gt; 50 表示最近 10 秒内平均值超过 50 时触发。</li>
                </ul>
              </div>
            </a-collapse-item>
            <a-collapse-item header="State (状态持续)" key="state">
              <div class="help-doc-section__text">
                <p><strong>说明</strong>：当触发条件<strong>持续满足</strong>指定时间或连续次数后才触发动作，用于防抖动和持续异常检测。</p>
                <ul>
                  <li><strong>适用场景</strong>：设备持续过热报警、振动异常持续检测、避免瞬时干扰触发。</li>
                  <li><strong>核心配置</strong>：触发条件 + 状态维持（持续时间 <code>duration</code> 或连续次数 <code>count</code>）。</li>
                  <li><strong>持续时间</strong>：如 <code>30s</code> 表示条件需连续满足 30 秒才触发。</li>
                  <li><strong>连续次数</strong>：如 <code>5</code> 表示条件需连续 5 次检查均满足才触发。</li>
                  <li><strong>与 Threshold 区别</strong>：Threshold 条件满足即触发（可配可选防抖）；State 以持续时间为核心语义。</li>
                </ul>
              </div>
            </a-collapse-item>
          </a-collapse>
        </ChannelHelpBlock>

        <ChannelHelpBlock title="常见场景最佳实践">
          <a-collapse class="help-doc-faq" :bordered="false" expand-icon-position="right">
            <a-collapse-item header="场景 A: 简单越限报警 (Threshold)" key="scene-a">
              <div class="help-doc-section__text">
                <p><strong>目标</strong>：当温度 (t1) 超过 50 度时，记录日志并发送 MQTT 告警。</p>
                <ul>
                  <li><strong>类型</strong>：Threshold</li>
                  <li><strong>数据源</strong>：添加温度点位，别名设为 <code>t1</code></li>
                  <li><strong>触发条件</strong>：<code>t1 &gt; 50</code></li>
                  <li>
                    <strong>动作</strong>：
                    <ol>
                      <li>Log：级别 Warn，内容「温度过高: ${t1}」</li>
                      <li>MQTT：Topic「alarm/temp」，内容「温度异常: ${t1}」</li>
                    </ol>
                  </li>
                </ul>
              </div>
            </a-collapse-item>
            <a-collapse-item header="场景 B: 顺序联动控制 (Sequence Workflow)" key="scene-b">
              <div class="help-doc-section__text">
                <p><strong>目标</strong>：启动设备 A，等待 30 秒，确认 A 已启动后再启动设备 B；若 A 启动失败则回退关闭 A。</p>
                <ul>
                  <li><strong>类型</strong>：Threshold（或 State）</li>
                  <li><strong>触发条件</strong>：<code>start_signal == 1</code></li>
                  <li>
                    <strong>动作</strong>：选择 Sequence 类型，添加步骤：
                    <ol>
                      <li>Device Control：开启设备 A（Value: 1）</li>
                      <li>Delay：30s</li>
                      <li>Check：选择设备 A 状态点位；表达式 <code>v == 1</code>；重试 3 次、间隔 2s；On Fail 添加关闭设备 A</li>
                      <li>Device Control：开启设备 B（Value: 1）</li>
                    </ol>
                  </li>
                </ul>
                <p><strong>注意</strong>：Sequence 中 Check 失败且未在 On Fail 中处理时，整个序列终止，后续步骤不会执行。</p>
              </div>
            </a-collapse-item>
            <a-collapse-item header="场景 C: 批量设备控制 (Batch Control)" key="scene-c">
              <div class="help-doc-section__text">
                <p><strong>目标</strong>：一键关闭所有相关设备 (A, B, C)。</p>
                <ul>
                  <li><strong>动作</strong>：Device Control，开启 Batch Control</li>
                  <li><strong>目标列表</strong>：设备 A/B/C 开关点位，值均为 0</li>
                </ul>
                <p>批量控制并行下发写入请求，响应速度优于连续单点控制。</p>
              </div>
            </a-collapse-item>
            <a-collapse-item header="场景 D: 位运算与状态字控制 (Bitwise)" key="scene-d">
              <div class="help-doc-section__text">
                <p><strong>目标</strong>：仅修改状态字的第 4 位（置 1），保持其他位不变。</p>
                <ul>
                  <li><strong>动作</strong>：Device Control</li>
                  <li><strong>Expr</strong>：<code>bitset(v, 4)</code> 或 <code>v | 8</code>（0-based index）</li>
                  <li><strong>说明</strong>：系统自动读取当前值 → 计算新值 → 写入（Read-Modify-Write）。</li>
                </ul>
                <p><strong>RMW 机制</strong>：网关处理并发冲突，避免修改某位时覆盖其他位的同期变化（在支持原子操作或网关级锁定的场景下）。</p>
              </div>
            </a-collapse-item>
          </a-collapse>
        </ChannelHelpBlock>

        <ChannelHelpBlock title="表达式语法参考">
          <ChannelHelpParamList :items="syntaxItems" />
        </ChannelHelpBlock>

        <ChannelHelpBlock title="动作类型详解">
          <a-collapse class="help-doc-faq" :bordered="false" expand-icon-position="right">
            <a-collapse-item header="Log (日志)" key="action-log">
              <div class="help-doc-section__text">
                记录规则触发信息到系统日志。
                <ul>
                  <li><strong>Level</strong>：日志级别（Info/Warn/Error）</li>
                  <li><strong>Message</strong>：支持 <code>${v}</code> 或 <code>${alias}</code> 模板变量</li>
                </ul>
              </div>
            </a-collapse-item>
            <a-collapse-item header="Device Control (设备控制)" key="action-device">
              <div class="help-doc-section__text">
                向设备写入值。
                <ul>
                  <li><strong>单点模式</strong>：直接控制一个点位</li>
                  <li><strong>批量模式</strong>：同时控制多个点位，并行下发</li>
                  <li><strong>Expression</strong>：可选，用于计算写入值（支持位操作 RMW）</li>
                </ul>
              </div>
            </a-collapse-item>
            <a-collapse-item header="MQTT Push (MQTT 推送)" key="action-mqtt">
              <div class="help-doc-section__text">
                通过已配置的北向 MQTT 通道发送消息；Topic / Payload 支持 <code>${alias}</code> 模板变量。
              </div>
            </a-collapse-item>
            <a-collapse-item header="HTTP Push (HTTP 推送)" key="action-http">
              <div class="help-doc-section__text">
                调用已配置的北向 HTTP 接口上报数据或触发外部系统。
              </div>
            </a-collapse-item>
            <a-collapse-item header="Database (存储)" key="action-db">
              <div class="help-doc-section__text">
                将规则计算结果或触发数据写入本地数据库，便于历史查询与分析。
              </div>
            </a-collapse-item>
            <a-collapse-item header="Sequence (顺序执行)" key="action-seq">
              <div class="help-doc-section__text">
                严格按顺序执行子动作；任一步骤失败（如 Check 未处理）则整个序列终止。
              </div>
            </a-collapse-item>
            <a-collapse-item header="Delay (延时)" key="action-delay">
              <div class="help-doc-section__text">
                在 Sequence 中暂停指定时间后再执行后续步骤，常用于设备启动等待。
              </div>
            </a-collapse-item>
            <a-collapse-item header="Check (校验)" key="action-check">
              <div class="help-doc-section__text">
                读取点位并校验条件。
                <ul>
                  <li><strong>Expression</strong>：校验公式（如 <code>v == 1</code>）</li>
                  <li><strong>Retry</strong>：失败重试次数与间隔</li>
                  <li><strong>On Fail</strong>：校验最终失败后执行的回退动作序列</li>
                </ul>
              </div>
            </a-collapse-item>
          </a-collapse>
        </ChannelHelpBlock>

        <ChannelHelpBlock title="配置建议">
          <ol class="help-doc-steps">
            <li><strong>一规则一职责</strong>：每条规则只负责一个具体功能，便于维护和排查。</li>
            <li><strong>告警去重</strong>：越限报警建议使用「仅状态改变时触发」，避免重复推送。</li>
            <li><strong>防抖动</strong>：对波动较大的传感器，使用 State 类型或设置持续时间/连续次数。</li>
            <li><strong>复杂联动</strong>：多步骤设备启停使用 Sequence + Check + On Fail 实现安全回退。</li>
            <li><strong>性能优化</strong>：非紧急规则使用较长检查频率（如 30s、1m）；合并功能相似的规则。</li>
            <li><strong>定期维护</strong>：禁用或删除不再使用的规则；通过「运行记录」和「日志查询」排查异常。</li>
          </ol>
        </ChannelHelpBlock>
      </div>
    </article>
  </a-drawer>
</template>

<script setup>
import ChannelHelpBlock from '@/components/channel-help/ChannelHelpBlock.vue'
import ChannelHelpParamList from '@/components/channel-help/ChannelHelpParamList.vue'

defineProps({
  visible: { type: Boolean, default: false },
})

const emit = defineEmits(['update:visible', 'cancel'])

const basicConcepts = [
  {
    label: '数据源 (Sources)',
    desc: '规则的输入变量。为每个源设置简短别名（如 t1、p1），以便在表达式中引用。',
  },
  {
    label: '触发条件 (Condition)',
    desc: '返回 true/false 的布尔表达式。仅当条件满足时触发动作（Calculation 类型除外）。',
  },
  {
    label: '动作 (Actions)',
    desc: '规则触发后执行的一系列操作，可串联多个步骤。',
  },
  {
    label: '触发模式',
    desc: '「始终触发」每次检查满足条件即执行；「仅状态改变时触发」仅在 false→true 或 true→false 时执行，适合告警去重。',
  },
  {
    label: '检查频率',
    desc: '规则评估周期（如 1s、5s、1m）；频率越高响应越快，CPU 占用也越高。',
  },
  {
    label: '优先级',
    desc: '数值越大优先级越高；多条规则同时触发时按优先级排序执行。',
  },
]

const syntaxItems = [
  { label: '当前点位值', example: 'v / value', desc: '当前触发点位的实时值' },
  { label: '数据源别名', example: 't1, p1', desc: '在规则中定义的 Sources 别名' },
  { label: '读取位', example: 'bitget(v, n)', desc: '获取第 n 位 (0/1)' },
  { label: '置位', example: 'bitset(v, n)', desc: '将第 n 位置 1' },
  { label: '清位', example: 'bitclr(v, n)', desc: '将第 n 位置 0' },
]

const onCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}
</script>

<style scoped>
/* v3.0 — src/styles/help-drawer.css */
</style>
