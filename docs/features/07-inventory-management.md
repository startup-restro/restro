# 📦 Inventory Management

> **Module**: Inventory | **Total Features**: 25 | **Phase 2 Start**
> **Core Principle**: AI-assisted. Photo-scan invoices. Auto-deduct on sale.

---

## Features

### P0 - Must Have

**F-131: Stock Tracking** — Track items with qty, min threshold, unit (kg/g/liter/piece/dozen) | Phase 2
**F-133: Low Stock Alerts** — Push + WhatsApp notification when below minimum | Phase 2
**F-135: Manual Purchase Entry** — Record incoming stock: item, qty, cost, supplier, date | Phase 2
**F-137: Supplier Management** — CRUD suppliers: name, phone, address, items supplied | Phase 2
**F-141: Waste Logging** — Log daily waste with reason + cost impact | Phase 2
**F-143: Physical Stock Count** — Enter actual quantities, system calculates variance | Phase 2
**F-153: Stock Movement Ledger** — Full history: purchase, sale, waste, transfer, adjustment | Phase 2
**F-154: Category Filtering** — Filter by: produce, meat, dairy, dry goods, beverages, packaging | Phase 2

### P1 - Should Have

**F-132: Auto-Deduct on Sale** — Sell momo plate → auto-subtract flour/chicken/spices from recipes | Phase 2
**F-134: Photo Invoice Scan** — Photograph supplier bill → AI extracts items, quantities, prices | Phase 3
**F-136: AI Purchase Suggestions** — Demand forecast → auto-generate purchase order | Phase 3
**F-138: Multi-Supplier per Item** — Compare prices across suppliers | Phase 2
**F-139: Recipe Management** — Link menu items to ingredient recipes with qty per serving | Phase 2
**F-140: Food Cost Calculation** — Auto-calculate food cost % per menu item | Phase 2
**F-142: Expiry Tracking** — FIFO alerts: "Use paneer today — expires tomorrow" | Phase 2
**F-145: Cost Variance Alerts** — Alert when supplier price changes >10% | Phase 2
**F-147: Stock Valuation** — Total inventory value at any point (qty x cost) | Phase 2
**F-148: Ingredient-Level Tracking** — Down to individual ingredients, not just finished goods | Phase 2
**F-149: Configurable Min Stock** — Different thresholds for different days (higher weekends) | Phase 2
**F-150: Purchase History** — Per supplier: dates, items, costs, trends | Phase 2
**F-152: Auto PO from Forecast** — AI generates PO from 3-day demand forecast | Phase 3
**F-155: Unit Conversion** — 1kg=1000g, 1 dozen=12 pieces | Phase 2

### P2 - Nice to Have

**F-144: Inter-Branch Transfer** — Move stock between locations | Phase 4
**F-146: Central Kitchen** — Manage central prep → branch distribution | Phase 4
**F-151: Batch/Lot Tracking** — Track which batch is being used (FIFO) | Phase 3

---

## Related
- [[03-menu-management]] - Recipes link to menu items
- [[05-kitchen-kds]] - Low stock warnings
- [[11-analytics-ai]] - Food cost analytics, demand forecasting
