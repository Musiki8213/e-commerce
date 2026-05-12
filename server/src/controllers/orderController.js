import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingInfo, mockPayment } = req.body;
  if (!items?.length) {
    res.status(400);
    throw new Error('Cart is empty');
  }
  let total = 0;
  const orderItems = [];
  for (const line of items) {
    const product = await Product.findById(line.product);
    if (!product) {
      res.status(400);
      throw new Error(`Product not found: ${line.product}`);
    }
    if (product.stock < line.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.title}`);
    }
    const price = product.price;
    total += price * line.quantity;
    orderItems.push({
      product: product._id,
      title: product.title,
      image: product.images[0] || '',
      price,
      quantity: line.quantity,
    });
  }
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingInfo,
    totalPrice: total,
    paymentStatus: mockPayment?.success === false ? 'failed' : 'paid',
    orderStatus: 'processing',
  });
  if (order.paymentStatus === 'paid') {
    for (const line of items) {
      await Product.findByIdAndUpdate(line.product, { $inc: { stock: -line.quantity } });
    }
  } else {
    await order.deleteOne();
    res.status(400);
    throw new Error('Mock payment declined');
  }
  const populated = await Order.findById(order._id).populate('items.product');
  res.status(201).json(populated);
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.product');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not allowed');
  }
  res.json(order);
});

export const allOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.orderStatus = orderStatus;
  await order.save();
  res.json(order);
});
