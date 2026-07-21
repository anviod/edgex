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
  highlightCode();
  addCopyButtons();
  initTypewriter();
  initThemeToggle();
  initArchParticles();
});

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

// Architecture flow particle animation
function initArchParticles() {
  var flow = document.querySelector('[data-arch-flow]');
  var canvas = document.querySelector('[data-arch-canvas]');
  if (!flow || !canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var PARTICLE_COUNT = 28;
  var running = true;

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

  function createParticle() {
    var w = canvas.style.width ? parseFloat(canvas.style.width) : flow.offsetWidth;
    var h = canvas.style.height ? parseFloat(canvas.style.height) : flow.offsetHeight;
    return {
      x: -20 - Math.random() * 60,
      y: 8 + Math.random() * (h - 16),
      vx: 0.6 + Math.random() * 1.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.3 + Math.random() * 0.6,
      trail: [],
      maxTrail: 8 + Math.floor(Math.random() * 12)
    };
  }

  for (var j = 0; j < PARTICLE_COUNT; j++) {
    var p = createParticle();
    var w0 = canvas.style.width ? parseFloat(canvas.style.width) : flow.offsetWidth;
    p.x = Math.random() * w0;
    particles.push(p);
  }

  function draw() {
    if (!running) return;
    var w = canvas.style.width ? parseFloat(canvas.style.width) : flow.offsetWidth;
    var h = canvas.style.height ? parseFloat(canvas.style.height) : flow.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    // Subtle radial glow spots behind each arch-step
    var steps = flow.querySelectorAll('.arch-step');
    for (var si = 0; si < steps.length; si++) {
      var sr = steps[si].getBoundingClientRect();
      var fr = flow.getBoundingClientRect();
      var sx = sr.left - fr.left + sr.width / 2;
      var sy = sr.top - fr.top + sr.height / 2;
      var glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr.width * 0.7);
      glow.addColorStop(0, 'rgba(200,167,91,0.08)');
      glow.addColorStop(1, 'rgba(200,167,91,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(sx - sr.width * 0.7, sy - sr.width * 0.7, sr.width * 1.4, sr.width * 1.4);
    }

    // Draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Record trail
      p.trail.push({ x: p.x, y: p.y, a: p.alpha });
      if (p.trail.length > p.maxTrail) p.trail.shift();

      // Wrap around
      if (p.x > w + 30) {
        p.x = -30 - Math.random() * 40;
        p.y = 8 + Math.random() * (h - 16);
        p.trail = [];
      }
      if (p.y < 4 || p.y > h - 4) p.vy *= -1;

      // Draw trail
      if (p.trail.length > 1) {
        for (var t = 0; t < p.trail.length - 1; t++) {
          var ratio = t / p.trail.length;
          var ta = ratio * p.alpha * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.trail[t].x, p.trail[t].y);
          ctx.lineTo(p.trail[t + 1].x, p.trail[t + 1].y);
          ctx.strokeStyle = 'rgba(200,167,91,' + ta.toFixed(3) + ')';
          ctx.lineWidth = p.size * ratio * 1.5;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      // Draw head
      var headGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      headGlow.addColorStop(0, 'rgba(232,213,163,' + p.alpha.toFixed(2) + ')');
      headGlow.addColorStop(0.4, 'rgba(200,167,91,' + (p.alpha * 0.6).toFixed(2) + ')');
      headGlow.addColorStop(1, 'rgba(200,167,91,0)');
      ctx.fillStyle = headGlow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  draw();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  // Observe theme changes to restart
  var observer = new MutationObserver(function () {
    resize();
    // Re-randomize particle positions
    var w2 = canvas.style.width ? parseFloat(canvas.style.width) : flow.offsetWidth;
    for (var k = 0; k < particles.length; k++) {
      particles[k].x = Math.random() * w2;
      particles[k].trail = [];
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
