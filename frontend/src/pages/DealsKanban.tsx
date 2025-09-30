
import { useEffect, useMemo, useState } from 'react';
import api from '../api';

export default function DealsKanban(){
  const [deals, setDeals] = useState<any[]>([]);
  const [stages, setStages] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{
    const ds = await api.get('/deals'); setDeals(ds.data);
    const st = await api.get('/pipelines/stages'); setStages(st.data);
  })(); }, []);

  const columns = useMemo(()=> stages.map((s:any)=>({ ...s, cards: deals.filter(d=>d.stage?.id===s.id || d.stageId===s.id) })), [stages, deals]);

  async function onMove(dealId: string, stageId: string){
    await api.post(`/deals/${dealId}/move`, { stageId });
    setDeals(d=>d.map(x=> x.id===dealId ? { ...x, stageId, stage: stages.find(s=>s.id===stageId)} : x));
  }

  return (
    <div>
      <h1>Pipeline</h1>
      <div style={{display:'grid', gridTemplateColumns:`repeat(${columns.length}, 1fr)`, gap:'8px'}}>
        {columns.map((col:any)=>(
          <div key={col.id} onDragOver={e=>e.preventDefault()} onDrop={e=>{ const id=e.dataTransfer.getData('text/plain'); onMove(id, col.id); }} style={{background:'#fff', border:'1px solid #ddd', padding:'8px', borderRadius:'8px'}}>
            <b>{col.name}</b>
            {col.cards.map((c:any)=>(
              <div key={c.id} draggable onDragStart={e=>e.dataTransfer.setData('text/plain', c.id)} style={{marginTop:'6px', border:'1px solid #ccc', padding:'6px', borderRadius:'6px'}}>
                <div>{c.title}</div>
                <div style={{fontSize:'12px', opacity:.7}}>€ {c.amount}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
