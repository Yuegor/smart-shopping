const KEYS = ['shoppingAppData', 'shoppingAppTheme', 'shoppingAppCustomPresets', 'loyaltyCards']

// Bundles every localStorage key this app uses into one JSON object and
// triggers a download as a plain .txt file (valid JSON inside).
export function exportAppData() {
  const payload = {}
  for (const key of KEYS) {
    const raw = localStorage.getItem(key)
    if (raw === null) continue
    try {
      payload[key] = JSON.parse(raw)
    } catch {
      payload[key] = raw
    }
  }

  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `shopping-list-backup-${date}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Parses previously-exported text and, if it looks valid, writes it back
// into localStorage under the matching keys. Throws on invalid JSON so the
// caller can show an error instead of silently corrupting existing data.
export function importAppData(text) {
  const parsed = JSON.parse(text)
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Файл не содержит распознаваемых данных приложения')
  }
  for (const key of KEYS) {
    if (key in parsed) {
      localStorage.setItem(key, JSON.stringify(parsed[key]))
    }
  }
}
