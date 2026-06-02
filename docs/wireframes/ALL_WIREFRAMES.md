# RestroVerse - Complete Wireframe Specification
### Every Screen, Every Flow, Every Tap

> **Design Philosophy:** Icon-first. 3-tap max. Works for staff who can't read English.
> **Target Devices:** Android tablets (10"), phones (6"), desktop (web dashboard)

---

## 1. POS MAIN SCREEN (Order Taking)
*The most important screen. Staff spends 80% of time here.*

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ☰ RestroVerse    🟢 Online    Table 7 / Dine-in ▼    👤 Sita    🔔 3     │
├────────────┬────────────────────────────────────────┬───────────────────────┤
│            │                                        │   CURRENT ORDER       │
│ CATEGORIES │         MENU ITEMS GRID                │   Table 7 · Dine-in  │
│            │                                        │                       │
│ ┌────────┐ │  ┌──────────┐ ┌──────────┐ ┌────────┐ │  ┌───────────────────┐│
│ │ 🥟     │ │  │ 📷       │ │ 📷       │ │ 📷    │ │  │ Chicken Momo x2   ││
│ │ Momos  │◄│  │          │ │          │ │        │ │  │ Steamed    Rs 400 ││
│ │        │ │  │ Chicken  │ │ Buff     │ │ Veg    │ │  ├───────────────────┤│
│ ├────────┤ │  │ Momo     │ │ Momo     │ │ Momo   │ │  │ Thukpa x1         ││
│ │ 🍜     │ │  │ Rs 200   │ │ Rs 180   │ │ Rs 160 │ │  │ Chicken    Rs 250 ││
│ │ Noodles│ │  │          │ │          │ │        │ │  ├───────────────────┤│
│ │        │ │  └──────────┘ └──────────┘ └────────┘ │  │ Coke x2           ││
│ ├────────┤ │  ┌──────────┐ ┌──────────┐ ┌────────┐ │  │            Rs 120 ││
│ │ 🍛     │ │  │ 📷       │ │ 📷       │ │ 📷    │ │  └───────────────────┘│
│ │ Thali  │ │  │          │ │          │ │        │ │                       │
│ │        │ │  │ Chow     │ │ Thukpa   │ │ Chow   │ │  ──────────────────  │
│ ├────────┤ │  │ Mein     │ │          │ │ Mein   │ │  Subtotal    Rs 770  │
│ │ 🥤     │ │  │ Rs 180   │ │ Rs 250   │ │ Veg    │ │  VAT (13%)   Rs 100  │
│ │ Drinks │ │  │          │ │          │ │ Rs 150 │ │  ──────────────────  │
│ │        │ │  └──────────┘ └──────────┘ └────────┘ │  TOTAL      Rs 870   │
│ ├────────┤ │  ┌──────────┐ ┌──────────┐ ┌────────┐ │                       │
│ │ 🍰     │ │  │ 📷       │ │ 📷       │ │ 📷    │ │  ┌─────────┐┌────────┐│
│ │Desserts│ │  │ Lassi    │ │ Tea      │ │ Coffee │ │  │ 🖨️ KOT  ││ 💰 PAY ││
│ │        │ │  │ Rs 120   │ │ Rs 40    │ │ Rs 100 │ │  │ Send to ││ Bill & ││
│ ├────────┤ │  │          │ │          │ │        │ │  │ Kitchen ││Checkout││
│ │ 🔥     │ │  └──────────┘ └──────────┘ └────────┘ │  └─────────┘└────────┘│
│ │ Popular│ │                                        │                       │
│ │        │ │  🔍 Search items...                    │  [🗑️ Clear] [⏸️ Hold] │
│ └────────┘ │                                        │  [📋 Note] [👥 Split] │
├────────────┴────────────────────────────────────────┴───────────────────���───┤
│  [Table 3 🟡] [Table 5 🟡] [Table 7 🔴] [Table 9 🟢] [+ New Order]       │
│  ◄ Running Orders Bar — tap to switch between active orders ►              │
└─────────────────────────────────────────────────────────────────────────────┘

UX ANNOTATIONS:
├── Category icons are LARGE (64px) with minimal text — works for non-English staff
├── Menu items show PHOTO + name + price — visual recognition over reading  
├── One tap on item = add to cart (with +1 animation)
├── Long press on item = modifier popup (spice level, extras, notes)
├── Cart shows running total with tax calculated live
├── "KOT" button sends to kitchen WITHOUT billing
├── "PAY" button opens billing screen
├── Running Orders Bar at bottom = switch between open tables in one tap
├── 🟢 Green dot = online, 🟡 Yellow = syncing, 🔴 Red = offline (all still works)
└── Total taps for common order: Tap category → Tap item → Tap KOT = 3 taps ✓
```

### 1.1 Item Modifier Popup (Long Press on Item)
```
┌─────────────────────────────────────────┐
│     Chicken Momo                    ✕   │
│     📷 [photo]                          │
│                                         │
│  VARIANT (pick one):                    │
│  ┌──────────┐  ┌──────────┐             │
│  │ 🫕       │  │ 🍳       │             │
│  │ Steamed  │  │ Fried    │             │
│  │ Rs 200   │  │ Rs 220   │             │
│  └──────────┘  └──────────┘             │
│                                         │
│  ADD-ONS:                               │
│  ☐ Extra Chutney    +Rs 20              │
│  ☐ Jhol Achar       +Rs 30              │
│  ☐ Extra Plate      +Rs 10              │
│                                         │
│  QUANTITY:  [ - ]  2  [ + ]             │
│                                         │
│  SPICE:  🌶️ 🌶️🌶️ 🌶️🌶️🌶️               │
│          Mild  Med  Hot                 │
│                                         │
│  📝 Special note: [No onion________]   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │      ADD TO ORDER — Rs 440      │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### 1.2 Quick Actions Menu
```
┌──────────────────────────────────────┐
│  QUICK ACTIONS                   ✕   │
│                                      │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │ 🔄      │ │ 🪑      │ │ 👥     │ │
│  │Transfer │ │ Change  │ │ Merge  │ │
│  │ Table   │ │ Table   │ │ Tables │ │
│  └─────────┘ └─────────┘ └────────┘ │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │ 🎫      │ │ 📱      │ │ ⏸️     │ │
│  │Discount │ │ Send to │ │ Hold   │ │
│  │         │ │Customer │ │ Order  │ │
│  └─────────┘ └─────────┘ └────────┘ │
│  ┌─────────┐ ┌─────────┐ ┌────────┐ │
│  │ 🖨️      │ │ 🔇      │ │ ❌     │ │
│  │ Reprint │ │ Mute    │ │ Void   │ │
│  │ KOT     │ │ Alerts  │ │ Item   │ │
│  └─────────┘ └─────────┘ └────────┘ │
└──────────────────────────────────────┘
```

---

## 2. TABLE MANAGEMENT SCREEN

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ☰  TABLE MANAGEMENT        🟢 Online       Filter: [All ▼]   👤 Sita │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  GROUND FLOOR                                          SUMMARY          │
│  ┌─────────────────────────────────────────────┐  ┌────────────────┐   │
│  │                                             │  │ Total: 23      │   │
│  │   ┌─────┐   ┌─────┐        ┌──────────┐    │  │ 🟢 Free: 10   │   │
│  │   │ T1  │   │ T2  │        │   T3     │    │  │ 🔴 Busy: 8    │   │
│  │   │ 🟢  │   │ 🔴  │        │   🔴     │    │  │ 🟡 Reserved: 3│   │
│  │   │ 2/4 │   │ 4/4 │        │   6/6    │    │  │ 🔵 Cleaning: 2│   │
│  │   │     │   │ 45m │        │   1h 2m  │    │  ├────────────────┤   │
│  │   └─────┘   └─────┘        └──────────┘    │  │                │   │
│  │                                             │  │ Revenue Today  │   │
│  │        ENTRANCE                             │  │ Rs 34,500      │   │
│  │   ═══════════════                           │  │                │   │
│  │                                             │  │ Avg Turn Time  │   │
│  │   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │  │ 47 min         │   │
│  │   │ T4  │ │ T5  │ │ T6  │ │ T7  │          │  │                │   │
│  │   │ 🟡  │ │ 🟢  │ │ 🔵  │ │ 🔴  │          │  │ Waitlist: 3    │   │
│  │   │ Res │ │ 2/2 │ │Clean│ │ 3/4 │          │  │ Next: 5 min    │   │
│  │   │7:30 │ │     │ │     │ │ 32m │          │  └────────────────┘   │
│  │   └─────┘ └─────┘ └��────┘ └─────┘          │                       │
│  │                                             │  WAITLIST             │
│  │      ┌──────────┐  ┌──────────┐             │  ┌────────────────┐   │
│  │      │  CABIN 1 │  │  CABIN 2 │             │  │ 1. Ram (4 ppl) │   │
│  │      │   🔴     │  │   🟢     │             │  │    Wait: 12min │   │
│  │      │  4/4     │  │   0/6    │             │  │   [Seat] [SMS] │   │
│  │      │  55 min  │  │          │             │  ├────────────────┤   │
│  │      └──────────┘  └──────────┘             │  │ 2. Sita (2 ppl)│   │
│  │                                             │  │    Wait: 5min  │   │
│  └─────────────────────────────────────────────┘  │   [Seat] [SMS] │   │
│                                                    └────────────────┘   │
│  [🪑 OUTDOOR]  [🏠 GROUND FLOOR ●]  [⬆️ FIRST FLOOR]  [+ Add Table]   │
├──────────────────────────────────────────────────────────────��──────────┤
│  Legend: 🟢 Available  🔴 Occupied  🟡 Reserved  🔵 Cleaning           │
│  Tap table = view order  │  Long press = actions (merge/transfer/clean) │
└──────────────────────────────────��──────────────────────────────────────┘

UX ANNOTATIONS:
├── Tables are proportional to actual size (2-seat small, 6-seat large)
├── Color = instant status recognition (no reading required)
├── Time on table shown (helps identify slow tables)
├── Capacity shown: "3/4" = 3 seated in 4-seat table
├── Tap table → opens that table's order in POS screen
├── Long press → merge, split, transfer, mark clean
├── Floor tabs at bottom for multi-floor restaurants
├── Waitlist with one-tap "Seat" and "Send SMS" notification
└── Summary panel always visible for manager overview
```

### 2.1 Table Action Menu (Long Press)
```
┌──────────────────────────────┐
│  TABLE 7 — Occupied (32 min) │
│  Guests: 3/4  │ Server: Sita │
│                              │
│  ┌────────┐  ┌────────┐      │
│  │ 📋     │  │ 💰     │      │
│  │ View   │  │ Bill   │      │
│  │ Order  │  │ Now    │      │
│  └────────┘  └────────┘      │
│  ┌────────┐  ┌────────┐      │
│  │ 🔄     │  │ ➕     │      │
│  │Transfer│  │ Merge  │      │
│  │ to T9  │  │ Tables │      │
│  └────────┘  └────────┘      │
│  ┌────────┐  ┌────────┐      │
│  │ 🧹     │  │ 🍰     │      │
│  │ Mark   │  │ Suggest │      │
│  │ Clean  │  │ Dessert│      │
│  └────────┘  └────────┘      │
└──────────────────────────────┘
```

---

## 3. KITCHEN DISPLAY SYSTEM (KDS)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🍳 KITCHEN DISPLAY    Station: Main Kitchen    🔴 4 New │ ⏱️ Avg: 12min  │
├───────────────────┬───────────────────┬───────────────────┬─────────────────┤
│   🔴 NEW (4)      │   🟡 COOKING (3)  │   🟢 READY (2)   │ ✅ DONE (15)   │
├───────────────────┼───────────────────┼───────────────────┼─────────────────┤
│ ┌───────────────┐ │ ┌───────────────┐ │ ┌───────────────┐ │                 │
│ │ #47 Table 7   │ │ │ #44 Table 3   │ │ │ #42 Table 12  │ │  Today Stats    │
│ │ ⏱️ 0:45       │ │ │ ⏱️ 8:22       │ │ │ ⏱️ Ready 2min │ │                 │
│ │ Dine-in       │ │ │ Dine-in       │ │ │ Takeaway      │ │  Orders: 67     │
│ │───────────────│ │ │───────────────│ │ │───────────────│ │  Avg Time: 12m  │
│ │ Chkn Momo x2  │ │ │ Thali x1      │ │ │ Coffee x3     │ │  Late: 3        │
│ │  🌶️🌶️ Med     │ │ │ Biryani x2    │ │ │ Chow Mein x1  │ │  On-time: 92%   │
│ │ Thukpa x1     │ │ │  🌶️🌶️🌶️ Hot  │ │ │               │ │                 │
│ │               │ │ │               │ │ │               │ │  ──────────     │
│ │ ⚠️ NO ONION   │ │ │               │ │ │ ┌───────────┐ │ │  Staff Active   │
│ │               │ │ │ ┌───────────┐ │ │ │ │ 🔔 SERVED │ │ │  👨‍🍳 Ramesh    │
│ │ ┌───────────┐ │ │ │ │  ✅ READY │ │ │ │ └───────────┘ │ │  👨‍🍳 Kumar     │
│ │ │ ▶️ START  │ │ │ │ └───────────┘ │ │ └───────────────┘ │  👩‍🍳 Priya     │
│ │ └───────────┘ │ │ └───────────────┘ │                   │                 │
│ ├───────────────┤ │ ┌──────────────���┐ │ ┌───────────────┐ │  ──────────     │
│ │ #48 Delivery  │ │ │ #45 Table 9   │ │ │ #43 Table 1   │ │  🔥 RUSH HOUR   │
│ │ ⏱️ 0:15  🔴   │ │ │ ⏱️ 5:10       │ │ │ ⏱️ Ready 5min │ │  Auto-batching  │
│ │ 🛵 Priority!  │ │ │ Dine-in       │ │ │ Dine-in       │ │  is ON          │
│ │───────────────│ │ │───────────────│ │ │───────────────│ │                 │
│ │ Biryani x3    │ │ │ Momo x4       │ │ │ Thali x2      │ │  ──────────     │
│ │ Naan x6       │ │ │ Chow Mein x2  │ │ │               │ │  ⚠️ LOW STOCK  │
│ │ Raita x3      │ │ │               │ │ │ ┌───────────┐ │ │  Chicken: 2kg   │
│ │               │ │ │ ┌───────────┐ │ │ │ │ 🔔 SERVED │ │ │  Paneer: 1kg    │
│ │ ┌───────────┐ │ │ │ │  ✅ READY │ │ │ │ └───────────┘ │ │                 │
│ │ │ ▶️ START  │ │ │ │ └───────────┘ │ │ └───────────────┘ │                 │
│ │ └───────────┘ │ │ └───────────────┘ │                   │                 │
│ ├───────────────┤ │ ┌───────────────┐ │                   │                 │
│ │ #49 Table 5   │ │ │ #46 Takeaway  │ │                   │                 │
│ │ ⏱️ NEW   🟡   │ │ │ ⏱️ 3:45       │ │                   │                 │
│ │ Dine-in       │ │ │───────────────│ │                   │                 │
│ │───────────────│ │ │ Lassi x2      │ │                   │                 │
│ │ Tea x4        │ │ │ Samosa x4     │ │                   │                 │
│ │ Samosa x2     │ │ │               │ │                   │                 │
│ │               │ │ │ ┌───────────┐ │ │                   │                 │
│ │ ┌───────────┐ │ │ │ │  ✅ READY │ │ │                   │                 │
│ │ │ ▶️ START  │ │ │ │ └───────────┘ │ │                   │                 │
│ │ └───────────┘ │ │ └───────────────┘ │                   │                 │
│ └───────────────┘ │                   │                   │                 │
├───────────────────┴───────────────────┴───────────────────┴─────────────────┤
│  🔊 Voice: ON  │  [Station: Main ▼]  │  Dark Mode: ON  │  [Full Screen]    │
└─────────────────────────────────────────────────────────────────────────────┘

UX ANNOTATIONS:
├── DARK MODE by default (reduces kitchen eye strain)
├── HUGE buttons — cooks have wet/greasy hands, need large tap targets (72px+)
├── Color-coded columns — instant visual priority
├── Timer turns RED when order exceeds target prep time
├── 🛵 Delivery orders highlighted with priority badge
├── ⚠️ Allergy/special notes in HIGH CONTRAST yellow
├── One tap: START (new→cooking), READY (cooking→ready), SERVED (ready→done)
├── Auto-batching: groups "Momo x2 + Momo x4" from different tables
├── Sound alerts: different tones for new order, overdue order
├── Low stock warnings visible so kitchen can flag 86'd items
└── Station filter: Main Kitchen / Bar / Pastry / Grill
```

---

## 4. BILLING / CHECKOUT SCREEN

```
┌─────────────────────────────────────────────────────────────────────────┐
│  💰 CHECKOUT                                      Table 7 · Dine-in   │
├───────────────────────────────────┬─────────────────────────────────────┤
│                                   │                                     │
│   ORDER SUMMARY                   │   PAYMENT                          │
│                                   │                                     │
│   Chicken Momo x2     Rs 400      │   ┌─────────┐ ┌─────────┐          │
│     Steamed, Medium spice         │   │ 💵      │ │ 📱      │          │
│   Thukpa x1           Rs 250      │   │ CASH    │ │ eSewa   │          │
│     Chicken, No onion             │   │         │ │         │          │
│   Coke x2             Rs 120      │   └─────────┘ └─────────┘          │
│                                   │   ┌─────────┐ ┌─────────┐          │
│   ─────────────────────           │   │ 📱      │ │ 💳      │          │
│   Subtotal            Rs 770      │   │ Khalti  │ │ Card    │          │
│                                   │   │         │ │         │          │
│   🏷️ Discount:                    │   └─────────┘ └─────────┘          │
│   [10%] [20%] [Rs___] [Coupon]    │   ┌─────────┐ ┌─────────┐          │
│   Applied: 10%       -Rs 77       │   │ 📒      │ │ ½+½     │          │
│                                   │   │ Khata   │ │ Split   │          │
│   Service Charge (10%) Rs 77      │   │ Credit  │ │ Pay     │          │
│   VAT (13%)           Rs 100      │   └─────────┘ └─────────┘          │
│   ─────────────────────           │                                     │
│                                   │   ─────────────────────             │
│   ┌─────────────────────────┐     │                                     │
│   │  GRAND TOTAL   Rs 870   │     │   💵 Cash Received:                 │
│   └─────────────────────────┘     │   [Rs 500] [Rs 1000] [Rs____]      │
│                                   │                                     │
│   👤 Customer: [+Add/Search]      │   Change Due: Rs 130               │
│      Ram Bahadur (Regular)        │                                     │
│      🌟 450 loyalty points        │   ┌─────────────────────────────┐   │
│      📒 Khata balance: Rs 1,200   │   │    ✅ COMPLETE PAYMENT       │   │
│                                   │   └─────────────────────────────┘   │
│   📝 Bill Note: [____________]    │                                     │
│                                   │   Receipt: [🖨️ Print] [📱 SMS]     │
│   [← Back to Order]              │            [💬 WhatsApp] [📧 Email] │
│                                   │                                     │
├───────────────────────────────────┴─────────────────────────────────────┤
│  [🖨️ Print Bill]  [👁️ Preview]  [📤 Share]  [🔄 Reopen Order]          │
└─────────────────────────────────────────────────────────────────────────┘

UX ANNOTATIONS:
├── Payment method = icon-based large buttons (works without reading)
├── Quick discount buttons: 10%, 20%, custom amount, coupon code
├── Cash denomination shortcuts: Rs 500, Rs 1000 for fast change calculation
├── Customer auto-lookup by phone number
├── Khata (credit) option: add to customer's running tab
├── Split pay: can combine cash + digital (e.g., Rs 500 cash + Rs 370 eSewa)
├── Receipt options: print, SMS, WhatsApp (saves paper in Asia — very common)
├── Loyalty points display: show how many points earned this visit
├── Tax auto-calculated based on restaurant's country/tax config
└── "Back to Order" allows adding items before finalizing
```

### 4.1 Split Bill Screen
```
┌──────────────────────────────────────┐
│  SPLIT BILL — Table 7            ✕   │
│                                      │
│  Split by:                           │
│  [👥 Equal] [📋 By Item] [% Custom]  │
│                                      │
│  ═══ SPLIT BY ITEM ═══              │
│                                      │
│  GUEST 1 (Ram)          GUEST 2      │
│  ┌──────────────┐  ┌──────────────┐  │
│  │ Chkn Momo x2 │  │ Thukpa x1   │  │
│  │ Coke x1      │  │ Coke x1     │  │
│  │──────────────│  │──────────────│  │
│  │ Total: Rs 520│  │ Total: Rs 370│  │
│  │ + Tax: Rs 68 │  │ + Tax: Rs 48 │  │
│  │ = Rs 588     │  │ = Rs 418     │  │
│  │              │  │              │  │
│  │ [💵 Pay]     │  │ [💵 Pay]     │  │
│  └──────────────┘  └──────────────┘  │
│                                      │
│  Drag items between guests to move   │
└──────────────────────────────────────┘
```

### 4.2 Khata / Credit Entry
```
┌──────────────────────────────────────┐
│  📒 ADD TO KHATA                 ✕   │
│                                      │
│  Customer: Ram Bahadur               │
│  Phone: 98XXXXXXXX                   │
│                                      │
│  Current Balance: Rs 1,200           │
│  Credit Limit: Rs 5,000             │
│  Available: Rs 3,800                │
│                                      │
│  Adding: Rs 870 (this bill)         │
│  New Balance: Rs 2,070              │
│                                      │
│  ☐ Send WhatsApp reminder           │
│  ☐ Set payment due date: [_______]  │
│                                      │
│  ┌──────────────────────────────┐    │
│  │    ✅ CONFIRM CREDIT ENTRY   │    │
│  └──────────────────────────────┘    │
│                                      │
│  ⚠️ AI Note: Ram typically pays on   │
│  month-end (27th-30th)              │
└──────────────────────────────────────┘
```

---

## 5. QR MENU - CUSTOMER VIEW (Mobile)

```
┌─────────────────────┐
│ ���� PHONE (375px)    │
├─────────────────────┤
│                     │
│  🍜 Momo House      │
│  Table 7            │
│  ─────────────────  │
│                     │
│  [🇳🇵NP][🇬🇧EN][🇮🇳HI] │
│                     │
│  🔍 Search menu...  │
│                     │
│  ━━ 🔥 Popular ━━   │
│                     │
│  ┌─────────────────┐│
│  │ 📸              ││
│  │ [momo photo]    ││
│  │                 ││
│  │ Chicken Momo    ││
│  │ ★★★★★ (342)     ││
│  │ Rs 200          ││
│  │ 🌱 🌶️           ││
│  │     [+ ADD]     ││
│  └─────────────────┘│
│  ┌─────────────────┐│
│  │ 📸              ││
│  │ [thukpa photo]  ││
│  │                 ││
│  │ Chicken Thukpa  ││
│  │ ★★★★☆ (128)     ││
│  │ Rs 250          ││
│  │ 🌶️🌶️            ││
│  │     [+ ADD]     ││
│  └─────────────────┘│
│                     │
│  ━━ 🥟 Momos ━━     │
│  ━━ 🍜 Noodles ━━   │
│  ━━ 🍛 Rice ━━      │
│  ━━ 🥤 Drinks ━━    │
│                     │
│ ┌───────────────────┐│
│ │ 🛒 Cart (3) Rs 650││
│ │ [View Cart →]     ││
│ └───────────────────┘│
└─────────────────────┘

→ Tap "View Cart":

┌─────────────────────┐
│  🛒 YOUR ORDER       │
│  Table 7             │
│                      │
│  Chkn Momo x2  Rs400│
│  [-] 2 [+]          │
│                      │
│  Thukpa x1    Rs 250 │
│  [-] 1 [+]          │
│                      │
│  ─────────────────   │
│  Subtotal    Rs 650  │
│  VAT (13%)   Rs  85  │
│  Total       Rs 735  │
│                      │
│  📝 Note to kitchen: │
│  [________________]  │
│                      │
│  ┌���────────────────┐ │
│  │ 📩 PLACE ORDER  │ │
│  └─────────────────┘ │
│                      │
│  OR                  │
│                      │
│  ┌─────────────────┐ │
│  │ 💰 ORDER & PAY  │ │
│  │  eSewa / Khalti  │ │
│  └─────────────────┘ │
│                      │
│  [← Add more items]  │
└─────────────────────┘

UX ANNOTATIONS:
├── NO app download required — works in mobile browser
├── Language toggle at top (auto-detect from phone locale)
├── Food photos are LARGE — visual ordering
├── Star ratings from other customers
├── Dietary icons: 🌱 Veg, 🌶️ Spice level, 🥜 Allergens
├── Sticky cart bar at bottom — always visible
├── "Place Order" sends to kitchen (pay later at table)
├── "Order & Pay" enables prepay via digital wallet
├── Works offline if restaurant has local WiFi (no internet needed)
└── Customer can call waiter with 🔔 button (sends to waiter app)
```

---

## 6. OWNER DASHBOARD (Mobile App)

```
┌─────────────────────────┐       ┌─────────────────────────┐
│ 📱 OWNER APP - HOME     │       │ 📱 OWNER APP - AI       │
├─────────────────────────┤       ├─────────────────────────┤
│                         │       │                         │
│  👋 Good morning, Sita  │       │  🤖 RESTRO BRAIN        │
│  Momo House · Pokhara   │       │                         │
│                         │       │  Ask me anything about  │
│  ┌─────────────────────┐│       │  your restaurant...     │
│  │ TODAY'S REVENUE     ││       │                         │
│  │                     ││       │  🎤 [Voice] or type:    │
│  │ Rs 45,230    ↑ 12%  ││       │  [________________________]│
│  │ ████████████████░░  ││       │                         │
│  │ 67% of daily target ││       │  ─── Recent Questions ──│
│  └─────────────────────┘│       │                         │
│                         │       │  "Dashain week revenue  │
│  ┌──────┐ ┌──────┐     │       │   vs last year?"        │
│  │ 📦67 │ │ 👥42 │     │       │                         │
│  │Orders│ │Guests│     │       │  → Rs 3,45,000 this     │
│  │ ↑8%  │ │ ↑5%  │     │       │    year vs Rs 2,89,000  │
│  └──────┘ └──────┘     │       │    last year (+19.4%)   │
│  ┌──────┐ ┌──────┐     │       │    📊 [See Chart]       │
│  │ Rs675│ │31.2% │     │       │                         │
│  │ Avg  │ │Food  │     │       │  "What should I prep    │
│  │Order │ │Cost  │     │       │   for tomorrow?"        │
│  └──────┘ └──────┘     │       │                         │
│                         │       │  → Tomorrow is Saturday │
│  ┌─────────────────────┐│       │    + holiday weekend.   │
│  │ 🤖 AI INSIGHTS      ││       │    Recommend:           │
│  │                     ││       │    • Chicken: 15kg      │
│  │ "Remove Greek Salad ││       │    • Buff: 8kg          │
│  │  (2/wk, 45% cost). ││       │    • Flour: 25kg        │
│  │  Add Paneer Momo —  ││       │    • Vegetables: 10kg   │
│  │  8x more popular    ││       │    📋 [Create PO]       │
│  │  in your area."     ││       │                         │
│  │  [✅ Act] [❌ Skip]  ││       │  "Show me suspicious   │
│  └─────────────────────┘│       │   activity"            │
│                         │       │                         │
│  ┌─────────────────────┐│       │  → ⚠️ Cashier Hari void │
│  │ ⚠️ ALERTS            ││       │    rate is 3.2x average│
│  │ • Chicken: 2kg left ││       │    (8 voids yesterday). │
│  │ • Ram owes Rs 2,450 ││       │    Review recommended.  │
│  │ • Staff Hari late   ││       │    📋 [View Details]    │
│  └─────────────────────┘│       │                         │
│                         │       │                         │
│  ┌──────────────────┐   │       │                         │
│  │ 📊 [Full Reports] │   │       │                         │
│  └──────────────────┘   │       │                         │
│                         │       │                         │
├─────────────────────────┤       ├─────────────────────────┤
│ 🏠  📊  🤖  📦  ⚙️     │       │ 🏠  📊  🤖  📦  ⚙️     │
│Home Report AI  Stock Set│       │Home Report AI  Stock Set│
└─────────────────────────┘       └─────────────────────────┘

UX ANNOTATIONS:
├── Mobile-first: owners check on phone, not desktop
├── Daily snapshot visible in ONE scroll
├── AI insights are actionable: "Act" button implements the suggestion
├── Alerts bubble up urgent items (low stock, overdue credit, staff issues)
├── Bottom navigation: 5 key sections
├── Voice-first AI: owner speaks in Nepali, gets answers in Nepali
├── Full reports accessible but not cluttering home screen
├── Works fully offline — shows cached data with "Last synced: 2 min ago"
└── Push notifications for critical alerts (even when app is closed)
```

---

## 7. INVENTORY MANAGEMENT

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📦 INVENTORY          🔍 Search...          [+ Add Item] [📸 Scan]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FILTER: [All ▼]  [⚠️ Low Stock]  [📅 Expiring]  [📊 High Cost]       │
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ ITEM            │ IN STOCK  │ UNIT  │ MIN  │ COST/UNIT │ STATUS   │ │
│  ├─────────────────┼──────────┼───────┼──────┼───────────┼──────────┤ │
│  │ 🐔 Chicken      │  2.5 kg  │  kg   │ 5 kg │ Rs 380/kg │ 🔴 LOW  │ │
│  │ 🥬 Cabbage      │  8.0 kg  │  kg   │ 3 kg │ Rs 60/kg  │ 🟢 OK   │ │
│  │ 🌾 Flour (Maida)│ 12.0 kg  │  kg   │10 kg │ Rs 55/kg  │ 🟢 OK   │ │
│  │ 🧈 Butter       │  0.5 kg  │  kg   │ 2 kg │ Rs 900/kg │ 🔴 LOW  │ │
│  │ 🫚 Ginger       │  1.2 kg  │  kg   │ 1 kg │ Rs 200/kg │ 🟡 MED  │ │
│  │ 🥩 Buff         │  4.0 kg  │  kg   │ 3 kg │ Rs 550/kg │ 🟢 OK   │ │
│  │ 🥤 Coke 300ml   │  24 pcs  │  pcs  │ 48   │ Rs 35/pc  │ 🟡 MED  │ │
│  │ 🍋 Lemon        │  2.0 kg  │  kg   │ 1 kg │ Rs 120/kg │ 🟢 OK   │ │
│  │ 🧀 Paneer       │  1.5 kg  │  kg   │ 2 kg │ Rs 450/kg │ 🔴 LOW  │ │
│  │                 │  📅 Exp:  │ Tmrw! │      │           │ ⚠️ USE! │ │
│  └─────────────────┴──────────┴───────┴──────┴───────────┴──────────┘ │
│                                                                         │
│  ── QUICK ACTIONS ──────────────────────────────────────────────        │
│                                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ 📸           │ │ 📋           │ │ 🔄           │ │ 📊           │   │
│  │ Photo        │ │ Purchase     │ │ Stock        │ │ Food Cost    │   │
│  │ Invoice      │ │ Order        │ │ Count        │ │ Report       │   │
│  │ Scan         │ │ (AI Suggest) │ │ (Inventory)  │ │              │   │
│  └──────────────┘ └──────────────┘ └───────────���──┘ └──────────────┘   │
│                                                                         │
│  ── AI PURCHASE SUGGESTION ─────────────────────────────────────        │
│  ┌────────────────────────────────────────────────────────────────┐     │
│  │  🤖 Based on tomorrow's forecast (Saturday + holiday):         │     │
│  │                                                                │     │
│  │  Buy:                                                          │     │
│  │  • Chicken: 12 kg (Rs 4,560) — from Supplier A (cheapest)     │     │
│  │  • Butter: 3 kg (Rs 2,700) — from Supplier B                  │     │
│  │  • Paneer: 3 kg (Rs 1,350) — from Supplier A                  │     │
│  │  • Coke 300ml: 48 pcs (Rs 1,680) — from Supplier C            │     │
│  │                                                                │     │
│  │  Total estimated: Rs 10,290                                    │     │
│  │                                                                │     │
│  │  [✅ Create Purchase Order]  [✏️ Edit]  [❌ Skip]               │     │
│  └────────────────────────────────────────────────────────────────┘     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  📦 Items: 47  │  🔴 Low: 5  │  ⚠️ Expiring: 2  │  💰 Stock: Rs 89K  │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.1 Photo Invoice Scanner
```
┌──────────────────────────────────────┐
│  📸 SCAN INVOICE                 ✕   │
│                                      │
│  ┌──────────────────────────────┐    │
│  │                              │    │
│  │    [Camera Viewfinder]       │    │
│  │                              │    │
│  │    Point at supplier         │    │
│  │    invoice/bill              │    │
│  │                              │    │
│  │         📷                   │    │
│  └──────────────────────────────┘    │
│                                      │
│  ── AI EXTRACTED ──                  │
│                                      │
│  Supplier: Season Agro Pvt Ltd  ✓    │
│  Date: 2026-05-27               ✓    │
│  Invoice #: INV-4521            ✓    │
│                                      │
│  Items found:                        │
│  ☑ Chicken 10kg × Rs 380  Rs 3,800  │
│  ☑ Cabbage 5kg × Rs 60    Rs 300    │
│  ☑ Ginger 2kg × Rs 200    Rs 400    │
│  ☐ Delivery charge         Rs 100   │
│                                      │
│  Total: Rs 4,600                     │
│                                      │
│  [✏️ Edit]  [✅ Save to Inventory]   │
└──────────────────────────────────────┘
```

---

## 8. STAFF MANAGEMENT

```
┌─────────────────────────────────────────────────────────────────────────┐
│  👥 STAFF MANAGEMENT                    [+ Add Staff]  [📋 Payroll]    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  THIS WEEK'S SCHEDULE                                                   │
│  ┌────────┬───────┬───────┬───────┬───────┬───────┬───────┬───────┐    │
│  │        │ Mon   │ Tue   │ Wed   │ Thu   │ Fri   │ Sat   │ Sun   │    │
│  ├────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤    │
│  │Sita    │ 🟢 AM │ 🟢 AM │ 🔴 OFF│ 🟢 AM │ 🟢 AM │ 🟢 FUL│ 🔴 OFF│    │
│  │(Mgr)   │ 8-4   │ 8-4   │       │ 8-4   │ 8-4   │ 8-8   │       │    │
│  ├────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤    │
│  │Ramesh  │ 🟡 PM │ 🟡 PM │ 🟡 PM │ 🟡 PM │ 🟡 PM │ 🟢 FUL│ 🔴 OFF│    │
│  │(Waiter)│ 4-10  │ 4-10  │ 4-10  │ 4-10  │ 4-10  │ 8-8   │       │    │
│  ├────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤    │
│  │Kumar   │ 🟢 AM │ 🔴 OFF│ 🟢 AM │ 🟡 PM │ 🟢 AM │ 🟢 FUL│ 🟡 PM │    │
│  │(Cook)  │ 7-3   │       │ 7-3   │ 3-10  │ 7-3   │ 7-10  │ 3-10  │    │
│  ├────────┼───────┼───────┼───────┼───────┼───────┼───────┼───────┤    │
│  │Priya   │ 🟢 AM │ 🟢 AM │ 🟢 AM │ 🟢 AM │ 🟢 AM │ 🔴 OFF│ 🟢 AM │    │
│  │(Cashier│ 9-5   │ 9-5   │ 9-5   │ 9-5   │ 9-5   │       │ 9-5   │    │
│  └────────┴───────┴───────┴───────┴───────┴───────┴───────┴───────┘    │
│                                                                         │
│  ── STAFF PERFORMANCE (This Month) ──                                   │
│                                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ 👤 Sita     │ │ 👤 Ramesh   │ │ 👤 Kumar    │ │ 👤 Priya    │      │
│  │ Manager     │ │ Waiter      │ │ Cook        │ │ Cashier     │      │
│  │             │ │             │ │             │ │             │      │
│  │ ⭐ 4.8/5    │ │ ⭐ 4.5/5    │ │ ⭐ 4.7/5    │ │ ⭐ 4.2/5    │      │
│  │ Orders: 234 │ │ Orders: 456 │ │ Prep: 12min│ │ Bills: 523  │      │
│  │ Avg Up: 15% │ │ Avg Up: 22% │ │ On-time:95%│ │ Accuracy:99%│      │
│  │ Late: 0     │ │ Late: 2     │ │ Late: 1    │ │ Late: 0     │      │
│  │             │ │             │ │             │ │             │      │
│  │ [View Full] │ │ [View Full] │ │ [View Full] │ │ [View Full] │      │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                                         │
│  ── QUICK ACTIONS ──                                                    │
│  [⏰ Clock In/Out]  [💰 Advance]  [📊 Payroll]  [📅 Auto Schedule]     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 9. ANALYTICS DASHBOARD (Web)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  📊 ANALYTICS                          [Today ▼] [This Week] [This Month]      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐       │
│  │ 💰 REVENUE    │ │ 📦 ORDERS     │ │ 👥 CUSTOMERS  │ │ 🍽️ AVG ORDER  │       │
│  │               │ │               │ │               │ │               │       │
│  │  Rs 45,230    │ │     67        │ │     42        │ │   Rs 675      │       │
│  │  ↑ 12%        │ │   ↑ 8%        │ │   ↑ 5%        │ │   ↑ 3%        │       │
│  │  vs yesterday │ │  vs yesterday │ │  vs yesterday │ │  vs yesterday │       │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘       │
│                                                                                 │
│  ┌──────────────────────────────────────┐ ┌──────────────────────────────────┐  │
│  │  REVENUE TREND (30 days)            │ │  ORDER BREAKDOWN                 │  │
│  │                                      │ │                                  │  │
│  │  45K ┤         ╭──╮                  │ │  ┌────────────────┐              │  │
│  │      │      ╭──╯  ╰──╮      ╭──     │ │  │  🟣 Dine-in 52%│              │  │
│  │  35K ┤   ╭──╯        ╰──╮╭──╯       │ │  │  🟢 Delivery 28%│             │  │
│  │      │╭──╯               ╰╯          │ │  │  🟡 Takeaway 15%│             │  │
│  │  25K ┤╯                              │ │  │  🔵 Online    5%│             │  │
│  │      ├───┬───┬───┬───┬───┬───┬───    │ │  └────────────────┘              │  │
│  │       W1  W2  W3  W4  W5  W6  W7    │ │                                  │  │
│  └──────────────────────────────────────┘ └──────────────────────────────────┘  │
│                                                                                 │
│  ┌──────────────────────────────────────┐ ┌──────────────────────────────────┐  │
│  │  TOP SELLING ITEMS                   │ │  PEAK HOURS                      │  │
│  │                                      │ │                                  │  │
│  │  1. 🥟 Chicken Momo    342 sold      │ │  Orders by hour:                 │  │
│  │     ████████████████░░ Rs 68,400     │ │                                  │  │
│  │     💰 Profit: Rs 46,100 (67%)       │ │      ██                          │  │
│  │                                      │ │   █  ██ █                        │  │
│  │  2. 🍛 Veg Thali       201 sold      │ │   █  ██ ██                       │  │
│  │     ██████████████░░░░ Rs 40,200     │ │   ██ ██ ██  █                    │  │
│  │     💰 Profit: Rs 24,800 (62%)       │ │   ██ ██ ██ ██  █                 │  │
│  │                                      │ │  ─┬──┬──┬──┬──┬──┬──┬──         │  │
│  │  3. 🍜 Thukpa           178 sold     │ │   9  11  1  3  5  7  9          │  │
│  │     ████████████░░░░░░ Rs 44,500     │ │   am      pm                     │  │
│  │     💰 Profit: Rs 31,200 (70%)       │ │                                  │  │
│  │                                      │ │  Peak: 12-1pm, 7-8pm            │  │
│  │  [View all 47 items →]               │ │  💡 Consider happy hour 3-5pm    │  │
│  └──────────────────────────────────────┘ └──────────────────────────────────┘  │
│                                                                                 │
│  ┌──────────────────────────────────────┐ ┌──────────────────────────────────┐  │
│  │  FOOD COST ANALYSIS                  │ │  STAFF EFFICIENCY                │  │
│  │                                      │ │                                  │  │
│  │  Target: 30%  │  Actual: 31.2%       │ │  Best Server: Ramesh             │  │
│  │  ════════════▓░░░░░░░░░              │ │  • Avg bill: Rs 890              │  │
│  │              ▲                        │ │  • Upsell rate: 22%              │  │
│  │              Target                   │ │  • Tables/hour: 4.2              │  │
│  │                                      │ │                                  │  │
│  │  Highest cost items:                 │ │  Fastest Cook: Kumar              │  │
│  │  ⚠️ Pasta: 45% (target: 30%)         │ │  • Avg prep: 11 min              │  │
│  │  ⚠️ Steak: 42% (target: 35%)         │ │  • On-time: 95%                  │  │
│  │  ✅ Momo: 28% (target: 30%)          │ │  • Quality score: 4.7/5          │  │
│  └──────────────────────────────────────┘ └──────────────────────────────────┘  │
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  🏆 BENCHMARKING (vs similar restaurants in your area)                   │   │
│  │                                                                          │   │
│  │  Your Avg Order: Rs 675  │  Area Avg: Rs 590  │  You're 14% above ↑    │   │
│  │  Your Food Cost: 31.2%   │  Area Avg: 33.5%   │  You're 2.3% better ↓  │   │
│  │  Your Rating: 4.5★       │  Area Avg: 4.1★     │  You're top 15% ↑     │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. ONLINE ORDERING PAGE (Customer Web)

```
┌──────────────���──────────────────────────────────────────────┐
│  📱 yourrestaurant.restroverse.com                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  📸 [Restaurant Hero Banner Photo]                  │    │
│  │                                                     │    │
│  │   🍜 MOMO HOUSE                                     │    │
│  │   ★★★★★ 4.5 (1,234 reviews)                        │    │
│  │   📍 Lakeside, Pokhara  ·  ⏰ Open till 10PM        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  [🍽️ Delivery]  [🏃 Pickup]                                │
│                                                             │
│  📍 Deliver to: [Lakeside, Pokhara ▼]                      │
│  ⏱️ Estimated: 35-45 min                                    │
│                                                             │
│  🔍 [Search menu...]                                        │
│                                                             │
│  ━━ 🔥 BESTSELLERS ━━                                       │
│                                                             │
│  ┌────────────────────────────┐  ┌──────────────────────┐   │
│  │ 📸 [photo]                 │  │ 📸 [photo]           │   │
│  │ Chicken Momo (Steamed)     │  │ Chicken Thukpa       │   │
│  │ ★★★★★ 342 reviews         │  │ ★★★★☆ 128 reviews    │   │
│  │ "Best momos in Pokhara!"   │  │ Rs 250               │   │
│  │ Rs 200                     │  │ [+ ADD]              │   │
│  │ [+ ADD]                    │  │                      │   │
│  └────────────────────────────┘  └──────────────────────┘   │
│                                                             │
│  ━━ 🥟 MOMOS ━━                                             │
│  ━━ 🍛 MAIN COURSE ━━                                       │
│  ━━ 🥤 BEVERAGES ━━                                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🛒 2 items · Rs 450          [VIEW CART →]         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  → CHECKOUT PAGE:                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  YOUR ORDER                                         │    │
│  │  Chicken Momo x2              Rs 400                │    │
│  │  Thukpa x1                    Rs 250                │    │
│  │  ─────────────                                      │    │
│  │  Subtotal                     Rs 650                │    │
│  │  Delivery Fee                 Rs 50                 │    │
│  │  VAT (13%)                    Rs 91                 │    │
│  │  TOTAL                        Rs 791                │    │
│  │                                                     │    │
│  │  📱 Phone: [98XXXXXXXX]                             │    │
│  │  📍 Address: [Lakeside, near Hotel Fewa...]         │    │
│  │  📝 Note: [Extra chutney please]                    │    │
│  │                                                     │    │
│  │  PAY WITH:                                          │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │    │
│  │  │ eSewa  │ │ Khalti │ │ FonePay│ │ Cash   │       │    │
│  │  │  📱    │ │  📱    │ │  📱    │ │  💵    │       │    │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │    │
│  │                                                     │    │
│  │  [🛵 PLACE ORDER — Rs 791]                          │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. WHATSAPP BOT FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                     WHATSAPP ORDERING BOT FLOW                  │
│                                                                 │
│  ┌──────────┐                                                   │
│  │ Customer │                                                   │
│  │ sends    │                                                   │
│  │ "Hi"     │                                                   │
│  └────┬─────┘                                                   │
│       ▼                                                         │
│  ┌──────────────────────────────────────────┐                   │
│  │ 🤖 Bot: "Welcome to Momo House! 🎉      │                   │
│  │                                          │                   │
│  │  How can I help you?                     │                   │
│  │  1️⃣ Order Food                           │                   │
│  │  2️⃣ See Menu                             │                   │
│  │  3️⃣ Track Order                          │                   │
│  │  4️⃣ Make Reservation                     │                   │
│  │  5️⃣ Talk to Staff                        │                   │
│  │                                          │                   │
│  │  Or just tell me what you want!"         │                   │
│  └──────────────────┬───────────────────────┘                   │
│                     │                                           │
│       ┌─────────────┼──────────────┐                            │
│       ▼             ▼              ▼                            │
│  "Order Food"  "2 momo and     "Track order"                   │
│  (menu flow)   1 thukpa"       (status flow)                   │
│       │        (direct order)       │                           │
│       ▼             │               ▼                           │
│  [Send menu    ┌────▼────────────────────────┐   ┌────────────┐│
│   link with    │ 🤖 "Got it!                 │   │ 🤖 "Your   ││
│   categories]  │                              │   │ order #48  ││
│       │        │  • Chicken Momo x2 — Rs 400 │   │ is being   ││
│       ▼        │  • Thukpa x1 — Rs 250       │   │ prepared.  ││
│  Customer      │  Total: Rs 650 + VAT = Rs 735│   │ ETA: 25min"││
│  selects       │                              │   └────────────┘│
│  items         │  📍 Saved address:           │                 │
│       │        │  Lazimpat, Kathmandu          │                │
│       ▼        │                              │                 │
│  Same flow ──► │  Delivery or Pickup?"        │                 │
│                └──────────────┬───────────────┘                 │
│                               ▼                                 │
│                ┌──────────────────────────────┐                  │
│                │ 🤖 "Pay via:                 │                  │
│                │  1️⃣ eSewa (tap to pay)       │                  │
│                │  2️⃣ Khalti (tap to pay)      │                  │
│                │  3️⃣ Cash on Delivery"        │                  │
│                └──────────────┬───────────────┘                  │
│                               ▼                                 │
│                ┌──────────────────────────────┐                  │
│                │ 🤖 "Order confirmed! 🎉      │                  │
│                │                              │                  │
│                │  Order #48                   │                  │
│                │  🛵 Delivery to Lazimpat      │                  │
│                │  ⏱️ ETA: 35-45 min            │                  │
│                │  💰 Total: Rs 735 (COD)       │                  │
│                │                              │                  │
│                │  Track: [link]               │                  │
│                │  Need help? Reply HELP"       │                  │
│                └──────────────────────────────┘                  │
│                                                                 │
│  ── AUTOMATED MESSAGES ──                                       │
│  ├── Order accepted: "Kitchen started your order!"             │
│  ├── Ready for pickup: "Your order is ready! 🎉"               │
│  ├── Out for delivery: "Rider Ram is on the way! 🛵"           │
│  ├── Delivered: "Enjoy your meal! Rate us: ★★★★★"              │
│  └── Post-meal: "Thanks! Here's 10% off your next order 🎫"   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 12. KIOSK MODE (Self-Service)

```
┌─────────────────────────────────────────────────────────────────┐
│                    KIOSK MODE (Tablet - Landscape)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│           Welcome to Momo House!                                │
│           🇳🇵 नेपाली  |  🇬🇧 English  |  🇮🇳 हिन्दी              │
│                                                                 │
│           ┌───────────┐  ┌───────────┐                          │
│           │  🍽️       │  │  🥡       │                          │
│           │ DINE IN   │  │ TAKEAWAY  │                          │
│           │           │  │           │                          │
│           └───────────┘  └───────────┘                          │
│                                                                 │
│  ════════════════════════════════════════════════════════════    │
│                                                                 │
│  ┌────────┐ ┌──────────────────────────────────────────────┐    │
│  │🔥      │ │                                              │    │
│  │Popular │ │  ┌─────────────┐ ┌─────────────┐ ┌────────┐ │    │
│  ├────────┤ │  │ 📸          │ │ 📸          │ │ 📸     │ │    │
│  │🥟      │ │  │ [BIG PHOTO] │ │ [BIG PHOTO] │ │[PHOTO] │ │    │
│  │Momos   │ │  │             │ │             │ │        │ │    │
│  ├────────┤ │  │ Chicken     │ │ Buff        │ │ Veg    │ │    │
│  │🍜      │ │  │ Momo        │ │ Momo        │ │ Momo   │ │    │
│  │Noodles │ │  │ Rs 200      │ │ Rs 180      │ │Rs 160  │ │    │
│  ├────────┤ │  │             │ │             │ │        │ │    │
│  │🍛      │ │  │  [+ADD 🛒]  │ │  [+ADD 🛒]  │ │[+ADD]  │ │    │
│  │Rice    │ │  └─────────────┘ └─────────────┘ └────────┘ │    │
│  ├────────┤ │                                              │    │
│  │🥤      │ │  ┌─────────────┐ ┌─────────────┐ ┌────────┐ │    │
│  │Drinks  │ │  │ 📸          │ │ 📸          │ │ 📸     │ │    │
│  ├────────┤ │  │ [BIG PHOTO] │ │ [BIG PHOTO] │ │[PHOTO] │ │    │
│  │🍰      │ │  │ Thukpa      │ │ Chow Mein   │ │ Thali  │ │    │
│  │Dessert │ │  │ Rs 250      │ │ Rs 180      │ │Rs 200  │ │    │
│  └────────┘ │  │  [+ADD 🛒]  │ │  [+ADD 🛒]  │ │[+ADD]  │ │    │
│             │  └─────────────┘ └─────────────┘ └────────┘ │    │
│             └──────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  🛒 YOUR ORDER: 3 items                     Rs 650     │    │
│  │                                                         │    │
│  │  [VIEW ORDER & PAY →]                                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ℹ️ Touch any item to add  │  Need help? Press 🔔 for staff    │
└─────────────────────────────────────────────────────────────────┘

UX ANNOTATIONS:
├── HUGE photos — customers order visually
├── LARGE tap targets (80px+) — works for everyone
├── Minimal text — icons + photos do the talking
├── Category sidebar with emoji icons
├── Sticky cart bar at bottom
├── Language selection prominent at top
├── No login required — order and pay
├── "Call Staff" button for assistance
├── Auto-reset after 60 seconds of inactivity
├── Accessibility: high contrast, large text option
└── Hardware: same $80 Android tablet as POS, just different app mode
```

---

## 13. LOYALTY & CUSTOMER SCREEN

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🌟 LOYALTY & CUSTOMERS                     [+ Add Customer] [📊 Stats]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  LOYALTY PROGRAM OVERVIEW                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ 👥 1,234    │ │ 🌟 45,600   │ │ 🎁 89       │ │ ↩️ 67%      │      │
│  │ Members     │ │ Points      │ │ Redeemed    │ │ Return Rate │      │
│  │ Issued      │ │ Pending     │ │ This Month  │ │             │      │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                                         │
│  ── CUSTOMER LIST ──                                                    │
│  🔍 [Search by name or phone...]                                       │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 👤 Ram Bahadur        │ 📱 98XXXXXXXX │ 🌟 Gold   │ 2,450 pts │   │
│  │ Last visit: 2 days ago│ Visits: 45    │ Avg: Rs 890│ Khata: Rs 0│  │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │ 👤 Sita Sharma        │ 📱 98XXXXXXXX │ 🥈 Silver │ 890 pts   │   │
│  │ Last visit: 1 week ago│ Visits: 12    │ Avg: Rs 560│ Khata: Rs 0│  │
│  │ ⚠️ AI: At-risk — send win-back offer?  [Send 💬]               │   │
│  ├──────────────────────────────────────────────────────────────────┤   │
│  │ 👤 Kumar Thapa        │ 📱 98XXXXXXXX │ 🥉 Bronze │ 340 pts   │   │
│  │ Last visit: Yesterday │ Visits: 8     │ Avg: Rs 420│ Khata:1.2K│   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ── CUSTOMER DETAIL (tap to expand) ──                                  │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  👤 RAM BAHADUR                                 🌟 Gold Member  │   │
│  │  📱 98XXXXXXXX  │  🎂 Birthday: Dec 15                          │   │
│  │                                                                  │   │
│  │  STATS           │  PREFERENCES          │  LOYALTY              │   │
│  │  Visits: 45      │  🌶️ Extra spicy        │  Points: 2,450       │   │
│  │  Total: Rs 40K   │  ❌ No cilantro        │  Tier: Gold          │   │
│  │  Avg: Rs 890     │  ❤️ Chicken Momo       │  Next: Platinum @5K  │   │
│  │  Last: 2 days    │  ❤️ Thukpa             │  [Redeem Points]     │   │
│  │                                                                  │   │
│  │  RECENT ORDERS:                                                  │   │
│  │  May 25: Momo x2, Thukpa, Coke — Rs 870                         │   │
│  │  May 20: Thali, Lassi — Rs 320                                   │   │
│  │  May 18: Momo x4 (takeaway) — Rs 800                             │   │
│  │                                                                  │   │
│  │  [💬 WhatsApp]  [📧 Send Offer]  [📒 View Khata]                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ── LOYALTY TIERS ──                                                    │
│  🥉 Bronze (0-999 pts)  │  🥈 Silver (1K-2.5K)  │  🌟 Gold (2.5K-5K) │
│  5% off every 10th visit │  10% off + priority    │  15% off + free    │
│                          │  seating               │  dessert/month     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 14. KHATA (CREDIT BOOK) SCREEN

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📒 KHATA (Credit Book)                    Total Outstanding: Rs 34,500│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ 👥 23       │ │ 💰 Rs 34.5K │ │ ⚠️ 5         │ │ ✅ Rs 12K    │      │
│  │ Active      │ │ Total       │ │ Overdue     │ │ Collected   │      │
│  │ Accounts    │ │ Outstanding │ │ (>30 days)  │ │ This Month  │      │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘      │
│                                                                         │
│  FILTER: [All] [⚠️ Overdue] [💰 High Balance] [📅 Due This Week]      │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ 👤 NAME           │ BALANCE   │ LAST TXN    │ STATUS  │ ACTION │   │
│  ├────────────────────┼───────────┼─────────────┼─────────┼────────┤   │
│  │ 🔴 Ram Bahadur    │ Rs 4,200  │ May 27      │ 35 days │[💬][✅]│   │
│  │    Limit: Rs 5,000│           │ overdue     │ ⚠️ HIGH │        │   │
│  ├────────────────────┼───────────┼─────────────┼─────────┼────────┤   │
│  │ 🟡 Hari Office    │ Rs 8,900  │ May 26      │ 15 days │[💬][✅]│   │
│  │    Limit: Rs 15K  │           │ (Corporate) │ 🟡 MED  │        │   │
│  ├────────────────────┼───────────┼─────────────┼─────────┼────────┤   │
│  │ 🟢 Sita Sharma    │ Rs 1,200  │ May 25      │ 5 days  │[💬][✅]│   │
│  │    Limit: Rs 3,000│           │             │ 🟢 OK   │        │   │
│  └────────────────────┴───────────┴─────────────┴─────────┴────────┘   │
│                                                                         │
│  ── DETAIL VIEW (Ram Bahadur) ──                                        │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  📒 KHATA — Ram Bahadur              Credit Limit: Rs 5,000     │   │
│  │  📱 98XXXXXXXX                        Balance: Rs 4,200         │   │
│  │                                                                  │   │
│  │  DATE        │ TYPE     │ AMOUNT   │ BALANCE │ NOTE             │   │
│  │  ────────────┼──────────┼──────────┼─────────┼──────────────────│   │
│  │  May 27      │ 🍽️ Bill  │ +Rs 870  │ Rs 4,200│ Dinner, Table 3 │   │
│  │  May 25      │ 🍽️ Bill  │ +Rs 450  │ Rs 3,330│ Lunch           │   │
│  │  May 22      │ 💰 Paid  │ -Rs 2,000│ Rs 2,880│ Cash payment    │   │
│  │  May 22      │ 🍽️ Bill  │ +Rs 800  │ Rs 4,880│ Family dinner   │   │
│  │  May 18      │ 🍽️ Bill  │ +Rs 600  │ Rs 4,080│ Lunch           │   │
│  │  May 15      │ 💰 Paid  │ -Rs 3,000│ Rs 3,480│ eSewa transfer  │   │
│  │  ...                                                             │   │
│  │                                                                  │   │
│  │  🤖 AI Pattern: "Ram typically pays Rs 2-3K on month-end.       │   │
│  │     Expected payment: ~May 30. Confidence: 85%"                  │   │
│  │                                                                  │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────┐               │   │
│  │  │ 💬 Send    │ │ ✅ Record  │ │ ⚠️ Adjust      │               │   │
│  │  │ Reminder   │ │ Payment    │ │ Credit Limit   │               │   │
│  │  │ (WhatsApp) │ │            │ │                │               │   │
│  │  └────────────┘ └────────────┘ └────────────────┘               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [📊 Khata Report]  [💬 Bulk Reminder]  [📤 Export]                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 15. LOGIN / ONBOARDING FLOW

```
SCREEN 1: WELCOME          SCREEN 2: PHONE/OTP         SCREEN 3: VERIFY
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│                   │       │                   │       │                   │
│   🍜              │       │  Enter your phone │       │  Enter OTP        │
│   RestroVerse     │       │                   │       │                   │
│                   │       │  🇳🇵 +977          │       │  Sent to          │
│  "The OS for      │       │  [98XXXXXXXX    ] │       │  +977-98XXXXXXXX  │
│   every Asian     │       │                   │       │                   │
│   restaurant"     │       │  We'll send you   │       │  ┌──┐┌──┐┌──┐┌──┐│
│                   │       │  an OTP to verify  │       │  │4 ││5 ││ ││ ││
│                   │       │                   │       │  └──┘└──┘└──┘└──┘│
│  🇳🇵 Nepal        │       │                   │       │                   │
│  🇮🇳 India        │       │  ┌───────────────┐│       │  Didn't receive?  │
│  🇧🇩 Bangladesh   │       │  │ SEND OTP  →   ││       │  [Resend in 28s]  │
│                   │       │  └───────────────┘│       │                   │
│  [GET STARTED →]  │       │                   │       │  ┌───────────────┐│
│                   │       │  Already have an  │       │  │   VERIFY  →   ││
│                   │       │  account? [Login] │       │  └───────────────┘│
└───────────────────┘       └───────────────────┘       └───────────────────┘

SCREEN 4: RESTAURANT SETUP   SCREEN 5: MENU SETUP        SCREEN 6: READY!
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│                   │       │                   │       │                   │
│  Setup your       │       │  Add your menu    │       │  🎉 You're ready! │
│  restaurant       │       │                   │       │                   │
│                   │       │  Choose method:   │       │  Your restaurant  │
│  Name:            │       │                   │       │  is set up and    │
│  [Momo House    ] │       │  ┌───────────────┐│       │  ready to take    │
│                   │       │  │ 📸 Photo Menu ││       │  orders!          │
│  Type:            │       │  │ Take a photo  ││       │                   │
│  [Restaurant ▼]   │       │  │ of your menu  ││       │  ┌───────────────┐│
│                   │       │  └───────────────┘│       │  │ Momo House    ││
│  Location:        │       │  ┌───────────────┐│       │  │ 🪑 5 tables   ││
│  [📍 Pokhara   ]  │       │  │ 🎤 Voice Add  ││       │  │ 🍽️ 12 items   ││
│                   │       │  │ "Add chicken  ││       │  │ 🇳🇵 Nepal      ││
│  Tables:          │       │  │  momo, Rs 200"││       │  └───────────────┘│
│  [5 tables     ]  │       │  └───────────────┘│       │                   │
│                   │       │  ┌───────────────┐│       │  ┌───────────────┐│
│  Currency: 🇳🇵 NPR │       │  │ ✏️ Manual Add ││       │  │TAKE 1ST ORDER││
│  Tax: VAT 13%     │       │  │ Type items    ││       │  └───────────────┘│
│                   │       │  │ one by one    ││       │                   │
│  [CONTINUE →]     │       │  └───────────────┘│       │  [⚙️ Edit Setup]  │
│                   │       │                   │       │  [📖 Tutorial]    │
│  ⏱️ Step 2 of 4   │       │  ⏱️ Step 3 of 4   │       │  ⏱️ Done! < 5 min │
└───────────────────┘       └───────────────────┘       └───────────────────┘

UX ANNOTATIONS:
├── Country selection auto-configures: currency, tax, payment methods, language
├── Phone OTP (not email) — most Asian restaurant owners don't use email
├── Menu setup has 3 options: Photo (AI extracts), Voice (AI creates), Manual
├── Photo menu: owner photographs their existing paper/board menu → AI reads it
├── Voice: "Add chicken momo steamed Rs 200" → AI creates item with category
├── Total onboarding target: < 5 minutes from start to first order
├── Restaurant type auto-suggests relevant features (QSR vs fine dining)
├── Tax auto-configured based on country selection
└── "Take 1st Order" button goes directly to POS screen
```

---

## 16. NAVIGATION STRUCTURE

### Mobile App (Phone)
```
┌─────────────────────────────────┐
│  BOTTOM NAVIGATION (5 tabs)     │
│                                 │
│  🏠      📊      🤖     📦    ⚙️ │
│  Home   Reports  AI   Stock  More│
│                                 │
│  "More" expands to:             │
│  ├── 👥 Staff                   │
│  ├── 🌟 Customers               │
│  ├── 📒 Khata                   │
│  ├── 🛵 Delivery                │
│  ├── 📅 Reservations            │
│  ├── ⚙️ Settings                │
│  └── 🔒 Logout                  │
└─────────────────────────────────┘
```

### Tablet App (POS)
```
┌─────────────────────────────────┐
│  SIDE NAVIGATION (Left bar)     │
│                                 │
│  🍽️ POS (Order Taking)          │
│  🪑 Tables                      │
│  📋 Orders (History)            │
│  🍳 Kitchen (KDS)               │
│  📦 Inventory                   │
│  👥 Staff                       │
│  💰 Billing                     │
│  🌟 Customers                   │
│  📊 Reports                     │
│  ⚙️ Settings                    │
└─────────────────────────────────┘
```

### Web Dashboard
```
┌─────────────────────────────────┐
│  SIDEBAR NAVIGATION             │
│                                 │
│  📊 Dashboard                   │
│  📋 Orders                      │
│  🍽️ Menu Management             │
│  🪑 Tables & Spaces             │
│  📦 Inventory                   │
│  👥 Staff & Payroll             │
│  🌟 Customers & Loyalty         │
│  📒 Khata                       │
│  🛵 Delivery                    │
│  📅 Reservations                │
│  📢 Marketing                   │
│  🤖 AI Assistant                │
│  📊 Analytics                   │
│  🔗 Integrations                │
│  ⚙️ Settings                    │
│  ────────                       │
│  🏪 Multi-Branch (Enterprise)   │
│  💰 RestroVerse Capital         │
└─────────────────────────────────┘
```

---

## 17. OFFLINE MODE INDICATORS

```
ONLINE:                    SYNCING:                   OFFLINE:
┌──────────────┐           ┌──────────────┐           ┌──────────────��
│ 🟢 Online    │           │ 🟡 Syncing...│           │ 🔴 Offline   │
│              │           │ 3 pending    │           │ All features │
│ All synced   │           │              │           │ work locally │
└──────────────┘           └──────────────┘           └──────────────┘

RECONNECTING:              LOW BATTERY:
┌──────────────┐           ┌──────────────┐
│ 🔄 Reconnect │           │ 🪫 15%       │
│ Trying...    │           │ Battery save │
│ Data is safe │           │ mode ON      │
└──────────────┘           └──────────────┘

DESIGN RULES:
├── Status indicator always visible in header bar
├── Offline: full functionality, no user interruption
├── Sync indicator shows count of pending items
├── Never show error modals for connectivity — just status badges
├── Battery save: dims screen, reduces animations, pauses background sync
└── All data queued locally — nothing ever lost
```

---

*End of Wireframe Specification*
*Next: System Architecture & Database Schema*
