import jwt from 'jsonwebtoken';
import pool from '../config/db.js'; // Note the explicit .js extension

export const protect = async (req, res, next) => {
  let token;
  console.log("Protect middleware started");
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Authorization rejected, token missing' });
  }
 console.log("Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);
    const [users] = await pool.query('SELECT id, name, email, address, role FROM users WHERE id = ?', [decoded.id]);
    console.log("DB User:", users[0]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'User access revoked' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authorization rejected, signature invalid' });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
      console.log("User Role:", req.user.role);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Resource restricted' });
    }
    next();
  };
};