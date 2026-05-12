import mongoose from 'mongoose';

const globalKey = '__mongoose_conn__';

/**
 * Reuses the same connection on Vercel serverless (warm invocations).
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
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
    cached.promise = mongoose.connect(uri).then(() => mongoose.connection);
  }

  cached.conn = await cached.promise;
  console.log('MongoDB connected');
  return cached.conn;
};
