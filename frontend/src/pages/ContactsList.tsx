
import { useEffect, useState } from 'react';
import api from '../api';

export default function ContactsList(){
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const { data } = await api.get('/contacts'); setRows(data); })(); },[]);
  return (
    <div>
      <h1>Contactos</h1>
      <table>
        <thead><tr><th>Nombre</th><th>Email</th><th>Empresa</th></tr></thead>
        <tbody>
          {rows.map((r:any)=>(<tr key={r.id}><td>{(r.firstName||'')+' '+(r.lastName||'')}</td><td>{r.email||''}</td><td>{r.company?.name||''}</td></tr>))}
        </tbody>
      </table>
    </div>
  );
}
