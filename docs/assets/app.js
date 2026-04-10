const sections = [
  {
    label: "Base",
    title: "01. Empresa",
    copy: `company delimita o tenant.
business_unit organiza produtos, carrinhos e regras dentro da empresa.
a visao geral fica em camadas: catalogo, bundle, ofertas, checkout e pagamento.
bundle_version guarda o historico da composicao; bundle_item pertence a bundle_version.
business_unit_id e obrigatorio em produto e na linha do carrinho; e opcional em bundle, carrinho e regra.
sku e payment_method.code sao unicos por empresa.`,
    tables: [
      {
        title: "Valores controlados",
        columns: ["Campo", "Descricao", "Valores"],
        rows: [
          ["company.status", "Estado da empresa.", "ACTIVE | INACTIVE"],
          ["business_unit.status", "Estado da unidade de negocio.", "ACTIVE | INACTIVE"],
          ["bundle.status", "Estado do bundle.", "ACTIVE | INACTIVE"],
          ["checkout_offer.active", "Estado da oferta de checkout.", "true | false"]
        ]
      },
      {
        title: "Identificacao por tenant",
        columns: ["Campo", "Regra", "Exemplo"],
        rows: [
          ["company.code", "Identificador publico da empresa.", "GROUP_A"],
          ["business_unit.code", "Unico por company.", "EDU"],
          ["product.sku", "Unico por company.", "PLUS"],
          ["payment_method.code", "Unico por company.", "PIX"]
        ]
      },
      {
        title: "Camadas da modelagem",
        columns: ["Camada", "Entidades", "Leitura"],
        rows: [
          ["Catalogo", "company, business_unit, product, product_version", "Cadastro e historico comercial."],
          ["Bundle", "bundle, bundle_version, bundle_item", "Composicao publica versionada."],
          ["Ofertas", "checkout_offer, cart_offer", "Addons opcionais no checkout."],
          ["Checkout", "cart, cart_item, cart_payment", "Snapshot da compra e pagamento."],
          ["Pagamento", "payment_method, payment_method_rule", "Meios e regras de uso."]
        ]
      },
      {
        title: "Contexto de uso",
        columns: ["Tabela", "company_id", "business_unit_id", "Leitura"],
        rows: [
          ["product", "obrigatorio", "obrigatorio", "Catalogo da empresa."],
          ["bundle", "obrigatorio", "opcional", "Raiz publica da composicao."],
          ["bundle_version", "via bundle", "via bundle", "Versao historica da composicao."],
          ["bundle_item", "via bundle_version", "-", "Itens da bundle_version."],
          ["checkout_offer", "obrigatorio", "-", "Oferta opcional ligada ao catalogo."],
          ["cart_offer", "via cart", "-", "Selecao da oferta no checkout."],
          ["cart", "obrigatorio", "opcional", "Checkout da empresa; snapshot da bundle_version."],
          ["cart_item", "via cart", "obrigatorio", "Linha da compra e snapshot da BU."],
          ["payment_method", "obrigatorio", "-", "Meio liberado por empresa."],
          ["payment_method_rule", "obrigatorio", "opcional", "Regra aplicada dentro da empresa."]
        ]
      }
    ],
    diagram: `flowchart TB
  COMPANY[company]

  subgraph CATALOGO["Catalogo"]
    BUSINESS_UNIT[business_unit]
    PRODUCT[product]
    PRODUCT_VERSION[product_version]
  end

  subgraph BUNDLE_GROUP["Bundle"]
    BUNDLE[bundle]
    BUNDLE_VERSION[bundle_version]
    BUNDLE_ITEM[bundle_item]
  end

  subgraph OFERTAS_GROUP["Ofertas"]
    CHECKOUT_OFFER[checkout_offer]
    CART_OFFER[cart_offer]
  end

  subgraph CHECKOUT_GROUP["Checkout"]
    CART[cart]
    CART_ITEM[cart_item]
    CART_PAYMENT[cart_payment]
  end

  subgraph PAGAMENTO_GROUP["Pagamento"]
    PAYMENT_METHOD[payment_method]
    PAYMENT_METHOD_RULE[payment_method_rule]
  end

  COMPANY --> BUSINESS_UNIT
  COMPANY --> PRODUCT
  BUSINESS_UNIT --> PRODUCT
  PRODUCT --> PRODUCT_VERSION

  COMPANY --> BUNDLE
  BUSINESS_UNIT --> BUNDLE
  BUNDLE --> BUNDLE_VERSION
  BUNDLE_VERSION --> BUNDLE_ITEM
  PRODUCT_VERSION --> BUNDLE_ITEM

  COMPANY --> CHECKOUT_OFFER
  PRODUCT_VERSION --> CHECKOUT_OFFER
  CART --> CART_OFFER
  CHECKOUT_OFFER --> CART_OFFER

  COMPANY --> CART
  BUSINESS_UNIT --> CART
  CART --> CART_ITEM
  PRODUCT_VERSION --> CART_ITEM
  CART --> CART_PAYMENT

  COMPANY --> PAYMENT_METHOD
  COMPANY --> PAYMENT_METHOD_RULE
  BUSINESS_UNIT --> PAYMENT_METHOD_RULE
  PAYMENT_METHOD --> CART_PAYMENT
  PAYMENT_METHOD --> PAYMENT_METHOD_RULE`,
    subsections: [
      {
        title: "Catalogo",
        copy: `A camada de catalogo concentra a identidade da empresa, as unidades de negocio e o historico comercial do produto.`,
        diagram: `erDiagram
  COMPANY ||--o{ BUSINESS_UNIT : "1:N"
  COMPANY ||--o{ PRODUCT : "1:N"
  BUSINESS_UNIT ||--o{ PRODUCT : "0:N"
  PRODUCT ||--o{ PRODUCT_VERSION : "1:N"`
      },
      {
        title: "Bundle",
        copy: `A camada de bundle registra a composicao publica e sua versao historica. bundle_item aponta a versao do produto que entra na composicao.`,
        diagram: `erDiagram
  COMPANY ||--o{ BUNDLE : "1:N"
  BUSINESS_UNIT ||--o{ BUNDLE : "0:N"
  BUNDLE ||--o{ BUNDLE_VERSION : "1:N"
  BUNDLE_VERSION ||--o{ BUNDLE_ITEM : "1:N"
  PRODUCT_VERSION ||--o{ BUNDLE_ITEM : "1:N"`
      },
      {
        title: "Ofertas",
        copy: `A camada de ofertas liga a versao de origem ao addon e, quando houver selecao, materializa o item adicional e a cortesia no checkout.`,
        diagram: `flowchart LR
  SOURCE[cart_item origem] --> CART_OFFER[cart_offer]
  CHECKOUT_OFFER[checkout_offer] --> CART_OFFER
  CART_OFFER --> ADDON[cart_item addon]
  CART_OFFER --> COURTESY[cart_item cortesia]`
      },
      {
        title: "Checkout",
        copy: `A camada de checkout guarda o carrinho, os itens materializados e a tentativa de pagamento ligada ao carrinho.`,
        diagram: `erDiagram
  COMPANY ||--o{ CART : "1:N"
  BUSINESS_UNIT ||--o{ CART : "0:N"
  BUNDLE_VERSION ||--o{ CART : "0:N"
  CART ||--o{ CART_ITEM : "1:N"
  PRODUCT_VERSION ||--o{ CART_ITEM : "1:N"
  CART ||--o{ CART_PAYMENT : "1:N"`
      },
      {
        title: "Pagamento",
        copy: `A camada de pagamento concentra os meios liberados e as regras que resolvem quais meios aparecem para cada venda.`,
        diagram: `erDiagram
  COMPANY ||--o{ PAYMENT_METHOD : "1:N"
  COMPANY ||--o{ PAYMENT_METHOD_RULE : "1:N"
  BUSINESS_UNIT ||--o{ PAYMENT_METHOD_RULE : "0:N"
  PRODUCT ||--o{ PAYMENT_METHOD_RULE : "0:N"
  PAYMENT_METHOD ||--o{ PAYMENT_METHOD_RULE : "1:N"
  PAYMENT_METHOD ||--o{ CART_PAYMENT : "1:N"`
      },
      {
        title: "Fluxo do product_version",
        copy: `A consulta publica resolve o \`sku\` do produto dentro da empresa, encontra a \`product_version\` ativa, abre o \`cart\` e congela esse snapshot no \`cart_item\`. Se preco, prazo ou bonus mudam, a versao antiga fecha e uma nova linha passa a valer.`,
        diagram: `sequenceDiagram
  participant U as Usuario
  participant P as product
  participant V as product_version
  participant C as cart
  participant I as cart_item

  U->>P: acessa sku
  P->>V: resolve versao ativa
  V-->>U: oferta vigente
  V->>C: abre carrinho com a oferta
  C->>I: grava snapshot na compra
  I-->>U: item congelado`
      },
      {
        title: "Fluxo do bundle_version",
        copy: `A consulta publica resolve \`bundle.code\`, encontra a \`bundle_version\` ativa e abre o carrinho com esse snapshot. Os \`bundle_item\` da versao sao materializados em \`cart_item\` e nao mudam depois da abertura.`,
        diagram: `sequenceDiagram
  participant U as Usuario
  participant B as bundle
  participant V as bundle_version
  participant C as cart
  participant I as cart_item

  U->>B: acessa bundle.code
  B->>V: resolve versao ativa
  V-->>U: composicao vigente
  V->>C: cria cart com bundle_version_id
  V->>I: materializa bundle_item
  C-->>U: carrinho carregado`
      }
    ],
    sql: `INSERT INTO company (id, code, name, status, created_at, updated_at)
VALUES
  (1, 'GROUP_A', 'Grupo A', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO business_unit (id, company_id, code, name, status, created_at, updated_at)
VALUES
  (1, 1, 'EDU', 'Educacao', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
  },
  {
    label: "Produto",
    title: "02. Produto",
    copy: `Produto e o catalogo da empresa. \`company_id\` identifica o tenant e \`business_unit_id\` e obrigatorio. \`sku\` identifica o produto na camada publica dentro da empresa. Periodo, preco, bonus e vigencia ficam em \`product_version\`. \`valid_to\` nulo significa versao vigente, nao versao vitalicia. A tela de produto pode listar a versao vigente resolvida por \`sku\`.`,
    tables: [
      {
        title: "Contexto do produto",
        columns: ["Campo", "Regra", "Exemplo"],
        rows: [
          ["company_id", "Obrigatorio.", "1"],
          ["business_unit_id", "Obrigatorio.", "1"],
          ["sku", "Unico por company.", "PLUS"]
        ]
      },
      {
        title: "Valores controlados",
        columns: ["Campo", "Descricao", "Valores"],
        rows: [
          ["status", "Disponibilidade do produto.", "ACTIVE | INACTIVE"]
        ]
      },
      {
        title: "Identificacao publica",
        columns: ["Campo", "Regra", "Exemplo"],
        rows: [
          ["sku", "Codigo publico do produto.", "plus"],
          ["rota publica", "Usa o sku para resolver o produto na camada publica dentro da empresa.", "/compra/plus"]
        ]
      },
      {
        title: "Historico comercial",
        columns: ["Versao", "Periodo", "Bonus", "Preco", "valid_from", "valid_to"],
        rows: [
          ["1", "12 meses", "0", "BRL 199.90", "2026-01-01", "2026-03-31"],
          ["2", "12 meses", "2", "BRL 199.90", "2026-04-01", "NULL"],
          ["3", "24 meses", "0", "BRL 349.90", "2026-01-01", "NULL"]
        ]
      }
    ],
    diagram: `erDiagram
  PRODUCT {
    INTEGER id
    VARCHAR sku
    VARCHAR name
  }
  PRODUCT ||--o{ PRODUCT_VERSION : "1:N"
  PRODUCT_VERSION {
    INTEGER id
    INTEGER product_id
    INTEGER access_months
    INTEGER bonus_months
    DECIMAL_12_2 price_amount
    CHAR_3 currency
    TIMESTAMP valid_from
    TIMESTAMP valid_to
  }`,
    subsections: [
      {
        title: "Historico comercial",
        copy: `A nova oferta nao altera o registro anterior. O historico fica na propria tabela de versao. \`valid_to\` nulo identifica a versao ainda vigente. Se existir mais de uma versao vigente para o mesmo \`sku\` dentro da empresa, isso e erro de cadastro.`,
        diagram: `flowchart LR
  V1["12m / bonus 0 / BRL 199.90"] --> V2["12m / bonus 2 / BRL 199.90"]
  V2 --> V3["24m / bonus 0 / BRL 349.90"]`,
        sql: `UPDATE product_version
SET valid_to = '2026-03-31'
WHERE id = 1;

INSERT INTO product_version (id, product_id, access_months, bonus_months, price_amount, currency, valid_from, valid_to, created_at, updated_at)
VALUES
  (2, 1, 12, 2, 199.90, 'BRL', '2026-04-01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, 24, 0, 349.90, 'BRL', '2026-01-01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
      }
    ],
    sql: `INSERT INTO product (id, company_id, business_unit_id, sku, name, description, status, created_at, updated_at)
VALUES
  (1, 1, 1, 'CURSO-IA', 'Curso de IA aplicado', 'Produto digital principal', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO product_version (id, product_id, access_months, bonus_months, price_amount, currency, valid_from, valid_to, created_at, updated_at)
VALUES
  (1, 1, 12, 0, 199.90, 'BRL', '2026-01-01', '2026-03-31', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 12, 2, 199.90, 'BRL', '2026-04-01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, 24, 0, 349.90, 'BRL', '2026-01-01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
  },
  {
    label: "Ofertas",
    title: "03. Ofertas",
    copy: `Oferta opcional no checkout. \`checkout_offer\` conecta a versao de origem ao addon sugerido. O addon pode ser o mesmo produto em outra versao ou um produto de outra BU. Quando houver cortesia, o item gratuito entra junto com a selecao do addon. \`cart_offer\` registra a oferta mostrada, a resposta do comprador e os itens materializados no carrinho.`,
    tables: [
      {
        title: "Valores controlados",
        columns: ["Campo", "Descricao", "Valores"],
        rows: [
          ["checkout_offer.active", "Disponibilidade da oferta.", "true | false"],
          ["cart_offer.status", "Estado da selecao da oferta.", "OFFERED | SELECTED | DECLINED | EXPIRED"]
        ]
      },
      {
        title: "Contexto da oferta",
        columns: ["Campo", "Regra", "Uso"],
        rows: [
          ["company_id", "Obrigatorio em checkout_offer.", "Oferta pertence a empresa."],
          ["source_product_version_id", "Obrigatorio.", "Versao que dispara a oferta."],
          ["offered_product_version_id", "Obrigatorio.", "Addon sugerido; pode ser upsell ou cross-sell."],
          ["courtesy_product_version_id", "Opcional.", "Produto gratuito quando o addon e selecionado."],
          ["priority", "Menor valor primeiro.", "Define a ordem quando houver mais de uma oferta ativa."]
        ]
      },
      {
        title: "Selecao no carrinho",
        columns: ["Campo", "Regra", "Uso"],
        rows: [
          ["cart_id", "Obrigatorio.", "Carrinho onde a oferta foi apresentada."],
          ["checkout_offer_id", "Obrigatorio.", "Oferta configurada usada no checkout."],
          ["source_cart_item_id", "Obrigatorio.", "Item base que disparou a oferta."],
          ["selected_cart_item_id", "Opcional.", "Item addon criado quando a oferta e aceita."],
          ["courtesy_cart_item_id", "Opcional.", "Item gratuito criado quando a oferta tem cortesia."],
          ["selected_at", "Opcional.", "Timestamp da aceitacao."],
          ["declined_at", "Opcional.", "Timestamp da recusa."]
        ]
      }
    ],
    diagram: `flowchart LR
  SOURCE[cart_item origem] --> OFFER_RULE[checkout_offer]
  OFFER_RULE --> CART_OFFER[cart_offer]
  CART_OFFER --> ADDON[cart_item addon]
  CART_OFFER --> COURTESY[cart_item cortesia]`
  },
  {
    label: "Carrinho",
    title: "04. Carrinho",
    copy: `O carrinho guarda o snapshot da versao escolhida dentro da empresa. \`company_id\` identifica o tenant. \`bundle_version_id\` aponta a versao de origem quando a compra nasce de um bundle. \`business_unit_id\` no cabecalho e opcional; quando a venda mistura BUs, ele fica nulo. Cada \`cart_item\` grava a BU da linha. \`access_months\` e \`bonus_months\` repetem os termos da oferta no momento da compra. \`quantity\` indica quantas unidades daquela linha foram compradas. \`commercial_segment\` define o contexto da venda, como B2C ou B2B. Ao reabrir o carrinho, a interface usa \`cart_item.product_version_id\`, nao \`product_id\`.`,
    tables: [
      {
        title: "Contexto da venda",
        columns: ["Campo", "Regra", "Uso"],
        rows: [
          ["company_id", "Obrigatorio.", "Empresa dona do checkout."],
          ["bundle_version_id", "Opcional.", "Versao do bundle de origem do carrinho."],
          ["business_unit_id", "Opcional.", "Unidade de negocio do carrinho; nulo quando a venda mistura BUs."],
          ["cart_item.business_unit_id", "Obrigatorio.", "BU congelada em cada linha."]
        ]
      },
      {
        title: "Valores controlados",
        columns: ["Campo", "Descricao", "Valores"],
        rows: [
          ["status", "Estado do checkout.", "DRAFT | CHECKOUT | COMPLETED | CANCELED | EXPIRED"],
          ["commercial_segment", "Segmento comercial da venda.", "B2C | B2B | B2B2C"],
          ["currency", "Moeda do carrinho.", "BRL"]
        ]
      },
      {
        title: "Snapshot do item",
        columns: ["Campo", "Origem", "Uso"],
        rows: [
          ["product_version_id", "product_version.id", "Referencia da oferta escolhida e versao exibida ao reabrir o carrinho."],
          ["business_unit_id", "product.business_unit_id", "BU congelada na linha."],
          ["quantity", "Definido no carrinho", "Unidades compradas. Assinatura costuma ser 1; evento pode ser maior."],
          ["access_months", "product_version.access_months", "Periodo base contratado na compra."],
          ["bonus_months", "product_version.bonus_months", "Meses extras concedidos na compra."],
          ["total_access_months", "access_months + bonus_months", "Prazo final de acesso."],
          ["unit_price", "product_version.price_amount", "Preco congelado no carrinho."],
          ["currency", "product_version.currency", "Moeda congelada no item."]
        ]
      },
      {
        title: "Cenarios do checkout",
        columns: ["Momento", "cart.status", "cart_payment.status", "Leitura"],
        rows: [
          ["Carrinho aberto", "DRAFT", "-", "Itens podem mudar."],
          ["Meio escolhido", "CHECKOUT", "PENDING", "cart_payment criado."],
          ["Aguardando resposta", "CHECKOUT", "PENDING", "Fluxo assincrono em aberto."],
          ["Venda mista", "CHECKOUT", "PENDING", "cart.business_unit_id = NULL; cada linha guarda a propria BU."],
          ["Sucesso", "COMPLETED", "APPROVED", "Carrinho fechado."],
          ["Falha", "CHECKOUT", "FAILED", "Nova tentativa permitida."]
        ]
      }
    ],
    diagram: `erDiagram
  CART ||--o{ CART_ITEM : "1:N"
  PRODUCT_VERSION ||--o{ CART_ITEM : "1:N"`,
    subsections: [
      {
        title: "Exemplo da compra",
        copy: `A oferta ativa de 12 meses com 2 meses de bonus entra no carrinho como 14 meses de acesso. O preco do item fica congelado no fechamento.`,
        tables: [
          {
            title: "Snapshot do exemplo",
            columns: ["Tabela", "Dados", "Leitura"],
            rows: [
              ["product_version", "id=2 | access_months=12 | bonus_months=2 | price_amount=199.90", "Oferta usada no fechamento."],
              ["cart_item", "product_version_id=2 | business_unit_id=1 | quantity=1 | access_months=12 | bonus_months=2 | total_access_months=14 | unit_price=199.90", "Snapshot do carrinho."],
              ["cart_payment", "status=PENDING -> APPROVED", "Tentativa de pagamento concluida com sucesso."]
            ]
          }
        ],
        diagram: `sequenceDiagram
  participant U as Usuario
  participant C as cart
  participant V as product_version
  participant I as cart_item
  participant P as cart_payment
  participant G as Gateway

  U->>C: abre carrinho
  U->>V: seleciona versao 2
  C->>I: grava product_version_id=2
  C->>I: grava total_access_months=14
  C->>P: cria cart_payment PENDING
  G-->>P: APPROVED
  P->>C: marca COMPLETED`
      }
    ],
    sql: `INSERT INTO bundle (id, company_id, business_unit_id, code, name, status, created_at, updated_at)
VALUES
  (1, 1, NULL, 'BUNDLE-PLUS', 'Bundle Plus', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO bundle_version (id, bundle_id, version_number, valid_from, valid_to, created_at, updated_at)
VALUES
  (1, 1, 1, '2026-01-01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO bundle_item (id, bundle_version_id, product_version_id, quantity, sort_order, created_at, updated_at)
VALUES
  (1, 1, 10, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 21, 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cart (id, company_id, bundle_version_id, business_unit_id, buyer_reference, commercial_segment, status, currency, subtotal_amount, discount_amount, total_amount, expires_at, created_at, updated_at)
VALUES
  (1, 1, 1, NULL, 'BUYER-1001', 'B2C', 'DRAFT', 'BRL', 199.90, 0.00, 199.90, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cart_item (id, cart_id, product_version_id, business_unit_id, quantity, unit_price, total_price, access_months, bonus_months, total_access_months, created_at, updated_at)
VALUES
  (1, 1, 2, 1, 1, 199.90, 199.90, 12, 2, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
  },
  {
    label: "Pagamento",
    title: "05. Pagamento",
    copy: `A tentativa entra em PENDING dentro da empresa. A disponibilidade dos meios vem de payment_method_rule, com regra por produto, por BU, por segmento comercial ou global. Cartao aprova ou recusa na hora. PIX, NuPay e PayPal podem confirmar depois; enquanto isso, a linha permanece em PENDING.`,
    tables: [
      {
        title: "Valores controlados",
        columns: ["Campo", "Descricao", "Valores"],
        rows: [
          ["status", "Estado da tentativa.", "PENDING | APPROVED | FAILED"],
          ["payment_method.code", "Codigo do meio de pagamento.", "PIX | CARD | PAYPAL | NUPAY"],
          ["payment_method_rule.scope", "Nivel da regra.", "GLOBAL | SEGMENT | BUSINESS_UNIT | PRODUCT"]
        ]
      },
      {
        title: "Campos de resultado",
        columns: ["Campo", "Uso", "Quando preencher"],
        rows: [
          ["provider_reference", "Referencia externa da tentativa.", "Quando o provedor retorna um identificador da operacao."],
          ["authorization_code", "Codigo de aprovacao ou autorizacao.", "Quando a tentativa termina em APPROVED e o provedor fornece esse dado."],
          ["failure_code", "Codigo da recusa retornado pelo provedor.", "Quando a tentativa termina em FAILED."],
          ["failure_message", "Mensagem ou descricao da recusa.", "Quando a tentativa termina em FAILED."],
          ["approved_at", "Timestamp da conclusao com sucesso.", "Quando status vira APPROVED."],
          ["failed_at", "Timestamp da conclusao com falha.", "Quando status vira FAILED."]
        ]
      },
      {
        title: "Resolucao dos meios",
        columns: ["Nivel", "Fonte", "Uso"],
        rows: [
          ["PRODUCT", "payment_method_rule.scope = PRODUCT", "Override para um produto especifico."],
          ["BUSINESS_UNIT", "payment_method_rule.scope = BUSINESS_UNIT", "Regra para uma unidade de negocio da empresa."],
          ["SEGMENT", "payment_method_rule.scope = SEGMENT", "Regra padrao para B2C, B2B ou B2B2C."],
          ["GLOBAL", "payment_method_rule.scope = GLOBAL", "Fallback quando nao houver regra mais especifica."]
        ]
      },
      {
        title: "Resposta da tentativa",
        columns: ["Status", "Leitura", "Efeito"],
        rows: [
          ["PENDING", "Aguardando retorno do provedor.", "authorization_code, failure_code, failure_message, approved_at e failed_at ficam nulos."],
          ["APPROVED", "Pagamento aceito.", "authorization_code e approved_at podem ser preenchidos; failure_code, failure_message e failed_at ficam nulos."],
          ["FAILED", "Pagamento recusado.", "failure_code, failure_message e failed_at podem ser preenchidos; authorization_code e approved_at ficam nulos."]
        ]
      }
    ],
    diagram: `erDiagram
  PAYMENT_METHOD ||--o{ CART_PAYMENT : "1:N"
  CART ||--o{ CART_PAYMENT : "1:N"`,
    subsections: [
      {
        title: "Ciclo do pagamento",
        copy: `O estado final sai do provedor. Se a resposta nao vem na hora, a tentativa permanece em PENDING ate a confirmacao.`,
        diagram: `stateDiagram-v2
  [*] --> PENDING
  PENDING --> APPROVED: aprovacao
  PENDING --> FAILED: recusa
  APPROVED --> [*]
  FAILED --> [*]`
      }
    ],
    sql: `INSERT INTO payment_method (id, company_id, code, name, provider, active, created_at, updated_at)
VALUES
  (1, 1, 'PIX', 'Pix', 'BRADESCO', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 'CARD', 'Cartao de credito', 'STRIPE', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, 'PAYPAL', 'PayPal', 'PAYPAL', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 1, 'NUPAY', 'NuPay', 'NUBANK', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO payment_method_rule (id, company_id, scope, product_id, business_unit_id, commercial_segment, payment_method_id, priority, active, valid_from, valid_to, created_at, updated_at)
VALUES
  (1, 1, 'GLOBAL', NULL, NULL, NULL, 2, 100, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 'SEGMENT', NULL, NULL, 'B2B', 2, 10, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, 'SEGMENT', NULL, NULL, 'B2C', 1, 10, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 1, 'SEGMENT', NULL, NULL, 'B2C', 4, 20, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 1, 'SEGMENT', NULL, NULL, 'B2C', 2, 30, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 1, 'SEGMENT', NULL, NULL, 'B2C', 3, 40, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, 1, 'BUSINESS_UNIT', NULL, 1, NULL, 1, 5, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, 1, 'BUSINESS_UNIT', NULL, 1, NULL, 2, 10, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (9, 1, 'PRODUCT', 1, NULL, NULL, 1, 1, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (10, 1, 'PRODUCT', 1, NULL, NULL, 2, 2, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cart_payment (id, cart_id, payment_method_id, amount, status, provider_reference, authorization_code, failure_code, failure_message, approved_at, failed_at, created_at, updated_at)
VALUES
  (1, 1, 2, 199.90, 'PENDING', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
  },
  {
    page: "regras",
    title: "Regras",
    copy: `Resolucao publica do catalogo e do checkout dentro da empresa. A pagina publica resolve o produto por \`sku\`; o carrinho mostra o snapshot salvo em \`cart_item.product_version_id\`.`,
    tables: [
      {
        title: "Escopo da empresa",
        columns: ["Campo", "Regra", "Uso"],
        rows: [
          ["company_id", "Obrigatorio em product, cart, payment_method e payment_method_rule.", "Limita a consulta ao tenant."],
          ["business_unit_id", "Obrigatorio em product e cart_item; opcional em cart e payment_method_rule.", "Recorte interno da empresa."],
          ["sku", "Unico por company.", "Resolve a vitrine publica."],
          ["payment_method.code", "Unico por company.", "Resolve o meio dentro da empresa."]
        ]
      },
      {
        title: "Resolucao publica",
        columns: ["Regra", "Fonte", "Resultado"],
        rows: [
          ["sku", "product.sku", "Resolve o produto publico."],
          ["versao vigente", "product_version.valid_to = NULL", "Exibe a oferta atual daquele sku."],
          ["versoes concorrentes", "mais de uma linha vigente no mesmo sku", "Erro de cadastro."]
        ]
      },
      {
        title: "Origem dos campos do carrinho",
        columns: ["Campo", "Fonte", "Regra"],
        rows: [
          ["company_id", "empresa do checkout", "Identifica o tenant."],
          ["bundle_version_id", "bundle.code resolvido", "Versao do bundle que originou o carrinho."],
          ["business_unit_id", "header do cart ou linha do item", "Resumo do checkout ou snapshot da linha."],
          ["buyer_reference", "sessao, token ou customer futuro", "Identifica o dono do checkout."],
          ["subtotal_amount", "soma de cart_item.total_price", "Resumo dos itens."],
          ["discount_amount", "cupom ou campanha futura", "Zero na v1."],
          ["total_amount", "subtotal_amount - discount_amount", "Total cobrado."]
        ]
      }
    ],
    diagram: `flowchart LR
  COMPANY[company] --> SKU[sku]
  SKU --> PRODUCT[product]
  PRODUCT --> VERSION[product_version vigente]
  VERSION --> ITEM[cart_item snapshot]
  ITEM --> CART[cart totals]`,
    contentBlocks: [
      {
        title: "Ofertas",
        copy: `A oferta parte da versao de origem do produto. Se o comprador aceita, o checkout grava \`cart_offer\` e cria o addon; quando ha cortesia configurada, um segundo \`cart_item\` gratuito entra no carrinho.`,
        tables: [
          {
            title: "Cenarios",
            columns: ["Cenario", "Leitura", "Snapshot"],
            rows: [
              ["Upsell", "Mesma linha, prazo maior.", "12 meses -> 24 meses."],
              ["Cross sell", "Produto de outra BU.", "Produto A oferece Produto B."],
              ["Cortesia", "Add-on escolhido gera brinde.", "Addon selecionado -> produto gratis."]
            ]
          },
          {
            title: "Estado da oferta",
            columns: ["Estado", "Leitura", "Efeito"],
            rows: [
              ["OFFERED", "Oferta exibida ao comprador.", "Aguardando decisao."],
              ["SELECTED", "Oferta aceita.", "cart_item do addon e da cortesia ficam vinculados."],
              ["DECLINED", "Oferta recusada.", "Nenhum item adicional e criado."],
              ["EXPIRED", "Prazo da oferta encerrou.", "Oferta nao pode mais ser selecionada."]
            ]
          },
          {
            title: "Selecao no carrinho",
            columns: ["Campo", "Regra", "Uso"],
            rows: [
              ["cart_id", "Obrigatorio.", "Carrinho onde a oferta foi apresentada."],
              ["checkout_offer_id", "Obrigatorio.", "Oferta configurada usada no checkout."],
              ["source_cart_item_id", "Obrigatorio.", "Item base que disparou a oferta."],
              ["selected_cart_item_id", "Opcional.", "Item addon criado quando a oferta e aceita."],
              ["courtesy_cart_item_id", "Opcional.", "Item gratuito criado quando a oferta tem cortesia."]
            ]
          }
        ],
        diagram: `sequenceDiagram
  participant U as Usuario
  participant C as cart
  participant O as checkout_offer
  participant R as cart_offer
  participant I as cart_item

  U->>C: abre checkout
  C->>O: carrega ofertas ativas
  U->>R: seleciona addon
  R->>I: cria cart_item addon
  R->>I: cria cart_item cortesia
  R->>C: atualiza totais`
      },
      {
        title: "Fluxo do checkout",
        copy: `O carrinho abre no contexto da empresa. Se houver BU, o carrinho carrega esse recorte. Depois da selecao do meio de pagamento, a tentativa entra em \`PENDING\`. Se a resposta vier com sucesso, o carrinho fecha em \`COMPLETED\`. Se falhar, o checkout continua aberto para nova tentativa.`,
        tables: [
          {
            title: "Passos do checkout",
            columns: ["Passo", "cart", "cart_item", "cart_payment", "Leitura"],
            rows: [
              ["Abertura", "DRAFT", "Snapshot carregado", "-", "Carrinho reaberto com a versao salva."],
              ["Item definido", "DRAFT", "Snapshot congelado", "-", "Produto resolvido por sku dentro da empresa."],
              ["Meio escolhido", "CHECKOUT", "Sem alteracao", "PENDING", "Tentativa criada no contexto da empresa."],
              ["Resposta positiva", "COMPLETED", "Sem alteracao", "APPROVED", "Compra concluida."],
              ["Resposta negativa", "CHECKOUT", "Sem alteracao", "FAILED", "Nova tentativa permitida."]
            ]
          }
        ],
        diagram: `sequenceDiagram
  participant U as Usuario
  participant C as cart
  participant I as cart_item
  participant P as cart_payment
  participant G as Gateway

  U->>C: abre carrinho
  C-->>U: cart DRAFT + item salvo
  U->>C: escolhe meio de pagamento
  C->>P: cria cart_payment PENDING
  G-->>P: APPROVED ou FAILED
  P->>C: atualiza status do checkout`
      },
      {
        title: "Venda mista",
        copy: `Um carrinho pode misturar produtos de BUs diferentes. O cabecalho continua ligado a empresa e ao segmento comercial; a BU do cabecalho vira nula quando ha mais de uma BU. Cada item grava a sua propria BU. Na v1, bundle e uma composicao predefinida que materializa varios itens no mesmo carrinho.`,
        tables: [
          {
            title: "Exemplo de linhas",
            columns: ["Tabela", "Dados", "Leitura"],
            rows: [
              ["cart", "company_id=1 | business_unit_id=NULL | commercial_segment=B2C", "Carrinho com mais de uma BU."],
              ["cart_item 1", "product_version_id=10 | business_unit_id=EDU | quantity=1", "Linha do produto da BU EDU."],
              ["cart_item 2", "product_version_id=21 | business_unit_id=EVENTOS | quantity=2", "Linha do produto da BU EVENTOS."]
            ]
          },
          {
            title: "Regra",
            columns: ["Cenario", "Leitura", "Uso"],
            rows: [
              ["Uma BU", "cart.business_unit_id preenchido", "Checkout simples."],
              ["Multiplas BUs", "cart.business_unit_id = NULL", "Venda mista."],
              ["Bundle", "multiple cart_item rows", "Sem tabela extra na v1."]
            ]
          }
        ],
        diagram: `flowchart LR
  CART[cart] --> ITEM1[cart_item EDU]
  CART --> ITEM2[cart_item EVENTOS]
  CART --> PAYMENT[cart_payment]
  ITEM1 --> TOTAL[cart totals]
  ITEM2 --> TOTAL`
      },
      {
        title: "Fluxo do pagamento",
        copy: `Cartao costuma aprovar ou recusar na hora. Pix, NuPay e PayPal podem responder depois; enquanto isso, a tentativa continua em \`PENDING\`. A lista de meios segue as regras da empresa e pode ser restrita por BU, segmento ou produto. Quando o carrinho mistura BUs, a regra de BU vale so para o caso em que a venda esteja fechada em uma unica BU; no restante, a resolucao segue produto, segmento ou global.`,
        tables: [
          {
            title: "Estados da tentativa",
            columns: ["Estado", "Leitura", "Efeito"],
            rows: [
              ["PENDING", "Aguardando resposta", "Checkout segue aberto."],
              ["APPROVED", "Pagamento aceito", "cart.status = COMPLETED."],
              ["FAILED", "Pagamento recusado", "Nova tentativa pode ser criada."]
            ]
          },
          {
            title: "Cenarios por meio",
            columns: ["Meio", "Tempo", "Estado inicial", "Estado final"],
            rows: [
              ["CARD", "Sincrono", "PENDING", "APPROVED ou FAILED"],
              ["PIX", "Assincrono", "PENDING", "APPROVED ou FAILED"],
              ["NUPAY", "Assincrono", "PENDING", "APPROVED ou FAILED"],
              ["PAYPAL", "Assincrono", "PENDING", "APPROVED ou FAILED"]
            ]
          },
          {
            title: "Exemplos de retorno do gateway",
            columns: ["Cenario", "provider_reference", "authorization_code", "failure_code", "failure_message", "status"],
            rows: [
              ["APPROVED / CARD", "pi_3QxjD9xQ9M7A1B2C3D4", "832741", "NULL", "NULL", "APPROVED"],
              ["FAILED / CARD", "pi_3QxjD9xQ9M7A1B2C3D4", "NULL", "card_declined", "The card was declined.", "FAILED"],
              ["APPROVED / PIX", "E2E123456789012345678901234567890", "NULL", "NULL", "NULL", "APPROVED"],
              ["FAILED / PIX", "E2E123456789012345678901234567890", "NULL", "expired", "Payment QR code expired.", "FAILED"]
            ]
          }
        ],
        diagram: `stateDiagram-v2
  [*] --> PENDING
  PENDING --> APPROVED: aprovacao
  PENDING --> FAILED: recusa
  APPROVED --> [*]
  FAILED --> [*]`
      },
      {
        title: "Resolucao dos meios de pagamento",
        copy: `A lista de meios parte da empresa do carrinho. Regras por produto e por BU entram como excecao. Em venda mista, a BU do cabecalho fica nula; a regra de BU so vale quando a compra fecha em uma unica BU. A resolucao nao mescla niveis: o primeiro scope com regras ativas vence. Dentro do mesmo scope, \`priority\` ordena do menor para o maior.`,
        tables: [
          {
            title: "Precedencia",
            columns: ["Chave", "Leitura", "Uso"],
            rows: [
              ["scope", "PRODUCT > BUSINESS_UNIT > SEGMENT > GLOBAL", "Primeiro nivel com regras ativas vence."],
              ["priority", "menor valor primeiro", "Ordena os meios dentro do mesmo nivel."]
            ]
          },
          {
            title: "Exemplos de prioridade",
            columns: ["Cenario", "Regras que batem", "Ordem final"],
            rows: [
              ["B2B na empresa A", "SEGMENT:B2B com CARD(10)", "CARD"],
              ["B2C na empresa A", "SEGMENT:B2C com PIX(10), NUPAY(20), CARD(30), PAYPAL(40)", "PIX, NUPAY, CARD, PAYPAL"],
              ["BU EDU na empresa A", "BUSINESS_UNIT:EDU com PIX(5), CARD(10)", "PIX, CARD"],
              ["PRODUCT_I em B2C", "PRODUCT: PRODUCT_I com PIX(1), CARD(2)", "PIX, CARD"],
              ["Fallback global", "GLOBAL com CARD(100)", "CARD"]
            ]
          }
        ],
        diagram: `flowchart LR
  COMPANY[company] --> CART[cart.commercial_segment]
  CART --> RULE[payment_method_rule]
  PRODUCT[product opcional] --> RULE
  RULE --> METHOD[payment_method]`,
        sql: `INSERT INTO company (id, code, name, status, created_at, updated_at)
VALUES
  (1, 'GROUP_A', 'Grupo A', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO business_unit (id, company_id, code, name, status, created_at, updated_at)
VALUES
  (1, 1, 'EDU', 'Educacao', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO payment_method (id, company_id, code, name, provider, active, created_at, updated_at)
VALUES
  (1, 1, 'PIX', 'Pix', 'BRADESCO', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 'CARD', 'Cartao de credito', 'STRIPE', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, 'PAYPAL', 'PayPal', 'PAYPAL', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 1, 'NUPAY', 'NuPay', 'NUBANK', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO payment_method_rule (id, company_id, scope, product_id, business_unit_id, commercial_segment, payment_method_id, priority, active, valid_from, valid_to, created_at, updated_at)
VALUES
  (1, 1, 'GLOBAL', NULL, NULL, NULL, 2, 100, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 'SEGMENT', NULL, NULL, 'B2B', 2, 10, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, 'SEGMENT', NULL, NULL, 'B2C', 1, 10, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 1, 'SEGMENT', NULL, NULL, 'B2C', 4, 20, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 1, 'SEGMENT', NULL, NULL, 'B2C', 2, 30, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 1, 'SEGMENT', NULL, NULL, 'B2C', 3, 40, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, 1, 'BUSINESS_UNIT', NULL, 1, NULL, 1, 5, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, 1, 'BUSINESS_UNIT', NULL, 1, NULL, 2, 10, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (9, 1, 'PRODUCT', 1, NULL, NULL, 1, 1, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (10, 1, 'PRODUCT', 1, NULL, NULL, 2, 2, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
      }
    ]
  },
  {
    label: "Evolucao",
    title: "06. Evolucao",
    copy: `- \`customer\`
- \`coupon\`
- \`refund\`
- \`chargeback\`
- \`reconciliation\`

- comecar simples
- evoluir em passos pequenos
- atualizar wiki e schema juntos
- evitar tabela sem necessidade
- revisar \`AGENTS.md\` quando a regra mudar`,
    diagram: `flowchart LR
  V1[Produto + Versao comercial + Carrinho + Pagamento] --> V2[Cliente + Cupom]
  V2 --> V3[Estorno + Chargeback]
  V3 --> V4[Conciliacao]`
  }
];

const pageSections = {
  overview: sections.filter((section) => !section.page),
  regras: sections.filter((section) => section.page === "regras")
};

const entityAttributes = {
  COMPANY: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "code", type: "Varchar", description: "Codigo publico da empresa." },
    { name: "name", type: "Varchar", description: "Nome da empresa." },
    { name: "status", type: "Varchar", description: "Disponibilidade da empresa.", values: "ACTIVE | INACTIVE" },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  BUSINESS_UNIT: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "company_id", type: "Integer", description: "Empresa dona da unidade de negocio." },
    { name: "code", type: "Varchar", description: "Codigo da unidade dentro da empresa." },
    { name: "name", type: "Varchar", description: "Nome da unidade de negocio." },
    { name: "status", type: "Varchar", description: "Disponibilidade da unidade.", values: "ACTIVE | INACTIVE" },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  BUNDLE: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "company_id", type: "Integer", description: "Empresa dona do bundle." },
    { name: "business_unit_id", type: "Integer", description: "Unidade de negocio do bundle, quando houver uma unica BU." },
    { name: "code", type: "Varchar", description: "Codigo publico do bundle dentro da empresa." },
    { name: "name", type: "Varchar", description: "Nome comercial do bundle." },
    { name: "status", type: "Varchar", description: "Disponibilidade do bundle.", values: "ACTIVE | INACTIVE" },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  BUNDLE_VERSION: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "bundle_id", type: "Integer", description: "Bundle pai." },
    { name: "version_number", type: "Integer", description: "Numero sequencial da versao." },
    { name: "valid_from", type: "Timestamp", description: "Inicio da vigencia da versao." },
    { name: "valid_to", type: "Timestamp", description: "Fim da vigencia da versao. Null enquanto a versao estiver ativa." },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  BUNDLE_ITEM: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "bundle_version_id", type: "Integer", description: "Versao do bundle pai." },
    { name: "product_version_id", type: "Integer", description: "Versao comercial que entra no bundle." },
    { name: "quantity", type: "Integer", description: "Quantidade do item no bundle." },
    { name: "sort_order", type: "Integer", description: "Ordem de exibicao do item." },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  CHECKOUT_OFFER: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "company_id", type: "Integer", description: "Empresa dona da oferta." },
    { name: "source_product_version_id", type: "Integer", description: "Versao que dispara a oferta." },
    { name: "offered_product_version_id", type: "Integer", description: "Versao sugerida como addon." },
    { name: "courtesy_product_version_id", type: "Integer", description: "Versao gratuita, quando houver cortesia." },
    { name: "priority", type: "Integer", description: "Ordem de exibicao da oferta." },
    { name: "active", type: "Boolean", description: "Indica se a oferta esta habilitada." },
    { name: "valid_from", type: "Timestamp", description: "Inicio da vigencia da oferta." },
    { name: "valid_to", type: "Timestamp", description: "Fim da vigencia da oferta. Null enquanto a oferta estiver ativa." },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  PRODUCT: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "company_id", type: "Integer", description: "Empresa dona do produto." },
    { name: "business_unit_id", type: "Integer", description: "Unidade de negocio do produto." },
    { name: "sku", type: "Varchar", description: "SKU unico do produto dentro da empresa." },
    { name: "name", type: "Varchar", description: "Nome comercial." },
    { name: "description", type: "Varchar", description: "Descricao opcional." },
    { name: "status", type: "Varchar", description: "Disponibilidade do produto.", values: "ACTIVE | INACTIVE" },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  PRODUCT_VERSION: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "product_id", type: "Integer", description: "Produto pai." },
    { name: "access_months", type: "Integer", description: "Periodo base da oferta." },
    { name: "bonus_months", type: "Integer", description: "Meses extras da oferta." },
    { name: "price_amount", type: "Decimal(12,2)", description: "Preco da versao comercial." },
    { name: "currency", type: "Char(3)", description: "Moeda da oferta.", values: "BRL" },
    { name: "valid_from", type: "Timestamp", description: "Inicio da vigencia comercial." },
    { name: "valid_to", type: "Timestamp", description: "Fim da vigencia comercial. Null enquanto a versao estiver ativa." },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  CART: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "company_id", type: "Integer", description: "Empresa dona do carrinho." },
    { name: "bundle_version_id", type: "Integer", description: "Versao do bundle de origem, quando houver." },
    { name: "business_unit_id", type: "Integer", description: "Unidade de negocio do carrinho quando ele fica em uma unica BU; nulo em venda mista." },
    { name: "buyer_reference", type: "Varchar", description: "Referencia do comprador." },
    { name: "commercial_segment", type: "Varchar", description: "Segmento comercial da venda.", values: "B2C | B2B | B2B2C" },
    { name: "status", type: "Varchar", description: "Estado do checkout.", values: "DRAFT | CHECKOUT | COMPLETED | CANCELED | EXPIRED" },
    { name: "currency", type: "Char(3)", description: "Moeda do carrinho.", values: "BRL" },
    { name: "subtotal_amount", type: "Decimal(12,2)", description: "Subtotal antes de descontos." },
    { name: "discount_amount", type: "Decimal(12,2)", description: "Valor de desconto aplicado." },
    { name: "total_amount", type: "Decimal(12,2)", description: "Total final do carrinho." },
    { name: "expires_at", type: "Timestamp", description: "Momento de expiracao do carrinho." },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  CART_ITEM: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "cart_id", type: "Integer", description: "Carrinho pai." },
    { name: "product_version_id", type: "Integer", description: "Versao comercial referenciada." },
    { name: "business_unit_id", type: "Integer", description: "BU congelada da linha." },
    { name: "quantity", type: "Integer", description: "Quantidade do item." },
    { name: "unit_price", type: "Decimal(12,2)", description: "Preco unitario no fechamento." },
    { name: "total_price", type: "Decimal(12,2)", description: "Total do item." },
    { name: "access_months", type: "Integer", description: "Periodo base congelado." },
    { name: "bonus_months", type: "Integer", description: "Bonus congelado." },
    { name: "total_access_months", type: "Integer", description: "Prazo final entregue." },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  CART_OFFER: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "cart_id", type: "Integer", description: "Carrinho da oferta." },
    { name: "checkout_offer_id", type: "Integer", description: "Oferta configurada usada no checkout." },
    { name: "source_cart_item_id", type: "Integer", description: "Item base que disparou a oferta." },
    { name: "status", type: "Varchar", description: "Estado da selecao da oferta.", values: "OFFERED | SELECTED | DECLINED | EXPIRED" },
    { name: "selected_cart_item_id", type: "Integer", description: "Item addon criado quando a oferta e aceita." },
    { name: "courtesy_cart_item_id", type: "Integer", description: "Item gratuito criado quando a oferta inclui cortesia." },
    { name: "selected_at", type: "Timestamp", description: "Timestamp da aceitacao da oferta." },
    { name: "declined_at", type: "Timestamp", description: "Timestamp da recusa da oferta." },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  PAYMENT_METHOD: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "company_id", type: "Integer", description: "Empresa dona do meio." },
    { name: "code", type: "Varchar", description: "Codigo do meio de pagamento dentro da empresa.", values: "PIX | CARD | PAYPAL | NUPAY" },
    { name: "name", type: "Varchar", description: "Nome exibido." },
    { name: "provider", type: "Varchar", description: "Gateway ou adquirente." },
    { name: "active", type: "Boolean", description: "Indica se o meio esta habilitado." },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  PAYMENT_METHOD_RULE: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "company_id", type: "Integer", description: "Empresa dona da regra." },
    { name: "scope", type: "Varchar", description: "Nivel da regra.", values: "GLOBAL | SEGMENT | BUSINESS_UNIT | PRODUCT" },
    { name: "product_id", type: "Integer", description: "Produto da excecao, quando houver." },
    { name: "business_unit_id", type: "Integer", description: "Unidade de negocio da regra, quando houver." },
    { name: "commercial_segment", type: "Varchar", description: "Segmento da regra, quando houver.", values: "B2C | B2B | B2B2C" },
    { name: "payment_method_id", type: "Integer", description: "Meio liberado pela regra." },
    { name: "priority", type: "Integer", description: "Ordem de precedencia da regra." },
    { name: "active", type: "Boolean", description: "Indica se a regra esta habilitada." },
    { name: "valid_from", type: "Timestamp", description: "Inicio da vigencia da regra." },
    { name: "valid_to", type: "Timestamp", description: "Fim da vigencia da regra." },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  CART_PAYMENT: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "cart_id", type: "Integer", description: "Carrinho da tentativa." },
    { name: "payment_method_id", type: "Integer", description: "Meio de pagamento usado." },
    { name: "amount", type: "Decimal(12,2)", description: "Valor da transacao." },
    { name: "status", type: "Varchar", description: "Estado da tentativa.", values: "PENDING | APPROVED | FAILED" },
    { name: "provider_reference", type: "Varchar", description: "Referencia externa da tentativa no provedor." },
    { name: "authorization_code", type: "Varchar", description: "Codigo de aprovacao ou autorizacao retornado pelo provedor." },
    { name: "failure_code", type: "Varchar", description: "Codigo da recusa retornado pelo provedor." },
    { name: "failure_message", type: "Varchar", description: "Mensagem ou descricao da recusa retornada pelo provedor." },
    { name: "approved_at", type: "Timestamp", description: "Timestamp da conclusao com sucesso." },
    { name: "failed_at", type: "Timestamp", description: "Timestamp da conclusao com falha." },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ]
};

const compactEntityKey = (value = "") => value.toUpperCase().replace(/[^A-Z0-9]/g, "");

const entityKeyLookup = Object.keys(entityAttributes)
  .map((key) => ({ key, compact: compactEntityKey(key) }))
  .sort((left, right) => right.compact.length - left.compact.length);

const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderMarkdown = (content = "") => (window.marked ? window.marked.parse(content.trim()) : "");

const slugify = (value = "") =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const assignSectionIds = (items, parentId = "") =>
  items.map((section) => {
    const id = parentId ? `${parentId}-${slugify(section.title)}` : slugify(section.title);
    const subsections = section.subsections ? assignSectionIds(section.subsections, id) : [];
    return { ...section, id, subsections };
  });

const renderTables = (tables = [], spacingClass = "mt-6") =>
  tables
    .map(
      (table) => `
        <div class="data-table-block ${spacingClass}">
          <h3 class="data-table-title">${escapeHtml(table.title)}</h3>
          <div class="data-table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  ${table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${table.rows
                  .map(
                    (row) => `
                      <tr>
                        ${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}
                      </tr>
                    `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      `
    )
    .join("");

const renderContentBlock = (block, { spacingClass = "mt-6" } = {}) => `
  <div class="doc-flow-block ${spacingClass}">
    ${block.label ? `<p class="doc-flow-label">${escapeHtml(block.label)}</p>` : ""}
    ${block.title ? `<h3 class="doc-flow-title">${escapeHtml(block.title)}</h3>` : ""}
    ${block.copy ? `<div class="markdown-view mt-4">${renderMarkdown(block.copy)}</div>` : ""}
    ${block.tables ? renderTables(block.tables, "mt-4") : ""}
    ${block.diagram
      ? `
        <div class="diagram-wrap mt-6">
          <p class="diagram-hint">Passe o mouse sobre uma entidade para ver os campos e descricoes.</p>
          <pre class="mermaid">${escapeHtml(block.diagram)}</pre>
        </div>
      `
      : ""}
    ${block.sql
      ? `
        <details class="sql-example mt-6">
          <summary>Exemplo SQL</summary>
          <pre><code class="language-sql">${escapeHtml(block.sql)}</code></pre>
        </details>
      `
      : ""}
  </div>
`;

const renderBlock = (block, { subsection = false } = {}) => {
  const tag = subsection ? "article" : "section";
  const blockClass = subsection ? "doc-subsection" : "doc-section";
  const labelClass = subsection ? "doc-subsection-label" : "doc-label";
  const titleClass = subsection ? "doc-subsection-title" : "doc-title";
  const titleTag = subsection ? "h3" : "h2";
  const copySpacing = subsection ? "mt-4" : "mt-6";
  const tableSpacing = subsection ? "mt-4" : "mt-6";

  return `
    <${tag} class="${blockClass}" id="${block.id}">
      ${block.label ? `<p class="${labelClass}">${escapeHtml(block.label)}</p>` : ""}
      ${block.title ? `<${titleTag} class="${titleClass}">${escapeHtml(block.title)}</${titleTag}>` : ""}
      ${block.copy ? `<div class="markdown-view ${copySpacing}">${renderMarkdown(block.copy)}</div>` : ""}
      ${block.tables ? renderTables(block.tables, tableSpacing) : ""}
      ${block.diagram
        ? `
          <div class="diagram-wrap ${subsection ? "mt-6" : "mt-8"}">
            <p class="diagram-hint">Passe o mouse sobre uma entidade para ver os campos e descricoes.</p>
            <pre class="mermaid">${escapeHtml(block.diagram)}</pre>
          </div>
        `
        : ""}
      ${block.sql
        ? `
          <details class="sql-example ${subsection ? "mt-6" : "mt-8"}">
            <summary>Exemplo SQL</summary>
            <pre><code class="language-sql">${escapeHtml(block.sql)}</code></pre>
          </details>
        `
        : ""}
      ${block.contentBlocks && block.contentBlocks.length ? `<div class="doc-flow-blocks">${block.contentBlocks.map((contentBlock) => renderContentBlock(contentBlock)).join("")}</div>` : ""}
      ${block.subsections && block.subsections.length ? `<div class="doc-subsections">${block.subsections.map((subsectionBlock) => renderBlock(subsectionBlock, { subsection: true })).join("")}</div>` : ""}
    </${tag}>
  `;
};

const renderSidebar = (items) => `
  <nav class="doc-sidebar-card">
    <p class="doc-sidebar-label">Secoes</p>
    <div class="doc-sidebar-links">
      ${items
        .map(
          (section) => `
            <div class="doc-sidebar-group">
              <a class="doc-sidebar-link" href="#${section.id}">${escapeHtml(section.title)}</a>
              ${section.subsections && section.subsections.length
                ? `
                  <div class="doc-sidebar-sublinks">
                    ${section.subsections
                      .map((subsection) => `<a class="doc-sidebar-sublink" href="#${subsection.id}">${escapeHtml(subsection.title)}</a>`)
                      .join("")}
                  </div>
                `
                : ""}
            </div>
          `
        )
        .join("")}
    </div>
  </nav>
`;

const renderSection = (section) => `
  ${renderBlock(section)}
`;

let tooltip;

const extractEntityName = (node) => {
  const candidates = [
    node.getAttribute?.("data-id"),
    node.getAttribute?.("id"),
    node.querySelector?.("span.nodeLabel")?.textContent,
    node.querySelector?.("foreignObject .nodeLabel")?.textContent,
    node.querySelector?.("text")?.textContent,
    node.textContent
  ].filter(Boolean);

  for (const candidate of candidates) {
    const compactCandidate = compactEntityKey(candidate);
    const match = entityKeyLookup.find(({ compact }) => compactCandidate.startsWith(compact));
    if (match) return match.key;
  }

  return null;
};

const showTooltip = (event, entityName) => {
  const attributes = entityAttributes[entityName];
  if (!attributes || !tooltip) return;

  tooltip.querySelector(".entity-tooltip-title").textContent = entityName;
  tooltip.querySelector(".entity-tooltip-body").innerHTML = `
    <table class="entity-tooltip-table">
      <thead>
        <tr>
          <th>Campo</th>
          <th>Tipo</th>
          <th>Descricao</th>
        </tr>
      </thead>
      <tbody>
        ${attributes
          .map((attribute) => {
            const description = attribute.values
              ? `${attribute.description} Valores: ${attribute.values}.`
              : attribute.description;
            return `<tr><td><code>${attribute.name}</code></td><td>${attribute.type}</td><td>${escapeHtml(description)}</td></tr>`;
          })
          .join("")}
      </tbody>
    </table>
  `;

  tooltip.classList.add("visible");
  moveTooltip(event);
};

const hideTooltip = () => {
  tooltip?.classList.remove("visible");
};

const moveTooltip = (event) => {
  if (!tooltip) return;
  const offset = 18;
  const maxLeft = Math.max(16, window.innerWidth - 560);
  const maxTop = Math.max(16, window.innerHeight - 300);
  tooltip.style.left = `${Math.min(event.clientX + offset, maxLeft)}px`;
  tooltip.style.top = `${Math.min(event.clientY + offset, maxTop)}px`;
};

const bindEntityHover = () => {
  document.querySelectorAll(".diagram-wrap").forEach((wrap) => {
    if (wrap.dataset.bound === "true") return;
    const nodes = wrap.querySelectorAll("svg g");

    nodes.forEach((node) => {
      const entityName = extractEntityName(node);
      if (!entityName) return;

      node.classList.add("interactive-entity");
      node.dataset.entityName = entityName;
      node.addEventListener("mouseenter", (event) => showTooltip(event, entityName));
      node.addEventListener("mousemove", moveTooltip);
      node.addEventListener("mouseleave", hideTooltip);
    });

    wrap.addEventListener("mousemove", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        hideTooltip();
        return;
      }

      const node = target.closest("g");
      if (!node || !wrap.contains(node)) {
        hideTooltip();
        return;
      }

      const entityName = node.dataset.entityName || extractEntityName(node);
      if (!entityName || !entityAttributes[entityName]) {
        hideTooltip();
        return;
      }

      showTooltip(event, entityName);
    });

    wrap.addEventListener("mouseleave", hideTooltip);
    wrap.dataset.bound = "true";
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const pageId = document.body.dataset.docPage || "overview";
  const sectionsToRender = pageSections[pageId] || pageSections.overview;
  const sectionsWithIds = assignSectionIds(sectionsToRender);

  const sidebarRoot = document.getElementById("sidebar-root");
  if (sidebarRoot) sidebarRoot.innerHTML = renderSidebar(sectionsWithIds);

  const sectionsRoot = document.getElementById("sections-root");
  if (sectionsRoot) sectionsRoot.innerHTML = sectionsWithIds.map(renderSection).join("");

  if (window.hljs) {
    window.hljs.highlightAll();
  }

  tooltip = document.createElement("div");
  tooltip.className = "entity-tooltip";
  tooltip.innerHTML = '<div class="entity-tooltip-title"></div><div class="entity-tooltip-body"></div>';
  document.body.appendChild(tooltip);

  if (window.mermaid) {
    window.mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "strict",
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      themeVariables: {
        primaryColor: "#ecfeff",
        primaryTextColor: "#0f172a",
        primaryBorderColor: "#0f766e",
        lineColor: "#0f766e",
        secondaryColor: "#fff7ed",
        tertiaryColor: "#f8fafc",
        background: "#ffffff",
        fontSize: "16px"
      }
    });

    try {
      await window.mermaid.run({ querySelector: ".mermaid" });
      bindEntityHover();
    } catch (error) {
      console.warn("Falha ao renderizar diagramas Mermaid:", error);
    }
  }

  window.addEventListener("scroll", hideTooltip, { passive: true });
});
