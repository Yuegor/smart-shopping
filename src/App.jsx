import React from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import ShopList from './components/ShopList.jsx'
import ShopDetail from './components/ShopDetail.jsx'
import AllItems from './components/AllItems.jsx'
import LoyaltyCards from './components/LoyaltyCards.jsx'
import ProductsList from './components/ProductsList.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import Icon from './components/Icon.jsx'

const TOP_LEVEL_ROUTES = ['/', '/loyalty', '/products', '/all-items']

export default function App() {
  const location = useLocation()
  // The bottom tab bar only makes sense on the top-level screens; it's
  // hidden on a shop's detail screen to keep that view focused.
  const showTabs = TOP_LEVEL_ROUTES.includes(location.pathname)

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="flex-1 pb-24 safe-top">
        <Routes>
          <Route path="/" element={<ShopList />} />
          <Route path="/shop/:shopId" element={<ShopDetail />} />
          <Route path="/loyalty" element={<LoyaltyCards />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/all-items" element={<AllItems />} />
        </Routes>
      </div>

      {showTabs && (
        <nav
          className="fixed bottom-0 inset-x-0 z-30 border-t border-line dark:border-night-line
                     bg-surface/95 dark:bg-night-surface/95 backdrop-blur safe-bottom"
        >
          <div className="max-w-lg mx-auto grid grid-cols-5 items-center px-1">
            <TabLink to="/" icon="store" label="Магазины" />
            <TabLink to="/loyalty" icon="card" label="Карты" />
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
            <TabLink to="/products" icon="list" label="Продукты" />
            <TabLink to="/all-items" icon="basket" label="Все покупки" />
          </div>
        </nav>
      )}
    </div>
  )
}

function TabLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] text-[11px] font-medium transition-colors ${
          isActive
            ? 'text-moss dark:text-mint'
            : 'text-muted dark:text-night-muted hover:text-ink dark:hover:text-night-ink'
        }`
      }
      end
    >
      <Icon name={icon} className="w-5 h-5" />
      {label}
    </NavLink>
  )
}
