const CUSTOM_PRESETS_KEY = 'shoppingAppCustomPresets'

export function loadCustomPresets() {
  try {
    const raw = localStorage.getItem(CUSTOM_PRESETS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Не удалось прочитать свои магазины из localStorage:', err)
    return []
  }
}

export function saveCustomPresets(presets) {
  try {
    localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(presets))
  } catch (err) {
    console.error('Не удалось сохранить свои магазины в localStorage:', err)
  }
}
