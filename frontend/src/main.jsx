import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import Products from './Products.jsx'


createRoot(document.getElementById('react-root')).render(
  <StrictMode>
    <Products />
  </StrictMode>
)
