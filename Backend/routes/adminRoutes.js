import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { userValidationRules, validateResult } from '../middleware/validateMiddleware.js';

const router = express.Router();
router.use(protect, restrictTo('admin'));

router.get('/dashboard', async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ totalStores }]] = await pool.query('SELECT COUNT(*) as totalStores FROM stores');
    const [[{ totalRatings }]] = await pool.query('SELECT COUNT(*) as totalRatings FROM ratings');
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/users', userValidationRules, validateResult, async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role || 'user']
    );
    res.status(201).json({ message: 'User created via Admin panel' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stores', async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, owner_id || null]
    );
    res.status(201).json({ message: 'Store tracked via Admin panel' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
  const validSortFields = ['name', 'email', 'address', 'role'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let sql = `
    SELECT u.id, u.name, u.email, u.address, u.role,
    CASE WHEN u.role = 'store_owner' THEN (SELECT AVG(r.rating) FROM ratings r JOIN stores s ON r.store_id = s.id WHERE s.owner_id = u.id) ELSE NULL END as storeRating
    FROM users u WHERE 1=1
  `;
  const params = [];

  if (name) { sql += ' AND u.name LIKE ?'; params.push(`%${name}%`); }
  if (email) { sql += ' AND u.email LIKE ?'; params.push(`%${email}%`); }
  if (address) { sql += ' AND u.address LIKE ?'; params.push(`%${address}%`); }
  if (role) { sql += ' AND u.role = ?'; params.push(role); }

  sql += ` ORDER BY ${sortField} ${sortOrder}`;

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stores', async (req, res) => {
  const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
  const validSortFields = ['name', 'email', 'address'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let sql = `
    SELECT s.*, COALESCE(AVG(r.rating), 0) as overallRating 
    FROM stores s 
    LEFT JOIN ratings r ON s.id = r.store_id 
    WHERE 1=1
  `;
  const params = [];

  if (name) { sql += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
  if (email) { sql += ' AND s.email LIKE ?'; params.push(`%${email}%`); }
  if (address) { sql += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

  sql += ` GROUP BY s.id ORDER BY ${sortField} ${sortOrder}`;

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;