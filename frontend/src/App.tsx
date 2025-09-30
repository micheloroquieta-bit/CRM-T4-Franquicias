import React, { useState } from 'react'

export default function App() {
  const [token, setToken] = useState<string | null>(null)
  const [deals, setDeals] = useState<any[]>([])

  const apiUrl = import.meta.env.VITE_API_URL

  const login = async () => {
    const res = await fetch(apiUrl + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@demo.dev', password: 'admin' })
    })
    if (res.ok) {
      const data = await res.json()
      setToken(data.token)
      alert('Login correcto')
    } else {
      const t = await res.text()
      alert('Error de login: ' + t)
    }
  }

  const loadDeals = async () => {
    const res = await fetch(apiUrl + '/deals')
    const data = await res.json()
    setDeals(data)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">CRM Frontend</h1>
      {!token ? (
        <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      ) : (
        <>
          <button onClick={loadDeals} className="bg-green-600 text-white px-4 py-2 rounded">Cargar Deals</button>
          <ul className="mt-4">
            {deals.map(d => (
              <li key={d.id} className="border p-2 mb-2">{d.title} - {d.stage}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
