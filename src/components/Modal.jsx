import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// A simple bottom-sheet modal: on mobile this lands right under the thumb,
// which matters for a one-handed shopping-list app.
export default function Modal({ open, onClose, children, labelledBy }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end sm:items-center sm:justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/40 dark:bg-black/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className="relative w-full sm:max-w-sm bg-surface dark:bg-night-surface rounded-t-tag sm:rounded-tag
                       shadow-tag dark:shadow-tag-dark px-5 pt-4 pb-6 safe-bottom"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line dark:bg-night-line sm:hidden" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
