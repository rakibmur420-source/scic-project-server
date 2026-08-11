# SCIC/EJP-13 Backend — E-commerce API

Production-ready REST API built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

## Live Links

| | |
|---|---|
| **Live API URL** | https://scic-project-server.onrender.com |
| **GitHub Repository** | https://github.com/rakibmur420-source/scic-project-server |
| **API Documentation** | [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) |
| **Frontend (live)** | https://scic-project-client.vercel.app/ |

> Note: hosted on Render's free tier, which sleeps after inactivity. The first request after idle time may take 30–50 seconds to respond while it wakes up.

## Test / Admin Credentials

| Field | Value |
|---|---|
| Email | `admin@example.com` |
| Password | `Admin@123` |
| Role | ADMIN |

Use these to log in and access `/admin/products` on the live frontend to add/remove products and categories.

## Tech Stack
- Express.js
- TypeScript
- PostgreSQL (hosted on NeonDB)
- Prisma ORM
- JWT Authentication
- bcrypt

## Features
- Modular architecture (routes / services / controllers separated)
- 6 modules: Auth, User, Category, Product, Review, Order
- 3 enums: `Role`, `OrderStatus`, `ProductStatus`
- Soft delete on every model (`isDeleted`)
- `createdAt` / `updatedAt` timestamps on every model
- `@@map()` table naming for all models
- Role-based JWT auth (`USER`, `ADMIN`)
- Transactional order placement (stock decrement + order creation atomically)
- Pagination, search, and filtering on list endpoints
- Consistent `{ success, message, data }` response format
- Centralized error handling (including Prisma error mapping)

## Local Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```
- `DATABASE_URL` — your PostgreSQL connection string (Supabase/NeonDB work great for free hosting)
- `JWT_SECRET` — any long random string
- `PORT` — defaults to 5000

### 3. Run migrations
```bash
npm run prisma:migrate
```

### 4. (Optional) Seed initial data
```bash
npx prisma db seed
```
Creates the admin user above plus a sample category + product.

### 5. Start the dev server
```bash
npm run dev
```
Server runs at `http://localhost:5000`.

## Build for production
```bash
npm install --include=dev
npm run build
npx prisma generate
npm start
```

> `--include=dev` is required if `NODE_ENV=production` is set at build time (e.g. on Render), since that otherwise skips devDependencies (TypeScript, `@types/*`) needed to compile.

## Project Structure
```
server/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── routes/
│   ├── services/          # one folder per module: user, category, product, review, order
│   │   └── <module>/
│   │       ├── <module>.service.ts
│   │       └── <module>.controller.ts
│   ├── middlewares/        # auth, error handler, 404 handler
│   ├── lib/                 # prisma client, ApiError, sendResponse, catchAsync
│   └── utils/                # jwt, hash helpers
├── .env.example
├── package.json
└── tsconfig.json
```

## Deployment (Render)
- Build command: `npm install --include=dev && npm run build && npx prisma generate`
- Start command: `npm start`
- Environment variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `NODE_ENV=production`
