const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Postgres (DATABASE_URL viene de Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Crear tabla deals si no existe
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS deals (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      stage TEXT NOT NULL
    )
  `);
}
initDB();

// Ruta de prueba
app.get('/health', (req, res) => {
  res.json({ ok: true, msg: 'Backend CRM vivo 🚀' });
});

// Login básico (usuario fijo)
app.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === 'admin@demo.dev' && password === 'admin') {
    return res.json({ token: 'fake-jwt', user: { email, role: 'admin' } });
  }
  res.status(401).json({ error: 'Credenciales inválidas' });
});

// Listar deals
app.get('/deals', async (req, res) => {
  const { rows } = await pool.query('SELECT id, title, stage FROM deals ORDER BY id');
  res.json(rows);
});

// Crear deal
app.post('/deals', async (req, res) => {
  const { title, stage } = req.body || {};
  if (!title || !stage) {
    return res.status(400).json({ error: 'Falta title o stage' });
  }
  const { rows } = await pool.query(
    'INSERT INTO deals (title, stage) VALUES ($1, $2) RETURNING id, title, stage',
    [title, stage]
  );
  res.status(201).json(rows[0]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor CRM escuchando en puerto ${PORT}`);
});
