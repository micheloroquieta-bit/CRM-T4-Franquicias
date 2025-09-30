import React, { useState } from 'react'

type Deal = { id: number; title: string; stage: string }

export default function App() {
  const apiUrl = import.meta.env.VITE_API_URL as string

  const [token, setToken] = useState<string | null>(null)
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [stage, setStage] = useState('Prospecto')
  const [msg, setMsg] = useState<string | null>(null)

  const login = async () => {
    setMsg(null)
    try {
      const res = await fetch(apiUrl + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@demo.dev', password: 'admin' })
      })
      if (!res.ok) throw new Error('Credenciales inválidas')
      const data = await res.json()
      setToken(data.token)
      setMsg('Login correcto')
    } catch (e: any) {
      setMsg('Error de login: ' + e.message)
    }
  }

  const loadDeals = async () => {
    setLoading(true); setMsg(null)
    try {
      const res = await fetch(apiUrl + '/deals')
      if (!res.ok) throw new Error('No se pudieron cargar')
      const data: Deal[] = await res.json()
      setDeals(data)
    } catch (e: any) {
      setMsg('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const createDeal = async () => {
    if (!title.trim()) { setMsg('Escribe un título'); return }
    setLoading(true); setMsg(null)
    try {
      const res = await fetch(apiUrl + '/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), stage })
      })
      if (!res.ok) throw new Error('No se pudo crear')
      const nuevo: Deal = await res.json()
      setDeals(prev => [...prev, nuevo])
      setTitle('')
      setMsg('Deal creado')
    } catch (e: any) {
      setMsg('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">CRM Frontend</h1>

      {!token ? (
        <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <button onClick={loadDeals} disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60">
              {loading ? 'Cargando...' : 'Cargar Deals'}
            </button>
            {msg && <span className="text-sm text-gray-600">{msg}</span>}
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título del deal"
              className="border px-3 py-2 rounded w-60"
            />
            <select value={stage} onChange={e => setStage(e.target.value)}
              className="border px-3 py-2 rounded">
              <option>Prospecto</option>
              <option>Negociación</option>
              <option>Ganado</option>
            </select>
            <button onClick={createDeal} disabled={loading}
              className="bg-black text-white px-4 py-2 rounded disabled:opacity-60">
              Crear
            </button>
          </div>

          <ul className="space-y-3">
            {deals.map(d => (
              <li key={d.id} className="border rounded px-3 py-2">{d.title} — {d.stage}</li>
            ))}
            {deals.length === 0 && <li className="text-gray-500">No hay deals aún.</li>}
          </ul>
        </>
      )}
    </div>
  )
}
