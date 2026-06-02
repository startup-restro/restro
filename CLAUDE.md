# RestroVerse - Session Context

## What is this project?
RestroVerse = "Operating System for Asian Restaurants" - offline-first, AI-native POS & restaurant management platform targeting Nepal, India, Bangladesh, SE Asia. Replaces paper billing for 11M+ restaurants. Runs on $80 Android tablets.

## Current State: PRE-DEVELOPMENT (Planning & Setup Complete)
- Product spec: DONE (1146 lines)
- DB schema: DONE (PostgreSQL, 50+ tables, copy-paste SQL)
- API design: DONE (~150 endpoints)
- Wireframes: DONE (17 screens)
- Requirements: DONE (275 FR + 35 NFR + 18 constraints)
- Infrastructure: DONE (Docker, K8s, CI/CD configs)
- AI pipeline: DONE (voice, OCR, forecasting, anomaly detection)
- Code: NOTHING WRITTEN YET - `prototype/` and `design-system/` dirs are empty

## Tech Stack
- Mobile/POS: React Native + Expo (Android tablet/phone)
- Web Dashboard: Next.js 15
- Customer Web: Next.js SSR
- Offline DB: WatermelonDB (SQLite) + CRDT
- API: Node.js + Fastify (modular monolith)
- DB: PostgreSQL 16 + Redis + ClickHouse (analytics)
- AI: Python + FastAPI (Whisper, Tesseract, Prophet, LightGBM)
- Storage: MinIO (S3-compatible)
- Queue: NATS
- Infra: Docker -> K8s, GitHub Actions CI/CD

## Phase 1 Target (Months 1-3): "WALK"
Replace paper billing for 1,000 restaurants in Nepal:
- Core POS (order -> kitchen -> bill)
- Offline-first with local WiFi sync
- Basic menu/table management
- KOT printing (thermal printer)
- Nepal IRD-compliant billing (13% VAT)
- eSewa + Khalti payment
- Cash management
- Basic daily sales report
- Android tablet app
- QR menu (view only)

## Documentation Map
```
docs/README.md                          ← Start here for full map
docs/features/01-15 *.md                ← 15 feature spec docs (275 features total)
docs/architecture/DATABASE_AND_API.md   ← 50+ tables, 150 endpoints
docs/architecture/INFRASTRUCTURE_AND_AI.md ← Infra, security, AI
docs/requirements/FUNDAMENTAL_REQUIREMENTS.md ← 275 FR + 35 NFR
docs/wireframes/ALL_WIREFRAMES.md       ← 17 screens
project-tracking/TASK_BOARD.md          ← Jira-style tasks (250+ subtasks)
project-tracking/FEATURE_MAP.md         ← All features in one table
project-tracking/SPRINT_CURRENT.md      ← Current sprint kanban
project-tracking/DECISIONS_LOG.md       ← ADRs
```

## Key Architecture Decisions
1. Offline-first with CRDT sync (SQLite local + PostgreSQL cloud)
2. Local WiFi mesh (mDNS + WebSocket) for multi-device sync without internet
3. Modular monolith (not microservices) initially
4. Multi-tenant with PostgreSQL Row-Level Security
5. Edge AI on-device (Whisper small ONNX ~150MB + Tesseract ~30MB)
6. Phone OTP auth (no email required)
7. Single APK for POS/Waiter/KDS (mode-switched)

## Development Phases (see project-tracking/ for detailed tasks)
- Sprint 0: Project scaffold, tooling, dev environment
- Sprint 1: Core data models + basic API + auth
- Sprint 2: POS UI + menu + order flow
- Sprint 3: Kitchen display + KOT printing
- Sprint 4: Billing + payments + tax
- Sprint 5: Offline sync engine + local WiFi mesh
- Sprint 6: Table management + basic analytics
- Sprint 7: QR menu + customer web
- Sprint 8: Integration testing + Nepal pilot prep

## File Structure (planned)
```
restroverse/
├── apps/
│   ├── api/          # Fastify backend (Node.js)
│   ├── web/          # Next.js owner dashboard
│   ├── mobile/       # React Native (POS/Waiter/KDS)
│   ├── ai/           # FastAPI AI service (Python)
│   └── customer-web/ # Next.js customer ordering
├── packages/
│   ├── shared/       # Shared types, utils, constants
│   ├── db/           # Drizzle ORM schema + migrations
│   └── ui/           # Shared UI components
├── docker/           # Dockerfiles
├── k8s/              # Kubernetes manifests
├── docs/             # Specs & requirements
├── architecture/     # Architecture docs
├── wireframes/       # UI wireframes
├── project-tracking/ # Obsidian-compatible task tracking
└── CLAUDE.md         # THIS FILE - AI session context
```
