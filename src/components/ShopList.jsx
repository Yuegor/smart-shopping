import React, { useState } from 'react'
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useShopping } from '../context/ShoppingContext.jsx'
import ShopCard from './ShopCard.jsx'
import Modal from './Modal.jsx'
import Icon from './Icon.jsx'
import { SHOP_PRESETS, DEFAULT_SHOP_ICON, ICON_CHOICES } from '../utils/shopPresets.js'
import { loadCustomPresets, saveCustomPresets } from '../utils/customPresets.js'

export default function ShopList() {
  const { shopsInOrder, shopOrder, addShop, deleteShop, reorderShops } = useShopping()
  const [addOpen, setAddOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState(DEFAULT_SHOP_ICON)
  const [shopToDelete, setShopToDelete] = useState(null)

  // Presets the person has created themselves, persisted separately from
  // the built-in chain list so they show up as quick-add chips next time.
  const [customPresets, setCustomPresets] = useState(() => loadCustomPresets())
  const [creatingPreset, setCreatingPreset] = useState(false)
  const [draftName, setDraftName] = useState('')
  const [draftIcon, setDraftIcon] = useState(DEFAULT_SHOP_ICON)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = shopOrder.indexOf(active.id)
    const newIndex = shopOrder.indexOf(over.id)
    reorderShops(arrayMove(shopOrder, oldIndex, newIndex))
  }

  function submitNewShop(e) {
    e.preventDefault()
    addShop(newName, newIcon)
    setNewName('')
    setNewIcon(DEFAULT_SHOP_ICON)
    setAddOpen(false)
  }

  function closeAddModal() {
    setAddOpen(false)
    setNewName('')
    setNewIcon(DEFAULT_SHOP_ICON)
    setCreatingPreset(false)
    setDraftName('')
    setDraftIcon(DEFAULT_SHOP_ICON)
  }

  function pickPreset(preset) {
    setNewName(preset.name)
    setNewIcon(preset.icon)
  }

  function openCreatePreset() {
    setCreatingPreset(true)
    setDraftName('')
    setDraftIcon(DEFAULT_SHOP_ICON)
  }

  function cancelCreatePreset() {
    setCreatingPreset(false)
  }

  function saveNewPreset() {
    const trimmed = draftName.trim()
    if (!trimmed) return
    const preset = { name: trimmed, icon: draftIcon }
    const updated = [...customPresets.filter((p) => p.name !== trimmed), preset]
    setCustomPresets(updated)
    saveCustomPresets(updated)
    // Immediately use the freshly created preset for the shop being added.
    setNewName(preset.name)
    setNewIcon(preset.icon)
    setCreatingPreset(false)
  }

  function removeCustomPreset(name) {
    const updated = customPresets.filter((p) => p.name !== name)
    setCustomPresets(updated)
    saveCustomPresets(updated)
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted dark:text-night-muted">Умный список</p>
          <h1 className="font-display font-bold text-2xl">Магазины</h1>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          aria-label="Добавить магазин"
          className="w-11 h-11 rounded-full bg-moss dark:bg-mint text-paper dark:text-night-bg
                     flex items-center justify-center shadow-tag dark:shadow-tag-dark active:scale-95 transition-transform"
        >
          <Icon name="plus" className="w-5 h-5" />
        </button>
      </header>

      {shopsInOrder.length === 0 ? (
        <EmptyState onAdd={() => setAddOpen(true)} />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={shopOrder} strategy={verticalListSortingStrategy}>
            <ul className="space-y-3">
              {shopsInOrder.map((shop) => (
                <li key={shop.id}>
                  <ShopCard
                    shop={shop}
                    activeCount={shop.items.filter((i) => !i.purchased).length}
                    onDelete={setShopToDelete}
                  />
                </li>
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <Modal open={addOpen} onClose={closeAddModal} labelledBy="add-shop-title">
        <form onSubmit={submitNewShop}>
          <h2 id="add-shop-title" className="font-display font-semibold text-lg mb-3">
            Новый магазин
          </h2>

          <p className="text-xs font-medium text-muted dark:text-night-muted mb-2">
            Выберите из популярных, добавьте своё или введите название вручную
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {SHOP_PRESETS.map((preset) => {
              const active = newName === preset.name
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => pickPreset(preset)}
                  className={`flex items-center gap-1.5 pl-2.5 pr-3 py-2 rounded-full border text-sm font-medium transition-colors
                              ${
                                active
                                  ? 'bg-moss dark:bg-mint text-paper dark:text-night-bg border-moss dark:border-mint'
                                  : 'border-line dark:border-night-line text-ink dark:text-night-ink active:bg-moss-light/40 dark:active:bg-white/5'
                              }`}
                >
                  <Icon name={preset.icon} className="w-4 h-4" />
                  {preset.name}
                </button>
              )
            })}

            {customPresets.map((preset) => {
              const active = newName === preset.name
              return (
                <span
                  key={preset.name}
                  className={`flex items-center gap-1.5 pl-2.5 pr-1.5 py-2 rounded-full border text-sm font-medium transition-colors
                              ${
                                active
                                  ? 'bg-moss dark:bg-mint text-paper dark:text-night-bg border-moss dark:border-mint'
                                  : 'border-line dark:border-night-line text-ink dark:text-night-ink'
                              }`}
                >
                  <button
                    type="button"
                    onClick={() => pickPreset(preset)}
                    className="flex items-center gap-1.5"
                  >
                    <Icon name={preset.icon} className="w-4 h-4" />
                    {preset.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeCustomPreset(preset.name)}
                    aria-label={`Убрать «${preset.name}» из своих магазинов`}
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0
                                ${active ? 'text-paper/80 dark:text-night-bg/80' : 'text-muted dark:text-night-muted'}`}
                  >
                    <span className="text-base leading-none">×</span>
                  </button>
                </span>
              )
            })}

            <button
              type="button"
              onClick={openCreatePreset}
              aria-label="Добавить свой магазин в быстрый список"
              className="flex items-center gap-1.5 pl-2.5 pr-3 py-2 rounded-full border border-dashed
                         border-line dark:border-night-line text-muted dark:text-night-muted text-sm font-medium
                         active:bg-moss-light/40 dark:active:bg-white/5"
            >
              <Icon name="plus" className="w-4 h-4" />
              Свой
            </button>
          </div>

          {creatingPreset && (
            <div className="rounded-xl border border-line dark:border-night-line p-3 mb-3 space-y-3">
              <input
                autoFocus
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Название своего магазина"
                className="w-full rounded-xl border border-line dark:border-night-line bg-paper dark:bg-night-bg
                           px-4 py-3 text-base outline-none focus:border-moss dark:focus:border-mint"
              />
              <div className="flex items-center gap-2">
                {ICON_CHOICES.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setDraftIcon(iconName)}
                    aria-label={`Иконка: ${iconName}`}
                    aria-pressed={draftIcon === iconName}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors
                                ${
                                  draftIcon === iconName
                                    ? 'bg-moss dark:bg-mint text-paper dark:text-night-bg border-moss dark:border-mint'
                                    : 'border-line dark:border-night-line text-muted dark:text-night-muted'
                                }`}
                  >
                    <Icon name={iconName} className="w-4 h-4" />
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={cancelCreatePreset}
                  className="flex-1 min-h-[40px] rounded-xl border border-line dark:border-night-line font-medium text-sm"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={saveNewPreset}
                  disabled={!draftName.trim()}
                  className="flex-1 min-h-[40px] rounded-xl bg-moss dark:bg-mint text-paper dark:text-night-bg
                             font-medium text-sm disabled:opacity-40"
                >
                  Сохранить
                </button>
              </div>
            </div>
          )}

          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value)
              setNewIcon(DEFAULT_SHOP_ICON)
            }}
            placeholder="Например, «Продукты у дома»"
            className="w-full rounded-xl border border-line dark:border-night-line bg-paper dark:bg-night-bg
                       px-4 py-3 text-base outline-none focus:border-moss dark:focus:border-mint"
          />
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={closeAddModal}
              className="flex-1 min-h-[44px] rounded-xl border border-line dark:border-night-line font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!newName.trim()}
              className="flex-1 min-h-[44px] rounded-xl bg-moss dark:bg-mint text-paper dark:text-night-bg
                         font-medium disabled:opacity-40"
            >
              Добавить
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(shopToDelete)}
        onClose={() => setShopToDelete(null)}
        labelledBy="delete-shop-title"
      >
        {shopToDelete && (
          <div>
            <h2 id="delete-shop-title" className="font-display font-semibold text-lg mb-2">
              Удалить «{shopToDelete.name}»?
            </h2>
            <p className="text-sm text-muted dark:text-night-muted mb-4">
              Все товары этого магазина будут удалены без возможности восстановления.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShopToDelete(null)}
                className="flex-1 min-h-[44px] rounded-xl border border-line dark:border-night-line font-medium"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteShop(shopToDelete.id)
                  setShopToDelete(null)
                }}
                className="flex-1 min-h-[44px] rounded-xl bg-red-500 text-white font-medium"
              >
                Удалить
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div className="text-center py-16 px-6">
      <div
        className="mx-auto mb-4 w-16 h-16 rounded-full bg-moss-light dark:bg-mint/10 text-moss dark:text-mint
                   flex items-center justify-center"
      >
        <Icon name="store" className="w-7 h-7" />
      </div>
      <h2 className="font-display font-semibold text-lg mb-1">Пока нет ни одного магазина</h2>
      <p className="text-sm text-muted dark:text-night-muted mb-5">
        Добавьте первый магазин, чтобы начать составлять список покупок.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="min-h-[44px] px-5 rounded-xl bg-moss dark:bg-mint text-paper dark:text-night-bg font-medium"
      >
        Добавить магазин
      </button>
    </div>
  )
}
