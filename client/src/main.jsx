import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ScrollToTop from './features/components/ScrollToTop.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/multi-vendor/">
  <ScrollToTop/>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
)
