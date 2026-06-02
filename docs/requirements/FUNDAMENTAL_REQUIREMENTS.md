# RestroVerse — Fundamental Requirements Specification

> **250+ Functional + 35 Non-Functional Requirements**
> **Every requirement is specific, measurable, and testable.**

---

## FUNCTIONAL REQUIREMENTS

### Authentication & Onboarding (FR-001 to FR-015)

**FR-001: Phone OTP Login** — Users must authenticate via phone number + 6-digit OTP sent via SMS. No email required. OTP expires in 5 minutes. P0

**FR-002: Country Selection** — On first launch, user selects country (Nepal/India/Bangladesh/Sri Lanka). This auto-configures currency, tax rules, language, and payment methods. P0

**FR-003: Restaurant Setup Wizard** — New user completes setup wizard: restaurant name, type (restaurant/cafe/bar/QSR/street food/cloud kitchen), location, number of tables. Must complete in <2 minutes. P0

**FR-004: Menu Setup — Photo Import** — Owner can photograph existing paper/board menu. AI extracts items, categories, and prices. Accuracy target: >85% for printed menus. P1

**FR-005: Menu Setup — Voice Import** — Owner speaks menu items ("Add chicken momo, Rs 200, steamed and fried"). AI creates items with categories, variants, and prices. P1

**FR-006: Menu Setup — Manual Entry** — Owner can manually add items one-by-one with name, category, price, photo, variants. P0

**FR-007: Staff Invite** — Owner can invite staff by entering phone number. Staff receives SMS with download link + join code. P0

**FR-008: PIN-Based Staff Switch** — On shared POS tablet, staff switch by entering 4-digit PIN. No full re-authentication required. Switch takes <2 seconds. P0

**FR-009: Multi-Device Registration** — A restaurant can register up to 10 devices. Devices are trusted after first login. P0

**FR-010: Onboarding Completion** — Total onboarding from signup to first order must complete in under 5 minutes. P0

**FR-011: Auto Tax Configuration** — Tax rules auto-configured based on country: Nepal VAT 13%, India GST 5%/18%, Bangladesh VAT 5%. Owner can customize. P0

**FR-012: Language Selection** — Staff can select UI language: English, Nepali, Hindi, Bengali. Language persists per user. P0

**FR-013: Tutorial Walkthrough** — First-time users see an optional interactive tutorial (tap-through, 5 screens) showing order → kitchen → bill flow. P2

**FR-014: Account Recovery** — If staff forgets PIN, manager/owner can reset it. If owner loses phone, recovery via OTP to same number. P0

**FR-015: Demo Mode** — New users can explore a pre-populated demo restaurant before setting up their own. P2

---

### Order Management (FR-016 to FR-045)

**FR-016: Create Dine-In Order** — Staff creates order by selecting table, then adding items. Order linked to table. P0

**FR-017: Create Takeaway Order** — Staff creates takeaway order without table assignment. Auto-numbered. P0

**FR-018: Create Delivery Order** — Staff creates delivery order with customer address, phone, delivery zone. P0

**FR-019: Create Online Order** — System receives orders from branded website, WhatsApp bot, or aggregators. Auto-created in POS. P1

**FR-020: Create Reservation Order** — Pre-order items linked to a reservation. Order activates when customer is seated. P2

**FR-021: Add Items to Order** — Tap menu item to add to current order. One tap = add with qty 1. Support quantity adjustment (+/-). P0

**FR-022: Variant Selection** — When item has variants (steamed/fried), show variant picker before adding. Default variant auto-selected. P0

**FR-023: Modifier Selection** — When item has modifiers (spice level, add-ons), show modifier popup. Required modifiers must be selected. P0

**FR-024: Running Orders** — Dine-in orders remain open. Staff can add items to existing order at any time without creating new order. P0

**FR-025: Voice Ordering** — Staff taps mic button, speaks order in Nepali/Hindi/English. AI parses into structured items. Confirmation required before submission. P1

**FR-026: Order Notes** — Each order and each item can have text notes (e.g., "no onion", "extra spicy", "birthday celebration"). P0

**FR-027: Order Priority Tags** — Orders can be tagged: Normal, Rush (⚡), VIP (⭐), Allergy Alert (⚠️). Tags visible on KDS. P1

**FR-028: Hold Order** — Staff can hold (pause) an order. Held orders appear in a separate "Held" section. Can be resumed. P1

**FR-029: Transfer Order** — Move an order from one table to another. Updates table status automatically. P0

**FR-030: Duplicate Order** — Create a new order copying all items from a previous order. Useful for repeat customers. P2

**FR-031: Real-Time Multi-Device Sync** — When staff adds an item on one device, all other devices in the restaurant see it within 2 seconds (via local WiFi or cloud). P0

**FR-032: Order History** — View all past orders with search (by date, table, order number, customer name, amount). P0

**FR-033: Cancel Order** — Manager+ can cancel an entire order. Requires selection of reason. Cancelled orders logged in audit. P0

**FR-034: Void Item** — Manager+ can void individual items from an order with reason. Voided items visible (struck-through) but excluded from bill. P0

**FR-035: Order Batching** — Kitchen can view orders batched by item type (e.g., "All momos: Table 3 x2, Table 7 x4, Takeaway x2 = total 8 momos"). P1

**FR-036: Auto Order Number** — Orders auto-numbered sequentially per day (resets daily). Format: #1, #2, #3... P0

**FR-037: Customer Link** — Orders can be linked to a customer profile by phone number. Auto-lookup as number is entered. P1

**FR-038: Multi-Channel Merge** — A dine-in customer can also place a delivery order (for home) — both appear on their profile. P2

**FR-039: Offline Order Queue** — Orders created offline are queued locally. When connectivity returns, auto-pushed to cloud. No data loss. P0

**FR-040: Split Order** — Split items from one order into two separate orders (e.g., when a group wants separate bills). P1

**FR-041: Reorder from History** — Customer-facing: "Order again" button showing last 5 orders for that customer. P2

**FR-042: Order Time Tracking** — System tracks: order created time, sent to kitchen time, ready time, served time, billed time. P0

**FR-043: Order Source Tracking** — Each order tagged with channel: POS, QR scan, WhatsApp, web, aggregator name. P0

**FR-044: Guest Count** — Dine-in orders can record number of guests (for per-head analysis). P1

**FR-045: Order Alerts** — Notify staff if an order has been in "confirmed" status for >5 minutes without being sent to kitchen. P2

---

### Menu Management (FR-046 to FR-070)

**FR-046: CRUD Categories** — Create, read, update, delete menu categories with name, icon (emoji), sort order. P0

**FR-047: CRUD Items** — Create, read, update, delete menu items with name, description, price, photo, category. P0

**FR-048: Item Variants** — Each item can have multiple variants (size, cooking method) with price adjustments. P0

**FR-049: Item Modifiers** — Create modifier groups (Spice Level, Add-ons) with options. Link modifiers to items. P0

**FR-050: Combo Meals** — Create combo/meal deals combining multiple items at a package price. P1

**FR-051: Photo Upload** — Upload photo for each menu item. Support camera capture and gallery selection. P0

**FR-052: AI Photo Enhancement** — Uploaded food photos auto-enhanced (brightness, contrast, color) for menu display. P2

**FR-053: QR Menu Generation** — Generate unique QR code per table. Scanning opens digital menu in customer's browser. P0

**FR-054: Menu Scheduling** — Set time-based menu visibility: breakfast (6AM-11AM), lunch (11AM-3PM), dinner (5PM-10PM). Auto-switches. P1

**FR-055: 86'd Items** — One-tap to mark item as unavailable. Instantly hidden from QR menu, online ordering, and all channels. P0

**FR-056: Dynamic Pricing** — Set different prices by time (happy hour), day (weekend pricing), or channel (delivery markup). P2

**FR-057: Multi-Language Menu** — Menu items have fields for multiple languages. QR menu auto-shows customer's phone language. P1

**FR-058: Nutrition Info** — Optional fields for calories, allergens, dietary tags (veg, vegan, gluten-free, halal). P2

**FR-059: AI Menu Builder** — AI suggests menu items based on restaurant type and location. "You're a cafe in Pokhara — here are popular items in your area." P2

**FR-060: Menu Performance Scoring** — Each item scored: Stars (high pop + high profit), Plowhorses, Puzzles, Dogs. Visible in reports. P1

**FR-061: Seasonal Suggestions** — AI suggests seasonal items based on festivals, weather, local trends. P2

**FR-062: Bulk Price Update** — Update prices for multiple items at once (e.g., "increase all items by 5%"). P1

**FR-063: Item Search** — Search menu items by name across all categories. Instant results (<300ms). P0

**FR-064: Menu Export** — Export menu as PDF (printable), CSV, or JSON. P2

**FR-065: Menu Import** — Import menu from CSV/JSON file. Map columns to fields. P2

**FR-066: Sort Items** — Sort items within category by: manual order, popularity, price, newest. P1

**FR-067: Category Visibility** — Toggle entire category visible/hidden without deleting. P0

**FR-068: Item Cost Price** — Record cost price per item (from recipe or manual). Used for food cost calculations. P1

**FR-069: Menu Preview** — Owner can preview how menu looks to customers (QR view) before publishing changes. P1

**FR-070: Popular Badge** — Mark items as "Popular" or "New" — shows badge on menu. Auto-suggest based on sales data. P1

---

### Table & Space Management (FR-071 to FR-085)

**FR-071: Visual Floor Plan** — Drag-and-drop editor to position tables on a visual floor plan. Tables have position, size, shape. P0

**FR-072: Real-Time Status** — Each table shows status with color: available (green), occupied (red), reserved (yellow), cleaning (blue). P0

**FR-073: Table Capacity** — Each table has a capacity (2/4/6/8 seats). Guest count tracked against capacity. P0

**FR-074: Merge Tables** — Combine 2+ adjacent tables for large groups. Merged table acts as single order. P1

**FR-075: Split Tables** — Un-merge previously merged tables back to individual tables. P1

**FR-076: Transfer Between Tables** — Move order from one table to another. Both tables update status automatically. P0

**FR-077: Waitlist** — Add walk-in customers to waitlist with name, phone, party size, estimated wait. P1

**FR-078: Waitlist Notification** — Send SMS/WhatsApp to customer when table is ready. One-tap send. P1

**FR-079: Reservation Calendar** — Calendar view showing reservations by date/time. Prevent double-booking same table. P1

**FR-080: Reservation Deposit** — Optionally require advance deposit for reservations. Track deposit status. P2

**FR-081: Server Section Assignment** — Assign groups of tables to specific servers/waiters. Balance workload. P1

**FR-082: Multi-Floor Support** — Multiple spaces (Ground Floor, First Floor, Outdoor, Rooftop) each with own floor plan. P0

**FR-083: Table Dwell Time** — Track how long each table has been occupied. Show timer on table card. P1

**FR-084: Auto-Seat Suggestion** — AI suggests which table to seat based on party size, available tables, and server load balance. P2

**FR-085: Cleaning Timer** — When table marked "cleaning," auto-timer. Alert if cleaning takes >10 minutes. P2

---

### Kitchen / KDS (FR-086 to FR-100)

**FR-086: KOT Generation** — When order sent to kitchen, generate Kitchen Order Ticket. Support thermal print + digital display. P0

**FR-087: KDS Column View** — Kitchen Display shows orders in columns: New → Cooking → Ready → Served. P0

**FR-088: Station Routing** — Route items to correct station: drinks to Bar, mains to Kitchen, desserts to Pastry. P1

**FR-089: Prep Time Tracking** — Track actual preparation time per ticket. Calculate average prep time per item. P0

**FR-090: Rush Hour Mode** — Auto-activate when order volume exceeds threshold. Batches similar items across orders. P1

**FR-091: Recipe Display** — Kitchen staff can tap an item to see recipe steps and ingredient quantities. P2

**FR-092: Color-Coded Urgency** — Ticket timer: white (<target), yellow (near target), red (exceeded target). P0

**FR-093: Sound Alerts** — Distinct sounds for: new order (bell), overdue order (urgent beep), item bumped (soft chime). P0

**FR-094: Ingredient Warning** — If an item uses an ingredient that is low-stock, show warning icon on KDS. P1

**FR-095: Multi-Kitchen Sync** — For chains: orders route to correct kitchen (central prep vs branch). P2

**FR-096: KOT Reprint** — Reprint a KOT for any order. Useful when printer fails or ticket gets lost. P0

**FR-097: Bump Bar Support** — Optional hardware bump bar for hands-free ticket advancement. P2

**FR-098: Course Firing** — Optionally delay courses: fire appetizers first, then mains after N minutes or manual trigger. P2

**FR-099: Dark Mode** — KDS defaults to dark mode (dark background, light text) to reduce kitchen eye strain. P0

**FR-100: Kitchen Stats** — Show live stats on KDS: avg prep time, orders in queue, on-time percentage, staff active. P1

---

### Billing & Payments (FR-101 to FR-130)

**FR-101: One-Tap Billing** — Generate bill from order with one tap. Auto-calculates subtotal, tax, service charge, total. P0

**FR-102: Nepal VAT Compliance** — Auto-apply 13% VAT. Generate IRD-compliant invoice with PAN, sequential number, date. P0

**FR-103: India GST Compliance** — Auto-apply correct GST slab (5% or 18%). Generate GSTIN-compliant invoice with HSN codes. P0

**FR-104: Bangladesh VAT** — Auto-apply 5% VAT. Generate BIN-compliant invoice. P1

**FR-105: Split Bill — By Item** — Split bill by dragging items to different guests. Each gets own bill. P0

**FR-106: Split Bill — Equal** — Divide total equally among N guests. P0

**FR-107: Split Bill — Percentage** — Split by custom percentages (e.g., 60/40). P1

**FR-108: Split Bill — Custom Amount** — Each guest pays a custom amount. P1

**FR-109: Multi-Payment** — A single bill can be paid with multiple methods (e.g., Rs 500 cash + Rs 370 eSewa). P0

**FR-110: Cash Handling** — Enter cash received, auto-calculate change due. Quick buttons for common denominations (Rs 500, 1000). P0

**FR-111: Cash Denomination Tracking** — Track cash drawer by denomination (Rs 10/20/50/100/500/1000 notes). Support opening and closing counts. P1

**FR-112: Digital Receipt** — Send receipt via SMS, WhatsApp, or email. Customer chooses at checkout. P0

**FR-113: Print Receipt** — Print receipt on thermal printer (58mm or 80mm). Customizable footer (thank you message, promo). P0

**FR-114: Discount — Percentage** — Apply percentage discount (5%, 10%, 15%, 20%, custom). Role-based limits. P0

**FR-115: Discount — Flat Amount** — Apply flat Rs amount discount. P0

**FR-116: Discount — Coupon Code** — Enter promo code. Validate against active campaigns. Auto-apply discount. P1

**FR-117: Discount — Happy Hour** — Auto-apply discount during configured happy hour windows. P2

**FR-118: Discount — Loyalty** — Redeem loyalty points as discount. Show available points at checkout. P1

**FR-119: Discount — Employee** — Employee discount (separate tracking). P2

**FR-120: Khata Credit System** — Add bill amount to customer's credit balance (Khata). Track running balance per customer. P0

**FR-121: Khata Credit Limit** — Set maximum credit limit per customer. Warn when approaching limit. Block when exceeded. P0

**FR-122: Khata Payment Recording** — Record cash/digital payment against khata balance. Update running balance. P0

**FR-123: Khata WhatsApp Reminder** — Send balance reminder via WhatsApp to customers with outstanding credit. P1

**FR-124: Tipping — Digital** — Add tip amount on digital payment. Tracked separately from bill total. P1

**FR-125: Tip Pool Distribution** — Configure tip distribution rules (equal split, by hours worked, by role). Auto-calculate. P2

**FR-126: Service Charge** — Configurable service charge (0-15%). Toggle on/off per order. P0

**FR-127: Multi-Currency** — For tourist areas: accept USD/EUR, auto-convert at daily FX rate, bill in local currency. P2

**FR-128: Round-Off** — Auto round bill total to nearest Rs 1/5/10 based on configuration. P0

**FR-129: EOD Cash Reconciliation** — End-of-day: compare expected cash (from bills) vs actual counted cash. Show discrepancy. P0

**FR-130: Void/Refund** — Void a finalized bill or process refund. Requires manager+ PIN. Reason mandatory. Logged in audit. P0

---

### Inventory Management (FR-131 to FR-155)

**FR-131: Stock Tracking** — Track inventory items with current stock level, minimum threshold, unit (kg/liter/piece/dozen). P0

**FR-132: Auto-Deduct on Sale** — When a menu item is sold, auto-subtract ingredient quantities based on recipe. P1

**FR-133: Low Stock Alerts** — When stock falls below minimum, send push notification + WhatsApp alert to owner/manager. P0

**FR-134: Photo Invoice Scan** — Photograph supplier invoice. AI extracts line items, quantities, prices. Creates purchase entry. P1

**FR-135: Manual Purchase Entry** — Manually record incoming stock: item, quantity, cost, supplier, date. P0

**FR-136: AI Purchase Suggestions** — Based on demand forecast, AI suggests what to order and how much. One-tap to create PO. P1

**FR-137: Supplier Management** — CRUD suppliers: name, phone, address, items supplied, payment terms. P0

**FR-138: Multi-Supplier Per Item** — An ingredient can have multiple suppliers. Show price comparison. P1

**FR-139: Recipe Management** — Link menu items to ingredient recipes. Define qty per serving for each ingredient. P1

**FR-140: Food Cost Calculation** — Auto-calculate food cost percentage per menu item from recipe. Show cost vs price. P1

**FR-141: Waste Logging** — Log daily waste with reason (expired, damaged, over-prep, customer return). Track cost impact. P0

**FR-142: Expiry Tracking** — Record expiry dates. FIFO alerts: "Use paneer today — expires tomorrow." P1

**FR-143: Physical Stock Count** — Conduct inventory count: enter actual quantities, system calculates variance from expected. P0

**FR-144: Inter-Branch Transfer** — Transfer stock between locations. Deduct from source, add to destination. P2

**FR-145: Cost Variance Alerts** — Alert when supplier price changes >10% from last purchase. P1

**FR-146: Central Kitchen / Commissary** — Manage central kitchen that prepares and transfers to branches. P2

**FR-147: Stock Valuation** — Report: total inventory value at any point in time (qty × cost per unit). P1

**FR-148: Ingredient-Level Tracking** — Track down to individual ingredients (not just finished goods). P1

**FR-149: Minimum Stock Config** — Set minimum stock threshold per item. Different thresholds for different days (higher for weekends). P1

**FR-150: Purchase History** — View purchase history per supplier: dates, items, costs, trends. P1

**FR-151: Batch/Lot Tracking** — For items bought in batches — track which batch is being used (FIFO). P2

**FR-152: Auto PO from Forecast** — AI generates purchase order based on 3-day demand forecast + current stock. P1

**FR-153: Stock Movement History** — Full ledger of all stock movements per item (purchase, sale, waste, transfer, adjustment). P0

**FR-154: Category Filtering** — Filter inventory by category: produce, meat, dairy, dry goods, beverages, packaging. P0

**FR-155: Unit Conversion** — Support unit conversions (1kg = 1000g, 1 dozen = 12 pieces) when recipes use different units. P1

---

### Staff Management (FR-156 to FR-175)

**FR-156: Staff Profiles** — Create staff with name, phone, photo, role, language preference, hourly rate or monthly salary. P0

**FR-157: Role-Based Access** — Granular permissions per role (owner/manager/cashier/waiter/kitchen/delivery). See RBAC matrix. P0

**FR-158: Custom Permissions** — Override default role permissions for specific staff members. P1

**FR-159: Shift Scheduler** — Visual weekly calendar. Drag-and-drop to assign shifts. Morning/evening/full day/custom. P1

**FR-160: Clock In/Out** — Staff clocks in/out via app button. Timestamp recorded. Optional GPS location capture. P0

**FR-161: Attendance Report** — View attendance by staff by date range: days present, absent, late, hours worked, overtime. P0

**FR-162: Performance Dashboard** — Per-staff metrics: orders handled, average bill amount, upsell rate, speed, customer ratings. P1

**FR-163: Tip Pooling** — Configure tip pool rules. Auto-distribute tips based on rules at end of shift/day. P2

**FR-164: Payroll Calculator** — Calculate: (hours worked × rate) + tips + overtime - advances - deductions = net pay. P1

**FR-165: Salary Advance** — Record salary advance given to staff. Track against monthly salary. Very common in Asian restaurants. P0

**FR-166: Staff Meal Tracking** — Log meals consumed by staff (common perk). Track cost of staff meals separately. P1

**FR-167: Training Modules** — AI-generated quick training guides per role. "How to take an order in 3 steps." P2

**FR-168: Multi-Language Staff UI** — Each staff member sees UI in their chosen language. Independent per device session. P0

**FR-169: Biometric Clock-In** — Optional fingerprint reader integration for attendance. For larger restaurants. P2

**FR-170: Staff Announcements** — Manager posts announcements visible to all staff on their app. P2

**FR-171: Late/Absence Alerts** — Auto-notify manager if staff hasn't clocked in within 15 minutes of shift start. P1

**FR-172: Overtime Tracking** — Auto-calculate overtime hours (beyond configured daily/weekly limits). P1

**FR-173: Staff Directory** — View all active staff with role, contact, shift schedule. Quick-call button. P0

**FR-174: Access Log** — Track who logged in, when, from which device. Visible to owner. P0

**FR-175: Deactivate Staff** — Deactivate (not delete) staff. Revokes access immediately. Preserves historical data. P0

---

### Customer & Loyalty (FR-176 to FR-200)

**FR-176: Phone-Based Profiles** — Create customer by phone number. No app download needed. Auto-created on first order. P0

**FR-177: Visit History** — View all past orders for a customer. Total visits, total spent, average order value. P0

**FR-178: Preference Memory** — Record customer preferences: "extra spicy", "no cilantro", "allergic to peanuts". Show on order screen. P1

**FR-179: Loyalty Points — Earn** — Customers earn points on every purchase (configurable: 1 point per Rs 10 spent). P1

**FR-180: Loyalty Points — Redeem** — Redeem points for discounts at checkout (configurable: 100 points = Rs 50 off). P1

**FR-181: Loyalty Tiers** — Auto-upgrade tiers: Bronze (0-999), Silver (1000-2499), Gold (2500-4999), Platinum (5000+). Each tier has benefits. P1

**FR-182: Birthday Offer** — Auto-send birthday offer via WhatsApp on customer's birthday. Configurable offer. P2

**FR-183: Win-Back Campaign** — Auto-identify customers who haven't visited in 14+ days. Send personalized offer. P2

**FR-184: Referral Rewards** — Customer shares referral QR/link. When friend visits and orders, both earn rewards. P2

**FR-185: Google Review Nudge** — After positive feedback, prompt customer to leave Google review. Direct link provided. P2

**FR-186: Feedback Collection** — Post-meal WhatsApp message asking for 1-5 star rating + optional comment. P1

**FR-187: Customer Segmentation** — Auto-segment: Regulars (weekly+), High-Spenders (top 10%), At-Risk (declining visits), New. P1

**FR-188: WhatsApp Marketing** — Send promotional messages to customer segments using approved templates. Opt-out respected. P1

**FR-189: Gift Cards** — Issue digital gift cards with value. Redeemable at checkout. Track balance. P2

**FR-190: Customer Notes** — Staff can add notes: "VIP — always seat at window table", "Wife is vegetarian". P1

**FR-191: Customer Analytics** — Report: new vs returning customers, frequency distribution, spending trends. P1

**FR-192: Acquisition Source** — Track how customer was acquired: walk-in, QR scan, WhatsApp, referral, aggregator. P2

**FR-193: Do Not Disturb** — Customers can opt out of marketing messages. Flag respected across all channels. P0

**FR-194: Customer Export** — Export customer list as CSV with all fields. P1

**FR-195: Merge Duplicates** — Identify and merge duplicate customer profiles (same phone number). Combine history. P2

**FR-196: Favorite Items** — Auto-track customer's most-ordered items. Show as "Your favorites" on QR menu. P2

**FR-197: Spending Alerts** — Alert owner when a regular customer's spending pattern drops significantly. P2

**FR-198: Corporate Accounts** — Support corporate customers with special pricing, monthly invoicing, higher credit limits. P2

**FR-199: Customer Groups** — Tag customers into groups: "Office Lunch Regulars", "Friday Night Crowd", "Tourist". P2

**FR-200: Lifetime Value** — Calculate and display customer lifetime value based on visit frequency and avg spend. P2

---

### Online Ordering & Delivery (FR-201 to FR-225)

**FR-201: Branded Ordering Website** — Auto-generated ordering page at yourname.restroverse.com. Photo menu, cart, checkout. P0

**FR-202: WhatsApp Ordering Bot** — Customers order via WhatsApp. Bot handles menu display, cart, payment, tracking. P1

**FR-203: QR Code In-Restaurant Ordering** — Customer scans table QR, browses menu on phone, places order. Arrives on POS. P0

**FR-204: Delivery Zone Config** — Draw delivery zones on map. Set fee, minimum order, and estimated time per zone. P1

**FR-205: Own Driver Management** — Add delivery riders with phone, vehicle type. Assign orders to riders. P1

**FR-206: Rider GPS Tracking** — Track rider location in real-time via rider app. Show on map to restaurant and customer. P1

**FR-207: Delivery Time Estimation** — AI estimates delivery time based on distance + current kitchen load + rider availability. P1

**FR-208: Proof of Delivery** — Rider captures photo + customer confirms with OTP. Marked as delivered. P1

**FR-209: Cash on Delivery Tracking** — Track how much COD cash each rider is carrying. Settlement at end of day. P0

**FR-210: Aggregator Dashboard** — View orders from Foodmandu, Swiggy, Zomato, Foodpanda on single screen. P1

**FR-211: Aggregator Menu Sync** — Update menu once in RestroVerse, auto-push to all connected aggregators. P2

**FR-212: Auto-Accept Rules** — Configure: auto-accept orders from aggregators when kitchen queue is below threshold. P2

**FR-213: Commission Tracking** — Track commission paid to each aggregator per order. Show impact on margin. P1

**FR-214: Smart Delivery Routing** — If own rider is available, route to own rider (save commission). Otherwise, use aggregator. P2

**FR-215: Kiosk Mode** — Same tablet app switches to customer-facing kiosk mode. Large photos, self-service ordering. P1

**FR-216: Online Payment Integration** — Accept payments via eSewa, Khalti (Nepal), UPI (India), bKash (BD) on ordering page. P0

**FR-217: Order Tracking Page** — Customers see real-time order status: Confirmed → Preparing → Ready → On the Way → Delivered. P1

**FR-218: Delivery Analytics** — Report: avg delivery time, cost per delivery, orders by zone, rider performance. P1

**FR-219: Customer Address Book** — Save customer addresses. Auto-suggest on repeat orders. P1

**FR-220: Repeat Order** — Customer can reorder from past order history with one tap. P1

**FR-221: Scheduled Orders** — Customer can pre-order for a future date/time. Order fires to kitchen at appropriate time. P2

**FR-222: Delivery Slot Selection** — Customer picks preferred delivery window (e.g., 12:00-12:30, 12:30-1:00). P2

**FR-223: Live Rider Chat** — Customer can message rider via in-app chat (no phone number sharing). P2

**FR-224: Failed Delivery Handling** — If delivery fails (wrong address, no answer), rider marks failed + captures reason. P1

**FR-225: Delivery Rating** — Customer rates delivery experience (1-5 stars). Affects rider performance score. P2

---

### Analytics & AI (FR-226 to FR-250)

**FR-226: Daily Dashboard** — Mobile-first owner dashboard: today's revenue, orders, avg order, food cost %. Loads in <2s. P0

**FR-227: Sales Report** — Revenue by hour/day/week/month/year with comparison to previous period (% change). P0

**FR-228: Item-Wise P&L** — For each menu item: quantity sold, revenue, ingredient cost, profit, profit margin %. P1

**FR-229: Peak Hour Analysis** — Chart showing orders per hour. Identifies busiest and slowest periods. P1

**FR-230: Staff Performance** — Compare staff: orders handled, avg bill, upsell rate, speed, customer ratings. P1

**FR-231: Waste Report** — Daily/weekly/monthly waste log with cost impact. Breakdown by reason. P1

**FR-232: Cash Flow Report** — Money in (revenue) vs money out (purchases, salaries, expenses) by period. P1

**FR-233: Tax Report** — Pre-formatted report for tax filing: IRD format (Nepal), GSTR-1 format (India). P0

**FR-234: Benchmarking** — Compare your metrics against anonymized averages of similar restaurants in your area. P2

**FR-235: AI Chat With Data** — Owner asks natural language question: "How much did I earn last Dashain?" → AI generates answer with chart. P2

**FR-236: AI Demand Forecast** — Predict demand per item for next 3 days. Used for purchase suggestions and prep planning. P1

**FR-237: AI Menu Doctor** — Classify items as Stars/Plowhorses/Puzzles/Dogs. Suggest price changes, additions, removals. P1

**FR-238: AI Anomaly Detection** — Detect unusual patterns: high void rates, cash discrepancies, after-hours transactions. Alert owner. P2

**FR-239: AI Smart Pricing** — Suggest price adjustments based on ingredient cost changes, demand elasticity, competitor pricing. P2

**FR-240: AI Staff Scheduling** — Suggest optimal staff schedule based on predicted demand by hour and day. P2

**FR-241: Custom Reports** — Build custom reports by selecting metrics, filters, date range, grouping. P2

**FR-242: Report Export** — Export any report as PDF, Excel, or CSV. P0

**FR-243: Scheduled Reports** — Auto-send daily summary report to owner via WhatsApp or email at configured time. P1

**FR-244: Multi-Branch Comparison** — Compare revenue, food cost, ratings, speed across branches. P2

**FR-245: Customer LTV Report** — Customer lifetime value analysis: top customers, at-risk customers, new customer acquisition rate. P2

**FR-246: Payment Method Analysis** — Breakdown of revenue by payment method. Trend of cash vs digital over time. P1

**FR-247: Discount Analysis** — Total discounts given by type, by staff, by period. Identify discount abuse. P1

**FR-248: Revenue Per Table** — Which tables generate most revenue? Dwell time vs revenue analysis. P2

**FR-249: Hourly Staff Cost** — Staff cost per hour vs revenue per hour. Identify overstaffed/understaffed periods. P2

**FR-250: Real-Time Order Feed** — Live feed showing orders as they come in across all channels. With amounts and source. P1

---

### Multi-Location (FR-251 to FR-265)

**FR-251: Multi-Branch Dashboard** — Single screen showing all branches: revenue, orders, alerts per location. P1

**FR-252: Standardized Menu Push** — Push menu changes from HQ to all branches with one click. P1

**FR-253: Branch Comparison** — Side-by-side comparison of KPIs across branches. P1

**FR-254: Central Kitchen** — Manage central prep kitchen. Create production orders, transfer to branches. P2

**FR-255: Franchise Controls** — Franchisor defines menu, pricing, standards. Franchisee operates within constraints. P2

**FR-256: Inter-Branch Transfer** — Transfer stock between branches. Track transfer orders with receiving confirmation. P2

**FR-257: Consolidated P&L** — Combined profit & loss across all branches. Drill down to per-branch. P2

**FR-258: Role Hierarchy** — Franchise owner > Branch manager > Staff. Each level sees appropriate data. P2

**FR-259: Per-Branch Settings** — Different tax rates, operating hours, payment methods, pricing per branch. P1

**FR-260: Branch User Management** — Add/remove staff per branch. Staff can only access their branch's data. P1

**FR-261: Branch Opening Checklist** — Configurable opening/closing checklist per branch. Track completion. P2

**FR-262: Branch Performance Alerts** — Auto-alert HQ if a branch's metrics fall below threshold. P2

**FR-263: Shared Customer Profiles** — Customer profile shared across branches (same chain). Visit any location, points accumulate. P2

**FR-264: Centralized Supplier Management** — Manage suppliers at chain level. Negotiate bulk pricing. P2

**FR-265: Branch Audit Trail** — HQ can view audit logs from any branch. P2

---

### Notifications (FR-266 to FR-275)

**FR-266: Push Notifications** — Mobile push for: new order, low stock, staff alert, daily summary. P0

**FR-267: SMS Alerts** — SMS for: OTP, table ready (waitlist), critical alerts. P0

**FR-268: WhatsApp Notifications** — WhatsApp for: order updates, delivery tracking, khata reminders, marketing. P0

**FR-269: In-App Notification Center** — Bell icon with badge count. List of all notifications. Mark as read. P0

**FR-270: Configurable Preferences** — Each user configures which notifications they receive and via which channel. P1

**FR-271: Template Per Language** — Notification templates available in English, Nepali, Hindi, Bengali. Auto-select by user language. P1

**FR-272: Scheduled Notifications** — Schedule promotional notifications for future date/time (e.g., Dashain offer). P2

**FR-273: Bulk Notifications** — Send notification to customer segment (e.g., all Gold tier customers). P2

**FR-274: Badge Count** — Unread notification count shown on app icon and bell icon. P0

**FR-275: Notification History** — View history of all sent notifications with delivery status. P1

---

## NON-FUNCTIONAL REQUIREMENTS

**NFR-001: API Response Time** — All API endpoints respond in <200ms at p95 under normal load. P0

**NFR-002: POS Screen Load** — POS main screen (menu + active orders) loads in <1 second on target hardware. P0

**NFR-003: Bill Generation Speed** — Bill calculation and generation completes in <500ms. P0

**NFR-004: Search Speed** — Menu item search, customer search, and order search return results in <300ms. P0

**NFR-005: KDS Update Latency** — New orders appear on KDS within 500ms of being sent to kitchen. P0

**NFR-006: Offline Core Operations** — Order creation, KOT generation, and billing work 100% without internet. P0

**NFR-007: Offline Data Persistence** — All data created offline is persisted locally. Zero data loss even if app crashes or power fails. P0

**NFR-008: Auto-Sync** — When internet connectivity returns, auto-sync begins within 5 seconds. P0

**NFR-009: Sync Conflict Resolution** — CRDT-based conflict resolution ensures no data loss when multiple devices sync. P0

**NFR-010: Delta Sync Bandwidth** — Each sync cycle transfers <50KB of delta data (not full database). Works on 2G connections. P0

**NFR-011: Scale — Restaurants** — System must support 100,000+ restaurants concurrently. P0

**NFR-012: Scale — Users** — Support 1 million concurrent users (staff across all restaurants). P0

**NFR-013: Scale — Throughput** — Handle 10,000 orders per second at peak across all restaurants. P1

**NFR-014: Cloud Availability** — Cloud services maintain 99.9% uptime (8.7 hours downtime/year max). P0

**NFR-015: Local Availability** — Local/offline operations maintain 99.99% uptime (52 minutes downtime/year max). P0

**NFR-016: Encryption at Rest** — All data encrypted at rest using AES-256. P0

**NFR-017: Encryption in Transit** — All network communication uses TLS 1.3. P0

**NFR-018: Multi-Tenant Isolation** — Restaurant data isolated via PostgreSQL Row-Level Security. No cross-tenant data leakage. P0

**NFR-019: Authentication Security** — JWT tokens expire in 15 minutes. Refresh tokens expire in 30 days with rotation. P0

**NFR-020: Localization** — Support 12+ languages with proper script rendering (Devanagari, Bengali, Latin). P0

**NFR-021: Currency Support** — Support NPR, INR, BDT, LKR, USD with proper formatting and symbols. P0

**NFR-022: Hardware Minimum** — Must run on Android 10+ devices with 2GB RAM and 720p display. Target: $80 tablets. P0

**NFR-023: App Size** — Mobile app APK must be <100MB. P0

**NFR-024: Local Storage** — Local data cache must not exceed 500MB per device. Auto-cleanup of old data. P0

**NFR-025: Battery Awareness** — At <15% battery, activate battery-save mode: dim screen, reduce animations, pause background sync. P0

**NFR-026: Instant Resume** — If app is killed or power cuts, resume to exact same state when reopened. <3 second resume time. P0

**NFR-027: Touch Targets** — All interactive elements: minimum 48×48px (72×72px on KDS). Minimum 8px gap between targets. P0

**NFR-028: Color Contrast** — Text contrast ratio: 4.5:1 (normal), 3:1 (large text). WCAG AA compliance. P0

**NFR-029: Data Retention** — Financial data: 7 years. Operational data: 2 years. Configurable per country. P0

**NFR-030: Backup RPO** — Recovery Point Objective: 1 hour (max data loss in disaster). P0

**NFR-031: Backup RTO** — Recovery Time Objective: 4 hours (time to restore service after disaster). P0

**NFR-032: Onboarding Speed** — New restaurant: signup → first order in <5 minutes. P0

**NFR-033: 3-Tap Rule** — Any common action (create order, add item, generate bill, send KOT) must complete in ≤3 taps. P0

**NFR-034: Thermal Printer Support** — Support Bluetooth and USB thermal printers in 58mm and 80mm widths. Compatible with common Asian printer brands. P0

**NFR-035: Zero-Downtime Deploy** — Production deployments must not cause any service interruption. Rolling update strategy. P0

---

## CONSTRAINTS

| # | Constraint | Rationale |
|---|---|---|
| C-01 | Must run on $80 Android 10+ tablet (2GB RAM, 720p) | Target market hardware affordability |
| C-02 | Must handle 5-15 internet disconnections per day seamlessly | Unreliable Asian internet infrastructure |
| C-03 | Must survive power outages with instant state resume | Common power cuts in Nepal/India/BD |
| C-04 | Must comply with Nepal IRD e-billing requirements | Legal requirement for Nepal restaurants |
| C-05 | Must comply with India GST invoicing requirements | Legal requirement for Indian restaurants |
| C-06 | Must comply with Bangladesh VAT requirements | Legal requirement for BD restaurants |
| C-07 | Must support local payment gateways per country | Users expect local payment methods |
| C-08 | Maximum 3 taps for any common POS action | Low-literacy staff, speed critical |
| C-09 | Onboarding must complete in <5 minutes | Competitive differentiation |
| C-10 | Must support Devanagari, Bengali, and Latin scripts | Core market languages |
| C-11 | Phone-first auth (no email required for signup) | Many Asian restaurant owners don't use email |
| C-12 | Monthly cost < one customer's avg order value | Affordability in price-sensitive markets |
| C-13 | Must work with $25 Bluetooth thermal printers | Affordable hardware requirement |
| C-14 | Must support cash-heavy workflows (60-80% cash) | Asian market reality |
| C-15 | Single APK for POS/Waiter/KDS (mode-switched) | Simplify distribution and updates |
| C-16 | No proprietary hardware dependency | Run on any Android device |
| C-17 | Local WiFi sync must work without internet | Critical for offline multi-device |
| C-18 | Must support festivals calendar (Dashain, Diwali, Eid, etc.) | Business-critical for Asian restaurants |

---

*End of Requirements Specification*
*Total: 275 Functional + 35 Non-Functional + 18 Constraints = 328 requirements*
