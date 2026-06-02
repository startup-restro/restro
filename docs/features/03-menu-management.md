# 🍽️ Menu Management

> **Module**: Menu | **Total Features**: 25 | **Phase 1 Count**: 10
> **Core Principle**: Photo-heavy. Icon-driven. One-tap interaction.

---

## Features

### P0 - Must Have (Phase 1 Launch)

**F-046: CRUD Categories**
- Create, read, update, delete menu categories
- Fields: name, local name (Nepali/Hindi), icon (emoji 🥟🍜🍛🥤), sort order
- Toggle active/inactive

**F-047: CRUD Menu Items**
- Fields: name, local name, description, base price, cost price, photo, category
- Dietary tags: veg, vegan, gluten-free, halal, spicy
- Allergen list
- Estimated prep time

**F-048: Item Variants**
- Multiple variants per item (size, cooking method)
- Each variant has price adjustment (+/- from base)
- Example: Chicken Momo → Steamed (Rs 200), Fried (+Rs 20 = Rs 220)
- Default variant flag

**F-049: Item Modifiers**
- Modifier groups: "Spice Level", "Add-ons", "Extras"
- Options with prices: [{name:"Extra Chutney", price:20}]
- Required vs optional, min/max selections
- Link modifiers to items (many-to-many)

**F-051: Photo Upload**
- Camera capture or gallery selection
- Stored in MinIO (S3-compatible)
- Displayed on menu grid, QR menu, online ordering

**F-053: QR Menu Generation**
- Unique QR code per table
- Scanning opens digital menu in customer's browser
- No app download required

**F-055: 86'd Items**
- One-tap to mark item as unavailable
- Instantly hidden from QR menu, online ordering, all channels
- Visible to staff as greyed out

**F-063: Instant Item Search**
- Search by name across all categories
- Results in <300ms
- Fuzzy matching for typos

**F-067: Category Visibility Toggle**
- Toggle entire category visible/hidden without deleting
- Hidden categories don't appear on POS or customer-facing menus

### P1 - Should Have (Phase 2)

**F-050: Combo Meals**
- Create meal deals combining multiple items at package price
- Example: "Lunch Special: Thali + Lassi = Rs 280 (save Rs 40)"

**F-054: Menu Scheduling**
- Time-based visibility: breakfast (6-11AM), lunch (11AM-3PM), dinner (5-10PM)
- Auto-switches categories by time

**F-057: Multi-Language Menu**
- Items have fields for multiple languages
- QR menu auto-shows customer's phone language

**F-060: Menu Performance Scoring**
- BCG Matrix: Stars (high pop + high profit), Plowhorses (high pop + low profit), Puzzles (low pop + high profit), Dogs (low pop + low profit)
- Visible in analytics

**F-062: Bulk Price Update**
- "Increase all items by 5%" or "All momos +Rs 20"

**F-066: Sort Items**
- Sort within category by: manual order, popularity, price, newest

**F-068: Item Cost Price**
- Record cost per item (from recipe or manual entry)
- Used for food cost % calculations

**F-069: Menu Preview**
- Owner previews customer QR view before publishing changes

**F-070: Popular/New Badge**
- Mark items as "Popular" 🔥 or "New" ✨
- Auto-suggest based on sales data

### P2 - Nice to Have (Phase 3+)

**F-052: AI Photo Enhancement**
- Upload rough food photo → AI enhances (brightness, contrast, color)
- Professional-looking menus without a photographer

**F-056: Dynamic Pricing**
- Different prices by time (happy hour), day (weekend), or channel (delivery markup)

**F-058: Nutrition Info**
- Calories, allergens, dietary tags (optional fields)
- Auto-calculate from recipe ingredients

**F-059: AI Menu Builder**
- "You're a cafe in Pokhara — here are popular items in your area"
- Suggests items based on restaurant type + location + similar restaurant data

**F-061: Seasonal Suggestions**
- AI recommends items based on festivals (Dashain, Diwali, Eid), weather, trends

**F-064: Menu Export**
- Export as PDF (printable), CSV, JSON

**F-065: Menu Import**
- Import from CSV/JSON file, map columns to fields

---

## Menu Item Data Model
```
Menu Item
├── name / name_local
├── description
├── base_price / cost_price
├── photo_url
├── category_id
├── is_available (86'd toggle)
├── is_popular
├── dietary_tags[] (veg, halal, etc)
├── allergens[]
├── prep_time_min
├── calories
├── sort_order
├── sales_count (denormalized)
├── variants[]
│   ├── name
│   ├── price_adjustment
│   └── is_default
└── modifiers[] (linked)
    ├── name ("Spice Level")
    ├── options[] ({name, price})
    ├── is_required
    └── min/max_selections
```

## Related
- [[02-order-management]] - Orders reference menu items
- [[07-inventory-management]] - Recipes link menu items to ingredients
- [[11-analytics-ai]] - Menu performance scoring
