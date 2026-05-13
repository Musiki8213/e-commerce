import mongoose from 'mongoose';

const globalKey = '__mongoose_conn__';

/** Trim, strip wrapping quotes, remove accidental newlines (common when pasting in Vercel). */
export function normalizeMongoUri(raw) {
  if (raw == null || typeof raw !== 'string') return '';
  let s = raw.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  s = s.replace(/\s+/g, '');
  return s;
}

function friendlyMongoError(err) {
  const msg = String(err?.message || err);
  const where = process.env.VERCEL ? 'In Vercel, open MONGODB_URI' : 'In server/.env, set MONGODB_URI';
  if (/bad auth|authentication failed|MongoServerError.*18/i.test(msg)) {
    return new Error(
      `MongoDB authentication failed. ${where}: use Atlas → Connect → Drivers (copy string), replace <password> only. Special characters in the password must be URL-encoded (e.g. @ → %40). Remove extra spaces or line breaks. Run: cd server && npm run test:db`
    );
  }
  if (/ENOTFOUND|querySrv|getaddrinfo/i.test(msg)) {
    return new Error(
      'MongoDB host could not be reached. Check Atlas → Network Access (allow 0.0.0.0/0 for testing) and your internet connection.'
    );
  }
  return err;
}

/**
 * Reuses the same connection on Vercel serverless (warm invocations).
 */
export const connectDB = async () => {
  const raw = process.env.MONGODB_URI;
  const uri = normalizeMongoUri(raw || '');
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const g = globalThis;
  if (!g[globalKey]) {
    g[globalKey] = { conn: null, promise: null };
  }
  const cached = g[globalKey];

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set('strictQuery', true);
    cached.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 15000 })
      .then(() => mongoose.connection)
      .catch((err) => {
        cached.promise = null;
        throw friendlyMongoError(err);
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  console.log('MongoDB connected');
  return cached.conn;
};
