

-- ======================
-- 1. STORES (PARENT)
-- ======================
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(30),
  address TEXT,
  kra_pin VARCHAR(50),
  logo TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 2. BRANCHES
-- ======================
CREATE TABLE branches (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
  branch_name VARCHAR(150) NOT NULL,
  location TEXT,
  phone VARCHAR(30),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 3. USERS
-- ======================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  second_name VARCHAR(100),
  surname VARCHAR(100),
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL, -- hashed password only
  role VARCHAR(20) NOT NULL DEFAULT 'cashier',
  CHECK (role IN ('superadmin', 'admin', 'storemanager', 'cashier')),
  store_id INTEGER REFERENCES stores(id),
  branch_id INTEGER REFERENCES branches(id),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- 4. OTP TABLE
-- ======================
CREATE TABLE password_reset_otps (
  id SERIAL PRIMARY KEY,
  email VARCHAR(150) NOT NULL,
  otp VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);