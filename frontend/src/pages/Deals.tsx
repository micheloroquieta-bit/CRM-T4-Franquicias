import { useEffect, useState } from 'react'
import { getDeals } from '../api'
type Deal = { id:number; title:string; stage:string }
export default function Deals(){
  const [deals, setDeals] = useState<Deal[]>([])
  useEffect(()=>{ (async()=>{ setDeals(await getDeals()) })() }, [])
  const stages = ['Prospecto','Demostración','Negociación']
  return (<div>
    <h2>Pipeline</h2>
    <div className="kanban">
      {stages.map(stage => (
        <div key={stage} className="column">
          <div style={{ fontWeight: 600, marginBottom: 10 }}>{stage}</div>
          {deals.filter(d=>d.stage===stage).map(d => (<div key={d.id} className="card-item"><div>{d.title}</div><div style={{ fontSize: 12, opacity: .7 }}>Etapa: {d.stage}</div></div>))}
        </div>
      ))}
    </div>
  </div>)
}
