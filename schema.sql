-- gnarus-payment-doc
-- Versao 1: empresa, unidade de negocio, produto, bundle versionado, ofertas de checkout, cupons, versao comercial, carrinho/checkout e pagamento
-- A modelagem deve crescer de forma incremental, sem antecipar regras que ainda nao existem.

CREATE TABLE company (
  id INTEGER PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE business_unit (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  code VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_business_unit_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT uk_business_unit_company_code
    UNIQUE (company_id, code)
);

CREATE TABLE product (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  business_unit_id INTEGER NOT NULL, -- owning business unit
  sku VARCHAR(100) NOT NULL, -- unique within company
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500),
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_product_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT fk_product_business_unit
    FOREIGN KEY (business_unit_id) REFERENCES business_unit(id),
  CONSTRAINT uk_product_company_sku
    UNIQUE (company_id, sku)
);

CREATE TABLE product_version (
  id INTEGER PRIMARY KEY,
  product_id INTEGER NOT NULL,
  code VARCHAR(100) NOT NULL, -- public offer code within the product
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
  CONSTRAINT uk_product_version_product_code
    UNIQUE (product_id, code),
  CONSTRAINT uk_product_version_history
    UNIQUE (product_id, access_months, bonus_months, valid_from)
);

CREATE TABLE bundle (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  business_unit_id INTEGER,
  code VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_bundle_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT fk_bundle_business_unit
    FOREIGN KEY (business_unit_id) REFERENCES business_unit(id),
  CONSTRAINT uk_bundle_company_code
    UNIQUE (company_id, code)
);

CREATE TABLE bundle_version (
  id INTEGER PRIMARY KEY,
  bundle_id INTEGER NOT NULL,
  version_number INTEGER NOT NULL,
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP, -- null while the version is active
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_bundle_version_bundle
    FOREIGN KEY (bundle_id) REFERENCES bundle(id),
  CONSTRAINT uk_bundle_version_history
    UNIQUE (bundle_id, version_number)
);

CREATE TABLE bundle_item (
  id INTEGER PRIMARY KEY,
  bundle_version_id INTEGER NOT NULL,
  product_version_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_bundle_item_bundle_version
    FOREIGN KEY (bundle_version_id) REFERENCES bundle_version(id),
  CONSTRAINT fk_bundle_item_product_version
    FOREIGN KEY (product_version_id) REFERENCES product_version(id),
  CONSTRAINT uk_bundle_item_bundle_version_product_version
    UNIQUE (bundle_version_id, product_version_id)
);

CREATE TABLE coupon (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  code VARCHAR(100) NOT NULL, -- unique within company
  name VARCHAR(255) NOT NULL,
  discount_type VARCHAR(20) NOT NULL DEFAULT 'PERCENT', -- PERCENT, FIXED_PRICE
  percent_off DECIMAL(5, 2),
  currency CHAR(3) NOT NULL DEFAULT 'BRL',
  application_scope VARCHAR(20) NOT NULL DEFAULT 'CART', -- CART, TARGET
  cumulative BOOLEAN NOT NULL DEFAULT FALSE,
  max_uses INTEGER,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_coupon_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT uk_coupon_company_code
    UNIQUE (company_id, code),
  CONSTRAINT ck_coupon_discount_type
    CHECK (discount_type IN ('PERCENT', 'FIXED_PRICE')),
  CONSTRAINT ck_coupon_application_scope
    CHECK (application_scope IN ('CART', 'TARGET')),
  CONSTRAINT ck_coupon_discount_payload
    CHECK (
      (discount_type = 'PERCENT' AND percent_off IS NOT NULL) OR
      (discount_type = 'FIXED_PRICE' AND percent_off IS NULL)
    ),
  CONSTRAINT ck_coupon_fixed_price_scope
    CHECK (
      (discount_type = 'PERCENT') OR
      (discount_type = 'FIXED_PRICE' AND application_scope = 'TARGET')
    )
);

CREATE TABLE coupon_target (
  id INTEGER PRIMARY KEY,
  coupon_id INTEGER NOT NULL,
  target_type VARCHAR(20) NOT NULL, -- PRODUCT_VERSION, BUNDLE_VERSION
  product_version_id INTEGER,
  bundle_version_id INTEGER,
  target_price_amount DECIMAL(12, 2), -- final price per eligible target when coupon.discount_type = FIXED_PRICE
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_coupon_target_coupon
    FOREIGN KEY (coupon_id) REFERENCES coupon(id),
  CONSTRAINT fk_coupon_target_product_version
    FOREIGN KEY (product_version_id) REFERENCES product_version(id),
  CONSTRAINT fk_coupon_target_bundle_version
    FOREIGN KEY (bundle_version_id) REFERENCES bundle_version(id),
  CONSTRAINT ck_coupon_target_type
    CHECK (target_type IN ('PRODUCT_VERSION', 'BUNDLE_VERSION')),
  CONSTRAINT ck_coupon_target_reference
    CHECK (
      (target_type = 'PRODUCT_VERSION' AND product_version_id IS NOT NULL AND bundle_version_id IS NULL) OR
      (target_type = 'BUNDLE_VERSION' AND product_version_id IS NULL AND bundle_version_id IS NOT NULL)
    ),
  CONSTRAINT ck_coupon_target_price_amount
    CHECK (target_price_amount IS NULL OR target_price_amount >= 0),
  CONSTRAINT uk_coupon_target_product_version
    UNIQUE (coupon_id, product_version_id),
  CONSTRAINT uk_coupon_target_bundle_version
    UNIQUE (coupon_id, bundle_version_id)
);

CREATE TABLE cart (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  business_unit_id INTEGER, -- null when the cart mixes multiple business units
  bundle_version_id INTEGER, -- snapshot of the bundle version used when the cart opened
  buyer_reference VARCHAR(100) NOT NULL,
  commercial_segment VARCHAR(20) NOT NULL DEFAULT 'B2C',
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  currency CHAR(3) NOT NULL DEFAULT 'BRL',
  subtotal_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_cart_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT fk_cart_business_unit
    FOREIGN KEY (business_unit_id) REFERENCES business_unit(id),
  CONSTRAINT fk_cart_bundle_version
    FOREIGN KEY (bundle_version_id) REFERENCES bundle_version(id)
);

CREATE TABLE cart_item (
  id INTEGER PRIMARY KEY,
  cart_id INTEGER NOT NULL,
  product_version_id INTEGER NOT NULL,
  business_unit_id INTEGER NOT NULL, -- snapshot of the line business unit
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
    FOREIGN KEY (product_version_id) REFERENCES product_version(id),
  CONSTRAINT fk_cart_item_business_unit
    FOREIGN KEY (business_unit_id) REFERENCES business_unit(id)
);

CREATE TABLE cart_coupon (
  id INTEGER PRIMARY KEY,
  cart_id INTEGER NOT NULL,
  coupon_id INTEGER NOT NULL,
  coupon_code VARCHAR(100) NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- PERCENT, FIXED_PRICE
  application_scope VARCHAR(20) NOT NULL, -- CART, TARGET
  cumulative BOOLEAN NOT NULL DEFAULT FALSE,
  status VARCHAR(20) NOT NULL DEFAULT 'APPLIED', -- APPLIED, REMOVED, EXPIRED
  discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  applied_at TIMESTAMP,
  removed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_cart_coupon_cart
    FOREIGN KEY (cart_id) REFERENCES cart(id),
  CONSTRAINT fk_cart_coupon_coupon
    FOREIGN KEY (coupon_id) REFERENCES coupon(id),
  CONSTRAINT ck_cart_coupon_discount_type
    CHECK (discount_type IN ('PERCENT', 'FIXED_PRICE')),
  CONSTRAINT ck_cart_coupon_application_scope
    CHECK (application_scope IN ('CART', 'TARGET')),
  CONSTRAINT ck_cart_coupon_status
    CHECK (status IN ('APPLIED', 'REMOVED', 'EXPIRED'))
);

CREATE TABLE cart_coupon_item (
  id INTEGER PRIMARY KEY,
  cart_coupon_id INTEGER NOT NULL,
  cart_item_id INTEGER NOT NULL,
  discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  target_type VARCHAR(20), -- PRODUCT_VERSION, BUNDLE_VERSION
  product_version_id INTEGER,
  bundle_version_id INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_cart_coupon_item_cart_coupon
    FOREIGN KEY (cart_coupon_id) REFERENCES cart_coupon(id),
  CONSTRAINT fk_cart_coupon_item_cart_item
    FOREIGN KEY (cart_item_id) REFERENCES cart_item(id),
  CONSTRAINT fk_cart_coupon_item_product_version
    FOREIGN KEY (product_version_id) REFERENCES product_version(id),
  CONSTRAINT fk_cart_coupon_item_bundle_version
    FOREIGN KEY (bundle_version_id) REFERENCES bundle_version(id),
  CONSTRAINT ck_cart_coupon_item_target_type
    CHECK (target_type IS NULL OR target_type IN ('PRODUCT_VERSION', 'BUNDLE_VERSION')),
  CONSTRAINT ck_cart_coupon_item_target_reference
    CHECK (
      (target_type IS NULL AND product_version_id IS NULL AND bundle_version_id IS NULL) OR
      (target_type = 'PRODUCT_VERSION' AND product_version_id IS NOT NULL AND bundle_version_id IS NULL) OR
      (target_type = 'BUNDLE_VERSION' AND product_version_id IS NULL AND bundle_version_id IS NOT NULL)
    )
);

-- checkout_offer modela upsell, cross-sell e cortesia no checkout.
CREATE TABLE checkout_offer (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  source_product_version_id INTEGER NOT NULL,
  offered_product_version_id INTEGER NOT NULL,
  courtesy_product_version_id INTEGER,
  priority INTEGER NOT NULL DEFAULT 100,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_checkout_offer_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT fk_checkout_offer_source_product_version
    FOREIGN KEY (source_product_version_id) REFERENCES product_version(id),
  CONSTRAINT fk_checkout_offer_offered_product_version
    FOREIGN KEY (offered_product_version_id) REFERENCES product_version(id),
  CONSTRAINT fk_checkout_offer_courtesy_product_version
    FOREIGN KEY (courtesy_product_version_id) REFERENCES product_version(id),
  CONSTRAINT uk_checkout_offer_history
    UNIQUE (company_id, source_product_version_id, offered_product_version_id, valid_from)
);

-- cart_offer guarda a oferta exibida e o resultado da decisao do comprador.
CREATE TABLE cart_offer (
  id INTEGER PRIMARY KEY,
  cart_id INTEGER NOT NULL,
  checkout_offer_id INTEGER NOT NULL,
  source_cart_item_id INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'OFFERED',
  selected_cart_item_id INTEGER,
  courtesy_cart_item_id INTEGER,
  selected_at TIMESTAMP,
  declined_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_cart_offer_cart
    FOREIGN KEY (cart_id) REFERENCES cart(id),
  CONSTRAINT fk_cart_offer_checkout_offer
    FOREIGN KEY (checkout_offer_id) REFERENCES checkout_offer(id),
  CONSTRAINT fk_cart_offer_source_cart_item
    FOREIGN KEY (source_cart_item_id) REFERENCES cart_item(id),
  CONSTRAINT fk_cart_offer_selected_cart_item
    FOREIGN KEY (selected_cart_item_id) REFERENCES cart_item(id),
  CONSTRAINT fk_cart_offer_courtesy_cart_item
    FOREIGN KEY (courtesy_cart_item_id) REFERENCES cart_item(id)
);

CREATE TABLE payment_method (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  code VARCHAR(50) NOT NULL, -- unique within company
  name VARCHAR(100) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_payment_method_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT uk_payment_method_company_code
    UNIQUE (company_id, code)
);

-- Rules resolve in this order: product override, business unit, segment, then global fallback.
CREATE TABLE payment_method_rule (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  scope VARCHAR(20) NOT NULL DEFAULT 'SEGMENT', -- GLOBAL, SEGMENT, BUSINESS_UNIT, PRODUCT
  product_id INTEGER,
  business_unit_id INTEGER,
  commercial_segment VARCHAR(20),
  payment_method_id INTEGER NOT NULL,
  priority INTEGER NOT NULL DEFAULT 100, -- lower values first within the same scope
  active BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_payment_method_rule_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT fk_payment_method_rule_product
    FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT fk_payment_method_rule_business_unit
    FOREIGN KEY (business_unit_id) REFERENCES business_unit(id),
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
