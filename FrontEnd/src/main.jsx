import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // App.jsx now handles its own provider wrapper
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Removed AppProvider wrapping here, as it is self-contained in App.jsx now */}
    <App />
  </React.StrictMode>,
)