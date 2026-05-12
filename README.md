# MS. E-Commerce

Full-stack fashion e-commerce: **React (Vite + TypeScript)** storefront, **Express + MongoDB (Mongoose)** API, JWT auth, cart/checkout, orders, wishlist, and admin tools. Product catalog and images are driven by seed data and static assets under `client/public/product-images/`.

## Stack

| Layer | Technology |
|--------|------------|
| Frontend | React 19, React Router 7, Tailwind CSS, Axios, Vite 8 |
| Backend | Express 4, Mongoose 8, JWT, express-validator, Multer |
| Database | MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas)) |

## Repository layout

```
client/          # Vite SPA — runs on http://localhost:5173 in dev
server/          # REST API — runs on http://localhost:5000 by default
api/index.js     # Vercel serverless entry (re-exports Express app)
vercel.json      # Vercel build, rewrites, and function config
server/scripts/  # seed.js, productsData.js
```

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (LTS recommended)
- MongoDB instance (local `mongod` or Atlas URI)
- npm (ships with Node)

## Local setup

### 1. Server environment

Copy `server/.env.example` to `server/.env` and set:

| Variable | Purpose |
|----------|---------|
| `PORT` | API port (default `5000`) |
| `MONGODB_URI` | Mongo connection string |
| `JWT_SECRET` | Secret for signing JWTs (use a long random value in production) |
| `CLIENT_URL` | Allowed CORS origin(s), e.g. `http://localhost:5173`. Comma-separated for multiple URLs |

### 2. Client environment (optional)

Copy `client/.env.example` to `client/.env` if needed. For local dev, the Vite dev server proxies `/api` to the backend, so you usually **do not** need `VITE_API_URL`.

### 3. Install and run

From two terminals (or use a process manager):

```bash
cd server && npm install && npm run dev
```

```bash
cd client && npm install && npm run dev
```

- **Storefront:** http://localhost:5173  
- **API:** http://localhost:5000  
- **Health:** http://localhost:5000/api/health  

### 4. Seed the database

**Warning:** the seed script **deletes** existing users, categories, and products, then inserts demo data.

```bash
cd server && npm run seed
```

Demo accounts (after seed):

- **Admin:** `admin@demo.com` / `admin123`  
- **Customer:** `demo@demo.com` / `demo123`  

Change passwords before any real deployment.

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| `client/` | `npm run dev` | Vite dev server with API proxy |
| `client/` | `npm run build` | Typecheck + production build → `client/dist` |
| `client/` | `npm run preview` | Preview production build locally |
| `server/` | `npm run dev` | API with `--watch` |
| `server/` | `npm start` | API without watch |
| `server/` | `npm run seed` | Reset DB and load catalog from `scripts/productsData.js` |
| repo root | `npm run vercel-build` | Client production build (used by Vercel) |

## API overview

Base path: **`/api`**

| Prefix | Area |
|--------|------|
| `/api/auth` | Register, login, me, profile |
| `/api/categories` | Categories |
| `/api/products` | Products (supports `search`, `category`, `sort`, `featured`, pagination) |
| `/api/orders` | Customer orders |
| `/api/admin` | Admin-only routes |

## Deploying on Vercel

The repo is configured for a **single Vercel project**: static files from `client/dist` and a **serverless** Express handler in `api/index.js` (see `vercel.json`).

1. Connect the Git repository to [Vercel](https://vercel.com/) with the **repository root** as the project root (not `client` alone).
2. Set environment variables in the Vercel dashboard (Production and Preview as needed):

   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` — your live site URL(s), e.g. `https://your-app.vercel.app` (comma-separated for preview + production)

3. In **Atlas → Network Access**, allow access from the internet for serverless (often `0.0.0.0/0` for development; tighten for production if you use fixed egress IPs).

4. Run **`npm run seed`** locally (or any machine) with `MONGODB_URI` pointing at the **same** database so categories and products exist. Vercel does not run the seed on deploy.

5. Leave **`VITE_API_URL`** unset in production builds so the browser calls same-origin **`/api`**.

**Notes:**

- On Vercel, **Multer uploads** write under `/tmp` and are **not** durable across cold starts. Catalog images from `client/public` are part of the static build. For persistent admin uploads, use object storage (e.g. S3, Cloudinary, Vercel Blob).
- First request after idle may be slower while MongoDB connects; the server reuses the Mongoose connection when possible.

## Product catalog

- Seed definitions: `server/scripts/productsData.js`  
- Local image paths: `client/public/product-images/` (referenced as `/product-images/...` in the client)

## License

Private project unless you add an explicit license.
