import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const buildFilter = (query) => {
  const filter = {};
  if (query.search) {
    filter.$text = { $search: query.search };
  }
  if (query.category) {
    filter.category = query.category;
  }
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.minRating) {
    filter.rating = { $gte: Number(query.minRating) };
  }
  if (query.featured === 'true' || query.featured === true) {
    filter.featured = true;
  }
  return filter;
};

const sortOption = (sort) => {
  switch (sort) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'rating':
      return { rating: -1, numReviews: -1 };
    case 'newest':
      return { createdAt: -1 };
    default:
      return { createdAt: -1 };
  }
};

export const listProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(48, Math.max(1, Number(req.query.limit) || 12));
  const skip = (page - 1) * limit;
  const filter = buildFilter(req.query);
  const sort = sortOption(req.query.sort);
  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);
  res.json({
    products: items,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
  });
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const related = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
  })
    .populate('category', 'name slug')
    .sort({ rating: -1 })
    .limit(4)
    .lean();
  res.json({ product, related });
});

export const createProduct = asyncHandler(async (req, res) => {
  const cat = await Category.findById(req.body.category);
  if (!cat) {
    res.status(400);
    throw new Error('Invalid category');
  }
  const product = await Product.create(req.body);
  await product.populate('category', 'name slug');
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  if (req.body.category) {
    const cat = await Category.findById(req.body.category);
    if (!cat) {
      res.status(400);
      throw new Error('Invalid category');
    }
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ message: 'Product removed' });
});

export const uploadImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const base = `${req.protocol}://${req.get('host')}`;
  const files = req.files || [];
  const urls = files.map((f) => `${base}/uploads/products/${f.filename}`);
  product.images.push(...urls);
  await product.save();
  await product.populate('category', 'name slug');
  res.json(product);
});
