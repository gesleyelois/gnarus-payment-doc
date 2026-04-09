-- gnarus-payment-doc
-- Versao 1: produto, carrinho/checkout e pagamento
-- A modelagem deve crescer de forma incremental, sem antecipar regras que ainda nao existem.

CREATE TABLE product (
  id INTEGER PRIMARY KEY,
  sku VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  price DECIMAL(12, 2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'BRL',
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE cart (
  id INTEGER PRIMARY KEY,
  buyer_reference VARCHAR(100) NOT NULL,
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
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_cart_item_cart
    FOREIGN KEY (cart_id) REFERENCES cart(id),
  CONSTRAINT fk_cart_item_product
    FOREIGN KEY (product_id) REFERENCES product(id)
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

CREATE TABLE cart_payment (
  id INTEGER PRIMARY KEY,
  cart_id INTEGER NOT NULL,
  payment_method_id INTEGER NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  provider_reference VARCHAR(255),
  authorization_code VARCHAR(100),
  failure_reason VARCHAR(255),
  authorized_at TIMESTAMP,
  captured_at TIMESTAMP,
  failed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_cart_payment_cart
    FOREIGN KEY (cart_id) REFERENCES cart(id),
  CONSTRAINT fk_cart_payment_payment_method
    FOREIGN KEY (payment_method_id) REFERENCES payment_method(id)
);

