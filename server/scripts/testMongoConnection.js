/**
 * Quick check that MONGODB_URI in server/.env works (does not start the API).
 * Run from repo:  cd server && npm run test:db
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { normalizeMongoUri } from '../src/config/db.js';

const raw = process.env.MONGODB_URI;
const uri = normalizeMongoUri(raw || '');

if (!uri) {
  console.error('MONGODB_URI is missing. Copy server/.env.example to server/.env and set MONGODB_URI.');
  process.exit(1);
}

console.log('Testing MongoDB connection…');

try {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log('OK — connected successfully.');
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('FAILED:', err.message);
  console.error('\nFix checklist:');
  console.error('  1. Atlas → Database Access: user exists and password matches the URI.');
  console.error('  2. Password in URI must be URL-encoded (@ → %40, # → %23, / → %2F, space → %20).');
  console.error('  3. Easiest: Atlas → user → Edit Password → use letters+numbers only, then Atlas → Connect → copy new URI.');
  console.error('  4. Atlas → Network Access: your IP or 0.0.0.0/0 allowed.');
  console.error('  5. Local dev: you can use mongodb://127.0.0.1:27017/ecommerce if mongod is running locally.');
  process.exit(1);
}
