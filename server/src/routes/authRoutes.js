import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
  ],
  validate,
  register
);
router.post(
  '/login',
  [body('email').trim().isEmail().normalizeEmail(), body('password').notEmpty()],
  validate,
  login
);
router.get('/me', protect, getMe);
router.patch(
  '/profile',
  protect,
  [
    body('name').optional({ checkFalsy: true }).trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Valid email required'),
    body('avatar').optional(),
  ],
  validate,
  updateProfile
);

export default router;
