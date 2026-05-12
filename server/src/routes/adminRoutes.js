import { Router } from 'express';
import { dashboardStats, listUsers } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.use(protect, adminOnly);
router.get('/stats', dashboardStats);
router.get('/users', listUsers);

export default router;
