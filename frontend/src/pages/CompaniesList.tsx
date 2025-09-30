
import { useEffect, useState } from 'react';
import api from '../api';

export default function CompaniesList(){
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{ const { data } = await api.get('/companies'); setRows(data); })(); },[]);
  return (
    <div>
      <h1>Empresas</h1>
      <table>
        <thead><tr><th>Nombre</th><th>Dominio</th><th>Industria</th></tr></thead>
        <tbody>
          {rows.map((r:any)=>(<tr key={r.id}><td>{r.name}</td><td>{r.domain||''}</td><td>{r.industry||''}</td></tr>))}
        </tbody>
      </table>
    </div>
  );
}
