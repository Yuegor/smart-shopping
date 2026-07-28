import React, { useState } from 'react'
import { useShopping } from '../context/ShoppingContext.jsx'
import ItemList from './ItemList.jsx'
import EditItemModal from './EditItemModal.jsx'

export default function AllItems() {
  const { allItems, toggleItemPurchased, deleteItem, editItem } = useShopping()
  const [editingItem, setEditingItem] = useState(null)

  const activeItems = allItems.filter((i) => !i.purchased)
  const purchasedItems = allItems.filter((i) => i.purchased)

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <header className="mb-6">
        <p className="text-sm text-muted dark:text-night-muted">Все магазины сразу</p>
        <h1 className="font-display font-bold text-2xl">Все покупки</h1>
      </header>

      <ItemList
        items={activeItems}
        purchasedItems={purchasedItems}
        onToggle={(item) => toggleItemPurchased(item.shopId, item.id)}
        onDelete={(item) => deleteItem(item.shopId, item.id)}
        onEdit={(item) => setEditingItem(item)}
        showShopBadge
      />

      <EditItemModal
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={(values) => {
          editItem(editingItem.shopId, editingItem.id, values)
          setEditingItem(null)
        }}
      />
    </div>
  )
}
