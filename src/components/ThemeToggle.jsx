import React from 'react'
import { useShopping } from '../context/ShoppingContext.jsx'
import Icon from './Icon.jsx'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useShopping()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
      className="w-11 h-11 -mt-6 rounded-full bg-moss dark:bg-mint text-paper dark:text-night-bg
                 shadow-tag dark:shadow-tag-dark flex items-center justify-center
                 active:scale-95 transition-transform"
    >
      <Icon name={isDark ? 'moon' : 'sun'} className="w-5 h-5" />
    </button>
  )
}
