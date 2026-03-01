# STORE - Premium E-Commerce Platform

A full-stack e-commerce platform built with **Next.js 16**, **TypeScript**, **Prisma**, **Stripe**, and **Tailwind CSS**. Designed as a production-ready showcase with a clean, minimal aesthetic featuring a beige-and-green color palette.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe)

---

## Features

### Storefront
- **Product browsing** with category filtering, search, and sorting
- **Product detail pages** with related product suggestions
- **Shopping cart** powered by Zustand with localStorage persistence
- **Stock enforcement** prevents adding more items than available and shows real-time notifications
- **Responsive design** optimized for desktop and mobile

### Authentication & Accounts
- Full customer **registration and login** (NextAuth.js v5, credentials provider)
- Role-based access control (**ADMIN** / **CUSTOMER**)
- **Order history** page for logged-in customers
- Protected routes via Next.js middleware

### Payments
- **Stripe Checkout** integration for secure payments
- Webhook-driven order creation and automatic **stock decrement**
- Shipping address collection at checkout
- Success/cancel flow with cart auto-clear

### Admin Dashboard
- Protected admin panel at `/admin`
- **Add, edit, and delete** products with a rich form
- **Image upload** (local file upload to `public/uploads/`) or external URL
- Manage product stock, categories, pricing, and featured status
- **Order management** with status updates

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions) |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 + shadcn/ui components |
| Database | SQLite via Prisma ORM 6 |
| Auth | NextAuth.js v5 (beta) with JWT strategy |
| Payments | Stripe Checkout + Webhooks |
| State | Zustand (cart) |
| Validation | Zod + React Hook Form |
| Icons | Lucide React |
| Notifications | Sonner (toast) |

---

## Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** 9+
- A **Stripe** account (free test mode works) [stripe.com](https://stripe.com)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/ecommerce-platform.git
cd ecommerce-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env

DATABASE_URL="file:./dev.db"


AUTH_SECRET="your-generated-secret"
AUTH_URL="http://localhost:3000"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."


NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Set up the database

Generate the Prisma client, push the schema to SQLite, and seed demo data:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

This creates the SQLite database at `prisma/dev.db` and seeds it with:

| Account | Email | Password | Role |
|---|---|---|---|
| Admin | `admin@example.com` | `admin123` | ADMIN |
| Customer | `jane@example.com` | `customer123` | CUSTOMER |

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Set up Stripe webhooks (for order processing)

To process payments locally, forward Stripe events to your local webhook endpoint:

```bash
# Install the Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the webhook signing secret (`whsec_...`) output by the CLI into your `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema (User, Product, Category, Order)
│   └── seed.ts                # Demo data seeder
├── public/
│   └── uploads/               # Locally uploaded product images
├── src/
│   ├── actions/               # Server Actions (auth, products)
│   ├── app/
│   │   ├── (auth)/            # Login & Register pages
│   │   ├── (shop)/            # Storefront (products, cart, checkout)
│   │   ├── (account)/         # Customer account & order history
│   │   ├── admin/             # Admin dashboard (products, orders)
│   │   └── api/               # API routes (checkout, webhook, upload, auth)
│   ├── components/            # Reusable UI components
│   │   └── ui/                # shadcn/ui primitives
│   ├── lib/                   # Shared utilities (prisma, auth, stripe, utils)
│   └── store/                 # Zustand cart store
├── .env.example               # Environment variable template
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |
| `npm run db:reset` | Reset database and re-seed |

---

## Purchase Flow

1. Customer browses products and adds items to cart (stock limits enforced)
2. Customer clicks **Checkout** the app creates a Stripe Checkout Session via `/api/checkout`
3. Customer completes payment on Stripe's hosted checkout page
4. Stripe fires a `checkout.session.completed` webhook to `/api/webhook`
5. The webhook handler creates an `Order` record, links `OrderItem` entries, and decrements product stock
6. Customer is redirected to the success page and their cart is cleared
7. Order appears in the customer's **Order History** (`/account/orders`)

---

## Deployment Notes

- **Database**: For production, swap SQLite for PostgreSQL by updating the Prisma datasource and `DATABASE_URL`.
- **Image uploads**: Local `public/uploads/` works for development. For production, use a cloud storage provider (S3, Cloudflare R2, etc.) and update the upload API route.
- **Stripe webhooks**: Configure your production webhook endpoint in the [Stripe Dashboard](https://dashboard.stripe.com/webhooks) pointing to `https://yourdomain.com/api/webhook`.
- **Environment**: Set all `.env` variables in your hosting provider's environment settings. Generate a strong `AUTH_SECRET` for production.

---

## License

MIT
