import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { ShoppingProvider } from './context/ShoppingContext.jsx'
import { LoyaltyProvider } from './context/LoyaltyContext.jsx'
import './index.css'

// HashRouter is used so the app also works when opened directly from the
// filesystem or from a static host without server-side routing rules
// (important for a PWA that may be installed and opened offline).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ShoppingProvider>
        <LoyaltyProvider>
          <App />
        </LoyaltyProvider>
      </ShoppingProvider>
    </HashRouter>
  </React.StrictMode>
)
