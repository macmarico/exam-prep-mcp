import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('loading...')
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(() => setApiStatus('ok'))
      .catch(() => setApiStatus('error'))
  }, [])

  useEffect(() => {
    fetch('/api/items')
      .then((r) => r.json())
      .then((data) => setItems(data))
      .catch(() => setItems([]))
  }, [])

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Monorepo: Vite + React + Express</h1>
      <p>Backend health: {apiStatus}</p>
      <h2>Items</h2>
      <ul>
        {items.map((it) => (
          <li key={it._id || it.name}>{it.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
