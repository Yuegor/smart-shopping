import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { generateId } from '../utils/id'
import { loadData, saveData, loadTheme, saveTheme } from '../utils/storage'

const ShoppingContext = createContext(null)

export function ShoppingProvider({ children }) {
  const [data, setData] = useState(() => loadData())
  const [theme, setTheme] = useState(() => loadTheme())

  // Every change to `data` is the single place writes to localStorage
  // happen, so no action creator below needs to remember to persist.
  useEffect(() => {
    saveData(data)
  }, [data])

  useEffect(() => {
    saveTheme(theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const addShop = useCallback((name, icon = 'store') => {
    const trimmed = name.trim()
    if (!trimmed) return
    const id = generateId()
    setData((prev) => ({
      shops: [...prev.shops, { id, name: trimmed, icon, items: [] }],
      shopOrder: [...prev.shopOrder, id]
    }))
  }, [])

  const deleteShop = useCallback((shopId) => {
    setData((prev) => ({
      shops: prev.shops.filter((s) => s.id !== shopId),
      shopOrder: prev.shopOrder.filter((id) => id !== shopId)
    }))
  }, [])

  const renameShop = useCallback((shopId, name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setData((prev) => ({
      ...prev,
      shops: prev.shops.map((s) => (s.id === shopId ? { ...s, name: trimmed } : s))
    }))
  }, [])

  const reorderShops = useCallback((newOrder) => {
    setData((prev) => ({ ...prev, shopOrder: newOrder }))
  }, [])

  const addItem = useCallback((shopId, name, quantity, image = null) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const item = {
      id: generateId(),
      name: trimmed,
      quantity: quantity?.trim() || '',
      purchased: false,
      image: image || null
    }
    setData((prev) => ({
      ...prev,
      shops: prev.shops.map((s) => (s.id === shopId ? { ...s, items: [...s.items, item] } : s))
    }))
  }, [])

  const editItem = useCallback((shopId, itemId, updates) => {
    const trimmed = (updates.name || '').trim()
    if (!trimmed) return
    setData((prev) => ({
      ...prev,
      shops: prev.shops.map((s) =>
        s.id === shopId
          ? {
              ...s,
              items: s.items.map((i) =>
                i.id === itemId
                  ? {
                      ...i,
                      name: trimmed,
                      quantity: (updates.quantity || '').trim(),
                      image: updates.image ?? null
                    }
                  : i
              )
            }
          : s
      )
    }))
  }, [])

  const deleteItem = useCallback((shopId, itemId) => {
    setData((prev) => ({
      ...prev,
      shops: prev.shops.map((s) =>
        s.id === shopId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s
      )
    }))
  }, [])

  const toggleItemPurchased = useCallback((shopId, itemId) => {
    setData((prev) => ({
      ...prev,
      shops: prev.shops.map((s) =>
        s.id === shopId
          ? {
              ...s,
              items: s.items.map((i) => (i.id === itemId ? { ...i, purchased: !i.purchased } : i))
            }
          : s
      )
    }))
  }, [])

  // Derived, memoized views used across screens -------------------------

  const shopsInOrder = useMemo(
    () => data.shopOrder.map((id) => data.shops.find((s) => s.id === id)).filter(Boolean),
    [data]
  )

  const allItems = useMemo(
    () =>
      shopsInOrder.flatMap((shop) =>
        shop.items.map((item) => ({ ...item, shopId: shop.id, shopName: shop.name }))
      ),
    [shopsInOrder]
  )

  const value = useMemo(
    () => ({
      shops: data.shops,
      shopOrder: data.shopOrder,
      shopsInOrder,
      allItems,
      theme,
      toggleTheme,
      addShop,
      deleteShop,
      renameShop,
      reorderShops,
      addItem,
      editItem,
      deleteItem,
      toggleItemPurchased
    }),
    [
      data,
      shopsInOrder,
      allItems,
      theme,
      toggleTheme,
      addShop,
      deleteShop,
      renameShop,
      reorderShops,
      addItem,
      editItem,
      deleteItem,
      toggleItemPurchased
    ]
  )

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>
}

export function useShopping() {
  const ctx = useContext(ShoppingContext)
  if (!ctx) throw new Error('useShopping должен использоваться внутри <ShoppingProvider>')
  return ctx
}
