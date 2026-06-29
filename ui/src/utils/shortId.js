/** Generate a random 16-char lowercase alphanumeric ID (matches channel ID style). */
export function generateShortId(length = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
