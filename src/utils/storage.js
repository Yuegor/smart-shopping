import { generateId } from './id'

export const STORAGE_KEY = 'shoppingAppData'
export const THEME_KEY = 'shoppingAppTheme'

// A soft safety cap, comfortably under the ~5MB most browsers allow per
// origin for localStorage. Used only to warn before a photo pushes us over it.
export const STORAGE_SOFT_LIMIT_BYTES = 4 * 1024 * 1024

// Builds the demo data shown the very first time the app runs, so the
// interface never looks empty/broken on first load.
function createDemoData() {
  const shopId = generateId()
  return {
    shops: [
      {
        id: shopId,
        name: 'Пример: Супермаркет',
        icon: 'store',
        items: [
          { id: generateId(), name: 'Молоко', quantity: '1 л', purchased: false, image: null },
          { id: generateId(), name: 'Хлеб', quantity: '1 шт.', purchased: false, image: null },
          { id: generateId(), name: 'Яйца', quantity: '10 шт.', purchased: true, image: null }
        ]
      }
    ],
    shopOrder: [shopId]
  }
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const demo = createDemoData()
      saveData(demo)
      return demo
    }
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.shops)) {
      const demo = createDemoData()
      saveData(demo)
      return demo
    }
    // Guard against a shopOrder that's out of sync with the shops array
    // (e.g. data edited by hand, or a shop added before order existed).
    const knownIds = parsed.shops.map((s) => s.id)
    const order = Array.isArray(parsed.shopOrder)
      ? parsed.shopOrder.filter((id) => knownIds.includes(id))
      : []
    knownIds.forEach((id) => {
      if (!order.includes(id)) order.push(id)
    })
    // Backfill fields for data saved by older versions of the app, so
    // existing lists don't break when opened after an update.
    const shops = parsed.shops.map((s) => ({
      ...s,
      icon: s.icon || 'store',
      items: (s.items || []).map((i) => ({ image: null, ...i }))
    }))
    return { shops, shopOrder: order }
  } catch (err) {
    console.error('Не удалось прочитать данные из localStorage:', err)
    return createDemoData()
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Не удалось сохранить данные в localStorage:', err)
  }
}

// Actual bytes currently used by the app's own localStorage entry.
export function getCurrentStorageBytes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || ''
    return new Blob([raw]).size
  } catch {
    return 0
  }
}

// True if adding `extraBytes` more data would push storage past the soft
// limit — used to reject/warn about a photo before it's actually saved.
export function wouldExceedStorageLimit(extraBytes) {
  return getCurrentStorageBytes() + extraBytes > STORAGE_SOFT_LIMIT_BYTES
}

export function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    /* ignore */
  }
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    /* ignore */
  }
}
