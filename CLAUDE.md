# RestroVerse - Session Context

## What is this project?
RestroVerse = "Operating System for Asian Restaurants" - offline-first, AI-native POS & restaurant management platform targeting Nepal, India, Bangladesh, SE Asia. Replaces paper billing for 11M+ restaurants. Runs on $80 Android tablets.

## Current State: Sprint 1 COMPLETE, Sprint 2 READY

### Completed
- **Sprint 0** (Foundation): Turborepo monorepo, Docker dev env, GitHub Actions CI, full DB schema (39 tables, 102 RLS policies), seed data
- **Sprint 1** (Auth + Menu API): Phone OTP auth, RBAC (24 perms, 6 roles), restaurant onboarding, menu CRUD, public menu - all runtime-tested

### What exists (code)
```
apps/api/src/
├── index.ts, app.ts             # Fastify server entry + plugin registration
├── plugins/                     # db.ts (drizzle), redis.ts, jwt.ts
├── middleware/                   # auth.ts (JWT + RLS), rbac.ts (permissions)
├── routes/
│   ├── auth.ts                  # send-otp, verify-otp, refresh, staff-pin, me, logout
│   ├── restaurants.ts           # POST/GET/PUT restaurants, settings, complete-onboarding
│   └── menu.ts                  # categories/items/variants/modifiers CRUD, public menu
└── types/fastify.d.ts           # Type augmentations

packages/db/src/schema/          # 13 Drizzle schema files (~1,400 lines)
packages/shared/src/             # Types, constants, enums matching DB

docker/init.sql                  # 1,275 lines - 39 tables, 17 enums, 58 indexes
docker/seed.sql                  # "Momo House Thamel" - 20 items, 10 tables, 5 staff
```

### Runtime-verified endpoints
- `GET /health` - OK
- `POST /auth/send-otp` -> `POST /auth/verify-otp` -> tokens + user
- `GET /auth/me` - user, restaurant, 24 permissions
- `POST /auth/refresh` - token rotation
- `POST /auth/logout` - revokes refresh token
- `GET /restaurants/:id` / `PUT /restaurants/:id` - CRUD
- `GET /menu/categories` - 6 categories
- `GET /menu/items` - paginated items
- `GET /menu/public/:slug` - public menu (6 cats, 20 items, variants)

### Next: Sprint 2
- RV-010: Order CRUD API (create, list, update, void, send-to-kitchen)
- RV-018: Table Management API (spaces/tables CRUD, status, merge/transfer)
- RV-012: Kitchen API (tickets, bump, prep time tracking)

## Tech Stack
- Mobile/POS: React Native + Expo (Android tablet/phone)
- Web Dashboard: Next.js 15
- API: Fastify + Drizzle ORM + PostgreSQL 16
- Cache: Redis 7 (OTP, sessions, rate limiting)
- Storage: MinIO (S3-compatible)
- Queue: NATS 2.10
- Offline DB: WatermelonDB (future Sprint 5)
- Monorepo: Turborepo + pnpm

## Docker Services (docker-compose.dev.yml)
| Service | Container | Port |
|---------|-----------|------|
| PostgreSQL 16 | rv-postgres | 5432 |
| Redis 7 | rv-redis | 6379 |
| MinIO | rv-minio | 9000/9001 |
| NATS 2.10 | rv-nats | 4222/8222 |

## Key Architecture Decisions
1. Offline-first with CRDT sync (SQLite local + PostgreSQL cloud)
2. Local WiFi mesh (mDNS + WebSocket) for multi-device sync without internet
3. Modular monolith (not microservices) initially
4. Multi-tenant with PostgreSQL Row-Level Security
5. Phone OTP auth (no email required)
6. Single APK for POS/Waiter/KDS (mode-switched)

## Documentation Map
```
docs/README.md                          <- Start here for full map
docs/features/01-15 *.md                <- 15 feature spec docs
docs/architecture/DATABASE_AND_API.md   <- 50+ tables, 150 endpoints
docs/requirements/FUNDAMENTAL_REQUIREMENTS.md <- 275 FR + 35 NFR
docs/wireframes/ALL_WIREFRAMES.md       <- 17 screens
project-tracking/TASK_BOARD.md          <- Jira-style tasks (250+ subtasks)
project-tracking/SPRINT_CURRENT.md      <- Current sprint kanban
```

## Commands
```bash
pnpm typecheck          # 8/8 tasks pass
pnpm build              # all tasks pass
pnpm dev                # start all apps
./scripts/setup.sh      # bootstrap Docker + DB + seed
./scripts/teardown.sh   # stop everything
cd apps/api && npx tsx src/index.ts  # start API on :3001
```
