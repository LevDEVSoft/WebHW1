const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET;

app.use(cors({ origin: true }));
app.use(express.json());

// helper: чтобы не писать try/catch в каждом роуте
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// JWT auth middleware
function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, email }
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// --- ROUTES ---

app.get('/api/health', (req, res) => res.json({ ok: true }));

// SIGNUP
app.post('/api/signup', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    const created = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hash]
    );

    const user = created.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '24h' });

    return res.status(201).json({ token });
  } catch (err) {
    // unique violation
    if (err && err.code === '23505') {
      return res.status(409).json({ error: 'email already in use' });
    }
    throw err;
  }
}));

// LOGIN
app.post('/api/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  const result = await pool.query(
    'SELECT id, email, password_hash FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = result.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);

  if (!ok) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '24h' });
  return res.json({ token });
}));

// POSTS: Get all
app.get('/api/posts', authMiddleware, asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT * FROM posts ORDER BY date DESC');
  return res.json(result.rows);
}));

// POSTS: Get one by id
app.get('/api/posts/:id', authMiddleware, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

  const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Post not found' });

  return res.json(result.rows[0]);
}));

// POSTS: Create
app.post('/api/posts', authMiddleware, asyncHandler(async (req, res) => {
  const { body } = req.body || {};
  if (!body) return res.status(400).json({ error: 'body required' });

  const result = await pool.query(
    'INSERT INTO posts (body) VALUES ($1) RETURNING *',
    [body]
  );

  return res.status(201).json(result.rows[0]);
}));

// POSTS: Update
app.put('/api/posts/:id', authMiddleware, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { body } = req.body || {};
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
  if (!body) return res.status(400).json({ error: 'body required' });

  const result = await pool.query(
    'UPDATE posts SET body = $1 WHERE id = $2 RETURNING *',
    [body, id]
  );

  if (result.rows.length === 0) return res.status(404).json({ error: 'Post not found' });
  return res.json(result.rows[0]);
}));

// POSTS: Delete one
app.delete('/api/posts/:id', authMiddleware, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

  const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]);
  if (result.rows.length === 0) return res.status(404).json({ error: 'Post not found' });

  return res.json({ success: true });
}));

// POSTS: Delete all
app.delete('/api/posts', authMiddleware, asyncHandler(async (req, res) => {
  await pool.query('DELETE FROM posts');
  return res.json({ success: true });
}));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ error: 'Server error' });
});

// start
initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Backend: http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error('DB init failed:', e);
    process.exit(1);
  });
