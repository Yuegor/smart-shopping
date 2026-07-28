import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Icon from './Icon.jsx'

export default function LoyaltyCard({ card, onOpen, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const preview = card.barcodeImage || card.images?.[0] || null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-tag bg-surface dark:bg-night-surface border border-line dark:border-night-line
                  shadow-tag dark:shadow-tag-dark overflow-hidden flex flex-col
                  ${isDragging ? 'opacity-70 scale-[1.02]' : ''}`}
    >
      <button
        type="button"
        onClick={() => onOpen(card)}
        className="flex-1 flex flex-col items-center text-center px-3 pt-4 pb-3 active:bg-moss-light/30 dark:active:bg-white/5 transition-colors"
      >
        <div className="w-full max-w-[120px] h-16 rounded-lg bg-paper dark:bg-night-bg border border-line dark:border-night-line flex items-center justify-center overflow-hidden mb-3">
          {preview ? (
            <img src={preview} alt="" className="max-w-full max-h-full object-contain" />
          ) : (
            <Icon name="card" className="w-6 h-6 text-muted dark:text-night-muted" />
          )}
        </div>
        <p className="font-display font-semibold leading-tight truncate w-full">{card.shopName}</p>
        {card.cardNumber && (
          <p className="text-xs text-muted dark:text-night-muted mt-0.5 truncate w-full font-mono">
            {card.cardNumber}
          </p>
        )}
      </button>

      <div className="flex items-center justify-between border-t border-line dark:border-night-line px-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Перетащить, чтобы изменить порядок"
          className="p-2.5 min-w-[40px] min-h-[40px] text-muted dark:text-night-muted touch-none cursor-grab active:cursor-grabbing"
        >
          <Icon name="grip" className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(card)}
          aria-label={`Удалить карту ${card.shopName}`}
          className="p-2.5 min-w-[40px] min-h-[40px] text-muted dark:text-night-muted hover:text-red-500 transition-colors"
        >
          <Icon name="trash" className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
