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
    <div class="wide-panel" style="background: rgba(10, 25, 40, 0.65); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(100, 200, 255, 0.15); border-radius: 16px; padding: 35px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);">
      <div class="section-kicker" style="color: #4fc3f7; font-weight: 600; letter-spacing: 0.5px;">TODO 任务清单</div>
      <h2 style="color: #ffffff; margin-bottom: 15px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">开发计划与路线图</h2>
      <p style="color: #c5d4e8; margin-bottom: 25px; font-weight: 400;">展示正在规划和开发中的功能，预计发布时间仅供参考。</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
        <div>
          <h3 style="color: #4fc3f7; margin-bottom: 15px; font-size: 18px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🚀 Q3 2026 计划</h3>
          <ul style="color: #d0dbe8; font-size: 14px; line-height: 1.8; list-style-type: none; padding-left: 0;">
            <li style="padding-left: 24px; position: relative; margin-bottom: 8px;">
              <span style="position: absolute; left: 0; color: #81c784;">●</span>
              <strong style="color: #ffffff;">Omron FINS TCP 驱动</strong>
              <br /><span style="color: #90a4ae; font-size: 13px;">欧姆龙 PLC 通信协议支持</span>
            </li>
            <li style="padding-left: 24px; position: relative; margin-bottom: 8px;">
              <span style="position: absolute; left: 0; color: #81c784;">●</span>
              <strong style="color: #ffffff;">DL/T 645-2007 驱动</strong>
              <br /><span style="color: #90a4ae; font-size: 13px;">多功能电能表通信协议</span>
            </li>
            <li style="padding-left: 24px; position: relative; margin-bottom: 8px;">
              <span style="position: absolute; left: 0; color: #ffb74d;">●</span>
              <strong style="color: #ffffff;">多节点同步通信</strong>
              <br /><span style="color: #90a4ae; font-size: 13px;">基于 go-libp2p 的分布式配置同步</span>
            </li>
            <li style="padding-left: 24px; position: relative; margin-bottom: 8px;">
              <span style="position: absolute; left: 0; color: #ffb74d;">●</span>
              <strong style="color: #ffffff;">高可用接管</strong>
              <br /><span style="color: #90a4ae; font-size: 13px;">故障自动接管与租约机制</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 style="color: #ba68c8; margin-bottom: 15px; font-size: 18px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">📅 Q4 2026 计划</h3>
          <ul style="color: #d0dbe8; font-size: 14px; line-height: 1.8; list-style-type: none; padding-left: 0;">
            <li style="padding-left: 24px; position: relative; margin-bottom: 8px;">
              <span style="position: absolute; left: 0; color: #64b5f6;">○</span>
              <strong style="color: #ffffff;">IEC 60870-5-104 驱动</strong>
              <br /><span style="color: #90a4ae; font-size: 13px;">电力自动化通信协议</span>
            </li>
            <li style="padding-left: 24px; position: relative; margin-bottom: 8px;">
              <span style="position: absolute; left: 0; color: #64b5f6;">○</span>
              <strong style="color: #ffffff;">SNMP 驱动</strong>
              <br /><span style="color: #90a4ae; font-size: 13px;">简单网络管理协议</span>
            </li>
          </ul>
        </div>
      </div>

      <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(100, 200, 255, 0.15);">
        <h3 style="color: #4fc3f7; margin-bottom: 15px; font-size: 18px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">✅ 已完成</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          <span style="background: rgba(30, 60, 90, 0.7); color: #90caf9; padding: 6px 14px; border-radius: 8px; font-size: 13px; border: 1px solid rgba(79, 195, 247, 0.3);">Modbus TCP/RTU</span>
          <span style="background: rgba(30, 60, 90, 0.7); color: #90caf9; padding: 6px 14px; border-radius: 8px; font-size: 13px; border: 1px solid rgba(79, 195, 247, 0.3);">BACnet IP</span>
          <span style="background: rgba(30, 60, 90, 0.7); color: #90caf9; padding: 6px 14px; border-radius: 8px; font-size: 13px; border: 1px solid rgba(79, 195, 247, 0.3);">OPC UA 客户端</span>
          <span style="background: rgba(30, 60, 90, 0.7); color: #90caf9; padding: 6px 14px; border-radius: 8px; font-size: 13px; border: 1px solid rgba(79, 195, 247, 0.3);">Siemens S7</span>
          <span style="background: rgba(30, 60, 90, 0.7); color: #90caf9; padding: 6px 14px; border-radius: 8px; font-size: 13px; border: 1px solid rgba(79, 195, 247, 0.3);">EtherNet/IP</span>
          <span style="background: rgba(30, 60, 90, 0.7); color: #a5d6a7; padding: 6px 14px; border-radius: 8px; font-size: 13px; border: 1px solid rgba(129, 199, 132, 0.3);">连接管理系统</span>
          <span style="background: rgba(30, 60, 90, 0.7); color: #a5d6a7; padding: 6px 14px; border-radius: 8px; font-size: 13px; border: 1px solid rgba(129, 199, 132, 0.3);">采集健康检测</span>
          <span style="background: rgba(30, 60, 90, 0.7); color: #a5d6a7; padding: 6px 14px; border-radius: 8px; font-size: 13px; border: 1px solid rgba(129, 199, 132, 0.3);">指数退避 + 冷却期</span>
        </div>
      </div>

      <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(100, 200, 255, 0.15);">
        <p style="color: #c5d4e8; font-size: 13px; text-align: center;">
          查看完整开发计划：<a href="development_plan/index.html" style="color: #90caf9; text-decoration: none; border-bottom: 1px solid rgba(144, 202, 249, 0.5); transition: all 0.3s;">开发计划总览</a>
        </p>
      </div>
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
