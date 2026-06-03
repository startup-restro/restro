# RestroVerse - Master Task Board

> **Project Start**: June 2026 | **Phase 1 Target**: August 2026
> **Goal**: Replace paper billing for 1,000 restaurants in Nepal
> **Status Legend**: 🔴 Blocked | 🟡 In Progress | 🟢 Done | ⚪ Not Started | 🔵 Ready

---

## 📊 Dashboard

| Metric | Count |
|--------|-------|
| Total Epics | 10 |
| Total Stories | 68 |
| Total Subtasks | ~250 |
| Sprint Length | 2 weeks |
| Sprints in Phase 1 | 8 |

---

## EPIC 0: Project Foundation & Dev Environment
**Priority**: P0 - CRITICAL PATH | **Sprint**: 0 | **Estimate**: 1 week
**Owner**: Full Team | **Dependencies**: None

### RV-001: Monorepo Scaffold 🟢
> Set up turborepo/pnpm workspace with all apps and packages

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-001-1 | Initialize pnpm workspace + turborepo | P0 | 2h | ⚪ | - |
| RV-001-2 | Create `apps/api` - Fastify project with TypeScript | P0 | 2h | ⚪ | RV-001-1 |
| RV-001-3 | Create `apps/web` - Next.js 15 project | P0 | 1h | ⚪ | RV-001-1 |
| RV-001-4 | Create `apps/mobile` - React Native + Expo project | P0 | 2h | ⚪ | RV-001-1 |
| RV-001-5 | Create `packages/shared` - shared types/utils | P0 | 1h | ⚪ | RV-001-1 |
| RV-001-6 | Create `packages/db` - Drizzle ORM setup | P0 | 2h | ⚪ | RV-001-1 |
| RV-001-7 | Create `packages/ui` - shared component lib | P1 | 1h | ⚪ | RV-001-1 |
| RV-001-8 | Configure path aliases, shared tsconfig | P0 | 1h | ⚪ | RV-001-2 |
| RV-001-9 | Add ESLint + Prettier config (shared) | P0 | 1h | ⚪ | RV-001-1 |
| RV-001-10 | Add Husky pre-commit hooks | P1 | 30m | ⚪ | RV-001-9 |

**Acceptance Criteria**:
- [ ] `pnpm install` works from root
- [ ] `pnpm dev` starts all apps concurrently
- [ ] `pnpm build` builds all packages then apps
- [ ] `pnpm lint` + `pnpm typecheck` pass clean
- [ ] Shared types importable across apps

---

### RV-002: Docker Dev Environment 🟢
> One-command local dev setup with all services

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-002-1 | Create `docker-compose.dev.yml` (Postgres, Redis, MinIO, NATS) | P0 | 2h | ⚪ | - |
| RV-002-2 | Create `docker/init.sql` with enum types + base schema | P0 | 3h | ⚪ | RV-002-1 |
| RV-002-3 | Create `Dockerfile.api` (Node.js + hot reload) | P0 | 1h | ⚪ | RV-001-2 |
| RV-002-4 | Create `Dockerfile.web` (Next.js dev) | P1 | 1h | ⚪ | RV-001-3 |
| RV-002-5 | Add seed script with demo restaurant data | P0 | 2h | ⚪ | RV-002-2 |
| RV-002-6 | Create `.env.example` with all env vars | P0 | 30m | ⚪ | RV-002-1 |
| RV-002-7 | Write `scripts/setup.sh` (one-command bootstrap) | P0 | 1h | ⚪ | RV-002-5 |

**Acceptance Criteria**:
- [ ] `./scripts/setup.sh` → everything running in <3 minutes
- [ ] Postgres accessible with seed data loaded
- [ ] Redis, MinIO, NATS all healthy
- [ ] API connects to all services on startup

---

### RV-003: CI/CD Pipeline 🟢
> GitHub Actions for lint, test, build, deploy

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-003-1 | Create `.github/workflows/ci.yml` (lint + typecheck + test) | P0 | 2h | ⚪ | RV-001-9 |
| RV-003-2 | Create `.github/workflows/deploy.yml` (build + push images) | P1 | 2h | ⚪ | RV-003-1 |
| RV-003-3 | Set up GitHub branch protection rules | P1 | 30m | ⚪ | RV-003-1 |
| RV-003-4 | Add test infrastructure (Vitest for API, Jest for mobile) | P0 | 2h | ⚪ | RV-001-2 |

---

### RV-004: Database Schema & Migrations 🟢
> Implement full PostgreSQL schema with Drizzle ORM

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-004-1 | Define Drizzle schema: `restaurants` table + enums | P0 | 2h | ⚪ | RV-001-6 |
| RV-004-2 | Define Drizzle schema: `users` + `devices` tables | P0 | 2h | ⚪ | RV-004-1 |
| RV-004-3 | Define Drizzle schema: `menu_categories`, `menu_items`, `menu_variants`, `menu_modifiers` | P0 | 3h | ⚪ | RV-004-1 |
| RV-004-4 | Define Drizzle schema: `spaces`, `tables` | P0 | 1h | ⚪ | RV-004-1 |
| RV-004-5 | Define Drizzle schema: `orders`, `order_items`, `kitchen_tickets` | P0 | 3h | ⚪ | RV-004-3 |
| RV-004-6 | Define Drizzle schema: `bills`, `payments`, `khata_entries` | P0 | 3h | ⚪ | RV-004-5 |
| RV-004-7 | Define Drizzle schema: `customers`, `loyalty_transactions` | P1 | 2h | ⚪ | RV-004-1 |
| RV-004-8 | Define Drizzle schema: `inventory_items`, `stock_movements`, `recipes` | P1 | 3h | ⚪ | RV-004-3 |
| RV-004-9 | Define Drizzle schema: `suppliers`, `purchase_orders` | P1 | 2h | ⚪ | RV-004-8 |
| RV-004-10 | Define Drizzle schema: `shifts`, `attendance_records`, `salary_advances` | P1 | 2h | ⚪ | RV-004-2 |
| RV-004-11 | Define Drizzle schema: `delivery_zones`, `riders`, `delivery_orders` | P1 | 2h | ⚪ | RV-004-5 |
| RV-004-12 | Define Drizzle schema: `reservations` | P1 | 1h | ⚪ | RV-004-4 |
| RV-004-13 | Define Drizzle schema: `tax_configs`, `printer_configs`, `notification_templates` | P1 | 2h | ⚪ | RV-004-1 |
| RV-004-14 | Define Drizzle schema: `audit_log`, `sync_log` | P0 | 1h | ⚪ | RV-004-1 |
| RV-004-15 | Set up Row-Level Security policies | P0 | 3h | ⚪ | RV-004-14 |
| RV-004-16 | Create migration runner + initial migration | P0 | 2h | ⚪ | RV-004-6 |
| RV-004-17 | Create seed data: demo restaurant with full menu | P0 | 3h | ⚪ | RV-004-16 |

**Acceptance Criteria**:
- [ ] All 50+ tables created via Drizzle migration
- [ ] RLS policies enforce tenant isolation
- [ ] Seed script creates a complete demo restaurant
- [ ] All indexes match the architecture doc

---

## EPIC 1: Authentication & Authorization
**Priority**: P0 - CRITICAL PATH | **Sprint**: 1 | **Estimate**: 1 week
**Owner**: Backend | **Dependencies**: Epic 0

### RV-005: Phone OTP Authentication 🟢
> FR-001, FR-002, FR-008, FR-014

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-005-1 | `POST /auth/send-otp` - generate OTP, store in Redis (5min TTL), send SMS | P0 | 4h | ⚪ | RV-002-1 |
| RV-005-2 | SMS gateway integration (Sparrow SMS Nepal) | P0 | 3h | ⚪ | RV-005-1 |
| RV-005-3 | `POST /auth/verify-otp` - verify, find/create user, issue JWT + refresh | P0 | 4h | ⚪ | RV-005-1 |
| RV-005-4 | JWT middleware (validate token, inject user + restaurant context) | P0 | 3h | ⚪ | RV-005-3 |
| RV-005-5 | `POST /auth/refresh` - token rotation | P0 | 2h | ⚪ | RV-005-3 |
| RV-005-6 | `POST /auth/staff-pin` - PIN-based staff switch on shared device | P0 | 3h | ⚪ | RV-005-4 |
| RV-005-7 | `GET /auth/me` - current user + restaurant + permissions | P0 | 1h | ⚪ | RV-005-4 |
| RV-005-8 | `POST /auth/logout` - revoke refresh token | P0 | 1h | ⚪ | RV-005-5 |
| RV-005-9 | Rate limiting: max 5 OTP requests per phone per hour | P0 | 1h | ⚪ | RV-005-1 |
| RV-005-10 | Set `app.restaurant_id` on DB connection for RLS | P0 | 2h | ⚪ | RV-005-4 |

**Acceptance Criteria**:
- [ ] Full OTP flow works end-to-end
- [ ] JWT expires in 15 min, refresh in 30 days
- [ ] Staff PIN switch takes <2 seconds
- [ ] RLS context set correctly per request

---

### RV-006: RBAC Permission System 🟢
> FR-157, FR-158

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-006-1 | Define permission constants (all 40+ permissions from RBAC matrix) | P0 | 2h | ⚪ | RV-005-4 |
| RV-006-2 | Define default role -> permission mappings (owner/manager/cashier/waiter/kitchen/delivery) | P0 | 2h | ⚪ | RV-006-1 |
| RV-006-3 | Create `requirePermission()` middleware | P0 | 2h | ⚪ | RV-006-1 |
| RV-006-4 | Create `requireRole()` middleware | P0 | 1h | ⚪ | RV-006-2 |
| RV-006-5 | Support per-user permission overrides (from `users.permissions` JSONB) | P1 | 2h | ⚪ | RV-006-3 |
| RV-006-6 | Unit tests for all role/permission combinations | P0 | 3h | ⚪ | RV-006-5 |

---

### RV-007: Restaurant Onboarding 🟢
> FR-003, FR-010, FR-011

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-007-1 | `POST /restaurants` - create restaurant with auto tax config by country | P0 | 3h | ⚪ | RV-005-3 |
| RV-007-2 | `PUT /restaurants/:id` - update restaurant details | P0 | 1h | ⚪ | RV-007-1 |
| RV-007-3 | `PUT /restaurants/:id/settings` - update settings (service charge, round-off, etc) | P0 | 2h | ⚪ | RV-007-1 |
| RV-007-4 | Auto-configure tax rules by country (Nepal 13% VAT, India GST, etc) | P0 | 2h | ⚪ | RV-007-1 |
| RV-007-5 | Device registration on first login | P0 | 2h | ⚪ | RV-005-3 |

---

## EPIC 2: Menu Management
**Priority**: P0 - CRITICAL PATH | **Sprint**: 1-2 | **Estimate**: 1.5 weeks
**Owner**: Backend + Frontend | **Dependencies**: Epic 1

### RV-008: Menu CRUD API 🟢
> FR-046 to FR-049, FR-055, FR-063, FR-067

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-008-1 | Categories CRUD: `GET/POST/PUT/DELETE /menu/categories` | P0 | 3h | ⚪ | RV-006-3 |
| RV-008-2 | Items CRUD: `GET/POST/PUT/DELETE /menu/items` | P0 | 4h | ⚪ | RV-008-1 |
| RV-008-3 | Variants CRUD: `POST/PUT/DELETE /menu/items/:id/variants` | P0 | 2h | ⚪ | RV-008-2 |
| RV-008-4 | Modifiers CRUD: `GET/POST/PUT/DELETE /menu/modifiers` | P0 | 3h | ⚪ | RV-008-2 |
| RV-008-5 | Item-modifier linking: `POST /menu/items/:id/modifiers` | P0 | 1h | ⚪ | RV-008-4 |
| RV-008-6 | 86'd toggle: `POST /menu/items/:id/toggle-availability` | P0 | 1h | ⚪ | RV-008-2 |
| RV-008-7 | Item search: `GET /menu/items?search=` (<300ms) | P0 | 2h | ⚪ | RV-008-2 |
| RV-008-8 | Photo upload: `POST /menu/items/:id/photo` (MinIO) | P0 | 3h | ⚪ | RV-008-2 |
| RV-008-9 | Combo CRUD: `GET/POST/PUT/DELETE /menu/combos` | P1 | 3h | ⚪ | RV-008-2 |
| RV-008-10 | Public menu: `GET /menu/public/:restaurantSlug` (no auth) | P0 | 2h | ⚪ | RV-008-2 |
| RV-008-11 | Bulk price update | P1 | 2h | ⚪ | RV-008-2 |
| RV-008-12 | Unit tests for all menu endpoints | P0 | 3h | ⚪ | RV-008-10 |

---

### RV-009: Menu Management UI (Mobile) ⚪
> Wireframe Section 1 (menu grid on POS)

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-009-1 | Menu category sidebar component (icon + name, scrollable) | P0 | 3h | ⚪ | RV-008-1 |
| RV-009-2 | Menu item grid component (photo + name + price cards) | P0 | 4h | ⚪ | RV-008-2 |
| RV-009-3 | Item detail/modifier popup (variants, add-ons, spice, qty, notes) | P0 | 4h | ⚪ | RV-009-2 |
| RV-009-4 | Menu item search bar with instant results | P0 | 2h | ⚪ | RV-009-2 |
| RV-009-5 | Category management screen (add/edit/reorder/delete) | P0 | 3h | ⚪ | RV-009-1 |
| RV-009-6 | Item management screen (add/edit with photo upload) | P0 | 4h | ⚪ | RV-009-2 |
| RV-009-7 | 86'd toggle on item card | P0 | 1h | ⚪ | RV-009-2 |
| RV-009-8 | "Popular" badge rendering | P1 | 1h | ⚪ | RV-009-2 |

---

## EPIC 3: Order Management
**Priority**: P0 - CRITICAL PATH | **Sprint**: 2-3 | **Estimate**: 2 weeks
**Owner**: Backend + Frontend | **Dependencies**: Epic 2

### RV-010: Order CRUD API ⚪
> FR-016 to FR-044

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-010-1 | `POST /orders` - create order (dine-in/takeaway/delivery) with items | P0 | 4h | ⚪ | RV-008-2 |
| RV-010-2 | `GET /orders` - list with filters (status, type, date range, pagination) | P0 | 3h | ⚪ | RV-010-1 |
| RV-010-3 | `GET /orders/:id` - full order with items, bill | P0 | 2h | ⚪ | RV-010-1 |
| RV-010-4 | `GET /orders/running` - all active orders | P0 | 2h | ⚪ | RV-010-1 |
| RV-010-5 | `POST /orders/:id/items` - add items to existing order | P0 | 2h | ⚪ | RV-010-1 |
| RV-010-6 | `PUT /orders/:id/items/:itemId` - modify item (qty, modifiers, notes) | P0 | 2h | ⚪ | RV-010-5 |
| RV-010-7 | `DELETE /orders/:id/items/:itemId` - void item (with reason, manager auth) | P0 | 2h | ⚪ | RV-010-5 |
| RV-010-8 | `PUT /orders/:id/status` - update order status | P0 | 2h | ⚪ | RV-010-1 |
| RV-010-9 | `POST /orders/:id/send-to-kitchen` - create KOT, fire to KDS | P0 | 4h | ⚪ | RV-010-1 |
| RV-010-10 | `POST /orders/:id/transfer-table` - move order to different table | P0 | 2h | ⚪ | RV-010-1 |
| RV-010-11 | Auto order numbering (sequential per day, resets daily) | P0 | 1h | ⚪ | RV-010-1 |
| RV-010-12 | Order time tracking (created, sent_to_kitchen, ready, served, billed) | P0 | 1h | ⚪ | RV-010-1 |
| RV-010-13 | Sync ID + vector clock fields for offline support | P0 | 2h | ⚪ | RV-010-1 |
| RV-010-14 | Unit tests for order lifecycle | P0 | 4h | ⚪ | RV-010-13 |

---

### RV-011: POS Order-Taking UI (Mobile) ⚪
> Wireframe Section 1 - THE most critical screen

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-011-1 | POS main layout: 3-panel (categories | items | cart) | P0 | 4h | ⚪ | RV-009-2 |
| RV-011-2 | Current order/cart panel (items, qty, subtotal, tax, total) | P0 | 4h | ⚪ | RV-011-1 |
| RV-011-3 | One-tap add item to cart (with +1 animation) | P0 | 2h | ⚪ | RV-011-2 |
| RV-011-4 | Long-press modifier popup integration | P0 | 2h | ⚪ | RV-009-3 |
| RV-011-5 | Running orders bar (bottom) - switch between active orders | P0 | 3h | ⚪ | RV-011-2 |
| RV-011-6 | Order type selector (Dine-in/Takeaway/Delivery) | P0 | 2h | ⚪ | RV-011-1 |
| RV-011-7 | Table selector for dine-in orders | P0 | 2h | ⚪ | RV-011-6 |
| RV-011-8 | KOT button (send to kitchen without billing) | P0 | 2h | ⚪ | RV-011-2 |
| RV-011-9 | PAY button (navigate to billing) | P0 | 1h | ⚪ | RV-011-2 |
| RV-011-10 | Quick actions menu (transfer, hold, void, reprint KOT) | P0 | 3h | ⚪ | RV-011-2 |
| RV-011-11 | Order notes input (per order + per item) | P0 | 1h | ⚪ | RV-011-2 |
| RV-011-12 | Header bar (connection status, staff name, notifications) | P0 | 2h | ⚪ | RV-011-1 |
| RV-011-13 | Ensure 3-tap rule: category -> item -> KOT | P0 | 2h | ⚪ | RV-011-8 |

**Acceptance Criteria**:
- [ ] Order creation works in 3 taps (category -> item -> KOT)
- [ ] Cart updates live with tax calculation
- [ ] Multiple running orders switchable from bottom bar
- [ ] Works on 720p 10" Android tablet

---

## EPIC 4: Kitchen Display System (KDS)
**Priority**: P0 | **Sprint**: 3 | **Estimate**: 1 week
**Owner**: Backend + Frontend | **Dependencies**: Epic 3

### RV-012: Kitchen API ⚪
> FR-086 to FR-100

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-012-1 | `GET /kitchen/tickets?station=&status=` - list tickets | P0 | 2h | ⚪ | RV-010-9 |
| RV-012-2 | `PUT /kitchen/tickets/:id/status` - update ticket status | P0 | 2h | ⚪ | RV-012-1 |
| RV-012-3 | `PUT /kitchen/tickets/:id/bump` - advance to next status | P0 | 1h | ⚪ | RV-012-2 |
| RV-012-4 | `GET /kitchen/stats` - avg prep time, on-time %, active orders | P1 | 2h | ⚪ | RV-012-1 |
| RV-012-5 | Prep time tracking (auto-calculate from status transitions) | P0 | 2h | ⚪ | RV-012-2 |
| RV-012-6 | Station routing logic (items -> correct station based on category) | P1 | 2h | ⚪ | RV-012-1 |

---

### RV-013: KDS Screen UI (Mobile/Tablet) ⚪
> Wireframe Section 3

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-013-1 | KDS 4-column layout (New | Cooking | Ready | Done) | P0 | 4h | ⚪ | RV-012-1 |
| RV-013-2 | Ticket card component (order#, table, items, timer, modifiers) | P0 | 3h | ⚪ | RV-013-1 |
| RV-013-3 | Color-coded urgency timer (white < yellow < red) | P0 | 2h | ⚪ | RV-013-2 |
| RV-013-4 | One-tap bump buttons (START / READY / SERVED) | P0 | 2h | ⚪ | RV-013-2 |
| RV-013-5 | Special notes highlighting (allergy ⚠️, no-onion, extra spicy) | P0 | 1h | ⚪ | RV-013-2 |
| RV-013-6 | Delivery order priority badge (🛵) | P1 | 1h | ⚪ | RV-013-2 |
| RV-013-7 | Dark mode (default for kitchen) | P0 | 2h | ⚪ | RV-013-1 |
| RV-013-8 | Sound alerts (new order bell, overdue beep) | P0 | 2h | ⚪ | RV-013-1 |
| RV-013-9 | Station filter dropdown | P1 | 1h | ⚪ | RV-013-1 |
| RV-013-10 | Kitchen stats sidebar (avg time, on-time %, staff active) | P1 | 2h | ⚪ | RV-013-1 |
| RV-013-11 | Low stock warning display | P1 | 1h | ⚪ | RV-013-1 |
| RV-013-12 | 72px+ touch targets for greasy kitchen hands | P0 | 1h | ⚪ | RV-013-4 |

---

### RV-014: KOT Thermal Printing ⚪
> FR-086, FR-096

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-014-1 | Bluetooth thermal printer discovery + connection (React Native) | P0 | 4h | ⚪ | RV-010-9 |
| RV-014-2 | KOT print template (order#, table, items, modifiers, notes, time) | P0 | 3h | ⚪ | RV-014-1 |
| RV-014-3 | 58mm and 80mm paper width support | P0 | 2h | ⚪ | RV-014-2 |
| RV-014-4 | Auto-print on send-to-kitchen | P0 | 1h | ⚪ | RV-014-2 |
| RV-014-5 | Reprint KOT button | P0 | 1h | ⚪ | RV-014-2 |
| RV-014-6 | Printer configuration screen (name, type, connection, station) | P0 | 2h | ⚪ | RV-014-1 |

---

## EPIC 5: Billing & Payments
**Priority**: P0 - CRITICAL PATH | **Sprint**: 4 | **Estimate**: 1.5 weeks
**Owner**: Backend + Frontend | **Dependencies**: Epic 3

### RV-015: Billing API ⚪
> FR-101 to FR-130

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-015-1 | `POST /bills` - generate bill from order (auto tax, service charge, total) | P0 | 4h | ⚪ | RV-010-1 |
| RV-015-2 | Invoice number generator (sequential, prefix-configurable) | P0 | 2h | ⚪ | RV-015-1 |
| RV-015-3 | Tax calculation engine (Nepal VAT 13%, India GST 5/18%, BD VAT 5%) | P0 | 4h | ⚪ | RV-015-1 |
| RV-015-4 | `POST /bills/:id/payments` - record payment (support multi-payment) | P0 | 3h | ⚪ | RV-015-1 |
| RV-015-5 | Cash payment flow (received amount, change calculation) | P0 | 2h | ⚪ | RV-015-4 |
| RV-015-6 | `POST /bills/:id/void` - void bill (manager PIN, reason, audit) | P0 | 2h | ⚪ | RV-015-1 |
| RV-015-7 | `POST /bills/:id/discount` - apply discount (%, flat, coupon) | P0 | 3h | ⚪ | RV-015-1 |
| RV-015-8 | Discount authorization (role-based limits: cashier ≤10%, manager ≤30%) | P0 | 2h | ⚪ | RV-015-7 |
| RV-015-9 | Service charge toggle (configurable %, on/off per order) | P0 | 1h | ⚪ | RV-015-1 |
| RV-015-10 | Round-off logic (nearest 1/5/10, configurable) | P0 | 1h | ⚪ | RV-015-1 |
| RV-015-11 | `POST /bills/:id/split` - split bill (by item, equal, custom) | P0 | 4h | ⚪ | RV-015-1 |
| RV-015-12 | `POST /bills/:id/receipt` - send receipt (SMS/WhatsApp/email) | P1 | 3h | ⚪ | RV-015-1 |
| RV-015-13 | `GET /bills/daily-settlement` - EOD cash vs digital reconciliation | P0 | 3h | ⚪ | RV-015-4 |
| RV-015-14 | Nepal IRD-compliant invoice format | P0 | 3h | ⚪ | RV-015-2 |
| RV-015-15 | Unit tests for billing math (tax, discount, split, round-off) | P0 | 4h | ⚪ | RV-015-14 |

---

### RV-016: Payment Gateway Integration ⚪
> eSewa + Khalti for Nepal Phase 1

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-016-1 | Payment provider adapter interface (PaymentProvider) | P0 | 2h | ⚪ | RV-015-4 |
| RV-016-2 | eSewa payment integration (initiate, verify, refund) | P0 | 4h | ⚪ | RV-016-1 |
| RV-016-3 | Khalti payment integration (initiate, verify, refund) | P0 | 4h | ⚪ | RV-016-1 |
| RV-016-4 | Payment webhook handlers (callback URLs) | P0 | 3h | ⚪ | RV-016-2 |
| RV-016-5 | Payment status polling fallback (for unreliable webhooks) | P1 | 2h | ⚪ | RV-016-4 |
| RV-016-6 | Sandbox/test mode for development | P0 | 2h | ⚪ | RV-016-2 |

---

### RV-017: Billing & Checkout UI (Mobile) ⚪
> Wireframe Section 4

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-017-1 | Checkout screen layout (order summary | payment methods) | P0 | 4h | ⚪ | RV-015-1 |
| RV-017-2 | Payment method buttons (Cash, eSewa, Khalti, Card, Khata, Split) | P0 | 3h | ⚪ | RV-017-1 |
| RV-017-3 | Cash payment flow (denomination shortcuts, change calculation) | P0 | 2h | ⚪ | RV-017-2 |
| RV-017-4 | Discount quick buttons (10%, 20%, custom, coupon code input) | P0 | 2h | ⚪ | RV-017-1 |
| RV-017-5 | Bill summary (subtotal, discount, service charge, tax breakdown, total) | P0 | 2h | ⚪ | RV-017-1 |
| RV-017-6 | Split bill UI (by item drag, equal split, custom) | P0 | 4h | ⚪ | RV-017-1 |
| RV-017-7 | Customer lookup (phone number search, loyalty points display) | P1 | 2h | ⚪ | RV-017-1 |
| RV-017-8 | Receipt options (Print, SMS, WhatsApp, Email) | P0 | 2h | ⚪ | RV-017-1 |
| RV-017-9 | Receipt thermal print template (restaurant name, items, tax, total, footer) | P0 | 3h | ⚪ | RV-014-1 |
| RV-017-10 | Khata credit entry popup | P1 | 3h | ⚪ | RV-017-2 |

---

## EPIC 6: Table Management
**Priority**: P0 | **Sprint**: 3-4 | **Estimate**: 1 week
**Owner**: Backend + Frontend | **Dependencies**: Epic 3

### RV-018: Table Management API ⚪
> FR-071 to FR-085

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-018-1 | Spaces CRUD: `GET/POST/PUT/DELETE /spaces` | P0 | 2h | ⚪ | RV-006-3 |
| RV-018-2 | Tables CRUD: `GET/POST/PUT/DELETE /tables` | P0 | 3h | ⚪ | RV-018-1 |
| RV-018-3 | Table status update: `PUT /tables/:id/status` | P0 | 1h | ⚪ | RV-018-2 |
| RV-018-4 | Table merge: `POST /tables/merge` | P1 | 2h | ⚪ | RV-018-2 |
| RV-018-5 | Table split: `POST /tables/split` | P1 | 2h | ⚪ | RV-018-4 |
| RV-018-6 | Table transfer: `POST /tables/:id/transfer` | P0 | 2h | ⚪ | RV-018-2 |
| RV-018-7 | QR code generation per table | P0 | 2h | ⚪ | RV-018-2 |

---

### RV-019: Table Management UI (Mobile) ⚪
> Wireframe Section 2

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-019-1 | Visual floor plan with positioned tables | P0 | 6h | ⚪ | RV-018-2 |
| RV-019-2 | Color-coded table status (green/red/yellow/blue) | P0 | 2h | ⚪ | RV-019-1 |
| RV-019-3 | Table capacity display (3/4 guests) | P0 | 1h | ⚪ | RV-019-1 |
| RV-019-4 | Dwell time timer on occupied tables | P1 | 1h | ⚪ | RV-019-1 |
| RV-019-5 | Tap table -> open order | P0 | 2h | ⚪ | RV-019-1 |
| RV-019-6 | Long-press table -> action menu (view, bill, transfer, merge, clean) | P0 | 2h | ⚪ | RV-019-1 |
| RV-019-7 | Floor/space tabs (Ground Floor, First Floor, Outdoor) | P0 | 2h | ⚪ | RV-019-1 |
| RV-019-8 | Summary sidebar (total tables, free, busy, revenue) | P0 | 2h | ⚪ | RV-019-1 |
| RV-019-9 | Drag-and-drop table editor (for setup) | P1 | 4h | ⚪ | RV-019-1 |

---

## EPIC 7: Real-Time & WebSocket
**Priority**: P0 | **Sprint**: 3-4 | **Estimate**: 1 week
**Owner**: Backend | **Dependencies**: Epic 3

### RV-020: WebSocket Server ⚪
> Real-time updates across POS, KDS, Waiter apps

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-020-1 | Socket.io server setup on Fastify | P0 | 3h | ⚪ | RV-005-4 |
| RV-020-2 | JWT authentication for WebSocket connections | P0 | 2h | ⚪ | RV-020-1 |
| RV-020-3 | Restaurant-scoped rooms (each restaurant = own room) | P0 | 2h | ⚪ | RV-020-1 |
| RV-020-4 | Event: `order:created` - broadcast new order | P0 | 1h | ⚪ | RV-020-3 |
| RV-020-5 | Event: `order:updated` - broadcast order changes | P0 | 1h | ⚪ | RV-020-4 |
| RV-020-6 | Event: `kitchen:new_ticket` - new KOT | P0 | 1h | ⚪ | RV-020-3 |
| RV-020-7 | Event: `kitchen:status` - ticket status change | P0 | 1h | ⚪ | RV-020-6 |
| RV-020-8 | Event: `table:status` - table status change | P0 | 1h | ⚪ | RV-020-3 |
| RV-020-9 | Event: `bill:created`, `bill:paid` | P0 | 1h | ⚪ | RV-020-3 |
| RV-020-10 | Channel subscription: `subscribe({channels: ["kitchen","tables"]})` | P0 | 2h | ⚪ | RV-020-3 |
| RV-020-11 | Heartbeat/keepalive (30s interval) | P0 | 1h | ⚪ | RV-020-1 |
| RV-020-12 | NATS integration for multi-instance broadcasting | P1 | 3h | ⚪ | RV-020-3 |

---

## EPIC 8: Offline-First Sync Engine
**Priority**: P0 - CRITICAL PATH | **Sprint**: 5 | **Estimate**: 2 weeks
**Owner**: Full Team | **Dependencies**: Epics 3, 7

### RV-021: Local Database (WatermelonDB) ⚪
> Device-side offline storage

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-021-1 | WatermelonDB setup in React Native | P0 | 4h | ⚪ | RV-001-4 |
| RV-021-2 | Define local schema: restaurants (1 row) | P0 | 1h | ⚪ | RV-021-1 |
| RV-021-3 | Define local schema: menu_categories, menu_items, variants, modifiers | P0 | 3h | ⚪ | RV-021-1 |
| RV-021-4 | Define local schema: tables, spaces | P0 | 1h | ⚪ | RV-021-1 |
| RV-021-5 | Define local schema: orders, order_items, kitchen_tickets | P0 | 3h | ⚪ | RV-021-1 |
| RV-021-6 | Define local schema: bills, payments | P0 | 2h | ⚪ | RV-021-1 |
| RV-021-7 | Define local schema: customers (recently active) | P1 | 1h | ⚪ | RV-021-1 |
| RV-021-8 | Define local-only: sync_queue, sync_state, offline_payments | P0 | 2h | ⚪ | RV-021-1 |
| RV-021-9 | Storage budget enforcement (<500MB, auto-cleanup >30 days) | P0 | 2h | ⚪ | RV-021-1 |

---

### RV-022: Sync Protocol ⚪
> CRDT-based offline sync

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-022-1 | Sync message format (syncId, deviceId, changes[], vectorClock) | P0 | 3h | ⚪ | RV-021-8 |
| RV-022-2 | Change queue: capture all local mutations into sync_queue | P0 | 4h | ⚪ | RV-022-1 |
| RV-022-3 | Push sync: `POST /sync/push` - send queued changes to cloud | P0 | 4h | ⚪ | RV-022-2 |
| RV-022-4 | Pull sync: `GET /sync/pull?since=` - get changes from cloud | P0 | 4h | ⚪ | RV-022-3 |
| RV-022-5 | Conflict resolution: orders (add-only set for items, highest status wins) | P0 | 4h | ⚪ | RV-022-4 |
| RV-022-6 | Conflict resolution: stock levels (delta ops, not absolute) | P0 | 3h | ⚪ | RV-022-5 |
| RV-022-7 | Conflict resolution: table status (LWW with vector clock, occupied beats available) | P0 | 2h | ⚪ | RV-022-5 |
| RV-022-8 | Conflict resolution: bills (LWW for status, append-only payments) | P0 | 2h | ⚪ | RV-022-5 |
| RV-022-9 | Menu sync: cloud-authoritative, full replace on change | P0 | 2h | ⚪ | RV-022-4 |
| RV-022-10 | Auto-sync trigger (connectivity change detection) | P0 | 2h | ⚪ | RV-022-4 |
| RV-022-11 | Sync status indicator (online/syncing/offline) | P0 | 1h | ⚪ | RV-022-10 |
| RV-022-12 | Delta bandwidth optimization (<50KB per sync cycle) | P0 | 3h | ⚪ | RV-022-4 |
| RV-022-13 | Deduplication (sync_id based) | P0 | 2h | ⚪ | RV-022-3 |

---

### RV-023: Local WiFi Mesh Sync ⚪
> Device-to-device sync without internet

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-023-1 | mDNS service broadcasting (`_restroverse._tcp.local`) | P0 | 4h | ⚪ | RV-022-1 |
| RV-023-2 | Peer discovery (find other devices on same restaurant) | P0 | 3h | ⚪ | RV-023-1 |
| RV-023-3 | Leader election (most recent cloudSync = leader) | P0 | 3h | ⚪ | RV-023-2 |
| RV-023-4 | Local WebSocket server on leader (port 8765) | P0 | 3h | ⚪ | RV-023-3 |
| RV-023-5 | Peer WebSocket clients connecting to leader | P0 | 2h | ⚪ | RV-023-4 |
| RV-023-6 | Local change broadcast (device writes -> broadcast to all peers) | P0 | 3h | ⚪ | RV-023-5 |
| RV-023-7 | CRDT merge on peer receive | P0 | 3h | ⚪ | RV-023-6 |
| RV-023-8 | Cloud sync relay (device gets internet -> pushes to cloud -> relays to LAN) | P0 | 3h | ⚪ | RV-023-6 |
| RV-023-9 | Leader failover (if leader goes offline) | P0 | 2h | ⚪ | RV-023-3 |
| RV-023-10 | Integration test: 3 devices offline, take orders, reconnect, verify sync | P0 | 4h | ⚪ | RV-023-9 |

---

## EPIC 9: Basic Analytics & Reporting
**Priority**: P1 | **Sprint**: 6 | **Estimate**: 1 week
**Owner**: Backend + Frontend | **Dependencies**: Epic 5

### RV-024: Analytics API ⚪
> FR-226 to FR-233

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-024-1 | `GET /analytics/dashboard` - today's revenue, orders, avg order, food cost | P0 | 4h | ⚪ | RV-015-1 |
| RV-024-2 | `GET /analytics/sales?from=&to=&granularity=` - sales over time | P0 | 3h | ⚪ | RV-024-1 |
| RV-024-3 | `GET /analytics/items?from=&to=` - item-wise sales + profit | P1 | 3h | ⚪ | RV-024-1 |
| RV-024-4 | `GET /analytics/peak-hours` - orders by hour | P1 | 2h | ⚪ | RV-024-1 |
| RV-024-5 | `GET /analytics/payment-methods` - breakdown by payment type | P1 | 2h | ⚪ | RV-024-1 |
| RV-024-6 | Tax report (Nepal IRD format) | P0 | 3h | ⚪ | RV-024-2 |
| RV-024-7 | Report export (PDF, CSV) | P0 | 3h | ⚪ | RV-024-6 |

---

### RV-025: Owner Dashboard UI (Mobile) ⚪
> Wireframe Section 6

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-025-1 | Dashboard home screen (revenue card, orders, avg order, food cost) | P0 | 4h | ⚪ | RV-024-1 |
| RV-025-2 | Revenue trend chart (7-day bar chart) | P0 | 3h | ⚪ | RV-025-1 |
| RV-025-3 | Alerts section (low stock, overdue khata, staff issues) | P1 | 2h | ⚪ | RV-025-1 |
| RV-025-4 | Top sellers / poor sellers list | P1 | 2h | ⚪ | RV-025-1 |
| RV-025-5 | Daily sales report screen | P0 | 3h | ⚪ | RV-024-2 |
| RV-025-6 | Bottom tab navigation (Home, Reports, AI, Stock, Settings) | P0 | 2h | ⚪ | RV-025-1 |

---

## EPIC 10: QR Menu & Customer Web
**Priority**: P1 | **Sprint**: 7 | **Estimate**: 1 week
**Owner**: Frontend | **Dependencies**: Epic 2

### RV-026: QR Menu (View-Only, Phase 1) ⚪
> FR-053, Wireframe Section 5

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-026-1 | Customer-facing menu page: `GET /menu/public/:slug` (Next.js SSR) | P0 | 4h | ⚪ | RV-008-10 |
| RV-026-2 | Menu page UI: categories, items with photos, prices | P0 | 4h | ⚪ | RV-026-1 |
| RV-026-3 | Language toggle (auto-detect from browser, manual switch) | P1 | 2h | ⚪ | RV-026-2 |
| RV-026-4 | Dietary/allergen icons display | P1 | 1h | ⚪ | RV-026-2 |
| RV-026-5 | Mobile-responsive (375px phone width) | P0 | 2h | ⚪ | RV-026-2 |
| RV-026-6 | QR code generator (unique per table, printable) | P0 | 2h | ⚪ | RV-018-7 |
| RV-026-7 | Restaurant info header (name, rating, hours, location) | P0 | 1h | ⚪ | RV-026-1 |

---

## EPIC 11: Khata (Credit Book) System
**Priority**: P0 | **Sprint**: 4-5 | **Estimate**: 1 week
**Owner**: Backend + Frontend | **Dependencies**: Epic 5

### RV-027: Khata API ⚪
> FR-120 to FR-123

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-027-1 | `GET /khata` - list customers with balances, overdue filter | P0 | 2h | ⚪ | RV-015-1 |
| RV-027-2 | `GET /khata/:customerId` - ledger entries for customer | P0 | 2h | ⚪ | RV-027-1 |
| RV-027-3 | `POST /khata/entries` - add credit entry (bill -> khata) | P0 | 2h | ⚪ | RV-027-1 |
| RV-027-4 | `POST /khata/record-payment` - record payment against balance | P0 | 2h | ⚪ | RV-027-3 |
| RV-027-5 | Credit limit enforcement (warn at 80%, block at 100%) | P0 | 2h | ⚪ | RV-027-3 |
| RV-027-6 | `POST /khata/send-reminder` - WhatsApp reminder | P1 | 2h | ⚪ | RV-027-2 |
| RV-027-7 | `GET /khata/report` - total outstanding, collected, overdue | P0 | 2h | ⚪ | RV-027-1 |

---

### RV-028: Khata UI (Mobile) ⚪
> Wireframe Section 14

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-028-1 | Khata dashboard (active accounts, total outstanding, overdue, collected) | P0 | 3h | ⚪ | RV-027-1 |
| RV-028-2 | Customer list with balance, status color, last transaction | P0 | 2h | ⚪ | RV-028-1 |
| RV-028-3 | Customer khata detail (ledger with date, type, amount, running balance) | P0 | 3h | ⚪ | RV-028-2 |
| RV-028-4 | Record payment flow | P0 | 2h | ⚪ | RV-028-3 |
| RV-028-5 | Send WhatsApp reminder button | P1 | 1h | ⚪ | RV-028-3 |

---

## EPIC 12: Customer Management (Basic)
**Priority**: P1 | **Sprint**: 5-6 | **Estimate**: 0.5 weeks
**Owner**: Backend | **Dependencies**: Epic 5

### RV-029: Customer API ⚪
> FR-176, FR-177

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-029-1 | `GET/POST/PUT /customers` - CRUD | P0 | 3h | ⚪ | RV-006-3 |
| RV-029-2 | Phone-based auto-creation (on first order) | P0 | 2h | ⚪ | RV-029-1 |
| RV-029-3 | `GET /customers/:id` - profile with recent orders | P0 | 2h | ⚪ | RV-029-1 |
| RV-029-4 | `GET /customers/:id/history` - full order history | P1 | 2h | ⚪ | RV-029-3 |
| RV-029-5 | Customer search by name/phone | P0 | 1h | ⚪ | RV-029-1 |

---

## EPIC 13: Staff Management (Basic)
**Priority**: P1 | **Sprint**: 6 | **Estimate**: 0.5 weeks
**Owner**: Backend + Frontend | **Dependencies**: Epic 1

### RV-030: Staff API ⚪
> FR-156, FR-160, FR-161, FR-165

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-030-1 | `GET/POST/PUT /staff` - CRUD | P0 | 3h | ⚪ | RV-006-3 |
| RV-030-2 | `POST /staff/:id/clock-in`, `clock-out` | P0 | 2h | ⚪ | RV-030-1 |
| RV-030-3 | `GET /staff/attendance?from=&to=` | P0 | 2h | ⚪ | RV-030-2 |
| RV-030-4 | `POST /staff/:id/advance` - salary advance | P0 | 1h | ⚪ | RV-030-1 |
| RV-030-5 | `POST /staff/invite` - send SMS invite link | P1 | 2h | ⚪ | RV-030-1 |

---

## EPIC 14: Onboarding Flow UI
**Priority**: P0 | **Sprint**: 7 | **Estimate**: 1 week
**Owner**: Frontend | **Dependencies**: Epics 1, 2

### RV-031: Onboarding Screens (Mobile) ⚪
> Wireframe Section 15

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-031-1 | Welcome screen (country selection: Nepal/India/Bangladesh) | P0 | 2h | ⚪ | RV-001-4 |
| RV-031-2 | Phone number input + OTP screen | P0 | 3h | ⚪ | RV-005-1 |
| RV-031-3 | OTP verification screen (4-digit, countdown, resend) | P0 | 2h | ⚪ | RV-031-2 |
| RV-031-4 | Restaurant setup wizard (name, type, location, tables) | P0 | 3h | ⚪ | RV-007-1 |
| RV-031-5 | Menu setup chooser (Photo Import / Voice / Manual) | P0 | 2h | ⚪ | RV-031-4 |
| RV-031-6 | Manual menu add flow (add items one by one) | P0 | 3h | ⚪ | RV-031-5 |
| RV-031-7 | "You're ready!" confirmation screen | P0 | 1h | ⚪ | RV-031-6 |
| RV-031-8 | Progress indicator (Step X of 4) | P0 | 1h | ⚪ | RV-031-1 |
| RV-031-9 | <5 minute total onboarding time validation | P0 | 2h | ⚪ | RV-031-7 |

---

## EPIC 15: Design System
**Priority**: P0 | **Sprint**: 0-1 | **Estimate**: 1 week
**Owner**: Frontend | **Dependencies**: None

### RV-032: Core Design System ⚪
> Shared components for mobile + web

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-032-1 | Color palette (primary, accent, status colors, dark mode) | P0 | 2h | ⚪ | - |
| RV-032-2 | Typography scale (Devanagari + Latin support, 6 sizes) | P0 | 2h | ⚪ | RV-032-1 |
| RV-032-3 | Button component (primary, secondary, ghost, icon, sizes) | P0 | 2h | ⚪ | RV-032-1 |
| RV-032-4 | Input components (text, number, phone, PIN, search) | P0 | 3h | ⚪ | RV-032-1 |
| RV-032-5 | Card component (menu item card, order card, ticket card) | P0 | 2h | ⚪ | RV-032-1 |
| RV-032-6 | Status badges (available, occupied, reserved, cleaning, etc) | P0 | 1h | ⚪ | RV-032-1 |
| RV-032-7 | Modal/popup component | P0 | 2h | ⚪ | RV-032-1 |
| RV-032-8 | Toast/notification component | P0 | 2h | ⚪ | RV-032-1 |
| RV-032-9 | Navigation (bottom tabs mobile, sidebar tablet, sidebar web) | P0 | 3h | ⚪ | RV-032-1 |
| RV-032-10 | Icon set (POS-specific: momo, thali, kitchen, table, etc) | P0 | 2h | ⚪ | RV-032-1 |
| RV-032-11 | 48x48px minimum touch targets (72px for KDS) | P0 | 1h | ⚪ | RV-032-3 |
| RV-032-12 | WCAG AA color contrast compliance | P0 | 1h | ⚪ | RV-032-1 |
| RV-032-13 | Connection status indicator component | P0 | 1h | ⚪ | RV-032-6 |

---

## EPIC 16: Integration Testing & Pilot Prep
**Priority**: P0 | **Sprint**: 8 | **Estimate**: 1 week
**Owner**: Full Team | **Dependencies**: All above

### RV-033: End-to-End Testing ⚪

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-033-1 | E2E: Full order lifecycle (create -> KOT -> cook -> serve -> bill -> pay) | P0 | 4h | ⚪ | All |
| RV-033-2 | E2E: Offline order -> reconnect -> sync | P0 | 4h | ⚪ | RV-022 |
| RV-033-3 | E2E: Multi-device sync (POS + KDS + Waiter phone) | P0 | 4h | ⚪ | RV-023 |
| RV-033-4 | E2E: Payment flows (cash, eSewa, Khalti, split, khata) | P0 | 3h | ⚪ | RV-016 |
| RV-033-5 | E2E: Onboarding (signup -> restaurant setup -> first order) | P0 | 3h | ⚪ | RV-031 |
| RV-033-6 | Performance: POS screen load <1s on target hardware | P0 | 2h | ⚪ | RV-011 |
| RV-033-7 | Performance: Bill generation <500ms | P0 | 1h | ⚪ | RV-015 |
| RV-033-8 | Performance: Menu search <300ms | P0 | 1h | ⚪ | RV-008 |
| RV-033-9 | Performance: KDS update <500ms | P0 | 1h | ⚪ | RV-013 |
| RV-033-10 | Device testing on $80 Android tablet (2GB RAM, 720p) | P0 | 4h | ⚪ | All |

---

### RV-034: Nepal Pilot Preparation ⚪

| ID | Task | Priority | Est | Status | Depends |
|----|------|----------|-----|--------|---------|
| RV-034-1 | Nepal IRD billing compliance verification | P0 | 4h | ⚪ | RV-015-14 |
| RV-034-2 | eSewa/Khalti sandbox -> production credentials | P0 | 2h | ⚪ | RV-016-2 |
| RV-034-3 | Sparrow SMS production setup | P0 | 1h | ⚪ | RV-005-2 |
| RV-034-4 | Production infrastructure (DigitalOcean/AWS Mumbai) | P0 | 4h | ⚪ | RV-003-2 |
| RV-034-5 | Domain + SSL setup (restroverse.com) | P0 | 1h | ⚪ | RV-034-4 |
| RV-034-6 | Monitoring setup (Grafana + Prometheus) | P0 | 3h | ⚪ | RV-034-4 |
| RV-034-7 | Backup system (daily PostgreSQL dump to S3) | P0 | 2h | ⚪ | RV-034-4 |
| RV-034-8 | APK build + Play Store listing draft | P0 | 3h | ⚪ | RV-033-10 |
| RV-034-9 | Demo restaurant dataset (Nepali menu, realistic data) | P0 | 3h | ⚪ | RV-004-17 |
| RV-034-10 | User documentation / quick-start guide (Nepali + English) | P1 | 4h | ⚪ | All |

---

## 📅 Sprint Plan (Phase 1)

| Sprint | Dates | Epics | Key Deliverables |
|--------|-------|-------|------------------|
| **S0** | Week 1 | Epic 0, 15 | Monorepo, Docker, CI/CD, DB schema, design system |
| **S1** | Week 2-3 | Epic 1, 2 | Auth, RBAC, menu CRUD, menu UI |
| **S2** | Week 4-5 | Epic 3 | Orders API, POS main screen, order-taking flow |
| **S3** | Week 6-7 | Epic 4, 6, 7 | KDS, KOT printing, tables, WebSocket |
| **S4** | Week 8-9 | Epic 5, 11 | Billing, payments, tax, khata |
| **S5** | Week 10-11 | Epic 8 | Offline sync, CRDT, local WiFi mesh |
| **S6** | Week 12 | Epic 9, 12, 13 | Analytics dashboard, customers, staff |
| **S7** | Week 13 | Epic 10, 14 | QR menu, onboarding flow |
| **S8** | Week 14 | Epic 16 | E2E testing, pilot prep, Nepal launch |

---

## 📈 Velocity Tracking

| Sprint | Planned | Completed | Velocity | Notes |
|--------|---------|-----------|----------|-------|
| S0 | 4 stories | 4 | 4 | Foundation complete (monorepo, docker, CI, DB) |
| S1 | 4 stories | 4 | 4 | Auth, RBAC, menu, restaurants - runtime verified |
| S2 | - | - | - | |
| S3 | - | - | - | |
| S4 | - | - | - | |
| S5 | - | - | - | |
| S6 | - | - | - | |
| S7 | - | - | - | |
| S8 | - | - | - | |

---

## 🔑 Critical Path

```
Epic 0 (Foundation)
  └─> Epic 1 (Auth)
       └─> Epic 2 (Menu)
            └─> Epic 3 (Orders) ← MOST CRITICAL
                 ├─> Epic 4 (Kitchen/KDS)
                 ├─> Epic 5 (Billing) ← REVENUE CRITICAL
                 ├─> Epic 6 (Tables)
                 ├─> Epic 7 (WebSocket)
                 └─> Epic 8 (Offline Sync) ← DIFFERENTIATOR
                      └─> Epic 16 (Testing + Launch)
```

---

*Last updated: 2026-06-03*
*Total estimated effort: ~520 hours (14 weeks, 1 developer)*
*With 2 developers: ~8-9 weeks realistic*
