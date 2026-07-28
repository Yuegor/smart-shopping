import React, { useRef, useState } from 'react'
import commonProducts from '../data/commonProducts.json'
import { exportAppData, importAppData } from '../utils/dataTransfer.js'
import Icon from './Icon.jsx'

export default function ProductsList() {
  const fileInputRef = useRef(null)
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState(false)

  function handleImportClick() {
    setImportError('')
    setImportSuccess(false)
    fileInputRef.current?.click()
  }

  function handleFileSelected(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const reader = new FileReader()
    reader.onerror = () => setImportError('Не удалось прочитать файл.')
    reader.onload = () => {
      const confirmed = window.confirm(
        'Заменить текущие данные приложения содержимым файла? Это действие нельзя отменить.'
      )
      if (!confirmed) return
      try {
        importAppData(String(reader.result))
        setImportSuccess(true)
        // Reload so every screen picks up the freshly-imported localStorage.
        setTimeout(() => window.location.reload(), 400)
      } catch (err) {
        console.error(err)
        setImportError('Файл повреждён или не является корректным экспортом этого приложения.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <header className="mb-6">
        <p className="text-sm text-muted dark:text-night-muted">Справочник</p>
        <h1 className="font-display font-bold text-2xl">Продукты</h1>
      </header>

      <section className="mb-6 rounded-tag border border-line dark:border-night-line bg-surface dark:bg-night-surface p-4">
        <h2 className="font-display font-semibold mb-1">Данные приложения</h2>
        <p className="text-sm text-muted dark:text-night-muted mb-3">
          Сохраните резервную копию магазинов, товаров и карт в файл, или восстановите их из ранее сохранённого файла.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={exportAppData}
            className="flex-1 min-h-[44px] rounded-xl bg-moss dark:bg-mint text-paper dark:text-night-bg
                       font-medium text-sm flex items-center justify-center gap-1.5"
          >
            <Icon name="list" className="w-4 h-4" />
            Экспорт данных
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            className="flex-1 min-h-[44px] rounded-xl border border-line dark:border-night-line
                       font-medium text-sm hover:border-moss dark:hover:border-mint transition-colors"
          >
            Импорт данных
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,text/plain,application/json"
            onChange={handleFileSelected}
            className="hidden"
          />
        </div>
        {importError && <p className="text-sm text-red-500 mt-2">{importError}</p>}
        {importSuccess && (
          <p className="text-sm text-moss dark:text-mint mt-2">Готово! Обновляю приложение…</p>
        )}
      </section>

      <h2 className="font-display font-semibold mb-2">Справочник продуктов ({commonProducts.length})</h2>
      <ul className="rounded-tag border border-line dark:border-night-line overflow-hidden">
        {commonProducts.map((name, i) => (
          <li
            key={name}
            className={`px-4 py-2 text-sm ${
              i % 2 === 0
                ? 'bg-surface dark:bg-night-surface'
                : 'bg-paper dark:bg-night-bg'
            } ${i !== commonProducts.length - 1 ? 'border-b border-line dark:border-night-line' : ''}`}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  )
}
