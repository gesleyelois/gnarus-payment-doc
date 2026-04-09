const sections = [
  {
    label: "Visao Geral",
    title: "01. Modelo minimo do sistema",
    copy: `Esta primeira versao da wiki documenta apenas o necessario para vender, montar o checkout e registrar o pagamento.

### O que existe na v1

- \`product\`: catalogo vendavel.
- \`cart\`: checkout com totais e status.
- \`cart_item\`: itens do carrinho com fotografia de preco.
- \`payment_method\`: catalogo de meios de pagamento.
- \`cart_payment\`: registro do pagamento do carrinho.

### Regra de evolucao

A proxima camada so entra quando existir uma necessidade real de negocio. O objetivo e evitar supermodelagem no comeco e manter a narrativa simples.`,
    diagram: `erDiagram
  PRODUCT ||--o{ CART_ITEM : "1:N"
  CART ||--o{ CART_ITEM : "1:N"
  CART ||--o{ CART_PAYMENT : "1:N"
  PAYMENT_METHOD ||--o{ CART_PAYMENT : "1:N"`,
  },
  {
    label: "Produto",
    title: "02. Catalogo e preco base",
    copy: `Produto e a menor unidade vendavel do sistema. Na primeira entrega ele precisa apenas de identificacao, nome, preco, moeda e status.

O preco do produto e a fotografia atual do catalogo. Quando o item entra no carrinho, esse valor e copiado para preservar o historico da compra.

### O que fica fora desta versao

- cliente normalizado
- variacoes de produto
- bundle
- recorrencia
- cupom`,
    diagram: `erDiagram
  PRODUCT {
    INTEGER id
    VARCHAR sku
    VARCHAR name
    DECIMAL price
  }`,
    sql: `INSERT INTO product (id, sku, name, description, price, currency, status, created_at, updated_at)
VALUES
  (1, 'CURSO-IA', 'Curso de IA aplicado', 'Produto digital principal', 199.90, 'BRL', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'MENTORIA-PLUS', 'Mentoria Plus', 'Oferta premium com acompanhamento', 499.90, 'BRL', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
  },
  {
    label: "Checkout",
    title: "03. Carrinho como fotografia da compra",
    copy: `Carrinho representa a intencao de compra e organiza o fechamento da venda.

Ele guarda o comprador de referencia, o status da jornada e os totais calculados a partir dos itens.

### Regras principais

- o carrinho guarda o subtotal, o desconto e o total final
- \`cart_item\` registra o valor unitario no momento do checkout
- o preco do item no carrinho nao deve mudar retroativamente quando o catalogo mudar
- a primeira modelagem trata o checkout como simples e reprodutivel`,
    diagram: `erDiagram
  CART ||--o{ CART_ITEM : "1:N"
  PRODUCT ||--o{ CART_ITEM : "1:N"`,
    sql: `INSERT INTO cart (id, buyer_reference, status, currency, subtotal_amount, discount_amount, total_amount, expires_at, created_at, updated_at)
VALUES
  (1, 'BUYER-1001', 'DRAFT', 'BRL', 199.90, 0.00, 199.90, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cart_item (id, cart_id, product_id, quantity, unit_price, total_price, created_at, updated_at)
VALUES
  (1, 1, 1, 1, 199.90, 199.90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
  },
  {
    label: "Pagamento",
    title: "04. Meios e registro de pagamento",
    copy: `Pagamento registra a forma escolhida e o resultado da transacao.

O primeiro modelo considera um registro por carrinho, suficiente para ler o fluxo inicial sem antecipar orquestracao de multiplas tentativas.

### Estados esperados

- \`PENDING\`
- \`AUTHORIZED\`
- \`CAPTURED\`
- \`FAILED\`
- \`CANCELED\``,
    diagram: `erDiagram
  PAYMENT_METHOD ||--o{ CART_PAYMENT : "1:N"
  CART ||--o{ CART_PAYMENT : "1:N"`,
    sql: `INSERT INTO payment_method (id, code, name, provider, active, created_at, updated_at)
VALUES
  (1, 'PIX', 'Pix', 'BRADESCO', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'CARD', 'Cartao de credito', 'STRIPE', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cart_payment (id, cart_id, payment_method_id, amount, status, provider_reference, authorization_code, failure_reason, authorized_at, captured_at, failed_at, created_at, updated_at)
VALUES
  (1, 1, 1, 199.90, 'AUTHORIZED', 'tx_98231', 'AUTH-4458', NULL, CURRENT_TIMESTAMP, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
  },
  {
    label: "Evolucao",
    title: "05. Evolucao incremental e regras dos agentes",
    copy: `A evolucao deve acontecer em pequenos passos e sempre com um motivo de negocio claro.

### Proximas extensoes possiveis

- \`customer\`: identidade do comprador.
- \`coupon\`: desconto e promocao.
- \`payment_attempt\`: tentativas por gateway.
- \`refund\` e \`chargeback\`: tratamento de retorno financeiro.
- \`reconciliation\`: conferencia entre sistema e adquirente.

### Regras permanentes do projeto

- comecar simples
- evoluir de forma incremental
- atualizar wiki e schema juntos
- nao adicionar tabela apenas porque ela pode ser util no futuro
- quando a regra de negocio mudar, revisar \`AGENTS.md\``,
    diagram: `flowchart LR
  V1[Produto + Carrinho + Pagamento] --> V2[Cliente + Cupom]
  V2 --> V3[Tentativas + Webhooks]
  V3 --> V4[Estorno + Chargeback + Conciliacao]`
  }
];

const entityAttributes = {
  PRODUCT: [
    "id: Integer",
    "sku: Varchar",
    "name: Varchar",
    "description: Varchar",
    "price: Decimal(12,2)",
    "currency: Char(3)",
    "status: Varchar",
    "created_at: Timestamp",
    "updated_at: Timestamp"
  ],
  CART: [
    "id: Integer",
    "buyer_reference: Varchar",
    "status: Varchar",
    "currency: Char(3)",
    "subtotal_amount: Decimal(12,2)",
    "discount_amount: Decimal(12,2)",
    "total_amount: Decimal(12,2)",
    "expires_at: Timestamp",
    "created_at: Timestamp",
    "updated_at: Timestamp"
  ],
  CART_ITEM: [
    "id: Integer",
    "cart_id: Integer",
    "product_id: Integer",
    "quantity: Integer",
    "unit_price: Decimal(12,2)",
    "total_price: Decimal(12,2)",
    "created_at: Timestamp",
    "updated_at: Timestamp"
  ],
  PAYMENT_METHOD: [
    "id: Integer",
    "code: Varchar",
    "name: Varchar",
    "provider: Varchar",
    "active: Boolean",
    "created_at: Timestamp",
    "updated_at: Timestamp"
  ],
  CART_PAYMENT: [
    "id: Integer",
    "cart_id: Integer",
    "payment_method_id: Integer",
    "amount: Decimal(12,2)",
    "status: Varchar",
    "provider_reference: Varchar",
    "authorization_code: Varchar",
    "failure_reason: Varchar",
    "authorized_at: Timestamp",
    "captured_at: Timestamp",
    "failed_at: Timestamp",
    "created_at: Timestamp",
    "updated_at: Timestamp"
  ]
};

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

const normalizeEntityKey = (label = "") =>
  label
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^A-Za-z0-9_]/g, "")
    .toUpperCase();

const renderSidebar = (items) => `
  <nav class="doc-sidebar-card">
    <p class="doc-sidebar-label">Navegacao</p>
    <div class="doc-sidebar-links">
      ${items
        .map(
          (section) => `
            <div class="doc-sidebar-group">
              <a class="doc-sidebar-link" href="#${section.id}">${section.title}</a>
            </div>
          `
        )
        .join("")}
    </div>
  </nav>
`;

const renderSection = (section) => `
  <section class="doc-section" id="${section.id}">
    <div class="doc-content">
      <p class="doc-label">${section.label}</p>
      <h2 class="doc-title">${section.title}</h2>
      ${section.copy ? `<div class="markdown-view mt-6">${renderMarkdown(section.copy)}</div>` : ""}
      ${section.diagram
        ? `
          <div class="diagram-wrap mt-8">
            <p class="diagram-hint">Passe o mouse sobre uma entidade para ver os campos do schema.</p>
            <pre class="mermaid">${escapeHtml(section.diagram)}</pre>
          </div>
        `
        : ""}
      ${section.sql
        ? `
          <details class="sql-example mt-8">
            <summary>Exemplo SQL</summary>
            <pre><code class="language-sql">${escapeHtml(section.sql)}</code></pre>
          </details>
        `
        : ""}
    </div>
  </section>
`;

let tooltip;

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
        </tr>
      </thead>
      <tbody>
        ${attributes
          .map((attribute) => {
            const [name, type] = attribute.split(": ");
            return `<tr><td><code>${name}</code></td><td>${type}</td></tr>`;
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
  const maxLeft = Math.max(16, window.innerWidth - 440);
  const maxTop = Math.max(16, window.innerHeight - 240);
  tooltip.style.left = `${Math.min(event.clientX + offset, maxLeft)}px`;
  tooltip.style.top = `${Math.min(event.clientY + offset, maxTop)}px`;
};

const bindEntityHover = () => {
  document.querySelectorAll(".diagram-wrap").forEach((wrap) => {
    if (wrap.dataset.bound === "true") return;
    const nodes = wrap.querySelectorAll("svg g.node");
    if (!nodes.length) return;

    wrap.dataset.bound = "true";

    nodes.forEach((node) => {
      const entityName = normalizeEntityKey(node.textContent || "");
      if (!entityAttributes[entityName]) return;

      node.classList.add("interactive-entity");
      node.addEventListener("mouseenter", (event) => showTooltip(event, entityName));
      node.addEventListener("mousemove", moveTooltip);
      node.addEventListener("mouseleave", hideTooltip);
    });
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const sectionsWithIds = sections.map((section) => ({
    ...section,
    id: slugify(section.title)
  }));

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
