const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint de salud
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'CRM backend funcionando 🚀' });
});

// Endpoint de login de prueba
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@demo.dev' && password === 'admin') {
    return res.json({ token: 'fake-jwt-token', user: { email, role: 'admin' } });
  }
  res.status(401).json({ error: 'Credenciales inválidas' });
});

// Endpoint de deals (ejemplo simple)
app.get('/deals', (req, res) => {
  res.json([
    { id: 1, title: 'ACME Corp 12k', stage: 'Prospecto' },
    { id: 2, title: 'Cliente Demo 5k', stage: 'Negociación' }
  ]);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('🚀 Backend Express escuchando en puerto', PORT);
});
