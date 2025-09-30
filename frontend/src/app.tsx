import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Deals from './pages/Deals'
function Private({ children }: { children: JSX.Element }){ return localStorage.getItem('token') ? children : <Navigate to="/login" replace /> }
export default function App(){
  return (<div>
    <nav className="card" style={{ borderRadius: 0 }}><div className="container nav"><Link to="/deals">Deals</Link><Link to="/login">Salir</Link></div></nav>
    <div className="container">
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/deals" element={<Private><Deals/></Private>} />
        <Route path="*" element={<Navigate to="/deals" replace />} />
      </Routes>
    </div>
  </div>)
}
