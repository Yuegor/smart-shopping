import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon.jsx'

/**
 * Renders an active list plus a collapsible "purchased" section, with a
 * delete button per row (44x44px tap target) and a tap-to-edit row body.
 * Deliberately generic: used both on a single shop's screen and on the
 * combined "all items" screen (which additionally shows a shop badge).
 */
export default function ItemList({
  items,
  purchasedItems,
  onToggle,
  onDelete,
  onEdit,
  showShopBadge = false
}) {
  const [showPurchased, setShowPurchased] = useState(false)

  return (
    <div>
      {items.length === 0 && purchasedItems.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <Row
                key={item.id}
                item={item}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                showShopBadge={showShopBadge}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}

      {purchasedItems.length > 0 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowPurchased((v) => !v)}
            className="w-full min-h-[44px] flex items-center justify-between px-1 text-sm font-medium
                       text-muted dark:text-night-muted"
          >
            <span>Показать купленные ({purchasedItems.length})</span>
            <Icon
              name="chevron-down"
              className={`w-4 h-4 transition-transform ${showPurchased ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence initial={false}>
            {showPurchased && (
              <motion.ul
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-2 mt-2"
              >
                {purchasedItems.map((item) => (
                  <Row
                    key={item.id}
                    item={item}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    showShopBadge={showShopBadge}
                    purchasedRow
                  />
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function Row({ item, onToggle, onDelete, onEdit, showShopBadge, purchasedRow = false }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
      className={`flex items-center gap-3 rounded-tag border border-line dark:border-night-line
                  bg-surface dark:bg-night-surface px-3 py-3 shadow-tag dark:shadow-tag-dark
                  ${purchasedRow ? 'opacity-70' : ''}`}
    >
      <button
        type="button"
        onClick={() => onToggle(item)}
        aria-pressed={item.purchased}
        aria-label={item.purchased ? `Вернуть «${item.name}» в список` : `Отметить «${item.name}» купленным`}
        className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
                    ${
                      item.purchased
                        ? 'bg-moss dark:bg-mint border-moss dark:border-mint text-paper dark:text-night-bg'
                        : 'border-line dark:border-night-line text-transparent'
                    }`}
      >
        {item.purchased && <Icon name="check" className="w-4 h-4 animate-stamp" strokeWidth={3} />}
      </button>

      {item.image && (
        <img
          src={item.image}
          alt=""
          className="shrink-0 w-10 h-10 rounded-full object-cover border border-line dark:border-night-line"
        />
      )}

      <button
        type="button"
        onClick={() => onEdit?.(item)}
        aria-label={`Изменить «${item.name}»`}
        className="flex-1 min-w-0 text-left rounded-lg -my-1 py-1 active:bg-moss-light/30 dark:active:bg-white/5 transition-colors"
      >
        <p
          className={`font-medium leading-tight truncate ${
            item.purchased ? 'line-through text-muted dark:text-night-muted' : ''
          }`}
        >
          {item.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {item.quantity && (
            <span className="text-sm text-muted dark:text-night-muted truncate">{item.quantity}</span>
          )}
          {showShopBadge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-moss-light dark:bg-mint/10 text-moss dark:text-mint truncate">
              {item.shopName}
            </span>
          )}
        </div>
      </button>

      <button
        type="button"
        onClick={() => onDelete(item)}
        aria-label={`Удалить «${item.name}»`}
        className="shrink-0 w-11 h-11 -mr-2 flex items-center justify-center text-muted dark:text-night-muted hover:text-red-500 transition-colors"
      >
        <Icon name="trash" className="w-5 h-5" />
      </button>
    </motion.li>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-14 px-4">
      <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-moss-light dark:bg-mint/10 text-moss dark:text-mint flex items-center justify-center">
        <Icon name="basket" className="w-6 h-6" />
      </div>
      <p className="font-medium">Список пуст</p>
      <p className="text-sm text-muted dark:text-night-muted mt-1">Добавьте первый товар кнопкой ниже.</p>
    </div>
  )
}
