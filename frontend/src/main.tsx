
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DealsKanban from './pages/DealsKanban';
import ContactsList from './pages/ContactsList';
import CompaniesList from './pages/CompaniesList';

function App(){
  return (
    <div style={{fontFamily:'system-ui, sans-serif', padding:'16px'}}>
      <nav style={{display:'flex', gap:'12px', marginBottom:'12px'}}>
        <a href="/deals">Deals</a>
        <a href="/contacts">Contactos</a>
        <a href="/companies">Empresas</a>
      </nav>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/deals" element={<DealsKanban/>} />
        <Route path="/contacts" element={<ContactsList/>} />
        <Route path="/companies" element={<CompaniesList/>} />
        <Route path="*" element={<Navigate to="/deals" replace />} />
      </Routes>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.StrictMode>
);
