-- ============================================================================
-- RestroVerse - Complete PostgreSQL Schema
-- Restaurant POS System
-- ============================================================================

-- ============================================================================
-- SECTION 1: ENUM TYPES
-- ============================================================================

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

-- ============================================================================
-- SECTION 2: TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 3: TABLES (in FK dependency order)
-- ============================================================================

-- --------------------------------------------------------------------------
-- restaurants
-- --------------------------------------------------------------------------
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'restaurant',
    country TEXT NOT NULL DEFAULT 'NP',
    currency TEXT NOT NULL DEFAULT 'NPR',
    timezone TEXT NOT NULL DEFAULT 'Asia/Kathmandu',
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    lat DECIMAL(10,7),
    lng DECIMAL(10,7),
    logo_url TEXT,
    cover_url TEXT,
    tax_config JSONB NOT NULL DEFAULT '[]',
    settings JSONB NOT NULL DEFAULT '{}',
    subscription_tier subscription_tier NOT NULL DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- users
-- --------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    phone TEXT NOT NULL,
    email TEXT,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'waiter',
    pin TEXT,
    avatar_url TEXT,
    language TEXT NOT NULL DEFAULT 'en',
    permissions JSONB NOT NULL DEFAULT '[]',
    hourly_rate DECIMAL(10,2),
    monthly_salary DECIMAL(10,2),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(restaurant_id, phone)
);

-- --------------------------------------------------------------------------
-- devices
-- --------------------------------------------------------------------------
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    device_type device_type NOT NULL,
    device_name TEXT,
    device_id TEXT NOT NULL,
    last_sync_at TIMESTAMPTZ,
    last_user_id UUID REFERENCES users(id),
    is_trusted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- menu_categories
-- --------------------------------------------------------------------------
CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_local TEXT,
    icon TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    schedule JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- menu_items
-- --------------------------------------------------------------------------
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_local TEXT,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    photo_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    dietary_tags TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}',
    prep_time_min INT,
    calories INT,
    sort_order INT NOT NULL DEFAULT 0,
    sales_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- menu_variants
-- --------------------------------------------------------------------------
CREATE TABLE menu_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_adjustment DECIMAL(10,2) NOT NULL DEFAULT 0,
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_available BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0
);

-- --------------------------------------------------------------------------
-- menu_modifiers
-- --------------------------------------------------------------------------
CREATE TABLE menu_modifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]',
    is_required BOOLEAN NOT NULL DEFAULT false,
    min_selections INT NOT NULL DEFAULT 0,
    max_selections INT NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0
);

-- --------------------------------------------------------------------------
-- menu_item_modifiers (junction table)
-- --------------------------------------------------------------------------
CREATE TABLE menu_item_modifiers (
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    modifier_id UUID NOT NULL REFERENCES menu_modifiers(id) ON DELETE CASCADE,
    PRIMARY KEY(menu_item_id, modifier_id)
);

-- --------------------------------------------------------------------------
-- combos
-- --------------------------------------------------------------------------
CREATE TABLE combos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    photo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- combo_items
-- --------------------------------------------------------------------------
CREATE TABLE combo_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    combo_id UUID NOT NULL REFERENCES combos(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    variant_id UUID REFERENCES menu_variants(id)
);

-- --------------------------------------------------------------------------
-- spaces
-- --------------------------------------------------------------------------
CREATE TABLE spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- --------------------------------------------------------------------------
-- tables
-- --------------------------------------------------------------------------
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 4,
    shape TEXT NOT NULL DEFAULT 'square',
    x_pos INT NOT NULL DEFAULT 0,
    y_pos INT NOT NULL DEFAULT 0,
    width INT NOT NULL DEFAULT 1,
    height INT NOT NULL DEFAULT 1,
    status table_status NOT NULL DEFAULT 'available',
    current_order_id UUID,
    occupied_at TIMESTAMPTZ,
    server_id UUID REFERENCES users(id),
    qr_code TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- customers
-- --------------------------------------------------------------------------
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    phone TEXT NOT NULL,
    name TEXT,
    email TEXT,
    notes TEXT,
    dietary_preferences TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    total_visits INT NOT NULL DEFAULT 0,
    total_spent DECIMAL(10,2) NOT NULL DEFAULT 0,
    avg_order_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    loyalty_points INT NOT NULL DEFAULT 0,
    loyalty_tier TEXT NOT NULL DEFAULT 'bronze',
    credit_limit DECIMAL(10,2) NOT NULL DEFAULT 0,
    credit_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
    last_visit_at TIMESTAMPTZ,
    birthday DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    do_not_disturb BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(restaurant_id, phone)
);

-- --------------------------------------------------------------------------
-- orders
-- --------------------------------------------------------------------------
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    order_number SERIAL,
    table_id UUID REFERENCES tables(id),
    customer_id UUID REFERENCES customers(id),
    type order_type NOT NULL DEFAULT 'dine_in',
    status order_status NOT NULL DEFAULT 'draft',
    channel TEXT NOT NULL DEFAULT 'pos',
    aggregator TEXT,
    guest_count INT,
    notes TEXT,
    priority TEXT DEFAULT 'normal',
    created_by UUID REFERENCES users(id),
    cancelled_reason TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sync_id UUID,
    device_id TEXT,
    vector_clock JSONB DEFAULT '{}'
);

-- --------------------------------------------------------------------------
-- order_items
-- --------------------------------------------------------------------------
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    variant_id UUID REFERENCES menu_variants(id),
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    modifiers JSONB DEFAULT '[]',
    notes TEXT,
    status kot_status NOT NULL DEFAULT 'pending',
    sent_to_kitchen_at TIMESTAMPTZ,
    prepared_at TIMESTAMPTZ,
    is_void BOOLEAN NOT NULL DEFAULT false,
    void_reason TEXT,
    void_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- kitchen_tickets
-- --------------------------------------------------------------------------
CREATE TABLE kitchen_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    ticket_number SERIAL,
    station TEXT NOT NULL DEFAULT 'main',
    items JSONB NOT NULL,
    status kot_status NOT NULL DEFAULT 'pending',
    priority TEXT DEFAULT 'normal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    prep_time_secs INT,
    created_by UUID REFERENCES users(id),
    completed_by UUID REFERENCES users(id)
);

-- --------------------------------------------------------------------------
-- bills
-- --------------------------------------------------------------------------
CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id),
    customer_id UUID REFERENCES customers(id),
    invoice_number TEXT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_type discount_type,
    discount_detail TEXT,
    service_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_breakdown JSONB DEFAULT '[]',
    tip_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    round_off DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status bill_status NOT NULL DEFAULT 'draft',
    notes TEXT,
    created_by UUID REFERENCES users(id),
    voided_by UUID REFERENCES users(id),
    void_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- payments
-- --------------------------------------------------------------------------
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    method payment_method_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    reference_number TEXT,
    status payment_status NOT NULL DEFAULT 'pending',
    gateway_response JSONB,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- khata_entries
-- --------------------------------------------------------------------------
CREATE TABLE khata_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    bill_id UUID REFERENCES bills(id),
    type khata_entry_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    balance_after DECIMAL(10,2) NOT NULL,
    note TEXT,
    due_date DATE,
    payment_method payment_method_type,
    reminder_sent BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- suppliers
-- --------------------------------------------------------------------------
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- inventory_items
-- --------------------------------------------------------------------------
CREATE TABLE inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    unit TEXT NOT NULL DEFAULT 'kg',
    current_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
    min_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
    cost_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0,
    supplier_id UUID REFERENCES suppliers(id),
    expiry_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- stock_movements
-- --------------------------------------------------------------------------
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id),
    type stock_movement_type NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit_cost DECIMAL(10,2),
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- recipes
-- --------------------------------------------------------------------------
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    yield_qty INT NOT NULL DEFAULT 1,
    instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- recipe_ingredients
-- --------------------------------------------------------------------------
CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id),
    quantity DECIMAL(10,3) NOT NULL,
    unit TEXT NOT NULL DEFAULT 'g'
);

-- --------------------------------------------------------------------------
-- purchase_orders
-- --------------------------------------------------------------------------
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    po_number TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes TEXT,
    ordered_at TIMESTAMPTZ,
    received_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- purchase_order_items
-- --------------------------------------------------------------------------
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id),
    quantity DECIMAL(10,3) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    received_qty DECIMAL(10,3) DEFAULT 0
);

-- --------------------------------------------------------------------------
-- loyalty_transactions
-- --------------------------------------------------------------------------
CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id),
    order_id UUID REFERENCES orders(id),
    type loyalty_txn_type NOT NULL,
    points INT NOT NULL,
    balance_after INT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- shifts
-- --------------------------------------------------------------------------
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    status shift_status NOT NULL DEFAULT 'scheduled',
    notes TEXT
);

-- --------------------------------------------------------------------------
-- attendance_records
-- --------------------------------------------------------------------------
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    clock_in TIMESTAMPTZ NOT NULL,
    clock_out TIMESTAMPTZ,
    hours_worked DECIMAL(5,2),
    is_late BOOLEAN NOT NULL DEFAULT false,
    notes TEXT
);

-- --------------------------------------------------------------------------
-- salary_advances
-- --------------------------------------------------------------------------
CREATE TABLE salary_advances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    note TEXT,
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- delivery_zones
-- --------------------------------------------------------------------------
CREATE TABLE delivery_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    polygon JSONB,
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    min_order DECIMAL(10,2) NOT NULL DEFAULT 0,
    estimated_time_min INT,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- --------------------------------------------------------------------------
-- riders
-- --------------------------------------------------------------------------
CREATE TABLE riders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    vehicle_type TEXT,
    license_plate TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    current_location JSONB
);

-- --------------------------------------------------------------------------
-- delivery_orders
-- --------------------------------------------------------------------------
CREATE TABLE delivery_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    rider_id UUID REFERENCES riders(id),
    zone_id UUID REFERENCES delivery_zones(id),
    customer_address TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_lat DECIMAL(10,7),
    customer_lng DECIMAL(10,7),
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    status delivery_status NOT NULL DEFAULT 'pending',
    assigned_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    proof_photo_url TEXT,
    proof_otp TEXT,
    notes TEXT
);

-- --------------------------------------------------------------------------
-- reservations
-- --------------------------------------------------------------------------
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    table_id UUID REFERENCES tables(id),
    date DATE NOT NULL,
    time TIME NOT NULL,
    party_size INT NOT NULL DEFAULT 2,
    status reservation_status NOT NULL DEFAULT 'pending',
    deposit_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    deposit_paid BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- tax_configs
-- --------------------------------------------------------------------------
CREATE TABLE tax_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    rate DECIMAL(5,2) NOT NULL,
    is_inclusive BOOLEAN NOT NULL DEFAULT false,
    applies_to TEXT NOT NULL DEFAULT 'all',
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- --------------------------------------------------------------------------
-- printer_configs
-- --------------------------------------------------------------------------
CREATE TABLE printer_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    connection_string TEXT,
    paper_width INT NOT NULL DEFAULT 80,
    station TEXT NOT NULL DEFAULT 'main',
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- --------------------------------------------------------------------------
-- notification_templates
-- --------------------------------------------------------------------------
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    channel notification_channel NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    subject TEXT,
    body TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- --------------------------------------------------------------------------
-- audit_log
-- --------------------------------------------------------------------------
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    device_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------------
-- sync_log
-- --------------------------------------------------------------------------
CREATE TABLE sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    sync_type TEXT NOT NULL,
    records_count INT NOT NULL DEFAULT 0,
    bytes_transferred INT NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'success',
    error TEXT
);

-- ============================================================================
-- SECTION 4: INDEXES
-- ============================================================================

-- restaurants
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_country ON restaurants(country);
CREATE INDEX idx_restaurants_active ON restaurants(is_active) WHERE is_active = true;

-- users
CREATE INDEX idx_users_restaurant ON users(restaurant_id);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(restaurant_id, role);

-- devices
CREATE INDEX idx_devices_restaurant ON devices(restaurant_id);
CREATE UNIQUE INDEX idx_devices_unique ON devices(restaurant_id, device_id);

-- menu_categories
CREATE INDEX idx_menu_categories_restaurant ON menu_categories(restaurant_id);
CREATE INDEX idx_menu_categories_sort ON menu_categories(restaurant_id, sort_order);

-- menu_items
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_available ON menu_items(restaurant_id, is_available);
CREATE INDEX idx_menu_items_popular ON menu_items(restaurant_id, is_popular) WHERE is_popular = true;

-- menu_variants
CREATE INDEX idx_menu_variants_item ON menu_variants(menu_item_id);

-- menu_modifiers
CREATE INDEX idx_menu_modifiers_restaurant ON menu_modifiers(restaurant_id);

-- spaces
CREATE INDEX idx_spaces_restaurant ON spaces(restaurant_id);

-- tables
CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);
CREATE INDEX idx_tables_space ON tables(space_id);
CREATE INDEX idx_tables_status ON tables(restaurant_id, status);

-- customers
CREATE INDEX idx_customers_restaurant ON customers(restaurant_id);
CREATE INDEX idx_customers_phone ON customers(restaurant_id, phone);
CREATE INDEX idx_customers_loyalty ON customers(restaurant_id, loyalty_tier);

-- orders
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(restaurant_id, status);
CREATE INDEX idx_orders_table ON orders(table_id) WHERE table_id IS NOT NULL;
CREATE INDEX idx_orders_customer ON orders(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX idx_orders_created ON orders(restaurant_id, created_at DESC);
CREATE INDEX idx_orders_type ON orders(restaurant_id, type);
CREATE INDEX idx_orders_sync ON orders(sync_id) WHERE sync_id IS NOT NULL;

-- order_items
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item ON order_items(menu_item_id);
CREATE INDEX idx_order_items_status ON order_items(status) WHERE status != 'served';

-- kitchen_tickets
CREATE INDEX idx_kitchen_tickets_restaurant ON kitchen_tickets(restaurant_id);
CREATE INDEX idx_kitchen_tickets_status ON kitchen_tickets(restaurant_id, status);
CREATE INDEX idx_kitchen_tickets_order ON kitchen_tickets(order_id);
CREATE INDEX idx_kitchen_tickets_station ON kitchen_tickets(restaurant_id, station, status);

-- bills
CREATE INDEX idx_bills_restaurant ON bills(restaurant_id);
CREATE INDEX idx_bills_order ON bills(order_id);
CREATE INDEX idx_bills_customer ON bills(customer_id) WHERE customer_id IS NOT NULL;
CREATE INDEX idx_bills_created ON bills(restaurant_id, created_at DESC);
CREATE INDEX idx_bills_status ON bills(restaurant_id, status);
CREATE INDEX idx_bills_invoice ON bills(restaurant_id, invoice_number);

-- payments
CREATE INDEX idx_payments_bill ON payments(bill_id);
CREATE INDEX idx_payments_restaurant ON payments(restaurant_id);
CREATE INDEX idx_payments_status ON payments(restaurant_id, status);

-- khata_entries
CREATE INDEX idx_khata_restaurant ON khata_entries(restaurant_id);
CREATE INDEX idx_khata_customer ON khata_entries(customer_id);
CREATE INDEX idx_khata_created ON khata_entries(restaurant_id, created_at DESC);

-- suppliers
CREATE INDEX idx_suppliers_restaurant ON suppliers(restaurant_id);

-- inventory_items
CREATE INDEX idx_inventory_items_restaurant ON inventory_items(restaurant_id);

-- stock_movements
CREATE INDEX idx_stock_movements_restaurant ON stock_movements(restaurant_id);
CREATE INDEX idx_stock_movements_item ON stock_movements(inventory_item_id);

-- audit_log
CREATE INDEX idx_audit_restaurant ON audit_log(restaurant_id);
CREATE INDEX idx_audit_entity ON audit_log(restaurant_id, entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_log(restaurant_id, created_at DESC);

-- sync_log
CREATE INDEX idx_sync_restaurant ON sync_log(restaurant_id);
CREATE INDEX idx_sync_device ON sync_log(restaurant_id, device_id);

-- ============================================================================
-- SECTION 5: TRIGGERS (update_updated_at)
-- ============================================================================

CREATE TRIGGER trg_restaurants_updated_at
    BEFORE UPDATE ON restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_menu_categories_updated_at
    BEFORE UPDATE ON menu_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_tables_updated_at
    BEFORE UPDATE ON tables
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bills_updated_at
    BEFORE UPDATE ON bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_inventory_items_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- SECTION 6: FUNCTIONS
-- ============================================================================

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

-- ============================================================================
-- SECTION 7: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- --------------------------------------------------------------------------
-- restaurants (uses id = instead of restaurant_id =)
-- --------------------------------------------------------------------------
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
CREATE POLICY restaurants_tenant_isolation ON restaurants
    USING (id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY restaurants_tenant_insert ON restaurants
    FOR INSERT WITH CHECK (id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY restaurants_superuser ON restaurants
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- users
-- --------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_tenant_isolation ON users
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY users_tenant_insert ON users
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY users_superuser ON users
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- devices
-- --------------------------------------------------------------------------
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY devices_tenant_isolation ON devices
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY devices_tenant_insert ON devices
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY devices_superuser ON devices
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- menu_categories
-- --------------------------------------------------------------------------
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY menu_categories_tenant_isolation ON menu_categories
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY menu_categories_tenant_insert ON menu_categories
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY menu_categories_superuser ON menu_categories
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- menu_items
-- --------------------------------------------------------------------------
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY menu_items_tenant_isolation ON menu_items
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY menu_items_tenant_insert ON menu_items
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY menu_items_superuser ON menu_items
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- menu_modifiers
-- --------------------------------------------------------------------------
ALTER TABLE menu_modifiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY menu_modifiers_tenant_isolation ON menu_modifiers
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY menu_modifiers_tenant_insert ON menu_modifiers
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY menu_modifiers_superuser ON menu_modifiers
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- combos
-- --------------------------------------------------------------------------
ALTER TABLE combos ENABLE ROW LEVEL SECURITY;
CREATE POLICY combos_tenant_isolation ON combos
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY combos_tenant_insert ON combos
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY combos_superuser ON combos
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- spaces
-- --------------------------------------------------------------------------
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
CREATE POLICY spaces_tenant_isolation ON spaces
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY spaces_tenant_insert ON spaces
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY spaces_superuser ON spaces
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- tables
-- --------------------------------------------------------------------------
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
CREATE POLICY tables_tenant_isolation ON tables
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY tables_tenant_insert ON tables
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY tables_superuser ON tables
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- customers
-- --------------------------------------------------------------------------
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY customers_tenant_isolation ON customers
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY customers_tenant_insert ON customers
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY customers_superuser ON customers
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- orders
-- --------------------------------------------------------------------------
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY orders_tenant_isolation ON orders
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY orders_tenant_insert ON orders
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY orders_superuser ON orders
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- order_items
-- Note: order_items inherits tenant isolation from orders via JOIN.
-- RLS enabled here for defense-in-depth; policy checks via subquery to orders.
-- --------------------------------------------------------------------------
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY order_items_tenant_isolation ON order_items
    USING (EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
          AND orders.restaurant_id = current_setting('app.restaurant_id')::uuid
    ));
CREATE POLICY order_items_tenant_insert ON order_items
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
          AND orders.restaurant_id = current_setting('app.restaurant_id')::uuid
    ));
CREATE POLICY order_items_superuser ON order_items
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- kitchen_tickets
-- --------------------------------------------------------------------------
ALTER TABLE kitchen_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY kitchen_tickets_tenant_isolation ON kitchen_tickets
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY kitchen_tickets_tenant_insert ON kitchen_tickets
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY kitchen_tickets_superuser ON kitchen_tickets
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- bills
-- --------------------------------------------------------------------------
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY bills_tenant_isolation ON bills
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY bills_tenant_insert ON bills
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY bills_superuser ON bills
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- payments
-- --------------------------------------------------------------------------
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY payments_tenant_isolation ON payments
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY payments_tenant_insert ON payments
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY payments_superuser ON payments
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- khata_entries
-- --------------------------------------------------------------------------
ALTER TABLE khata_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY khata_entries_tenant_isolation ON khata_entries
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY khata_entries_tenant_insert ON khata_entries
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY khata_entries_superuser ON khata_entries
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- suppliers
-- --------------------------------------------------------------------------
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY suppliers_tenant_isolation ON suppliers
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY suppliers_tenant_insert ON suppliers
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY suppliers_superuser ON suppliers
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- inventory_items
-- --------------------------------------------------------------------------
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY inventory_items_tenant_isolation ON inventory_items
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY inventory_items_tenant_insert ON inventory_items
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY inventory_items_superuser ON inventory_items
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- stock_movements
-- --------------------------------------------------------------------------
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
CREATE POLICY stock_movements_tenant_isolation ON stock_movements
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY stock_movements_tenant_insert ON stock_movements
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY stock_movements_superuser ON stock_movements
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- recipes
-- --------------------------------------------------------------------------
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY recipes_tenant_isolation ON recipes
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY recipes_tenant_insert ON recipes
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY recipes_superuser ON recipes
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- purchase_orders
-- --------------------------------------------------------------------------
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY purchase_orders_tenant_isolation ON purchase_orders
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY purchase_orders_tenant_insert ON purchase_orders
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY purchase_orders_superuser ON purchase_orders
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- loyalty_transactions
-- --------------------------------------------------------------------------
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY loyalty_transactions_tenant_isolation ON loyalty_transactions
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY loyalty_transactions_tenant_insert ON loyalty_transactions
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY loyalty_transactions_superuser ON loyalty_transactions
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- shifts
-- --------------------------------------------------------------------------
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY shifts_tenant_isolation ON shifts
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY shifts_tenant_insert ON shifts
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY shifts_superuser ON shifts
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- attendance_records
-- --------------------------------------------------------------------------
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY attendance_records_tenant_isolation ON attendance_records
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY attendance_records_tenant_insert ON attendance_records
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY attendance_records_superuser ON attendance_records
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- salary_advances
-- --------------------------------------------------------------------------
ALTER TABLE salary_advances ENABLE ROW LEVEL SECURITY;
CREATE POLICY salary_advances_tenant_isolation ON salary_advances
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY salary_advances_tenant_insert ON salary_advances
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY salary_advances_superuser ON salary_advances
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- delivery_zones
-- --------------------------------------------------------------------------
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY delivery_zones_tenant_isolation ON delivery_zones
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY delivery_zones_tenant_insert ON delivery_zones
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY delivery_zones_superuser ON delivery_zones
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- riders
-- --------------------------------------------------------------------------
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
CREATE POLICY riders_tenant_isolation ON riders
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY riders_tenant_insert ON riders
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY riders_superuser ON riders
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- delivery_orders
-- --------------------------------------------------------------------------
ALTER TABLE delivery_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY delivery_orders_tenant_isolation ON delivery_orders
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY delivery_orders_tenant_insert ON delivery_orders
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY delivery_orders_superuser ON delivery_orders
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- reservations
-- --------------------------------------------------------------------------
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY reservations_tenant_isolation ON reservations
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY reservations_tenant_insert ON reservations
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY reservations_superuser ON reservations
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- tax_configs
-- --------------------------------------------------------------------------
ALTER TABLE tax_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tax_configs_tenant_isolation ON tax_configs
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY tax_configs_tenant_insert ON tax_configs
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY tax_configs_superuser ON tax_configs
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- printer_configs
-- --------------------------------------------------------------------------
ALTER TABLE printer_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY printer_configs_tenant_isolation ON printer_configs
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY printer_configs_tenant_insert ON printer_configs
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY printer_configs_superuser ON printer_configs
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- notification_templates
-- --------------------------------------------------------------------------
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY notification_templates_tenant_isolation ON notification_templates
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY notification_templates_tenant_insert ON notification_templates
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY notification_templates_superuser ON notification_templates
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- audit_log
-- --------------------------------------------------------------------------
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_log_tenant_isolation ON audit_log
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY audit_log_tenant_insert ON audit_log
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY audit_log_superuser ON audit_log
    USING (current_setting('app.bypass_rls', true) = 'true');

-- --------------------------------------------------------------------------
-- sync_log
-- --------------------------------------------------------------------------
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY sync_log_tenant_isolation ON sync_log
    USING (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY sync_log_tenant_insert ON sync_log
    FOR INSERT WITH CHECK (restaurant_id = current_setting('app.restaurant_id')::uuid);
CREATE POLICY sync_log_superuser ON sync_log
    USING (current_setting('app.bypass_rls', true) = 'true');

-- ============================================================================
-- NOTE: Tables without direct restaurant_id (menu_variants, menu_item_modifiers,
-- combo_items, recipe_ingredients, purchase_order_items) do not have RLS enabled.
-- They are accessed exclusively via JOINs to their parent tables which enforce
-- tenant isolation.
-- ============================================================================

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
