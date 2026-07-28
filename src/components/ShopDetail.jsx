import React, { useState } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useShopping } from '../context/ShoppingContext.jsx'
import ItemList from './ItemList.jsx'
import AddItemForm from './AddItemForm.jsx'
import EditItemModal from './EditItemModal.jsx'
import Icon from './Icon.jsx'

export default function ShopDetail() {
  const { shopId } = useParams()
  const navigate = useNavigate()
  const { shops, addItem, editItem, deleteItem, toggleItemPurchased } = useShopping()
  const [addOpen, setAddOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const shop = shops.find((s) => s.id === shopId)
  if (!shop) return <Navigate to="/" replace />

  const activeItems = shop.items.filter((i) => !i.purchased)
  const purchasedItems = shop.items.filter((i) => i.purchased)

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <header className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Назад к магазинам"
          className="w-11 h-11 -ml-2 flex items-center justify-center rounded-full active:bg-line/60 dark:active:bg-white/5"
        >
          <Icon name="back" className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <p className="text-sm text-muted dark:text-night-muted">
            {activeItems.length === 0 ? 'Список пуст' : `${activeItems.length} активных товаров`}
          </p>
          <h1 className="font-display font-bold text-2xl truncate">{shop.name}</h1>
        </div>
      </header>

      <ItemList
        items={activeItems}
        purchasedItems={purchasedItems}
        onToggle={(item) => toggleItemPurchased(shop.id, item.id)}
        onDelete={(item) => deleteItem(shop.id, item.id)}
        onEdit={(item) => setEditingItem(item)}
      />

      <button
        type="button"
        onClick={() => setAddOpen(true)}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-moss dark:bg-mint text-paper dark:text-night-bg
                   shadow-tag dark:shadow-tag-dark flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Добавить товар"
      >
        <Icon name="plus" className="w-6 h-6" />
      </button>

      <AddItemForm
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={({ name, quantity, image }) => {
          addItem(shop.id, name, quantity, image)
          setAddOpen(false)
        }}
      />

      <EditItemModal
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSubmit={(values) => {
          editItem(shop.id, editingItem.id, values)
          setEditingItem(null)
        }}
      />
    </div>
  )
}
