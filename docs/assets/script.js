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

// Hero visual — randomly choose one of five AI core effects per refresh
function initHeroVisual() {
  var container = document.querySelector('[data-hero-visual]');
  if (!container) return;

  var effects = ['pulsar', 'orbital', 'neural', 'dataflow', 'prism'];
  var effect = effects[Math.floor(Math.random() * effects.length)];
  container.setAttribute('data-effect', effect);

  var logoSvg = '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 4L6 14v20l18 10 18-10V14L24 4z" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="24" cy="24" r="6" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="24" cy="24" r="2" fill="currentColor"/><line x1="24" y1="6" x2="24" y2="16" stroke="currentColor" stroke-width="1.2" opacity="0.6"/><line x1="24" y1="32" x2="24" y2="42" stroke="currentColor" stroke-width="1.2" opacity="0.6"/><line x1="8" y1="15" x2="15" y2="19" stroke="currentColor" stroke-width="1.2" opacity="0.6"/><line x1="33" y1="29" x2="40" y2="33" stroke="currentColor" stroke-width="1.2" opacity="0.6"/><line x1="8" y1="33" x2="15" y2="29" stroke="currentColor" stroke-width="1.2" opacity="0.6"/><line x1="33" y1="19" x2="40" y2="15" stroke="currentColor" stroke-width="1.2" opacity="0.6"/></svg>';
  var logo = '<div class="fx-logo">' + logoSvg + '</div>';

  var html = '';
  if (effect === 'pulsar') {
    html =
      '<div class="ai-core">' +
        '<div class="ai-core-ring ai-core-ring--outer"></div>' +
        '<div class="ai-core-ring ai-core-ring--mid"></div>' +
        '<div class="ai-core-ring ai-core-ring--inner"></div>' +
        '<div class="ai-core-center">' + logoSvg + '</div>' +
      '</div>' +
      '<div class="ai-orbit ai-orbit--1"><span class="ai-dot"></span></div>' +
      '<div class="ai-orbit ai-orbit--2"><span class="ai-dot"></span></div>' +
      '<div class="ai-orbit ai-orbit--3"><span class="ai-dot"></span></div>' +
      '<div class="ai-particles">' +
        '<span class="ai-particle ai-particle--1"></span>' +
        '<span class="ai-particle ai-particle--2"></span>' +
        '<span class="ai-particle ai-particle--3"></span>' +
        '<span class="ai-particle ai-particle--4"></span>' +
        '<span class="ai-particle ai-particle--5"></span>' +
        '<span class="ai-particle ai-particle--6"></span>' +
      '</div>';
  } else if (effect === 'orbital') {
    var sats1 = [0, 120, 240].map(function(a) { return '<span style="--angle:' + a + 'deg"></span>'; }).join('');
    var sats2 = [45, 135, 225, 315].map(function(a) { return '<span style="--angle:' + a + 'deg"></span>'; }).join('');
    var sats3 = [0, 72, 144, 216, 288].map(function(a) { return '<span style="--angle:' + a + 'deg"></span>'; }).join('');
    html =
      '<div class="fx-orbital">' + logo +
        '<div class="fx-orbital__ring fx-orbital__ring--1">' + sats1 + '</div>' +
        '<div class="fx-orbital__ring fx-orbital__ring--2">' + sats2 + '</div>' +
        '<div class="fx-orbital__ring fx-orbital__ring--3">' + sats3 + '</div>' +
      '</div>';
  } else if (effect === 'neural') {
    var radii = [80, 135, 190];
    var counts = [4, 5, 6];
    var links = '';
    var nodes = '';
    var idx = 0;
    for (var r = 0; r < radii.length; r++) {
      for (var i = 0; i < counts[r]; i++) {
        var angle = (360 / counts[r]) * i + (r * 30);
        var len = radii[r];
        var d = r === 0 ? 8 : (r === 1 ? 7 : 6);
        var delay = (idx * 0.2).toFixed(2) + 's';
        var common = '--angle:' + angle + 'deg;--len:' + len + 'px;--delay:' + delay;
        links += '<span class="fx-neural__link" style="' + common + '"></span>';
        nodes += '<span class="fx-neural__node" style="' + common + ';--d:' + d + 'px"></span>';
        idx++;
      }
    }
    html =
      '<div class="fx-neural">' + logo +
        '<div class="fx-neural__links">' + links + '</div>' +
        '<div class="fx-neural__nodes">' + nodes + '</div>' +
      '</div>';
  } else if (effect === 'dataflow') {
    var angles = [0, 60, 120, 180, 240, 300];
    var packets = '';
    for (var p = 0; p < angles.length; p++) {
      var dur = (2.5 + Math.random() * 1.5).toFixed(2) + 's';
      var del = (Math.random() * -2).toFixed(2) + 's';
      var rad = 110 + (p % 2) * 35;
      packets += '<span class="fx-dataflow__packet" style="--angle:' + angles[p] + 'deg;--radius:' + rad + 'px;--duration:' + dur + ';--delay:' + del + '"></span>';
    }
    html =
      '<div class="fx-dataflow">' + logo +
        '<div class="fx-dataflow__ring fx-dataflow__ring--1"></div>' +
        '<div class="fx-dataflow__ring fx-dataflow__ring--2"></div>' +
        '<div class="fx-dataflow__packets">' + packets + '</div>' +
      '</div>';
  } else if (effect === 'prism') {
    var rays = [0, 60, 120, 180, 240, 300].map(function(a, i) {
      return '<span class="fx-prism__ray" style="--angle:' + a + 'deg;--delay:' + (i * 0.25).toFixed(2) + 's"></span>';
    }).join('');
    html =
      '<div class="fx-prism">' + logo +
        '<div class="fx-prism__hex fx-prism__hex--outer"></div>' +
        '<div class="fx-prism__hex fx-prism__hex--mid"></div>' +
        '<div class="fx-prism__hex fx-prism__hex--inner"></div>' +
        '<div class="fx-prism__rays">' + rays + '</div>' +
      '</div>';
  }

  container.innerHTML = html;
}

// Theme toggle — dark/light switch with localStorage
function initThemeToggle() {
  var storageKey = 'edgex-docs-theme';
  var root = document.documentElement;
  var button = document.querySelector('[data-theme-toggle]');
  var icon = document.querySelector('[data-theme-icon]');

  function syncTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (icon) icon.textContent = theme === 'light' ? '☀️' : '🌙';
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
// Discrete rectangular data blocks hop from node to node along the pipeline,
// with dashed circuit traces and node anchor points for a factory-floor feel.
function initArchParticles() {
  var flow = document.querySelector('[data-arch-flow]');
  var canvas = document.querySelector('[data-arch-canvas]');
  if (!flow || !canvas) return;

  var ctx = canvas.getContext('2d');
  var packets = [];
  var PACKET_COUNT = 20;      // discrete data blocks in flight
  var PACKET_SPEED = 0.005;   // segment fraction per frame (≈ 0.30/s at 60fps)
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
          t: (j + 0.5) / n,          // stagger evenly within segment
          size: 2.5 + Math.random() * 2,
          alpha: 0.55 + Math.random() * 0.45
        });
      }
    }
    return pkts;
  }

  /* ---- init ---- */
  var waypoints = getWaypoints();
  packets = spawnPackets(waypoints);

  /* ---- draw frame ---- */
  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    waypoints = getWaypoints();
    if (waypoints.length < 2) { requestAnimationFrame(draw); return; }

    // ── Layer 1: dashed circuit traces between nodes ──
    ctx.strokeStyle = 'rgba(200,167,91,0.10)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 8]);
    ctx.lineCap = 'round';
    for (var si = 0; si < waypoints.length - 1; si++) {
      ctx.beginPath();
      ctx.moveTo(waypoints[si].x, waypoints[si].y);
      ctx.lineTo(waypoints[si + 1].x, waypoints[si + 1].y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // ── Layer 2: node anchor points ──
    for (var wi = 0; wi < waypoints.length; wi++) {
      var wp = waypoints[wi];
      // Outer ring
      ctx.strokeStyle = 'rgba(200,167,91,0.22)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, 6, 0, Math.PI * 2);
      ctx.stroke();
      // Inner dot
      ctx.fillStyle = 'rgba(200,167,91,0.35)';
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Layer 3: animated data packets ──
    for (var i = 0; i < packets.length; i++) {
      var p = packets[i];

      p.t += PACKET_SPEED;
      if (p.t >= 1) {
        // Arrival flash at the receiving node
        var bNode = waypoints[p.seg + 1];
        var arrivalGlow = ctx.createRadialGradient(bNode.x, bNode.y, 0, bNode.x, bNode.y, 8);
        arrivalGlow.addColorStop(0, 'rgba(232,213,163,0.50)');
        arrivalGlow.addColorStop(1, 'rgba(200,167,91,0)');
        ctx.fillStyle = arrivalGlow;
        ctx.fillRect(bNode.x - 8, bNode.y - 8, 16, 16);

        p.seg = (p.seg + 1) % (waypoints.length - 1);
        p.t = 0;
      }

      var a = waypoints[p.seg];
      var b = waypoints[p.seg + 1];
      var cx = lerp(a.x, b.x, p.t);
      var cy = lerp(a.y, b.y, p.t);

      var bw = p.size * 2.8;   // block width
      var bh = p.size * 1.3;   // block height

      // ── Outer envelope glow ──
      var envGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, p.size * 2.5);
      envGlow.addColorStop(0, 'rgba(232,213,163,' + (p.alpha * 0.55).toFixed(2) + ')');
      envGlow.addColorStop(0.6, 'rgba(200,167,91,' + (p.alpha * 0.2).toFixed(2) + ')');
      envGlow.addColorStop(1, 'rgba(200,167,91,0)');
      ctx.fillStyle = envGlow;
      ctx.fillRect(cx - p.size * 2.5, cy - p.size * 2.5, p.size * 5, p.size * 5);

      // ── Data block body (rounded rect) ──
      var rx = cx - bw / 2;
      var ry = cy - bh / 2;
      var rr = 2; // corner radius
      ctx.fillStyle = 'rgba(200,167,91,' + (p.alpha * 0.85).toFixed(2) + ')';
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

      // ── Bright core stripe inside the block ──
      ctx.fillStyle = 'rgba(255,240,210,' + (p.alpha * 0.95).toFixed(2) + ')';
      ctx.fillRect(rx + 2, cy - 0.8, bw - 4, 1.6);

      // ── Discrete trailing echoes (not a comet tail) ──
      var echoCount = 3;
      var echoSpacing = 0.06;
      for (var e = 1; e <= echoCount; e++) {
        var et = Math.max(0, p.t - echoSpacing * e);
        if (et <= 0) continue;
        var ex = lerp(a.x, b.x, et);
        var ey = lerp(a.y, b.y, et);
        var ea = p.alpha * (1 - e / (echoCount + 1)) * 0.35;
        var es = p.size * (1 - e * 0.22);
        ctx.fillStyle = 'rgba(200,167,91,' + ea.toFixed(2) + ')';
        ctx.fillRect(ex - es * 1.2, ey - es * 0.5, es * 2.4, es * 1);
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
    }, 200);
  });

  /* ---- theme change → respawn all packets ---- */
  var observer = new MutationObserver(function () {
    resize();
    waypoints = getWaypoints();
    packets = spawnPackets(waypoints);
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
