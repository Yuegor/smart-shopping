import React from 'react'
import Modal from './Modal.jsx'
import ItemForm from './ItemForm.jsx'

// Thin wrapper: modal chrome + the shared form fields, in "edit" mode,
// prefilled from the item being edited.
export default function EditItemModal({ item, onClose, onSubmit }) {
  return (
    <Modal open={Boolean(item)} onClose={onClose} labelledBy="edit-item-title">
      <h2 id="edit-item-title" className="font-display font-semibold text-lg mb-3">
        Изменить товар
      </h2>
      {item && (
        <ItemForm
          key={item.id}
          initialName={item.name}
          initialQuantity={item.quantity}
          initialImage={item.image || null}
          submitLabel="Сохранить"
          onCancel={onClose}
          onSubmit={(values) => {
            onSubmit(values)
          }}
        />
      )}
    </Modal>
  )
}
