const sections = [
  {
    label: "Base",
    title: "01. Escopo",
    copy: `- \`product\`: catalogo base.
- \`product_version\`: periodo, preco, bonus e historico comercial do mesmo produto.
- \`cart\`: checkout com status e totais.
- \`cart_item\`: snapshot da versao escolhida.
- \`payment_method\`: meios de pagamento disponiveis.
- \`cart_payment\`: tentativa de pagamento ligada ao carrinho.`,
    diagram: `erDiagram
  PRODUCT ||--o{ PRODUCT_VERSION : "1:N"
  PRODUCT_VERSION ||--o{ CART_ITEM : "1:N"
  CART ||--o{ CART_ITEM : "1:N"
  CART ||--o{ CART_PAYMENT : "1:N"
  PAYMENT_METHOD ||--o{ CART_PAYMENT : "1:N"`
  },
  {
    label: "Produto",
    title: "02. Produto",
    copy: `Produto e o catalogo base. \`sku\` identifica o produto na camada publica. Periodo, preco, bonus e vigencia ficam em \`product_version\`. \`valid_to\` nulo significa versao vigente, nao versao vitalicia. A tela de produto pode listar a versao vigente resolvida por \`sku\`.`,
    tables: [
      {
        title: "Valores controlados",
        columns: ["Campo", "Descricao", "Valores"],
        rows: [
          ["status", "Disponibilidade do produto.", "ACTIVE | INACTIVE"],
          ["currency", "Moeda usada nas versoes comerciais.", "BRL"]
        ]
      },
      {
        title: "Identificacao publica",
        columns: ["Campo", "Regra", "Exemplo"],
        rows: [
          ["sku", "Codigo publico do produto.", "plus"],
          ["sku", "Usado para resolver o produto na camada publica.", "/compra/plus"]
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
        title: "Versao comercial",
        copy: `Cada linha registra uma oferta do mesmo produto. Quando periodo, preco ou bonus mudam, a linha anterior fecha e uma nova linha entra no ar. A versao atual pode ficar com \`valid_to\` nulo ate ser substituida. O \`sku\` resolve o produto, e a camada publica mostra apenas a versao vigente desse \`sku\`.`,
        diagram: `erDiagram
  PRODUCT ||--o{ PRODUCT_VERSION : "1:N"`
      },
      {
        title: "Historico comercial",
        copy: `A nova oferta nao altera o registro anterior. O historico fica na propria tabela de versao. \`valid_to\` nulo identifica a versao ainda vigente. Se existir mais de uma versao vigente para o mesmo \`sku\`, isso e erro de cadastro.`,
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
    sql: `INSERT INTO product (id, sku, name, description, status, created_at, updated_at)
VALUES
  (1, 'CURSO-IA', 'Curso de IA aplicado', 'Produto digital principal', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO product_version (id, product_id, access_months, bonus_months, price_amount, currency, valid_from, valid_to, created_at, updated_at)
VALUES
  (1, 1, 12, 0, 199.90, 'BRL', '2026-01-01', '2026-03-31', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 12, 2, 199.90, 'BRL', '2026-04-01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, 24, 0, 349.90, 'BRL', '2026-01-01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
  },
  {
    label: "Carrinho",
    title: "03. Carrinho",
    copy: `O carrinho guarda o snapshot da versao escolhida. \`access_months\` e \`bonus_months\` repetem os termos da oferta no momento da compra. \`quantity\` indica quantas unidades daquela linha foram compradas. Ao reabrir o carrinho, a interface usa \`cart_item.product_version_id\`, nao \`product_id\`.`,
    tables: [
      {
        title: "Valores controlados",
        columns: ["Campo", "Descricao", "Valores"],
        rows: [
          ["status", "Estado do checkout.", "DRAFT | CHECKOUT | COMPLETED | CANCELED | EXPIRED"],
          ["currency", "Moeda do carrinho.", "BRL"]
        ]
      },
      {
        title: "Snapshot do item",
        columns: ["Campo", "Origem", "Uso"],
        rows: [
          ["product_version_id", "product_version.id", "Referencia da oferta escolhida e versao exibida ao reabrir o carrinho."],
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
        title: "Ciclo do checkout",
        copy: `O usuario abre o carrinho, escolhe a versao comercial e o item grava o snapshot. Depois disso, o registro do produto pode mudar sem afetar o item ja criado.`,
        diagram: `sequenceDiagram
  participant U as Usuario
  participant C as cart
  participant V as product_version
  participant I as cart_item
  participant P as cart_payment

  U->>C: abre carrinho
  C-->>U: cart DRAFT
  U->>V: escolhe versao
  C->>I: grava snapshot da versao
  C->>C: status CHECKOUT
  U->>P: avanca para pagamento
  C->>P: cria cart_payment PENDING`
      },
      {
        title: "Exemplo da compra",
        copy: `A oferta ativa de 12 meses com 2 meses de bonus entra no carrinho como 14 meses de acesso. O preco do item fica congelado no fechamento.`,
        tables: [
          {
            title: "Snapshot do exemplo",
            columns: ["Tabela", "Dados", "Leitura"],
            rows: [
              ["product_version", "id=2 | access_months=12 | bonus_months=2 | price_amount=199.90", "Oferta usada no fechamento."],
              ["cart_item", "product_version_id=2 | quantity=1 | access_months=12 | bonus_months=2 | total_access_months=14 | unit_price=199.90", "Snapshot do carrinho."],
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
    sql: `INSERT INTO cart (id, buyer_reference, status, currency, subtotal_amount, discount_amount, total_amount, expires_at, created_at, updated_at)
VALUES
  (1, 'BUYER-1001', 'DRAFT', 'BRL', 199.90, 0.00, 199.90, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cart_item (id, cart_id, product_version_id, quantity, unit_price, total_price, access_months, bonus_months, total_access_months, created_at, updated_at)
VALUES
  (1, 1, 2, 1, 199.90, 199.90, 12, 2, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
  },
  {
    label: "Pagamento",
    title: "04. Pagamento",
    copy: `A tentativa entra em PENDING. Cartao aprova ou recusa na hora. PIX, NuPay e PayPal podem confirmar depois; enquanto isso, a linha permanece em PENDING.`,
    tables: [
      {
        title: "Valores controlados",
        columns: ["Campo", "Descricao", "Valores"],
        rows: [
          ["status", "Estado da tentativa.", "PENDING | APPROVED | FAILED"],
          ["payment_method.code", "Codigo do meio de pagamento.", "PIX | CARD | PAYPAL | NUPAY"]
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
    sql: `INSERT INTO payment_method (id, code, name, provider, active, created_at, updated_at)
VALUES
  (1, 'PIX', 'Pix', 'BRADESCO', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'CARD', 'Cartao de credito', 'STRIPE', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'PAYPAL', 'PayPal', 'PAYPAL', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 'NUPAY', 'NuPay', 'NUBANK', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cart_payment (id, cart_id, payment_method_id, amount, status, provider_reference, authorization_code, failure_code, failure_message, approved_at, failed_at, created_at, updated_at)
VALUES
  (1, 1, 2, 199.90, 'PENDING', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
  },
  {
    page: "regras",
    title: "Regras",
    copy: `Resolucao publica do catalogo e do checkout. A pagina publica resolve o produto por \`sku\`; o carrinho mostra o snapshot salvo em \`cart_item.product_version_id\`.`,
    tables: [
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
          ["buyer_reference", "sessao, token ou customer futuro", "Identifica o dono do checkout."],
          ["subtotal_amount", "soma de cart_item.total_price", "Resumo dos itens."],
          ["discount_amount", "cupom ou campanha futura", "Zero na v1."],
          ["total_amount", "subtotal_amount - discount_amount", "Total cobrado."]
        ]
      }
    ],
    diagram: `flowchart LR
  SKU[sku] --> PRODUCT[product]
  PRODUCT --> VERSION[product_version vigente]
  VERSION --> ITEM[cart_item snapshot]
  ITEM --> CART[cart totals]`,
    contentBlocks: [
      {
        title: "Fluxo do checkout",
        copy: `O carrinho abre com um snapshot do item. Depois da selecao do meio de pagamento, a tentativa entra em \`PENDING\`. Se a resposta vier com sucesso, o carrinho fecha em \`COMPLETED\`. Se falhar, o checkout continua aberto para nova tentativa.`,
        tables: [
          {
            title: "Passos do checkout",
            columns: ["Passo", "cart", "cart_item", "cart_payment", "Leitura"],
            rows: [
              ["Abertura", "DRAFT", "Snapshot carregado", "-", "Carrinho reaberto com a versao salva."],
              ["Item definido", "DRAFT", "Snapshot congelado", "-", "Produto resolvido por sku."],
              ["Meio escolhido", "CHECKOUT", "Sem alteracao", "PENDING", "Tentativa criada."],
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
        title: "Fluxo do pagamento",
        copy: `Cartao costuma aprovar ou recusar na hora. Pix, NuPay e PayPal podem responder depois; enquanto isso, a tentativa continua em \`PENDING\`.`,
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
          }
        ],
        diagram: `stateDiagram-v2
  [*] --> PENDING
  PENDING --> APPROVED: aprovacao
  PENDING --> FAILED: recusa
  APPROVED --> [*]
  FAILED --> [*]`
      }
    ]
  },
  {
    label: "Evolucao",
    title: "05. Evolucao",
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
  PRODUCT: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "sku", type: "Varchar", description: "SKU unico do produto." },
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
    { name: "buyer_reference", type: "Varchar", description: "Referencia do comprador." },
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
    { name: "quantity", type: "Integer", description: "Quantidade do item." },
    { name: "unit_price", type: "Decimal(12,2)", description: "Preco unitario no fechamento." },
    { name: "total_price", type: "Decimal(12,2)", description: "Total do item." },
    { name: "access_months", type: "Integer", description: "Periodo base congelado." },
    { name: "bonus_months", type: "Integer", description: "Bonus congelado." },
    { name: "total_access_months", type: "Integer", description: "Prazo final entregue." },
    { name: "created_at", type: "Timestamp", description: "Data de criacao." },
    { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
  ],
  PAYMENT_METHOD: [
    { name: "id", type: "Integer", description: "Identificador da linha." },
    { name: "code", type: "Varchar", description: "Codigo do meio de pagamento.", values: "PIX | CARD | PAYPAL | NUPAY" },
    { name: "name", type: "Varchar", description: "Nome exibido." },
    { name: "provider", type: "Varchar", description: "Gateway ou adquirente." },
    { name: "active", type: "Boolean", description: "Indica se o meio esta habilitado." },
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
