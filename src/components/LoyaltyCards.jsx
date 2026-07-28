import React, { useState } from 'react'
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useLoyalty } from '../context/LoyaltyContext.jsx'
import LoyaltyCard from './LoyaltyCard.jsx'
import LoyaltyCardForm from './LoyaltyCardForm.jsx'
import LoyaltyGallery from './LoyaltyGallery.jsx'
import Modal from './Modal.jsx'
import Icon from './Icon.jsx'

export default function LoyaltyCards() {
  const { cards, addCard, updateCard, deleteCard, reorderCards } = useLoyalty()

  const [formOpen, setFormOpen] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [viewingCard, setViewingCard] = useState(null)
  const [cardToDelete, setCardToDelete] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const ids = cards.map((c) => c.id)
    const oldIndex = ids.indexOf(active.id)
    const newIndex = ids.indexOf(over.id)
    reorderCards(arrayMove(ids, oldIndex, newIndex))
  }

  function openAddForm() {
    setEditingCard(null)
    setFormOpen(true)
  }

  function openEditForm(card) {
    setViewingCard(null)
    setEditingCard(card)
    setFormOpen(true)
  }

  function handleFormSubmit(values) {
    if (editingCard) {
      updateCard(editingCard.id, values)
    } else {
      addCard(values)
    }
    setFormOpen(false)
    setEditingCard(null)
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted dark:text-night-muted">Бонусные карты</p>
          <h1 className="font-display font-bold text-2xl">Карты</h1>
        </div>
        <button
          type="button"
          onClick={openAddForm}
          aria-label="Добавить бонусную карту"
          className="w-11 h-11 rounded-full bg-moss dark:bg-mint text-paper dark:text-night-bg
                     flex items-center justify-center shadow-tag dark:shadow-tag-dark active:scale-95 transition-transform"
        >
          <Icon name="plus" className="w-5 h-5" />
        </button>
      </header>

      {cards.length === 0 ? (
        <EmptyState onAdd={openAddForm} />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3">
              {cards.map((card) => (
                <LoyaltyCard
                  key={card.id}
                  card={card}
                  onOpen={setViewingCard}
                  onDelete={setCardToDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <LoyaltyCardForm
        open={formOpen}
        card={editingCard}
        onClose={() => {
          setFormOpen(false)
          setEditingCard(null)
        }}
        onSubmit={handleFormSubmit}
      />

      {viewingCard && (
        <GalleryWithEdit
          card={viewingCard}
          onClose={() => setViewingCard(null)}
          onEdit={() => openEditForm(viewingCard)}
        />
      )}

      <Modal open={Boolean(cardToDelete)} onClose={() => setCardToDelete(null)} labelledBy="delete-card-title">
        {cardToDelete && (
          <div>
            <h2 id="delete-card-title" className="font-display font-semibold text-lg mb-2">
              Удалить карту «{cardToDelete.shopName}»?
            </h2>
            <p className="text-sm text-muted dark:text-night-muted mb-4">
              Карта и все её изображения будут удалены без возможности восстановления.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCardToDelete(null)}
                className="flex-1 min-h-[44px] rounded-xl border border-line dark:border-night-line font-medium"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCard(cardToDelete.id)
                  setCardToDelete(null)
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

// Wraps the fullscreen gallery with a small floating "edit" button, without
// complicating LoyaltyGallery itself with form-navigation concerns.
function GalleryWithEdit({ card, onClose, onEdit }) {
  return (
    <div className="relative">
      <LoyaltyGallery card={card} onClose={onClose} />
      <button
        type="button"
        onClick={onEdit}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 min-h-[44px] rounded-full
                   bg-surface dark:bg-night-surface text-ink dark:text-night-ink shadow-tag dark:shadow-tag-dark
                   font-medium text-sm"
      >
        Изменить карту
      </button>
    </div>
  )
}

function EmptyState({ onAdd }) {
  return (
    <div className="text-center py-16 px-6">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-moss-light dark:bg-mint/10 text-moss dark:text-mint flex items-center justify-center">
        <Icon name="card" className="w-7 h-7" />
      </div>
      <h2 className="font-display font-semibold text-lg mb-1">Пока нет ни одной карты</h2>
      <p className="text-sm text-muted dark:text-night-muted mb-5">
        Добавьте бонусную карту, чтобы держать штрих-код под рукой на кассе.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="min-h-[44px] px-5 rounded-xl bg-moss dark:bg-mint text-paper dark:text-night-bg font-medium"
      >
        Добавить карту
      </button>
    </div>
  )
}
