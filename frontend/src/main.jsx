import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx'
import {CartProvider} from "./CartContext.jsx";


createRoot(document.getElementById('react-root')).render(

      <CartProvider>
          <App/>
      </CartProvider>

)
