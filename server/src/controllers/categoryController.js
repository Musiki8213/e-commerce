import { Category } from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description = '' } = req.body;
  const slug = slugify(name);
  const cat = await Category.create({ name, slug, description });
  res.status(201).json(cat);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const cat = await Category.findById(req.params.id);
  if (!cat) {
    res.status(404);
    throw new Error('Category not found');
  }
  if (name) {
    cat.name = name;
    cat.slug = slugify(name);
  }
  if (description !== undefined) cat.description = description;
  await cat.save();
  res.json(cat);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const cat = await Category.findByIdAndDelete(req.params.id);
  if (!cat) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ message: 'Category removed' });
});
