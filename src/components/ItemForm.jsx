import React, { useRef, useState } from 'react'
import AutocompleteInput from './AutocompleteInput.jsx'
import Icon from './Icon.jsx'
import commonProducts from '../data/commonProducts.json'
import { compressImageFile, estimateBase64KB } from '../utils/image.js'
import { wouldExceedStorageLimit } from '../utils/storage.js'

/**
 * Presentational form used inside both AddItemForm and EditItemModal.
 * Handles name (with fuzzy autocomplete), quantity, and an optional photo
 * that gets compressed client-side before it's ever handed back up.
 */
export default function ItemForm({
  initialName = '',
  initialQuantity = '',
  initialImage = null,
  submitLabel,
  onCancel,
  onSubmit
}) {
  const [name, setName] = useState(initialName)
  const [quantity, setQuantity] = useState(initialQuantity)
  const [image, setImage] = useState(initialImage)
  const [photoError, setPhotoError] = useState('')
  const [compressing, setCompressing] = useState(false)
  const fileInputRef = useRef(null)

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return

    setPhotoError('')
    setCompressing(true)
    try {
      const dataUrl = await compressImageFile(file)
      const kb = estimateBase64KB(dataUrl)
      // Compare against current storage usage minus the photo we're
      // replacing (if any), so re-editing an item's own photo isn't
      // penalized for the size it already occupies.
      const previousBytes = initialImage ? new Blob([initialImage]).size : 0
      const newBytes = new Blob([dataUrl]).size
      if (wouldExceedStorageLimit(newBytes - previousBytes)) {
        setPhotoError(
          `Хранилище почти заполнено — фото (${kb} КБ) не поместится. Удалите старые фото и попробуйте снова.`
        )
        setCompressing(false)
        return
      }
      setImage(dataUrl)
    } catch (err) {
      console.error(err)
      setPhotoError('Не удалось обработать фото. Попробуйте другое изображение.')
    } finally {
      setCompressing(false)
    }
  }

  function removePhoto() {
    setImage(null)
    setPhotoError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), quantity: quantity.trim(), image })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        <div>
          <label htmlFor="item-name" className="sr-only">
            Название товара
          </label>
          <AutocompleteInput
            id="item-name"
            autoFocus
            value={name}
            onChange={setName}
            placeholder="Название товара"
            source={commonProducts}
          />
        </div>

        <input
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Количество, например «2 шт.» (необязательно)"
          className="w-full rounded-xl border border-line dark:border-night-line bg-paper dark:bg-night-bg
                     px-4 py-3 text-base outline-none focus:border-moss dark:focus:border-mint"
        />

        <div className="flex items-center gap-3">
          {image ? (
            <img
              src={image}
              alt=""
              className="w-14 h-14 rounded-xl object-cover border border-line dark:border-night-line"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-xl border border-dashed border-line dark:border-night-line
                         flex items-center justify-center text-muted dark:text-night-muted"
              aria-hidden="true"
            >
              <Icon name="camera" className="w-5 h-5" />
            </div>
          )}

          <div className="flex-1 flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={compressing}
              className="flex-1 min-h-[44px] rounded-xl border border-line dark:border-night-line
                         text-sm font-medium flex items-center justify-center gap-1.5
                         hover:border-moss dark:hover:border-mint transition-colors disabled:opacity-50"
            >
              <Icon name="camera" className="w-4 h-4" />
              {compressing ? 'Обработка…' : image ? 'Заменить фото' : 'Добавить фото'}
            </button>
            {image && (
              <button
                type="button"
                onClick={removePhoto}
                aria-label="Удалить фото"
                className="w-11 h-11 rounded-xl border border-line dark:border-night-line
                           flex items-center justify-center text-muted dark:text-night-muted hover:text-red-500 transition-colors"
              >
                <Icon name="trash" className="w-4 h-4" />
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {photoError && <p className="text-sm text-red-500">{photoError}</p>}
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 min-h-[44px] rounded-xl border border-line dark:border-night-line font-medium"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={!name.trim() || compressing}
          className="flex-1 min-h-[44px] rounded-xl bg-moss dark:bg-mint text-paper dark:text-night-bg
                     font-medium disabled:opacity-40"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
