# RestroVerse — Database Schema & API Design
> **Implementation-ready. Copy-paste SQL. Build from this.**

---

## PART 1: DATABASE SCHEMA (PostgreSQL 16)

### 1.1 ENUM Types

```sql
-- Core enums
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'pro_plus', 'enterprise');
CREATE TYPE order_type AS ENUM ('dine_in', 'takeaway', 'delivery', 'online', 'reservation');
CREATE TYPE order_status AS ENUM ('draft', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled');
CREATE TYPE table_status AS ENUM ('available', 'occupied', 'reserved', 'cleaning', 'blocked');
CREATE TYPE payment_method_type AS ENUM ('cash', 'esewa', 'khalti', 'fonepay', 'connectips', 'upi', 'phonepe', 'gpay', 'paytm', 'card', 'bkash', 'nagad', 'khata', 'other');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE bill_status AS ENUM ('draft', 'finalized', 'paid', 'partially_paid', 'void');
CREATE TYPE stock_movement_type AS ENUM ('purchase', 'sale', 'waste', 'transfer', 'adjustment', 'return');
CREATE TYPE delivery_status AS ENUM ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled');
CREATE TYPE shift_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled', 'no_show');
CREATE TYPE khata_entry_type AS ENUM ('credit', 'payment', 'adjustment', 'writeoff');
CREATE TYPE loyalty_txn_type AS ENUM ('earn', 'redeem', 'expire', 'adjust', 'bonus');
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show');
CREATE TYPE kot_status AS ENUM ('pending', 'cooking', 'ready', 'served', 'cancelled');
CREATE TYPE discount_type AS ENUM ('percentage', 'flat', 'coupon', 'loyalty', 'employee', 'happy_hour');
CREATE TYPE notification_channel AS ENUM ('push', 'sms', 'whatsapp', 'email', 'in_app');
CREATE TYPE device_type AS ENUM ('pos_tablet', 'waiter_phone', 'owner_phone', 'kds', 'kiosk', 'web');

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 1.2 Core Tables

```sql
-- ============================================================
-- RESTAURANTS (Top-level tenant)
-- ============================================================
CREATE TABLE restaurants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  type          TEXT NOT NULL DEFAULT 'restaurant', -- restaurant, cafe, bar, qsr, street_food, cloud_kitchen
  country       TEXT NOT NULL DEFAULT 'NP',         -- NP, IN, BD, LK, MM
  currency      TEXT NOT NULL DEFAULT 'NPR',
  timezone      TEXT NOT NULL DEFAULT 'Asia/Kathmandu',
  phone         TEXT,
  email         TEXT,
  address       TEXT,
  city          TEXT,
  lat           DECIMAL(10,7),
  lng           DECIMAL(10,7),
  logo_url      TEXT,
  cover_url     TEXT,
  tax_config    JSONB NOT NULL DEFAULT '[]',        -- [{name:"VAT", rate:13, inclusive:false, applies_to:"all"}]
  settings      JSONB NOT NULL DEFAULT '{}',        -- service_charge, round_off, receipt_footer, etc
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_country ON restaurants(country);
CREATE INDEX idx_restaurants_active ON restaurants(is_active) WHERE is_active = true;
CREATE TRIGGER trg_restaurants_updated BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- USERS (Staff / Owners)
-- ============================================================
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  phone         TEXT NOT NULL,
  email         TEXT,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'waiter',  -- owner, manager, cashier, waiter, kitchen, delivery, admin
  pin           TEXT,                             -- 4-digit PIN for quick switch on shared device
  avatar_url    TEXT,
  language      TEXT NOT NULL DEFAULT 'en',       -- en, ne, hi, bn
  permissions   JSONB NOT NULL DEFAULT '[]',      -- override per-user if needed
  hourly_rate   DECIMAL(10,2),
  monthly_salary DECIMAL(10,2),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(restaurant_id, phone)
);

CREATE INDEX idx_users_restaurant ON users(restaurant_id);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(restaurant_id, role);
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- DEVICES (Registered devices per restaurant)
-- ============================================================
CREATE TABLE devices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  device_type   device_type NOT NULL,
  device_name   TEXT,                             -- "POS Tablet 1", "Kitchen Screen"
  device_id     TEXT NOT NULL,                    -- hardware/app identifier
  last_sync_at  TIMESTAMPTZ,
  last_user_id  UUID REFERENCES users(id),
  is_trusted    BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_restaurant ON devices(restaurant_id);
CREATE UNIQUE INDEX idx_devices_unique ON devices(restaurant_id, device_id);
```

### 1.3 Menu Tables

```sql
-- ============================================================
-- MENU CATEGORIES
-- ============================================================
CREATE TABLE menu_categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  name_local    TEXT,                             -- Nepali/Hindi name
  icon          TEXT,                             -- emoji: 🥟🍜🍛🥤
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  schedule      JSONB,                            -- {start_time:"06:00", end_time:"11:00"} for breakfast etc
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_menu_categories_restaurant ON menu_categories(restaurant_id);
CREATE INDEX idx_menu_categories_sort ON menu_categories(restaurant_id, sort_order);
CREATE TRIGGER trg_menu_categories_updated BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- MENU ITEMS
-- ============================================================
CREATE TABLE menu_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id   UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  name_local    TEXT,
  description   TEXT,
  base_price    DECIMAL(10,2) NOT NULL,
  cost_price    DECIMAL(10,2),                    -- ingredient cost (from recipes)
  photo_url     TEXT,
  is_available  BOOLEAN NOT NULL DEFAULT true,    -- false = 86'd
  is_popular    BOOLEAN NOT NULL DEFAULT false,
  dietary_tags  TEXT[] DEFAULT '{}',               -- veg, vegan, gluten_free, halal, spicy
  allergens     TEXT[] DEFAULT '{}',
  prep_time_min INT,                              -- estimated prep time in minutes
  calories      INT,
  sort_order    INT NOT NULL DEFAULT 0,
  sales_count   INT NOT NULL DEFAULT 0,           -- denormalized for performance scoring
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(restaurant_id, is_available);
CREATE INDEX idx_menu_items_popular ON menu_items(restaurant_id, is_popular) WHERE is_popular = true;
CREATE TRIGGER trg_menu_items_updated BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- MENU VARIANTS (Steamed/Fried, Small/Large, etc)
-- ============================================================
CREATE TABLE menu_variants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id    UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  price_adjustment DECIMAL(10,2) NOT NULL DEFAULT 0, -- +20 for fried, 0 for steamed
  is_default      BOOLEAN NOT NULL DEFAULT false,
  is_available    BOOLEAN NOT NULL DEFAULT true,
  sort_order      INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_menu_variants_item ON menu_variants(menu_item_id);

-- ============================================================
-- MENU MODIFIERS (Spice level, Add-ons, Extras)
-- ============================================================
CREATE TABLE menu_modifiers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,                   -- "Spice Level", "Add-ons"
  options         JSONB NOT NULL DEFAULT '[]',     -- [{name:"Mild",price:0},{name:"Hot",price:0},{name:"Extra Chutney",price:20}]
  is_required     BOOLEAN NOT NULL DEFAULT false,
  min_selections  INT NOT NULL DEFAULT 0,
  max_selections  INT NOT NULL DEFAULT 1,
  sort_order      INT NOT NULL DEFAULT 0
);

CREATE INDEX idx_menu_modifiers_restaurant ON menu_modifiers(restaurant_id);

-- Link items to modifiers (many-to-many)
CREATE TABLE menu_item_modifiers (
  menu_item_id  UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  modifier_id   UUID NOT NULL REFERENCES menu_modifiers(id) ON DELETE CASCADE,
  PRIMARY KEY (menu_item_id, modifier_id)
);

-- ============================================================
-- COMBOS (Meal deals)
-- ============================================================
CREATE TABLE combos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  price         DECIMAL(10,2) NOT NULL,
  photo_url     TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE combo_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id    UUID NOT NULL REFERENCES combos(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  quantity    INT NOT NULL DEFAULT 1,
  variant_id  UUID REFERENCES menu_variants(id)
);
```

### 1.4 Floor / Table Tables

```sql
-- ============================================================
-- SPACES (Ground floor, First floor, Outdoor, etc)
-- ============================================================
CREATE TABLE spaces (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  sort_order    INT NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_spaces_restaurant ON spaces(restaurant_id);

-- ============================================================
-- TABLES
-- ============================================================
CREATE TABLE tables (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  space_id        UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,                   -- "T1", "Cabin 2", "Bar Seat 3"
  capacity        INT NOT NULL DEFAULT 4,
  shape           TEXT NOT NULL DEFAULT 'square',  -- square, round, rectangle
  x_pos           INT NOT NULL DEFAULT 0,          -- floor plan position
  y_pos           INT NOT NULL DEFAULT 0,
  width           INT NOT NULL DEFAULT 1,
  height          INT NOT NULL DEFAULT 1,
  status          table_status NOT NULL DEFAULT 'available',
  current_order_id UUID,                           -- active order on this table
  occupied_at     TIMESTAMPTZ,
  server_id       UUID REFERENCES users(id),
  qr_code         TEXT,                            -- unique QR for this table
  sort_order      INT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);
CREATE INDEX idx_tables_space ON tables(space_id);
CREATE INDEX idx_tables_status ON tables(restaurant_id, status);
CREATE TRIGGER trg_tables_updated BEFORE UPDATE ON tables FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 1.5 Order Tables

```sql
-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  order_number    SERIAL,                          -- human-readable #1, #2...
  table_id        UUID REFERENCES tables(id),
  customer_id     UUID,                            -- FK added after customers table
  type            order_type NOT NULL DEFAULT 'dine_in',
  status          order_status NOT NULL DEFAULT 'draft',
  channel         TEXT NOT NULL DEFAULT 'pos',     -- pos, qr, whatsapp, web, aggregator
  aggregator      TEXT,                            -- foodmandu, swiggy, zomato, null
  guest_count     INT,
  notes           TEXT,
  priority        TEXT DEFAULT 'normal',           -- normal, rush, vip
  created_by      UUID REFERENCES users(id),
  cancelled_reason TEXT,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Offline sync fields
  sync_id         UUID,                            -- client-generated ID for dedup
  device_id       TEXT,
  vector_clock    JSONB DEFAULT '{}'
);

CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(restaurant_id, status);
CREATE INDEX idx_orders_table ON orders(table_id) WHERE table_id IS NOT NULL;
CREATE INDEX idx_orders_customer ON orders(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX idx_orders_created ON orders(restaurant_id, created_at DESC);
CREATE INDEX idx_orders_type ON orders(restaurant_id, type);
CREATE INDEX idx_orders_sync ON orders(sync_id) WHERE sync_id IS NOT NULL;
CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id    UUID NOT NULL REFERENCES menu_items(id),
  variant_id      UUID REFERENCES menu_variants(id),
  quantity        INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price      DECIMAL(10,2) NOT NULL,          -- price at time of order (snapshot)
  modifiers       JSONB DEFAULT '[]',              -- [{name:"Extra Chutney", price:20}]
  notes           TEXT,                            -- "no onion", "extra spicy"
  status          kot_status NOT NULL DEFAULT 'pending',
  sent_to_kitchen_at TIMESTAMPTZ,
  prepared_at     TIMESTAMPTZ,
  is_void         BOOLEAN NOT NULL DEFAULT false,
  void_reason     TEXT,
  void_by         UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item ON order_items(menu_item_id);
CREATE INDEX idx_order_items_status ON order_items(status) WHERE status != 'served';

-- ============================================================
-- KITCHEN TICKETS (KOT)
-- ============================================================
CREATE TABLE kitchen_tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  ticket_number   SERIAL,
  station         TEXT NOT NULL DEFAULT 'main',    -- main, bar, pastry, grill
  items           JSONB NOT NULL,                  -- snapshot of items for this ticket
  status          kot_status NOT NULL DEFAULT 'pending',
  priority        TEXT DEFAULT 'normal',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  prep_time_secs  INT,                             -- actual prep time
  created_by      UUID REFERENCES users(id),
  completed_by    UUID REFERENCES users(id)
);

CREATE INDEX idx_kitchen_tickets_restaurant ON kitchen_tickets(restaurant_id);
CREATE INDEX idx_kitchen_tickets_status ON kitchen_tickets(restaurant_id, status);
CREATE INDEX idx_kitchen_tickets_order ON kitchen_tickets(order_id);
CREATE INDEX idx_kitchen_tickets_station ON kitchen_tickets(restaurant_id, station, status);
```

### 1.6 Billing Tables

```sql
-- ============================================================
-- BILLS
-- ============================================================
CREATE TABLE bills (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  order_id        UUID NOT NULL REFERENCES orders(id),
  customer_id     UUID,
  invoice_number  TEXT NOT NULL,                    -- IRD/GST compliant sequential number
  subtotal        DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_type   discount_type,
  discount_detail TEXT,                            -- "10% off", "DASHAIN2026"
  service_charge  DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_amount      DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax_breakdown   JSONB DEFAULT '[]',              -- [{name:"VAT",rate:13,amount:100}]
  tip_amount      DECIMAL(10,2) NOT NULL DEFAULT 0,
  round_off       DECIMAL(10,2) NOT NULL DEFAULT 0,
  total           DECIMAL(10,2) NOT NULL,
  status          bill_status NOT NULL DEFAULT 'draft',
  notes           TEXT,
  created_by      UUID REFERENCES users(id),
  voided_by       UUID REFERENCES users(id),
  void_reason     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bills_restaurant ON bills(restaurant_id);
CREATE INDEX idx_bills_order ON bills(order_id);
CREATE INDEX idx_bills_customer ON bills(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX idx_bills_created ON bills(restaurant_id, created_at DESC);
CREATE INDEX idx_bills_status ON bills(restaurant_id, status);
CREATE INDEX idx_bills_invoice ON bills(restaurant_id, invoice_number);
CREATE TRIGGER trg_bills_updated BEFORE UPDATE ON bills FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Invoice number generator
CREATE OR REPLACE FUNCTION generate_invoice_number(p_restaurant_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_count INT;
  v_prefix TEXT;
BEGIN
  SELECT COUNT(*) + 1 INTO v_count FROM bills WHERE restaurant_id = p_restaurant_id;
  SELECT COALESCE(settings->>'invoice_prefix', 'INV') INTO v_prefix FROM restaurants WHERE id = p_restaurant_id;
  RETURN v_prefix || '-' || LPAD(v_count::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id         UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id),
  method          payment_method_type NOT NULL,
  amount          DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  reference_number TEXT,                           -- gateway txn ID
  status          payment_status NOT NULL DEFAULT 'pending',
  gateway_response JSONB,                          -- full gateway response
  processed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_bill ON payments(bill_id);
CREATE INDEX idx_payments_restaurant ON payments(restaurant_id);
CREATE INDEX idx_payments_status ON payments(restaurant_id, status);

-- ============================================================
-- KHATA (Credit Book) — Asia's killer feature
-- ============================================================
CREATE TABLE khata_entries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_id     UUID NOT NULL,                   -- FK added after customers table
  bill_id         UUID REFERENCES bills(id),
  type            khata_entry_type NOT NULL,
  amount          DECIMAL(10,2) NOT NULL,          -- positive for credit (owes), negative for payment
  balance_after   DECIMAL(10,2) NOT NULL,          -- running balance
  note            TEXT,
  due_date        DATE,
  payment_method  payment_method_type,             -- for payment entries
  reminder_sent   BOOLEAN NOT NULL DEFAULT false,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_khata_restaurant ON khata_entries(restaurant_id);
CREATE INDEX idx_khata_customer ON khata_entries(customer_id);
CREATE INDEX idx_khata_created ON khata_entries(restaurant_id, created_at DESC);
```

### 1.7 Inventory Tables

```sql
-- ============================================================
-- SUPPLIERS
-- ============================================================
CREATE TABLE suppliers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  phone         TEXT,
  email         TEXT,
  address       TEXT,
  notes         TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_suppliers_restaurant ON suppliers(restaurant_id);

-- ============================================================
-- INVENTORY ITEMS
-- ============================================================
CREATE TABLE inventory_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  category        TEXT,                            -- produce, meat, dairy, dry_goods, beverages, packaging
  unit            TEXT NOT NULL DEFAULT 'kg',      -- kg, g, liter, ml, piece, dozen, packet
  current_stock   DECIMAL(10,3) NOT NULL DEFAULT 0,
  min_stock       DECIMAL(10,3) NOT NULL DEFAULT 0,
  cost_per_unit   DECIMAL(10,2) NOT NULL DEFAULT 0,
  default_supplier_id UUID REFERENCES suppliers(id),
  expiry_date     DATE,
  location        TEXT,                            -- "Main Kitchen", "Cold Storage"
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_restaurant ON inventory_items(restaurant_id);
CREATE INDEX idx_inventory_low_stock ON inventory_items(restaurant_id) WHERE current_stock <= min_stock;
CREATE INDEX idx_inventory_expiry ON inventory_items(restaurant_id, expiry_date) WHERE expiry_date IS NOT NULL;
CREATE TRIGGER trg_inventory_updated BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- STOCK MOVEMENTS (Ledger of all stock changes)
-- ============================================================
CREATE TABLE stock_movements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id),
  type            stock_movement_type NOT NULL,
  quantity        DECIMAL(10,3) NOT NULL,          -- positive=in, negative=out
  cost_per_unit   DECIMAL(10,2),
  total_cost      DECIMAL(10,2),
  reference_type  TEXT,                            -- 'order', 'purchase_order', 'waste_log', 'transfer'
  reference_id    UUID,
  note            TEXT,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stock_movements_item ON stock_movements(inventory_item_id);
CREATE INDEX idx_stock_movements_restaurant ON stock_movements(restaurant_id);
CREATE INDEX idx_stock_movements_type ON stock_movements(restaurant_id, type);
CREATE INDEX idx_stock_movements_created ON stock_movements(restaurant_id, created_at DESC);

-- ============================================================
-- RECIPES (Links menu items to inventory ingredients)
-- ============================================================
CREATE TABLE recipes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id    UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id)
);

CREATE TABLE recipe_ingredients (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id       UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id),
  quantity        DECIMAL(10,3) NOT NULL,          -- amount needed per serving
  unit            TEXT NOT NULL                    -- matches inventory item unit
);

CREATE INDEX idx_recipes_menu_item ON recipes(menu_item_id);
CREATE INDEX idx_recipe_ingredients_recipe ON recipe_ingredients(recipe_id);

-- ============================================================
-- PURCHASE ORDERS
-- ============================================================
CREATE TABLE purchase_orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  supplier_id   UUID REFERENCES suppliers(id),
  status        TEXT NOT NULL DEFAULT 'draft',     -- draft, sent, received, cancelled
  total         DECIMAL(10,2),
  notes         TEXT,
  expected_date DATE,
  received_at   TIMESTAMPTZ,
  created_by    UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE purchase_order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id),
  quantity        DECIMAL(10,3) NOT NULL,
  unit_cost       DECIMAL(10,2) NOT NULL,
  received_qty    DECIMAL(10,3) DEFAULT 0
);

CREATE INDEX idx_po_restaurant ON purchase_orders(restaurant_id);
```

### 1.8 Customer & Loyalty Tables

```sql
-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE customers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name            TEXT,
  phone           TEXT NOT NULL,
  email           TEXT,
  birthday        DATE,
  preferences     JSONB DEFAULT '{}',              -- {spice:"hot", no:["cilantro","onion"], favorite_items:[]}
  tags            TEXT[] DEFAULT '{}',             -- vip, regular, corporate
  notes           TEXT,
  loyalty_tier    TEXT NOT NULL DEFAULT 'bronze',  -- bronze, silver, gold, platinum
  loyalty_points  INT NOT NULL DEFAULT 0,
  total_visits    INT NOT NULL DEFAULT 0,
  total_spent     DECIMAL(12,2) NOT NULL DEFAULT 0,
  last_visit_at   TIMESTAMPTZ,
  khata_balance   DECIMAL(10,2) NOT NULL DEFAULT 0,
  khata_limit     DECIMAL(10,2) NOT NULL DEFAULT 0,
  do_not_disturb  BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(restaurant_id, phone)
);

CREATE INDEX idx_customers_restaurant ON customers(restaurant_id);
CREATE INDEX idx_customers_phone ON customers(restaurant_id, phone);
CREATE INDEX idx_customers_loyalty ON customers(restaurant_id, loyalty_tier);
CREATE INDEX idx_customers_khata ON customers(restaurant_id) WHERE khata_balance > 0;
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Add FK from orders and khata to customers
ALTER TABLE orders ADD CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE khata_entries ADD CONSTRAINT fk_khata_customer FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE bills ADD CONSTRAINT fk_bills_customer FOREIGN KEY (customer_id) REFERENCES customers(id);

-- ============================================================
-- LOYALTY TRANSACTIONS
-- ============================================================
CREATE TABLE loyalty_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  restaurant_id   UUID NOT NULL REFERENCES restaurants(id),
  type            loyalty_txn_type NOT NULL,
  points          INT NOT NULL,                    -- positive=earn, negative=redeem
  balance_after   INT NOT NULL,
  reference_type  TEXT,                            -- 'bill', 'referral', 'birthday', 'manual'
  reference_id    UUID,
  note            TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_loyalty_customer ON loyalty_transactions(customer_id);
CREATE INDEX idx_loyalty_restaurant ON loyalty_transactions(restaurant_id);
```

### 1.9 Staff Tables

```sql
-- ============================================================
-- SHIFTS
-- ============================================================
CREATE TABLE shifts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        shift_status NOT NULL DEFAULT 'scheduled',
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end   TIMESTAMPTZ NOT NULL,
  actual_start    TIMESTAMPTZ,
  actual_end      TIMESTAMPTZ,
  break_minutes   INT NOT NULL DEFAULT 0,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shifts_restaurant ON shifts(restaurant_id);
CREATE INDEX idx_shifts_user ON shifts(user_id);
CREATE INDEX idx_shifts_date ON shifts(restaurant_id, scheduled_start);

-- ============================================================
-- ATTENDANCE
-- ============================================================
CREATE TABLE attendance_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date          DATE NOT NULL,
  clock_in      TIMESTAMPTZ,
  clock_out     TIMESTAMPTZ,
  hours_worked  DECIMAL(5,2),
  overtime_hrs  DECIMAL(5,2) DEFAULT 0,
  clock_in_lat  DECIMAL(10,7),
  clock_in_lng  DECIMAL(10,7),
  status        TEXT DEFAULT 'present',            -- present, absent, late, half_day, leave
  UNIQUE(restaurant_id, user_id, date)
);

CREATE INDEX idx_attendance_restaurant ON attendance_records(restaurant_id);
CREATE INDEX idx_attendance_user ON attendance_records(user_id, date);

-- ============================================================
-- SALARY ADVANCES
-- ============================================================
CREATE TABLE salary_advances (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount        DECIMAL(10,2) NOT NULL,
  date          DATE NOT NULL DEFAULT CURRENT_DATE,
  deduct_month  TEXT,                              -- "2026-06" — month to deduct from
  note          TEXT,
  approved_by   UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 1.10 Delivery & Reservation Tables

```sql
-- ============================================================
-- DELIVERY ZONES
-- ============================================================
CREATE TABLE delivery_zones (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  polygon       JSONB NOT NULL,                    -- GeoJSON polygon
  fee           DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_order     DECIMAL(10,2) NOT NULL DEFAULT 0,
  est_time_min  INT NOT NULL DEFAULT 30,
  is_active     BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_delivery_zones_restaurant ON delivery_zones(restaurant_id);

-- ============================================================
-- RIDERS
-- ============================================================
CREATE TABLE riders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  vehicle_type  TEXT DEFAULT 'bike',               -- bike, scooter, bicycle, car
  is_active     BOOLEAN NOT NULL DEFAULT true,
  is_available  BOOLEAN NOT NULL DEFAULT true,
  current_lat   DECIMAL(10,7),
  current_lng   DECIMAL(10,7),
  total_deliveries INT NOT NULL DEFAULT 0,
  cash_collected DECIMAL(10,2) NOT NULL DEFAULT 0  -- undeposited COD cash
);

CREATE INDEX idx_riders_restaurant ON riders(restaurant_id);

-- ============================================================
-- DELIVERY ORDERS
-- ============================================================
CREATE TABLE delivery_orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  rider_id      UUID REFERENCES riders(id),
  zone_id       UUID REFERENCES delivery_zones(id),
  address       TEXT NOT NULL,
  lat           DECIMAL(10,7),
  lng           DECIMAL(10,7),
  phone         TEXT,
  status        delivery_status NOT NULL DEFAULT 'pending',
  delivery_fee  DECIMAL(10,2) NOT NULL DEFAULT 0,
  cod_amount    DECIMAL(10,2) DEFAULT 0,
  est_time_min  INT,
  actual_time_min INT,
  picked_up_at  TIMESTAMPTZ,
  delivered_at  TIMESTAMPTZ,
  proof_photo   TEXT,
  delivery_otp  TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_delivery_orders_restaurant ON delivery_orders(restaurant_id);
CREATE INDEX idx_delivery_orders_rider ON delivery_orders(rider_id);
CREATE INDEX idx_delivery_orders_status ON delivery_orders(restaurant_id, status);
CREATE TRIGGER trg_delivery_updated BEFORE UPDATE ON delivery_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RESERVATIONS
-- ============================================================
CREATE TABLE reservations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  customer_id   UUID REFERENCES customers(id),
  table_id      UUID REFERENCES tables(id),
  date          DATE NOT NULL,
  time          TIME NOT NULL,
  party_size    INT NOT NULL,
  status        reservation_status NOT NULL DEFAULT 'pending',
  notes         TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  pre_order_id  UUID REFERENCES orders(id),
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reservations_restaurant ON reservations(restaurant_id);
CREATE INDEX idx_reservations_date ON reservations(restaurant_id, date);
CREATE INDEX idx_reservations_status ON reservations(restaurant_id, status);
CREATE TRIGGER trg_reservations_updated BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 1.11 Settings & System Tables

```sql
-- ============================================================
-- TAX CONFIGS
-- ============================================================
CREATE TABLE tax_configs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  country       TEXT NOT NULL,
  tax_name      TEXT NOT NULL,                     -- "VAT", "GST", "Service Tax"
  tax_rate      DECIMAL(5,2) NOT NULL,            -- 13.00 for 13%
  is_inclusive   BOOLEAN NOT NULL DEFAULT false,
  applies_to    TEXT NOT NULL DEFAULT 'all',       -- all, food, beverage, service
  is_active     BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX idx_tax_configs_restaurant ON tax_configs(restaurant_id);

-- ============================================================
-- PRINTER CONFIGS
-- ============================================================
CREATE TABLE printer_configs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,                     -- "Main Printer", "Bar Printer"
  type          TEXT NOT NULL DEFAULT 'bluetooth', -- bluetooth, usb, network, none
  connection    TEXT,                              -- MAC address or IP
  paper_width   INT NOT NULL DEFAULT 80,          -- 58mm or 80mm
  station       TEXT DEFAULT 'main',              -- main, bar, kitchen
  is_active     BOOLEAN NOT NULL DEFAULT true
);

-- ============================================================
-- NOTIFICATION TEMPLATES
-- ============================================================
CREATE TABLE notification_templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  type          TEXT NOT NULL,                     -- order_ready, delivery_update, khata_reminder, birthday, win_back, marketing
  channel       notification_channel NOT NULL,
  language      TEXT NOT NULL DEFAULT 'en',
  subject       TEXT,
  body          TEXT NOT NULL,                     -- with {{placeholders}}
  is_active     BOOLEAN NOT NULL DEFAULT true
);

-- ============================================================
-- AUDIT LOG (Immutable)
-- ============================================================
CREATE TABLE audit_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL,
  user_id       UUID,
  device_id     TEXT,
  action        TEXT NOT NULL,                     -- create_order, void_item, apply_discount, etc
  entity_type   TEXT NOT NULL,                     -- orders, bills, payments, etc
  entity_id     UUID,
  old_data      JSONB,
  new_data      JSONB,
  ip_address    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_restaurant ON audit_log(restaurant_id);
CREATE INDEX idx_audit_created ON audit_log(restaurant_id, created_at DESC);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
-- NO UPDATE/DELETE trigger — this table is append-only

-- ============================================================
-- SYNC LOG (Track device sync state)
-- ============================================================
CREATE TABLE sync_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  device_id     TEXT NOT NULL,
  last_sync_at  TIMESTAMPTZ NOT NULL,
  changes_pushed INT NOT NULL DEFAULT 0,
  changes_pulled INT NOT NULL DEFAULT 0,
  sync_duration_ms INT,
  status        TEXT NOT NULL DEFAULT 'success',   -- success, partial, failed
  error_detail  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_restaurant ON sync_log(restaurant_id);
CREATE INDEX idx_sync_device ON sync_log(restaurant_id, device_id);
```

### 1.12 Row-Level Security

```sql
-- Enable RLS on all tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE khata_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Policy template (apply to each table above):
-- The API sets: SET app.restaurant_id = 'uuid' on each connection

CREATE POLICY tenant_isolation_users ON users
  USING (restaurant_id = current_setting('app.restaurant_id')::uuid);

CREATE POLICY tenant_isolation_orders ON orders
  USING (restaurant_id = current_setting('app.restaurant_id')::uuid);

CREATE POLICY tenant_isolation_bills ON bills
  USING (restaurant_id = current_setting('app.restaurant_id')::uuid);

CREATE POLICY tenant_isolation_menu_items ON menu_items
  USING (restaurant_id = current_setting('app.restaurant_id')::uuid);

CREATE POLICY tenant_isolation_inventory ON inventory_items
  USING (restaurant_id = current_setting('app.restaurant_id')::uuid);

CREATE POLICY tenant_isolation_customers ON customers
  USING (restaurant_id = current_setting('app.restaurant_id')::uuid);

CREATE POLICY tenant_isolation_kitchen ON kitchen_tickets
  USING (restaurant_id = current_setting('app.restaurant_id')::uuid);

-- Superadmin bypass (for support team)
CREATE POLICY superadmin_bypass ON orders
  USING (current_setting('app.is_superadmin', true)::boolean = true);
-- Repeat for all tables...
```

---

## PART 2: API DESIGN

### 2.1 Standards

```
Base URL:       https://api.restroverse.com/v1
Auth:           Authorization: Bearer <jwt_token>
Content-Type:   application/json
Rate Limit:     1000 req/min per restaurant

Pagination:     ?page=1&limit=20
                Response: { data: [], meta: { total, page, limit, hasMore } }

Errors:         { error: { code: "VALIDATION_ERROR", message: "...", details: [...] } }
                HTTP codes: 400 (bad req), 401 (unauth), 403 (forbidden), 404 (not found), 429 (rate limit), 500 (server)

Sorting:        ?sort=created_at&order=desc
Filtering:      ?status=active&type=dine_in&from=2026-01-01&to=2026-01-31
```

### 2.2 Auth Endpoints

```
POST   /auth/send-otp
       Body:    { phone: "+9779802853939", country: "NP" }
       Resp:    { success: true, expiresIn: 300 }

POST   /auth/verify-otp
       Body:    { phone: "+9779802853939", otp: "4523" }
       Resp:    { token: "jwt...", refreshToken: "rt...", user: {...}, restaurant: {...} }

POST   /auth/refresh
       Body:    { refreshToken: "rt..." }
       Resp:    { token: "jwt...", refreshToken: "new_rt..." }

GET    /auth/me
       Resp:    { user: {...}, restaurant: {...}, permissions: [...] }

POST   /auth/staff-pin
       Body:    { pin: "1234", restaurantId: "uuid" }
       Resp:    { token: "jwt...", user: {...} }
       Note:    Used on shared POS tablet to switch active staff

POST   /auth/logout
       Body:    { refreshToken: "rt..." }
       Resp:    { success: true }
```

### 2.3 Restaurant Endpoints

```
POST   /restaurants
       Body:    { name, type, country, phone, address, city }
       Resp:    { restaurant: {...} }

GET    /restaurants/:id
       Resp:    { restaurant: {...} }

PUT    /restaurants/:id
       Body:    { name?, address?, settings?, tax_config? }
       Resp:    { restaurant: {...} }

PUT    /restaurants/:id/settings
       Body:    { service_charge_rate, round_off, receipt_footer, ... }
       Resp:    { settings: {...} }
```

### 2.4 Menu Endpoints

```
-- Categories
GET    /menu/categories                          → { data: [categories] }
POST   /menu/categories                          Body: { name, icon, sort_order }
PUT    /menu/categories/:id                      Body: { name?, icon?, sort_order?, is_active? }
DELETE /menu/categories/:id

-- Items
GET    /menu/items?category_id=&search=           → { data: [items with variants & modifiers] }
POST   /menu/items                                Body: { name, category_id, base_price, ... }
PUT    /menu/items/:id                            Body: { name?, base_price?, is_available?, ... }
DELETE /menu/items/:id
POST   /menu/items/:id/toggle-availability        → { is_available: false }  (86'd toggle)
POST   /menu/items/:id/photo                      Body: multipart/form-data (image)

-- Variants
POST   /menu/items/:id/variants                   Body: { name, price_adjustment }
PUT    /menu/variants/:id                         Body: { name?, price_adjustment? }
DELETE /menu/variants/:id

-- Modifiers
GET    /menu/modifiers                            → { data: [modifiers] }
POST   /menu/modifiers                            Body: { name, options, is_required, max_selections }
PUT    /menu/modifiers/:id
DELETE /menu/modifiers/:id
POST   /menu/items/:id/modifiers                  Body: { modifier_ids: [] }

-- Combos
GET    /menu/combos                               → { data: [combos] }
POST   /menu/combos                               Body: { name, price, items: [{menu_item_id, qty}] }
PUT    /menu/combos/:id
DELETE /menu/combos/:id

-- AI/Bulk
POST   /menu/import/photo                         Body: multipart (photo of menu) → AI extracts items
POST   /menu/import/voice                         Body: { audioUrl } → AI creates menu items
GET    /menu/performance                          → { data: [{item, sales, profit, score, category}] }

-- Public (no auth)
GET    /menu/public/:restaurantSlug               → full menu for QR/online ordering
```

### 2.5 Table Endpoints

```
GET    /tables?space_id=                          → { data: [tables with status] }
POST   /tables                                    Body: { name, space_id, capacity, x_pos, y_pos }
PUT    /tables/:id                                Body: { name?, capacity?, x_pos?, y_pos? }
DELETE /tables/:id
PUT    /tables/:id/status                         Body: { status: "occupied"|"cleaning"|"available" }
POST   /tables/merge                              Body: { table_ids: ["id1","id2"], primary_id: "id1" }
POST   /tables/split                              Body: { table_id: "merged_id" }
POST   /tables/:id/transfer                       Body: { to_table_id: "id2" }

GET    /spaces                                    → { data: [spaces] }
POST   /spaces                                    Body: { name }
PUT    /spaces/:id
DELETE /spaces/:id
```

### 2.6 Order Endpoints

```
POST   /orders
       Body:    { type, table_id?, customer_id?, channel?, guest_count?, notes?,
                  items: [{ menu_item_id, variant_id?, quantity, modifiers?, notes? }] }
       Resp:    { order: {..., items: [...]} }

GET    /orders?status=&type=&from=&to=&page=&limit=
       Resp:    { data: [orders], meta: {...} }

GET    /orders/:id
       Resp:    { order: {..., items: [...], bill: {...}} }

GET    /orders/running
       Resp:    { data: [active orders across all tables] }

POST   /orders/:id/items
       Body:    { items: [{ menu_item_id, variant_id?, quantity, modifiers?, notes? }] }
       Resp:    { order: {...} }

PUT    /orders/:id/items/:itemId
       Body:    { quantity?, modifiers?, notes? }

DELETE /orders/:id/items/:itemId
       Body:    { void_reason? }

POST   /orders/:id/send-to-kitchen
       Body:    { station?: "main" }
       Resp:    { kitchen_ticket: {...} }
       Note:    Creates KOT, sends to KDS, optionally prints

PUT    /orders/:id/status
       Body:    { status: "completed"|"cancelled", reason? }

POST   /orders/:id/transfer-table
       Body:    { to_table_id: "uuid" }

POST   /orders/voice
       Body:    { audioUrl: "...", table_id?: "uuid" }
       Resp:    { parsed_items: [...], confidence: 0.92 }
       Note:    AI voice-to-order
```

### 2.7 Kitchen Endpoints

```
GET    /kitchen/tickets?station=&status=          → { data: [tickets] }
PUT    /kitchen/tickets/:id/status
       Body:    { status: "cooking"|"ready"|"served" }

PUT    /kitchen/tickets/:id/bump                  → advance to next status
GET    /kitchen/stats                             → { avg_prep_time, on_time_pct, active_orders, by_station }
```

### 2.8 Billing Endpoints

```
POST   /bills
       Body:    { order_id, discount_type?, discount_amount?, customer_id?, tip? }
       Resp:    { bill: {...} }
       Note:    Auto-calculates tax, service charge, total

GET    /bills?from=&to=&status=&page=&limit=      → { data: [bills], meta: {} }
GET    /bills/:id                                  → { bill: {..., payments: [...]} }

POST   /bills/:id/payments
       Body:    { method: "cash", amount: 1000, reference_number? }
       Resp:    { payment: {...}, bill: {updated status} }
       Note:    Supports multiple payments per bill (split pay)

POST   /bills/:id/split
       Body:    { splits: [{ items: [item_ids], customer_id? }, ...] }
       Resp:    { bills: [new_bill_1, new_bill_2] }

POST   /bills/:id/void
       Body:    { reason: "customer complaint", manager_pin: "1234" }
       Resp:    { bill: {status: "void"} }

POST   /bills/:id/receipt
       Body:    { channel: "whatsapp"|"sms"|"email", to: "+977..." }
       Resp:    { sent: true }

POST   /bills/:id/discount
       Body:    { type: "percentage", value: 10, reason?: "happy hour" }

GET    /bills/daily-settlement
       Body:    { date?: "2026-05-27" }
       Resp:    { cash_total, digital_total, by_method: {...}, expected_cash, actual_cash?, difference? }
```

### 2.9 Inventory Endpoints

```
GET    /inventory?category=&search=&low_stock=true  → { data: [items] }
POST   /inventory                                    Body: { name, unit, min_stock, cost_per_unit, ... }
PUT    /inventory/:id                                Body: { name?, min_stock?, cost_per_unit?, ... }
DELETE /inventory/:id

POST   /inventory/stock-movement
       Body:    { inventory_item_id, type, quantity, cost_per_unit?, note? }
       Resp:    { movement: {...}, updated_stock: 12.5 }

POST   /inventory/scan-invoice
       Body:    multipart (photo of supplier invoice)
       Resp:    { supplier?, date?, items: [{name, qty, unit_cost, confidence}], total? }
       Note:    AI OCR pipeline

GET    /inventory/suggestions
       Resp:    { suggestions: [{item, current_stock, predicted_demand, suggested_qty, supplier, est_cost}] }
       Note:    AI demand forecast

GET    /inventory/food-cost?from=&to=
       Resp:    { overall_pct: 31.2, by_item: [{item, revenue, cost, pct}] }

-- Recipes
POST   /inventory/recipes
       Body:    { menu_item_id, ingredients: [{inventory_item_id, quantity, unit}] }
GET    /inventory/recipes/:menuItemId
PUT    /inventory/recipes/:id

-- Purchase Orders
GET    /purchase-orders                             → { data: [pos] }
POST   /purchase-orders                             Body: { supplier_id, items: [{inventory_item_id, qty, unit_cost}] }
PUT    /purchase-orders/:id/receive                 Body: { items: [{id, received_qty}] }

-- Suppliers
GET    /suppliers                                   → { data: [suppliers] }
POST   /suppliers                                   Body: { name, phone, address }
PUT    /suppliers/:id
DELETE /suppliers/:id
```

### 2.10 Customer & Loyalty Endpoints

```
GET    /customers?search=&tier=&tag=&page=         → { data: [customers] }
POST   /customers                                   Body: { name, phone, birthday?, tags? }
PUT    /customers/:id                               Body: { name?, preferences?, tags?, notes? }
GET    /customers/:id                               → { customer, recent_orders, loyalty_history }
GET    /customers/:id/history                       → { orders: [...], total_spent, visit_count }

POST   /loyalty/earn
       Body:    { customer_id, bill_id, amount_spent }
       Resp:    { points_earned, new_balance, new_tier? }

POST   /loyalty/redeem
       Body:    { customer_id, points, bill_id }
       Resp:    { discount_amount, remaining_points }

GET    /loyalty/tiers
       Resp:    { tiers: [{name, min_points, benefits}] }

POST   /customers/:id/send-offer
       Body:    { channel: "whatsapp", template: "birthday", params: {} }
```

### 2.11 Khata Endpoints

```
GET    /khata?overdue=true&sort=balance             → { data: [customers with balances], totals: {} }
GET    /khata/:customerId                           → { entries: [...], balance, limit }

POST   /khata/entries
       Body:    { customer_id, bill_id?, type: "credit", amount, note?, due_date? }
       Resp:    { entry: {...}, new_balance }

POST   /khata/record-payment
       Body:    { customer_id, amount, method: "cash"|"esewa", note? }
       Resp:    { entry: {...}, new_balance }

POST   /khata/send-reminder
       Body:    { customer_id, channel: "whatsapp" }
       Resp:    { sent: true }

POST   /khata/bulk-reminder
       Body:    { filter: "overdue_30_days" }
       Resp:    { sent_count: 5 }

GET    /khata/report?from=&to=
       Resp:    { total_outstanding, total_collected, overdue_count, by_customer: [...] }
```

### 2.12 Staff Endpoints

```
GET    /staff                                       → { data: [users with attendance stats] }
POST   /staff                                       Body: { name, phone, role, pin?, language? }
PUT    /staff/:id                                   Body: { name?, role?, permissions?, is_active? }
POST   /staff/invite                                Body: { phone, role, name } → sends SMS link

POST   /staff/:id/clock-in                          Body: { lat?, lng? }
POST   /staff/:id/clock-out

GET    /staff/shifts?week=                          → { data: [shifts by user by day] }
POST   /staff/shifts                                Body: { user_id, scheduled_start, scheduled_end }
PUT    /staff/shifts/:id
DELETE /staff/shifts/:id

GET    /staff/attendance?from=&to=                  → { data: [attendance records] }
GET    /staff/:id/performance?period=month          → { orders, avg_bill, upsell_rate, speed, rating }

POST   /staff/:id/advance                          Body: { amount, deduct_month?, note? }
GET    /staff/:id/payroll?month=2026-05             → { hours, overtime, base_pay, tips, advances, net }
```

### 2.13 Analytics Endpoints

```
GET    /analytics/dashboard
       Resp:    { today: {revenue, orders, avg_order, food_cost_pct, guests},
                  trends: {revenue_7d: [...], orders_7d: [...]},
                  alerts: [...], ai_insights: [...] }

GET    /analytics/sales?from=&to=&granularity=day
       Resp:    { data: [{date, revenue, orders, avg_order}], totals: {} }

GET    /analytics/items?from=&to=&sort=revenue
       Resp:    { data: [{item, qty_sold, revenue, cost, profit, profit_pct}] }

GET    /analytics/staff?from=&to=
       Resp:    { data: [{user, orders, revenue, avg_bill, upsell_rate}] }

GET    /analytics/peak-hours?from=&to=
       Resp:    { data: [{hour, orders, revenue}] }

GET    /analytics/food-cost?from=&to=
       Resp:    { overall_pct, target_pct, by_category: [...], by_item: [...] }

GET    /analytics/benchmarks
       Resp:    { your: {...}, area_avg: {...}, percentile: 85 }

POST   /analytics/ask
       Body:    { question: "How much did I earn during Dashain?" }
       Resp:    { answer: "Rs 3,45,000...", chart_data?: {...}, sql?: "..." }
       Note:    AI natural language → SQL → formatted answer
```

### 2.14 Delivery Endpoints

```
GET    /delivery/active                             → { data: [active deliveries with rider location] }
PUT    /delivery/:id/assign                         Body: { rider_id }
PUT    /delivery/:id/status                         Body: { status, proof_photo?, delivery_otp? }
GET    /delivery/:id/track                          → { status, rider_location, eta }

GET    /delivery/zones                              → { data: [zones] }
POST   /delivery/zones                              Body: { name, polygon, fee, min_order, est_time }

GET    /delivery/riders                             → { data: [riders with stats] }
POST   /delivery/riders                             Body: { name, phone, vehicle_type }
```

### 2.15 Reservation Endpoints

```
GET    /reservations?date=&status=                  → { data: [reservations] }
POST   /reservations                                Body: { date, time, party_size, customer_phone, notes? }
PUT    /reservations/:id                            Body: { status?, table_id?, notes? }
POST   /reservations/:id/seat                       Body: { table_id }  → marks seated, creates order
GET    /reservations/calendar?month=2026-06         → { data: [by_date: {date, count, slots}] }
DELETE /reservations/:id                            → cancels
```

### 2.16 Online Ordering Endpoints (Public)

```
GET    /online/:slug/menu                           → full menu with photos (no auth)
GET    /online/:slug/info                           → restaurant name, hours, delivery zones
POST   /online/:slug/orders                         Body: { items, type, address?, phone, payment_method }
GET    /online/:slug/track/:orderId                 → order status, rider location
POST   /online/whatsapp-webhook                     → handles incoming WhatsApp messages
```

### 2.17 WebSocket Events

```
Connection: wss://api.restroverse.com/ws?token=<jwt>

-- Server → Client events:
{ event: "order:created",       data: { order } }
{ event: "order:updated",       data: { order_id, changes } }
{ event: "order:item_added",    data: { order_id, item } }
{ event: "kitchen:new_ticket",  data: { ticket } }
{ event: "kitchen:status",      data: { ticket_id, status, prep_time? } }
{ event: "table:status",        data: { table_id, status, order_id? } }
{ event: "bill:created",        data: { bill } }
{ event: "bill:paid",           data: { bill_id, payment } }
{ event: "inventory:low_stock", data: { item_id, item_name, current, min } }
{ event: "notification",        data: { type, title, body, action_url? } }
{ event: "sync:available",      data: { tables: ["orders","menu"], since: "timestamp" } }

-- Client → Server events:
{ event: "ping" }                                  → keepalive
{ event: "subscribe",  data: { channels: ["kitchen","tables"] } }
```

---

## PART 3: OFFLINE SYNC PROTOCOL

### 3.1 What Syncs

| Data | Direction | Strategy | Priority |
|---|---|---|---|
| Menu (categories, items, variants, modifiers) | Cloud → Device | Full replace on change | High |
| Orders | Bidirectional | CRDT (add-only set for items, LWW for status) | Critical |
| Order Items | Bidirectional | CRDT (add-only, void flag for removal) | Critical |
| Bills | Bidirectional | CRDT (LWW for status) | Critical |
| Payments | Device → Cloud | Append-only queue | Critical |
| Kitchen Tickets | Bidirectional | LWW for status | High |
| Table Status | Bidirectional | LWW with vector clock | High |
| Customers | Bidirectional | LWW (merge by phone) | Medium |
| Inventory Stock | Bidirectional | CRDT counter (delta ops, not absolute) | Medium |
| Settings | Cloud → Device | Full replace | Low |

### 3.2 Sync Message Format

```json
{
  "syncId": "uuid-v4",
  "deviceId": "device-uuid",
  "restaurantId": "restaurant-uuid",
  "timestamp": "2026-05-27T18:30:00Z",
  "sequenceNumber": 1547,
  "changes": [
    {
      "table": "orders",
      "op": "INSERT",
      "id": "order-uuid",
      "data": { "type": "dine_in", "table_id": "..." },
      "vectorClock": { "device-A": 15, "device-B": 12 },
      "clientTimestamp": "2026-05-27T18:29:58Z"
    }
  ]
}
```

### 3.3 Conflict Resolution Rules

```
1. ORDERS:
   - New items: union of all devices (add-only set)
   - Status changes: highest status wins (draft < confirmed < preparing < ready < served < completed)
   - Cancellation: always wins if any device cancels

2. STOCK LEVELS:
   - Never sync absolute values
   - Sync delta operations: { op: "decrement", qty: 2, reason: "sale" }
   - Server applies all deltas to get final value
   - Prevents: Device A says 10kg, Device B says 8kg — which is right?
   - Instead: Device A says -2kg (sold), Device B says -4kg (sold) → server applies both

3. TABLE STATUS:
   - Last-Writer-Wins with vector clock
   - If conflict: "occupied" beats "available" (safety: don't seat someone at an occupied table)

4. BILLS/PAYMENTS:
   - Bills: LWW for status, append-only for payments
   - Never modify a finalized bill — only void and recreate

5. MENU:
   - Cloud is authoritative source
   - Device never modifies menu
   - On sync: full replacement of local menu cache
```

### 3.4 Local WiFi Mesh Protocol

```
DISCOVERY:
  - Each device broadcasts mDNS: _restroverse._tcp.local
  - Service record includes: deviceId, restaurantId, lastCloudSync timestamp
  - Devices on same restaurantId auto-connect

LEADER ELECTION:
  - Device with most recent lastCloudSync becomes leader
  - Leader serves as local "mini-cloud" for other devices
  - If leader goes offline, next most-recent becomes leader

SYNC FLOW (Local):
  1. Device creates order → writes to local SQLite
  2. Broadcasts change to all peers via WebSocket on LAN
  3. Peers receive, apply CRDT merge to their local DB
  4. When any device gets internet → pushes all changes to cloud
  5. Cloud processes, responds with any changes from other online devices
  6. Device broadcasts cloud changes to LAN peers

PORTS:
  - mDNS: UDP 5353
  - Peer WebSocket: TCP 8765 (configurable)
  - HTTP API (leader): TCP 8766

RESULT: All devices stay in sync WITHOUT internet.
         Kitchen sees orders instantly even if internet is down.
         Owner's phone sees data even offline.
```

### 3.5 Local Database (WatermelonDB/SQLite)

```
Tables mirrored locally (subset of cloud schema):
- restaurants (1 row: current restaurant)
- menu_categories, menu_items, menu_variants, menu_modifiers
- tables, spaces
- orders, order_items
- kitchen_tickets
- bills, payments
- customers (recently active)
- inventory_items (stock levels only)

Additional local-only tables:
- sync_queue (pending changes to push)
- sync_state (last sync timestamp per table)
- offline_payments (queued payment verifications)

Storage budget: <200MB per device
Cleanup: orders older than 30 days archived to cloud-only
```

---

*End of Database & API Design*
*Total: ~50 tables, ~150 API endpoints, complete sync protocol*
