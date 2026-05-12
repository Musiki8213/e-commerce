import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User.js';
import { Category } from '../src/models/Category.js';
import { Product } from '../src/models/Product.js';
import { catalogCategories, catalogProducts } from './productsData.js';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';

async function run() {
  await mongoose.connect(uri);
  console.log('Connected, clearing collections...');
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
  ]);

  const adminPass = await bcrypt.hash('admin123', 12);
  const userPass = await bcrypt.hash('demo123', 12);
  await User.create([
    {
      name: 'Admin User',
      email: 'admin@demo.com',
      password: adminPass,
      role: 'admin',
    },
    {
      name: 'Demo Customer',
      email: 'demo@demo.com',
      password: userPass,
      role: 'customer',
    },
  ]);

  const cats = await Category.insertMany(catalogCategories);
  const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c._id]));

  await Product.insertMany(
    catalogProducts.map((p) => {
      const categoryId = bySlug[p.categorySlug];
      if (!categoryId) {
        throw new Error(`Unknown categorySlug: ${p.categorySlug}`);
      }
      return {
        title: p.title,
        description: p.description,
        price: p.price,
        category: categoryId,
        stock: p.stock,
        images: p.images,
        featured: p.featured ?? false,
        brand: p.brand ?? 'MS',
        rating: Math.round((4.2 + Math.random() * 0.75) * 10) / 10,
        numReviews: Math.floor(Math.random() * 80) + 8,
      };
    })
  );

  console.log('Seed complete.');
  console.log('Admin: admin@demo.com / admin123');
  console.log('Customer: demo@demo.com / demo123');
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
