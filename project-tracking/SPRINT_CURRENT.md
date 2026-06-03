# Current Sprint: S2 - Orders & Tables

**Sprint**: 2 | **Start**: 2026-06-04 | **End**: 2026-06-17
**Goal**: Order CRUD API, Table management API, KDS/KOT API

## Sprint Backlog

### Ready 🔵
- [ ] RV-010: Order CRUD API (create, list, update, void, send-to-kitchen)
- [ ] RV-018: Table Management API (spaces/tables CRUD, status, merge/transfer)
- [ ] RV-012: Kitchen API (tickets, bump, prep time tracking)

### Done 🟢
_(none yet)_

## Blockers
_(none)_

## Notes
- Sprint 1 completed: full auth flow, RBAC, menu CRUD, restaurant onboarding - all runtime-tested
- Sprint 2 is backend API only (no frontend yet)
- WebSocket (RV-020) deferred to Sprint 3

---

## Completed Sprint: S1 - Auth, RBAC, Menu ✅
**Completed**: 2026-06-03

- [x] RV-005: Phone OTP Authentication (send-otp, verify-otp, refresh, staff-pin, me, logout)
- [x] RV-006: RBAC Permission System (24 permissions, 6 roles, middleware)
- [x] RV-007: Restaurant Onboarding API (create, update, settings, complete-onboarding)
- [x] RV-008: Menu CRUD API (categories, items, variants, modifiers, linking, public menu)

**Runtime verified**:
- ✅ Health check (`GET /health`)
- ✅ Full OTP flow (send -> verify -> tokens -> /auth/me -> logout)
- ✅ Token refresh
- ✅ Authenticated menu categories & items
- ✅ Restaurant GET/PUT
- ✅ Public menu by slug (6 categories, 20 items, variants)

---

## Completed Sprint: S0 - Foundation ✅
**Completed**: 2026-06-02

- [x] RV-001: Monorepo Scaffold (Turborepo + pnpm, 6 packages)
- [x] RV-002: Docker Dev Environment (Postgres 16, Redis, MinIO, NATS)
- [x] RV-003: CI/CD Pipeline (GitHub Actions: lint, typecheck, test, build)
- [x] RV-004: Database Schema (39 tables, 17 enums, 58 indexes, 102 RLS policies, seed data)
