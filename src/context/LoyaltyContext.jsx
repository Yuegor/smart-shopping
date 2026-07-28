import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { generateId } from '../utils/id'
import { loadLoyaltyCards, saveLoyaltyCards } from '../utils/loyaltyStorage'

const LoyaltyContext = createContext(null)

export function LoyaltyProvider({ children }) {
  const [cards, setCards] = useState(() => loadLoyaltyCards())

  useEffect(() => {
    saveLoyaltyCards(cards)
  }, [cards])

  const addCard = useCallback((card) => {
    const id = generateId()
    setCards((prev) => [
      ...prev,
      {
        id,
        shopName: card.shopName.trim(),
        cardNumber: card.cardNumber?.trim() || '',
        note: card.note?.trim() || '',
        barcodeImage: card.barcodeImage || null,
        images: card.images || []
      }
    ])
    return id
  }, [])

  const updateCard = useCallback((cardId, updates) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId
          ? {
              ...c,
              shopName: updates.shopName?.trim() || c.shopName,
              cardNumber: updates.cardNumber?.trim() ?? c.cardNumber,
              note: updates.note?.trim() ?? c.note,
              barcodeImage: updates.barcodeImage !== undefined ? updates.barcodeImage : c.barcodeImage,
              images: updates.images !== undefined ? updates.images : c.images
            }
          : c
      )
    )
  }, [])

  const deleteCard = useCallback((cardId) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId))
  }, [])

  const reorderCards = useCallback((newOrderIds) => {
    setCards((prev) => newOrderIds.map((id) => prev.find((c) => c.id === id)).filter(Boolean))
  }, [])

  const value = useMemo(
    () => ({ cards, addCard, updateCard, deleteCard, reorderCards }),
    [cards, addCard, updateCard, deleteCard, reorderCards]
  )

  return <LoyaltyContext.Provider value={value}>{children}</LoyaltyContext.Provider>
}

export function useLoyalty() {
  const ctx = useContext(LoyaltyContext)
  if (!ctx) throw new Error('useLoyalty должен использоваться внутри <LoyaltyProvider>')
  return ctx
}
