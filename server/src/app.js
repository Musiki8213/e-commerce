import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isVercel = Boolean(process.env.VERCEL);
const uploadRoot = isVercel ? '/tmp/uploads' : path.join(__dirname, '../uploads');

if (!isVercel && !fs.existsSync(uploadRoot)) {
  fs.mkdirSync(uploadRoot, { recursive: true });
}

const app = express();
if (isVercel) {
  app.set('trust proxy', 1);
}

/** CORS: CLIENT_URL (comma-separated) + Vercel auto URLs + any *.vercel.app when running on Vercel */
function allowedCorsOrigins() {
  const fromEnv = (process.env.CLIENT_URL?.split(',') ?? [])
    .map((s) => s.trim())
    .filter(Boolean);
  const fromVercel = [];
  if (process.env.VERCEL_URL) {
    fromVercel.push(`https://${process.env.VERCEL_URL}`);
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    const u = process.env.VERCEL_PROJECT_PRODUCTION_URL.trim();
    fromVercel.push(u.startsWith('http') ? u : `https://${u}`);
  }
  if (process.env.VERCEL_BRANCH_URL) {
    fromVercel.push(`https://${process.env.VERCEL_BRANCH_URL}`);
  }
  return [...new Set([...fromEnv, ...fromVercel].filter(Boolean))];
}

const corsAllowedList = allowedCorsOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (corsAllowedList.includes(origin)) {
        callback(null, true);
        return;
      }
      if (isVercel) {
        try {
          const { hostname } = new URL(origin);
          if (hostname.endsWith('.vercel.app')) {
            callback(null, true);
            return;
          }
        } catch {
          callback(null, false);
          return;
        }
      }
      if (!isVercel && corsAllowedList.length === 0) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(isVercel ? 'tiny' : 'dev'));
app.use('/uploads', express.static(uploadRoot));

if (isVercel) {
  app.use(async (_req, _res, next) => {
    try {
      await connectDB();
      next();
    } catch (e) {
      next(e);
    }
  });
}

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
