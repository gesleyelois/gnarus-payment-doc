-- gnarus-payment-doc
-- Versao 1: empresa, unidade de negocio, agrupamento de produto, produto, bundle versionado, ofertas de checkout, versao comercial, carrinho/checkout e pagamento por provedor
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

CREATE TABLE product_group (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  business_unit_id INTEGER,
  code VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_product_group_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT fk_product_group_business_unit
    FOREIGN KEY (business_unit_id) REFERENCES business_unit(id),
  CONSTRAINT uk_product_group_company_code
    UNIQUE (company_id, code)
);

CREATE TABLE product (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  business_unit_id INTEGER NOT NULL, -- owning business unit
  product_group_id INTEGER NOT NULL, -- checkout and payment configuration group
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
  CONSTRAINT fk_product_product_group
    FOREIGN KEY (product_group_id) REFERENCES product_group(id),
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
  price_amount DECIMAL(12, 2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'BRL',
  composition_json TEXT NOT NULL, -- snapshot of the bundle products and quantities
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP, -- null while the version is active
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_bundle_version_bundle
    FOREIGN KEY (bundle_id) REFERENCES bundle(id),
  CONSTRAINT uk_bundle_version_history
    UNIQUE (bundle_id, version_number)
);

CREATE TABLE cart (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL, -- company that publishes the checkout and payment configuration
  business_unit_id INTEGER, -- null when the cart mixes multiple business units or partner companies
  origin_product_version_id INTEGER, -- product route that opened the cart, when applicable
  bundle_version_id INTEGER, -- snapshot of the bundle version used when the cart opened
  buyer_country_code CHAR(2), -- buyer origin country for FX pricing
  buyer_reference VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  currency CHAR(3) NOT NULL DEFAULT 'BRL',
  fx_mode VARCHAR(20), -- PROVIDER_API or FIXED_RATE
  fx_rate DECIMAL(18, 8),
  fx_rate_source VARCHAR(100),
  fx_quoted_at TIMESTAMP,
  subtotal_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  subtotal_base_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total_base_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_cart_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT fk_cart_business_unit
    FOREIGN KEY (business_unit_id) REFERENCES business_unit(id),
  CONSTRAINT fk_cart_origin_product_version
    FOREIGN KEY (origin_product_version_id) REFERENCES product_version(id),
  CONSTRAINT fk_cart_bundle_version
    FOREIGN KEY (bundle_version_id) REFERENCES bundle_version(id)
);

CREATE TABLE cart_item (
  id INTEGER PRIMARY KEY,
  cart_id INTEGER NOT NULL,
  product_version_id INTEGER NOT NULL,
  bundle_version_id INTEGER, -- bundle snapshot when the line came from a bundle composition
  checkout_offer_id INTEGER, -- offer configuration that originated the line, when applicable
  cart_item_type VARCHAR(20) NOT NULL DEFAULT 'BASE', -- BASE, ADDON, COURTESY
  company_id INTEGER NOT NULL, -- snapshot of the line company
  business_unit_id INTEGER NOT NULL, -- snapshot of the line business unit
  quantity INTEGER NOT NULL DEFAULT 1,
  base_unit_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  unit_price DECIMAL(12, 2) NOT NULL,
  base_total_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
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
  CONSTRAINT fk_cart_item_bundle_version
    FOREIGN KEY (bundle_version_id) REFERENCES bundle_version(id),
  CONSTRAINT fk_cart_item_checkout_offer
    FOREIGN KEY (checkout_offer_id) REFERENCES checkout_offer(id),
  CONSTRAINT fk_cart_item_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT fk_cart_item_business_unit
    FOREIGN KEY (business_unit_id) REFERENCES business_unit(id)
);

-- checkout_offer modela upsell, cross-sell e cortesia no checkout.
-- company_id identifica quem publica a oferta; o addon pode vir de empresa parceira.
-- a oferta pode nascer de uma product_version ou de uma bundle_version, nunca das duas ao mesmo tempo.
CREATE TABLE checkout_offer (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  source_product_version_id INTEGER,
  source_bundle_version_id INTEGER,
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
  CONSTRAINT fk_checkout_offer_source_bundle_version
    FOREIGN KEY (source_bundle_version_id) REFERENCES bundle_version(id),
  CONSTRAINT fk_checkout_offer_offered_product_version
    FOREIGN KEY (offered_product_version_id) REFERENCES product_version(id),
  CONSTRAINT fk_checkout_offer_courtesy_product_version
    FOREIGN KEY (courtesy_product_version_id) REFERENCES product_version(id),
  CONSTRAINT ck_checkout_offer_source
    CHECK (
      (source_product_version_id IS NOT NULL AND source_bundle_version_id IS NULL)
      OR
      (source_product_version_id IS NULL AND source_bundle_version_id IS NOT NULL)
    ),
  CONSTRAINT uk_checkout_offer_history
    UNIQUE (company_id, source_product_version_id, source_bundle_version_id, offered_product_version_id, valid_from)
);

CREATE TABLE payment_provider (
  id INTEGER PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE company_provider (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  payment_provider_id INTEGER NOT NULL,
  code VARCHAR(100) NOT NULL, -- unique within company, e.g. MALGA_MAIN
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  health_status VARCHAR(20) NOT NULL DEFAULT 'ONLINE', -- ONLINE, DEGRADED, OFFLINE
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_company_provider_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT fk_company_provider_payment_provider
    FOREIGN KEY (payment_provider_id) REFERENCES payment_provider(id),
  CONSTRAINT uk_company_provider_company_code
    UNIQUE (company_id, code)
);

-- company_provider_method guarda o meio habilitado em uma configuracao de provedor.
-- O provedor sempre carrega seus meios suportados por configuracao; a regra nunca separa provider e method.
-- country_code e buyer_currency permitem registrar rotas locais como OXXO MXN ou SPEI MXN.
CREATE TABLE company_provider_method (
  id INTEGER PRIMARY KEY,
  company_provider_id INTEGER NOT NULL,
  code VARCHAR(100) NOT NULL, -- unique within the provider configuration
  name VARCHAR(100) NOT NULL,
  payment_method_code VARCHAR(30) NOT NULL, -- PIX, CREDIT_CARD, DEBIT_CARD, NUPAY, BOLETO, OXXO, SPEI
  fallback_company_provider_method_id INTEGER,
  country_code CHAR(2),
  buyer_currency CHAR(3),
  pricing_currency CHAR(3),
  fx_mode VARCHAR(20) NOT NULL DEFAULT 'NONE', -- NONE, PROVIDER_FX
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_company_provider_method_company_provider
    FOREIGN KEY (company_provider_id) REFERENCES company_provider(id),
  CONSTRAINT fk_company_provider_method_fallback
    FOREIGN KEY (fallback_company_provider_method_id) REFERENCES company_provider_method(id),
  CONSTRAINT uk_company_provider_method_code
    UNIQUE (company_provider_id, code)
);

-- company_provider_method_fx_rule define como converter o preco base por pais.
-- PROVIDER_API usa a cotacao do provedor; FIXED_RATE usa a taxa do backoffice.
CREATE TABLE company_provider_method_fx_rule (
  id INTEGER PRIMARY KEY,
  company_provider_method_id INTEGER NOT NULL,
  country_code CHAR(2) NOT NULL,
  fx_mode VARCHAR(20) NOT NULL, -- PROVIDER_API, FIXED_RATE
  fixed_rate DECIMAL(18, 8),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_company_provider_method_fx_rule_method
    FOREIGN KEY (company_provider_method_id) REFERENCES company_provider_method(id),
  CONSTRAINT uk_company_provider_method_fx_rule_method_country
    UNIQUE (company_provider_method_id, country_code)
);

-- payment_option_rule resolve from cart.company_id in this order:
-- product override, then business unit, then company fallback.
CREATE TABLE payment_option_rule (
  id INTEGER PRIMARY KEY,
  company_id INTEGER NOT NULL,
  scope VARCHAR(20) NOT NULL DEFAULT 'COMPANY', -- COMPANY, BUSINESS_UNIT, PRODUCT_GROUP, PRODUCT
  business_unit_id INTEGER,
  product_group_id INTEGER,
  product_id INTEGER,
  company_provider_method_id INTEGER NOT NULL,
  priority INTEGER NOT NULL DEFAULT 100, -- lower values first within the same scope
  active BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT fk_payment_option_rule_company
    FOREIGN KEY (company_id) REFERENCES company(id),
  CONSTRAINT fk_payment_option_rule_business_unit
    FOREIGN KEY (business_unit_id) REFERENCES business_unit(id),
  CONSTRAINT fk_payment_option_rule_product_group
    FOREIGN KEY (product_group_id) REFERENCES product_group(id),
  CONSTRAINT fk_payment_option_rule_product
    FOREIGN KEY (product_id) REFERENCES product(id),
  CONSTRAINT fk_payment_option_rule_company_provider_method
    FOREIGN KEY (company_provider_method_id) REFERENCES company_provider_method(id)
);

CREATE TABLE cart_payment (
  id INTEGER PRIMARY KEY,
  cart_id INTEGER NOT NULL,
  company_provider_method_id INTEGER NOT NULL, -- actual route used in the attempt
  fallback_from_payment_id INTEGER, -- previous failed attempt when failover creates a new route
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
  CONSTRAINT fk_cart_payment_company_provider_method
    FOREIGN KEY (company_provider_method_id) REFERENCES company_provider_method(id),
  CONSTRAINT fk_cart_payment_fallback_from_payment
    FOREIGN KEY (fallback_from_payment_id) REFERENCES cart_payment(id)
);
