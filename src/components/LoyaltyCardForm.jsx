import React, { useRef, useState } from 'react'
import Modal from './Modal.jsx'
import AutocompleteInput from './AutocompleteInput.jsx'
import Icon from './Icon.jsx'
import { useShopping } from '../context/ShoppingContext.jsx'
import { SHOP_PRESETS } from '../utils/shopPresets.js'
import { compressImageToWidth } from '../utils/image.js'
import { wouldExceedLoyaltyLimit } from '../utils/loyaltyStorage.js'

const MAX_PHOTOS = 7

export default function LoyaltyCardForm({ open, card, onClose, onSubmit }) {
  const { shopsInOrder } = useShopping()

  const shopNameSuggestions = React.useMemo(() => {
    const fromApp = shopsInOrder.map((s) => s.name)
    const fromPresets = SHOP_PRESETS.map((p) => p.name)
    return Array.from(new Set([...fromApp, ...fromPresets]))
  }, [shopsInOrder])

  const [shopName, setShopName] = useState(card?.shopName || '')
  const [cardNumber, setCardNumber] = useState(card?.cardNumber || '')
  const [note, setNote] = useState(card?.note || '')
  const [barcodeImage, setBarcodeImage] = useState(card?.barcodeImage || null)
  const [images, setImages] = useState(card?.images || [])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const barcodeInputRef = useRef(null)
  const photosInputRef = useRef(null)

  // Reset the form fields whenever a different card is opened for editing,
  // or the modal is opened fresh for adding a new one.
  React.useEffect(() => {
    if (!open) return
    setShopName(card?.shopName || '')
    setCardNumber(card?.cardNumber || '')
    setNote(card?.note || '')
    setBarcodeImage(card?.barcodeImage || null)
    setImages(card?.images || [])
    setError('')
  }, [open, card])

  function currentBytes(excluding) {
    const all = [barcodeImage, ...images].filter(Boolean)
    const kept = excluding ? all.filter((s) => s !== excluding) : all
    return kept.reduce((sum, s) => sum + new Blob([s]).size, 0)
  }

  async function handleBarcodeChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    setBusy(true)
    try {
      const dataUrl = await compressImageToWidth(file, 400, 0.7)
      const previousBytes = barcodeImage ? new Blob([barcodeImage]).size : 0
      const newBytes = new Blob([dataUrl]).size
      if (wouldExceedLoyaltyLimit(newBytes - previousBytes)) {
        setError('Хранилище карт почти заполнено — штрих-код не поместится.')
        return
      }
      setBarcodeImage(dataUrl)
    } catch (err) {
      console.error(err)
      setError('Не удалось обработать изображение штрих-кода.')
    } finally {
      setBusy(false)
    }
  }

  async function handlePhotosChange(e) {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length) return
    if (images.length >= MAX_PHOTOS) {
      setError(`Можно добавить не более ${MAX_PHOTOS} фото.`)
      return
    }
    setError('')
    setBusy(true)
    try {
      const room = MAX_PHOTOS - images.length
      const toProcess = files.slice(0, room)
      const compressed = []
      for (const file of toProcess) {
        const dataUrl = await compressImageToWidth(file, 400, 0.7)
        const newBytes = new Blob([dataUrl]).size
        if (wouldExceedLoyaltyLimit(newBytes)) {
          setError('Хранилище карт почти заполнено — часть фото не были добавлены.')
          break
        }
        compressed.push(dataUrl)
      }
      if (compressed.length) setImages((prev) => [...prev, ...compressed])
    } catch (err) {
      console.error(err)
      setError('Не удалось обработать одно из фото.')
    } finally {
      setBusy(false)
    }
  }

  function removePhoto(index) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!shopName.trim()) return
    onSubmit({
      shopName: shopName.trim(),
      cardNumber: cardNumber.trim(),
      note: note.trim(),
      barcodeImage,
      images
    })
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="loyalty-form-title">
      <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto -mx-1 px-1">
        <h2 id="loyalty-form-title" className="font-display font-semibold text-lg mb-3">
          {card ? 'Изменить карту' : 'Новая бонусная карта'}
        </h2>

        <div className="space-y-3">
          <div>
            <label htmlFor="loyalty-shop-name" className="sr-only">
              Название магазина
            </label>
            <AutocompleteInput
              id="loyalty-shop-name"
              autoFocus
              value={shopName}
              onChange={setShopName}
              placeholder="Название магазина"
              source={shopNameSuggestions}
            />
          </div>

          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Номер карты (необязательно)"
            className="w-full rounded-xl border border-line dark:border-night-line bg-paper dark:bg-night-bg
                       px-4 py-3 text-base outline-none focus:border-moss dark:focus:border-mint"
          />

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Заметка (необязательно)"
            rows={2}
            className="w-full rounded-xl border border-line dark:border-night-line bg-paper dark:bg-night-bg
                       px-4 py-3 text-base outline-none focus:border-moss dark:focus:border-mint resize-none"
          />

          {/* Barcode / QR image ------------------------------------------------ */}
          <div>
            <p className="text-xs font-medium text-muted dark:text-night-muted mb-1.5">Штрих-код или QR-код</p>
            <div className="flex items-center gap-3">
              {barcodeImage ? (
                <img
                  src={barcodeImage}
                  alt=""
                  className="w-24 h-14 rounded-lg object-contain bg-paper dark:bg-night-bg border border-line dark:border-night-line"
                />
              ) : (
                <div className="w-24 h-14 rounded-lg border border-dashed border-line dark:border-night-line flex items-center justify-center text-muted dark:text-night-muted">
                  <Icon name="card" className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => barcodeInputRef.current?.click()}
                  disabled={busy}
                  className="flex-1 min-h-[44px] rounded-xl border border-line dark:border-night-line text-sm font-medium
                             hover:border-moss dark:hover:border-mint transition-colors disabled:opacity-50"
                >
                  {barcodeImage ? 'Заменить' : 'Загрузить штрих-код'}
                </button>
                {barcodeImage && (
                  <button
                    type="button"
                    onClick={() => setBarcodeImage(null)}
                    aria-label="Удалить штрих-код"
                    className="w-11 h-11 rounded-xl border border-line dark:border-night-line flex items-center justify-center
                               text-muted dark:text-night-muted hover:text-red-500 transition-colors"
                  >
                    <Icon name="trash" className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                ref={barcodeInputRef}
                type="file"
                accept="image/*"
                onChange={handleBarcodeChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Extra photos ------------------------------------------------------- */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-medium text-muted dark:text-night-muted">
                Дополнительные фото ({images.length}/{MAX_PHOTOS})
              </p>
              <button
                type="button"
                onClick={() => photosInputRef.current?.click()}
                disabled={busy || images.length >= MAX_PHOTOS}
                className="text-xs font-medium text-moss dark:text-mint disabled:opacity-40 flex items-center gap-1"
              >
                <Icon name="camera" className="w-3.5 h-3.5" />
                Добавить фото
              </button>
              <input
                ref={photosInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotosChange}
                className="hidden"
              />
            </div>
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((src, i) => (
                  <div key={i} className="relative w-14 h-14">
                    <img
                      src={src}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover border border-line dark:border-night-line"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      aria-label={`Удалить фото ${i + 1}`}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[44px] rounded-xl border border-line dark:border-night-line font-medium"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={!shopName.trim() || busy}
            className="flex-1 min-h-[44px] rounded-xl bg-moss dark:bg-mint text-paper dark:text-night-bg
                       font-medium disabled:opacity-40"
          >
            Сохранить
          </button>
        </div>
      </form>
    </Modal>
  )
}
