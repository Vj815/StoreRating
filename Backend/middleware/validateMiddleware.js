import { body, validationResult } from 'express-validator';

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const userValidationRules = [
  body('name')
    .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail().withMessage('Must be a valid email format'),
  body('address')
    .isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters'),
  body('password')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
];