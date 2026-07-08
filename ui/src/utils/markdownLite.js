import DOMPurify from 'dompurify'

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Lightweight markdown: **bold**, `code`, - lists, ### headings, line breaks.
 */
export function formatMarkdownLite(text) {
  if (!text) return ''
  let html = escapeHtml(text)

  html = html.replace(/^### (.+)$/gm, '<strong class="ai-md-h3">$1</strong>')
  html = html.replace(/^## (.+)$/gm, '<strong class="ai-md-h2">$1</strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/`([^`\n]+)`/g, '<code class="ai-md-code">$1</code>')
  html = html.replace(/^- (.+)$/gm, '<li class="ai-md-li">$1</li>')
  html = html.replace(/(<li class="ai-md-li">[\s\S]*?<\/li>\n?)+/g, (block) => `<ul class="ai-md-ul">${block}</ul>`)
  html = html.replace(/\n/g, '<br>')

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'code', 'ul', 'li', 'br'],
    ALLOWED_ATTR: ['class']
  })
}
