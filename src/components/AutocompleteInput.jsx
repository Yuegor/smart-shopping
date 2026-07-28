import React, { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon.jsx'

const DEBOUNCE_MS = 150
const MAX_SUGGESTIONS = 8

// A plain text input that suggests matching items as you type, tolerant of
// typos ("малако" still finds "Молоко ..."). Suggestions are just a
// shortcut — typing anything and ignoring the dropdown works fine too.
// `source` is the list of strings to fuzzy-match against (e.g. a product
// reference list, or the names of shops already in the app).
export default function AutocompleteInput({
  id,
  value,
  onChange,
  placeholder,
  autoFocus = false,
  source
}) {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  // Set right after picking a suggestion so the debounced search effect
  // (which still fires once because `value` just changed) doesn't
  // immediately reopen the dropdown it was just told to close.
  const suppressNextSearchRef = useRef(false)

  const fuse = useMemo(
    () => new Fuse(source || [], { threshold: 0.4, distance: 100 }),
    [source]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (suppressNextSearchRef.current) {
      suppressNextSearchRef.current = false
      return
    }

    const query = value.trim()
    if (!query) {
      setSuggestions([])
      setOpen(false)
      setActiveIndex(-1)
      return
    }
    debounceRef.current = setTimeout(() => {
      const results = fuse.search(query, { limit: MAX_SUGGESTIONS }).map((r) => r.item)
      setSuggestions(results)
      setOpen(results.length > 0)
      setActiveIndex(-1)
    }, DEBOUNCE_MS)
    return () => clearTimeout(debounceRef.current)
  }, [value, fuse])

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectSuggestion(name) {
    suppressNextSearchRef.current = true
    onChange(name)
    setOpen(false)
    setActiveIndex(-1)
    // Selecting a suggestion shouldn't take focus away from the field —
    // the person can keep typing or move straight to the next field.
    inputRef.current?.focus()
  }

  function hideSuggestions() {
    setOpen(false)
    setSuggestions([])
    setActiveIndex(-1)
  }

  function handleKeyDown(e) {
    if (!open || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault()
        selectSuggestion(suggestions[activeIndex])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        ref={inputRef}
        id={id}
        autoFocus={autoFocus}
        type="text"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full rounded-xl border border-line dark:border-night-line bg-paper dark:bg-night-bg
                   pl-4 pr-9 py-3 text-base outline-none focus:border-moss dark:focus:border-mint"
      />

      {value && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={hideSuggestions}
          aria-label="Скрыть подсказки"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center
                     rounded-full text-gray-400 hover:text-gray-600 dark:text-night-muted dark:hover:text-night-ink
                     cursor-pointer transition-colors"
        >
          <Icon name="close" className="w-4 h-4" strokeWidth={2.5} />
        </button>
      )}

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1.5 w-full max-h-56 overflow-y-auto rounded-xl border
                       border-line dark:border-night-line bg-surface dark:bg-night-surface
                       shadow-tag dark:shadow-tag-dark"
          >
            {suggestions.map((name, i) => (
              <li key={name}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(name)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    i === activeIndex
                      ? 'bg-moss-light dark:bg-white/10'
                      : 'hover:bg-moss-light/50 dark:hover:bg-white/5 active:bg-moss-light dark:active:bg-white/10'
                  }`}
                >
                  {name}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
