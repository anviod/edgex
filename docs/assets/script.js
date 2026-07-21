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
});

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
