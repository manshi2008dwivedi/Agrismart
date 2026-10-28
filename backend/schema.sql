-- AgriSmart Production Relational Database Schema
-- Compatible with PostgreSQL 13+ and MySQL 8.0+

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    phone VARCHAR(30),
    role VARCHAR(20) NOT NULL CHECK (role IN ('farmer', 'buyer', 'admin')),
    salt VARCHAR(64) NOT NULL,
    hash VARCHAR(128) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    token VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS otps (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(30),
    otp VARCHAR(10) NOT NULL,
    attempts INT DEFAULT 0,
    purpose VARCHAR(30) DEFAULT 'login',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS farmers (
    id VARCHAR(64) PRIMARY KEY,
    owner_user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(120) NOT NULL,
    district VARCHAR(80) NOT NULL,
    crops JSONB DEFAULT '[]'::jsonb,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS crop_listings (
    id VARCHAR(64) PRIMARY KEY,
    farmer_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop VARCHAR(40) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    expected_price NUMERIC(10, 2) NOT NULL,
    harvest_date DATE,
    mandi VARCHAR(80),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offers (
    id VARCHAR(64) PRIMARY KEY,
    farmer_id VARCHAR(64) NOT NULL,
    farmer_name VARCHAR(120) NOT NULL,
    buyer_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    buyer_name VARCHAR(120) NOT NULL,
    crop VARCHAR(40) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    early_bonus_per_quintal NUMERIC(10, 2) DEFAULT 0,
    total_price_per_quintal NUMERIC(10, 2) NOT NULL,
    counter_price NUMERIC(10, 2),
    delivery_by DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP WITH TIME ZONE,
    countered_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS offer_messages (
    id VARCHAR(64) PRIMARY KEY,
    offer_id VARCHAR(64) NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    sender_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_name VARCHAR(120) NOT NULL,
    sender_role VARCHAR(20) NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    offer_id VARCHAR(64),
    buyer_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farmer_id VARCHAR(64) NOT NULL,
    crop VARCHAR(40) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    price_per_quintal NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'confirmed',
    payment_status VARCHAR(30) DEFAULT 'pending',
    delivery_status VARCHAR(30) DEFAULT 'pending',
    payment_details JSONB,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(64) PRIMARY KEY,
    farmer_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop VARCHAR(40) NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    soil VARCHAR(60) NOT NULL,
    acres NUMERIC(8, 2) NOT NULL,
    yield_quintal NUMERIC(10, 2) NOT NULL,
    estimated_revenue NUMERIC(12, 2) NOT NULL,
    estimated_cost NUMERIC(12, 2) NOT NULL,
    estimated_profit NUMERIC(12, 2) NOT NULL,
    fertilizer_plan JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(40) NOT NULL,
    title VARCHAR(160) NOT NULL,
    body TEXT NOT NULL,
    meta JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_offers_buyer ON offers(buyer_user_id);
CREATE INDEX IF NOT EXISTS idx_offers_farmer ON offers(farmer_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_user_id);
CREATE INDEX IF NOT EXISTS idx_orders_farmer ON orders(farmer_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read);
