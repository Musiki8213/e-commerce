import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const dashboardStats = asyncHandler(async (_req, res) => {
  const [orders, users, productsAgg, topProducts] = await Promise.all([
    Order.find({ paymentStatus: 'paid' }).lean(),
    User.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          title: { $first: '$items.title' },
          sold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { sold: -1 } },
      { $limit: 5 },
    ]),
  ]);
  const totalSales = orders.reduce((s, o) => s + o.totalPrice, 0);
  const totalOrders = orders.length;
  res.json({
    totalSales,
    totalUsers: users,
    totalOrders,
    totalProducts: productsAgg,
    topProducts: topProducts.map((p) => ({
      productId: p._id,
      title: p.title,
      sold: p.sold,
      revenue: p.revenue,
    })),
  });
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('name email role createdAt').sort({ createdAt: -1 });
  res.json(users);
});
