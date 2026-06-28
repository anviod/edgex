<template>
  <div class="page-shell channel-list-container">
    <div class="page-header channel-header">
      <div class="header-title">
        <h2 class="page-title title-text">采集通道</h2>
        <div class="page-subtitle title-subtitle">管理工业设备通信通道及协议配置</div>
      </div>
      <div class="header-actions channel-header-actions">
        <a-space size="small">
          <a-radio-group v-model="viewMode" type="button" size="small">
            <a-radio value="card">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </a-radio>
            <a-radio value="list">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </a-radio>
          </a-radio-group>
        </a-space>
        <a-space size="small" wrap>
            <a-button v-if="selectionMode && selectedChannels.length > 0" status="warning" size="small" @click="openBatchConfig">
              <template #icon>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                </svg>
              </template>批量配置
            </a-button>
            <a-button :type="selectionMode ? 'secondary' : 'outline'" size="small" @click="toggleSelectionMode">
              <template #icon>
                <svg v-if="selectionMode" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <polyline points="9 11 12 14 22 4"/>
                </svg>
              </template>
              {{ selectionMode ? '取消选择' : '批量操作' }}
            </a-button>
            <a-button type="outline" size="small" :loading="loading" @click="fetchChannels">
              <template #icon>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
              </template>刷新
            </a-button>
            <a-button type="primary" size="small" @click="openAddDialog">
              <template #icon>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </template>添加通道
            </a-button>
            <a-button type="text" size="small" class="help-trigger-btn" @click="openChannelHelp">
              <template #icon>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </template>
              帮助说明
            </a-button>
        </a-space>
      </div>
    </div>

    <a-spin :loading="loading" tip="数据同步中..." style="width: 100%">
      <div v-if="channels.length > 0">
        <a-row v-if="viewMode === 'card'" :gutter="[16, 16]">
          <a-col v-for="item in channels" :key="item.id" :xs="24" :sm="12" :md="12" :lg="8">
            <a-card 
              class="minimal-line-card" 
              :class="{ 'is-selected': isSelected(item.id) }" 
              hoverable 
              @click="handleCardClick(item)"
            >
              <template #title>
                <div class="card-title-content">
                  <span class="protocol-tag">{{ formatProtocolTag(item.protocol) }}</span>
                  <span class="name-text text-truncate">{{ item.name }}</span>
                </div>
              </template>
              <template #extra>
                <a-tag :color="item.enableColor" size="small" bordered>{{ item.enableText }}</a-tag>
              </template>

              <div class="card-info-body">
                <div class="info-item">
                  <span class="label">通道 ID</span>
                  <span class="value">{{ item.id }}</span>
                </div>
                <div class="info-item">
                  <span class="label">关联设备</span>
                  <span class="value-highlight">{{ item.deviceCount }} <small>台</small></span>
                </div>
                <div class="info-item">
                  <span class="label">运行状态</span>
                  <a-badge :status="item.runtimeArcoStatus" :text="item.runtimeText" />
                </div>
              </div>

              <template #actions>
                <a-tooltip content="监控指标">
                  <a-button type="text" size="small" @click.stop="openMetricsDialog(item)">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                  </a-button>
                </a-tooltip>
                <a-tooltip content="编辑">
                  <a-button type="text" size="small" @click.stop="openEditDialog(item)">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </a-button>
                </a-tooltip>
                <a-tooltip v-if="item.protocol === 'bacnet-ip'" content="扫描设备">
                  <a-button type="text" size="small" @click.stop="scanChannel(item)">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2a10 10 0 1010 10 10 10 0 00-10-10z"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </a-button>
                </a-tooltip>
                <a-tooltip content="删除">
                  <a-button type="text" size="small" status="danger" @click.stop="deleteChannel(item)">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                    </svg>
                  </a-button>
                </a-tooltip>
              </template>
            </a-card>
          </a-col>
        </a-row>

        <div v-else class="table-container">
        <a-table 
          :columns="tableColumns" 
          :data="channels" 
          :row-selection="selectionMode ? rowSelection : undefined"
          row-key="id"
          size="small"
          :bordered="{ cell: true }"
          :pagination="false"
        >
          <template #name="{ record }">
            <a-link @click="goToDevices(record)" icon>{{ record.name }}</a-link>
          </template>

          <template #enable="{ record }">
            <span class="table-cell-semantic">
              <a-tag :color="record.enableColor" size="small" bordered>{{ record.enableText }}</a-tag>
            </span>
          </template>

          <template #runtime="{ record }">
            <span class="table-cell-semantic">
              <a-badge :status="record.runtimeArcoStatus" :text="record.runtimeText" />
            </span>
          </template>

          <template #deviceCount="{ record }">
            <a-tooltip :content="`${record.deviceCount} 台设备`">
              <span class="table-cell-count">{{ record.deviceCount }}</span>
            </a-tooltip>
          </template>

          <template #actions="{ record }">
            <a-space>
              <a-tooltip content="监控">
                <a-button type="text" size="mini" @click="openMetricsDialog(record)">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </a-button>
              </a-tooltip>
              <a-tooltip content="编辑">
                <a-button type="text" size="mini" @click="openEditDialog(record)">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </a-button>
              </a-tooltip>
              <a-tooltip v-if="record.protocol === 'bacnet-ip'" content="扫描">
                <a-button type="text" size="mini" @click="scanChannel(record)">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2a10 10 0 1010 10 10 10 0 00-10-10z"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </a-button>
              </a-tooltip>
              <a-tooltip content="删除">
                <a-button type="text" size="mini" status="danger" @click="deleteChannel(record)">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                  </svg>
                </a-button>
              </a-tooltip>
            </a-space>
          </template>
        </a-table>
        </div>
      </div>
      <a-empty v-else class="empty-placeholder" />
    </a-spin>

    <!-- Add/Edit Dialog -->
    <a-modal 
      v-model:visible="dialog.show" 
      :title="dialog.isEdit ? '编辑通道' : '添加通道'"
      :width="760"
      modal-class="channel-config-modal"
      @ok="saveChannel"
    >
      <a-form :model="dialog.form" layout="vertical" class="channel-config-form flow-form form-controls-md">
        <a-form-item field="id" label="ID" required>
          <a-input v-model="dialog.form.id" :disabled="dialog.isEdit" placeholder="请输入ID">
            <template #append v-if="!dialog.isEdit">
              <a-button @click="generateId">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
              </a-button>
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item field="name" label="名称" required>
          <a-input v-model="dialog.form.name" placeholder="给通道起一个易于识别的名称" />
        </a-form-item>

        <a-form-item field="protocol" label="协议" required>
          <a-select v-model="dialog.form.protocol" :options="protocols" placeholder="请选择协议" />
        </a-form-item>

        <a-form-item field="enable" label="启用">
          <a-switch v-model="dialog.form.enable" />
        </a-form-item>

        <div class="modal-section__title config-section-header">
          <span>协议配置</span>
          <a-tooltip content="用推荐值填充尚未填写的配置项，不会覆盖已有内容">
            <a-button type="outline" size="mini" :disabled="!dialog.form.protocol" @click="fillDefaultConfig">
              <template #icon>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </template>
              填充默认参数
            </a-button>
          </a-tooltip>
        </div>

        <!-- Modbus TCP & Modbus RTU Over TCP Config -->
        <div v-if="dialog.form.protocol === 'modbus-tcp' || dialog.form.protocol === 'modbus-rtu-over-tcp'" class="config-section">
          <a-form-item field="config.url" :label="dialog.form.protocol === 'modbus-rtu-over-tcp' ? 'URL (tcp+rtu://ip:port)' : 'URL (tcp://ip:port)'">
            <a-input v-model="dialog.form.config.url" />
          </a-form-item>
          <a-form-item field="config.timeout" label="超时时间 (ms)">
            <a-input-number v-model="dialog.form.config.timeout" :min="100" :max="60000" placeholder="2000" />
          </a-form-item>

          <div class="advanced-block">
            <div class="modal-section__title modal-section__title--sub">高级配置</div>
            <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="12">
              <a-form-item field="config.max_retries" label="最大重试次数">
                <a-input-number v-model="dialog.form.config.max_retries" :min="0" :max="10" placeholder="3" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="config.retry_interval" label="重试间隔 (ms)">
                <a-input-number v-model="dialog.form.config.retry_interval" :min="10" :max="1000" placeholder="100" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="config.instruction_interval" label="指令间隔 (ms)">
                <a-input-number v-model="dialog.form.config.instruction_interval" :min="1" :max="100" placeholder="10" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="config.start_address" label="起始地址">
                <a-select v-model="dialog.form.config.start_address" placeholder="默认 1 (40001)">
                  <a-option :value="0">0 (40000)</a-option>
                  <a-option :value="1">1 (40001)</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="config.byte_order_4" label="4字节字节序">
                <a-select v-model="dialog.form.config.byte_order_4" placeholder="默认 ABCD (Big Endian)">
                  <a-option value="ABCD">ABCD</a-option>
                  <a-option value="CDAB">CDAB</a-option>
                  <a-option value="BADC">BADC</a-option>
                  <a-option value="DCBA">DCBA</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="config.enableSmartProbe" label="启用智能地址探测">
                <a-switch v-model="dialog.form.config.enableSmartProbe" />
              </a-form-item>
            </a-col>
            <a-col :span="12" v-if="dialog.form.config.enableSmartProbe">
              <a-form-item field="config.probeMaxDepth" label="探测深度">
                <a-input-number v-model="dialog.form.config.probeMaxDepth" :min="1" :max="10" placeholder="6" />
              </a-form-item>
            </a-col>
            <a-col :span="12" v-if="dialog.form.config.enableSmartProbe">
              <a-form-item field="config.probeTimeout" label="探测超时 (ms)">
                <a-input-number v-model="dialog.form.config.probeTimeout" :min="100" :max="10000" placeholder="3000" />
              </a-form-item>
            </a-col>
            <a-col :span="12" v-if="dialog.form.config.enableSmartProbe">
              <a-form-item field="config.probeMaxConsecutive" label="最大连续失败">
                <a-input-number v-model="dialog.form.config.probeMaxConsecutive" :min="1" :max="100" placeholder="20" />
              </a-form-item>
            </a-col>
            <a-col :span="12" v-if="dialog.form.config.enableSmartProbe">
              <a-form-item field="config.probeEnableMTU" label="启用MTU探测">
                <a-switch v-model="dialog.form.config.probeEnableMTU" />
              </a-form-item>
            </a-col>
          </a-row>
          </div>
        </div>

        <!-- DLT645 Config -->
        <div v-if="dialog.form.protocol === 'dlt645'" class="config-section">
          <a-form-item field="config.connectionType" label="连接方式">
            <a-select v-model="dialog.form.config.connectionType" placeholder="请选择连接方式">
              <a-option value="serial">串口 (Serial)</a-option>
              <a-option value="tcp">网络 (TCP)</a-option>
            </a-select>
          </a-form-item>
          <div v-if="dialog.form.config.connectionType === 'tcp'">
            <a-form-item field="config.ip" label="设备 IP 地址">
              <a-input v-model="dialog.form.config.ip" placeholder="192.168.1.100" />
            </a-form-item>
            <a-form-item field="config.port" label="端口">
              <a-input-number v-model="dialog.form.config.port" :min="1" :max="65535" placeholder="8001" />
            </a-form-item>
            <a-form-item field="config.timeout" label="超时时间 (ms)">
              <a-input-number v-model="dialog.form.config.timeout" :min="100" :max="60000" placeholder="2000" />
            </a-form-item>
          </div>
        </div>

        <!-- Modbus RTU & DLT645 Serial Config -->
        <div v-if="dialog.form.protocol === 'modbus-rtu' || (dialog.form.protocol === 'dlt645' && dialog.form.config.connectionType === 'serial')" class="config-section">
          <a-form-item field="config.port" label="串口设备">
            <a-input v-model="dialog.form.config.port" placeholder="/dev/ttyS1" />
          </a-form-item>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="6">
              <a-form-item field="config.baudRate" label="波特率">
                <a-select v-model="dialog.form.config.baudRate" placeholder="9600">
                  <a-option :value="1200">1200</a-option>
                  <a-option :value="2400">2400</a-option>
                  <a-option :value="4800">4800</a-option>
                  <a-option :value="9600">9600</a-option>
                  <a-option :value="19200">19200</a-option>
                  <a-option :value="38400">38400</a-option>
                  <a-option :value="57600">57600</a-option>
                  <a-option :value="115200">115200</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item field="config.dataBits" label="数据位">
                <a-select v-model="dialog.form.config.dataBits" placeholder="8">
                  <a-option :value="5">5</a-option>
                  <a-option :value="6">6</a-option>
                  <a-option :value="7">7</a-option>
                  <a-option :value="8">8</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item field="config.stopBits" label="停止位">
                <a-select v-model="dialog.form.config.stopBits" placeholder="1">
                  <a-option :value="1">1</a-option>
                  <a-option :value="2">2</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item field="config.parity" label="校验位">
                <a-select v-model="dialog.form.config.parity" placeholder="无校验">
                  <a-option value="N">无校验 (None)</a-option>
                  <a-option value="E">偶校验 (Even)</a-option>
                  <a-option value="O">奇校验 (Odd)</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item field="config.timeout" label="超时时间 (ms)">
            <a-input-number v-model="dialog.form.config.timeout" :min="100" :max="60000" placeholder="2000" />
          </a-form-item>

          <!-- Modbus RTU Advanced Config -->
          <div v-if="dialog.form.protocol === 'modbus-rtu'" class="advanced-block">
            <div class="modal-section__title modal-section__title--sub">高级配置</div>
            <a-row :gutter="[24, 16]" class="field-grid">
              <a-col :span="12">
                <a-form-item field="config.max_retries" label="最大重试次数">
                  <a-input-number v-model="dialog.form.config.max_retries" :min="0" :max="10" placeholder="3" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="config.retry_interval" label="重试间隔 (ms)">
                  <a-input-number v-model="dialog.form.config.retry_interval" :min="10" :max="1000" placeholder="100" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="config.instruction_interval" label="指令间隔 (ms)">
                  <a-input-number v-model="dialog.form.config.instruction_interval" :min="1" :max="100" placeholder="10" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="config.start_address" label="起始地址">
                  <a-select v-model="dialog.form.config.start_address" placeholder="默认 1 (40001)">
                    <a-option :value="0">0 (40000)</a-option>
                    <a-option :value="1">1 (40001)</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="config.byte_order_4" label="4字节字节序">
                  <a-select v-model="dialog.form.config.byte_order_4" placeholder="默认 ABCD (Big Endian)">
                    <a-option value="ABCD">ABCD</a-option>
                    <a-option value="CDAB">CDAB</a-option>
                    <a-option value="BADC">BADC</a-option>
                    <a-option value="DCBA">DCBA</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>

        <!-- BACnet IP Config -->
        <div v-if="dialog.form.protocol === 'bacnet-ip'" class="config-section">
          <a-form-item field="config.ip" label="IP地址">
            <a-input v-model="dialog.form.config.ip" placeholder="0.0.0.0 (默认)" />
          </a-form-item>
          <a-form-item field="config.port" label="端口">
            <a-input-number v-model="dialog.form.config.port" :min="1" :max="65535" placeholder="47808 (默认)" />
          </a-form-item>
          <div class="advanced-block">
            <div class="modal-section__title modal-section__title--sub">加密参数 (可选)</div>
          <a-form-item field="config.key" label="密钥">
            <a-input v-model="dialog.form.config.key" type="password" />
          </a-form-item>
          <a-form-item field="config.cert" label="证书路径">
            <a-input v-model="dialog.form.config.cert" />
          </a-form-item>
          <a-form-item field="config.ca" label="CA证书路径">
            <a-input v-model="dialog.form.config.ca" />
          </a-form-item>
          </div>
        </div>

        <!-- OPC UA Config -->
        <div v-if="dialog.form.protocol === 'opc-ua'" class="config-section">
          <a-form-item field="config.url" label="Endpoint URL">
            <a-input v-model="dialog.form.config.url" placeholder="opc.tcp://localhost:4840" />
          </a-form-item>
        </div>

        <!-- S7 Config -->
        <div v-if="dialog.form.protocol === 's7'" class="config-section">
          <div class="modal-section__title modal-section__title--sub">基础连接</div>
          <a-form-item field="config.ip" label="PLC IP 地址" required>
            <a-input v-model="dialog.form.config.ip" placeholder="192.168.1.10" />
          </a-form-item>
          <a-form-item field="config.port" label="PLC 端口">
            <a-input-number v-model="dialog.form.config.port" :min="1" :max="65535" placeholder="102 (默认)" />
          </a-form-item>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.plcType" label="PLC 型号">
                <a-select v-model="dialog.form.config.plcType" placeholder="请选择" allow-clear>
                  <a-option value="S7-200Smart">S7-200Smart</a-option>
                  <a-option value="S7-1200">S7-1200</a-option>
                  <a-option value="S7-1500">S7-1500</a-option>
                  <a-option value="S7-300">S7-300</a-option>
                  <a-option value="S7-400">S7-400</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.rack" label="机架号 (Rack)">
                <a-input-number v-model="dialog.form.config.rack" :min="0" :max="10" placeholder="自动" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.slot" label="槽号 (Slot)">
                <a-input-number v-model="dialog.form.config.slot" :min="0" :max="10" placeholder="自动" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.connect_type" label="连接类型">
                <a-select v-model="dialog.form.config.connect_type" placeholder="自动" allow-clear>
                  <a-option value="PG">PG (编程设备)</a-option>
                  <a-option value="OP">OP (操作面板)</a-option>
                  <a-option value="S7Basic">S7 Basic</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.startup" label="启动方式">
                <a-select v-model="dialog.form.config.startup" placeholder="请选择" allow-clear>
                  <a-option value="cold">冷启动</a-option>
                  <a-option value="warm">热启动</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.cpu_protection" label="CPU停机保护">
                <a-switch v-model="dialog.form.config.cpu_protection" />
              </a-form-item>
            </a-col>
          </a-row>

          <div class="modal-section__title modal-section__title--sub">通信参数</div>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.timeout" label="超时时间 (ms)">
                <a-input-number v-model="dialog.form.config.timeout" :min="500" :max="30000" placeholder="2000" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.max_retries" label="重试次数">
                <a-input-number v-model="dialog.form.config.max_retries" :min="0" :max="10" placeholder="1" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.heartbeat_interval" label="心跳间隔 (ms)">
                <a-input-number v-model="dialog.form.config.heartbeat_interval" :min="0" :max="300000" placeholder="30000" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.pdu_size" label="PDU缓冲区 (字节)">
                <a-input-number v-model="dialog.form.config.pdu_size" :min="240" :max="960" placeholder="4096" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.qos" label="QoS 等级">
                <a-select v-model="dialog.form.config.qos" placeholder="1" allow-clear>
                  <a-option :value="0">0 - 最多一次</a-option>
                  <a-option :value="1">1 - 至少一次</a-option>
                  <a-option :value="2">2 - 恰好一次</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.connect_timeout" label="连接超时 (ms)">
                <a-input-number v-model="dialog.form.config.connect_timeout" :min="500" :max="60000" placeholder="5000" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.batch_read_max" label="批量读取上限">
                <a-input-number v-model="dialog.form.config.batch_read_max" :min="1" :max="500" placeholder="100" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- Omron FINS Config -->
        <div v-if="dialog.form.protocol === 'omron-fins'" class="config-section">
          <div class="modal-section__title modal-section__title--sub">基础连接</div>
          <a-form-item field="config.ip" label="PLC IP 地址" required>
            <a-input v-model="dialog.form.config.ip" placeholder="192.168.1.100" />
          </a-form-item>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.port" label="PLC 端口">
                <a-input-number v-model="dialog.form.config.port" :min="1" :max="65535" placeholder="9600 (默认)" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.mode" label="传输模式">
                <a-select v-model="dialog.form.config.mode" placeholder="TCP">
                  <a-option value="TCP">TCP</a-option>
                  <a-option value="UDP">UDP</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.model" label="PLC 型号">
                <a-select v-model="dialog.form.config.model" placeholder="请选择" allow-clear>
                  <a-option value="CP1E">CP1E</a-option>
                  <a-option value="CP1H">CP1H</a-option>
                  <a-option value="CJ">CJ 系列</a-option>
                  <a-option value="CS">CS 系列</a-option>
                  <a-option value="NJ">NJ 系列</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <div class="modal-section__title modal-section__title--sub">FINS 节点地址</div>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.src_network_addr" label="源网络地址">
                <a-input-number v-model="dialog.form.config.src_network_addr" :min="0" :max="255" placeholder="0" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.src_node_addr" label="源节点地址">
                <a-input-number v-model="dialog.form.config.src_node_addr" :min="0" :max="255" placeholder="1" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.src_unit_addr" label="源单元地址">
                <a-input-number v-model="dialog.form.config.src_unit_addr" :min="0" :max="255" placeholder="255" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.dst_network_addr" label="目标网络地址">
                <a-input-number v-model="dialog.form.config.dst_network_addr" :min="0" :max="255" placeholder="0" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.dst_node_addr" label="目标节点地址">
                <a-input-number v-model="dialog.form.config.dst_node_addr" :min="0" :max="255" placeholder="PLC IP 末段" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.dst_unit_addr" label="目标单元地址">
                <a-input-number v-model="dialog.form.config.dst_unit_addr" :min="0" :max="255" placeholder="0" />
              </a-form-item>
            </a-col>
          </a-row>

          <div class="modal-section__title modal-section__title--sub">通信参数</div>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.timeout" label="超时时间 (ms)">
                <a-input-number v-model="dialog.form.config.timeout" :min="500" :max="30000" placeholder="3000" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.max_retries" label="重试次数">
                <a-input-number v-model="dialog.form.config.max_retries" :min="0" :max="10" placeholder="3" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.heartbeat_interval" label="心跳间隔 (ms)">
                <a-input-number v-model="dialog.form.config.heartbeat_interval" :min="0" :max="300000" placeholder="30000" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.maxFrameLength" label="批量读取字数上限">
                <a-input-number v-model="dialog.form.config.maxFrameLength" :min="1" :max="500" placeholder="64" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.min_interval" label="指令间隔 (ms)">
                <a-input-number v-model="dialog.form.config.min_interval" :min="0" :max="1000" placeholder="0" />
              </a-form-item>
            </a-col>
            <a-col :span="8" v-if="dialog.form.config.mode === 'UDP'">
              <a-form-item field="config.local_port" label="本地 UDP 端口">
                <a-input-number v-model="dialog.form.config.local_port" :min="0" :max="65535" placeholder="0 (自动)" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- KNXnet/IP Config -->
        <div v-if="dialog.form.protocol === 'knxnet-ip'" class="config-section">
          <div class="modal-section__title modal-section__title--sub">基础连接</div>
          <a-form-item field="config.ip" label="网关 IP">
            <a-input v-model="dialog.form.config.ip" placeholder="192.168.1.50（启用自动发现时可留空）" />
          </a-form-item>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.port" label="端口">
                <a-input-number v-model="dialog.form.config.port" :min="1" :max="65535" placeholder="3671 (默认)" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.mode" label="传输模式">
                <a-select v-model="dialog.form.config.mode" placeholder="UDP">
                  <a-option value="UDP">UDP</a-option>
                  <a-option value="TCP">TCP</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.timeout" label="超时时间 (ms)">
                <a-input-number v-model="dialog.form.config.timeout" :min="100" :max="60000" placeholder="3000" />
              </a-form-item>
            </a-col>
          </a-row>

          <div class="modal-section__title modal-section__title--sub">通信参数</div>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.max_retries" label="重试次数">
                <a-input-number v-model="dialog.form.config.max_retries" :min="0" :max="10" placeholder="3" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.heartbeat_interval" label="心跳间隔 (ms)">
                <a-input-number v-model="dialog.form.config.heartbeat_interval" :min="0" :max="300000" placeholder="60000" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.local_ip" label="本地 IP (可选)">
                <a-input v-model="dialog.form.config.local_ip" placeholder="192.168.1.10" />
              </a-form-item>
            </a-col>
          </a-row>

          <div class="modal-section__title modal-section__title--sub">网关发现 (SEARCH)</div>
          <a-form-item field="config.discovery" label="启用自动发现">
            <a-switch v-model="dialog.form.config.discovery" />
          </a-form-item>
          <a-row v-if="dialog.form.config.discovery" :gutter="[24, 16]" class="field-grid">
            <a-col :span="12">
              <a-form-item field="config.discovery_timeout" label="发现超时 (ms)">
                <a-input-number v-model="dialog.form.config.discovery_timeout" :min="500" :max="30000" placeholder="5000" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="config.discovery_multicast" label="多播地址">
                <a-input v-model="dialog.form.config.discovery_multicast" placeholder="224.0.23.12:3671" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- Profinet IO Config -->
        <div v-if="dialog.form.protocol === 'profinet-io'" class="config-section">
          <div class="modal-section__title modal-section__title--sub">基础连接</div>
          <a-form-item field="config.local_interface" label="本地网口" required>
            <a-input v-model="dialog.form.config.local_interface" placeholder="eth0" />
            <template #extra>绑定用于 PROFINET 通信的物理网卡，需裸机部署</template>
          </a-form-item>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.timeout" label="超时时间 (ms)">
                <a-input-number v-model="dialog.form.config.timeout" :min="100" :max="60000" placeholder="3000" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.max_retries" label="重试次数">
                <a-input-number v-model="dialog.form.config.max_retries" :min="0" :max="10" placeholder="3" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.heartbeat_interval" label="心跳间隔 (ms)">
                <a-input-number v-model="dialog.form.config.heartbeat_interval" :min="0" :max="300000" placeholder="30000" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item field="config.simulation" label="模拟模式">
            <a-switch v-model="dialog.form.config.simulation" />
            <template #extra>开发测试时使用，无需真实 PROFINET IO 设备</template>
          </a-form-item>
        </div>

        <!-- Mitsubishi MC Config -->
        <div v-if="dialog.form.protocol === 'mitsubishi-slmp'" class="config-section">
          <div class="modal-section__title modal-section__title--sub">基础连接</div>
          <a-form-item field="config.ip" label="PLC IP 地址" required>
            <a-input v-model="dialog.form.config.ip" placeholder="192.168.1.10" />
          </a-form-item>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.port" label="PLC 端口">
                <a-input-number v-model="dialog.form.config.port" :min="1" :max="65535" placeholder="5000 (默认)" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.frame_type" label="帧类型">
                <a-select v-model="dialog.form.config.frame_type" placeholder="3E">
                  <a-option value="3E">3E (Q/L/iQ-R)</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.station_no" label="站号">
                <a-input-number v-model="dialog.form.config.station_no" :min="0" :max="255" placeholder="0" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.network_no" label="网络号">
                <a-input-number v-model="dialog.form.config.network_no" :min="0" :max="255" placeholder="0" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.pc_no" label="PC 编号">
                <a-input-number v-model="dialog.form.config.pc_no" :min="0" :max="255" placeholder="255" />
              </a-form-item>
            </a-col>
          </a-row>

          <div class="modal-section__title modal-section__title--sub">通信参数</div>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.timeout" label="超时时间 (ms)">
                <a-input-number v-model="dialog.form.config.timeout" :min="500" :max="30000" placeholder="3000" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.max_retries" label="重试次数">
                <a-input-number v-model="dialog.form.config.max_retries" :min="0" :max="10" placeholder="2" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.batch_read_max" label="批量读取上限">
                <a-input-number v-model="dialog.form.config.batch_read_max" :min="1" :max="500" placeholder="64" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- IEC 60870-5-104 Config -->
        <div v-if="dialog.form.protocol === 'iec60870-5-104'" class="config-section">
          <div class="modal-section__title modal-section__title--sub">基础连接</div>
          <a-form-item field="config.ip" label="设备 IP 地址" required>
            <a-input v-model="dialog.form.config.ip" placeholder="192.168.1.100" />
          </a-form-item>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.port" label="端口">
                <a-input-number v-model="dialog.form.config.port" :min="1" :max="65535" placeholder="2404 (默认)" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.commonAddress" label="公共地址 CA">
                <a-input-number v-model="dialog.form.config.commonAddress" :min="1" :max="65535" placeholder="1" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.generalCallInterval" label="总召唤间隔 (秒)">
                <a-input-number v-model="dialog.form.config.generalCallInterval" :min="0" :max="86400" placeholder="300" />
              </a-form-item>
            </a-col>
          </a-row>
          <div class="modal-section__title modal-section__title--sub">协议定时器</div>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="6">
              <a-form-item field="config.t0" label="T0 (秒)">
                <a-input-number v-model="dialog.form.config.t0" :min="1" :max="120" placeholder="10" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item field="config.t1" label="T1 (秒)">
                <a-input-number v-model="dialog.form.config.t1" :min="1" :max="120" placeholder="15" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item field="config.t2" label="T2 (秒)">
                <a-input-number v-model="dialog.form.config.t2" :min="1" :max="120" placeholder="10" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item field="config.t3" label="T3 (秒)">
                <a-input-number v-model="dialog.form.config.t3" :min="1" :max="120" placeholder="20" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- SNMP Config -->
        <div v-if="dialog.form.protocol === 'snmp'" class="config-section">
          <div class="modal-section__title modal-section__title--sub">基础连接</div>
          <a-form-item field="config.ip" label="设备 IP 地址" required>
            <a-input v-model="dialog.form.config.ip" placeholder="192.168.1.1" />
          </a-form-item>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.port" label="端口">
                <a-input-number v-model="dialog.form.config.port" :min="1" :max="65535" placeholder="161 (默认)" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.snmpVersion" label="SNMP 版本">
                <a-select v-model="dialog.form.config.snmpVersion" placeholder="v2c">
                  <a-option value="v2c">v2c</a-option>
                  <a-option value="v3">v3</a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.timeout" label="超时 (ms)">
                <a-input-number v-model="dialog.form.config.timeout" :min="500" :max="60000" placeholder="3000" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.retries" label="重试次数">
                <a-input-number v-model="dialog.form.config.retries" :min="0" :max="10" placeholder="3" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.maxBulkSize" label="GETBULK 数量">
                <a-input-number v-model="dialog.form.config.maxBulkSize" :min="1" :max="100" placeholder="10" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.sendInterval" label="发送间隔 (ms)">
                <a-input-number v-model="dialog.form.config.sendInterval" :min="0" :max="5000" placeholder="100" />
              </a-form-item>
            </a-col>
          </a-row>

          <div v-if="!dialog.form.config.snmpVersion || dialog.form.config.snmpVersion === 'v2c'">
            <div class="modal-section__title modal-section__title--sub">SNMP v2c</div>
            <a-form-item field="config.community" label="Community 社区字符串">
              <a-input v-model="dialog.form.config.community" placeholder="public" />
            </a-form-item>
          </div>

          <div v-if="dialog.form.config.snmpVersion === 'v3'">
            <div class="modal-section__title modal-section__title--sub">SNMP v3 安全</div>
            <a-form-item field="config.securityName" label="安全名称 (用户名)" required>
              <a-input v-model="dialog.form.config.securityName" placeholder="admin" />
            </a-form-item>
            <a-row :gutter="[24, 16]" class="field-grid">
              <a-col :span="8">
                <a-form-item field="config.securityLevel" label="安全级别">
                  <a-select v-model="dialog.form.config.securityLevel" placeholder="authPriv">
                    <a-option value="noAuthNoPriv">noAuthNoPriv</a-option>
                    <a-option value="authNoPriv">authNoPriv</a-option>
                    <a-option value="authPriv">authPriv</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="config.authProtocol" label="认证协议">
                  <a-select v-model="dialog.form.config.authProtocol" placeholder="SHA256">
                    <a-option value="MD5">MD5</a-option>
                    <a-option value="SHA1">SHA1</a-option>
                    <a-option value="SHA224">SHA224</a-option>
                    <a-option value="SHA256">SHA256</a-option>
                    <a-option value="SHA384">SHA384</a-option>
                    <a-option value="SHA512">SHA512</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="config.privProtocol" label="加密协议">
                  <a-select v-model="dialog.form.config.privProtocol" placeholder="AES128">
                    <a-option value="DES">DES</a-option>
                    <a-option value="AES128">AES128</a-option>
                    <a-option value="AES192">AES192</a-option>
                    <a-option value="AES256">AES256</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="[24, 16]" class="field-grid">
              <a-col :span="12">
                <a-form-item field="config.authPassword" label="认证密码">
                  <a-input-password v-model="dialog.form.config.authPassword" placeholder="AuthPass123" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="config.privPassword" label="加密密码">
                  <a-input-password v-model="dialog.form.config.privPassword" placeholder="PrivPass123" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="[24, 16]" class="field-grid">
              <a-col :span="12">
                <a-form-item field="config.contextName" label="上下文名称">
                  <a-input v-model="dialog.form.config.contextName" placeholder="可选" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="config.contextEngineID" label="上下文 Engine ID">
                  <a-input v-model="dialog.form.config.contextEngineID" placeholder="可选" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>

        <!-- EtherNet/IP Config -->
        <div v-if="dialog.form.protocol === 'ethernet-ip'" class="config-section">
          <div class="modal-section__title modal-section__title--sub">基础连接</div>
          <a-form-item field="config.ip" label="PLC IP 地址" required>
            <a-input v-model="dialog.form.config.ip" placeholder="192.168.1.10" />
          </a-form-item>
          <a-form-item field="config.port" label="PLC 端口">
            <a-input-number v-model="dialog.form.config.port" :min="1" :max="65535" placeholder="44818 (默认)" />
          </a-form-item>
          <a-form-item field="config.slot" label="槽号 (Slot)">
            <a-input-number v-model="dialog.form.config.slot" :min="0" :max="10" placeholder="0 (默认)" />
          </a-form-item>
          <a-form-item field="config.connection_type" label="连接类型">
            <a-select v-model="dialog.form.config.connection_type" placeholder="请选择连接类型">
              <a-option value="cip">标准 CIP 模式</a-option>
              <a-option value="logix">Logix 模式</a-option>
            </a-select>
          </a-form-item>

          <div class="modal-section__title modal-section__title--sub">通信参数</div>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.timeout" label="超时时间 (ms)">
                <a-input-number v-model="dialog.form.config.timeout" :min="500" :max="30000" placeholder="2000" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.max_retries" label="重试次数">
                <a-input-number v-model="dialog.form.config.max_retries" :min="0" :max="10" placeholder="3" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.retry_interval" label="重试间隔 (ms)">
                <a-input-number v-model="dialog.form.config.retry_interval" :min="10" :max="5000" placeholder="100" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="[24, 16]" class="field-grid">
            <a-col :span="8">
              <a-form-item field="config.heartbeat_interval" label="心跳间隔 (ms)">
                <a-input-number v-model="dialog.form.config.heartbeat_interval" :min="0" :max="300000" placeholder="30000" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.batch_read_max" label="批量读取上限">
                <a-input-number v-model="dialog.form.config.batch_read_max" :min="1" :max="200" placeholder="50" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="config.min_interval" label="最小间隔 (ms)">
                <a-input-number v-model="dialog.form.config.min_interval" :min="0" :max="1000" placeholder="5" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

      </a-form>
    </a-modal>

    <!-- Smart Probe Help Modal -->
    <a-modal
      v-model:visible="smartProbeHelpDialog.show"
      title="智能地址探测帮助"
      :width="1000"
      :footer="false"
      unmount-on-close
    >
      <div class="smart-probe-help">
        <div class="help-section">
          <h3>什么是智能地址探测？</h3>
          <p>智能地址探测是一种自动扫描和识别Modbus设备有效寄存器地址的功能，它能够：</p>
          <ul>
            <li>自动扫描设备的有效寄存器地址范围</li>
            <li>检测设备的MTU（最大传输单元）大小</li>
            <li>优化寄存器分组策略，提高读取效率</li>
            <li>减少手动配置错误，提高系统稳定性</li>
          </ul>
        </div>
        <div class="help-section">
          <h3>工作原理</h3>
          <div class="principle-section">
            <h4>1. 分层扫描策略</h4>
            <p>系统采用分层扫描算法，从粗到细逐步定位有效地址：</p>
            <ul>
              <li><strong>第一层：</strong>按1000地址为间隔进行快速扫描</li>
              <li><strong>第二层：</strong>对包含有效地址的区间按100地址间隔扫描</li>
              <li><strong>第三层：</strong>对包含有效地址的区间按10地址间隔扫描</li>
              <li><strong>第四层：</strong>对包含有效地址的区间进行逐地址扫描</li>
            </ul>
            <h4>2. MTU检测</h4>
            <p>系统会自动检测设备的最大传输单元大小，以确定单次可读取的最大寄存器数量，从而优化读取效率。</p>
            <h4>3. 分组优化</h4>
            <p>扫描完成后，系统会对连续的有效寄存器地址进行分组，生成最优的读取指令序列，减少通信次数。</p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a-button type="primary" @click="smartProbeHelpDialog.show = false">关闭</a-button>
      </div>
    </a-modal>

    <!-- Channel Metrics Modal -->
    <a-modal
      v-model:visible="metricsDialog.show"
      :width="800"
      modal-class="channel-metrics-modal"
      unmount-on-close
    >
      <template #title>
        <div class="channel-metrics-modal__title">
          <span class="protocol-tag" v-if="metricsDialog.channel?.protocol">
            {{ formatProtocolTag(metricsDialog.channel.protocol) }}
          </span>
          <span class="channel-metrics-modal__title-text">通道监控 · {{ metricsDialog.channel?.name || '' }}</span>
        </div>
      </template>

      <ChannelMetricsPanel
        :loading="metricsDialog.loading"
        :error="metricsDialog.error"
        :metrics="metricsDialog.metrics"
      />

      <template #footer>
        <a-button type="primary" @click="metricsDialog.show = false">关闭</a-button>
      </template>
    </a-modal>

    <ChannelProtocolHelpDrawer
      v-model:visible="channelHelpVisible"
      :initial-protocol="helpProtocol"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import request from '@/utils/request'
import { formatProtocolTag } from '@/utils/protocolLabel'
import { applyChannelDefaultConfig, getChannelDefaultConfig } from '@/utils/channelDefaultConfig'
import ChannelProtocolHelpDrawer from '@/components/channel-help/ChannelProtocolHelpDrawer.vue'
import ChannelMetricsPanel from '@/components/channel/ChannelMetricsPanel.vue'
import { computeQualityScore, runtimeFromQualityScore } from '@/utils/channelMetrics'

// 恢复使用 SVG 图标以避免导入问题

const router = useRouter()
const loading = ref(false)
const viewMode = ref('card')
const selectionMode = ref(false)
const selectedChannels = ref([])
const channels = ref([])

const dialog = reactive({
  show: false,
  isEdit: false,
  form: {
    id: '',
    name: '',
    protocol: 'modbus-tcp',
    enable: true,
    config: {},
    devices: []
  }
})

const smartProbeHelpDialog = reactive({
  show: false
})

const metricsDialog = reactive({
  show: false,
  loading: false,
  error: null,
  channel: null,
  metrics: null,
})

const channelHelpVisible = ref(false)

const helpProtocol = computed(() => dialog.form.protocol || 'modbus-tcp')

const openChannelHelp = () => {
  channelHelpVisible.value = true
}

const protocols = [
  { label: 'Modbus TCP', value: 'modbus-tcp' },
  { label: 'Modbus RTU Over TCP', value: 'modbus-rtu-over-tcp' },
  { label: 'Modbus RTU', value: 'modbus-rtu' },
  { label: 'BACnet IP', value: 'bacnet-ip' },
  { label: 'OPC UA', value: 'opc-ua' },
  { label: 'S7', value: 's7' },
  { label: 'DLT645', value: 'dlt645' },
  { label: 'EtherNet/IP', value: 'ethernet-ip' },
  { label: 'Omron FINS', value: 'omron-fins' },
  { label: 'KNXnet/IP', value: 'knxnet-ip' },
  { label: 'Profinet IO', value: 'profinet-io' },
  { label: 'Mitsubishi MC', value: 'mitsubishi-slmp' },
  { label: 'IEC 60870-5-104', value: 'iec60870-5-104' },
  { label: 'SNMP', value: 'snmp' }
]

const tableColumns = [
  { title: '通道名称', slotName: 'name', width: 200 },
  { title: '协议类型', dataIndex: 'protocol', width: 140, customRender: ({ record }) => formatProtocolTag(record?.protocol) },
  { title: '启用状态', slotName: 'enable', width: 108 },
  { title: '运行状态', slotName: 'runtime', width: 120 },
  { title: '关联设备', slotName: 'deviceCount', width: 72, align: 'center' },
  { title: '操作', slotName: 'actions', width: 220, fixed: 'right' },
]

const rowSelection = {
  selectedRowKeys: selectedChannels,
  onChange: (keys) => {
    selectedChannels.value = keys
  }
}

const isSelected = (id) => selectedChannels.value.includes(id)

const toggleSelectionMode = () => {
  selectionMode.value = !selectionMode.value
  selectedChannels.value = []
}

const toggleChannelSelection = (id) => {
  const idx = selectedChannels.value.indexOf(id)
  if (idx === -1) {
    selectedChannels.value.push(id)
  } else {
    selectedChannels.value.splice(idx, 1)
  }
}

const handleCardClick = (channel) => {
  if (selectionMode.value) {
    toggleChannelSelection(channel.id)
  } else {
    goToDevices(channel)
  }
}

const goToDevices = (channel) => {
  router.push(`/channels/${channel.id}/devices`)
}

const fillDefaultConfig = () => {
  const protocol = dialog.form.protocol
  if (!protocol) return
  dialog.form.config = applyChannelDefaultConfig(protocol, dialog.form.config)
  Message.success('已填充推荐参数（仅空字段）')
}

const openAddDialog = () => {
  dialog.isEdit = false
  dialog.form = {
    id: '',
    name: '',
    protocol: 'modbus-tcp',
    enable: true,
    config: getChannelDefaultConfig('modbus-tcp'),
    devices: []
  }
  dialog.show = true
}

const openEditDialog = (channel) => {
  dialog.isEdit = true
  dialog.form = JSON.parse(JSON.stringify(channel))
  dialog.show = true
}

const generateId = () => {
  if (dialog.isEdit) return
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  dialog.form.id = result
}

const saveChannel = async () => {
  try {
    if (!dialog.form.id || !dialog.form.name) {
      Message.error('请填写完整信息')
      return
    }

    if (dialog.form.protocol === 'opc-ua' && dialog.form.config?.url) {
      dialog.form.config.endpoint = dialog.form.config.url
    }
    
    if (dialog.isEdit) {
      await request({
        url: `/api/channels/${dialog.form.id}`,
        method: 'put',
        data: dialog.form
      })
      Message.success('通道更新成功')
    } else {
      await request({
        url: '/api/channels',
        method: 'post',
        data: dialog.form
      })
      Message.success('通道添加成功')
    }
    
    dialog.show = false
    fetchChannels()
  } catch (e) {
    Message.error('操作失败: ' + e.message)
  }
}

const deleteChannel = async (channel) => {
  if (!confirm(`确定要删除通道 "${channel.name}" 吗？`)) return
  
  try {
    await request({
      url: `/api/channels/${channel.id}`,
      method: 'delete'
    })
    Message.success('通道删除成功')
    fetchChannels()
  } catch (e) {
    Message.error('删除失败: ' + e.message)
  }
}

const openMetricsDialog = async (channel) => {
  metricsDialog.channel = channel
  metricsDialog.error = null
  metricsDialog.metrics = null
  metricsDialog.loading = true
  metricsDialog.show = true

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('加载超时')), 2000)
    )

    const metricsResPromise = request({
      url: `/api/channels/${channel.id}/metrics`,
      method: 'get'
    })

    const metricsRes = await Promise.race([metricsResPromise, timeoutPromise])
    metricsDialog.metrics = metricsRes
  } catch (error) {
    metricsDialog.error = `获取监控指标失败: ${error.message}`
    console.error('Failed to get channel metrics:', error)
  } finally {
    metricsDialog.loading = false
  }
}

const scanChannel = (channel) => {
  // 实现设备扫描功能
  console.log('Scan devices for channel:', channel)
}

const openBatchConfig = () => {
  // 实现批量配置功能
  console.log('Open batch config for channels:', selectedChannels.value)
}

const getRuntimeColor = (state) => {
  const colorMap = {
    'running': 'success',
    'error': 'danger',
    'offline': 'gray'
  }
  return colorMap[state] || 'gray'
}

const getRuntimeText = (state) => {
  const textMap = {
    'running': '运行中',
    'error': '错误',
    'offline': '离线'
  }
  return textMap[state] || '未知'
}

const fetchChannels = async () => {
  loading.value = true
  try {
    const res = await request({ url: '/api/channels', method: 'get' })
    const rawData = Array.isArray(res) ? res : (res.data || [])
    
    // 第一步：快速展示通道列表（不等待指标）
    const channelsWithoutMetrics = rawData.map((item) => {
      const count = Array.isArray(item.devices) ? item.devices.length : 0
      const enableText = item.enable ? '已启用' : '已禁用'
      const enableColor = item.enable ? 'green' : 'gray'
      
      // 初始状态：如果enabled则默认在线，否则离线
      let runtimeText = '离线'
      let runtimeArcoStatus = 'normal'
      
      if (item.enable) {
        runtimeText = '运行中'
        runtimeArcoStatus = 'success'
      }
      
      return {
        ...item,
        deviceCount: count,
        enableText,
        enableColor,
        runtimeText,
        runtimeArcoStatus,
        metrics: null // 先不加载指标
      }
    })
    
    channels.value = channelsWithoutMetrics
    loading.value = false // 立即关闭loading
    
    // 第二步：异步加载指标数据
    Promise.all(
      rawData.map(async (item) => {
        try {
          const metricsRes = await request({
            url: `/api/channels/${item.id}/metrics`,
            method: 'get'
          })
          return { channelId: item.id, metrics: metricsRes }
        } catch (metricsError) {
          console.warn(`获取通道 ${item.id} 指标失败:`, metricsError)
          return { channelId: item.id, metrics: null }
        }
      })
    ).then((metricsResults) => {
      metricsResults.forEach((result) => {
        const channelIndex = channels.value.findIndex(ch => ch.id === result.channelId)
        if (channelIndex >= 0) {
          const metrics = result.metrics
          
          if (metrics) {
            const score = computeQualityScore(metrics)
            const runtime = runtimeFromQualityScore(score, metrics)

            channels.value[channelIndex] = {
              ...channels.value[channelIndex],
              metrics,
              runtimeText: runtime.text,
              runtimeArcoStatus: runtime.status,
            }
          }
        }
      })
    }).catch((err) => {
      console.error('批量加载指标失败:', err)
    })
  } catch (e) {
    Message.error('加载通道列表失败: ' + e.message)
    loading.value = false
  }
}

watch(
  () => dialog.form.protocol,
  (protocol, prev) => {
    if (!dialog.show || dialog.isEdit || !protocol || protocol === prev) return
    // Adding a channel: switching protocol replaces config with that protocol's defaults.
    dialog.form.config = getChannelDefaultConfig(protocol)
  }
)

onMounted(() => {
  fetchChannels()
})
</script>

<style scoped>
.config-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
</style>