const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

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

app.get('/health', (req,res)=> res.json({ ok: true }));

app.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === 'admin@demo.dev' && password === 'admin') {
    return res.json({ token: 'fake-jwt', user: { email, role: 'admin' } });
  }
  res.status(401).json({ error: 'Credenciales inválidas' });
});

app.get('/deals', async (_req, res) => {
  const { rows } = await pool.query('SELECT id, title, stage FROM deals ORDER BY id');
  res.json(rows);
});

app.post('/deals', async (req, res) => {
  const { title, stage } = req.body || {};
  if (!title || !stage) return res.status(400).json({ error: 'Falta title o stage' });
  const { rows } = await pool.query(
    'INSERT INTO deals (title, stage) VALUES ($1, $2) RETURNING id, title, stage',
    [String(title).trim(), String(stage).trim()]
  );
  res.status(201).json(rows[0]);
});

app.put('/deals/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { title, stage } = req.body || {};
  if (!id || !title || !stage) return res.status(400).json({ error: 'Datos inválidos' });
  const { rows } = await pool.query(
    'UPDATE deals SET title=$1, stage=$2 WHERE id=$3 RETURNING id, title, stage',
    [String(title).trim(), String(stage).trim(), id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'No existe' });
  res.json(rows[0]);
});

app.delete('/deals/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID inválido' });
  const result = await pool.query('DELETE FROM deals WHERE id=$1', [id]);
  if (!result.rowCount) return res.status(404).json({ error: 'No existe' });
  res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('✅ Backend CRM en', PORT));
