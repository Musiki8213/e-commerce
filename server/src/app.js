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

const corsOrigins = (process.env.CLIENT_URL?.split(',') ?? [])
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
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
