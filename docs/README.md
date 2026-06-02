# RestroVerse - Documentation Hub

> The Operating System for Every Asian Restaurant
> **Status**: Pre-Development | **Target**: Nepal launch, Aug 2026

---

## 📁 Project Structure

```
restroverse/
│
├── 📋 CLAUDE.md                    ← AI session context (read this first on resume)
├── 📖 RESTROVERSE_PRODUCT_SPEC.md  ← Full product vision & spec
│
├── docs/
│   ├── 📖 README.md               ← YOU ARE HERE
│   │
│   ├── features/                   ← Feature specs by module (15 docs)
│   │   ├── 01-authentication-onboarding.md
│   │   ├── 02-order-management.md
│   │   ├── 03-menu-management.md
│   │   ├── 04-table-management.md
│   │   ├── 05-kitchen-kds.md
│   │   ├── 06-billing-payments.md
│   │   ├── 07-inventory-management.md
│   │   ├── 08-staff-management.md
│   │   ├── 09-offline-sync.md
│   │   ├── 10-customer-loyalty.md
│   │   ├── 11-online-ordering-delivery.md
│   │   ├── 12-analytics-ai.md
│   │   ├── 13-multi-location-franchise.md
│   │   ├── 14-notifications.md
│   │   └── 15-platform-nfr.md
│   │
│   ├── architecture/               ← Technical architecture
│   │   ├── DATABASE_AND_API.md     ← 50+ tables, 150 API endpoints, sync protocol
│   │   └── INFRASTRUCTURE_AND_AI.md← Infra, security, AI/ML pipeline
│   │
│   ├── requirements/               ← Formal requirements
│   │   └── FUNDAMENTAL_REQUIREMENTS.md ← 275 FR + 35 NFR + 18 constraints
│   │
│   └── wireframes/                 ← UI wireframes
│       └── ALL_WIREFRAMES.md       ← 17 screens, every tap annotated
│
├── project-tracking/               ← Project management (Obsidian vault)
│   ├── INDEX.md                    ← Wiki home
│   ├── TASK_BOARD.md               ← Jira-style: 16 epics, 34 stories, ~250 tasks
│   ├── FEATURE_MAP.md              ← All 275 features in one table
│   ├── SPRINT_CURRENT.md           ← Current sprint kanban
│   └── DECISIONS_LOG.md            ← Architecture Decision Records
│
├── architecture/                   ← (original location, kept for compat)
│   ├── DATABASE_AND_API.md
│   └── INFRASTRUCTURE_AND_AI.md
│
├── wireframes/
│   └── ALL_WIREFRAMES.md
│
├── design-system/                  ← (empty, to be built in Sprint 0)
├── prototype/                      ← (empty, to be built in Sprint 0)
└── .obsidian/                      ← Obsidian vault config
```

---

## 🗺️ Feature Modules at a Glance

| # | Module | Features | Phase 1 | Doc |
|---|--------|----------|---------|-----|
| 01 | 🔐 Authentication & Onboarding | 15 | 11 | [[features/01-authentication-onboarding]] |
| 02 | 📋 Order Management | 30 | 18 | [[features/02-order-management]] |
| 03 | 🍽️ Menu Management | 25 | 10 | [[features/03-menu-management]] |
| 04 | 🪑 Table & Space Management | 15 | 6 | [[features/04-table-management]] |
| 05 | 🍳 Kitchen & KDS | 15 | 7 | [[features/05-kitchen-kds]] |
| 06 | 💰 Billing & Payments | 30 | 18 | [[features/06-billing-payments]] |
| 07 | 📦 Inventory Management | 25 | 0 (P2) | [[features/07-inventory-management]] |
| 08 | 👥 Staff Management | 20 | 9 | [[features/08-staff-management]] |
| 09 | 📡 Offline-First & Sync | Core | Core | [[features/09-offline-sync]] |
| 10 | 🌟 Customer & Loyalty | 25 | 3 | [[features/10-customer-loyalty]] |
| 11 | 🛵 Online Ordering & Delivery | 25 | 2 | [[features/11-online-ordering-delivery]] |
| 12 | 📊 Analytics & AI | 25 | 4 | [[features/12-analytics-ai]] |
| 13 | 🏢 Multi-Location & Franchise | 15 | 0 (P4) | [[features/13-multi-location-franchise]] |
| 14 | 🔔 Notifications | 10 | 5 | [[features/14-notifications]] |
| 15 | ⚙️ Platform & NFRs | 35+18 | All | [[features/15-platform-nfr]] |
| | **TOTAL** | **275 + 53** | **~93 P1** | |

---

## 🚀 Phase Roadmap

| Phase | Name | Timeline | Features | Goal |
|-------|------|----------|----------|------|
| **P1** | Walk | Months 1-3 | ~80 core | 1,000 restaurants in Nepal |
| **P2** | Run | Months 4-6 | +60 | 5,000 restaurants, full management |
| **P3** | Fly | Months 7-9 | +50 (AI) | AI-powered, India launch |
| **P4** | Scale | Months 10-14 | +50 | Multi-location, aggregators, Bangladesh |
| **P5** | Own | Months 15-24 | +35 | Default restaurant OS for South Asia |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile/POS/KDS | React Native + Expo |
| Web Dashboard | Next.js 15 |
| Customer Web | Next.js (SSR) |
| Offline DB | WatermelonDB (SQLite) + CRDT |
| API | Node.js + Fastify |
| Primary DB | PostgreSQL 16 (RLS multi-tenant) |
| Cache | Redis |
| Analytics DB | ClickHouse |
| AI/ML | Python + FastAPI |
| Storage | MinIO (S3) |
| Queue | NATS |
| CI/CD | GitHub Actions |
| Infra | Docker → Kubernetes |

---

## 🧭 How to Navigate This Documentation

**Starting a new session?** → Read `CLAUDE.md` first
**Want the big picture?** → Read `RESTROVERSE_PRODUCT_SPEC.md`
**Working on a specific module?** → Go to `docs/features/XX-module-name.md`
**Need the database schema?** → `docs/architecture/DATABASE_AND_API.md`
**Looking at tasks?** → `project-tracking/TASK_BOARD.md`
**Checking current sprint?** → `project-tracking/SPRINT_CURRENT.md`
**UI reference?** → `docs/wireframes/ALL_WIREFRAMES.md`
