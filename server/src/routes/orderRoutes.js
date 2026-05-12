import { Router } from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  myOrders,
  getOrder,
  allOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/mine', protect, myOrders);
router.get('/all', protect, adminOnly, allOrders);

router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }),
    body('items.*.product').notEmpty(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('shippingInfo.fullName').notEmpty(),
    body('shippingInfo.line1').notEmpty(),
    body('shippingInfo.city').notEmpty(),
    body('shippingInfo.state').notEmpty(),
    body('shippingInfo.postalCode').notEmpty(),
    body('shippingInfo.country').notEmpty(),
    body('shippingInfo.phone').notEmpty(),
  ],
  validate,
  createOrder
);
router.get('/:id', protect, getOrder);
router.patch(
  '/:id/status',
  protect,
  adminOnly,
  [body('orderStatus').isIn(['processing', 'shipped', 'delivered', 'cancelled'])],
  validate,
  updateOrderStatus
);

export default router;
