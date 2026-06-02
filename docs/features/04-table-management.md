# 🪑 Table & Space Management

> **Module**: Tables | **Total Features**: 15 | **Phase 1 Count**: 6
> **Core Principle**: Visual, color-coded, instant status recognition without reading.

---

## Features

### P0 - Must Have (Phase 1 Launch)

**F-071: Visual Floor Plan**
- Drag-and-drop editor to position tables
- Tables have: position (x,y), size (width, height), shape (square, round, rectangle)
- Proportional sizing (2-seat small, 6-seat large)

**F-072: Real-Time Table Status**
- Color-coded: 🟢 Available, 🔴 Occupied, 🟡 Reserved, 🔵 Cleaning
- Updates across all devices in real-time
- Tap table → opens that table's order

**F-073: Table Capacity**
- Each table has seat count (2/4/6/8)
- Shows "3/4" (3 guests seated at 4-seat table)

**F-076: Transfer Between Tables**
- Move order from one table to another
- Both tables auto-update status

**F-082: Multi-Floor Support**
- Multiple spaces: Ground Floor, First Floor, Outdoor, Rooftop, Cabin
- Each space has its own floor plan
- Tab navigation between floors

### P1 - Should Have (Phase 2)

**F-074: Merge Tables**
- Combine 2+ adjacent tables for large groups
- Merged tables act as single order

**F-075: Split Tables**
- Un-merge back to individual tables

**F-077: Walk-In Waitlist**
- Add customers: name, phone, party size, estimated wait
- Queue management

**F-078: Waitlist Notification**
- One-tap send SMS/WhatsApp: "Your table is ready!"

**F-079: Reservation Calendar**
- Calendar view by date/time
- Prevent double-booking same table
- Table pre-assignment

**F-081: Server Section Assignment**
- Assign groups of tables to specific waiters
- Balance workload across staff

**F-083: Table Dwell Time**
- Timer showing how long each table has been occupied
- Helps identify slow tables and suggest dessert/bill

### P2 - Nice to Have (Phase 3+)

**F-080: Reservation Deposit**
- Require advance deposit for reservations
- Track deposit status

**F-084: AI Auto-Seat Suggestion**
- AI suggests which table to seat based on party size, available tables, server load

**F-085: Cleaning Timer**
- When table marked "cleaning", auto-timer starts
- Alert if cleaning takes >10 minutes

---

## Table Status Flow
```
Available (🟢) → Occupied (🔴) → Cleaning (🔵) → Available (🟢)
                     │
                     └── can also be: Reserved (🟡) → Occupied (🔴)
```

## Related
- [[02-order-management]] - Orders linked to tables
- [[05-kitchen-kds]] - KOT shows table number
- [[06-billing-payments]] - Bill associated with table
