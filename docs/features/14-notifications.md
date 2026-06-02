# 🔔 Notifications

> **Module**: Notifications | **Total Features**: 10 | **Phase 1 Count**: 5
> **Core Principle**: Multi-channel (push, SMS, WhatsApp, in-app). Template per language.

---

## Features

### P0 - Must Have (Phase 1)

**F-266: Push Notifications** — New order, low stock, staff alert, daily summary
**F-267: SMS Alerts** — OTP, table ready (waitlist), critical alerts. Via Sparrow SMS (Nepal) / MSG91 (India)
**F-268: WhatsApp Notifications** — Order updates, delivery tracking, khata reminders, marketing. Via WhatsApp Business API.
**F-269: In-App Notification Center** — Bell icon with badge count. List of all notifications. Mark as read.
**F-274: Badge Count** — Unread count on app icon + bell icon

### P1 - Should Have (Phase 2)

**F-270: Configurable Preferences** — Each user picks which notifications + which channel
**F-271: Templates Per Language** — EN, NE, HI, BN. Auto-select by user language.
**F-275: Notification History** — View all sent notifications with delivery status

### P2 - Nice to Have (Phase 3+)

**F-272: Scheduled Notifications** — Schedule promos for future date/time
**F-273: Bulk Notifications** — Send to customer segment (e.g., all Gold tier)

---

## WhatsApp Templates

| Template | Use Case |
|----------|----------|
| `order_confirmation` | Order placed: items, total, ETA |
| `order_ready` | Your order is ready! |
| `delivery_update` | Rider is on the way, ETA, tracking link |
| `khata_reminder` | Pending balance reminder with payment link |
| `birthday_offer` | Birthday discount |
| `win_back` | "We miss you" with coupon code |
| `loyalty_update` | Points earned, balance, next tier |
| `feedback_request` | Post-meal rating request |
| `reservation_confirm` | Date, time, party size, table |
| `marketing_promo` | Promotional broadcast (with STOP option) |

## Related
- [[06-billing-payments]] - Receipt via SMS/WhatsApp
- [[10-customer-loyalty]] - Marketing notifications
- [[11-online-ordering-delivery]] - Delivery updates
