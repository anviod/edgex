/** Detect macOS desktop (Safari / Chrome / Firefox on Mac). */
export function isMac() {
  if (typeof navigator === 'undefined') return false
  if (navigator.userAgentData?.platform === 'macOS') return true
  const platform = navigator.platform || ''
  if (/Mac/i.test(platform)) return true
  const ua = navigator.userAgent || ''
  return /Mac OS X|Macintosh/i.test(ua)
}
