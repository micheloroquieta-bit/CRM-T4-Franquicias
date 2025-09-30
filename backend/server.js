
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

// In-memory demo data
const stages = [
  { id: 's1', name: 'Prospecto', order: 1 },
  { id: 's2', name: 'Calificado', order: 2 },
  { id: 's3', name: 'Demostración', order: 3 },
  { id: 's4', name: 'Negociación', order: 4 },
  { id: 's5', name: 'Ganado', order: 5 },
];
const companies = [{ id: 'c1', name: 'ACME Corp', domain: 'acme.test', industry: 'Manufactura' }];
const contacts = [{ id: 'p1', firstName: 'Alice', lastName: 'Acme', email: 'alice@acme.test', companyId: 'c1' }];
const deals = [{ id: 'd1', title: 'ACME 12k', amount: 12000, currency: 'EUR', stageId: 's1', companyId: 'c1', contactId: 'p1' }];

// Auth mock
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email === 'admin@demo.dev' && password === 'admin') {
    return res.json({ accessToken: 'demo-token', refreshToken: 'demo-refresh', user: { id: 'u1', name: 'Admin', email, role: 'admin' } });
  }
  return res.status(401).json({ message: 'Credenciales inválidas' });
});

// Pipelines
app.get('/pipelines/stages', (req, res) => res.json(stages));

// Deals
app.get('/deals', (req, res) => {
  const result = deals.map(d => ({
    ...d,
    stage: stages.find(s => s.id === d.stageId),
    company: companies.find(c => c.id === d.companyId),
    contact: contacts.find(p => p.id === d.contactId)
  }));
  res.json(result);
});
app.post('/deals', (req, res) => {
  const body = req.body || {};
  const id = uuidv4();
  const deal = { id, title: body.title || 'Nuevo deal', amount: body.amount || 0, currency: body.currency || 'EUR', stageId: body.stageId || stages[0].id, companyId: body.companyId || null, contactId: body.contactId || null };
  deals.push(deal);
  res.status(201).json(deal);
});
app.post('/deals/:id/move', (req, res) => {
  const { id } = req.params;
  const { stageId } = req.body || {};
  const deal = deals.find(d => d.id === id);
  if (!deal) return res.status(404).json({ message: 'Deal not found' });
  deal.stageId = stageId;
  res.json(deal);
});

// Contacts
app.get('/contacts', (req, res) => {
  const rows = contacts.map(c => ({ ...c, company: companies.find(x => x.id === c.companyId) }));
  res.json(rows);
});
app.post('/contacts', (req, res) => {
  const id = uuidv4();
  const c = { id, ...req.body };
  contacts.push(c);
  res.status(201).json(c);
});

// Companies
app.get('/companies', (req, res) => res.json(companies));
app.post('/companies', (req, res) => {
  const id = uuidv4();
  const c = { id, ...req.body };
  companies.push(c);
  res.status(201).json(c);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`CRM simple backend listening on ${PORT}`));
