# 👥 Staff Management

> **Module**: Staff | **Total Features**: 20 | **Phase 1 Count**: 9
> **Core Principle**: Simple roles. PIN access. Salary advance tracking (critical for Asia).

---

## Features

### P0 - Must Have (Phase 1)

**F-156: Staff Profiles** — Name, phone, photo, role, language preference, hourly rate or monthly salary
**F-157: Role-Based Access** — 6 roles: owner, manager, cashier, waiter, kitchen, delivery. See RBAC matrix.
**F-160: Clock In/Out** — Via app button. Timestamp recorded. Optional GPS location.
**F-161: Attendance Report** — By staff by date range: present, absent, late, hours worked, overtime
**F-165: Salary Advance** — Record advances given to staff. Track against monthly salary. Very common in Asia.
**F-168: Multi-Language Staff UI** — Each staff member sees UI in their chosen language
**F-173: Staff Directory** — All active staff with role, contact, shift schedule. Quick-call button.
**F-174: Access Log** — Track who logged in, when, from which device
**F-175: Deactivate Staff** — Deactivate (not delete). Revokes access immediately. Preserves historical data.

### P1 - Should Have (Phase 2)

**F-158: Custom Permissions** — Override default role permissions for specific staff
**F-159: Shift Scheduler** — Visual weekly calendar, drag-and-drop shift assignment
**F-162: Performance Dashboard** — Per-staff: orders handled, avg bill, upsell rate, speed
**F-164: Payroll Calculator** — (hours x rate) + tips + OT - advances - deductions = net pay
**F-166: Staff Meal Tracking** — Log meals consumed by staff (common perk), track cost separately
**F-171: Late/Absence Alerts** — Auto-notify manager if staff late >15 min
**F-172: Overtime Calculation** — Auto-calculate beyond daily/weekly limits

### P2 - Nice to Have (Phase 3+)

**F-163: Tip Pooling** — Auto-distribute by rules (equal, hours, role)
**F-167: AI Training Modules** — AI-generated guides per role
**F-169: Biometric Clock-In** — Fingerprint reader for larger restaurants
**F-170: Staff Announcements** — Manager posts visible to all staff

---

## RBAC Summary

| Permission Area | Owner | Manager | Cashier | Waiter | Kitchen | Delivery |
|----------------|-------|---------|---------|--------|---------|----------|
| Create orders | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Cancel orders | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Apply discount | Unlimited | ≤30% | ≤10% | ❌ | ❌ | ❌ |
| Void bill | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage menu | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View reports | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage staff | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Update KOT status | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| View inventory | ✅ | ✅ | ❌ | ❌ | View only | ❌ |
| Manage settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## Related
- [[01-authentication-onboarding]] - Staff invite, PIN switch
- [[06-billing-payments]] - Discount authorization limits
- [[11-analytics-ai]] - Staff performance analytics
