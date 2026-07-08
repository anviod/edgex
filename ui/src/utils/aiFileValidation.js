const FILE_RULES = {
  pcap: {
    extensions: ['.pcap', '.pcapng', '.hex'],
    maxBytes: 50 * 1024 * 1024,
    label: 'PCAP / HEX',
    skill: 'protocol-reverse'
  },
  doc: {
    extensions: ['.xlsx', '.xls', '.csv', '.pdf', '.doc', '.docx'],
    maxBytes: 20 * 1024 * 1024,
    label: 'Excel / CSV / PDF',
    skill: 'doc-parse'
  }
}

export function getFileExtension(name) {
  const idx = name.lastIndexOf('.')
  return idx >= 0 ? name.slice(idx).toLowerCase() : ''
}

export function detectFileCategory(file) {
  const ext = getFileExtension(file.name)
  for (const [key, rule] of Object.entries(FILE_RULES)) {
    if (rule.extensions.includes(ext)) return { category: key, ...rule }
  }
  return null
}

export function validateAiUploadFile(file, expectedSkill) {
  if (!file) return { ok: false, error: '未选择文件' }

  const rule = detectFileCategory(file)
  if (!rule) {
    return {
      ok: false,
      error: '不支持的文件类型。请上传 PCAP/HEX 或 Excel/CSV/PDF 文档'
    }
  }

  if (expectedSkill && rule.skill !== expectedSkill) {
    const expected = expectedSkill === 'protocol-reverse' ? 'PCAP/HEX' : '文档'
    return { ok: false, error: `此区域仅接受 ${expected} 文件` }
  }

  if (file.size > rule.maxBytes) {
    const mb = (rule.maxBytes / (1024 * 1024)).toFixed(0)
    return { ok: false, error: `文件过大，最大 ${mb} MB` }
  }

  if (file.size === 0) {
    return { ok: false, error: '文件为空' }
  }

  return { ok: true, rule }
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export { FILE_RULES }
