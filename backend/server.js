const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Logger simple para ver las peticiones en Render
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Salud
app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'crm-backend-express', ts: new Date().toISOString() });
});

// Handler de login compartido
function handleLogin(req, res) {
  const { email, password } = req.body || {};
  if (email === 'admin@demo.dev' && password === 'admin') {
    return res.json({ token: 'fake-jwt-token', user: { email, role: 'admin' } });
  }
  return res.status(401).json({ error: 'Credenciales inválidas' });
}

// Soportar ambas rutas: /login y /auth/login
app.post('/login', handleLogin);
app.post('/auth/login', handleLogin);

// Ejemplo de deals
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
