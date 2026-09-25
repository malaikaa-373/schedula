[# 🗓️ Schedula

**A multi-tenant SaaS platform for booking, calendar, and task management.**

Built with the MERN stack + Socket.io + Stripe.

> Think Calendly + Trello + a mini CRM — all in one platform.

---

## 📖 Overview

Schedula lets any business sign up, get their own isolated workspace, manage staff and services, and accept bookings from clients — either through their own dashboard or through an **embeddable widget** on their own website.

The platform is **multi-tenant from day one**: every business gets complete data isolation, and all queries are scoped by `businessId`.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT with **access + refresh token** rotation
- bcrypt password hashing with strength validation
- Role-Based Access Control (RBAC): Superadmin, Admin, Staff, Client
- Rate-limited public endpoints
- Webhook signature verification

### 🏢 Multi-Tenancy
- Data isolation per business (`businessId` scoping)
- Per-tenant staff, services, calendars, bookings
- Separate Super Admin dashboard for platform owner

### 📅 Booking Engine
- Dynamic slot generation based on staff availability
- Conflict prevention (double-booking check at DB level)
- Status workflow: `pending → confirmed → completed / cancelled / no-show`
- Reschedule and cancellation flows

### 🗓️ Calendar Views
- **Individual calendar** — per staff member
- **Team calendar** — overlay of multiple staff members
- Color-coded bookings per staff
- Click-to-view booking details modal
- Powered by **FullCalendar**

### 🔗 Embeddable Widget
- Admin generates a `<script>` snippet
- Visitor's website loads widget via iframe
- Public booking flow (no Schedula account required)
- Calendar designer for colors, logo, welcome text

### ⚡ Real-Time Layer (Socket.io)
- JWT authenticated socket connection
- Room-based broadcasting (`business:xyz`, `user:xyz`)
- Live events: `booking:created`, `booking:updated`, `booking:cancelled`, `task:assigned`
- In-app notifications + toast popups

### 📧 Reminders
- Cron job runs periodically
- Sends 24-hour and 1-hour reminders via email
- `reminderSent` flag prevents duplicate emails

### 💳 Payments & Subscriptions
- **Stripe Subscriptions** — Free / Pro / Business tiers
- **Booking payments** — deposit or full price
- Webhook handler with idempotency
- Subscription auto-upgrade via `checkout.session.completed`

### 📋 Task Management
- Kanban board: To Do / In Progress / Done
- Assign tasks to staff with priority + due date
- Real-time `task:assigned` notification

### 👑 Super Admin Dashboard
- List of all businesses (tenants)
- Suspend / reactivate business accounts
- Platform-wide analytics (MRR, total bookings, active businesses)

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 + Vite | UI + fast dev server |
| React Router v6 | Routing + protected routes |
| Zustand | Global UI state |
| TanStack Query | Server state (optional) |
| Axios | HTTP client with interceptors |
| React Hook Form + Zod | Forms + validation |
| Tailwind CSS | Styling |
| FullCalendar | Calendar rendering |
| Recharts | Analytics charts |
| Socket.io-client | Real-time events |
| Stripe.js + @stripe/react-stripe-js | Payments |
| react-hot-toast | Notifications |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | REST API |
| MongoDB + Mongoose | Database |
| JWT (jsonwebtoken) | Auth tokens |
| bcryptjs | Password hashing |
| Socket.io | Real-time server |
| Stripe | Payments + webhooks |
| node-cron | Scheduled jobs |
| Nodemailer | Emails |
| express-rate-limit | Rate limiting |
| Helmet + CORS | Security headers |

### Testing
| Tech | Purpose |
|------|---------|
| Jest + Supertest | Backend tests (7 tests) |
| Vitest + React Testing Library | Frontend tests (3 tests) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Stripe account (test mode)

### 1. Clone Repository
```bash
git clone https://github.com/malaikaa373/schedula.git
cd schedula
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in .env values (see Environment Variables section)
npm start
```

Server runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Fill in .env values
npm run dev
```

App runs on `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/schedula
ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🧪 Testing

### Backend (7 tests)
```bash
cd backend
npm test
```
Covers:
- ✅ Auth: weak password, invalid login, missing fields
- ✅ Booking: without auth, missing fields, double-booking prevention
- ✅ Webhook: endpoint exists

### Frontend (3 tests)
```bash
cd frontend
npm test
```
Covers:
- ✅ Login form renders
- ✅ Protected route blocks unauthenticated access
- ✅ Protected route allows authenticated access

---

## 📂 Project Structure

```
schedula/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Auth, RBAC, rate limiter
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── jobs/              # Cron jobs (reminders)
│   ├── utils/             # Helpers (timezone, mailer)
│   ├── tests/             # Jest + Supertest
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── widget.js      # Embeddable widget script
    └── src/
        ├── api/           # Axios instance
        ├── components/    # Reusable UI + modals
        ├── hooks/         # useSocket, useBookingEvents
        ├── pages/         # Route pages
        ├── store/         # Zustand stores
        ├── tests/         # Vitest + RTL
        └── App.jsx
```

---

## 🗄️ Database Collections

| Collection | Purpose |
|------------|---------|
| `businesses` | Tenant records + subscription |
| `users` | All users (superadmin, admin, staff, client) |
| `services` | Services offered per business |
| `calendars` | Embeddable calendar configs |
| `bookings` | All appointments |
| `tasks` | Internal team tasks |
| `notifications` | In-app notifications |

**Multi-tenancy rule:** Every collection (except `businesses`) has a `businessId` field, and every query filters by it.

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | _coming soon_ |
| Backend | Render | _coming soon_ |
| Database | MongoDB Atlas | - |

---

## 🔒 Security Highlights

- Passwords hashed with bcrypt (10 salt rounds)
- Access tokens short-lived (1 day)
- Refresh tokens in httpOnly cookies
- Rate limiting on all public endpoints
- Stripe webhook signature verification
- Raw body handling for webhooks
- CORS restricted to frontend origin
- Input validation with Zod on server
- RBAC enforced at middleware level

---

## 📌 Key Learnings / Architecture Decisions

- **Why MongoDB?** Flexible schemas per tenant + JSON-friendly
- **Why JWT + Refresh?** Short-lived access token + long-lived session
- **Why Socket.io Rooms?** Multi-tenant isolation for real-time events
- **Why Zustand over Redux?** Smaller, simpler, less boilerplate
- **Why React Query?** Separates server state from client state
- **Why iframe for widget?** CSS/JS isolation from host page

---

## 📝 License

MIT — free to use, learn from, and build upon.

---

## 👤 Author

**Malaika Ghaffar**
- GitHub: [@malaikaa373](https://github.com/malaikaa373)

---

## 🙏 Acknowledgements

Built as part of an internship project under the guidance of **Faraz Ahmad**.](https://github.com/malaikaa-373/schedula/blob/main/README.md)
