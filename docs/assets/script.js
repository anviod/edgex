// Syntax highlighting — only explicit language-tagged code blocks; skip HTML examples and UI regions.
function shouldSkipBlock(block) {
  if (block.closest('.hero-actions, .section-index-hero, .hero-section, .hero-banner, .hero-panel, .feature-card__links, .quick-links, .doc-zone')) {
    return true;
  }

  const pre = block.closest('pre');
  if (!pre) {
    return true;
  }

  const hasLanguage = [...block.classList].some((cls) => cls.startsWith('language-'));
  const inHighlight = Boolean(pre.closest('.highlight, .highlighter-rouge'));

  if (!hasLanguage && !inHighlight) {
    return true;
  }

  const code = block.textContent;
  if (/^\s*</.test(code) || /<\/?[a-z][\s\S]*>/i.test(code)) {
    return true;
  }

  return false;
}

function highlightCode() {
  document.querySelectorAll('pre code').forEach((block) => {
    if (shouldSkipBlock(block)) {
      return;
    }

    let code = block.textContent;

    code = code.replace(/\b(const|let|var|function|if|else|for|while|return|class|import|export)\b/g, '<span class="tok-keyword">$1</span>');
    code = code.replace(/"([^"]*)"/g, '<span class="tok-string">"$1"</span>');
    code = code.replace(/'([^']*)'/g, '<span class="tok-string">\'$1\'</span>');
    code = code.replace(/\b\d+\b/g, '<span class="tok-number">$&</span>');

    block.innerHTML = code;
  });
}

function addCopyButtons() {
  document.querySelectorAll('pre').forEach((pre) => {
    const code = pre.querySelector('code');
    if (!code || shouldSkipBlock(code)) {
      return;
    }

    if (pre.querySelector('.copy-button')) {
      return;
    }

    const button = document.createElement('button');
    button.className = 'copy-button';
    button.textContent = '复制';

    button.addEventListener('click', () => {
      navigator.clipboard.writeText(code.textContent).then(() => {
        button.textContent = '已复制!';
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = '复制';
          button.classList.remove('copied');
        }, 2000);
      });
    });

    pre.appendChild(button);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initHeroVisual();
  highlightCode();
  addCopyButtons();
  initTypewriter();
  initThemeToggle();
  initArchParticles();
});

// Hero visual — cycle through five industrial-AI core effects, one minute each
// All effects share a unified fx-viewport (300×300px) to guarantee visual size consistency.
// Maximum outer radius is clamped to 130px so every scene occupies the same visual mass.
function initHeroVisual() {
  var container = document.querySelector('[data-hero-visual]');
  if (!container) return;

  var logoSvg = '<svg class="fx-logo-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path class="fx-logo-hex" d="M32 4L56 18v28L32 60 8 46V18L32 4z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>' +
    '<path class="fx-logo-inner" d="M32 14l14 8v16l-14 8-14-8V22l14-8z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" opacity="0.6"/>' +
    '<path class="fx-logo-rays" d="M32 4v10M56 18L46 22M56 46L46 42M32 60V50M8 46l10-4M8 18l10 4" stroke="currentColor" stroke-width="1" opacity="0.4"/>' +
    '<g class="fx-logo-nodes"><circle cx="32" cy="4" r="2.2" fill="currentColor"/><circle cx="56" cy="18" r="2.2" fill="currentColor"/><circle cx="56" cy="46" r="2.2" fill="currentColor"/><circle cx="32" cy="60" r="2.2" fill="currentColor"/><circle cx="8" cy="46" r="2.2" fill="currentColor"/><circle cx="8" cy="18" r="2.2" fill="currentColor"/></g>' +
    '<circle class="fx-logo-core" cx="32" cy="32" r="5.5" fill="currentColor"/>' +
    '<circle class="fx-logo-orbit" cx="32" cy="32" r="11" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 4" opacity="0.75" fill="none"/>' +
    '</svg>';
  var logo = '<div class="fx-logo">' + logoSvg + '</div>';

  function generateNodes(count, radius, size, delayOffset) {
    var html = '';
    for (var i = 0; i < count; i++) {
      var angle = (360 / count * i).toFixed(1);
      var delay = ((i * 0.12) + (delayOffset || 0)).toFixed(2);
      html += '<span class="fx-node" style="--a:' + angle + 'deg;--r:' + radius + 'px;--d:' + size + 'px;--delay:' + delay + 's"></span>';
    }
    return html;
  }

  function generateTicks(count, radius, length) {
    var html = '';
    for (var i = 0; i < count; i++) {
      var angle = (360 / count * i).toFixed(1);
      html += '<span class="fx-tick" style="--a:' + angle + 'deg;--r:' + radius + 'px;--l:' + length + 'px"></span>';
    }
    return html;
  }

  function buildScene(type) {
    var innerContent = '';

    if (type === 'core') {
      innerContent =
        '<div class="fx-core">' + logo +
          '<div class="fx-core__ring fx-core__ring--solid"></div>' +
          '<div class="fx-core__ring fx-core__ring--dashed"></div>' +
          '<div class="fx-core__ring fx-core__ring--dotted"></div>' +
          '<div class="fx-core__ring fx-core__ring--outer-ticks">' + generateTicks(36, 130, 5) + '</div>' +
          '<div class="fx-core__nodes fx-core__nodes--inner">' + generateNodes(12, 105, 5, 0) + '</div>' +
          '<div class="fx-core__nodes fx-core__nodes--outer">' + generateNodes(12, 130, 6, 0.5) + '</div>' +
          '<span class="fx-core__pulse-wave"></span>' +
        '</div>';
    } else if (type === 'lattice') {
      // Neural lattice — symmetric 6-fold radial mesh
      // 3 concentric rings of 6 nodes, all sharing the same angular offset (-90°)
      // so nodes stack perfectly along radial spokes from center.
      var latticeNodes = [];
      var ringConfigs = [
        { r: 55,  offset: -90, size: 5 },
        { r: 100, offset: -90, size: 5 },
        { r: 130, offset: -90, size: 4 },
      ];
      for (var ri = 0; ri < ringConfigs.length; ri++) {
        var rc = ringConfigs[ri];
        for (var ni = 0; ni < 6; ni++) {
          var ang = (60 * ni + rc.offset) * Math.PI / 180;
          latticeNodes.push({
            x: Math.round(rc.r * Math.cos(ang)),
            y: Math.round(rc.r * Math.sin(ang)),
            ring: ri + 1,
            size: rc.size,
            delay: (ni * 0.12 + ri * 0.25).toFixed(2)
          });
        }
      }

      // Links: [fromIdx, toIdx, isFlow]  (-1 = center/logo)
      var latticeLinks = [];
      // 18 radial flow links — 6 spokes × 3 ring transitions (perfect 6-fold symmetry)
      for (var si = 0; si < 6; si++) {
        latticeLinks.push([-1, si, 'flow']);           // center → R1[i]
        latticeLinks.push([si, si + 6, 'flow']);        // R1[i]  → R2[i]
        latticeLinks.push([si + 6, si + 12, 'flow']);   // R2[i]  → R3[i]
      }
      // 18 circumferential static links — 6 per ring × 3 rings
      for (var ri2 = 0; ri2 < 3; ri2++) {
        for (var ci = 0; ci < 6; ci++) {
          latticeLinks.push([ri2 * 6 + ci, ri2 * 6 + (ci + 1) % 6, '']);
        }
      }

      // Faint concentric guide rings for structural clarity
      var guideSvg = '<circle class="fx-lattice__guide" cx="0" cy="0" r="55"/>' +
                     '<circle class="fx-lattice__guide" cx="0" cy="0" r="100"/>' +
                     '<circle class="fx-lattice__guide" cx="0" cy="0" r="130"/>';

      var linkSvg = '';
      for (var l = 0; l < latticeLinks.length; l++) {
        var lk = latticeLinks[l];
        var n1 = lk[0] === -1 ? { x: 0, y: 0 } : latticeNodes[lk[0]];
        var n2 = lk[1] === -1 ? { x: 0, y: 0 } : latticeNodes[lk[1]];
        var flowCls = lk[2] === 'flow' ? ' fx-lattice__link--flow' : '';
        linkSvg += '<line class="fx-lattice__link' + flowCls + '" x1="' + n1.x + '" y1="' + n1.y + '" x2="' + n2.x + '" y2="' + n2.y + '"/>';
      }

      var nodeSvg = '';
      for (var n = 0; n < latticeNodes.length; n++) {
        var nd = latticeNodes[n];
        nodeSvg += '<circle class="fx-lattice__node fx-lattice__node--r' + nd.ring + '" cx="' + nd.x + '" cy="' + nd.y + '" r="' + nd.size + '" style="--delay:' + nd.delay + 's"/>';
      }

      // Data pulses on all 18 flow links (HTML spans with offset-path)
      var pulseHtml = '';
      var pulseIdx = 0;
      for (var p = 0; p < latticeLinks.length; p++) {
        if (latticeLinks[p][2] !== 'flow') continue;
        var pl = latticeLinks[p];
        var p1 = pl[0] === -1 ? { x: 0, y: 0 } : latticeNodes[pl[0]];
        var p2 = pl[1] === -1 ? { x: 0, y: 0 } : latticeNodes[pl[1]];
        var px1 = p1.x + 150, py1 = p1.y + 150;
        var px2 = p2.x + 150, py2 = p2.y + 150;
        pulseHtml += '<span class="fx-lattice__pulse" style="offset-path: path(\'M ' + px1 + ' ' + py1 + ' L ' + px2 + ' ' + py2 + '\');--delay:' + (pulseIdx * 0.18).toFixed(2) + 's"></span>';
        pulseIdx++;
      }

      innerContent =
        '<div class="fx-lattice">' + logo +
          '<svg class="fx-lattice__svg" viewBox="-150 -150 300 300">' +
            '<g class="fx-lattice__links">' + guideSvg + linkSvg + '</g>' +
            '<g class="fx-lattice__nodes">' + nodeSvg + '</g>' +
          '</svg>' +
          '<div class="fx-lattice__pulses">' + pulseHtml + '</div>' +
          '<div class="fx-lattice__scan"></div>' +
          '<div class="fx-lattice__boundary"></div>' +
        '</div>';
    } else if (type === 'radar') {
      var blips = '';
      for (var b = 0; b < 5; b++) {
        var dist = 35 + Math.random() * 85;
        var ang = Math.random() * 360;
        blips +=
          '<div class="fx-radar__blip-wrapper" style="--r:' + dist.toFixed(0) + 'px;--a:' + ang.toFixed(0) + 'deg;--delay:' + (Math.random() * 3).toFixed(2) + 's">' +
            '<span class="fx-radar__blip"></span>' +
            (b === 0 || b === 2 ? '<span class="fx-radar__target-box"></span>' : '') +
          '</div>';
      }
      innerContent =
        '<div class="fx-radar">' + logo +
          '<div class="fx-radar__rings">' +
            '<span class="fx-radar__ring r1"></span>' +
            '<span class="fx-radar__ring r2"></span>' +
            '<span class="fx-radar__ring r3"></span>' +
          '</div>' +
          '<div class="fx-radar__crosshair"></div>' +
          '<div class="fx-radar__degrees">' + generateTicks(12, 130, 4) + '</div>' +
          '<div class="fx-radar__sweep-arm"><span class="fx-radar__sweep-sector"></span></div>' +
          blips +
        '</div>';
    } else if (type === 'field') {
      var orbits = '';
      var config = [
        { rx: 110, ry: 45, tilt: 25, dur: 6 },
        { rx: 125, ry: 55, tilt: -35, dur: 8 },
        { rx: 135, ry: 65, tilt: 70, dur: 10 }
      ];
      for (var o = 0; o < config.length; o++) {
        var cfg = config[o];
        orbits +=
          '<div class="fx-field__orbit-plane" style="--tilt:' + cfg.tilt + 'deg">' +
            '<div class="fx-field__orbit" style="--rx:' + cfg.rx + 'px;--ry:' + cfg.ry + 'px;--dur:' + cfg.dur + 's">' +
              '<span class="fx-field__orbit-line"></span>' +
              '<span class="fx-field__electron" style="--delay:' + (o * -2).toFixed(1) + 's"></span>' +
            '</div>' +
          '</div>';
      }
      innerContent =
        '<div class="fx-field">' + logo +
          '<div class="fx-field__core-halo"></div>' +
          orbits +
        '</div>';
    } else if (type === 'beacon') {
      var rings = '';
      for (var k = 0; k < 4; k++) {
        rings += '<span class="fx-beacon__ring" style="--delay:' + (k * 0.75).toFixed(2) + 's"></span>';
      }
      var particles = '';
      for (var p = 0; p < 12; p++) {
        var pX = (Math.sin(p) * 18).toFixed(1);
        particles += '<span class="fx-beacon__particle" style="--x:' + pX + 'px;--delay:' + (Math.random() * 2.5).toFixed(2) + 's;--dur:' + (1.8 + Math.random() * 1.5).toFixed(1) + 's"></span>';
      }
      innerContent =
        '<div class="fx-beacon">' + logo +
          '<div class="fx-beacon__beam-group">' +
            '<span class="fx-beacon__beam-core"></span>' +
            '<span class="fx-beacon__beam-flare"></span>' +
          '</div>' +
          '<div class="fx-beacon__base-plane">' + rings + '</div>' +
          '<div class="fx-beacon__particles">' + particles + '</div>' +
        '</div>';
    }

    return '<div class="fx-scene"><div class="fx-viewport">' + innerContent + '</div></div>';
  }

  var effects = ['core', 'lattice', 'radar', 'field', 'beacon'];
  container.innerHTML = effects.map(buildScene).join('');

  var scenes = container.querySelectorAll('.fx-scene');
  if (!scenes.length) return;

  scenes[0].classList.add('fx-scene--active');

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var current = 0;
  var SCENE_DURATION = 60000;
  var sceneTimer = null;

  // 统一切换函数 / Unified scene switcher
  function switchScene(next) {
    scenes[current].classList.remove('fx-scene--active');
    current = next % scenes.length;
    scenes[current].classList.add('fx-scene--active');
  }

  function startAutoCycle() {
    if (sceneTimer) clearInterval(sceneTimer);
    sceneTimer = setInterval(function () {
      switchScene(current + 1);
    }, SCENE_DURATION);
  }

  startAutoCycle();

  // 双击手动切换下一个 / Double-click to advance to next scene
  container.addEventListener('dblclick', function () {
    switchScene(current + 1);
    startAutoCycle(); // 重置自动轮播计时器 / reset auto-cycle timer
  });
}

// Theme toggle — dark/light switch with localStorage
function initThemeToggle() {
  var storageKey = 'edgex-docs-theme';
  var root = document.documentElement;
  var button = document.querySelector('[data-theme-toggle]');
  var label = document.querySelector('[data-theme-label]');

  function syncTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (label) label.textContent = theme === 'light' ? '暗色' : '明亮';
    if (button) button.setAttribute('aria-pressed', String(theme === 'light'));
  }

  var current = root.getAttribute('data-theme') || 'dark';
  syncTheme(current);

  if (button) {
    button.addEventListener('click', function () {
      var now = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = now === 'dark' ? 'light' : 'dark';
      syncTheme(next);
      localStorage.setItem(storageKey, next);
    });
  }
}

// Typewriter effect — cycles through EdgeX key features
function initTypewriter() {
  var tw = document.querySelector('.hero-typewriter .typewriter-text');
  var cursor = document.querySelector('.hero-typewriter .typewriter-cursor');
  if (!tw) return;

  var lines = [
    '13 种工业协议统一接入',
    'ShadowCore 内存影子真源',
    'ScanEngine 10ms 级调度内核',
    '工业级 SLA · lag P95 <100ms',
    'AI 辅助设备接入与协议解析',
    '单二进制 · 零依赖 · 跨平台部署'
  ];
  var lineIndex = 0, i = 0, deleting = false;

  function tick() {
    var text = lines[lineIndex];
    if (!deleting) {
      i++;
      tw.textContent = text.slice(0, i);
      if (i >= text.length) { deleting = true; setTimeout(tick, 3000); return; }
    } else {
      i--;
      tw.textContent = text.slice(0, i);
      if (i <= 0) { deleting = false; lineIndex = (lineIndex + 1) % lines.length; setTimeout(tick, 500); return; }
    }
    setTimeout(tick, deleting ? 50 : 120);
  }
  tick();
}

// Architecture flow — industrial data-packet transmission between nodes
// Glowing circuit traces, directional arrows, pulsing node halos and discrete
// rectangular data blocks for a factory-console / Wireshark-style pipeline.
function initArchParticles() {
  var flow = document.querySelector('[data-arch-flow]');
  var canvas = document.querySelector('[data-arch-canvas]');
  if (!flow || !canvas) return;

  var ctx = canvas.getContext('2d');
  var packets = [];
  var nodePulse = [];          // per-node pulse phase [0..1]
  var PACKET_COUNT = 24;       // discrete data blocks in flight
  var PACKET_SPEED = 0.0065;   // segment fraction per frame
  var running = true;

  /* ---- helpers ---- */
  function getWaypoints() {
    var steps = flow.querySelectorAll('.arch-step');
    var fr = flow.getBoundingClientRect();
    var pts = [];
    for (var i = 0; i < steps.length; i++) {
      var r = steps[i].getBoundingClientRect();
      pts.push({
        x: r.left - fr.left + r.width / 2,
        y: r.top - fr.top + r.height / 2
      });
    }
    return pts;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* ---- canvas sizing (HiDPI) ---- */
  function resize() {
    var rect = flow.getBoundingClientRect();
    var dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  /* ---- spawn packets evenly distributed across all segments ---- */
  function spawnPackets(waypoints) {
    var pkts = [];
    var segs = waypoints.length - 1;
    if (segs <= 0) return pkts;
    var perSeg = Math.floor(PACKET_COUNT / segs);
    var extra = PACKET_COUNT - perSeg * segs;
    for (var s = 0; s < segs; s++) {
      var n = perSeg + (s < extra ? 1 : 0);
      for (var j = 0; j < n; j++) {
        pkts.push({
          seg: s,
          t: (j + 0.5) / n,
          size: 2.2 + Math.random() * 1.8,
          alpha: 0.65 + Math.random() * 0.35
        });
      }
    }
    return pkts;
  }

  /* ---- init ---- */
  var waypoints = getWaypoints();
  packets = spawnPackets(waypoints);
  nodePulse = waypoints.map(function () { return Math.random(); });

  /* ---- draw frame ---- */
  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    waypoints = getWaypoints();
    if (waypoints.length < 2) { requestAnimationFrame(draw); return; }
    if (nodePulse.length !== waypoints.length) {
      nodePulse = waypoints.map(function () { return Math.random(); });
    }

    // ── Layer 1: glowing circuit traces with arrows ──
    for (var si = 0; si < waypoints.length - 1; si++) {
      var a = waypoints[si];
      var b = waypoints[si + 1];
      var dx = b.x - a.x;
      var dy = b.y - a.y;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var ux = dx / len;
      var uy = dy / len;

      // Base dim trace
      ctx.strokeStyle = 'rgba(200,167,91,0.10)';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      // Inner bright core line
      ctx.strokeStyle = 'rgba(200,167,91,0.22)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      // Direction arrow at mid-point
      var midT = 0.5;
      var mx = lerp(a.x, b.x, midT);
      var my = lerp(a.y, b.y, midT);
      var as = 4;
      ctx.fillStyle = 'rgba(200,167,91,0.35)';
      ctx.beginPath();
      ctx.moveTo(mx + ux * as, my + uy * as);
      ctx.lineTo(mx - ux * as + uy * as * 0.8, my - uy * as - ux * as * 0.8);
      ctx.lineTo(mx - ux * as - uy * as * 0.8, my - uy * as + ux * as * 0.8);
      ctx.closePath();
      ctx.fill();
    }

    // ── Layer 2: pulsing node halos ──
    for (var wi = 0; wi < waypoints.length; wi++) {
      var wp = waypoints[wi];
      nodePulse[wi] += 0.012;
      if (nodePulse[wi] > 1) nodePulse[wi] = 0;
      var phase = nodePulse[wi];
      var pr = 8 + phase * 14;
      var pa = 0.28 * (1 - phase);

      var halo = ctx.createRadialGradient(wp.x, wp.y, 0, wp.x, wp.y, pr);
      halo.addColorStop(0, 'rgba(200,167,91,' + (pa * 0.5).toFixed(3) + ')');
      halo.addColorStop(0.6, 'rgba(200,167,91,' + (pa * 0.2).toFixed(3) + ')');
      halo.addColorStop(1, 'rgba(200,167,91,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, pr, 0, Math.PI * 2);
      ctx.fill();

      // Node core
      ctx.fillStyle = 'rgba(200,167,91,0.55)';
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Layer 3: animated data packets ──
    for (var i = 0; i < packets.length; i++) {
      var p = packets[i];

      p.t += PACKET_SPEED;
      if (p.t >= 1) {
        // Arrival radial flash at the receiving node
        var bNode = waypoints[p.seg + 1];
        var flashR = 16;
        var flash = ctx.createRadialGradient(bNode.x, bNode.y, 0, bNode.x, bNode.y, flashR);
        flash.addColorStop(0, 'rgba(232,213,163,0.45)');
        flash.addColorStop(0.4, 'rgba(200,167,91,0.18)');
        flash.addColorStop(1, 'rgba(200,167,91,0)');
        ctx.fillStyle = flash;
        ctx.beginPath();
        ctx.arc(bNode.x, bNode.y, flashR, 0, Math.PI * 2);
        ctx.fill();

        p.seg = (p.seg + 1) % (waypoints.length - 1);
        p.t = 0;
      }

      var a = waypoints[p.seg];
      var b = waypoints[p.seg + 1];
      var cx = lerp(a.x, b.x, p.t);
      var cy = lerp(a.y, b.y, p.t);

      var bw = p.size * 3.0;
      var bh = p.size * 1.35;
      var rx = cx - bw / 2;
      var ry = cy - bh / 2;
      var rr = 1.5;

      // Outer envelope glow
      var envGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, p.size * 3);
      envGlow.addColorStop(0, 'rgba(232,213,163,' + (p.alpha * 0.5).toFixed(2) + ')');
      envGlow.addColorStop(0.5, 'rgba(200,167,91,' + (p.alpha * 0.18).toFixed(2) + ')');
      envGlow.addColorStop(1, 'rgba(200,167,91,0)');
      ctx.fillStyle = envGlow;
      ctx.fillRect(cx - p.size * 3, cy - p.size * 3, p.size * 6, p.size * 6);

      // Data block body (rounded rect)
      ctx.fillStyle = 'rgba(200,167,91,' + (p.alpha * 0.92).toFixed(2) + ')';
      ctx.beginPath();
      ctx.moveTo(rx + rr, ry);
      ctx.lineTo(rx + bw - rr, ry);
      ctx.arcTo(rx + bw, ry, rx + bw, ry + rr, rr);
      ctx.lineTo(rx + bw, ry + bh - rr);
      ctx.arcTo(rx + bw, ry + bh, rx + bw - rr, ry + bh, rr);
      ctx.lineTo(rx + rr, ry + bh);
      ctx.arcTo(rx, ry + bh, rx, ry + bh - rr, rr);
      ctx.lineTo(rx, ry + rr);
      ctx.arcTo(rx, ry, rx + rr, ry, rr);
      ctx.closePath();
      ctx.fill();

      // Bright core stripe
      ctx.fillStyle = 'rgba(255,242,210,' + (p.alpha * 0.98).toFixed(2) + ')';
      ctx.fillRect(rx + 1.5, cy - 0.6, bw - 3, 1.2);

      // Discrete trailing echoes
      var echoCount = 3;
      var echoSpacing = 0.05;
      for (var e = 1; e <= echoCount; e++) {
        var et = Math.max(0, p.t - echoSpacing * e);
        if (et <= 0) continue;
        var ex = lerp(a.x, b.x, et);
        var ey = lerp(a.y, b.y, et);
        var ea = p.alpha * (1 - e / (echoCount + 1)) * 0.32;
        var es = p.size * (1 - e * 0.2);
        ctx.fillStyle = 'rgba(200,167,91,' + ea.toFixed(2) + ')';
        ctx.fillRect(ex - es * 1.15, ey - es * 0.45, es * 2.3, es * 0.9);
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();

  /* ---- resize debounce ---- */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      waypoints = getWaypoints();
      packets = spawnPackets(waypoints);
      nodePulse = waypoints.map(function () { return Math.random(); });
    }, 200);
  });

  /* ---- theme change → respawn all packets ---- */
  var observer = new MutationObserver(function () {
    resize();
    waypoints = getWaypoints();
    packets = spawnPackets(waypoints);
    nodePulse = waypoints.map(function () { return Math.random(); });
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
