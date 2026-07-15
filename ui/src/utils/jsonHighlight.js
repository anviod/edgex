function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Syntax-highlight JSON string for safe v-html rendering.
 */
export function highlightJson(value) {
  const json = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  const escaped = escapeHtml(json)

  return escaped.replace(
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = 'ai-json__number'
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'ai-json__key' : 'ai-json__string'
      } else if (/true|false/.test(match)) {
        cls = 'ai-json__bool'
      } else if (/null/.test(match)) {
        cls = 'ai-json__null'
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}
