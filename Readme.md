# 🛍️ ShopApp — Full-Stack E-Commerce Application

A modern, fully responsive e-commerce web application built as Internship Task 1. Features user authentication, product browsing, cart management, order placement, an admin panel, and user profiles.

---

## 🧰 Tech Stack

**Frontend**
- React 18 + Vite
- Zustand (state management)
- React Router v6
- Axios (HTTP client)
- Plain CSS with CSS custom properties (theming)

**Backend**
- Node.js + Express.js
- PostgreSQL (database)
- Prisma v5 (ORM)
- JWT (authentication)
- bcrypt (password hashing)
- Multer (image uploads)

---

## ✨ Features

### Customer
- Register and login with JWT-based auth
- Browse products with pagination and min/max price filters
- View product detail page
- Add to cart, update quantity, remove items
- Place orders with real-time stock validation
- View order history
- User profile page (name, email, role, member since)

### Admin
- Admin-only panel (role-based access)
- Add, edit, and delete products
- Upload product images from device or paste image URL
- Product deletion blocked if it has existing orders
- Stock automatically decrements on order placement

### General
- Fully responsive (mobile + desktop)
- Navbar dropdown with Profile, Admin Panel (if admin), Logout
- Toast notification system (success, error)
- Protected routes for authenticated users
- Admin routes with role guard

---

## 📁 Project Structure

```
ecommerce-app/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── admin.js
│   │   └── routes/
│   │       ├── auth.js
│   │       ├── product.js
│   │       ├── cart.js
│   │       ├── order.js
│   │       └── upload.js
│   ├── uploads/              # Uploaded product images
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   ├── Toast/
│   │   │   ├── ProductCard/
│   │   │   ├── ProductFormModal/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── AdminRoute/
│   │   ├── pages/
│   │   │   ├── HomePage/
│   │   │   ├── LoginPage/
│   │   │   ├── RegisterPage/
│   │   │   ├── ProductsPage/
│   │   │   ├── ProductDetailPage/
│   │   │   ├── CartPage/
│   │   │   ├── OrdersPage/
│   │   │   ├── ProfilePage/
│   │   │   ├── AdminPage/
│   │   │   └── NotFoundPage/
│   │   ├── store/
│   │   │   ├── authStore.js
│   │   │   ├── cartStore.js
│   │   │   └── toastStore.js
│   │   ├── styles/
│   │   │   └── theme.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL running locally
- npm

---

### 1. Clone the repository

```bash
git clone https://github.com/raozohair43/CodeAlpha_E-commerce-store
cd ecommerce-app
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder using `.env.example` as reference:

```env
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/<DB_NAME>"
JWT_SECRET="<your_strong_random_secret>"
PORT=5000
```

> ⚠️ Never commit your real `.env` file to GitHub. It is listed in `.gitignore`.

Set up the database:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

### 4. Create an Admin User

Register a user normally via the app, then promote them to admin via psql:

```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List products (page, limit, minPrice, maxPrice) |
| GET | `/api/products/:id` | Public | Get single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product (blocked if has orders) |

### Cart
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/cart` | Auth | Get user cart |
| POST | `/api/cart` | Auth | Add item to cart |
| PUT | `/api/cart/:itemId` | Auth | Update item quantity |
| DELETE | `/api/cart/:itemId` | Auth | Remove item from cart |

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders` | Auth | Place order (validates stock, atomic) |
| GET | `/api/orders` | Auth | Get user orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| PUT | `/api/orders/:id/cancel` | Auth | Cancel pending order |

### Upload
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/upload` | Admin | Upload product image (max 5MB, jpeg/jpg/png/webp) |

---

## 🗺️ Frontend Routes

| Path | Component | Protection |
|------|-----------|------------|
| `/` | HomePage | Public |
| `/products` | ProductsPage | Public |
| `/products/:id` | ProductDetailPage | Public |
| `/cart` | CartPage | Auth required |
| `/orders` | OrdersPage | Auth required |
| `/profile` | ProfilePage | Auth required |
| `/login` | LoginPage | Guest only |
| `/register` | RegisterPage | Guest only |
| `/admin` | AdminPage | Admin only |
| `*` | NotFoundPage | Public |

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `PORT` | Backend server port (default: 5000) |

---

## 📦 Sample Products

To quickly populate the store with products, use images from [FakeStore API](https://fakestoreapi.com/products) — it provides free product data including names, descriptions, prices, and image URLs ready to paste into the Admin Panel.
