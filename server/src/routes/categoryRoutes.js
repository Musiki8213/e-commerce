import { Router } from 'express';
import { body } from 'express-validator';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/', listCategories);
router.post(
  '/',
  protect,
  adminOnly,
  [body('name').trim().notEmpty()],
  validate,
  createCategory
);
router.put(
  '/:id',
  protect,
  adminOnly,
  [body('name').optional().trim().notEmpty()],
  validate,
  updateCategory
);
router.delete('/:id', protect, adminOnly, deleteCategory);

export default router;
