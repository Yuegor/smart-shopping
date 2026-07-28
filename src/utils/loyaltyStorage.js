import { generateId } from './id'

export const LOYALTY_STORAGE_KEY = 'loyaltyCards'

// A soft safety cap for the combined size of all loyalty card images.
export const LOYALTY_SOFT_LIMIT_BYTES = 2 * 1024 * 1024

const DEFAULT_SHOP_NAMES = [
  'Магнит',
  'Пятёрочка',
  'Дикси',
  'Ашан',
  'Лента',
  'О’Кей',
  'ВкусВилл',
  'Перекрёсток'
]

function createDefaultCards() {
  return DEFAULT_SHOP_NAMES.map((shopName) => ({
    id: generateId(),
    shopName,
    cardNumber: '',
    note: '',
    barcodeImage: null,
    images: []
  }))
}

export function loadLoyaltyCards() {
  try {
    const raw = localStorage.getItem(LOYALTY_STORAGE_KEY)
    if (!raw) {
      const defaults = createDefaultCards()
      saveLoyaltyCards(defaults)
      return defaults
    }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      const defaults = createDefaultCards()
      saveLoyaltyCards(defaults)
      return defaults
    }
    // Backfill fields in case of data saved by an older version of the app.
    return parsed.map((card) => ({
      note: '',
      cardNumber: '',
      barcodeImage: null,
      images: [],
      ...card
    }))
  } catch (err) {
    console.error('Не удалось прочитать бонусные карты из localStorage:', err)
    return createDefaultCards()
  }
}

export function saveLoyaltyCards(cards) {
  try {
    localStorage.setItem(LOYALTY_STORAGE_KEY, JSON.stringify(cards))
  } catch (err) {
    console.error('Не удалось сохранить бонусные карты в localStorage:', err)
  }
}

export function getLoyaltyStorageBytes() {
  try {
    const raw = localStorage.getItem(LOYALTY_STORAGE_KEY) || ''
    return new Blob([raw]).size
  } catch {
    return 0
  }
}

export function wouldExceedLoyaltyLimit(extraBytes) {
  return getLoyaltyStorageBytes() + extraBytes > LOYALTY_SOFT_LIMIT_BYTES
}
