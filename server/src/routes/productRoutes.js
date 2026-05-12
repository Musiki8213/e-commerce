import { Router } from 'express';
import { body } from 'express-validator';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
} from '../controllers/productController.js';
import {
  listProductReviews,
  addOrUpdateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { uploadProductImages } from '../middleware/upload.js';

const router = Router();

router.get('/', listProducts);

router.post(
  '/',
  protect,
  adminOnly,
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('category').notEmpty(),
    body('stock').isInt({ min: 0 }),
  ],
  validate,
  createProduct
);

router.get('/:productId/reviews', listProductReviews);
router.post(
  '/:productId/reviews',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().isString(),
  ],
  validate,
  addOrUpdateReview
);
router.delete('/reviews/:reviewId', protect, deleteReview);

router.post(
  '/:id/images',
  protect,
  adminOnly,
  uploadProductImages.array('images', 8),
  uploadImages
);

router.get('/:id', getProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
