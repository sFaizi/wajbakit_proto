<div align="center">

# 🍽️ wajbakit_proto

### Production-Ready MERN Stack — Modern Architecture

A clean, scalable, and fully modular full-stack application built with
**MongoDB**, **Express.js**, **React.js**, and **Node.js**.  
Designed with real-world patterns used in enterprise software.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express)](https://expressjs.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br />

[Live Demo](#) · [API Docs](#api-documentation) ·
[Getting Started](#-getting-started) · [Architecture](#-architecture-overview)

</div>

---

## ✨ Why This Project Stands Out

This isn't a tutorial CRUD app — it's **portfolio-grade production
architecture** that demonstrates:

- 🏗️ **Feature-based modular backend** with proper separation of concerns
- 🔐 **Enterprise auth flow** — JWT access + refresh tokens, HTTP-only cookies,
  role-based access
- ⚡ **Optimized data layer** — query builder with pagination, filtering,
  sorting & search
- 🐳 **One-command deployment** with Docker Compose
- 📖 **Auto-generated Swagger API docs**
- 🧩 **Scalable frontend** — Redux Toolkit, lazy-loaded routes, Axios
  interceptors with auto-refresh

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                    │
│                                                                 │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐   │
│  │  Pages  │→ │  Redux   │→ │ Services │→ │ Axios Instance │   │
│  │ (Lazy)  │  │  Toolkit │  │  (API)   │  │ + Interceptors │   │
│  └─────────┘  └──────────┘  └──────────┘  └───────┬────────┘   │
│       ↑            ↑                               │            │
│  ┌─────────┐  ┌──────────┐                         │            │
│  │  Hooks  │  │  Guards  │                         │            │
│  └─────────┘  └──────────┘                         │            │
└────────────────────────────────────────────────────┼────────────┘
                                                     │ HTTP/S
┌────────────────────────────────────────────────────┼────────────┐
│                     SERVER (Express + Node.js)      │            │
│                                                     ▼            │
│  ┌──────────┐  ┌────────────┐  ┌───────────────────────────┐   │
│  │  Helmet  │  │ Rate Limit │  │       API Router          │   │
│  │  CORS    │  │ Validation │  │  /auth /users /products   │   │
│  └──────────┘  └────────────┘  │  /orders                  │   │
│                                └─────────┬─────────────────┘   │
│                                          │                      │
│                              ┌───────────▼──────────────┐      │
│                              │     Module (per feature)  │      │
│                              │  ┌────────────────────┐   │      │
│                              │  │    Controller      │   │      │
│                              │  │        ↓           │   │      │
│                              │  │    Service         │   │      │
│                              │  │        ↓           │   │      │
│                              │  │    Model (Mongoose)│   │      │
│                              │  └────────────────────┘   │      │
│                              └───────────┬──────────────┘      │
│                                          │                      │
│  ┌───────────┐  ┌────────────┐  ┌───────▼───────┐             │
│  │  Winston  │  │ Cloudinary │  │   MongoDB     │             │
│  │  Logger   │  │  (Images)  │  │   (Atlas)     │             │
│  └───────────┘  └────────────┘  └───────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

```
User Action (Click/Submit)
        │
        ▼
  React Component ──→ dispatch(asyncThunk)
        │                    │
        │                    ▼
        │              Redux Slice ──→ API Service
        │                                  │
        │                                  ▼
        │                          Axios + Interceptors
        │                          (auto-attach JWT,
        │                           auto-refresh on 401)
        │                                  │
        │                                  ▼
        │                       ┌──── Express Server ────┐
        │                       │  Helmet → CORS → Rate  │
        │                       │  Limiter → Body Parse  │
        │                       │         │              │
        │                       │    Route → Validate    │
        │                       │         │              │
        │                       │   Controller → Service │
        │                       │         │              │
        │                       │   Mongoose → MongoDB   │
        │                       └────────────────────────┘
        │                                  │
        │                                  ▼
        │                       { success, message, data }
        │                                  │
        ▼                                  ▼
  UI Updates ◄──── Redux State ◄──── Fulfilled/Rejected
```

---

## 🛡️ Authentication Flow

```
┌──────────────────── SIGNUP / LOGIN ────────────────────┐
│                                                         │
│   Client                          Server                │
│     │                               │                   │
│     │──── POST /auth/signup ───────→│                   │
│     │     { name, email, password } │                   │
│     │                               │── Validate (Joi)  │
│     │                               │── Hash (bcrypt)   │
│     │                               │── Create User     │
│     │                               │── Generate JWT    │
│     │◄── { accessToken, user } ─────│                   │
│     │◄── Set-Cookie: refreshToken ──│ (HTTP-Only)       │
│     │                               │                   │
│ ┌───▼───┐                           │                   │
│ │ Store │ Save accessToken          │                   │
│ │ Redux │ in memory + localStorage  │                   │
│ └───────┘                           │                   │
└─────────────────────────────────────────────────────────┘

┌──────────────── TOKEN REFRESH (Automatic) ─────────────┐
│                                                         │
│   Axios Interceptor detects 401                         │
│     │                                                   │
│     │── POST /auth/refresh-token ──→ Server             │
│     │   (sends HTTP-only cookie)     │                  │
│     │                                │ Verify refresh   │
│     │                                │ Issue new pair   │
│     │◄── { new accessToken } ────────│                  │
│     │◄── Set-Cookie: new refresh ────│                  │
│     │                                                   │
│     │── Retry original request with new token           │
└─────────────────────────────────────────────────────────┘

┌──────────── ROLE-BASED ACCESS CONTROL ─────────────────┐
│                                                         │
│   Route Guard (Frontend)     │  Middleware (Backend)    │
│                              │                          │
│   <ProtectedRoute />         │  authenticate()          │
│     → Requires login         │    → Verify JWT          │
│                              │    → Attach req.user     │
│   <AdminRoute />             │                          │
│     → Requires role=admin    │  authorize('admin')      │
│                              │    → Check req.user.role │
│   <GuestRoute />             │                          │
│     → Redirect if logged in  │                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
wajbakit_proto/
├── docker-compose.yml                 # One-command full-stack deployment
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── scripts/
│   │   └── seed.js                    # Database seeder (12 products + admin)
│   ├── tests/
│   │   └── app.test.js                # Health check & 404 tests
│   └── src/
│       ├── server.js                  # Entry point — connects DB, starts server
│       ├── app.js                     # Express app — middlewares, routes, error handler
│       │
│       ├── config/
│       │   ├── index.js               # Environment config aggregator
│       │   ├── db.js                  # MongoDB connection (Mongoose)
│       │   ├── cloudinary.js          # Cloud image storage
│       │   └── swagger.js             # OpenAPI 3.0 spec
│       │
│       ├── middlewares/
│       │   ├── auth.js                # JWT authenticate + role authorize
│       │   ├── validate.js            # Joi schema validation
│       │   ├── upload.js              # Multer file upload (memory storage)
│       │   └── errorHandler.js        # Centralized error → JSON response
│       │
│       ├── utils/
│       │   ├── ApiError.js            # Custom error class with factory methods
│       │   ├── ApiResponse.js         # Standardized { success, message, data }
│       │   ├── asyncHandler.js        # try/catch wrapper for async routes
│       │   ├── QueryBuilder.js        # Pagination + filter + sort + search
│       │   ├── token.js               # JWT sign & verify helpers
│       │   ├── logger.js              # Winston (console + file transports)
│       │   └── email.js               # Nodemailer transporter
│       │
│       └── modules/                   # ← Feature-based modular architecture
│           ├── auth/                  #    Each module is self-contained:
│           │   ├── routes.js          #    Route definitions + Swagger docs
│           │   ├── controller.js      #    HTTP layer (req → res)
│           │   ├── service.js         #    Business logic
│           │   └── validation.js      #    Joi schemas
│           ├── user/
│           │   ├── model.js           #    Mongoose schema + methods
│           │   ├── routes.js
│           │   ├── controller.js
│           │   ├── service.js
│           │   └── validation.js
│           ├── product/
│           │   ├── model.js
│           │   ├── routes.js
│           │   ├── controller.js
│           │   ├── service.js
│           │   └── validation.js
│           └── order/
│               ├── model.js
│               ├── routes.js
│               ├── controller.js
│               ├── service.js
│               └── validation.js
│
└── frontend/
    ├── Dockerfile                     # Multi-stage: Node build → Nginx serve
    ├── nginx.conf                     # SPA routing + API reverse proxy
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx                   # React root + Redux Provider + Router
        ├── App.jsx                    # Layout shell + auto-fetch user
        ├── index.css                  # Tailwind directives
        │
        ├── app/
        │   └── store.js              # Redux Toolkit store configuration
        │
        ├── services/                  # API layer (decoupled from components)
        │   ├── api.js                 # Axios instance + interceptors + token refresh
        │   ├── authService.js         # /auth endpoints
        │   ├── productService.js      # /products endpoints
        │   └── orderService.js        # /orders endpoints
        │
        ├── features/                  # Redux slices (state + async thunks)
        │   ├── auth/authSlice.js
        │   ├── products/productSlice.js
        │   └── orders/orderSlice.js
        │
        ├── hooks/
        │   └── useAuth.js            # Auth state convenience hook
        │
        ├── routes/
        │   ├── AppRoutes.jsx          # Lazy-loaded route definitions
        │   └── Guards.jsx             # ProtectedRoute / AdminRoute / GuestRoute
        │
        ├── components/                # Reusable UI building blocks
        │   ├── Button.jsx
        │   ├── Input.jsx
        │   ├── Spinner.jsx
        │   ├── Navbar.jsx
        │   └── Pagination.jsx
        │
        └── pages/                     # Route-level page components
            ├── Home.jsx
            ├── Login.jsx
            ├── Signup.jsx
            ├── ProductList.jsx
            ├── ProductDetail.jsx
            ├── MyOrders.jsx
            ├── OrderDetail.jsx
            ├── NotFound.jsx
            └── admin/
                ├── Dashboard.jsx
                ├── Products.jsx
                └── Orders.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas))
- **npm** 9+

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/wajbakit_proto.git
cd wajbakit_proto

# Install backend
cd backend && npm install

# Install frontend
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and JWT secret
```

### 3. Seed Database

```bash
cd backend
node scripts/seed.js
# Creates admin user + 12 sample products
# Admin: admin@wajbakit_proto.com / admin123
```

### 4. Run Development

```bash
# Terminal 1 — Backend (port 3000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

### 5. Open in Browser

- **App:** http://localhost:5173
- **API Docs:** http://localhost:3000/api-docs

---

## 🐳 Docker Deployment

```bash
# From project root — spins up MongoDB, Backend, and Frontend
docker-compose up --build
```

| Service     | URL                            |
| ----------- | ------------------------------ |
| Frontend    | http://localhost               |
| Backend API | http://localhost:3000          |
| Swagger     | http://localhost:3000/api-docs |
| MongoDB     | localhost:27017                |

---

## 📗 API Documentation

Swagger UI is auto-generated from route annotations and available at
`/api-docs`.

### API Endpoints

| Method | Endpoint                        | Access | Description                              |
| ------ | ------------------------------- | ------ | ---------------------------------------- |
| POST   | `/api/v1/auth/signup`           | Public | Register new user                        |
| POST   | `/api/v1/auth/login`            | Public | Login & get tokens                       |
| POST   | `/api/v1/auth/refresh-token`    | Public | Refresh access token                     |
| POST   | `/api/v1/auth/logout`           | Auth   | Logout & clear tokens                    |
| GET    | `/api/v1/auth/me`               | Auth   | Get current user profile                 |
| GET    | `/api/v1/users`                 | Admin  | List all users                           |
| GET    | `/api/v1/users/:id`             | Admin  | Get user by ID                           |
| PUT    | `/api/v1/users/:id`             | Admin  | Update user                              |
| DELETE | `/api/v1/users/:id`             | Admin  | Delete user                              |
| PUT    | `/api/v1/users/change-password` | Auth   | Change own password                      |
| GET    | `/api/v1/products`              | Public | List products (search, filter, paginate) |
| GET    | `/api/v1/products/:id`          | Public | Get product details                      |
| POST   | `/api/v1/products`              | Admin  | Create product                           |
| PUT    | `/api/v1/products/:id`          | Admin  | Update product                           |
| DELETE | `/api/v1/products/:id`          | Admin  | Delete product                           |
| POST   | `/api/v1/products/:id/images`   | Admin  | Upload product images                    |
| GET    | `/api/v1/orders`                | Admin  | List all orders                          |
| GET    | `/api/v1/orders/my`             | Auth   | Get my orders                            |
| GET    | `/api/v1/orders/:id`            | Auth   | Get order details                        |
| POST   | `/api/v1/orders`                | Auth   | Place new order                          |
| PUT    | `/api/v1/orders/:id/status`     | Admin  | Update order status                      |

### Response Format

All API responses follow a consistent structure:

```json
{
  "success": true,
  "message": "Products fetched",
  "data": { ... },
  "error": null
}
```

### Query Parameters (Products)

```
GET /api/v1/products?page=1&limit=12&search=chicken&category=Main Course&sort=-price&fields=name,price
```

| Param        | Description                             |
| ------------ | --------------------------------------- |
| `page`       | Page number (default: 1)                |
| `limit`      | Items per page (default: 10, max: 100)  |
| `search`     | Keyword search across name, description |
| `sort`       | Sort fields (prefix `-` for descending) |
| `fields`     | Select specific fields to return        |
| `price[gte]` | Filter: price >= value                  |
| `category`   | Filter: exact category match            |

---

## 🔧 Tech Stack Details

### Backend

| Technology             | Purpose                             |
| ---------------------- | ----------------------------------- |
| **Express.js**         | Web framework & routing             |
| **Mongoose**           | MongoDB ODM & schema validation     |
| **JWT**                | Access + refresh token auth         |
| **bcrypt**             | Password hashing (12 rounds)        |
| **Joi**                | Request payload validation          |
| **Helmet**             | HTTP security headers               |
| **express-rate-limit** | Brute-force protection              |
| **Winston**            | Structured logging (file + console) |
| **Morgan**             | HTTP request logging                |
| **Multer**             | File upload handling                |
| **Cloudinary**         | Cloud image storage                 |
| **Nodemailer**         | Transactional emails                |
| **Swagger**            | Auto-generated API docs             |
| **Jest + Supertest**   | Integration testing                 |

### Frontend

| Technology          | Purpose                    |
| ------------------- | -------------------------- |
| **React 18**        | UI library                 |
| **Vite**            | Build tool & dev server    |
| **Redux Toolkit**   | Global state management    |
| **React Router v6** | Client-side routing        |
| **Axios**           | HTTP client + interceptors |
| **Tailwind CSS**    | Utility-first styling      |
| **React Hot Toast** | Toast notifications        |
| **React Icons**     | Icon library               |
| **Vitest + RTL**    | Component testing          |

---

## 🏛️ Design Patterns Used

| Pattern                 | Where                                  |
| ----------------------- | -------------------------------------- |
| **MVC**                 | Controller → Service → Model           |
| **Feature Modules**     | Self-contained `/modules/*`            |
| **Repository Pattern**  | QueryBuilder encapsulates DB queries   |
| **Factory Pattern**     | `ApiError.notFound()`, `.conflict()`   |
| **Middleware Chain**    | Auth → Validate → Controller           |
| **Singleton**           | Logger, DB connection, Axios instance  |
| **Observer (Redux)**    | Store → Slice → Component re-render    |
| **Lazy Loading**        | `React.lazy()` + Suspense for routes   |
| **Interceptor Pattern** | Axios request/response interceptors    |
| **Guard Pattern**       | ProtectedRoute, AdminRoute, GuestRoute |

---

## 🔒 Security Measures

- ✅ **Helmet** — 11+ HTTP security headers
- ✅ **Rate Limiting** — configurable per-window request caps
- ✅ **CORS** — whitelisted origins only
- ✅ **bcrypt** — salted password hashing (12 rounds)
- ✅ **JWT in HTTP-only cookies** — XSS-safe refresh tokens
- ✅ **Joi validation** — strict input sanitization on every endpoint
- ✅ **Parameterized queries** — Mongoose prevents NoSQL injection
- ✅ **Role-based access** — route-level `authorize('admin')` guards
- ✅ **Centralized error handler** — no stack traces leaked in production

---

## 📊 Performance Optimizations

- **MongoDB indexes** on frequently queried fields (email, category, price,
  timestamps)
- **Text indexes** for full-text product search
- **Gzip compression** on all responses
- **Lazy-loaded routes** — code-split per page
- **QueryBuilder** — single chainable API for paginate + filter + sort + search
- **Selective field projection** — return only needed fields via `?fields=`

---

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

---

## 📄 Environment Variables

| Variable         | Description                     | Default                 |
| ---------------- | ------------------------------- | ----------------------- |
| `PROJECT_NAME`   | Application name                | `wajbakit_proto`        |
| `PORT`           | Backend server port             | `3000`                  |
| `NODE_ENV`       | Environment mode                | `development`           |
| `MONGO_URI`      | MongoDB connection string       | —                       |
| `JWT_SECRET`     | JWT signing secret              | —                       |
| `JWT_EXPIRES_IN` | Access token expiry             | `30d`                   |
| `CORS_ORIGIN`    | Allowed frontend origin         | `http://localhost:5173` |
| `CLOUDINARY_*`   | Cloud image storage credentials | —                       |
| `SMTP_*`         | Email service credentials       | —                       |
| `RATE_LIMIT_MAX` | Max requests per window         | `100`                   |

---

## 🗺️ Roadmap

- [ ] Payment gateway integration (Stripe)
- [ ] Redis caching layer
- [ ] Real-time order tracking (Socket.io)
- [ ] Email verification & password reset
- [ ] Unit + E2E test coverage (Cypress)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] PWA support
