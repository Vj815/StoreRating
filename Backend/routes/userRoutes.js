import express from 'express';
import pool from '../config/db.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect, restrictTo('user'));

router.get('/stores', async (req, res) => {
  const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
  const userId = req.user.id;

  let sql = `
    SELECT 
      s.id, s.name, s.address,
      COALESCE((SELECT AVG(rating) FROM ratings WHERE store_id = s.id), 0) as overallRating,
      (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = ?) as userSubmittedRating
    FROM stores s
    WHERE 1=1
  `;
  const params = [userId];

  if (name) { sql += ' AND s.name LIKE ?'; params.push(`%${name}%`); }
  if (address) { sql += ' AND s.address LIKE ?'; params.push(`%${address}%`); }

  const validSortFields = ['name', 'address'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  sql += ` ORDER BY ${sortField} ${sortOrder}`;

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stores/:storeId/rating', async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating bounds value rule mismatch (1-5)' });
  }

  try {
    await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [userId, storeId, rating]
    );
    res.status(201).json({ message: 'Rating tracking documented' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Entry structural collision: modify existing instead' });
    }
    res.status(500).json({ error: error.message });
  }
});

router.put('/stores/:storeId/rating', async (req, res) => {
  const { storeId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating bounds value rule mismatch (1-5)' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
      [rating, userId, storeId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No evaluation mapping found to override' });
    }
    res.json({ message: 'Evaluation mapping updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;