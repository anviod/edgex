---
layout: landing
title: EdgeX 项目文档
description: EdgeX 项目的完整文档

---

<section class="hero-section">
  <div class="shell shell--wide">
    <div class="hero-banner">
      <div class="hero-grid">
        <div class="hero-copy">
          <div class="eyebrow">Industrial Edge Documentation</div>
          <h1>EdgeX 文档</h1>
          <p>面向工业现场接入、边缘计算与北向集成的文档入口，集中提供驱动适配、部署运维、开发规划和产品使用资料。</p>
          <div class="hero-actions">
            <a class="button-link button-link--primary" href="guide/产品说明.html">产品介绍</a>
            <a class="button-link button-link--secondary" href="guide/USER_MANUAL.html">用户手册</a>
            <a class="button-link button-link--secondary" href="development_plan/index.html">开发计划</a>
          </div>
          <div class="hero-metrics">
            <div class="metric-card">
              <strong>5+</strong>
              <span>协议驱动支持</span>
            </div>
            <div class="metric-card">
              <strong>4+</strong>
              <span>核心文档分区</span>
            </div>
            <div class="metric-card">
              <strong>V0.0.1</strong>
              <span>当前版本</span>
            </div>
          </div>
        </div>
        <aside class="hero-panel">
          <p class="hero-panel__label">最近更新</p>
          <ul>
            <li><strong>2026年6月</strong>：连接管理系统全面升级</li>
            <li>公共 ConnectionManager 组件发布</li>
            <li>全驱动采集健康检测集成</li>
            <li>取消独立心跳，统一采集驱动检测</li>
            <li><strong>2026年5月</strong>：新增 S7 协议支持</li>
            <li>S7-200Smart/1200/1500/300/400 全系列</li>
          </ul>
        </aside>
      </div>
    </div>
  </div>
</section>

<section class="landing-section">
  <div class="shell shell--wide">
    <div class="section-heading">
      <div>
        <div class="section-kicker">核心文档入口</div>
        <h2>快速导航</h2>
        <p>按使用场景整理常用资料，适合从产品了解、用户使用、驱动开发和路线规划等任务。</p>
      </div>
    </div>

    <div class="cards-grid">
      <article class="feature-card">
        <span class="feature-card__tag">产品</span>
        <h3>产品介绍</h3>
        <p>了解 EdgeX 边缘网关的产品定位、核心特性、技术栈和快速开始指南。</p>
        <div class="feature-card__links">
          <a class="mini-link" href="guide/产品说明.html">产品说明</a>
          <a class="mini-link" href="guide/EDGE_COMPUTING_BEST_PRACTICES.html">最佳实践</a>
        </div>
      </article>

      <article class="feature-card">
        <span class="feature-card__tag">手册</span>
        <h3>用户手册</h3>
        <p>详细的安装指南、部署流程、使用方式和最佳实践，帮助您快速上手和运维。</p>
        <div class="feature-card__links">
          <a class="mini-link" href="guide/USER_MANUAL.html">用户手册</a>
          <a class="mini-link" href="deployment/index.html">部署指南</a>
          <a class="mini-link" href="operations/index.html">运维文档</a>
        </div>
      </article>

      <article class="feature-card">
        <span class="feature-card__tag">驱动</span>
        <h3>设备驱动</h3>
        <p>覆盖 BACnet、OPC UA、Modbus、S7、EtherNet/IP 的设计、测试、优化和故障分析。</p>
        <div class="feature-card__links">
          <a class="mini-link" href="drivers/index.html">驱动总览</a>
          <a class="mini-link" href="drivers/BACnet_设计说明.html">BACnet</a>
          <a class="mini-link" href="drivers/PLC_S7.html">S7 协议</a>
          <a class="mini-link" href="drivers/EtherNet_IP驱动真实通信实现方案.html">EtherNet/IP</a>
        </div>
      </article>

      <article class="feature-card">
        <span class="feature-card__tag">规划</span>
        <h3>开发计划</h3>
        <p>项目路线图、待开发驱动规划和架构特性演进计划，了解未来方向。</p>
        <div class="feature-card__links">
          <a class="mini-link" href="development_plan/index.html">开发计划总览</a>
          <a class="mini-link" href="development_plan/drivers/DL-T-645-2007驱动开发.html">DL/T 645-2007</a>
          <a class="mini-link" href="development_plan/drivers/采集驱动ICE104开发.html">IEC 104</a>
          <a class="mini-link" href="development_plan/sync/基于go-libp2p%20同步通信规划方案.html">多节点同步</a>
        </div>
      </article>
    </div>
  </div>
</section>

<section class="landing-section">
  <div class="shell shell--wide">
    <div class="section-heading">
      <div>
        <div class="section-kicker">产品路线图</div>
        <h2>开发计划与里程碑</h2>
        <p>EdgeX 边缘网关产品演进路线，按季度规划核心功能交付，确保工业现场接入能力持续增强。</p>
      </div>
    </div>

    <div class="roadmap-intro" style="background: rgba(230, 240, 255, 0.08); border-left: 4px solid #4fc3f7; padding: 20px 25px; border-radius: 0 8px 8px 0; margin-bottom: 35px;">
      <h4 style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px;">规划说明</h4>
      <p style="color: #b0bec5; margin: 0; font-size: 14px; line-height: 1.7;">
        本路线图基于当前产品发展战略制定，旨在扩展协议支持范围、提升系统可靠性与可扩展性。
        各阶段交付内容可能根据技术预研进展和客户需求反馈进行动态调整。
        优先级标记：<span style="color: #81c784; font-weight: 600;">高优先级</span> / 
        <span style="color: #ffb74d; font-weight: 600;">中优先级</span> / 
        <span style="color: #64b5f6; font-weight: 600;">规划中</span>。
      </p>
    </div>

    <div style="margin-bottom: 40px;">
      <div class="quarter-header" style="display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid rgba(79, 195, 247, 0.3);">
        <h3 style="color: #4fc3f7; margin: 0; font-size: 20px; font-weight: 600;">Q3 2026 交付计划</h3>
        <span style="margin-left: 15px; background: rgba(129, 199, 132, 0.15); color: #81c784; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">进行中</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background: rgba(30, 60, 90, 0.6);">
            <th style="text-align: left; padding: 12px 15px; color: #e0e0e0; font-weight: 600; border-bottom: 1px solid rgba(100, 200, 255, 0.2);">功能模块</th>
            <th style="text-align: left; padding: 12px 15px; color: #e0e0e0; font-weight: 600; border-bottom: 1px solid rgba(100, 200, 255, 0.2);">功能描述</th>
            <th style="text-align: left; padding: 12px 15px; color: #e0e0e0; font-weight: 600; border-bottom: 1px solid rgba(100, 200, 255, 0.2);">预计交付</th>
            <th style="text-align: left; padding: 12px 15px; color: #e0e0e0; font-weight: 600; border-bottom: 1px solid rgba(100, 200, 255, 0.2);">负责团队</th>
            <th style="text-align: left; padding: 12px 15px; color: #e0e0e0; font-weight: 600; border-bottom: 1px solid rgba(100, 200, 255, 0.2);">优先级</th>
            <th style="text-align: left; padding: 12px 15px; color: #e0e0e0; font-weight: 600; border-bottom: 1px solid rgba(100, 200, 255, 0.2);">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid rgba(100, 200, 255, 0.1);">
            <td style="padding: 14px 15px; color: #ffffff; font-weight: 500;">Omron FINS TCP 驱动</td>
            <td style="padding: 14px 15px; color: #b0bec5;">欧姆龙 PLC 通信协议支持，覆盖 CS/CJ/CP/NX 系列，支持 DM/EM/HR/IR 内存区域读写</td>
            <td style="padding: 14px 15px; color: #90caf9;">2026-07</td>
            <td style="padding: 14px 15px; color: #b0bec5;">驱动开发组</td>
            <td style="padding: 14px 15px;"><span style="background: rgba(129, 199, 132, 0.15); color: #81c784; padding: 3px 10px; border-radius: 4px; font-size: 12px;">高</span></td>
            <td style="padding: 14px 15px;"><span style="background: rgba(255, 183, 77, 0.15); color: #ffb74d; padding: 3px 10px; border-radius: 4px; font-size: 12px;">开发中</span></td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(100, 200, 255, 0.1);">
            <td style="padding: 14px 15px; color: #ffffff; font-weight: 500;">DL/T 645-2007 驱动</td>
            <td style="padding: 14px 15px; color: #b0bec5;">多功能电能表通信协议，支持数据读取、参数配置、事件记录采集，适配主流电表厂商</td>
            <td style="padding: 14px 15px; color: #90caf9;">2026-08</td>
            <td style="padding: 14px 15px; color: #b0bec5;">驱动开发组</td>
            <td style="padding: 14px 15px;"><span style="background: rgba(129, 199, 132, 0.15); color: #81c784; padding: 3px 10px; border-radius: 4px; font-size: 12px;">高</span></td>
            <td style="padding: 14px 15px;"><span style="background: rgba(255, 183, 77, 0.15); color: #ffb74d; padding: 3px 10px; border-radius: 4px; font-size: 12px;">开发中</span></td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(100, 200, 255, 0.1);">
            <td style="padding: 14px 15px; color: #ffffff; font-weight: 500;">多节点同步通信</td>
            <td style="padding: 14px 15px; color: #b0bec5;">基于 go-libp2p 的分布式配置同步，支持多网关集群部署，配置变更自动分发与一致性保证</td>
            <td style="padding: 14px 15px; color: #90caf9;">2026-09</td>
            <td style="padding: 14px 15px; color: #b0bec5;">平台架构组</td>
            <td style="padding: 14px 15px;"><span style="background: rgba(255, 183, 77, 0.15); color: #ffb74d; padding: 3px 10px; border-radius: 4px; font-size: 12px;">中</span></td>
            <td style="padding: 14px 15px;"><span style="background: rgba(100, 181, 246, 0.15); color: #64b5f6; padding: 3px 10px; border-radius: 4px; font-size: 12px;">预研中</span></td>
          </tr>
          <tr>
            <td style="padding: 14px 15px; color: #ffffff; font-weight: 500;">高可用接管</td>
            <td style="padding: 14px 15px; color: #b0bec5;">故障自动接管与租约机制，主备节点自动切换，采集任务无缝迁移，保障业务连续性</td>
            <td style="padding: 14px 15px; color: #90caf9;">2026-09</td>
            <td style="padding: 14px 15px; color: #b0bec5;">平台架构组</td>
            <td style="padding: 14px 15px;"><span style="background: rgba(255, 183, 77, 0.15); color: #ffb74d; padding: 3px 10px; border-radius: 4px; font-size: 12px;">中</span></td>
            <td style="padding: 14px 15px;"><span style="background: rgba(100, 181, 246, 0.15); color: #64b5f6; padding: 3px 10px; border-radius: 4px; font-size: 12px;">预研中</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-bottom: 40px;">
      <div class="quarter-header" style="display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid rgba(186, 104, 200, 0.3);">
        <h3 style="color: #ba68c8; margin: 0; font-size: 20px; font-weight: 600;">Q4 2026 交付计划</h3>
        <span style="margin-left: 15px; background: rgba(100, 181, 246, 0.15); color: #64b5f6; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">规划中</span>
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background: rgba(30, 60, 90, 0.6);">
            <th style="text-align: left; padding: 12px 15px; color: #e0e0e0; font-weight: 600; border-bottom: 1px solid rgba(100, 200, 255, 0.2);">功能模块</th>
            <th style="text-align: left; padding: 12px 15px; color: #e0e0e0; font-weight: 600; border-bottom: 1px solid rgba(100, 200, 255, 0.2);">功能描述</th>
            <th style="text-align: left; padding: 12px 15px; color: #e0e0e0; font-weight: 600; border-bottom: 1px solid rgba(100, 200, 255, 0.2);">预计交付</th>
            <th style="text-align: left; padding: 12px 15px; color: #e0e0e0; font-weight: 600; border-bottom: 1px solid rgba(100, 200, 255, 0.2);">负责团队</th>
            <th style="text-align: left; padding: 12px 15px; color: #e0e0e0; font-weight: 600; border-bottom: 1px solid rgba(100, 200, 255, 0.2);">优先级</th>
            <th style="text-align: left; padding: 12px 15px; color: #e0e0e0; font-weight: 600; border-bottom: 1px solid rgba(100, 200, 255, 0.2);">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid rgba(100, 200, 255, 0.1);">
            <td style="padding: 14px 15px; color: #ffffff; font-weight: 500;">IEC 60870-5-104 驱动</td>
            <td style="padding: 14px 15px; color: #b0bec5;">电力自动化通信协议，支持远动设备通信，数据采集与遥信遥控，适配电力调度系统</td>
            <td style="padding: 14px 15px; color: #90caf9;">2026-10</td>
            <td style="padding: 14px 15px; color: #b0bec5;">驱动开发组</td>
            <td style="padding: 14px 15px;"><span style="background: rgba(100, 181, 246, 0.15); color: #64b5f6; padding: 3px 10px; border-radius: 4px; font-size: 12px;">规划中</span></td>
            <td style="padding: 14px 15px;"><span style="background: rgba(158, 158, 158, 0.15); color: #9e9e9e; padding: 3px 10px; border-radius: 4px; font-size: 12px;">待启动</span></td>
          </tr>
          <tr>
            <td style="padding: 14px 15px; color: #ffffff; font-weight: 500;">SNMP 驱动</td>
            <td style="padding: 14px 15px; color: #b0bec5;">简单网络管理协议，支持网络设备监控、性能指标采集、故障告警，适配主流网络设备厂商</td>
            <td style="padding: 14px 15px; color: #90caf9;">2026-12</td>
            <td style="padding: 14px 15px; color: #b0bec5;">驱动开发组</td>
            <td style="padding: 14px 15px;"><span style="background: rgba(100, 181, 246, 0.15); color: #64b5f6; padding: 3px 10px; border-radius: 4px; font-size: 12px;">规划中</span></td>
            <td style="padding: 14px 15px;"><span style="background: rgba(158, 158, 158, 0.15); color: #9e9e9e; padding: 3px 10px; border-radius: 4px; font-size: 12px;">待启动</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-bottom: 30px;">
      <div class="quarter-header" style="display: flex; align-items: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid rgba(129, 199, 132, 0.3);">
        <h3 style="color: #81c784; margin: 0; font-size: 20px; font-weight: 600;">已交付里程碑</h3>
      </div>
      <div class="milestone-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 15px;">
        <div class="milestone-item" style="background: rgba(30, 60, 90, 0.5); border: 1px solid rgba(79, 195, 247, 0.2); border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; gap: 12px;">
          <div style="width: 8px; height: 8px; background: #81c784; border-radius: 50%; flex-shrink: 0;"></div>
          <div>
            <div style="color: #ffffff; font-weight: 500; font-size: 14px;">Modbus TCP/RTU</div>
            <div style="color: #78909c; font-size: 12px; margin-top: 2px;">2026-02 发布</div>
          </div>
        </div>
        <div class="milestone-item" style="background: rgba(30, 60, 90, 0.5); border: 1px solid rgba(79, 195, 247, 0.2); border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; gap: 12px;">
          <div style="width: 8px; height: 8px; background: #81c784; border-radius: 50%; flex-shrink: 0;"></div>
          <div>
            <div style="color: #ffffff; font-weight: 500; font-size: 14px;">BACnet IP</div>
            <div style="color: #78909c; font-size: 12px; margin-top: 2px;">2026-02 发布</div>
          </div>
        </div>
        <div class="milestone-item" style="background: rgba(30, 60, 90, 0.5); border: 1px solid rgba(79, 195, 247, 0.2); border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; gap: 12px;">
          <div style="width: 8px; height: 8px; background: #81c784; border-radius: 50%; flex-shrink: 0;"></div>
          <div>
            <div style="color: #ffffff; font-weight: 500; font-size: 14px;">OPC UA 客户端</div>
            <div style="color: #78909c; font-size: 12px; margin-top: 2px;">2026-03 发布</div>
          </div>
        </div>
        <div class="milestone-item" style="background: rgba(30, 60, 90, 0.5); border: 1px solid rgba(79, 195, 247, 0.2); border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; gap: 12px;">
          <div style="width: 8px; height: 8px; background: #81c784; border-radius: 50%; flex-shrink: 0;"></div>
          <div>
            <div style="color: #ffffff; font-weight: 500; font-size: 14px;">Siemens S7</div>
            <div style="color: #78909c; font-size: 12px; margin-top: 2px;">2026-05 发布</div>
          </div>
        </div>
        <div class="milestone-item" style="background: rgba(30, 60, 90, 0.5); border: 1px solid rgba(79, 195, 247, 0.2); border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; gap: 12px;">
          <div style="width: 8px; height: 8px; background: #81c784; border-radius: 50%; flex-shrink: 0;"></div>
          <div>
            <div style="color: #ffffff; font-weight: 500; font-size: 14px;">EtherNet/IP</div>
            <div style="color: #78909c; font-size: 12px; margin-top: 2px;">2026-06 发布</div>
          </div>
        </div>
        <div class="milestone-item" style="background: rgba(30, 60, 90, 0.5); border: 1px solid rgba(129, 199, 132, 0.2); border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; gap: 12px;">
          <div style="width: 8px; height: 8px; background: #81c784; border-radius: 50%; flex-shrink: 0;"></div>
          <div>
            <div style="color: #ffffff; font-weight: 500; font-size: 14px;">连接管理系统</div>
            <div style="color: #78909c; font-size: 12px; margin-top: 2px;">2026-06 发布</div>
          </div>
        </div>
        <div class="milestone-item" style="background: rgba(30, 60, 90, 0.5); border: 1px solid rgba(129, 199, 132, 0.2); border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; gap: 12px;">
          <div style="width: 8px; height: 8px; background: #81c784; border-radius: 50%; flex-shrink: 0;"></div>
          <div>
            <div style="color: #ffffff; font-weight: 500; font-size: 14px;">采集健康检测</div>
            <div style="color: #78909c; font-size: 12px; margin-top: 2px;">2026-06 发布</div>
          </div>
        </div>
        <div class="milestone-item" style="background: rgba(30, 60, 90, 0.5); border: 1px solid rgba(129, 199, 132, 0.2); border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; gap: 12px;">
          <div style="width: 8px; height: 8px; background: #81c784; border-radius: 50%; flex-shrink: 0;"></div>
          <div>
            <div style="color: #ffffff; font-weight: 500; font-size: 14px;">指数退避 + 冷却期</div>
            <div style="color: #78909c; font-size: 12px; margin-top: 2px;">2026-06 发布</div>
          </div>
        </div>
      </div>
    </div>

    <div style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(100, 200, 255, 0.15);">
      <p style="color: #78909c; font-size: 13px; margin: 0;">
        详细开发计划与技术方案请查阅
        <a href="development_plan/index.html" style="color: #4fc3f7; text-decoration: none; font-weight: 500;">开发计划总览</a>
      </p>
    </div>
  </div>
</section>

<section class="landing-section">
  <div class="shell shell--wide">
    <div class="wide-panel">
      <div class="section-kicker">快速搜索</div>
      <h2>文档索引</h2>
      <p>按关键词快速查找相关文档：</p>
      <div class="quick-links">
        <a href="guide/产品说明.html">产品介绍</a>
        <a href="guide/USER_MANUAL.html">用户手册</a>
        <a href="drivers/index.html">设备驱动</a>
        <a href="development_plan/index.html">开发计划</a>
        <a href="drivers/BACnet_设计说明.html">BACnet</a>
        <a href="drivers/PLC_S7.html">S7</a>
        <a href="drivers/MODBUS_OPTIMIZATION.html">Modbus</a>
        <a href="drivers/EtherNet_IP驱动真实通信实现方案.html">EtherNet/IP</a>
        <a href="guide/EDGE_COMPUTING_BEST_PRACTICES.html">最佳实践</a>
        <a href="deployment/INTEGRATION_GUIDE.html">集成指南</a>
      </div>
    </div>
  </div>
</section>

<section class="landing-section">
  <div class="shell shell--wide">
    <div class="section-heading">
      <div>
        <div class="section-kicker">最近更新</div>
        <h2>更新记录</h2>
      </div>
    </div>

    <div class="cards-grid cards-grid--two">
      <article class="feature-card">
        <span class="feature-card__tag">2026-06</span>
        <h3>连接管理系统升级</h3>
        <ul>
          <li>公共 ConnectionManager 组件发布</li>
          <li>全驱动采集健康检测集成</li>
          <li>取消独立心跳机制，统一采集驱动检测</li>
          <li>BACnet 半开探测逻辑优化</li>
          <li>指数退避 + 冷却期策略</li>
        </ul>
      </article>

      <article class="feature-card">
        <span class="feature-card__tag">2026-05</span>
        <h3>S7 协议支持</h3>
        <ul>
          <li>支持 S7-200Smart/1200/1500/300/400 全系列 PLC</li>
          <li>支持 DB、I/Q、M、T、C 内存区域</li>
          <li>基于 gos7 库实现真实 TCP 通信</li>
        </ul>
      </article>

      <article class="feature-card">
        <span class="feature-card__tag">2026-02</span>
        <h3>Modbus 智能优化</h3>
        <ul>
          <li>智能 MTU 探测：自动探测最大寄存器数量</li>
          <li>指数退避重连：避免网络抖动频繁重连</li>
          <li>TCP 链路深度监控</li>
        </ul>
      </article>

      <article class="feature-card">
        <span class="feature-card__tag">2026-02</span>
        <h3>点位管理增强</h3>
        <ul>
          <li>点位批量删除功能</li>
          <li>响应式实时过滤</li>
          <li>Modbus 稳定性优化</li>
        </ul>
      </article>
    </div>
  </div>
</section>
