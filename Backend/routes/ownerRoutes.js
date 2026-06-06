import express from 'express';
import pool from '../config/db.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect, restrictTo('store_owner'));

router.get('/dashboard', async (req, res) => {
  const ownerId = req.user.id;
  try {
    const [stores] = await pool.query('SELECT id, name, address FROM stores WHERE owner_id = ?', [ownerId]);
    if (stores.length === 0) {
      return res.status(404).json({ message: 'No registered storefront owned by this identity.' });
    }
    
    const store = stores[0];
    const [[{ averageRating }]] = await pool.query(
      'SELECT COALESCE(AVG(rating), 0) as averageRating FROM ratings WHERE store_id = ?',
      [store.id]
    );

    const [reviews] = await pool.query(
      `SELECT u.name as userName, u.email as userEmail, u.address as userAddress, r.rating, r.created_at as ratedAt
       FROM ratings r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.store_id = ? 
       ORDER BY r.created_at DESC`,
      [store.id]
    );

    res.json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: parseFloat(averageRating).toFixed(1)
      },
      totalRatingsCount: reviews.length,
      reviews: reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;