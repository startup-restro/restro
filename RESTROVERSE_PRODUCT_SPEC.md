# RESTROVERSE - Product Specification & Vision Document
### *The Operating System for Every Asian Restaurant*

> **Version:** 1.0 | **Date:** May 27, 2026
> **Target Markets:** Nepal, India, Bangladesh, Sri Lanka, Myanmar, SE Asia
> **Philosophy:** Offline-first. AI-native. Asia-built. Restaurant-obsessed.

---

## TABLE OF CONTENTS

1. [Founder's Thesis](#1-founders-thesis)
2. [Market Analysis & Gaps](#2-market-analysis--gaps)
3. [Product Architecture](#3-product-architecture)
4. [Feature Specification](#4-feature-specification)
5. [AI Engine](#5-ai-engine---restro-brain)
6. [System Design & Flow](#6-system-design--flow)
7. [Monetization Strategy](#7-monetization-strategy)
8. [Go-To-Market](#8-go-to-market)
9. [Competitive Edge Matrix](#9-competitive-edge-matrix)
10. [Technical Stack](#10-technical-stack)
11. [Phased Roadmap](#11-phased-roadmap)

---

## 1. FOUNDER'S THESIS

### The Problem Nobody Is Solving

There are **8+ million restaurants** across Nepal, India, Bangladesh, and SE Asia. Over **90% are small to medium** — street food stalls, family dhabas, local cafes, momo shops, biryani corners. They share these brutal realities:

| Reality | Impact |
|---|---|
| Internet goes down 5-15 times/day | Cloud-only POS = dead POS |
| Power cuts are routine | Systems must survive brownouts |
| Staff can barely read English | Complex UIs = zero adoption |
| Owner runs the business from a $150 Android phone | iPad-based solutions are a joke here |
| Cash is king (60-80% of transactions) | Systems that ignore cash workflow fail |
| Tax rules change every budget season | Non-compliant = business shut down |
| Delivery aggregators take 25-35% commission | Restaurants bleed margin on every online order |
| No access to business credit/capital | Banks don't lend to small restaurants |
| Food waste is 20-30% in unmanaged kitchens | No tools exist to fix this at SMB scale |
| Owners manage by gut, not data | Zero analytics culture, but hungry for it |

### The Insight

**Every global POS (Toast, Square, Lightspeed) was built for Western infrastructure, Western pricing, and Western restaurant workflows.** They don't work in Asia — not because of features, but because of *assumptions*:

- They assume stable internet
- They assume credit card payments
- They assume $500+/mo software budgets
- They assume English-literate staff
- They assume reliable power
- They assume formal restaurant formats

**We build for the opposite of every assumption.**

### The Vision

> **RestroVerse is the "operating system" for Asian restaurants — from a momo cart in Kathmandu to a 50-table biryani house in Hyderabad to a bubble tea chain in Dhaka.**

> It's offline-first, AI-native, runs on a $100 Android tablet, speaks your language, handles your tax, and costs less than a plate of dal bhat per day.

---

## 2. MARKET ANALYSIS & GAPS

### 2.1 Market Size

| Country | Restaurants (est.) | POS Penetration | Opportunity |
|---|---|---|---|
| India | 7.5M+ | ~8% | Massive greenfield |
| Nepal | 100K+ | ~5% | First-mover advantage with RestroX |
| Bangladesh | 800K+ | ~2% | Almost zero competition |
| Sri Lanka | 200K+ | ~4% | Post-crisis digital push |
| Myanmar | 300K+ | ~1% | Earliest stage |
| SE Asia (Vietnam, Cambodia, Laos) | 2M+ | ~6% | Fragmented, no local leader |

**Total addressable: ~11M+ restaurants. Even 1% = 110,000 paying customers.**

### 2.2 Competitive Landscape Gap Analysis

| Feature Area | Global Players (Toast/Square/LS) | Indian Players (Petpooja/POSist) | RestroVerse Edge |
|---|---|---|---|
| Offline capability | Basic (cache only) | Partial | **Full offline-first architecture** — works 100% without internet, syncs when back |
| Hardware requirement | Proprietary / iPad | Android but bloated | **Runs on ANY $80+ Android device** |
| Language support | English mainly | Hindi + English | **12+ Asian languages with icon-based UI** |
| AI features | Minimal | None | **AI-native from Day 1** |
| Pricing | $60-300/mo | $30-60/mo | **Starts FREE, premium at $5-15/mo** |
| Street food / cart support | None | None | **Purpose-built "Lite" mode** |
| Power outage resilience | No consideration | No consideration | **Battery-aware mode, auto-save, instant resume** |
| Cash workflow | Afterthought | Basic | **Cash-first design with denomination tracking** |
| Delivery aggregator integration | DoorDash/UberEats | Swiggy/Zomato | **All Asian aggregators + own direct ordering** |
| Owner financing | Lightspeed Capital (West only) | None | **RestroVerse Capital for Asia** |
| Tax compliance | US/EU focused | India GST only | **Multi-country tax engine (Nepal VAT, India GST, BD VAT)** |

### 2.3 The Gap Nobody Sees

**The street food / micro-restaurant segment (1-10 seats, 1-3 staff) is 70% of Asian F&B and has ZERO purpose-built technology.**

A momo vendor in Kathmandu, a pani puri cart in Mumbai, a kottu roti shop in Colombo — they all need:
- Simple billing (even just a receipt)
- Stock tracking (so they know what to buy tomorrow)
- Sales data (so they know what sells)
- Digital payment acceptance (UPI/eSewa/bKash)
- A way to build a customer base

**No one serves them. We will. This is our wedge.**

---

## 3. PRODUCT ARCHITECTURE

### 3.1 Product Tiers

```
┌─────────────────────────────────────────────────────────┐
│                    RESTROVERSE PLATFORM                  │
├─────────────┬──────────────────┬────────────────────────┤
│  LITE       │  PRO             │  ENTERPRISE            │
│  (Free)     │  ($5-15/mo)      │  (Custom)              │
├─────────────┼──────────────────┼────────────────────────┤
│ Street food │ Full restaurants │ Chains & franchises    │
│ Carts       │ Cafes            │ Cloud kitchens         │
│ Small shops │ Bars             │ Hotel restaurants      │
│ 1-3 staff   │ QSR              │ Multi-brand groups     │
│             │ Fine dining      │ 50+ locations          │
├─────────────┼──────────────────┼────────────────────────┤
│ • Billing   │ Everything in    │ Everything in Pro +    │
│ • QR menu   │ Lite +           │                        │
│ • Basic     │ • Full POS       │ • Central kitchen mgmt │
│   inventory │ • KDS/KOT        │ • Franchise controls   │
│ • Daily     │ • Inventory      │ • Custom API access    │
│   summary   │ • Staff mgmt     │ • White-label option   │
│ • UPI/eSewa │ • AI assistant   │ • Dedicated support    │
│ • SMS       │ • Analytics      │ • SLA guarantees       │
│   receipts  │ • Multi-table    │ • Multi-country tax    │
│             │ • Online ordering│ • Capital/lending      │
│             │ • Loyalty        │ • Advanced BI          │
│             │ • Delivery mgmt  │ • Bulk operations      │
│             │ • Reservations   │                        │
└─────────────┴──────────────────┴────────────────────────┘
```

### 3.2 Core Architecture Philosophy

```
┌──────────────────────────────────────────────────────────────┐
│                     DESIGN PRINCIPLES                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. OFFLINE-FIRST: Everything works without internet.        │
│     Cloud sync is a bonus, not a requirement.                │
│                                                              │
│  2. ICON-DRIVEN UI: A staff member who can't read English    │
│     should be able to take an order in under 30 seconds.     │
│                                                              │
│  3. 3-TAP RULE: Any common action (take order, print bill,  │
│     add item) must complete in 3 taps or fewer.              │
│                                                              │
│  4. CHEAP HARDWARE: Must run on a $80 Android 10+ device.    │
│     Optional: thermal printer ($25), cash drawer ($15).      │
│                                                              │
│  5. AI-EMBEDDED: AI is not a feature. It's the fabric.       │
│     Voice ordering, smart inventory, auto-insights.          │
│                                                              │
│  6. ASIA-NATIVE: Tax, payments, language, workflow —         │
│     everything is built for how Asia actually works.          │
│                                                              │
│  7. BATTERY-AWARE: Graceful degradation during power cuts.   │
│     Auto-save state. Resume instantly.                       │
│                                                              │
│  8. PROGRESSIVE: Start with billing only. Unlock features    │
│     as the restaurant grows. Never overwhelming.             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. FEATURE SPECIFICATION

### 4.1 ORDER MANAGEMENT

#### 4.1.1 Smart Order Flow
```
Customer arrives
     │
     ├── Dine-in ──→ Scan QR at table ──→ Browse menu ──→ Place order
     │                                                        │
     ├── Takeaway ──→ Counter order ──→ Quick billing          │
     │                                                        │
     ├── Delivery ──→ Direct / Aggregator ──→ Auto-assign      │
     │                                                        │
     ├── Reservation ──→ Pre-order option ──→ Table ready      │
     │                                                        │
     └── Kiosk ──→ Self-service screen ──→ Pay & wait          │
                                                              │
                                                    ┌─────────▼──────────┐
                                                    │   KITCHEN (KOT)    │
                                                    │   KDS Screen or    │
                                                    │   Printed ticket   │
                                                    └─────────┬──────────┘
                                                              │
                                                    ┌─────────▼──────────┐
                                                    │  ORDER READY       │
                                                    │  Notify customer   │
                                                    │  (SMS/WhatsApp/    │
                                                    │   screen/buzzer)   │
                                                    └─────────┬──────────┘
                                                              │
                                                    ┌─────────▼──────────┐
                                                    │  BILLING & PAY     │
                                                    │  Cash / Digital /  │
                                                    │  Split / Credit    │
                                                    └────────────────────┘
```

#### 4.1.2 Order Features
- **Real-time order tracking** across all channels on single screen
- **Voice ordering** (Nepali, Hindi, English) — staff speaks, AI creates order
- **Smart modifiers** — remember customer preferences ("no onion last time")
- **Order batching** — group similar items for kitchen efficiency
- **Running order** — keep adding to open table orders
- **Bill splitting** — by item, by person, by percentage, custom
- **Multi-channel merge** — dine-in customer also orders delivery for home = one bill
- **Order priority tags** — VIP, rush, allergy alert
- **Offline queue** — orders stack locally, fire to kitchen when device syncs

#### 4.1.3 Self-Service Kiosk Mode
- Same Android tablet becomes a customer-facing kiosk
- Picture-heavy menu with animations
- Multi-language customer selection
- Works for QSR, canteens, food courts
- **Cost: $0 extra** (just an app mode toggle)

---

### 4.2 MENU MANAGEMENT

#### 4.2.1 AI Menu Builder
```
Owner says (voice/text): "Add chicken momo, Rs 200, 
                          steamed and fried variants"

AI creates:
  ├── Item: Chicken Momo
  ├── Category: Auto-assigned to "Momos"
  ├── Base Price: Rs 200
  ├── Variants: Steamed (Rs 200), Fried (Rs 220)
  ├── Suggested add-ons: Extra chutney (Rs 20), Jhol (Rs 30)
  ├── Estimated food cost: Rs 65 (32.5%)
  ├── Suggested images: 3 AI-generated/stock photos
  └── Auto-linked to inventory ingredients
```

#### 4.2.2 Menu Features
- **Photo menu with AI image generation** — take a rough photo, AI enhances it
- **Dynamic pricing** — auto-adjust based on demand, time, season
- **Menu scheduling** — breakfast menu auto-switches to lunch at 11AM
- **Combo builder** — create meal deals with drag-and-drop
- **Multi-language menu** — one menu, auto-translated to customer's language
- **QR menu with ordering** — customer scans, orders, pays from phone
- **Nutrition calculator** — auto-calculate from recipe ingredients
- **86'd items** — one tap to mark item as unavailable across all channels
- **Menu performance scoring** — AI rates each item: popularity + profitability
- **Seasonal menu suggestions** — AI recommends based on local festivals/seasons

---

### 4.3 TABLE & SPACE MANAGEMENT

- **Visual floor plan editor** — drag-and-drop tables, sections, outdoor areas
- **Real-time table status** — available / occupied / reserved / being cleaned
- **Auto table assignment** — AI suggests optimal seating based on party size & server load
- **Merge/split tables** — for large groups
- **Table timer** — track dwell time, nudge for dessert/bill
- **Waitlist with SMS/WhatsApp notification** — "Your table is ready!"
- **Reservation calendar** — with pre-order and deposit option
- **Section assignment** — auto-balance server workload
- **Outdoor/rooftop/cabin management** — multiple spaces per restaurant

---

### 4.4 KITCHEN MANAGEMENT

#### 4.4.1 KDS (Kitchen Display System)
```
┌────────────────────────────────────────────────────┐
│              KITCHEN DISPLAY SYSTEM                 │
├────────────┬────────────┬────────────┬─────────────┤
│  NEW (3)   │ COOKING(5) │ READY (2)  │ SERVED (12) │
├────────────┼────────────┼────────────┼─────────────┤
│ Table 7    │ Table 3    │ Table 12   │ Table 1     │
│ 🔴 2 min   │ 🟡 8 min   │ 🟢 Ready   │ ✅ Done     │
│            │            │            │             │
│ Momo x2    │ Thali x1   │ Coffee x3  │ ...         │
│ Chow x1   │ Biryani x2 │            │             │
│ ⚠️ NO ONION│ 🌶️ Extra   │            │             │
│            │ spicy      │            │             │
│ [START]    │ [READY]    │ [SERVED]   │             │
└────────────┴────────────┴────────────┴─────────────┘
│                                                    │
│  ⏱️ Avg prep time: 12 min  │  🔥 Rush hour mode ON │
│  📊 Kitchen efficiency: 87% │  👨‍🍳 3 staff active   │
└────────────────────────────────────────────────────┘
```

#### 4.4.2 Kitchen Features
- **Station-wise routing** — send drinks to bar, mains to kitchen, dessert to pastry
- **Prep time tracking** — learn actual prep times per dish, predict wait times
- **Ingredient alert** — if stock of an ingredient is low, highlight affected dishes
- **Rush hour mode** — auto-prioritize, batch similar orders
- **Recipe display** — new cook can see recipe steps on KDS
- **Color-coded urgency** — red (overdue), yellow (in progress), green (ready)
- **Voice alerts** — "Order 47 is ready for Table 7!" in local language
- **Print KOT** — for kitchens without screens (thermal printer fallback)
- **Multi-kitchen sync** — central kitchen + satellite kitchens for chains

---

### 4.5 BILLING & PAYMENTS

#### 4.5.1 Asia-Native Payment Support

```
┌─────────────────────────────────────────────────┐
│              PAYMENT METHODS                     │
├──────────────┬──────────────────────────────────┤
│ NEPAL        │ eSewa, Khalti, FonePay,          │
│              │ ConnectIPS, IME Pay, Cash         │
├──────────────┼──────────────────────────────────┤
│ INDIA        │ UPI (PhonePe, GPay, Paytm,       │
│              │ BHIM), RuPay, Cash, Cards         │
├──────────────┼──────────────────────────────────┤
│ BANGLADESH   │ bKash, Nagad, Rocket, Cash        │
├──────────────┼──────────────────────────────────┤
│ SRI LANKA    │ LankaQR, FriMi, Cash, Cards       │
├──────────────┼──────────────────────────────────┤
│ SE ASIA      │ GCash, GrabPay, MoMo,             │
│              │ TrueMoney, Cash                    │
├──────────────┼──────────────────────────────────┤
│ UNIVERSAL    │ Visa/MC, Cash, Credit/Tab          │
└──────────────┴──────────────────────────────────┘
```

#### 4.5.2 Billing Features
- **One-tap billing** — auto-calculate total from order, generate bill
- **Tax compliance engine** — Nepal IRD / India GST / BD VAT auto-applied
- **Split payment** — half cash, half UPI = no problem
- **Customer credit (Khata/Udhaar)** — track who owes what (CRITICAL for Asia)
- **Denomination tracker** — cash drawer tracks Rs 10/20/50/100/500/1000 notes
- **Digital receipt** — SMS / WhatsApp / QR code receipt (save paper)
- **Tipping** — custom tip on digital payment, pooled tips distribution
- **Discount engine** — percentage, flat, happy hour, loyalty, coupon codes
- **Multi-currency** — for tourist areas (auto FX rate)
- **Service charge toggle** — apply/remove per order
- **Round-off handling** — automatic based on local convention
- **End-of-day settlement** — cash vs digital reconciliation with one tap

#### 4.5.3 Khata System (Credit Book) — *Asia's Killer Feature*
```
┌─────────────────────────────────────────────┐
│  KHATA / CREDIT BOOK                        │
│                                             │
│  Ram Bahadur              Total Due: Rs 2,450│
│  ├── May 15: Lunch (Rs 350)     ✓ Paid      │
│  ├── May 18: Tea + snacks (Rs 150) ✓ Paid   │
│  ├── May 22: Dinner (Rs 800)    ⏳ Pending   │
│  ├── May 25: Lunch (Rs 450)     ⏳ Pending   │
│  └── May 27: Breakfast (Rs 700) ⏳ Pending   │
│                                             │
│  [Send Reminder via WhatsApp]               │
│  [Record Payment]  [Settle Full Amount]     │
│                                             │
│  📊 This customer: Avg Rs 1,200/week         │
│  ⚠️ Credit limit: Rs 5,000                   │
│  💡 AI: "Ram always pays on month-end"       │
└─────────────────────────────────────────────┘
```
This is how **millions** of Asian restaurants actually work. No global POS supports this natively.

---

### 4.6 INVENTORY MANAGEMENT

#### 4.6.1 Smart Inventory System
```
                    ┌──────────────┐
                    │  PURCHASE     │
                    │  ORDER        │◄── AI suggests what to buy
                    └──────┬───────┘    based on demand forecast
                           │
                    ┌──────▼───────┐
                    │  RECEIVE &   │
                    │  VERIFY      │◄── Scan invoice photo → auto-entry
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  STOCK       │
                    │  STORAGE     │◄── Real-time quantity tracking
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──┐  ┌──────▼──┐  ┌─────▼────┐
       │ RECIPE  │  │ WASTE   │  │ TRANSFER │
       │ CONSUME │  │ LOG     │  │ (Branch) │
       └─────────┘  └─────────┘  └──────────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼───────┐
                    │  ANALYTICS   │
                    │  Food cost % │
                    │  Waste %     │
                    │  Trends      │
                    └──────────────┘
```

#### 4.6.2 Inventory Features
- **Photo-to-invoice** — photograph supplier bill, AI extracts items & prices
- **Recipe costing** — link ingredients to menu items, auto-calculate food cost
- **Auto-deduct on sale** — sell a momo plate, auto-subtract flour/chicken/spices
- **Low stock alerts** — WhatsApp/SMS notification to owner
- **AI demand forecast** — "You'll need 5kg chicken tomorrow (Saturday rush)"
- **Waste tracking** — log daily waste, AI identifies patterns
- **Supplier management** — track multiple vendors, compare prices
- **Purchase order generation** — one-tap PO based on AI suggestions
- **Expiry tracking** — FIFO alerts, "Use paneer today or waste"
- **Multi-unit support** — track in kg, liters, pieces, dozens
- **Central kitchen / commissary** — for chains: central prep → branch transfer
- **Cost variance alerts** — "Tomato price jumped 40% this week"

---

### 4.7 STAFF MANAGEMENT

- **Visual shift scheduler** — drag-and-drop weekly schedule
- **Attendance tracking** — clock in/out via app (GPS optional for delivery staff)
- **Role-based access** — owner / manager / cashier / waiter / kitchen / delivery
- **Performance dashboard** — orders handled, average bill, upsells, speed
- **Tip pooling & distribution** — automatic based on rules
- **Payroll calculator** — hours x rate + tips + OT - advances = payout
- **Salary advance tracking** — common in Asia, track advances against salary
- **Staff meal tracking** — log what staff eats (common perk in Asia)
- **Training modules** — AI-generated training for new staff
- **Multi-lingual staff UI** — waiter sees Nepali, kitchen sees Hindi, owner sees English
- **Biometric option** — fingerprint clock-in for larger restaurants

---

### 4.8 ANALYTICS & REPORTING

#### 4.8.1 Owner Dashboard (Mobile-First)
```
┌─────────────────────────────────────────────┐
│  📱 OWNER APP - Daily Snapshot              │
│                                             │
│  Today's Revenue         Rs 45,230  ↑12%    │
│  Orders                  67         ↑8%     │
│  Avg Order Value         Rs 675     ↑3%     │
│  Food Cost               31.2%      ↓2%     │
│                                             │
│  ┌─────────────────────────────────┐        │
│  │ Revenue Chart (7 days)    📈    │        │
│  │ ████ █████ ███ ████ █████ ██   │        │
│  │ Mon  Tue  Wed  Thu  Fri  Sat   │        │
│  └─────────────────────────────────┘        │
│                                             │
│  🔥 Top Sellers: Chicken Momo, Thali, Lassi │
│  💀 Poor Sellers: Pasta, Greek Salad         │
│  ⚠️ Low Stock: Chicken (2kg left)            │
│  💰 Pending Khata: Rs 12,400 (8 customers)   │
│                                             │
│  🤖 AI Says: "Consider removing Greek Salad  │
│     (2 orders/week, 45% food cost).          │
│     Add Paneer Momo instead — similar items  │
│     sell 8x more in your area."              │
│                                             │
│  [Open Full Dashboard] [Voice Ask AI]        │
└─────────────────────────────────────────────┘
```

#### 4.8.2 Report Types
- **Sales reports** — hourly, daily, weekly, monthly, yearly
- **Item-wise P&L** — profit per menu item
- **Staff performance** — who sells more, who's faster
- **Customer analytics** — new vs returning, frequency, avg spend
- **Waste report** — daily waste log with cost impact
- **Tax reports** — IRD/GST-ready formatted reports
- **Cash flow** — money in vs money out, daily balance
- **Inventory valuation** — total stock worth at any point
- **Peak hour analysis** — when are you busiest, when are you overstaffed
- **Benchmarking** — compare vs similar restaurants in your area (anonymized)
- **Custom reports** — AI generates any report you ask for in plain language

---

### 4.9 CUSTOMER & LOYALTY

#### 4.9.1 Loyalty System
```
Customer Flow:
  First visit → Auto-create profile (phone number)
       │
       ▼
  Earn points on every order (1 Rs = 1 point)
       │
       ▼
  Redeem rewards:
    ├── 500 pts = Free drink
    ├── 1000 pts = Rs 100 off
    ├── 2000 pts = Free meal
    └── Custom tiers (Silver/Gold/Platinum)
       │
       ▼
  WhatsApp engagement:
    ├── Birthday offers (auto-detected from profile)
    ├── "We miss you" (no visit in 2 weeks)
    ├── Festival offers (auto-triggered: Dashain, Diwali, Eid)
    └── Referral rewards ("Bring a friend, get Rs 100")
```

#### 4.9.2 Customer Features
- **Phone-number based profiles** — no app download needed
- **Visit history** — every order linked to customer
- **Preference memory** — "Ram likes extra spicy, no cilantro"
- **Feedback collection** — post-meal WhatsApp survey
- **Google Review nudge** — happy customer? Auto-prompt for Google review
- **Customer segmentation** — regulars, high-spenders, at-risk, new
- **WhatsApp marketing** — broadcast offers to segments (approved templates)
- **Referral system** — customers share QR, earn rewards when friend visits
- **Digital receipts with promo** — receipt includes next-visit offer

---

### 4.10 ONLINE ORDERING & DELIVERY

#### 4.10.1 Own Ordering Channel
```
┌────────────────────────────────────────────────┐
│  RESTROVERSE DIRECT ORDERING                   │
│                                                │
│  Customer visits: yourrestaurant.restroverse.com│
│  OR scans QR code OR WhatsApp bot              │
│                                                │
│  ┌──────────────────────────────────┐          │
│  │ Browse menu (with photos)        │          │
│  │ Add to cart                      │          │
│  │ Choose: Delivery / Pickup        │          │
│  │ Pay: UPI / eSewa / Cash on Delivery│        │
│  │ Track order in real-time          │          │
│  └──────────────────────────────────┘          │
│                                                │
│  💡 ZERO commission (vs 25-35% on aggregators) │
│  📱 Works via WhatsApp — no app install needed  │
│  🔗 Own branded link / mini-website             │
└────────────────────────────────────────────────┘
```

#### 4.10.2 Aggregator Integration
- **Unified dashboard** — Foodmandu, Pathao Food (Nepal), Swiggy, Zomato (India), Foodpanda (BD/Asia) — all on one screen
- **Auto-accept rules** — accept orders automatically based on kitchen capacity
- **Menu sync** — update once, push to all platforms
- **Smart routing** — if own delivery available, route to own driver (save commission)
- **Aggregator analytics** — commission paid, margin per order, which platform is profitable

#### 4.10.3 WhatsApp Ordering Bot
```
Customer: "Hi, I want to order"
Bot: "Welcome to Momo House! 🎉 Here's our menu: [link]
      Or tell me what you'd like!"
Customer: "2 chicken momo and 1 thukpa"
Bot: "Got it! 
      • Chicken Momo x2 — Rs 400
      • Thukpa x1 — Rs 250
      Total: Rs 650
      
      Delivery or pickup?
      📍 Your saved address: Lazimpat, Kathmandu"
Customer: "Delivery"
Bot: "Pay via eSewa/Khalti or Cash on Delivery?
      Estimated delivery: 35 min 🛵"
```

---

### 4.11 DELIVERY MANAGEMENT

- **Own driver management** — assign, track GPS, optimize routes
- **Delivery zone mapping** — draw delivery areas, set fees per zone
- **Rider app** — separate app for delivery staff (navigation, order details, POD)
- **Delivery time estimation** — AI predicts based on distance + kitchen load
- **Proof of delivery** — photo + customer OTP confirmation
- **Cash collection tracking** — how much cash each rider is carrying
- **Third-party rider integration** — if no own riders, use Pathao/Dunzo riders

---

### 4.12 MULTI-LOCATION / FRANCHISE

- **Centralized dashboard** — all branches on one screen
- **Standardized menu** — push menu changes to all branches instantly
- **Branch comparison** — which location performs better
- **Central kitchen** — manage prep & distribution to branches
- **Franchise controls** — franchisor sets rules, franchisee operates within
- **Inter-branch transfer** — move stock between locations
- **Consolidated reporting** — P&L by branch, combined P&L
- **Role hierarchy** — franchise owner > branch manager > staff

---

### 4.13 CATERING & EVENTS

- **Catering order workflow** — large orders with advance booking
- **Custom menu packages** — per-plate pricing, buffet pricing
- **Event calendar** — track upcoming catering commitments
- **Advance payment tracking** — deposits, milestones
- **Catering kitchen planning** — auto-scale recipes for 100/500/1000 people
- **Post-event billing** — detailed invoice with itemization

---

## 5. AI ENGINE - "RESTRO BRAIN"

### 5.1 Architecture

```
┌──────────────────────────────────────────────────────┐
│                   RESTRO BRAIN AI                     │
│                                                      │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ VOICE      │  │ VISION       │  │ LANGUAGE     │ │
│  │ ENGINE     │  │ ENGINE       │  │ ENGINE       │ │
│  │            │  │              │  │              │ │
│  │ • Nepali   │  │ • Invoice    │  │ • 12+ Asian  │ │
│  │ • Hindi    │  │   scanning   │  │   languages  │ │
│  │ • English  │  │ • Food photo │  │ • Menu       │ │
│  │ • Bengali  │  │   enhance    │  │   translation│ │
│  │            │  │ • Waste ID   │  │ • Report     │ │
│  │ Voice →    │  │              │  │   generation │ │
│  │ Order      │  │ Photo →      │  │              │ │
│  │            │  │ Data         │  │ Question →   │ │
│  └────────────┘  └──────────────┘  │ Answer       │ │
│                                    └──────────────┘ │
│  ┌────────────────────────────────────────────────┐  │
│  │            PREDICTION ENGINE                   │  │
│  │                                                │  │
│  │  • Demand forecasting (what to prep tomorrow)  │  │
│  │  • Price optimization (dynamic pricing)        │  │
│  │  • Staff scheduling (who to call in)           │  │
│  │  • Waste prediction (what will expire)         │  │
│  │  • Customer churn (who's about to leave)       │  │
│  │  • Menu engineering (what to add/remove)       │  │
│  │  • Cash flow forecast (will you be short?)     │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │            AUTOMATION ENGINE                   │  │
│  │                                                │  │
│  │  • Auto-generate purchase orders               │  │
│  │  • Auto-reply to customer queries              │  │
│  │  • Auto-adjust menu prices                     │  │
│  │  • Auto-send marketing campaigns               │  │
│  │  • Auto-schedule staff based on forecast        │  │
│  │  • Auto-flag anomalies (theft, waste, errors)   │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### 5.2 AI Features Detail

| Feature | What It Does | Why It Matters |
|---|---|---|
| **Voice Ordering** | Staff speaks "2 chicken momo, 1 thukpa for table 5" → auto-creates order | Illiterate staff can use the system |
| **Chat with Data** | Owner asks "How much did I earn last Dashain week?" → instant answer | No need to learn analytics tools |
| **Photo Invoice** | Photograph supplier bill → auto-create purchase entry | Saves 30 min/day for small restaurants |
| **Demand Forecast** | "Tomorrow is Saturday + holiday, prep 30% more chicken" | Reduce waste, avoid stockouts |
| **Menu Doctor** | "Your Pasta sells 2/week at 45% food cost. Replace with Chilli Chicken — similar restaurants sell 15/week at 28% cost" | Data-driven menu optimization |
| **Smart Pricing** | Auto-suggest price changes based on ingredient cost fluctuations | Protect margins automatically |
| **Customer Win-back** | "Ram hasn't visited in 14 days. Send him his favorite: 20% off Chicken Momo?" | Automated retention |
| **Theft Detection** | "Void rate for cashier Sita is 3x average. Investigate." | Loss prevention |
| **Prep Assistant** | "Based on reservations + forecast: prep 200 momos, 50 thalis, 30 biryanis for tonight" | Kitchen planning |
| **Food Photo Enhance** | Owner takes rough photo of dish → AI enhances for menu | Professional menus without photographer |

---

## 6. SYSTEM DESIGN & FLOW

### 6.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ POS App  │ │ Owner    │ │ Kitchen  │ │ Waiter   │          │
│  │ (Android │ │ App      │ │ Display  │ │ App      │          │
│  │  Tablet) │ │ (Mobile) │ │ (KDS)    │ │ (Phone)  │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       │            │            │            │                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Customer │ │ Delivery │ │ WhatsApp │ │ Kiosk    │          │
│  │ Web      │ │ Rider    │ │ Bot      │ │ Mode     │          │
│  │ (QR/Web) │ │ App      │ │          │ │          │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       │            │            │            │                  │
└───────┼────────────┼────────────┼────────────┼──────────────────┘
        │            │            │            │
        └────────────┴────────────┴────────────┘
                           │
                    ┌──────▼───────┐
                    │  LOCAL SYNC  │ ◄── Offline-first layer
                    │  ENGINE      │     SQLite + CRDT
                    │  (On Device) │
                    └──────┬───────┘
                           │ (when online)
                    ┌──────▼───────┐
                    │   API        │
                    │   GATEWAY    │ ◄── REST + WebSocket + gRPC
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────────┐
        │                  │                      │
┌───────▼──────┐  ┌────────▼───────┐  ┌───────────▼──────┐
│ CORE         │  │ AI / ML        │  │ INTEGRATIONS     │
│ SERVICES     │  │ SERVICES       │  │                  │
│              │  │                │  │ • Payment GWs    │
│ • Order      │  │ • NLP/Voice    │  │ • Delivery APIs  │
│ • Menu       │  │ • Forecasting  │  │ • Tax/IRD/GST    │
│ • Inventory  │  │ • Vision (OCR) │  │ • WhatsApp API   │
│ • Billing    │  │ • Recommender  │  │ • SMS gateways   │
│ • Customer   │  │ • Anomaly Det  │  │ • Accounting     │
│ • Staff      │  │               │  │ • Aggregators    │
│ • Analytics  │  │               │  │                  │
└───���───┬──────┘  └────────┬───────┘  └───────────┬──────┘
        │                  │                      │
        └──────────────────┼──────────────────────┘
                           │
                    ┌──────▼───────┐
                    │  DATA LAYER  │
                    │              │
                    │ PostgreSQL   │
                    │ Redis        │
                    │ ClickHouse   │ (analytics)
                    │ S3/MinIO     │ (media)
                    │ Vector DB    │ (AI embeddings)
                    └──────────────┘
```

### 6.2 Offline-First Sync Architecture

```
┌──────────────────────────────────────────────────────┐
│                OFFLINE-FIRST ENGINE                   │
│                                                      │
│  DEVICE (Android/Web)                                │
│  ┌────────────────────────────────────┐              │
│  │  SQLite Local DB                   │              │
│  │  ┌─────────┐  ┌─────────┐         │              │
│  │  │ Orders  │  │ Menu    │         │              │
│  │  │ (local) │  │ (cache) │         │              │
│  │  └─────────┘  └─────────┘         │              │
│  │  ┌─────────┐  ┌─────────┐         │              │
│  │  │ Bills   │  │ Stock   │         │              │
│  │  │ (local) │  │ (cache) │         │              │
│  │  └─────────┘  └─────────┘         │              │
│  │                                    │              │
│  │  CRDT Sync Engine                  │              │
│  │  ┌──────────────────────────┐      │              │
│  │  │ • Conflict-free replicas │      │              │
│  │  │ • Operational transforms │      │              │
│  │  │ • Auto-merge on connect  │      │              │
│  │  │ • Queue outbound changes │      │              │
│  │  └──────────────────────────┘      │              │
│  └──────────────────┬─────────────────┘              │
│                     │                                │
│    ──── INTERNET ───┼─── (available? sync!) ────     │
│                     │                                │
│  ┌──────────────────▼─────────────────┐              │
│  │  CLOUD                             │              │
│  │  • Receive changes                 │              │
│  │  • Resolve conflicts (LWW + CRDT)  │              │
│  │  • Push updates to other devices   │              │
│  │  • Run AI/analytics on full data   │              │
│  └────────────────────────────────────┘              │
│                                                      │
│  KEY GUARANTEE: Restaurant can run ALL DAY offline.  │
│  When internet returns, everything syncs seamlessly. │
└──────────────────────────────────────────────────────┘
```

### 6.3 Multi-Device Sync Flow
```
POS Tablet ◄──────┐
                   │
Waiter Phone ◄─────┤
                   ├── Local WiFi Mesh (no internet needed!)
Kitchen KDS ◄──────┤
                   │
Owner Phone ◄──────┘
                   
All devices sync via local network.
Cloud sync happens when internet is available.
```

---

## 7. MONETIZATION STRATEGY

### 7.1 Revenue Streams

```
┌─────────────────────────────────────────────────────────────┐
│                   REVENUE MODEL                              │
│                                                             │
│  ┌──────────────────┐                                       │
│  │ 1. SUBSCRIPTIONS │  Core recurring revenue               │
│  │    (SaaS)        │                                       │
│  │                  │  Lite:  FREE (ad-supported)            │
│  │                  │  Pro:   $5-15/mo (by country)          │
│  │                  │  Ent:   $50-200/mo (custom)            │
│  └──────────────────┘                                       │
│                                                             │
│  ┌──────────────────┐                                       │
│  │ 2. PAYMENTS      │  Transaction fee on digital payments  │
│  │    PROCESSING    │  0.5-1.5% per transaction             │
│  │                  │  (Lower than aggregators!)             │
│  └──────────────────┘                                       │
│                                                             │
│  ┌──────────────────┐                                       │
│  │ 3. MARKETPLACE   │  Connect restaurants with:            │
│  │                  │  • Suppliers (commission on orders)    │
│  │                  │  • Equipment vendors                   │
│  │                  │  • Service providers                   │
│  └──────────────────┘                                       │
│                                                             │
│  ┌──────────────────┐                                       │
│  │ 4. CAPITAL       │  Small business lending               │
│  │    (RestroVerse  │  Revenue-based financing               │
│  │     Capital)     │  We see their sales data = low risk    │
│  └──────────────────┘                                       │
│                                                             │
│  ┌──────────────────┐                                       │
│  │ 5. DATA          │  Anonymized industry insights          │
│  │    SERVICES      │  Sold to FMCG, suppliers, investors    │
│  │                  │  (e.g., "Momo demand up 20% in KTM")   │
│  └──────────────────┘                                       │
│                                                             │
│  ┌──────────────────┐                                       │
│  │ 6. ADD-ONS       │  Premium features:                     │
│  │                  │  • WhatsApp bot ($3/mo)                │
│  │                  │  • Advanced AI ($5/mo)                 │
│  │                  │  • Marketing suite ($5/mo)             │
│  │                  │  • Multi-branch ($10/mo per branch)    │
│  └──────────────────┘                                       │
│                                                             │
│  ┌──────────────────┐                                       │
│  │ 7. HARDWARE      │  Sell pre-configured kits:             │
│  │    BUNDLES       │  • Starter: Tablet + Printer ($120)    │
│  │                  │  • Pro: + KDS + Cash drawer ($250)     │
│  │                  │  • Full: + Kiosk + Router ($400)       │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Pricing by Market

| Tier | Nepal | India | Bangladesh |
|---|---|---|---|
| **Lite** (Free) | Rs 0 | ₹0 | ৳0 |
| **Pro** | Rs 999/mo ($7.50) | ₹499/mo ($6) | ৳500/mo ($4.50) |
| **Pro+** | Rs 1,999/mo ($15) | ₹999/mo ($12) | ৳1,000/mo ($9) |
| **Enterprise** | Custom | Custom | Custom |

> **Pricing philosophy:** Less than one customer's average order per month.
> If your average order is Rs 500, software costs Rs 999/mo = 2 orders pay for it.

---

## 8. GO-TO-MARKET

### 8.1 Phase 1: Nepal (Months 1-6) — Home Turf

**Strategy: Land and expand from RestroX base**

```
Week 1-4:   Migrate RestroX users to RestroVerse Lite (free upgrade)
Week 5-8:   Launch "Free POS for every momo shop" campaign
Week 9-16:  Partner with eSewa/Khalti for co-branded launch
Week 17-24: Achieve 5,000 active restaurants in Nepal
```

**Tactics:**
- "Free forever" tier for small vendors (viral adoption)
- WhatsApp-based onboarding (send menu photos, we set it up)
- Partnership with restaurant associations
- Festival-based campaigns (Dashain, Tihar = restaurant peak season)
- YouTube tutorials in Nepali

### 8.2 Phase 2: India (Months 4-12) — Scale Play

**Strategy: Start with underserved Tier 2/3 cities**

```
Target: Pokhara-like cities in India
  • Jaipur, Lucknow, Patna, Bhubaneswar, Guwahati
  • 100K+ restaurants per city, minimal POS penetration
  • Price-sensitive, cash-heavy, Hindi/regional language
```

**Tactics:**
- UPI integration from Day 1 (mandatory in India)
- GST compliance built-in (major pain point)
- Hindi + 5 regional languages
- Partnership with local restaurant suppliers
- "Replace your billing book" campaign

### 8.3 Phase 3: Bangladesh & Beyond (Months 10-18)

- Bangladesh: Partner with bKash, target Dhaka restaurant scene
- Sri Lanka: Post-crisis digital adoption push
- Myanmar: Earliest stage, first-mover wins

---

## 9. COMPETITIVE EDGE MATRIX

### What Makes RestroVerse Unbeatable in Asia

| Edge | Us | Global Players | Indian Players |
|---|---|---|---|
| **Works 100% offline** | ✅ Full CRDT sync | ❌ Degraded | ⚠️ Limited |
| **$80 Android hardware** | ✅ | ❌ $500+ iPad | ⚠️ Need decent Android |
| **Voice ordering in Nepali/Hindi** | ✅ | ❌ | ❌ |
| **Khata (credit book)** | ✅ Native | ❌ | ❌ |
| **Street food / cart mode** | ✅ Purpose-built | ❌ | ❌ |
| **WhatsApp ordering bot** | ✅ | ❌ | ⚠️ Basic |
| **Photo-to-invoice AI** | ✅ | ❌ | ⚠️ Petpooja has basic |
| **< $10/mo pricing** | ✅ | ❌ ($60+) | ⚠️ ($20+) |
| **Multi-country tax** | ✅ Nepal+India+BD | ❌ Western taxes | ⚠️ India only |
| **Local payment gateways** | ✅ All Asian | ❌ | ⚠️ India only |
| **Festival-aware AI** | ✅ Dashain, Diwali, Eid | ❌ | ❌ |
| **Power outage resilience** | ✅ Battery-aware | ❌ | ❌ |
| **AI demand forecasting** | ✅ | ⚠️ Premium only | ❌ |
| **Local WiFi mesh sync** | ✅ No internet needed | ❌ | ❌ |
| **Free tier** | ✅ Fully functional | ⚠️ Very limited | ❌ |
| **Owner financing** | ✅ Revenue-based | ⚠️ West only | ❌ |

---

## 10. TECHNICAL STACK

### 10.1 Recommended Stack

| Layer | Technology | Why |
|---|---|---|
| **Mobile/POS App** | React Native + Expo | One codebase for Android POS, waiter app, owner app |
| **KDS App** | React Native (tablet) | Shared components with POS |
| **Web Dashboard** | Next.js 15 + React | Owner/admin web portal |
| **Customer Web** | Next.js (SSR) | QR menu, online ordering |
| **Offline DB** | WatermelonDB (SQLite) + CRDT | Offline-first with conflict resolution |
| **Local Sync** | Custom WebSocket mesh | Device-to-device on local WiFi |
| **API** | Node.js + Fastify (or Go) | High performance, async-native |
| **Primary DB** | PostgreSQL 16 | Reliable, extensible, row-level security |
| **Cache** | Redis / Dragonfly | Real-time order state, sessions |
| **Analytics DB** | ClickHouse | Fast aggregations for reports |
| **AI/ML** | Python + FastAPI | Voice, vision, NLP, forecasting |
| **AI Models** | OpenAI API + local Whisper | Voice recognition + LLM |
| **OCR** | Tesseract + custom model | Invoice scanning (Hindi/Nepali script) |
| **Media Storage** | S3 / MinIO | Menu photos, invoices |
| **Message Queue** | NATS / RabbitMQ | Async order processing, notifications |
| **WhatsApp** | WhatsApp Business API | Bot, notifications, marketing |
| **SMS** | Sparrow SMS (Nepal), MSG91 (India) | Local, cheap |
| **Payments** | eSewa/Khalti SDK, Razorpay | Country-specific |
| **Infra** | AWS / DigitalOcean | Start DO (cheaper), migrate as needed |
| **CI/CD** | GitHub Actions | Fast, free for open-source components |
| **Monitoring** | Grafana + Prometheus | Low-cost observability |

### 10.2 Key Technical Decisions

1. **CRDT for offline sync** — Conflict-free Replicated Data Types ensure that when 3 devices are offline taking orders, they merge perfectly when reconnected. No data loss. No conflicts.

2. **Local WiFi mesh** — POS tablet, kitchen KDS, and waiter phone sync over local WiFi without internet. Uses mDNS for discovery and WebSocket for real-time updates. This is our **unfair advantage**.

3. **Modular monolith (not microservices)** — Start with a well-structured monolith. Don't over-engineer. Split into services only when scale demands it (>50K restaurants).

4. **Edge AI** — Voice recognition and basic OCR run on-device using ONNX Runtime. No internet needed for core AI features. Cloud AI for advanced forecasting.

5. **Multi-tenant with Row-Level Security** — PostgreSQL RLS isolates restaurant data at the database level. Simple, secure, scalable.

---

## 11. PHASED ROADMAP

### Phase 1: Foundation (Months 1-3) — "WALK"
**Goal: Replace paper billing for 1,000 restaurants in Nepal**

- [ ] Core POS (order → kitchen → bill)
- [ ] Offline-first architecture with local sync
- [ ] Menu management (basic)
- [ ] Table management (basic)
- [ ] KOT printing (thermal printer)
- [ ] Nepal IRD-compliant billing
- [ ] eSewa + Khalti payment integration
- [ ] Cash management (drawer tracking)
- [ ] Basic daily sales report
- [ ] Android tablet app
- [ ] QR menu (view only)

### Phase 2: Growth (Months 4-6) — "RUN"
**Goal: Full restaurant management for 5,000 restaurants**

- [ ] KDS (Kitchen Display System)
- [ ] Inventory management (stock tracking, low alerts)
- [ ] Staff management (roles, shifts, attendance)
- [ ] Customer profiles (phone-based)
- [ ] Khata/credit book system
- [ ] WhatsApp notifications (order ready, bills)
- [ ] Owner mobile app with daily snapshot
- [ ] QR ordering (customer orders from phone)
- [ ] Basic analytics dashboard
- [ ] Waiter app (mobile order-taking)
- [ ] Multi-language UI (Nepali, Hindi, English)

### Phase 3: Intelligence (Months 7-9) — "FLY"
**Goal: AI-powered restaurant management, India launch**

- [ ] AI voice ordering (Nepali, Hindi)
- [ ] Photo-to-invoice (supplier bill scanning)
- [ ] AI demand forecasting
- [ ] Menu performance scoring (Menu Doctor)
- [ ] Recipe costing & food cost tracking
- [ ] Waste tracking & alerts
- [ ] Loyalty program
- [ ] WhatsApp ordering bot
- [ ] Online ordering (own website/link)
- [ ] Delivery management (own drivers)
- [ ] India GST billing
- [ ] UPI payment integration
- [ ] Benchmarking (compare vs peers)

### Phase 4: Platform (Months 10-14) — "SCALE"
**Goal: Become the platform, 25,000+ restaurants**

- [ ] Aggregator integration (Swiggy, Zomato, Foodmandu)
- [ ] Multi-location / franchise management
- [ ] Central kitchen / commissary
- [ ] Catering module
- [ ] Advanced marketing (campaigns, segmentation)
- [ ] Gift cards
- [ ] Supplier marketplace
- [ ] RestroVerse Capital (lending)
- [ ] Kiosk mode
- [ ] Advanced AI (theft detection, smart pricing)
- [ ] Bangladesh launch (bKash, local compliance)
- [ ] API for third-party integrations
- [ ] White-label option for enterprise

### Phase 5: Dominance (Months 15-24) — "OWN"
**Goal: The default restaurant OS for South Asia**

- [ ] AI business assistant (chat with your data)
- [ ] Predictive staffing
- [ ] Customer win-back automation
- [ ] Data services (anonymized insights for industry)
- [ ] Sri Lanka, Myanmar expansion
- [ ] Hardware partnerships (co-branded tablets)
- [ ] Restaurant academy (training content)
- [ ] Franchise marketplace (find franchise opportunities)
- [ ] Open plugin/extension system
- [ ] IPO / Series B readiness

---

## APPENDIX A: USER PERSONAS

### Persona 1: Ram (Street Momo Vendor, Kathmandu)
- **Age:** 35, **Education:** Class 10, **Language:** Nepali
- **Revenue:** Rs 15,000/day, **Staff:** 2 (wife + helper)
- **Pain:** No records, doesn't know profit, supplier cheats on weight
- **Need:** Simple billing, daily P&L, stock tracking
- **Device:** Android phone (Rs 12,000 Samsung)
- **Budget:** Rs 0-500/month
- **Tier:** LITE (Free)

### Persona 2: Sita (Cafe Owner, Pokhara)
- **Age:** 28, **Education:** Bachelor's, **Language:** Nepali + English
- **Revenue:** Rs 80,000/day, **Staff:** 8
- **Pain:** Staff theft, inventory waste, no customer data, delivery commission killing margins
- **Need:** Full POS, inventory, staff tracking, own online ordering
- **Device:** Android tablet + owner's iPhone
- **Budget:** Rs 1,000-2,000/month
- **Tier:** PRO

### Persona 3: Vikram (Restaurant Chain Owner, Delhi)
- **Age:** 42, **Education:** MBA, **Language:** Hindi + English
- **Revenue:** Rs 5,00,000/day across 5 locations, **Staff:** 60+
- **Pain:** No visibility across branches, inconsistent food quality, GST compliance nightmares
- **Need:** Multi-location dashboard, central kitchen, franchise controls
- **Device:** Mix of tablets and desktops
- **Budget:** Rs 10,000-25,000/month total
- **Tier:** ENTERPRISE

---

## APPENDIX B: KEY METRICS TO TRACK

| Metric | Target (Year 1) |
|---|---|
| Active restaurants | 10,000 |
| Monthly recurring revenue | $100,000 |
| Transaction volume processed | $10M/month |
| Daily active users (staff) | 30,000 |
| Retention (monthly) | >90% |
| Time to first order (onboarding) | <5 minutes |
| Offline reliability | 99.99% |
| Average revenue per restaurant | $10/month |
| Net Promoter Score | >60 |
| Countries live | 2 (Nepal + India) |

---

## APPENDIX C: RISK MITIGATION

| Risk | Mitigation |
|---|---|
| Low willingness to pay | Free tier hooks them; value proves itself; payment processing revenue as backup |
| Copycats in India | Move fast, build network effects (marketplace, data), brand loyalty |
| Internet infrastructure | Offline-first makes this our advantage, not our weakness |
| Regulatory changes | Modular tax engine; dedicated compliance team; auto-updates |
| Hardware fragmentation | Extensive testing on 50+ Android devices; graceful degradation |
| AI accuracy for local languages | Start with hybrid (AI + manual fallback); improve with data |
| Scale challenges | Modular monolith → microservices migration path planned |

---

> **This is not just a POS. This is the financial infrastructure layer for Asian restaurants.**
> **Whoever owns the billing owns the data. Whoever owns the data owns the restaurant's future.**
> **We're building the "Shopify for Restaurants" — but for the 90% of the world that Shopify forgot.**

---

*Document authored: May 27, 2026*
*Next step: Technical architecture deep-dive & wireframe design*
