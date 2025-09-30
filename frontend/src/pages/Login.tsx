import { useState } from 'react'
import { login } from '../api'
import { useNavigate } from 'react-router-dom'
export default function Login(){
  const [email, setEmail] = useState('admin@demo.dev')
  const [password, setPassword] = useState('admin')
  const [error, setError] = useState('')
  const nav = useNavigate()
  async function submit(e: React.FormEvent){ e.preventDefault(); try{ await login(email, password); nav('/deals') }catch{ setError('Credenciales inválidas') } }
  return (<div className="container"><div className="card" style={{ maxWidth: 420, margin: '60px auto' }}>
    <h2 style={{ marginTop: 0 }}>Iniciar sesión</h2>
    {error && <div style={{ color: 'crimson', marginBottom: 10 }}>{error}</div>}
    <form onSubmit={submit} style={{ display: 'grid', gap: 10 }}>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
    <p style={{ fontSize: 12, opacity: .7, marginTop: 10 }}>API: {import.meta.env.VITE_API_URL || 'http://localhost:4000'}</p>
  </div></div>)
}
