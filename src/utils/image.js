// Compresses picked image files down to small base64 JPEGs so they're safe
// to store inline in localStorage, entirely client-side via <canvas>.

const ITEM_MAX_DIMENSION = 200
const ITEM_JPEG_QUALITY = 0.6

const LOYALTY_TARGET_WIDTH = 400
const LOYALTY_JPEG_QUALITY = 0.7

function loadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Выбранный файл не является изображением'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Не удалось прочитать файл'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Не удалось загрузить изображение'))
      img.onload = () => resolve(img)
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

function toJpegDataUrl(img, width, height, quality) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  // White background first: JPEG has no transparency, so a PNG with alpha
  // would otherwise turn black in the corners.
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', quality)
}

function fitWithin(width, height, max) {
  if (width <= max && height <= max) return { width, height }
  const ratio = Math.min(max / width, max / height)
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) }
}

// Used for shopping-list item photos: fit within a 200x200 box, quality 0.6
// (roughly 5-15 KB per photo, vs. potentially megabytes for an original).
export async function compressImageFile(file) {
  const img = await loadImage(file)
  const { width, height } = fitWithin(img.width, img.height, ITEM_MAX_DIMENSION)
  return toJpegDataUrl(img, width, height, ITEM_JPEG_QUALITY)
}

// Used for loyalty-card barcodes/photos: fit to a 400px-wide box (height
// scales proportionally, since barcodes are often short and wide), quality 0.7.
export async function compressImageToWidth(file, targetWidth = LOYALTY_TARGET_WIDTH, quality = LOYALTY_JPEG_QUALITY) {
  const img = await loadImage(file)
  const scale = Math.min(1, targetWidth / img.width)
  const width = Math.max(1, Math.round(img.width * scale))
  const height = Math.max(1, Math.round(img.height * scale))
  return toJpegDataUrl(img, width, height, quality)
}

// Rough size estimate in KB for a base64 string, used for soft
// localStorage-limit warnings (base64 is ~4/3 the size of the raw bytes).
export function estimateBase64KB(base64) {
  if (!base64) return 0
  const base = base64.split(',')[1] || base64
  return Math.round((base.length * 0.75) / 1024)
}
