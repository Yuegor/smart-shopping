import React from 'react'
import Modal from './Modal.jsx'
import ItemForm from './ItemForm.jsx'

// Thin wrapper: modal chrome + the shared form fields, in "add" mode.
export default function AddItemForm({ open, onClose, onSubmit }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="add-item-title">
      <h2 id="add-item-title" className="font-display font-semibold text-lg mb-3">
        Новый товар
      </h2>
      {/* Remounting on open resets the form's internal state each time it's opened. */}
      {open && (
        <ItemForm
          key="add"
          submitLabel="Добавить"
          onCancel={onClose}
          onSubmit={(values) => {
            onSubmit(values)
          }}
        />
      )}
    </Modal>
  )
}
