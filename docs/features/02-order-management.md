# 📋 Order Management

> **Module**: Orders | **Total Features**: 30 | **Phase 1 Count**: 18
> **Core Principle**: 3-tap rule. One-tap add. Works 100% offline.

---

## Features

### P0 - Must Have (Phase 1 Launch)

**F-016: Dine-In Orders**
- Staff creates order by selecting table, then adding items
- Order linked to table, table status auto-updates to "occupied"

**F-017: Takeaway Orders**
- No table assignment needed
- Auto-numbered sequentially

**F-018: Delivery Orders**
- Requires customer address, phone, delivery zone
- Auto-calculates delivery fee based on zone

**F-021: One-Tap Add Item**
- Tap menu item = add to cart with qty 1
- +/- buttons for quantity adjustment
- Long press = modifier popup (spice, add-ons, notes)

**F-022: Variant Selection**
- Items with variants (steamed/fried, small/large) show picker before adding
- Default variant auto-selected

**F-023: Modifier Selection**
- Modifier popup: spice level, add-ons, extras
- Required modifiers must be selected before adding
- Optional modifiers are checkboxes

**F-024: Running Orders**
- Dine-in orders stay open
- Staff can add items to existing order at any time
- No need to create new order for same table

**F-026: Order & Item Notes**
- Per-order note: "birthday celebration", "corporate lunch"
- Per-item note: "no onion", "extra spicy", "allergic to peanuts"
- Notes visible on KDS and KOT print

**F-029: Transfer Order**
- Move order from one table to another
- Both tables update status automatically
- Common when groups move to bigger table

**F-031: Real-Time Multi-Device Sync**
- Staff adds item on one device → all other devices see it within 2 seconds
- Works via local WiFi (no internet needed) or cloud sync

**F-032: Order History**
- View all past orders
- Search by: date, table, order number, customer name, amount
- Pagination for large datasets

**F-033: Cancel Order**
- Manager+ permission required
- Must select cancellation reason
- Cancelled orders logged in audit trail, not deleted

**F-034: Void Individual Item**
- Manager+ permission required
- Voided items visible (struck-through) but excluded from bill
- Reason required, logged in audit

**F-036: Auto Order Numbering**
- Sequential per day: #1, #2, #3...
- Resets daily at midnight (configurable)

**F-039: Offline Order Queue**
- Orders created offline are queued in local SQLite
- When connectivity returns, auto-pushed to cloud
- Zero data loss guaranteed, even on app crash or power failure

**F-042: Order Time Tracking**
- Timestamps for: created, sent_to_kitchen, ready, served, billed
- Used for prep time analytics and SLA tracking

**F-043: Order Source Tracking**
- Each order tagged with channel: POS, QR scan, WhatsApp, web, aggregator name
- Used for channel analytics and commission tracking

### P1 - Should Have (Phase 2)

**F-019: Online Orders**
- Receive orders from branded website, WhatsApp bot, or aggregators
- Auto-created in POS with source tag

**F-025: Voice Ordering**
- Staff taps mic, speaks in Nepali/Hindi/English
- AI parses into structured items with quantities
- Confirmation screen before submission
- Works offline with Whisper small (ONNX)

**F-027: Priority Tags**
- Tags: Normal, Rush ⚡, VIP ⭐, Allergy Alert ⚠️
- Visible on KDS with color coding

**F-028: Hold Order**
- Pause an order (moves to "Held" section)
- Can be resumed later

**F-035: Order Batching**
- Kitchen view: batch by item across orders
- "All momos: Table 3 x2, Table 7 x4, Takeaway x2 = total 8 momos"

**F-037: Customer Link**
- Link order to customer profile by phone number
- Auto-lookup as phone number is entered
- Shows customer preferences and allergies

**F-040: Split Order**
- Split items from one order into two separate orders
- For groups wanting separate bills

**F-044: Guest Count**
- Record number of guests per dine-in order
- Used for per-head analysis

### P2 - Nice to Have (Phase 3+)

**F-020: Reservation Pre-Orders**
- Pre-order items linked to a reservation
- Order activates when customer is seated

**F-030: Duplicate Order**
- Copy all items from a previous order into new order
- Useful for repeat customers

**F-038: Multi-Channel Merge**
- Dine-in customer also orders delivery for home
- Both orders appear on same customer profile

**F-041: Reorder from History**
- Customer-facing: "Order again" showing last 5 orders

**F-045: Order Stale Alert**
- Notify staff if order has been "confirmed" for >5 min without KOT sent

---

## Order Flow
```
Customer arrives
     │
     ├── Dine-in ──→ Select table ──→ Add items ──→ Send KOT ──→ Kitchen
     │                                                              │
     ├── Takeaway ──→ Counter order ──→ Add items ──→ KOT ──→ Kitchen
     │                                                              │
     └── Delivery ──→ Customer info ──→ Add items ──→ KOT ──→ Kitchen
                                                                    │
                                                          ┌─────────▼──────────┐
                                                          │  COOK & SERVE      │
                                                          └─────────┬──────────┘
                                                                    │
                                                          ┌─────────▼──────────┐
                                                          │  BILL & PAY        │
                                                          └────────────────────┘
```

## Technical Notes
- Order status flow: `draft → confirmed → preparing → ready → served → completed`
- Cancellation wins in CRDT conflict resolution
- Sync fields: `sync_id` (client-generated UUID for dedup), `device_id`, `vector_clock` (JSONB)
- Order items are add-only set (CRDT); voids use `is_void` flag, never delete

## Related
- [[03-menu-management]] - Items come from menu
- [[05-kitchen-kds]] - KOT sends to kitchen
- [[06-billing-payments]] - Billing from completed orders
- [[09-offline-sync]] - Offline queue and CRDT
