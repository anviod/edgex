<template>
  <a-modal
    v-model:visible="visible"
    title="edgeOS 通信协议帮助"
    width="800px"
    modal-class="northbound-help-modal"
    :footer="false"
    @cancel="handleCancel"
  >
    <a-tabs default-active-key="mqtt">
      <a-tab-pane key="mqtt" title="edgeOS(MQTT)">
        <div class="nb-help-doc">
          <header class="nb-help-hero">
            <h4 class="nb-help-hero__title">概述</h4>
            <p class="nb-help-hero__lead">
              edgeOS(MQTT) 北向通道，将 EdgeX 数据上报至 edgeOS 蜂群网络。完整协议见
              <a href="/docs/edgeos/EdgeX通信协议规范(MQTT-NATS).html" target="_blank" class="nb-help-link">EdgeX 通信协议规范</a>。
            </p>
          </header>

          <div class="nb-help-block">
            <div class="nb-help-block-title">消息主题 (Topics)</div>
            <div class="nb-help-table-wrap">
              <table class="nb-help-table">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>方向</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>edgex/nodes/register</code></td>
                    <td>EdgeX → EdgeOS</td>
                    <td>节点注册</td>
                  </tr>
                  <tr>
                    <td><code>edgex/data/{node_id}/{device_id}</code></td>
                    <td>EdgeX → EdgeOS</td>
                    <td>实时数据上报</td>
                  </tr>
                  <tr>
                    <td><code>edgex/nodes/{node_id}/heartbeat</code></td>
                    <td>EdgeX → EdgeOS</td>
                    <td>节点心跳</td>
                  </tr>
                  <tr>
                    <td><code>edgex/cmd/{node_id}/discover</code></td>
                    <td>EdgeOS → EdgeX</td>
                    <td>设备发现命令</td>
                  </tr>
                  <tr>
                    <td><code>edgex/cmd/{node_id}/{device_id}/write</code></td>
                    <td>EdgeOS → EdgeX</td>
                    <td>写入设备数据</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="nb-help-block">
            <div class="nb-help-block-title">消息格式</div>
            <pre class="nb-help-pre"><code>{
  "header": {
    "message_id": "msg-001",
    "timestamp": 1744680000000,
    "source": "edgex-node-001",
    "message_type": "data",
    "version": "1.0"
  },
  "body": {
    "node_id": "edgex-node-001",
    "device_id": "device-001",
    "timestamp": 1744680000000,
    "points": {
      "Temperature": 25.5,
      "Humidity": 65.2
    },
    "quality": "good"
  }
}</code></pre>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="nats" title="edgeOS(NATS)">
        <div class="nb-help-doc">
          <header class="nb-help-hero">
            <h4 class="nb-help-hero__title">概述</h4>
            <p class="nb-help-hero__lead">
              edgeOS(NATS) 北向通道，Subject 命名与 MQTT 版对应（<code>.</code> 分隔）。协议细节见
              <a href="/docs/edgeos/EdgeX通信协议规范(MQTT-NATS).html" target="_blank" class="nb-help-link">EdgeX 通信协议规范</a>。
            </p>
          </header>

          <div class="nb-help-block">
            <div class="nb-help-block-title">消息主题 (Subjects)</div>
            <div class="nb-help-table-wrap">
              <table class="nb-help-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>方向</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>edgex.nodes.register</code></td>
                    <td>EdgeX → EdgeOS</td>
                    <td>节点注册</td>
                  </tr>
                  <tr>
                    <td><code>edgex.data.{node_id}.{device_id}</code></td>
                    <td>EdgeX → EdgeOS</td>
                    <td>实时数据上报</td>
                  </tr>
                  <tr>
                    <td><code>edgex.nodes.{node_id}.heartbeat</code></td>
                    <td>EdgeX → EdgeOS</td>
                    <td>节点心跳</td>
                  </tr>
                  <tr>
                    <td><code>edgex.cmd.{node_id}.discover</code></td>
                    <td>EdgeOS → EdgeX</td>
                    <td>设备发现命令</td>
                  </tr>
                  <tr>
                    <td><code>edgex.cmd.{node_id}.{device_id}.write</code></td>
                    <td>EdgeOS → EdgeX</td>
                    <td>写入设备数据</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="nb-help-block">
            <div class="nb-help-block-title">通配符</div>
            <ul class="nb-help-list">
              <li><code>*</code> - 匹配单个 token</li>
              <li><code>></code> - 匹配一个或多个 tokens</li>
            </ul>
          </div>

          <div class="nb-help-block">
            <div class="nb-help-block-title">示例</div>
            <pre class="nb-help-pre"><code>// 订阅所有设备的写入命令
edgex.cmd.edgex-node-001.*.write

// 订阅所有数据上报
edgex.data.>></code></pre>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="config" title="配置说明">
        <div class="nb-help-doc">
          <div class="nb-help-block">
            <div class="nb-help-block-title">edgeOS(MQTT) 配置项</div>
            <div class="nb-help-table-wrap">
              <table class="nb-help-table">
                <thead>
                  <tr>
                    <th>配置项</th>
                    <th>类型</th>
                    <th>说明</th>
                    <th>默认值</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>broker</td>
                    <td>string</td>
                    <td>MQTT Broker 地址</td>
                    <td>tcp://127.0.0.1:1883</td>
                  </tr>
                  <tr>
                    <td>client_id</td>
                    <td>string</td>
                    <td>MQTT 客户端 ID</td>
                    <td>edgex-node-001</td>
                  </tr>
                  <tr>
                    <td>node_id</td>
                    <td>string</td>
                    <td>节点唯一标识</td>
                    <td>edgex-node-001</td>
                  </tr>
                  <tr>
                    <td>qos</td>
                    <td>byte</td>
                    <td>QoS 级别 (0/1/2)</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>keep_alive</td>
                    <td>int</td>
                    <td>心跳间隔(秒)</td>
                    <td>60</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="nb-help-block">
            <div class="nb-help-block-title">edgeOS(NATS) 配置项</div>
            <div class="nb-help-table-wrap">
              <table class="nb-help-table">
                <thead>
                  <tr>
                    <th>配置项</th>
                    <th>类型</th>
                    <th>说明</th>
                    <th>默认值</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>url</td>
                    <td>string</td>
                    <td>NATS 服务器 URL</td>
                    <td>nats://127.0.0.1:4222</td>
                  </tr>
                  <tr>
                    <td>client_id</td>
                    <td>string</td>
                    <td>NATS 客户端名称</td>
                    <td>edgex-node-001</td>
                  </tr>
                  <tr>
                    <td>jetstream_enabled</td>
                    <td>bool</td>
                    <td>是否启用 JetStream</td>
                    <td>false</td>
                  </tr>
                  <tr>
                    <td>max_reconnects</td>
                    <td>int</td>
                    <td>最大重连次数</td>
                    <td>10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible'])

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const handleCancel = () => {
  emit('update:visible', false)
}
</script>
