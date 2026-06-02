# 🔐 Authentication & Onboarding

> **Module**: Auth | **Total Features**: 15 | **Phase 1 Count**: 11
> **Core Principle**: Phone-first, no email required. <5 min signup to first order.

---

## Features

### P0 - Must Have (Phase 1 Launch)

**F-001: Phone OTP Login**
- User authenticates via phone number + 6-digit OTP sent via SMS
- No email required - most Asian restaurant owners don't use email
- OTP expires in 5 minutes
- Rate limit: max 5 OTP requests per phone per hour

**F-002: Country Auto-Configuration**
- First launch: user selects country (Nepal / India / Bangladesh / Sri Lanka)
- Auto-configures: currency, tax rules, language, payment methods
- Example: Nepal → NPR, VAT 13%, Nepali, eSewa/Khalti

**F-003: Restaurant Setup Wizard**
- Fields: restaurant name, type (restaurant/cafe/bar/QSR/street food/cloud kitchen), location, number of tables
- Must complete in <2 minutes
- Auto-generates slug for QR menu URL

**F-006: Manual Menu Entry**
- Add items one-by-one: name, category, price, photo, variants
- Simplest path for non-tech-savvy owners

**F-007: Staff Invite via SMS**
- Owner enters staff phone number → staff receives SMS with download link + join code
- No complex setup needed

**F-008: PIN-Based Staff Switch**
- Shared POS tablet: staff switch by entering 4-digit PIN
- No full re-authentication required
- Switch takes <2 seconds
- Logs switch in audit trail

**F-009: Multi-Device Registration**
- Restaurant can register up to 10 devices
- Devices trusted after first login
- Device types: POS tablet, waiter phone, owner phone, KDS, kiosk

**F-010: Onboarding Speed**
- Total onboarding from signup to first order: <5 minutes
- Critical competitive differentiator

**F-011: Auto Tax Configuration**
- Nepal: VAT 13%
- India: GST 5% (non-AC) / 18% (AC)
- Bangladesh: VAT 5%
- Owner can customize if needed

**F-012: Multi-Language UI**
- Languages: English, Nepali, Hindi, Bengali
- Language persists per user, not per device
- UI is icon-driven so minimal reading needed

**F-014: Account Recovery**
- Staff forgot PIN → manager/owner resets it
- Owner lost phone → recovery via OTP to same number

### P1 - Should Have (Phase 2)

**F-004: Menu Setup via Photo Import**
- Owner photographs existing paper/board menu
- AI extracts items, categories, prices
- Accuracy target: >85% for printed menus
- Uses OCR (Tesseract + custom Devanagari model) + LLM extraction

**F-005: Menu Setup via Voice Import**
- Owner speaks: "Add chicken momo, Rs 200, steamed and fried"
- AI creates items with categories, variants, prices
- Uses Whisper (speech-to-text) + NLP parsing

### P2 - Nice to Have (Phase 3+)

**F-013: Interactive Tutorial Walkthrough**
- Optional 5-screen tap-through tutorial
- Shows order → kitchen → bill flow

**F-015: Demo Mode**
- Pre-populated demo restaurant for exploration before setup

---

## Technical Notes
- Auth: JWT (15 min) + Refresh Token (30 days, rotation)
- OTP storage: Redis with 5 min TTL
- SMS gateway: Sparrow SMS (Nepal), MSG91 (India)
- Staff PIN: bcrypt hashed in `users.pin`
- RLS context: `SET app.restaurant_id` on each DB connection

## Related
- [[02-order-management]] - Orders require authenticated staff
- [[../architecture/DATABASE_AND_API]] - `users`, `devices` tables
- [[../architecture/INFRASTRUCTURE_AND_AI]] - Auth flow diagrams
