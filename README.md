# MS. E-Commerce

**MS.** is a fashion e-commerce web app: browse categories and products, search and filter the catalog, view product details and reviews, manage a cart and checkout, keep a wishlist, and sign in for an account dashboard and order history. Admins can manage catalog and orders. Product photos live in the repo under `client/public/product-images/`; catalog data is loaded from MongoDB (seeded from `server/scripts/productsData.js`).

## Technologies

| Area | Stack |
|------|--------|
| Frontend | React 19, TypeScript, Vite 8, React Router 7, Tailwind CSS, Axios, react-hot-toast |
| Backend | Node.js, Express 4, Mongoose 8 (MongoDB), JWT (jsonwebtoken), express-validator, Multer |
| Tooling | ESLint, PostCSS, npm |

## Folder structure

```
E-Commerce/
├── client/                 # React storefront (Vite)
│   ├── public/             # Static assets (e.g. product-images/)
│   └── src/                # Pages, components, contexts, API client
├── server/                 # Express API
│   ├── scripts/            # Seed script + catalog data
│   └── src/                # Routes, controllers, models, middleware
├── api/                    # Serverless entry for hosted deploys
├── package.json            # Root scripts (e.g. run client + server together)
└── vercel.json             # Hosting config (optional)
```

## How to run

**Prerequisites:** Node.js 20+, npm, and a running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas)).

1. **Configure the API** — Copy `server/.env.example` to `server/.env` and set at least `MONGODB_URI` and `JWT_SECRET`. For local dev, set `CLIENT_URL=http://localhost:5173`.

2. **Install dependencies** — In `server/` and `client/` (or only at repo root if you use the combined dev script below).

3. **Start the app** — You need **both** the API and the client:

   **Option A — one command from the repo root**

   ```bash
   npm install
   npm run dev
   ```

   This starts the server (port 5000) and Vite (port 5173) together.

   **Option B — two terminals**

   ```bash
   cd server && npm install && npm run dev
   ```

   ```bash
   cd client && npm install && npm run dev
   ```

4. Open **http://localhost:5173** in the browser. The Vite dev server proxies `/api` to the backend.

5. **Optional — load demo data** — With MongoDB reachable and `MONGODB_URI` set in `server/.env`:

   ```bash
   cd server && npm run seed
   ```

   This resets users, categories, and products and creates demo accounts (see `server/scripts/seed.js` for emails/passwords).
