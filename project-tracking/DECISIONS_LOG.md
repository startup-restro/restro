# Architecture & Design Decisions Log

## ADR-001: Monorepo with Turborepo + pnpm
**Date**: 2026-06-02 | **Status**: Accepted
**Context**: Need shared types between API, mobile, web apps
**Decision**: Use Turborepo + pnpm workspaces
**Rationale**: Fast builds, shared deps, single CI pipeline

## ADR-002: Drizzle ORM over Prisma
**Date**: 2026-06-02 | **Status**: Proposed
**Context**: Need TypeScript ORM for PostgreSQL with migration support
**Decision**: Drizzle ORM
**Rationale**: Lighter weight, SQL-like syntax, better raw query escape hatch, smaller bundle for edge cases

## ADR-003: WatermelonDB for Offline-First
**Date**: 2026-06-02 | **Status**: Accepted (from product spec)
**Context**: Need SQLite-based local DB with sync capability in React Native
**Decision**: WatermelonDB with custom CRDT sync layer
**Rationale**: Battle-tested in RN, lazy loading, observable queries, good perf on low-end devices

## ADR-004: Fastify over Express
**Date**: 2026-06-02 | **Status**: Accepted (from product spec)
**Context**: Need high-performance Node.js API framework
**Decision**: Fastify
**Rationale**: 2-3x faster than Express, built-in schema validation, plugin architecture, TypeScript-first

## ADR-005: Modular Monolith
**Date**: 2026-06-02 | **Status**: Accepted (from product spec)
**Context**: Start simple, avoid microservices overhead
**Decision**: Well-structured monolith with module boundaries, split when >50K restaurants
**Rationale**: Faster development, simpler deployment, easier debugging. Module boundaries allow future extraction.
