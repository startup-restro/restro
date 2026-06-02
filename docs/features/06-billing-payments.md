# 💰 Billing & Payments

> **Module**: Billing | **Total Features**: 30 | **Phase 1 Count**: 18
> **Core Principle**: Cash-first design. Multi-country tax. Khata is native.

---

## Features

### P0 - Must Have (Phase 1 Launch)

**F-101: One-Tap Billing**
- Generate bill from order with one tap
- Auto-calculates: subtotal, discount, service charge, tax breakdown, round-off, total

**F-102: Nepal VAT Compliance**
- Auto-apply 13% VAT
- IRD-compliant invoice: PAN number, sequential invoice number, date, VAT amount
- Invoice prefix configurable (e.g., "INV-000001")

**F-105: Split Bill by Item**
- Drag items to different guests → each gets own bill

**F-106: Split Bill Equally**
- Divide total equally among N guests

**F-109: Multi-Payment**
- A single bill can be paid with multiple methods
- Example: Rs 500 cash + Rs 370 eSewa = Rs 870 total

**F-110: Cash Handling**
- Enter cash received amount
- Auto-calculate change due
- Quick denomination buttons: Rs 500, Rs 1000, Rs 2000

**F-112: Digital Receipt**
- Send receipt via SMS, WhatsApp, or email
- Customer chooses at checkout
- Saves paper (very common preference in Asia)

**F-113: Thermal Print Receipt**
- Print on Bluetooth/USB thermal printer
- Support 58mm and 80mm paper widths
- Customizable footer (thank you message, promo, social links)

**F-114: Discount - Percentage**
- Quick buttons: 5%, 10%, 15%, 20%, custom
- Role-based limits: cashier ≤10%, manager ≤30%, owner unlimited

**F-115: Discount - Flat Amount**
- Enter flat Rs amount discount

**F-120: Khata Credit System** ⭐
- Add bill amount to customer's credit balance (Khata/Udhaar)
- Running balance tracked per customer
- This is how millions of Asian restaurants actually work

**F-121: Khata Credit Limit**
- Set maximum credit limit per customer
- Warning at 80% utilization
- Block new credit when limit exceeded

**F-122: Khata Payment Recording**
- Record cash/digital payment against khata balance
- Updates running balance in real-time

**F-126: Service Charge**
- Configurable rate (0-15%)
- Toggle on/off per order

**F-128: Round-Off**
- Auto-round bill total to nearest Rs 1, 5, or 10
- Configurable per restaurant

**F-129: EOD Cash Reconciliation**
- Compare expected cash (from bills) vs actual counted cash
- Show discrepancy amount
- One-tap end-of-day settlement

**F-130: Void / Refund**
- Void a finalized bill or process refund
- Requires manager+ PIN
- Reason mandatory
- Logged in audit trail (immutable)

### P1 - Should Have (Phase 2)

**F-103: India GST Compliance**
- GST slabs: 5% (non-AC, <Rs 7500 turnover) / 18% (AC restaurants)
- GSTIN (15-digit) on invoices
- HSN codes for food items

**F-107: Split Bill by Percentage**
- Custom split: 60/40, 70/30, etc.

**F-108: Split Bill by Custom Amount**
- Each guest pays a different specific amount

**F-111: Cash Denomination Tracking**
- Track cash drawer by note: Rs 10/20/50/100/500/1000
- Opening count + closing count = variance

**F-116: Discount - Coupon Code**
- Enter promo code → validate against active campaigns → auto-apply

**F-118: Discount - Loyalty Points**
- Redeem loyalty points as discount at checkout
- Show available points balance

**F-123: Khata WhatsApp Reminder**
- Send balance reminder via WhatsApp
- Template: "Hi Ram, you have Rs 4,200 pending at Momo House"

**F-124: Digital Tipping**
- Add tip amount on digital payment
- Tracked separately from bill total

### P2 - Nice to Have (Phase 3+)

**F-104: Bangladesh VAT** - 5% VAT, BIN-compliant
**F-117: Happy Hour Auto-Discount** - Time-based auto-apply
**F-119: Employee Discount** - Separate tracking category
**F-125: Tip Pool Distribution** - Auto-distribute by rules
**F-127: Multi-Currency** - USD/EUR with daily FX rate for tourist areas

---

## Payment Gateways

| Gateway | Country | Phase | Integration |
|---------|---------|-------|-------------|
| **Cash** | All | P1 | Native |
| **eSewa** | Nepal | P1 | eSewa Web/App SDK |
| **Khalti** | Nepal | P1 | Khalti Gateway API |
| FonePay | Nepal | P2 | FonePay QR API |
| ConnectIPS | Nepal | P2 | Bank transfer API |
| Razorpay | India | P3 | UPI, cards, wallets |
| bKash | Bangladesh | P4 | bKash Payment API |
| Nagad | Bangladesh | P4 | Nagad API |
| Visa/MC | All | P3 | Via Razorpay/gateway |

## Bill Calculation
```
Subtotal (sum of item prices)
 - Discount (% or flat)
 + Service Charge (% of subtotal after discount)
 + Tax (% of subtotal + service charge, per country rules)
 ± Round-off
 = Grand Total
```

## Related
- [[02-order-management]] - Bills generated from orders
- [[08-staff-management]] - Role-based discount limits
- [[09-offline-sync]] - Bills sync with append-only payments
- [[11-analytics-ai]] - Revenue analytics, payment method analysis
