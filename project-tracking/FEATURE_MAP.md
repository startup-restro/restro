# RestroVerse - Complete Feature Map

> **275 Functional Features + 35 Non-Functional Requirements + 18 Constraints**
> Organized by module. Phase tags: `P1` = Phase 1 (Nepal launch), `P2-P5` = later phases.

---

## 1. 🔐 Authentication & Onboarding (15 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 1 | Phone OTP login (no email required) | P1 | P0 |
| 2 | Country auto-config (Nepal/India/Bangladesh/Sri Lanka) — sets currency, tax, language, payments | P1 | P0 |
| 3 | Restaurant setup wizard (<2 min) | P1 | P0 |
| 4 | Menu setup via photo import (AI extracts items from paper menu photo) | P2 | P1 |
| 5 | Menu setup via voice ("Add chicken momo Rs 200 steamed and fried") | P2 | P1 |
| 6 | Menu setup manual entry | P1 | P0 |
| 7 | Staff invite via SMS | P1 | P0 |
| 8 | PIN-based staff switch on shared tablet (<2 sec) | P1 | P0 |
| 9 | Multi-device registration (up to 10 devices) | P1 | P0 |
| 10 | Signup to first order in <5 minutes | P1 | P0 |
| 11 | Auto tax configuration by country | P1 | P0 |
| 12 | Multi-language UI (English, Nepali, Hindi, Bengali) | P1 | P0 |
| 13 | Interactive tutorial walkthrough | P2 | P2 |
| 14 | Account/PIN recovery | P1 | P0 |
| 15 | Demo mode (pre-populated restaurant) | P2 | P2 |

---

## 2. 📋 Order Management (30 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 16 | Create dine-in order (linked to table) | P1 | P0 |
| 17 | Create takeaway order (auto-numbered) | P1 | P0 |
| 18 | Create delivery order (address, phone, zone) | P1 | P0 |
| 19 | Receive online orders (website, WhatsApp, aggregators) | P2 | P1 |
| 20 | Reservation pre-orders | P3 | P2 |
| 21 | One-tap add item to order (+/- quantity) | P1 | P0 |
| 22 | Variant selection (steamed/fried picker) | P1 | P0 |
| 23 | Modifier selection (spice level, add-ons) | P1 | P0 |
| 24 | Running orders (keep adding to open table) | P1 | P0 |
| 25 | Voice ordering (Nepali/Hindi/English, AI-parsed) | P3 | P1 |
| 26 | Order & item notes ("no onion", "extra spicy") | P1 | P0 |
| 27 | Priority tags (Normal, Rush ⚡, VIP ⭐, Allergy ⚠️) | P2 | P1 |
| 28 | Hold/pause order | P2 | P1 |
| 29 | Transfer order to different table | P1 | P0 |
| 30 | Duplicate/reorder from previous | P3 | P2 |
| 31 | Real-time multi-device sync (<2 sec) | P1 | P0 |
| 32 | Order history with search | P1 | P0 |
| 33 | Cancel order (manager auth + reason) | P1 | P0 |
| 34 | Void individual item (manager auth + reason) | P1 | P0 |
| 35 | Order batching for kitchen (group same items across tables) | P2 | P1 |
| 36 | Auto order numbering (sequential, resets daily) | P1 | P0 |
| 37 | Link order to customer profile (phone lookup) | P2 | P1 |
| 38 | Multi-channel merge (dine-in + delivery = one profile) | P3 | P2 |
| 39 | Offline order queue (auto-push on reconnect, zero data loss) | P1 | P0 |
| 40 | Split order into separate bills | P2 | P1 |
| 41 | "Order again" from history | P3 | P2 |
| 42 | Order time tracking (created -> kitchen -> ready -> served -> billed) | P1 | P0 |
| 43 | Order source tracking (POS, QR, WhatsApp, aggregator) | P1 | P0 |
| 44 | Guest count per order | P2 | P1 |
| 45 | Alert if order not sent to kitchen >5 min | P3 | P2 |

---

## 3. 🍽️ Menu Management (25 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 46 | CRUD categories (name, icon emoji, sort order) | P1 | P0 |
| 47 | CRUD menu items (name, description, price, photo, category) | P1 | P0 |
| 48 | Item variants (size, cooking method, price adjustments) | P1 | P0 |
| 49 | Item modifiers (spice level, add-ons, required/optional) | P1 | P0 |
| 50 | Combo/meal deals | P2 | P1 |
| 51 | Photo upload (camera + gallery) | P1 | P0 |
| 52 | AI photo enhancement (auto-improve food photos) | P3 | P2 |
| 53 | QR menu generation (unique per table) | P1 | P0 |
| 54 | Menu scheduling (breakfast/lunch/dinner auto-switch) | P2 | P1 |
| 55 | 86'd items (one-tap unavailable across all channels) | P1 | P0 |
| 56 | Dynamic pricing (happy hour, weekend, delivery markup) | P3 | P2 |
| 57 | Multi-language menu (auto-translate to customer's language) | P2 | P1 |
| 58 | Nutrition info (calories, allergens, dietary tags) | P3 | P2 |
| 59 | AI menu builder (suggest items by restaurant type & area) | P3 | P2 |
| 60 | Menu performance scoring (Stars/Plowhorses/Puzzles/Dogs) | P2 | P1 |
| 61 | Seasonal suggestions (festivals, weather, trends) | P3 | P2 |
| 62 | Bulk price update ("increase all by 5%") | P2 | P1 |
| 63 | Instant item search (<300ms) | P1 | P0 |
| 64 | Menu export (PDF, CSV, JSON) | P3 | P2 |
| 65 | Menu import (CSV/JSON) | P3 | P2 |
| 66 | Sort items (manual, popularity, price, newest) | P2 | P1 |
| 67 | Category visibility toggle | P1 | P0 |
| 68 | Item cost price (for food cost calculations) | P2 | P1 |
| 69 | Menu preview (see customer QR view before publishing) | P2 | P1 |
| 70 | Popular/New badge on items | P2 | P1 |

---

## 4. 🪑 Table & Space Management (15 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 71 | Visual floor plan editor (drag-and-drop) | P1 | P0 |
| 72 | Real-time table status (green/red/yellow/blue) | P1 | P0 |
| 73 | Table capacity tracking (seats) | P1 | P0 |
| 74 | Merge tables (large groups) | P2 | P1 |
| 75 | Split merged tables | P2 | P1 |
| 76 | Transfer order between tables | P1 | P0 |
| 77 | Walk-in waitlist (name, phone, party size, wait time) | P2 | P1 |
| 78 | Waitlist SMS/WhatsApp notification | P2 | P1 |
| 79 | Reservation calendar (prevent double-booking) | P2 | P1 |
| 80 | Reservation deposit tracking | P3 | P2 |
| 81 | Server/section assignment (balance workload) | P2 | P1 |
| 82 | Multi-floor support (Ground, First, Outdoor, Rooftop) | P1 | P0 |
| 83 | Table dwell time timer | P2 | P1 |
| 84 | AI auto-seat suggestion (party size + server load) | P3 | P2 |
| 85 | Cleaning timer + alert if >10 min | P3 | P2 |

---

## 5. 🍳 Kitchen / KDS (15 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 86 | KOT generation (thermal print + digital display) | P1 | P0 |
| 87 | KDS column view (New → Cooking → Ready → Served) | P1 | P0 |
| 88 | Station routing (drinks→bar, mains→kitchen, desserts→pastry) | P2 | P1 |
| 89 | Prep time tracking (actual time per ticket, avg per item) | P1 | P0 |
| 90 | Rush hour mode (auto-batch similar items) | P2 | P1 |
| 91 | Recipe display on KDS (tap item to see steps) | P3 | P2 |
| 92 | Color-coded urgency timer (white→yellow→red) | P1 | P0 |
| 93 | Sound alerts (new order bell, overdue beep, bump chime) | P1 | P0 |
| 94 | Low-stock ingredient warning on KDS | P2 | P1 |
| 95 | Multi-kitchen sync (central + satellite for chains) | P4 | P2 |
| 96 | KOT reprint | P1 | P0 |
| 97 | Bump bar support (hardware, hands-free) | P3 | P2 |
| 98 | Course firing (appetizers first, mains after delay) | P3 | P2 |
| 99 | KDS dark mode (default) | P1 | P0 |
| 100 | Live kitchen stats (avg prep, on-time %, queue depth) | P2 | P1 |

---

## 6. 💰 Billing & Payments (30 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 101 | One-tap billing (auto subtotal + tax + service charge + total) | P1 | P0 |
| 102 | Nepal VAT 13% compliance (IRD-compliant invoice) | P1 | P0 |
| 103 | India GST compliance (5%/18% slabs, GSTIN, HSN codes) | P3 | P0 |
| 104 | Bangladesh VAT 5% compliance | P4 | P1 |
| 105 | Split bill by item | P1 | P0 |
| 106 | Split bill equally among N guests | P1 | P0 |
| 107 | Split bill by percentage | P2 | P1 |
| 108 | Split bill by custom amount | P2 | P1 |
| 109 | Multi-payment per bill (Rs 500 cash + Rs 370 eSewa) | P1 | P0 |
| 110 | Cash handling (received amount, auto-calculate change) | P1 | P0 |
| 111 | Cash denomination tracking (notes count per drawer) | P2 | P1 |
| 112 | Digital receipt (SMS, WhatsApp, email) | P1 | P0 |
| 113 | Thermal print receipt (58mm + 80mm) | P1 | P0 |
| 114 | Discount: percentage (5/10/15/20/custom, role limits) | P1 | P0 |
| 115 | Discount: flat amount | P1 | P0 |
| 116 | Discount: coupon code validation | P2 | P1 |
| 117 | Discount: auto happy hour | P3 | P2 |
| 118 | Discount: loyalty points redemption | P2 | P1 |
| 119 | Discount: employee discount | P3 | P2 |
| 120 | **Khata credit system** (add bill to customer's tab) | P1 | P0 |
| 121 | Khata credit limit (warn + block) | P1 | P0 |
| 122 | Khata payment recording (cash/digital against balance) | P1 | P0 |
| 123 | Khata WhatsApp reminder | P2 | P1 |
| 124 | Digital tipping | P2 | P1 |
| 125 | Tip pool auto-distribution | P3 | P2 |
| 126 | Configurable service charge (0-15%, toggle per order) | P1 | P0 |
| 127 | Multi-currency (USD/EUR with auto FX for tourist areas) | P3 | P2 |
| 128 | Round-off (nearest 1/5/10, configurable) | P1 | P0 |
| 129 | EOD cash reconciliation (expected vs actual, discrepancy) | P1 | P0 |
| 130 | Void/refund (manager PIN, reason, audit logged) | P1 | P0 |

**Payment Gateways:**

| Gateway | Country | Phase |
|---------|---------|-------|
| eSewa | Nepal | P1 |
| Khalti | Nepal | P1 |
| FonePay | Nepal | P2 |
| ConnectIPS | Nepal | P2 |
| Razorpay (UPI, cards, wallets) | India | P3 |
| bKash | Bangladesh | P4 |
| Nagad | Bangladesh | P4 |
| Visa/MC cards | All | P3 |
| Cash | All | P1 |

---

## 7. 📦 Inventory Management (25 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 131 | Stock tracking (item, current qty, min threshold, unit) | P2 | P0 |
| 132 | Auto-deduct on sale (recipe-based ingredient subtraction) | P2 | P1 |
| 133 | Low stock alerts (push + WhatsApp to owner/manager) | P2 | P0 |
| 134 | Photo invoice scan (AI extracts line items from supplier bill photo) | P3 | P1 |
| 135 | Manual purchase entry (item, qty, cost, supplier, date) | P2 | P0 |
| 136 | AI purchase suggestions (demand forecast → auto PO) | P3 | P1 |
| 137 | Supplier management CRUD | P2 | P0 |
| 138 | Multi-supplier per item (price comparison) | P2 | P1 |
| 139 | Recipe management (link menu items → ingredient quantities) | P2 | P1 |
| 140 | Food cost % calculation per menu item | P2 | P1 |
| 141 | Waste logging (expired, damaged, over-prep, return + cost impact) | P2 | P0 |
| 142 | Expiry tracking with FIFO alerts | P2 | P1 |
| 143 | Physical stock count (actual vs expected, variance) | P2 | P0 |
| 144 | Inter-branch stock transfer | P4 | P2 |
| 145 | Supplier cost variance alerts (>10% price change) | P2 | P1 |
| 146 | Central kitchen / commissary management | P4 | P2 |
| 147 | Stock valuation report (total inventory worth) | P2 | P1 |
| 148 | Ingredient-level tracking | P2 | P1 |
| 149 | Configurable min stock per day (higher for weekends) | P2 | P1 |
| 150 | Purchase history per supplier (dates, items, costs, trends) | P2 | P1 |
| 151 | Batch/lot tracking (FIFO) | P3 | P2 |
| 152 | Auto PO from 3-day demand forecast | P3 | P1 |
| 153 | Full stock movement ledger (purchase, sale, waste, transfer, adjust) | P2 | P0 |
| 154 | Category filtering (produce, meat, dairy, dry goods, beverages) | P2 | P0 |
| 155 | Unit conversion (1kg=1000g, 1 dozen=12) | P2 | P1 |

---

## 8. 👥 Staff Management (20 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 156 | Staff profiles (name, phone, role, language, rate/salary) | P1 | P0 |
| 157 | Role-based access control (owner/manager/cashier/waiter/kitchen/delivery) | P1 | P0 |
| 158 | Per-user permission overrides | P2 | P1 |
| 159 | Visual shift scheduler (drag-and-drop weekly) | P2 | P1 |
| 160 | Clock in/out (app button, optional GPS) | P1 | P0 |
| 161 | Attendance report (present, absent, late, hours, OT) | P1 | P0 |
| 162 | Staff performance dashboard (orders, avg bill, upsells, speed) | P2 | P1 |
| 163 | Tip pooling & auto-distribution | P3 | P2 |
| 164 | Payroll calculator (hours × rate + tips + OT - advances) | P2 | P1 |
| 165 | Salary advance tracking | P1 | P0 |
| 166 | Staff meal tracking (cost separately) | P2 | P1 |
| 167 | AI training modules per role | P5 | P2 |
| 168 | Multi-language staff UI (each staff sees own language) | P1 | P0 |
| 169 | Biometric clock-in (fingerprint) | P4 | P2 |
| 170 | Staff announcements (manager posts visible to all) | P3 | P2 |
| 171 | Late/absence auto-alerts to manager | P2 | P1 |
| 172 | Overtime auto-calculation | P2 | P1 |
| 173 | Staff directory with quick-call | P1 | P0 |
| 174 | Access/login audit log | P1 | P0 |
| 175 | Deactivate staff (revoke access, preserve data) | P1 | P0 |

---

## 9. 🌟 Customer & Loyalty (25 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 176 | Phone-based customer profiles (no app download) | P1 | P0 |
| 177 | Visit history (all orders, total visits, total spent, avg) | P1 | P0 |
| 178 | Preference memory ("extra spicy", "no cilantro", "peanut allergy") | P2 | P1 |
| 179 | Loyalty points earning (configurable: 1pt per Rs 10) | P2 | P1 |
| 180 | Loyalty points redemption (100pts = Rs 50 off) | P2 | P1 |
| 181 | Loyalty tiers (Bronze → Silver → Gold → Platinum, auto-upgrade) | P2 | P1 |
| 182 | Auto birthday offer (WhatsApp) | P3 | P2 |
| 183 | Win-back campaign (14+ days no visit → auto offer) | P3 | P2 |
| 184 | Referral rewards (share QR, both earn) | P3 | P2 |
| 185 | Google Review nudge (after positive feedback) | P3 | P2 |
| 186 | Post-meal feedback collection (WhatsApp 1-5 stars) | P2 | P1 |
| 187 | Customer segmentation (regulars, high-spenders, at-risk, new) | P2 | P1 |
| 188 | WhatsApp marketing (broadcast to segments, approved templates) | P2 | P1 |
| 189 | Digital gift cards | P4 | P2 |
| 190 | Customer notes ("VIP - window table", "wife is vegetarian") | P2 | P1 |
| 191 | Customer analytics (new vs returning, frequency, spending trends) | P2 | P1 |
| 192 | Acquisition source tracking (walk-in, QR, WhatsApp, referral) | P3 | P2 |
| 193 | Do Not Disturb opt-out (respected across all channels) | P1 | P0 |
| 194 | Customer export (CSV) | P2 | P1 |
| 195 | Merge duplicate profiles (same phone) | P3 | P2 |
| 196 | Auto-track favorite items ("Your favorites" on QR menu) | P3 | P2 |
| 197 | Spending drop alert (regular customer declining) | P3 | P2 |
| 198 | Corporate accounts (special pricing, monthly invoicing) | P4 | P2 |
| 199 | Customer groups/tags ("Office Lunch Regulars", "Tourist") | P3 | P2 |
| 200 | Customer lifetime value calculation | P3 | P2 |

---

## 10. 🛵 Online Ordering & Delivery (25 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 201 | Branded ordering website (yourname.restroverse.com) | P2 | P0 |
| 202 | WhatsApp ordering bot | P3 | P1 |
| 203 | QR code in-restaurant ordering (scan, browse, order from phone) | P2 | P0 |
| 204 | Delivery zone config (draw on map, set fee + min order + ETA) | P2 | P1 |
| 205 | Own driver management (add riders, assign orders) | P2 | P1 |
| 206 | Rider GPS tracking (real-time on map) | P2 | P1 |
| 207 | AI delivery time estimation (distance + kitchen load + rider) | P2 | P1 |
| 208 | Proof of delivery (photo + OTP) | P2 | P1 |
| 209 | Cash on Delivery tracking (cash per rider, settlement) | P1 | P0 |
| 210 | Aggregator dashboard (Foodmandu, Swiggy, Zomato on one screen) | P4 | P1 |
| 211 | Aggregator menu sync (update once, push to all platforms) | P4 | P2 |
| 212 | Auto-accept rules (accept if kitchen queue below threshold) | P4 | P2 |
| 213 | Aggregator commission tracking (impact on margin) | P4 | P1 |
| 214 | Smart routing (own rider if available, else aggregator) | P4 | P2 |
| 215 | Kiosk mode (customer-facing self-service on same tablet) | P3 | P1 |
| 216 | Online payment integration (eSewa/Khalti/UPI/bKash) | P1 | P0 |
| 217 | Real-time order tracking page for customers | P2 | P1 |
| 218 | Delivery analytics (avg time, cost, orders by zone, rider perf) | P2 | P1 |
| 219 | Customer address book (save + auto-suggest) | P2 | P1 |
| 220 | One-tap repeat order | P2 | P1 |
| 221 | Scheduled/pre-orders (future date/time) | P3 | P2 |
| 222 | Delivery slot selection | P3 | P2 |
| 223 | Live rider-customer chat (no phone sharing) | P4 | P2 |
| 224 | Failed delivery handling (wrong address, no answer) | P2 | P1 |
| 225 | Delivery rating (1-5 stars → rider performance) | P3 | P2 |

---

## 11. 📊 Analytics & AI (25 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 226 | Daily dashboard (revenue, orders, avg order, food cost %, <2s load) | P1 | P0 |
| 227 | Sales report (hour/day/week/month/year + period comparison) | P1 | P0 |
| 228 | Item-wise P&L (qty sold, revenue, cost, profit, margin %) | P2 | P1 |
| 229 | Peak hour analysis (orders by hour, busiest/slowest) | P2 | P1 |
| 230 | Staff performance comparison | P2 | P1 |
| 231 | Waste report (daily/weekly/monthly, cost impact, by reason) | P2 | P1 |
| 232 | Cash flow report (money in vs out, daily balance) | P2 | P1 |
| 233 | Tax report (Nepal IRD format, India GSTR-1 format) | P1 | P0 |
| 234 | Benchmarking (compare vs similar restaurants in area, anonymized) | P3 | P2 |
| 235 | **AI Chat With Data** ("How much did I earn last Dashain?") | P3 | P2 |
| 236 | **AI Demand Forecast** (predict per-item demand for next 3 days) | P3 | P1 |
| 237 | **AI Menu Doctor** (Stars/Plowhorses/Puzzles/Dogs classification) | P3 | P1 |
| 238 | **AI Anomaly Detection** (high voids, cash discrepancy, after-hours) | P3 | P2 |
| 239 | **AI Smart Pricing** (adjust for ingredient cost, demand, competition) | P4 | P2 |
| 240 | **AI Staff Scheduling** (optimal schedule from demand prediction) | P4 | P2 |
| 241 | Custom report builder (select metrics, filters, grouping) | P3 | P2 |
| 242 | Report export (PDF, Excel, CSV) | P1 | P0 |
| 243 | Scheduled auto-reports (daily summary via WhatsApp/email) | P2 | P1 |
| 244 | Multi-branch comparison | P4 | P2 |
| 245 | Customer LTV report | P3 | P2 |
| 246 | Payment method analysis (cash vs digital trend) | P2 | P1 |
| 247 | Discount analysis (by type, by staff, abuse detection) | P2 | P1 |
| 248 | Revenue per table (dwell time vs revenue) | P3 | P2 |
| 249 | Hourly staff cost vs revenue | P3 | P2 |
| 250 | Real-time order feed (live across all channels) | P2 | P1 |

---

## 12. 🏢 Multi-Location / Franchise (15 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 251 | Multi-branch dashboard (all locations on one screen) | P4 | P1 |
| 252 | Standardized menu push (HQ → all branches, one click) | P4 | P1 |
| 253 | Branch comparison (side-by-side KPIs) | P4 | P1 |
| 254 | Central kitchen management (production orders → branch transfer) | P4 | P2 |
| 255 | Franchise controls (franchisor rules, franchisee operates within) | P4 | P2 |
| 256 | Inter-branch stock transfer | P4 | P2 |
| 257 | Consolidated P&L (combined + per-branch drill-down) | P4 | P2 |
| 258 | Role hierarchy (franchise owner > branch manager > staff) | P4 | P2 |
| 259 | Per-branch settings (tax, hours, pricing, payments) | P4 | P1 |
| 260 | Branch user management | P4 | P1 |
| 261 | Branch opening/closing checklist | P4 | P2 |
| 262 | Branch performance alerts (metric below threshold → HQ alert) | P4 | P2 |
| 263 | Shared customer profiles across chain locations | P4 | P2 |
| 264 | Centralized supplier management (bulk pricing) | P4 | P2 |
| 265 | Branch audit trail (HQ views any branch logs) | P4 | P2 |

---

## 13. 🔔 Notifications (10 features)

| # | Feature | Phase | Priority |
|---|---------|-------|----------|
| 266 | Push notifications (new order, low stock, staff alert, daily summary) | P1 | P0 |
| 267 | SMS alerts (OTP, table ready, critical) | P1 | P0 |
| 268 | WhatsApp notifications (order updates, delivery, khata, marketing) | P1 | P0 |
| 269 | In-app notification center (bell icon, badge count, mark read) | P1 | P0 |
| 270 | Configurable notification preferences per user per channel | P2 | P1 |
| 271 | Templates per language (EN, NE, HI, BN, auto-select) | P2 | P1 |
| 272 | Scheduled promotional notifications | P3 | P2 |
| 273 | Bulk notifications to customer segment | P3 | P2 |
| 274 | Badge count on app icon + bell | P1 | P0 |
| 275 | Notification delivery history with status | P2 | P1 |

---

## 14. ⚙️ Non-Functional / Platform Capabilities (35)

### Performance
| # | Requirement | Target |
|---|-------------|--------|
| 1 | API response time | <200ms p95 |
| 2 | POS screen load | <1 second |
| 3 | Bill generation | <500ms |
| 4 | Search speed | <300ms |
| 5 | KDS update latency | <500ms |

### Offline-First
| # | Requirement | Target |
|---|-------------|--------|
| 6 | Offline core operations (orders, KOT, billing) | 100% functional |
| 7 | Offline data persistence | Zero data loss (even crash/power fail) |
| 8 | Auto-sync on reconnect | Within 5 seconds |
| 9 | CRDT conflict resolution | No data loss on multi-device sync |
| 10 | Delta sync bandwidth | <50KB per cycle (works on 2G) |

### Scale
| # | Requirement | Target |
|---|-------------|--------|
| 11 | Concurrent restaurants | 100,000+ |
| 12 | Concurrent users | 1,000,000 |
| 13 | Peak throughput | 10,000 orders/sec |
| 14 | Cloud availability | 99.9% uptime |
| 15 | Local availability | 99.99% uptime |

### Security
| # | Requirement | Target |
|---|-------------|--------|
| 16 | Encryption at rest | AES-256 |
| 17 | Encryption in transit | TLS 1.3 |
| 18 | Multi-tenant isolation | PostgreSQL Row-Level Security |
| 19 | JWT expiry / refresh rotation | 15min / 30 days |

### Accessibility & Hardware
| # | Requirement | Target |
|---|-------------|--------|
| 20 | Language support | 12+ languages (Devanagari, Bengali, Latin) |
| 21 | Currency support | NPR, INR, BDT, LKR, USD |
| 22 | Minimum hardware | Android 10+, 2GB RAM, 720p ($80 tablet) |
| 23 | App size | <100MB APK |
| 24 | Local storage limit | <500MB (auto-cleanup) |
| 25 | Battery-aware mode | Activate at <15% (dim, pause sync) |
| 26 | Instant resume after crash/power cut | <3 seconds |
| 27 | Touch targets | 48x48px min (72x72px KDS) |
| 28 | Color contrast | WCAG AA (4.5:1 normal, 3:1 large) |

### Operations
| # | Requirement | Target |
|---|-------------|--------|
| 29 | Data retention | 7 years financial, 2 years operational |
| 30 | Backup RPO | 1 hour |
| 31 | Backup RTO | 4 hours |
| 32 | Onboarding speed | <5 minutes to first order |
| 33 | 3-tap rule | Any common action in ≤3 taps |
| 34 | Thermal printer support | Bluetooth + USB, 58mm + 80mm |
| 35 | Zero-downtime deploys | Rolling updates |

---

## 15. 🤖 AI Engine ("Restro Brain") Summary

| AI Feature | What It Does | On-Device? | Phase |
|------------|-------------|------------|-------|
| **Voice Ordering** | Staff speaks → AI creates order (Nepali/Hindi/English) | ✅ Whisper small (ONNX) | P3 |
| **Chat With Data** | "How much did I earn last Dashain?" → instant answer | ❌ Cloud LLM | P3 |
| **Photo Invoice** | Photograph supplier bill → auto purchase entry | ✅ Basic OCR / ❌ Full pipeline | P3 |
| **Demand Forecast** | "Tomorrow Saturday + holiday, prep 30% more chicken" | ❌ Prophet + LightGBM | P3 |
| **Menu Doctor** | "Pasta sells 2/wk at 45% cost. Replace with Chilli Chicken" | ❌ Cross-restaurant | P3 |
| **Smart Pricing** | Auto-suggest price based on ingredient cost fluctuation | ❌ Optimization | P4 |
| **Customer Win-back** | "Ram hasn't visited 14 days. Send 20% off Chicken Momo?" | ❌ Automated | P3 |
| **Theft Detection** | "Cashier Sita void rate is 3x average. Investigate." | ❌ Isolation Forest | P3 |
| **Prep Assistant** | "Based on reservations: prep 200 momos, 50 thalis tonight" | ❌ Forecast | P3 |
| **Food Photo Enhance** | Rough photo → professional menu photo | ❌ Diffusion model | P3 |

---

## 📈 Feature Count by Phase

| Phase | Features | Timeline | Goal |
|-------|----------|----------|------|
| **P1 (Nepal Launch)** | ~80 core features | Months 1-3 | 1,000 restaurants, replace paper billing |
| **P2 (Growth)** | +60 features | Months 4-6 | 5,000 restaurants, full management |
| **P3 (Intelligence)** | +50 features (AI-heavy) | Months 7-9 | AI-powered, India launch |
| **P4 (Platform)** | +50 features | Months 10-14 | Multi-location, aggregators, Bangladesh |
| **P5 (Dominance)** | +35 features | Months 15-24 | Default restaurant OS for South Asia |
| **TOTAL** | **275 features** | 24 months | 11M+ addressable restaurants |

---

*Generated from RESTROVERSE_PRODUCT_SPEC.md + FUNDAMENTAL_REQUIREMENTS.md*
*Last updated: 2026-06-02*
