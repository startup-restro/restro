# 📊 Analytics & AI

> **Module**: Analytics + AI | **Total Features**: 25 | **Phase 1 Count**: 4
> **Core Principle**: Mobile-first dashboard. AI insights are actionable. Voice-first for owners.

---

## Features

### P0 - Must Have (Phase 1)

**F-226: Daily Dashboard** — Revenue, orders, avg order, food cost %. Loads in <2 seconds. Mobile-first.
**F-227: Sales Report** — By hour/day/week/month/year with period comparison (% change)
**F-233: Tax Report** — Nepal IRD format, India GSTR-1 format. Pre-formatted for filing.
**F-242: Report Export** — Any report as PDF, Excel, CSV

### P1 - Should Have (Phase 2)

**F-228: Item-Wise P&L** — Per menu item: qty sold, revenue, cost, profit, margin %
**F-229: Peak Hour Analysis** — Orders by hour chart, busiest/slowest identification
**F-230: Staff Performance** — Compare: orders, avg bill, upsells, speed, ratings
**F-231: Waste Report** — Daily/weekly/monthly, cost impact, by reason
**F-232: Cash Flow** — Money in vs out, daily balance
**F-236: AI Demand Forecast** — Predict per-item demand for next 3 days
**F-237: AI Menu Doctor** — Stars/Plowhorses/Puzzles/Dogs classification
**F-243: Scheduled Auto-Reports** — Daily summary via WhatsApp/email
**F-246: Payment Method Analysis** — Cash vs digital trend over time
**F-247: Discount Analysis** — By type, by staff, abuse detection
**F-250: Real-Time Order Feed** — Live across all channels

### P2 - Nice to Have (Phase 3+)

**F-234: Benchmarking** — Compare vs similar restaurants in area (anonymized)
**F-235: AI Chat With Data** — "How much did I earn last Dashain?" → instant answer with chart
**F-238: AI Anomaly Detection** — High voids, cash discrepancy, after-hours activity
**F-239: AI Smart Pricing** — Adjust based on costs, demand, competition
**F-240: AI Staff Scheduling** — Optimal schedule from demand prediction
**F-241: Custom Report Builder** | **F-244: Multi-Branch Comparison** | **F-245: Customer LTV Report** | **F-248: Revenue Per Table** | **F-249: Hourly Staff Cost vs Revenue**

---

## AI Engine ("Restro Brain")

| Feature | On-Device? | Cloud? | Phase |
|---------|-----------|--------|-------|
| Voice Ordering (Whisper ONNX, 150MB) | ✅ | Fallback | P3 |
| Menu Matching (fuzzy search, 5MB) | ✅ | - | P3 |
| Basic OCR (Tesseract lite, 30MB) | ✅ | - | P3 |
| Invoice Structured Extraction | - | ✅ LLM | P3 |
| Demand Forecast (Prophet + LightGBM) | - | ✅ | P3 |
| Menu Engineering (cross-restaurant) | - | ✅ | P3 |
| Anomaly Detection (Isolation Forest) | - | ✅ | P3 |
| Chat With Data (LLM + SQL) | - | ✅ | P3 |
| Photo Enhancement (diffusion model) | - | ✅ GPU | P3 |
| Smart Pricing (optimization) | - | ✅ | P4 |

## Related
- [[06-billing-payments]] - Revenue data source
- [[07-inventory-management]] - Food cost data
- [[08-staff-management]] - Performance data
