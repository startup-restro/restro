# 📡 Offline-First & Sync Engine

> **Module**: Sync | **Total Features**: Core platform capability
> **Core Principle**: Restaurant runs ALL DAY offline. Zero data loss. Local WiFi mesh.

---

## This is RestroVerse's unfair advantage.

Every global POS assumes stable internet. We assume the opposite.

---

## Capabilities

### Offline-First Operations (100% functional without internet)
- ✅ Create/edit/cancel orders
- ✅ Send KOT to kitchen (via local WiFi)
- ✅ KDS display and status updates
- ✅ Bill generation and calculation
- ✅ Cash payments
- ✅ Print receipts
- ✅ Table status updates
- ✅ Menu browsing (cached)
- ✅ Customer lookup (recently active, cached)
- ✅ Stock level checks (cached)

### CRDT Sync Protocol
- Orders: add-only set for items, highest status wins
- Stock levels: delta operations (never absolute values)
- Table status: last-writer-wins with vector clock; "occupied" beats "available"
- Bills: LWW for status, append-only for payments
- Menu: cloud-authoritative, full replace on device

### Local WiFi Mesh (No Internet Needed)
- All devices sync over local WiFi network
- mDNS discovery: `_restroverse._tcp.local`
- Leader election: device with most recent cloud sync
- Leader acts as local "mini-cloud" for other devices
- If leader goes offline, next device becomes leader
- Kitchen sees orders instantly even without internet

### Cloud Sync (When Internet Available)
- Auto-sync within 5 seconds of connectivity
- Delta sync: <50KB per cycle (works on 2G)
- Deduplication via sync_id
- Conflict resolution: CRDT merge, never data loss

### Battery Awareness
- At <15% battery: activate battery-save mode
- Dim screen, reduce animations, pause background sync
- Auto-save state continuously
- Resume to exact same state after crash/power cut (<3 seconds)

---

## Sync Data Flow
```
Device writes order → Local SQLite
       │
       ├──→ Broadcast to LAN peers (WebSocket on port 8765)
       │         │
       │         └── Peers apply CRDT merge to their local DB
       │
       └──→ Queue in sync_queue table
                │
                └── When internet available:
                         │
                         ├── Push changes to cloud (POST /sync/push)
                         │
                         └── Pull cloud changes (GET /sync/pull?since=)
                                  │
                                  └── Broadcast cloud changes to LAN peers
```

## Related
- [[02-order-management]] - Orders are the primary synced entity
- [[05-kitchen-kds]] - KDS depends on local sync
- [[06-billing-payments]] - Payment sync is append-only
