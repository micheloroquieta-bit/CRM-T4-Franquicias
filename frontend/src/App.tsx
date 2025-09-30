import React, { useState } from 'react'
type Deal = { id: number; title: string; stage: string }
const STAGES = ['Prospecto','Cualificación','Negociación','Cierre Pendiente','Ganado','Perdido'] as const
export default function App() {
  const api = import.meta.env.VITE_API_URL as string
  const [token, setToken] = useState<string | null>(null)
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [stage, setStage] = useState<(typeof STAGES)[number]>('Prospecto')
  const [editId, setEditId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editStage, setEditStage] = useState<(typeof STAGES)[number]>('Prospecto')
  const ok = (r: Response) => { if (!r.ok) throw new Error(`${r.status}`); return r }
  const login = async () => {
    setMsg(null)
    try {
      const r = await fetch(api + '/login', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email:'admin@demo.dev', password:'admin' }) }).then(ok).then(x=>x.json())
      setToken(r.token); setMsg('Login correcto'); await load()
    } catch { setMsg('Login falló') }
  }
  const load = async () => {
    setLoading(true); setMsg(null)
    try { const r = await fetch(api + '/deals').then(ok).then(x=>x.json()); setDeals(r) }
    catch { setMsg('No se pudieron cargar los deals') } finally { setLoading(false) }
  }
  const createDeal = async () => {
    if (!title.trim()) { setMsg('Escribe un título'); return }
    setLoading(true); setMsg(null)
    try {
      const r = await fetch(api + '/deals', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ title: title.trim(), stage }) }).then(ok).then(x=>x.json())
      setDeals(d => [...d, r]); setTitle(''); setMsg('Deal creado')
    } catch { setMsg('No se pudo crear') } finally { setLoading(false) }
  }
  const startEdit = (d: Deal) => { setEditId(d.id); setEditTitle(d.title); setEditStage(d.stage as any) }
  const saveEdit = async () => {
    if (!editId) return
    try {
      const r = await fetch(api + '/deals/' + editId, { method:'PUT', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ title: editTitle.trim(), stage: editStage }) }).then(ok).then(x=>x.json())
      setDeals(ds => ds.map(d => d.id === r.id ? r : d)); setEditId(null)
    } catch { setMsg('No se pudo guardar') }
  }
  const remove = async (id: number) => {
    const yes = confirm('¿Seguro que quieres borrar este deal?'); if (!yes) return
    try { await fetch(api + '/deals/' + id, { method:'DELETE' }).then(ok); setDeals(ds => ds.filter(d => d.id !== id)) }
    catch { setMsg('No se pudo borrar') }
  }
  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>CRM Admin</h1>
      {!token ? (
        <button onClick={login} className='bg-blue-600 text-white px-4 py-2 rounded'>Login</button>
      ) : (
        <>
          <div className='mb-4 flex items-center gap-2'>
            <button onClick={load} disabled={loading} className='bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60'>
              {loading ? 'Cargando...' : 'Actualizar lista'}
            </button>
            {msg && <span className='text-sm text-gray-600'>{msg}</span>}
          </div>
          <div className='mb-6 flex flex-wrap items-center gap-2'>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder='Título del deal'
              className='border px-3 py-2 rounded w-64' />
            <select value={stage} onChange={e=>setStage(e.target.value as any)} className='border px-3 py-2 rounded'>
              {STAGES.map(s => <option key={s}>{s}</option>)}
            </select>
            <button onClick={createDeal} disabled={loading} className='bg-black text-white px-4 py-2 rounded disabled:opacity-60'>Crear</button>
          </div>
          <div className='border rounded'>
            {deals.length === 0 && <div className='p-3 text-gray-500'>No hay deals aún.</div>}
            {deals.map(d => (
              <div key={d.id} className='grid grid-cols-12 gap-2 items-center border-b p-2'>
                <div className='col-span-1 text-gray-500'>#{d.id}</div>
                <div className='col-span-5'>
                  {editId === d.id ? (
                    <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} className='border px-2 py-1 rounded w-full' />
                  ) : (<span>{d.title}</span>)}
                </div>
                <div className='col-span-3'>
                  {editId === d.id ? (
                    <select value={editStage} onChange={e=>setEditStage(e.target.value as any)} className='border px-2 py-1 rounded w-full'>
                      {STAGES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  ) : (<span className='text-gray-700'>{d.stage}</span>)}
                </div>
                <div className='col-span-3 flex gap-2 justify-end'>
                  {editId === d.id ? (
                    <>
                      <button onClick={saveEdit} className='bg-emerald-600 text-white px-3 py-1 rounded'>Guardar</button>
                      <button onClick={()=>setEditId(null)} className='bg-gray-300 px-3 py-1 rounded'>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={()=>startEdit(d)} className='bg-blue-600 text-white px-3 py-1 rounded'>Editar</button>
                      <button onClick={()=>remove(d.id)} className='bg-red-600 text-white px-3 py-1 rounded'>Borrar</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
