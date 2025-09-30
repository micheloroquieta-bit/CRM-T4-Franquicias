
import { useState } from 'react';
import api from '../api';

export default function Login(){
  const [email, setEmail] = useState('admin@demo.dev');
  const [password, setPassword] = useState('admin');
  const [msg, setMsg] = useState('');

  async function submit(e: any){
    e.preventDefault();
    try{
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', data.accessToken);
      setMsg('Listo. Ahora ve a Deals.');
    }catch(e:any){
      setMsg('Credenciales inválidas');
    }
  }

  return (
    <div>
      <h1>Iniciar sesión</h1>
      <form onSubmit={submit} style={{display:'grid', gap:'8px', maxWidth:'240px'}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Contraseña"/>
        <button>Entrar</button>
      </form>
      <div>{msg}</div>
    </div>
  );
}
