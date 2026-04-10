-- gnarus-payment-doc
-- Versao 1: produto, versao comercial, segmento comercial, carrinho/checkout e pagamento
-- A modelagem deve crescer de forma incremental, sem antecipar regras que ainda nao existem.

CREATE TABLE product (
  id INTEGER PRIMARY KEY,
  sku VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE product_version (
  id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL,
  access_months INTEGER NOT NULL,
  bonus_months INTEGER NOT NULL DEFAULT 0,
  price_amount DECIMAL(12, 2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'BRL',
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP, -- null while the version is active
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_product_version_product
    FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT uk_product_version_history
    UNIQUE (product_id, access_months, bonus_months, valid_from)
);

CREATE TABLE cart (
  id INTEGER PRIMARY KEY,
  buyer_reference VARCHAR(100) NOT NULL,
  commercial_segment VARCHAR(20) NOT NULL DEFAULT 'B2C',
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  currency CHAR(3) NOT NULL DEFAULT 'BRL',
  subtotal_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE cart_item (
  id INTEGER PRIMARY KEY,
  cart_id INTEGER NOT NULL,
  product_version_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  access_months INTEGER NOT NULL,
  bonus_months INTEGER NOT NULL DEFAULT 0,
  total_access_months INTEGER NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_cart_item_cart
    FOREIGN KEY (cart_id) REFERENCES cart(id),
  CONSTRAINT fk_cart_item_product_version
    FOREIGN KEY (product_version_id) REFERENCES product_version(id)
);

CREATE TABLE payment_method (
  id INTEGER PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Rules resolve in this order: product override, segment, then global fallback.
CREATE TABLE payment_method_rule (
  id INTEGER PRIMARY KEY,
  scope VARCHAR(20) NOT NULL DEFAULT 'SEGMENT',
  product_id INTEGER,
  commercial_segment VARCHAR(20),
  payment_method_id INTEGER NOT NULL,
  priority INTEGER NOT NULL DEFAULT 100, -- lower values first within the same scope
  active BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_payment_method_rule_product
    FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT fk_payment_method_rule_payment_method
    FOREIGN KEY (payment_method_id) REFERENCES payment_method(id)
);

CREATE TABLE cart_payment (
  id INTEGER PRIMARY KEY,
  cart_id INTEGER NOT NULL,
  payment_method_id INTEGER NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  provider_reference VARCHAR(255),
  authorization_code VARCHAR(100),
  failure_code VARCHAR(100),
  failure_message VARCHAR(255),
  approved_at TIMESTAMP,
  failed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_cart_payment_cart
    FOREIGN KEY (cart_id) REFERENCES cart(id),
  CONSTRAINT fk_cart_payment_payment_method
    FOREIGN KEY (payment_method_id) REFERENCES payment_method(id)
);
