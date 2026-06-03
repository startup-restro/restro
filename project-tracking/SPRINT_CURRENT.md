# Current Sprint: S2 - Orders, Tables, Kitchen

**Sprint**: 2 | **Start**: 2026-06-03 | **End**: 2026-06-17
**Goal**: Order CRUD API, Table management API, KDS/Kitchen API

## Sprint Backlog

### Done 🟢
- [x] RV-010: Order CRUD API (10 endpoints, 1,138 lines)
- [x] RV-018: Table & Space Management API (12 endpoints, 1,063 lines)
- [x] RV-012: Kitchen Display API (6 endpoints, 775 lines)
- [x] Swagger docs (47 endpoints across 6 tags at /docs)
- [x] DB package re-exports (all schema tables importable from @restroverse/db)

### In Progress 🟡
- [ ] Tests for Sprint 2 endpoints

### Ready 🔵
_(none)_

## Runtime Verified
- Full order lifecycle: create -> send-to-kitchen -> bump cooking -> bump ready -> serve -> complete
- Takeaway + dine-in orders with table occupation
- Kitchen stats: prep time tracking, on-time percentage, by-station breakdown
- Spaces (3) and tables (10) from seed data
- Swagger UI at /docs with all 47 endpoints

## Blockers
_(none)_

---

## Completed Sprint: S1 - Auth, RBAC, Menu ✅
- [x] RV-005: Phone OTP Authentication
- [x] RV-006: RBAC Permission System (24 perms, 6 roles)
- [x] RV-007: Restaurant Onboarding API
- [x] RV-008: Menu CRUD API

## Completed Sprint: S0 - Foundation ✅
- [x] RV-001: Monorepo Scaffold
- [x] RV-002: Docker Dev Environment
- [x] RV-003: CI/CD Pipeline
- [x] RV-004: Database Schema (39 tables, 102 RLS policies)
