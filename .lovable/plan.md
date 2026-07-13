## Goal
Turn the current single-page portfolio into a full multi-page website for Dosantoz Enterprises with client accounts, an order/booking system, online payments, and an admin dashboard.

## Route architecture (multi-page)
Split the current scroll page into real routes so each has its own SEO metadata and share preview:

```
/                     Home (hero + highlights + CTA)
/about                About + team
/portfolio            Full portfolio grid (all categories)
/portfolio/$category  Category detail (Club, Birthday, Church, Business, Special Day, Rollup, Brand Kit)
/services             Services detail
/pricing              Pricing tiers + "Order this package" buttons
/order                Order/booking form (project type, deadline, brief, references, budget)
/contact              Contact page
/auth                 Sign in / sign up (public)
/reset-password       Password recovery (public)
/_authenticated/dashboard         Customer dashboard (my orders, status, invoices, downloads)
/_authenticated/orders/$id        Order detail + messaging + file downloads
/_authenticated/admin             Admin overview
/_authenticated/admin/orders      Manage all orders (status, assign, upload deliverables)
/_authenticated/admin/portfolio   Manage portfolio items (add/edit/remove images per category)
/_authenticated/admin/pricing     Manage pricing tiers
/_authenticated/admin/testimonials Manage testimonials
```

Shared Nav/Footer stay; nav becomes real `<Link>` routes and shows Sign in / Account based on session.

## Backend (Lovable Cloud)
Enable Lovable Cloud, then create these tables (all with RLS + explicit GRANTs):

- `profiles` — id (fk auth.users), full_name, phone, avatar_url, created_at. Auto-created via trigger on signup.
- `user_roles` — separate table with enum `app_role` (`admin`, `customer`) + `has_role()` security-definer function (per the roles guideline; never store roles on profiles).
- `portfolio_categories` — slug, title, description, sort_order.
- `portfolio_items` — category_id, title, image_path, sort_order. Public read; admin write.
- `pricing_tiers` — name, price_kes, features (jsonb), sort_order, is_active. Public read; admin write.
- `testimonials` — name, role, quote, avatar_path, is_published. Public read of published; admin write.
- `orders` — id, user_id, tier_id (nullable), project_type, brief, deadline, budget_kes, status (`pending_payment` | `paid` | `in_progress` | `revision` | `delivered` | `cancelled`), amount_kes, payment_provider, payment_ref, created_at.
- `order_attachments` — order_id, storage_path, kind (`brief` | `deliverable`), uploaded_by.
- `order_messages` — order_id, sender_id, body, created_at (customer ↔ admin thread).

Storage buckets: `portfolio` (public read), `order-files` (private; RLS: owner + admin).

### Auth
- Email/password + Google sign-in (Lovable Cloud defaults).
- `/reset-password` page for recovery.
- Root `onAuthStateChange` listener + `router.invalidate()`.
- Protected subtree lives under `src/routes/_authenticated/` using the integration-managed gate.
- Admin subtree gated by an additional `_admin` layout that checks `has_role(uid, 'admin')`.

### Server functions
All app data access via `createServerFn` with `requireSupabaseAuth`:
- `createOrder`, `listMyOrders`, `getOrder`, `sendOrderMessage`, `uploadOrderFile`
- `startCheckout(orderId)` → returns provider checkout URL
- Admin: `listAllOrders`, `updateOrderStatus`, `uploadDeliverable`, portfolio/pricing/testimonial CRUD
Public read (portfolio, pricing, testimonials) via server publishable client + narrow `TO anon` SELECT policies.

### Payments
Run `recommend_payment_provider` first. Digital design services → likely **Stripe** with tax calculation & collection (Kenya seller = unsupported for full compliance handling). Flow:
1. Customer picks a tier or fills `/order`.
2. `createOrder` inserts an `orders` row with status `pending_payment`.
3. `startCheckout` creates a Stripe Checkout session; return URL sends them to `/dashboard/orders/$id`.
4. Public webhook route `/api/public/webhooks/stripe` verifies signature, flips status to `paid`, records `payment_ref`.

## Migration of existing content
- Move all currently hard-coded portfolio images, pricing tiers, testimonials, and about copy into the DB via a seed migration so the admin can edit them without code.
- Existing `src/assets/*.jpg` imports are replaced with rows in `portfolio_items` referencing the same asset URLs.
- Existing hero/about/services copy stays in code (rarely changes); only portfolio/pricing/testimonials become CMS-managed.

## Head metadata
Each new route gets its own `head()` with unique `title`, `description`, `og:title`, `og:description`. `og:image` set only at leaf routes (portfolio category pages use the category's first image). Root `head()` gets a real app-specific title/description (no more "Lovable App").

## Out of scope for this pass
- Realtime chat (order messages are polled, not realtime).
- Invoices as PDFs (Stripe receipt link is used instead).
- Multi-language / blog.

## Confirmations needed before build
1. Auth methods: Email/password **+ Google** (my default). OK, or add/remove?
2. Payment provider: I'll run the eligibility check; expected outcome is Stripe with tax calculation + collection only (Kenya seller). Confirm KES pricing stays as-is on Stripe (Stripe supports KES).
3. Admin user: I'll grant admin role to the first account whose email you tell me (or to `dosantozgfx@gmail.com` by default).
