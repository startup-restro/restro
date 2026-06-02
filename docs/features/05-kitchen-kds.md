# 🍳 Kitchen & KDS

> **Module**: Kitchen | **Total Features**: 15 | **Phase 1 Count**: 7
> **Core Principle**: Dark mode, huge buttons (72px+), works with greasy hands.

---

## Features

### P0 - Must Have (Phase 1 Launch)

**F-086: KOT Generation**
- When order sent to kitchen → generate Kitchen Order Ticket
- Dual output: thermal print + digital display on KDS
- Ticket includes: order#, table, items, modifiers, notes, priority, time

**F-087: KDS Column View**
- 4 columns: New → Cooking → Ready → Served
- Cards move across columns as status changes
- Count badge on each column header

**F-089: Prep Time Tracking**
- Auto-track: time from "New" to "Ready" per ticket
- Calculate running average prep time per item
- Used for wait time estimates

**F-092: Color-Coded Urgency**
- Timer on each ticket card
- White: within target prep time
- Yellow: approaching target
- Red: exceeded target (overdue)

**F-093: Sound Alerts**
- New order: bell tone 🔔
- Overdue order: urgent beep ⚠️
- Item bumped/ready: soft chime ✅
- Configurable volume

**F-096: KOT Reprint**
- Reprint any KOT (for when printer fails or ticket gets lost)
- Accessible from ticket card or order history

**F-099: KDS Dark Mode**
- Dark background, light text (default)
- Reduces kitchen eye strain under harsh lighting

### P1 - Should Have (Phase 2)

**F-088: Station Routing**
- Route items to correct station: drinks → Bar, mains → Kitchen, desserts → Pastry, grills → Grill
- Based on menu item category mapping

**F-090: Rush Hour Mode**
- Auto-activate when order volume exceeds threshold
- Batches similar items: "8 total momos across 3 tables"

**F-094: Ingredient Warning**
- If item uses a low-stock ingredient → show ⚠️ icon on KDS
- Kitchen can flag 86'd items immediately

**F-100: Live Kitchen Stats**
- Sidebar on KDS: avg prep time, on-time %, orders in queue, staff active

### P2 - Nice to Have (Phase 3+)

**F-091: Recipe Display**
- Tap an item on KDS → see recipe steps and ingredient quantities
- Helpful for new/training cooks

**F-095: Multi-Kitchen Sync**
- For chains: orders route to correct kitchen (central prep vs branch)

**F-097: Bump Bar Support**
- Optional hardware bump bar for hands-free ticket advancement
- Physical buttons instead of touchscreen

**F-098: Course Firing**
- Delay courses: fire appetizers first
- Then mains after N minutes or manual trigger

---

## KDS Layout
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  🔴 NEW (4)  │ 🟡 COOKING(3)│ 🟢 READY (2) │ ✅ DONE (15) │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ #47 Table 7  │ #44 Table 3  │ #42 Takeaway │              │
│ ⏱️ 0:45      │ ⏱️ 8:22      │ ⏱️ Ready 2min│  Today Stats │
│              │              │              │  Avg: 12min  │
│ Momo x2     │ Thali x1     │ Coffee x3    │  On-time: 92%│
│  🌶️🌶️ Med   │ Biryani x2   │              │  Late: 3     │
│ Thukpa x1   │  🌶️🌶️🌶️ Hot │              │              │
│ ⚠️ NO ONION  │              │              │  ⚠️ LOW STOCK│
│              │              │              │  Chicken: 2kg│
│ [▶️ START]   │ [✅ READY]   │ [🔔 SERVED]  │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

## Related
- [[02-order-management]] - Orders sent to kitchen via KOT
- [[07-inventory-management]] - Low stock warnings on KDS
- [[04-table-management]] - Table number displayed on tickets
