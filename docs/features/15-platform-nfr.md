# ⚙️ Platform & Non-Functional Requirements

> **35 NFRs + 18 Constraints**
> **Core Principle**: Works on $80 hardware, survives power cuts, handles 2G internet.

---

## Performance

| Requirement | Target | Priority |
|-------------|--------|----------|
| API response time (p95) | <200ms | P0 |
| POS screen load (menu + active orders) | <1 second | P0 |
| Bill generation + calculation | <500ms | P0 |
| Menu/customer/order search | <300ms | P0 |
| KDS new order appearance | <500ms | P0 |

## Offline-First

| Requirement | Target | Priority |
|-------------|--------|----------|
| Offline core ops (orders, KOT, billing) | 100% functional | P0 |
| Offline data persistence | Zero data loss (crash/power-safe) | P0 |
| Auto-sync on reconnect | Within 5 seconds | P0 |
| CRDT conflict resolution | No data loss, deterministic merge | P0 |
| Delta sync bandwidth | <50KB per cycle (2G capable) | P0 |

## Scale Targets

| Requirement | Target | Priority |
|-------------|--------|----------|
| Concurrent restaurants | 100,000+ | P0 |
| Concurrent users | 1,000,000 | P0 |
| Peak order throughput | 10,000 orders/sec | P1 |
| Cloud availability | 99.9% (8.7h downtime/year) | P0 |
| Local/offline availability | 99.99% (52min downtime/year) | P0 |

## Security

| Requirement | Target | Priority |
|-------------|--------|----------|
| Encryption at rest | AES-256 | P0 |
| Encryption in transit | TLS 1.3 | P0 |
| Multi-tenant isolation | PostgreSQL Row-Level Security | P0 |
| JWT token expiry | 15 minutes (refresh: 30 days with rotation) | P0 |
| Audit trail | Immutable, append-only, 7-year retention | P0 |

## Accessibility & Hardware

| Requirement | Target | Priority |
|-------------|--------|----------|
| Minimum hardware | Android 10+, 2GB RAM, 720p display ($80 tablet) | P0 |
| App size | <100MB APK | P0 |
| Local storage budget | <500MB per device (auto-cleanup) | P0 |
| Battery-save mode | Activate at <15% (dim, pause sync) | P0 |
| Instant resume after crash | <3 seconds to exact same state | P0 |
| Touch targets | 48x48px min (72x72px on KDS) | P0 |
| Color contrast | WCAG AA (4.5:1 normal, 3:1 large) | P0 |
| Language/script support | 12+ languages, Devanagari + Bengali + Latin | P0 |
| Currency support | NPR, INR, BDT, LKR, USD | P0 |
| Thermal printer support | Bluetooth + USB, 58mm + 80mm widths | P0 |

## Operations

| Requirement | Target | Priority |
|-------------|--------|----------|
| Onboarding speed | Signup to first order <5 minutes | P0 |
| 3-tap rule | Any common action in ≤3 taps | P0 |
| Data retention | 7 years financial, 2 years operational | P0 |
| Backup RPO | 1 hour (continuous WAL archiving) | P0 |
| Backup RTO | 4 hours | P0 |
| Zero-downtime deploys | Rolling updates, no service interruption | P0 |

---

## Hardware Constraints

| # | Constraint | Why |
|---|-----------|-----|
| C-01 | Must run on $80 Android 10+ tablet (2GB RAM, 720p) | Target market affordability |
| C-02 | Must handle 5-15 internet disconnections per day | Unreliable Asian infrastructure |
| C-03 | Must survive power outages with instant resume | Common power cuts |
| C-04 | Nepal IRD e-billing compliance | Legal |
| C-05 | India GST invoicing compliance | Legal |
| C-06 | Bangladesh VAT compliance | Legal |
| C-07 | Local payment gateways per country | User expectation |
| C-08 | Max 3 taps for any common POS action | Low-literacy staff, speed |
| C-09 | Onboarding <5 minutes | Competitive advantage |
| C-10 | Devanagari, Bengali, Latin script support | Core market languages |
| C-11 | Phone-first auth (no email) | Owners don't use email |
| C-12 | Monthly cost < one customer's avg order | Affordability |
| C-13 | Works with $25 Bluetooth thermal printers | Hardware cost |
| C-14 | Cash-heavy workflow support (60-80% cash) | Market reality |
| C-15 | Single APK for POS/Waiter/KDS (mode-switched) | Simple distribution |
| C-16 | No proprietary hardware dependency | Any Android device |
| C-17 | Local WiFi sync without internet | Critical for offline multi-device |
| C-18 | Festival calendar (Dashain, Diwali, Eid, etc) | Business-critical |

## Related
- [[09-offline-sync]] - Offline architecture details
- [[../architecture/INFRASTRUCTURE_AND_AI]] - Full infrastructure spec
