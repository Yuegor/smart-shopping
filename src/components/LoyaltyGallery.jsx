import React, { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon.jsx'

export default function LoyaltyGallery({ card, onClose }) {
  const slides = useMemo(() => {
    if (!card) return []
    const list = []
    if (card.barcodeImage) list.push({ src: card.barcodeImage, label: 'Штрих-код' })
    ;(card.images || []).forEach((src, i) => list.push({ src, label: `Фото ${i + 1}` }))
    return list
  }, [card])

  const [index, setIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState(null)

  // Reset to the first slide whenever a different card is opened.
  useEffect(() => {
    setIndex(0)
  }, [card])

  if (!card) return null

  function goPrev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length)
  }
  function goNext() {
    setIndex((i) => (i + 1) % slides.length)
  }

  function handleTouchStart(e) {
    setTouchStartX(e.touches[0].clientX)
  }
  function handleTouchEnd(e) {
    if (touchStartX === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) goPrev()
      else goNext()
    }
    setTouchStartX(null)
  }

  const current = slides[index]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-ink/90 dark:bg-black/95 flex flex-col safe-top safe-bottom"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center justify-between px-4 py-3 text-paper">
          <div>
            <p className="font-display font-semibold">{card.shopName}</p>
            {current && <p className="text-sm text-paper/70">{current.label}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть галерею"
            className="w-11 h-11 flex items-center justify-center rounded-full active:bg-white/10"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 relative flex items-center justify-center px-4 overflow-hidden">
          {slides.length === 0 ? (
            <p className="text-paper/70 text-center px-8">
              Для этой карты пока нет ни штрих-кода, ни фотографий.
            </p>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="max-w-full max-h-full object-contain rounded-lg bg-white"
                />
              </AnimatePresence>

              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Предыдущее изображение"
                    className="absolute left-1 sm:left-4 w-11 h-11 rounded-full bg-black/30 text-paper
                               flex items-center justify-center active:bg-black/50"
                  >
                    <Icon name="back" className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Следующее изображение"
                    className="absolute right-1 sm:right-4 w-11 h-11 rounded-full bg-black/30 text-paper
                               flex items-center justify-center active:bg-black/50"
                  >
                    <Icon name="forward" className="w-5 h-5" />
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {slides.length > 1 && (
          <p className="text-center text-sm text-paper/70 pb-4">
            {index + 1} / {slides.length}
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
