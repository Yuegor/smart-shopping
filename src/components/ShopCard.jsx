import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function ShopCard({ shop, activeCount, onDelete }) {
  const navigate = useNavigate()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: shop.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-tag bg-surface dark:bg-night-surface shadow-tag dark:shadow-tag-dark
                  border border-line dark:border-night-line overflow-hidden
                  ${isDragging ? 'opacity-70 scale-[1.02]' : ''}`}
    >
      {/* punched "tag hole" signature detail, top edge */}
      <div
        className="absolute -top-2 left-6 w-4 h-4 rounded-full bg-paper dark:bg-night-bg
                   border border-line dark:border-night-line"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => navigate(`/shop/${shop.id}`)}
        className="w-full text-left px-5 pt-6 pb-5 flex items-center gap-4 active:bg-moss-light/40
                   dark:active:bg-white/5 transition-colors"
      >
        <div
          className="shrink-0 w-11 h-11 rounded-full bg-moss-light dark:bg-mint/10 text-moss dark:text-mint
                     flex items-center justify-center"
          aria-hidden="true"
        >
          <Icon name={shop.icon || 'store'} className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg leading-tight truncate">{shop.name}</h3>
          <p className="text-sm text-muted dark:text-night-muted mt-0.5">
            {activeCount === 0
              ? 'Список пуст'
              : `${activeCount} ${pluralize(activeCount)}`}
          </p>
        </div>

        {activeCount > 0 && (
          <span
            className="shrink-0 min-w-[1.75rem] h-7 px-2 rounded-full bg-amber text-white
                       text-sm font-semibold flex items-center justify-center"
          >
            {activeCount}
          </span>
        )}
      </button>

      <div className="flex items-center justify-between border-t border-line dark:border-night-line px-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Перетащить, чтобы изменить порядок"
          className="p-3 min-w-[44px] min-h-[44px] text-muted dark:text-night-muted touch-none cursor-grab active:cursor-grabbing"
        >
          <Icon name="grip" className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(shop)}
          aria-label={`Удалить магазин ${shop.name}`}
          className="p-3 min-w-[44px] min-h-[44px] text-muted dark:text-night-muted hover:text-red-500 transition-colors"
        >
          <Icon name="trash" className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

function pluralize(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'товар'
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return 'товара'
  return 'товаров'
}
