import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { acordarServidor } from '@/api/norteensClient'

acordarServidor()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
