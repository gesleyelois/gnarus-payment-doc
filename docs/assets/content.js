window.DOC_SITE = (() => {
const cartOfferSelectionTable = {
  title: "Selecao no item",
  columns: ["Campo", "Regra", "Uso"],
  rows: [
      ["checkout_offer_id", "Opcional.", "Oferta configurada que originou o item, quando ele veio de addon."],
      ["cart_item_type", "Obrigatorio.", "Tipo da linha criada pela jornada da oferta."],
      ["cart_item_type = ADDON", "Aceita.", "Item adicional comprado."],
      ["cart_item_type = COURTESY", "Cortesia.", "Item gratuito gerado pela oferta."],
      ["cart_item_type = BASE", "Linha base.", "Item principal do checkout."]
    ]
  };

  const paymentScopeTable = {
    title: "Escopo de exibicao",
    columns: ["Nivel", "Fonte", "Uso"],
    rows: [
      ["PRODUCT", "payment_option_rule.scope = PRODUCT", "Override para um checkout aberto por um produto especifico."],
      ["PRODUCT_GROUP", "payment_option_rule.scope = PRODUCT_GROUP", "Lista do agrupamento quando o item pertence a um grupo especifico e nao ha regra mais especifica."],
      ["BUSINESS_UNIT", "payment_option_rule.scope = BUSINESS_UNIT", "Lista da BU quando o checkout fecha em uma unica BU e nao ha regra mais especifica."],
      ["COMPANY", "payment_option_rule.scope = COMPANY", "Fallback do tenant quando nao houver regra mais especifica."]
    ]
  };

  const paymentPriorityExamplesTable = {
    title: "Exemplos de exibicao",
    columns: ["Cenario", "Regras que batem", "Ordem final"],
    rows: [
      ["Produto B2B corporate", "PRODUCT:MALGA_CARD(10)", "MALGA:CREDIT_CARD"],
      ["BU EDU sem regra de grupo", "BUSINESS_UNIT:MALGA_PIX(10), MALGA_CARD(20)", "MALGA:PIX, MALGA:CREDIT_CARD"],
      ["Checkout sem regra de produto", "COMPANY:MALGA_CARD(100)", "MALGA:CREDIT_CARD"],
      ["Fallback da empresa", "COMPANY:MALGA_CARD(100)", "MALGA:CREDIT_CARD"]
    ]
  };

  const paymentFallbackTable = {
    title: "Fallback por metodo",
    columns: ["Metodo", "Fallback", "Comportamento"],
    rows: [
      ["MALGA:PIX", "BRAINTREE:PIX", "Se a rota da Malga cair, a do Braintree assume o mesmo meio."],
      ["MALGA:CREDIT_CARD", "BRAINTREE:CREDIT_CARD", "Fallback da mesma modalidade de cartao."],
      ["EBANX_MX_OXXO", "sem fallback", "Rotas locais podem existir sem reserva."]
    ]
  };

  const gatewayExamplesTable = {
    title: "Exemplos de retorno do provedor",
    columns: ["Cenario", "company_provider_method", "provider_reference", "authorization_code", "failure_code", "failure_message", "status"],
    rows: [
      ["APPROVED / Malga PIX", "MALGA_PIX", "pi_3QxjD9xQ9M7A1B2C3D4", "832741", "NULL", "NULL", "APPROVED"],
      ["FAILED / Braintree card", "BRAINTREE_CREDIT_CARD", "txn_9fA12bC44", "NULL", "card_declined", "The card was declined.", "FAILED"],
      ["APPROVED / Malga card", "MALGA_CREDIT_CARD", "E2E123456789012345678901234567890", "NULL", "NULL", "NULL", "APPROVED"],
      ["FAILED / Ebanx OXXO", "EBANX_MX_OXXO", "pay_4L9x2j88Q", "NULL", "provider_unavailable", "Provider timeout before voucher generation.", "FAILED"]
    ]
  };

  const siteNavigation = [
    {
      id: "overview",
      step: "01",
      label: "Inicio",
      description: "Mapa da documentacao e ordem de leitura",
      href: "./index.html"
    },
    {
      id: "empresa",
      step: "02",
      label: "Empresa",
      description: "Tenant, business unit e camadas",
      href: "./empresa.html"
    },
    {
      id: "catalogo",
      step: "03",
      label: "Catalogo",
      description: "Produto, versao, bundle e oferta",
      href: "./catalogo.html"
    },
    {
      id: "checkout",
      step: "04",
      label: "Checkout",
      description: "Carrinho, snapshot e venda multiempresa",
      href: "./checkout.html"
    },
    {
      id: "pagamento",
      step: "05",
      label: "Pagamento",
      description: "Provedor, metodos e tentativa",
      href: "./pagamento.html"
    },
    {
      id: "regras",
      step: "06",
      label: "Regras e fluxos",
      description: "Jornadas ponta a ponta e regras de negocio",
      href: "./regras.html"
    }
  ];

  const sitePages = {
    overview: {
      metaTitle: "Sistema de pagamento",
      metaDescription: "Visao geral da modelagem, ordem de leitura e mapa da documentacao.",
      badge: "Guia",
      kicker: "Visao geral",
      title: "Sistema de pagamento",
      summary:
        "A leitura parte do tenant, passa pelo catalogo, entra no checkout e fecha no pagamento. No fim, Regras e fluxos junta o que atravessa mais de uma entidade.",
      tags: ["Empresa", "Catalogo", "Bundle", "Checkout", "Pagamento", "Fluxos"],
      panelTitle: "Use este guia para",
      panelItems: [
        "achar a ordem de leitura",
        "bater o olho em onde cada conceito entra",
        "entender como as paginas se conectam",
        "saber onde esta o fluxo canonico"
      ],
      summaryCards: [
        {
          title: "Leitura guiada",
          text: "Cada pagina responde uma pergunta objetiva. A sequencia vai da base do modelo ate os fluxos que cortam mais de uma tabela."
        },
        {
          title: "Linha pode ser parceira",
          text: "O checkout continua publicado por uma empresa, mas cada cart_item pode registrar uma empresa parceira na propria linha."
        },
        {
          title: "Grupo configura a jornada",
          text: "product_group concentra configuracao de checkout e pagamento; ele nao e vendido nem vira rota publica."
        },
        {
          title: "Fluxo canonico",
          text: "Quando o assunto mistura catalogo, checkout e pagamento, a referencia fica em Regras e fluxos."
        }
      ],
      sidebarTitle: "Inicio",
      sidebarCopy: "Passe primeiro por esta pagina para se orientar antes de entrar nos detalhes.",
      sections: [
        {
          id: "intro-linha-de-leitura",
          label: "Comece por aqui",
          title: "01. Linha de leitura",
          copy: `Vale ler esta wiki na mesma ordem em que o sistema toma as decisoes.

Primeiro vem **a empresa** e o papel da **business unit**. Depois entra **o catalogo**: agrupamento, produto, versao comercial, bundle e oferta configurada. Com isso resolvido, o **checkout** fica claro, porque ele congela um snapshot do que saiu do catalogo. O **pagamento** fecha a jornada com provedores, metodos exibidos e o desfecho da tentativa.

Para ver a historia inteira, do acesso publico ao retorno do gateway, siga para [Regras e fluxos](./regras.html).`,
          tables: [
            {
              title: "Ordem sugerida",
              columns: ["Pagina", "Pergunta que responde", "Saida da leitura"],
              rows: [
                ["Inicio", "Qual e a linha de raciocinio da wiki?", "Mapa geral e ordem da documentacao."],
                ["Empresa", "Quem define o tenant e o recorte interno?", "company, business_unit e camadas da modelagem."],
                ["Catalogo", "O que pode ser vendido?", "product, product_version, bundle e checkout_offer; product_group entra como configuracao."],
                ["Checkout", "O que fica congelado na compra?", "cart, cart_item e venda mista por BU ou empresa."],
                ["Pagamento", "Como o metodo aparece e como a tentativa termina?", "payment_provider, company_provider, company_provider_method e cart_payment."],
                ["Regras e fluxos", "Como tudo se encadeia do inicio ao fim?", "Jornadas ponta a ponta e regras de negocio."]
              ]
            }
          ]
        },
        {
          id: "intro-mapa-geral",
          label: "Mapa da wiki",
          title: "02. Mapa geral da modelagem",
          copy: `A wiki foi separada pelas mesmas camadas usadas para explicar o modelo.

Essa divisao deixa cada assunto no seu lugar e evita misturar empresa, catalogo, checkout e pagamento na mesma conversa.`,
          tables: [
            {
              title: "Camadas",
              columns: ["Camada", "Foco", "Entidades principais"],
              rows: [
                ["Empresa", "Tenant e recortes internos.", "company, business_unit"],
                ["Catalogo", "O que pode ser vendido e como o checkout e configurado.", "product_group, product, product_version"],
                ["Bundle e ofertas", "Composicoes e sugestoes opcionais.", "bundle, bundle_version, checkout_offer"],
                ["Checkout", "Snapshot da compra.", "cart, cart_item"],
                ["Pagamento", "Provedor, metodo exibido, fallback e desfecho.", "payment_provider, company_provider, company_provider_method, payment_option_rule, cart_payment"]
              ]
            }
          ],
          diagram: `flowchart LR
  EMPRESA[Empresa e BU]
  CATALOGO[Catalogo]
  BUNDLE[Bundle e ofertas]
  CHECKOUT[Checkout]
  PAGAMENTO[Pagamento]
  FLUXOS[Regras e fluxos]

  EMPRESA --> CATALOGO
  CATALOGO --> BUNDLE
  CATALOGO --> CHECKOUT
  BUNDLE --> CHECKOUT
  CHECKOUT --> PAGAMENTO
  PAGAMENTO --> FLUXOS
  CHECKOUT --> FLUXOS
  CATALOGO --> FLUXOS`
        },
        {
          id: "intro-glossario",
          label: "Termos base",
          title: "03. Glossario rapido",
          copy: `Os termos abaixo aparecem o tempo todo. Vale travar essa base antes de seguir.

Nao e uma lista para decorar. O ponto aqui e sair com o papel de cada conceito bem claro.`,
          tables: [
            {
              title: "Leitura rapida",
              columns: ["Termo", "Leitura", "Onde detalha"],
              rows: [
                ["company", "Define o tenant da venda.", "Empresa"],
                ["business_unit", "Recorte dentro da empresa.", "Empresa"],
                ["product", "Catalogo publico da empresa.", "Catalogo"],
                ["product_version", "Oferta comercial vigente ou historica do produto.", "Catalogo"],
                ["product_version.code", "Codigo publico da oferta comercial.", "Catalogo"],
                ["bundle", "Composicao publica predefinida.", "Catalogo"],
                ["bundle_version", "Composicao historica de um bundle.", "Catalogo"],
                ["checkout_offer", "Configuracao da oferta opcional.", "Catalogo"],
                ["cart", "Cabecalho do checkout.", "Checkout"],
                ["cart_item", "Snapshot do item comprado, inclusive addon e cortesia.", "Checkout"],
                ["company_provider", "Configuracao do provedor dentro da empresa.", "Pagamento"],
                ["company_provider_method", "Meio habilitado em uma configuracao de provedor.", "Pagamento"],
                ["payment_option_rule", "Regra que define quais metodos aparecem no checkout.", "Pagamento"],
                ["cart_payment", "Tentativa de pagamento.", "Pagamento"]
              ]
            }
          ]
        },
        {
          id: "intro-er-completo",
          label: "ER completo",
          title: "04. ER completo do schema",
          copy: `Esse diagrama consolida o schema inteiro em um unico mapa de referencia. Ele e propositalmente mais denso: serve para enxergar as tabelas, suas colunas e as relacoes principais sem precisar pular entre paginas.

Para leitura do dia a dia, as paginas por camada continuam sendo o caminho mais leve. Para auditoria da estrutura, este e o diagrama canonico.`,
          diagram: `erDiagram
  COMPANY {
    INTEGER id PK
    VARCHAR code
    VARCHAR name
    VARCHAR status
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  BUSINESS_UNIT {
    INTEGER id PK
    INTEGER company_id FK
    VARCHAR code
    VARCHAR name
    VARCHAR status
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  PRODUCT_GROUP {
    INTEGER id PK
    INTEGER company_id FK
    INTEGER business_unit_id FK
    VARCHAR code
    VARCHAR name
    VARCHAR status
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  PRODUCT {
    INTEGER id PK
    INTEGER company_id FK
    INTEGER business_unit_id FK
    INTEGER product_group_id FK
    VARCHAR sku
    VARCHAR name
    VARCHAR description
    VARCHAR status
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  PRODUCT_VERSION {
    INTEGER id PK
    INTEGER product_id FK
    VARCHAR code
    INTEGER access_months
    INTEGER bonus_months
    DECIMAL price_amount
    CHAR currency
    TIMESTAMP valid_from
    TIMESTAMP valid_to
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  BUNDLE {
    INTEGER id PK
    INTEGER company_id FK
    INTEGER business_unit_id FK
    VARCHAR code
    VARCHAR name
    VARCHAR status
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  BUNDLE_VERSION {
    INTEGER id PK
    INTEGER bundle_id FK
    INTEGER version_number
    TIMESTAMP valid_from
    TIMESTAMP valid_to
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  CART {
    INTEGER id PK
    INTEGER company_id FK
    INTEGER business_unit_id FK
    INTEGER origin_product_version_id FK
    INTEGER product_group_id FK
    INTEGER bundle_version_id FK
    CHAR buyer_country_code
    VARCHAR buyer_reference
    VARCHAR status
    CHAR currency
    VARCHAR fx_mode
    DECIMAL fx_rate
    VARCHAR fx_rate_source
    TIMESTAMP fx_quoted_at
    DECIMAL subtotal_amount
    DECIMAL subtotal_base_amount
    DECIMAL discount_amount
    DECIMAL total_amount
    DECIMAL total_base_amount
    TIMESTAMP expires_at
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  CART_ITEM {
    INTEGER id PK
    INTEGER cart_id FK
    INTEGER product_version_id FK
    INTEGER bundle_version_id FK
    INTEGER checkout_offer_id FK
    VARCHAR cart_item_type
    INTEGER company_id FK
    INTEGER business_unit_id FK
    INTEGER product_group_id FK
    INTEGER quantity
    DECIMAL base_unit_price
    DECIMAL unit_price
    DECIMAL base_total_price
    DECIMAL total_price
    INTEGER access_months
    INTEGER bonus_months
    INTEGER total_access_months
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  CHECKOUT_OFFER {
    INTEGER id PK
    INTEGER company_id FK
    INTEGER source_product_version_id FK
    INTEGER source_bundle_version_id FK
    INTEGER offered_product_version_id FK
    INTEGER courtesy_product_version_id FK
    INTEGER priority
    BOOLEAN active
    TIMESTAMP valid_from
    TIMESTAMP valid_to
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  PAYMENT_PROVIDER {
    INTEGER id PK
    VARCHAR code
    VARCHAR name
    VARCHAR status
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  COMPANY_PROVIDER {
    INTEGER id PK
    INTEGER company_id FK
    INTEGER payment_provider_id FK
    VARCHAR code
    VARCHAR name
    VARCHAR status
    VARCHAR health_status
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  COMPANY_PROVIDER_METHOD {
    INTEGER id PK
    INTEGER company_provider_id FK
    VARCHAR code
    VARCHAR name
    VARCHAR payment_method_code
    INTEGER fallback_company_provider_method_id FK
    CHAR country_code
    CHAR buyer_currency
    CHAR pricing_currency
    VARCHAR fx_mode
    BOOLEAN active
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  COMPANY_PROVIDER_METHOD_FX_RULE {
    INTEGER id PK
    INTEGER company_provider_method_id FK
    CHAR country_code
    VARCHAR fx_mode
    DECIMAL fixed_rate
    BOOLEAN active
    TIMESTAMP valid_from
    TIMESTAMP valid_to
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  PAYMENT_OPTION_RULE {
    INTEGER id PK
    INTEGER company_id FK
    VARCHAR scope
    INTEGER business_unit_id FK
    INTEGER product_group_id FK
    INTEGER product_id FK
    INTEGER company_provider_method_id FK
    INTEGER priority
    BOOLEAN active
    TIMESTAMP valid_from
    TIMESTAMP valid_to
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  CART_PAYMENT {
    INTEGER id PK
    INTEGER cart_id FK
    INTEGER company_provider_method_id FK
    INTEGER fallback_from_payment_id FK
    DECIMAL amount
    VARCHAR status
    VARCHAR provider_reference
    VARCHAR authorization_code
    VARCHAR failure_code
    VARCHAR failure_message
    TIMESTAMP approved_at
    TIMESTAMP failed_at
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  COMPANY ||--o{ BUSINESS_UNIT : "1:N"
  COMPANY ||--o{ PRODUCT_GROUP : "1:N"
  COMPANY ||--o{ PRODUCT : "1:N"
  BUSINESS_UNIT ||--o{ PRODUCT_GROUP : "0:N"
  BUSINESS_UNIT ||--o{ PRODUCT : "0:N"
  PRODUCT_GROUP ||--o{ PRODUCT : "1:N"
  PRODUCT ||--o{ PRODUCT_VERSION : "1:N"
  COMPANY ||--o{ BUNDLE : "1:N"
  BUSINESS_UNIT ||--o{ BUNDLE : "0:N"
  BUNDLE ||--o{ BUNDLE_VERSION : "1:N"
  COMPANY ||--o{ CART : "1:N"
  COMPANY ||--o{ CART_ITEM : "0:N"
  BUSINESS_UNIT ||--o{ CART : "0:N"
  PRODUCT_GROUP ||--o{ CART : "0:N"
  PRODUCT_GROUP ||--o{ CART_ITEM : "0:N"
  PRODUCT_VERSION ||--o{ CART : "0:N"
  BUNDLE_VERSION ||--o{ CART : "0:N"
  CART ||--o{ CART_ITEM : "1:N"
  BUNDLE_VERSION ||--o{ CART_ITEM : "0:N"
  PRODUCT_VERSION ||--o{ CART_ITEM : "1:N"
  COMPANY ||--o{ CHECKOUT_OFFER : "1:N"
  PRODUCT_VERSION ||--o{ CHECKOUT_OFFER : "0:N"
  BUNDLE_VERSION ||--o{ CHECKOUT_OFFER : "0:N"
  CHECKOUT_OFFER ||--o{ CART_ITEM : "0:N"
  PAYMENT_PROVIDER ||--o{ COMPANY_PROVIDER : "1:N"
  COMPANY ||--o{ COMPANY_PROVIDER : "1:N"
  COMPANY_PROVIDER ||--o{ COMPANY_PROVIDER_METHOD : "1:N"
  COMPANY_PROVIDER_METHOD ||--o{ COMPANY_PROVIDER_METHOD_FX_RULE : "1:N"
  COMPANY ||--o{ PAYMENT_OPTION_RULE : "1:N"
  BUSINESS_UNIT ||--o{ PAYMENT_OPTION_RULE : "0:N"
  PRODUCT ||--o{ PAYMENT_OPTION_RULE : "0:N"
  COMPANY_PROVIDER_METHOD ||--o{ PAYMENT_OPTION_RULE : "1:N"
  CART ||--o{ CART_PAYMENT : "1:N"
  COMPANY_PROVIDER_METHOD ||--o{ CART_PAYMENT : "1:N"
  CART_PAYMENT ||--o{ CART_PAYMENT : "0:N"
  COMPANY_PROVIDER_METHOD ||--o{ COMPANY_PROVIDER_METHOD : "0:1"`,
          tables: [
            {
              title: "Leitura do ER",
              columns: ["Parte", "Uso", "Observacao"],
              rows: [
                ["Blocos", "Todas as tabelas do schema.", "Cada bloco mostra as colunas da entidade."],
                ["Relacoes", "FKs principais.", "Os conectores seguem as mesmas dependencias do schema."],
                ["FX", "company_provider_method_fx_rule + cart.", "Mostra a conversao por pais e o snapshot do carrinho."]
              ]
            }
          ]
        }
      ]
    },
    empresa: {
      metaTitle: "Empresa",
      metaDescription: "Tenant, business unit e mapa geral por camadas da modelagem.",
      badge: "Pagina 02",
      kicker: "Base da modelagem",
      title: "Empresa e business unit",
      summary:
        "Essa pagina firma o vocabulario base do sistema. company marca o tenant, business_unit recorta a operacao e o restante do modelo se organiza a partir disso.",
      tags: ["company", "business_unit", "tenant", "camadas", "identificadores"],
      panelTitle: "Ela responde",
      panelItems: [
        "de onde parte a venda",
        "quando a empresa da linha pode divergir do checkout",
        "como o modelo foi separado em camadas",
        "em que bloco cada tabela aparece"
      ],
      summaryCards: [
        {
          title: "Tenant primeiro",
          text: "company continua abrindo a rota publica, o checkout e as configuracoes de provedores."
        },
        {
          title: "Linha pode ser parceira",
          text: "cart.company_id publica o checkout; cart_item.company_id guarda a empresa real do item quando houver venda entre empresas."
        },
        {
          title: "Mapa por camadas",
          text: "O mapa desta secao separa catalogo, bundle, ofertas, checkout e pagamento para a leitura nao virar um ER unico."
        }
      ],
      sidebarTitle: "Empresa",
      sidebarCopy: "Comece por aqui para alinhar tenant, BU e a divisao por camadas.",
      sections: [
        {
          id: "empresa-fundamentos",
          label: "Fundamento",
          title: "01. Empresa e unidade de negocio",
          copy: `\`company\` define o tenant das rotas publicas e a empresa que publica o checkout. \`cart.company_id\` segue essa empresa, e e dela que saem as ofertas, os provedores configurados e os metodos de pagamento.

\`business_unit\` e um recorte dentro da empresa. Ela organiza o catalogo, pode concentrar agrupamentos de configuracao e pode restringir os metodos quando nao houver regra mais especifica por grupo ou produto. Quando o carrinho mistura BUs ou inclui item de empresa parceira, o cabecalho perde o resumo e a leitura passa para \`cart_item.company_id\`, \`cart_item.business_unit_id\` e \`cart_item.product_group_id\`.`,
          tables: [
            {
              title: "Valores controlados",
              columns: ["Campo", "Descricao", "Valores"],
              rows: [
                ["company.status", "Estado da empresa.", "ACTIVE | INACTIVE"],
                ["business_unit.status", "Estado da unidade de negocio.", "ACTIVE | INACTIVE"]
              ]
            },
            {
              title: "Papel de cada entidade",
              columns: ["Entidade", "Papel", "Impacto no fluxo"],
              rows: [
                ["company", "Tenant da rota publica e do checkout.", "Delimita catalogo, oferta e pagamento."],
                ["business_unit", "Recorte interno da empresa.", "Organiza produto e pode participar da exibicao dos metodos."],
                ["product_group", "Agrupa produtos para configuracao.", "Define o recorte usado por regras de checkout e pagamento."],
                ["product", "Item de catalogo da empresa.", "Sempre aponta para uma BU e para um product_group."],
                ["cart", "Checkout publicado por uma empresa.", "Pode carregar linhas proprias ou de parceiras."]
              ]
            }
          ],
          diagram: `erDiagram
  COMPANY ||--o{ BUSINESS_UNIT : "1:N"
  COMPANY ||--o{ PRODUCT_GROUP : "1:N"
  COMPANY ||--o{ PRODUCT : "1:N"
  BUSINESS_UNIT ||--o{ PRODUCT_GROUP : "0:N"
  BUSINESS_UNIT ||--o{ PRODUCT : "0:N"
  COMPANY ||--o{ CART : "1:N"
  COMPANY ||--o{ CART_ITEM : "0:N"
  BUSINESS_UNIT ||--o{ CART : "0:N"`
        },
        {
          id: "empresa-identificadores",
          label: "Leitura publica",
          title: "02. Identificadores dentro do tenant",
          copy: `O sistema precisa de codigos para resolver empresa, grupo de configuracao, produto, bundle e configuracao de pagamento sem ambiguidade.

Esses codigos nao sao globais. Eles sao unicos **dentro da empresa**. Isso permite que empresas diferentes usem o mesmo \`sku\`, o mesmo codigo de grupo ou o mesmo metodo sem colidir entre si.`,
          tables: [
            {
              title: "Identificacao por tenant",
              columns: ["Campo", "Regra", "Exemplo"],
              rows: [
                ["company.code", "Identificador publico da empresa.", "GROUP_A"],
                ["business_unit.code", "Unico por company.", "EDU"],
                ["product_group.code", "Unico por company.", "B2C-EDU"],
                ["product.sku", "Unico por company.", "PLUS"],
                ["bundle.code", "Unico por company.", "BUNDLE-PLUS"],
                ["company_provider.code", "Unico por company.", "MALGA_MAIN"],
                ["company_provider_method.code", "Unico por company_provider.", "MALGA_PIX"]
              ]
            },
            {
              title: "Contexto de uso",
              columns: ["Tabela", "company_id", "business_unit_id", "Leitura"],
              rows: [
                ["product_group", "obrigatorio", "opcional", "Agrupamento interno de configuracao da empresa."],
                ["product", "obrigatorio", "obrigatorio", "Catalogo da empresa."],
                ["bundle", "obrigatorio", "opcional", "Composicao publica da empresa."],
                ["checkout_offer", "obrigatorio", "-", "Oferta publicada pela empresa do checkout."],
                ["cart", "obrigatorio", "opcional", "Checkout publicado pela empresa."],
                ["cart_item", "obrigatorio", "obrigatorio", "Snapshot da linha, inclusive em venda parceira."],
                ["company_provider", "obrigatorio", "-", "Provedor configurado na empresa."],
                ["company_provider_method", "obrigatorio", "-", "Metodo exibido pela empresa."],
                ["payment_option_rule", "obrigatorio", "opcional", "Regra aplicada dentro da empresa."]
              ]
            }
          ]
        },
        {
          id: "empresa-camadas",
          label: "Mapa geral",
          title: "03. Camadas da modelagem",
          copy: `Nesta secao, vale olhar a modelagem em blocos. Isso evita um ER unico cheio de arestas e separa melhor cadastro, composicao, checkout e pagamento.

Os detalhes ficam nas proximas paginas. Por enquanto, o importante e localizar cada entidade no mapa. Depois do diagrama geral, os casos suportados aparecem em diagramas separados so com as tabelas que entram em cada leitura.`,
          tables: [
            {
              title: "Camadas da modelagem",
              columns: ["Camada", "Entidades", "Leitura"],
              rows: [
                ["Catalogo", "company, business_unit, product_group, product, product_version", "Cadastro, configuracao e historico comercial."],
                ["Bundle", "bundle, bundle_version", "Composicao publica versionada."],
                ["Ofertas", "checkout_offer", "Addons opcionais no checkout."],
                ["Checkout", "cart, cart_item", "Snapshot da compra."],
                ["Pagamento", "payment_provider, company_provider, company_provider_method, company_provider_method_fx_rule, payment_option_rule, cart_payment", "Provedor, metodo exibido, FX, fallback e desfecho da tentativa."]
              ]
            }
          ],
          diagram: `flowchart TB
  COMPANY[company]

  subgraph CATALOGO["Catalogo"]
    BUSINESS_UNIT[business_unit]
    PRODUCT_GROUP[product_group]
    PRODUCT[product]
    PRODUCT_VERSION[product_version]
  end

  subgraph BUNDLE_GROUP["Bundle"]
    BUNDLE[bundle]
    BUNDLE_VERSION[bundle_version]
  end

  subgraph CHECKOUT_GROUP["Checkout"]
    CHECKOUT_OFFER[checkout_offer]
    CART[cart]
    CART_ITEM[cart_item]
  end

  subgraph PAGAMENTO_GROUP["Pagamento"]
    PAYMENT_PROVIDER[payment_provider]
    COMPANY_PROVIDER[company_provider]
    COMPANY_PROVIDER_METHOD[company_provider_method]
    PAYMENT_OPTION_RULE[payment_option_rule]
    CART_PAYMENT[cart_payment]
  end

  COMPANY --> BUSINESS_UNIT
  COMPANY --> PRODUCT_GROUP
  COMPANY --> PRODUCT
  BUSINESS_UNIT --> PRODUCT_GROUP
  BUSINESS_UNIT --> PRODUCT
  PRODUCT_GROUP --> PRODUCT
  PRODUCT --> PRODUCT_VERSION

  COMPANY --> BUNDLE
  BUSINESS_UNIT --> BUNDLE
  BUNDLE --> BUNDLE_VERSION

  COMPANY --> CHECKOUT_OFFER
  PRODUCT_VERSION --> CHECKOUT_OFFER
  BUNDLE_VERSION --> CHECKOUT_OFFER
  CHECKOUT_OFFER --> CART_ITEM

  COMPANY --> CART
  COMPANY --> CART_ITEM
  BUSINESS_UNIT --> CART
  CART --> CART_ITEM
  PRODUCT_VERSION --> CART_ITEM

  PAYMENT_PROVIDER --> COMPANY_PROVIDER
  COMPANY --> COMPANY_PROVIDER
  COMPANY_PROVIDER --> COMPANY_PROVIDER_METHOD
  COMPANY_PROVIDER_METHOD --> COMPANY_PROVIDER_METHOD_FX_RULE
  COMPANY --> PAYMENT_OPTION_RULE
  BUSINESS_UNIT --> PAYMENT_OPTION_RULE
  PRODUCT --> PAYMENT_OPTION_RULE
  COMPANY_PROVIDER_METHOD --> CART_PAYMENT
  CART --> CART_PAYMENT`,
          subsections: [
            {
              id: "empresa-camadas-catalogo",
              title: "Catalogo",
              copy: `Esse bloco concentra empresa, unidade de negocio, agrupamento de configuracao, produto e versao comercial. E onde a modelagem responde **o que a empresa vende** e **qual configuracao de checkout e pagamento acompanha aquele produto**.`,
              diagram: `erDiagram
  COMPANY ||--o{ BUSINESS_UNIT : "1:N"
  COMPANY ||--o{ PRODUCT_GROUP : "1:N"
  COMPANY ||--o{ PRODUCT : "1:N"
  BUSINESS_UNIT ||--o{ PRODUCT_GROUP : "0:N"
  BUSINESS_UNIT ||--o{ PRODUCT : "0:N"
  PRODUCT_GROUP ||--o{ PRODUCT : "1:N"
  PRODUCT ||--o{ PRODUCT_VERSION : "1:N"`
            },
            {
              id: "empresa-camadas-bundle",
              title: "Bundle",
              copy: `Bundle e uma composicao publica predefinida. \`bundle_version\` guarda o historico da composicao, o valor do combo e a lista de produtos daquele snapshot.`,
              diagram: `erDiagram
  COMPANY ||--o{ BUNDLE : "1:N"
  BUSINESS_UNIT ||--o{ BUNDLE : "0:N"
  BUNDLE ||--o{ BUNDLE_VERSION : "1:N"
  PRODUCT_VERSION ||--o{ BUNDLE_VERSION : "0:N"`
            },
            {
              id: "empresa-camadas-ofertas",
              title: "Ofertas",
              copy: `\`checkout_offer\` configura o addon antes do checkout. A origem pode ser uma \`product_version\` ou uma \`bundle_version\`; o item oferecido pode vir da mesma empresa ou de uma parceira. Quando o comprador aceita, a decisao vira \`cart_item\`.`,
              diagram: `flowchart LR
  SOURCE_PRODUCT[product_version origem]
  SOURCE_BUNDLE[bundle_version origem]
  SOURCE_PRODUCT --> RULE[checkout_offer]
  SOURCE_BUNDLE --> RULE
  RULE --> ADDON[cart_item addon]
  RULE --> COURTESY[cart_item cortesia]`
            },
            {
              id: "empresa-camadas-checkout",
              title: "Checkout",
              copy: `A camada de checkout guarda o snapshot da compra. \`cart\` pode apontar para a \`product_version\` de origem ou para a \`bundle_version\` que abriu a jornada; \`cart_item\` congela a \`product_version\` comprada e, quando houver, a \`bundle_version\` de onde a linha veio.`,
              diagram: `erDiagram
  COMPANY ||--o{ CART : "1:N"
  COMPANY ||--o{ CART_ITEM : "0:N"
  BUSINESS_UNIT ||--o{ CART : "0:N"
  PRODUCT_GROUP ||--o{ CART_ITEM : "0:N"
  PRODUCT_VERSION ||--o{ CART : "0:N"
  BUNDLE_VERSION ||--o{ CART : "0:N"
  CART ||--o{ CART_ITEM : "1:N"
  BUNDLE_VERSION ||--o{ CART_ITEM : "0:N"
  PRODUCT_VERSION ||--o{ CART_ITEM : "1:N"`
            },
            {
              id: "empresa-camadas-pagamento",
              title: "Pagamento",
              copy: `A camada de pagamento trata provedor e meio suportado como uma combinacao unica na configuracao. \`cart_payment\` grava o metodo resolvido e a rota real usada na tentativa.`,
              diagram: `erDiagram
  PAYMENT_PROVIDER ||--o{ COMPANY_PROVIDER : "1:N"
  COMPANY ||--o{ COMPANY_PROVIDER : "1:N"
  COMPANY_PROVIDER ||--o{ COMPANY_PROVIDER_METHOD : "1:N"
  COMPANY ||--o{ PAYMENT_OPTION_RULE : "1:N"
  BUSINESS_UNIT ||--o{ PAYMENT_OPTION_RULE : "0:N"
  PRODUCT ||--o{ PAYMENT_OPTION_RULE : "0:N"
  COMPANY_PROVIDER_METHOD ||--o{ CART_PAYMENT : "1:N"`
            },
            {
              id: "empresa-camadas-caso-produto",
              title: "Caso suportado: produto direto",
              copy: `Esse diagrama isola a jornada que nasce por \`sku + product_version.code\`. \`product_group\` aparece so como configuracao de checkout e pagamento, nao como item vendido.`,
              diagram: `flowchart LR
  COMPANY[company]
  BU[business_unit]
  GROUP[product_group]
  PRODUCT[product]
  VERSION[product_version]
  CART[cart]
  ITEM[cart_item]

  COMPANY --> BU
  COMPANY --> GROUP
  BU --> GROUP
  BU --> PRODUCT
  GROUP --> PRODUCT
  PRODUCT --> VERSION
  VERSION --> CART
  GROUP --> CART
  CART --> ITEM
  VERSION --> ITEM
  GROUP --> ITEM`
            },
            {
              id: "empresa-camadas-caso-bundle",
              title: "Caso suportado: bundle pre-carregado",
              copy: `Aqui ficam so as tabelas que participam da composicao versionada e da criacao dos itens quando a jornada nasce por \`bundle.code\`. O \`cart\` e as linhas mantem a relacao com a \`bundle_version\` usada na abertura.`,
              diagram: `flowchart LR
  COMPANY[company]
  BU[business_unit]
  BUNDLE[bundle]
  BUNDLE_VERSION[bundle_version]
  PRODUCT_VERSION[product_version]
  CART[cart]
  CART_ITEM[cart_item]

  COMPANY --> BUNDLE
  BU --> BUNDLE
  BUNDLE --> BUNDLE_VERSION
  BUNDLE_VERSION --> CART
  CART --> CART_ITEM
  BUNDLE_VERSION --> CART_ITEM
  PRODUCT_VERSION --> CART_ITEM`
            },
            {
              id: "empresa-camadas-caso-oferta",
              title: "Caso suportado: add-on opcional",
          copy: `Esse mapa separa as tabelas de configuracao da oferta das linhas criadas no checkout quando o comprador aceita. A origem da oferta pode ser produto ou bundle.`,
          diagram: `flowchart LR
  SOURCE_PRODUCT[product_version origem]
  SOURCE_BUNDLE[bundle_version origem]
  OFFER[checkout_offer]
  TARGET[product_version ofertada]
  COURTESY[product_version cortesia]
  CART[cart]
  SOURCE_ITEM[cart_item origem]
  ADDON_ITEM[cart_item addon]
  COURTESY_ITEM[cart_item cortesia]

  SOURCE_PRODUCT --> OFFER
  SOURCE_BUNDLE --> OFFER
  TARGET --> OFFER
  COURTESY --> OFFER
  CART --> SOURCE_ITEM
  OFFER --> ADDON_ITEM
  OFFER --> COURTESY_ITEM
  SOURCE_ITEM --> ADDON_ITEM
  SOURCE_ITEM --> COURTESY_ITEM`
            },
            {
              id: "empresa-camadas-caso-misto",
              title: "Caso suportado: venda mista",
              copy: `Nesse caso, o cabecalho do \`cart\` continua na empresa que publicou a jornada, mas cada \`cart_item\` pode carregar empresa, BU e agrupamento proprios.`,
              diagram: `flowchart LR
  COMPANY[company do checkout]
  CART[cart]
  ITEM_A[cart_item empresa A / BU A / grupo A]
  ITEM_B[cart_item empresa A / BU B / grupo B]
  ITEM_C[cart_item empresa parceira / BU C / grupo C]

  COMPANY --> CART
  CART --> ITEM_A
  CART --> ITEM_B
  CART --> ITEM_C`
            },
            {
              id: "empresa-camadas-caso-provedor",
              title: "Caso suportado: provedor configurado na empresa",
              copy: `Esse diagrama mostra so a parte operacional do cadastro: o provedor do catalogo, a configuracao dentro da empresa e os meios realmente habilitados nessa configuracao.`,
              diagram: `flowchart LR
  PROVIDER[payment_provider]
  COMPANY[company]
  COMPANY_PROVIDER[company_provider]
  METHOD[company_provider_method]

  PROVIDER --> COMPANY_PROVIDER
  COMPANY --> COMPANY_PROVIDER
  COMPANY_PROVIDER --> METHOD`
            },
            {
              id: "empresa-camadas-caso-metodo",
              title: "Caso suportado: exibicao de metodos",
              copy: `Aqui aparecem so as tabelas que definem quais metodos o checkout pode mostrar e de onde esses metodos tiram sua rota real. \`product_group\` entra apenas como grupo de configuracao.`,
              diagram: `flowchart LR
  CART[cart]
  BU[business_unit]
  GROUP[product_group]
  PRODUCT[product]
  RULE[payment_option_rule]
  METHOD[company_provider_method]

  CART --> RULE
  BU --> RULE
  GROUP --> RULE
  PRODUCT --> RULE
  RULE --> METHOD`
            },
            {
              id: "empresa-camadas-caso-fallback",
              title: "Caso suportado: fallback por provedor",
              copy: `Esse mapa isola a cadeia de tentativas em \`cart_payment\` quando a empresa precisa trocar de rota sem mudar o metodo exibido ao comprador.`,
              diagram: `flowchart LR
  METHOD_A[company_provider_method A]
  METHOD_B[company_provider_method B]
  CART[cart]
  PAYMENT_A[cart_payment tentativa 1]
  PAYMENT_B[cart_payment tentativa 2]

  METHOD_A --> METHOD_B
  CART --> PAYMENT_A
  CART --> PAYMENT_B
  METHOD_A --> PAYMENT_A
  METHOD_B --> PAYMENT_B
  PAYMENT_A --> PAYMENT_B`
            },
            {
              id: "empresa-camadas-caso-fx",
              title: "Caso suportado: cobranca local com cambio do provedor",
              copy: `Esse caso destaca a ligacao entre a oferta comercial, o metodo exibido e a rota local do provedor quando o preco base fica em uma moeda e a cobranca acontece em outra.`,
              diagram: `flowchart LR
  VERSION[product_version]
  CART[cart]
  RULE[payment_option_rule]
  METHOD[company_provider_method com buyer_currency e pricing_currency]
  PAYMENT[cart_payment]

  VERSION --> CART
  CART --> RULE
  RULE --> METHOD
  CART --> PAYMENT
  METHOD --> PAYMENT`
            }
          ]
        }
      ]
    },
    catalogo: {
      metaTitle: "Catalogo",
      metaDescription: "Agrupamento, produto, versao comercial, bundle versionado e oferta configurada.",
      badge: "Pagina 03",
      kicker: "O que pode ser vendido",
      title: "Catalogo, agrupamento e composicao",
      summary:
        "Antes de existir checkout, o que importa nasce no catalogo: agrupamento de configuracao, produto, versao comercial, bundle versionado e oferta configurada.",
      tags: ["product_group", "product", "product_version", "bundle", "bundle_version", "checkout_offer"],
      panelTitle: "Ao sair daqui",
      panelItems: [
        "onde product_group entra",
        "qual e o papel de product e product_version",
        "quando abrir uma nova versao comercial",
        "onde bundle termina e checkout_offer comeca",
        "o que ja sai pronto para o checkout"
      ],
      summaryCards: [
        {
          title: "Grupo configura o checkout",
          text: "product_group junta produtos que compartilham customizacao de checkout e regra de pagamento."
        },
        {
          title: "Produto nao vira periodo",
          text: "O produto continua o mesmo. Periodo, bonus, preco e vigencia ficam em product_version."
        },
        {
          title: "Bundle e pre-carregado",
          text: "Bundle abre o carrinho com itens ja criados no snapshot. Ele nao substitui a oferta opcional do checkout."
        },
        {
          title: "Oferta e opcional",
          text: "checkout_offer so configura a sugestao. A linha final aparece em cart_item no checkout."
        }
      ],
      sidebarTitle: "Catalogo",
      sidebarCopy: "Agrupamento de configuracao, produto, versao, bundle e oferta configurada saem daqui e alimentam o checkout.",
      sections: [
        {
          id: "catalogo-produto",
          label: "Catalogo base",
          title: "01. Agrupamento e produto",
          copy: `\`product_group\` agrupa produtos que compartilham a mesma configuracao de checkout e pagamento.

\`product_group\` nao e vendido comercialmente. Ele funciona como camada interna de configuracao para checkout e pagamento.

\`product\` continua sendo o item de catalogo da empresa. Ele responde **o que esta sendo vendido**, mas agora sempre aponta para uma \`business_unit\` e para um \`product_group\`.

Prazo, preco e bonus nao ficam no produto. Esses termos moram em \`product_version\`, que tambem carrega o codigo publico da oferta comercial.`,
          tables: [
            {
              title: "Contexto do agrupamento",
              columns: ["Campo", "Regra", "Exemplo"],
              rows: [
                ["company_id", "Obrigatorio.", "1"],
                ["business_unit_id", "Opcional.", "1"],
                ["code", "Unico por company.", "B2C-EDU"],
                ["name", "Obrigatorio.", "Configuracao B2C Educacao"]
              ]
            },
            {
              title: "Contexto do produto",
              columns: ["Campo", "Regra", "Exemplo"],
              rows: [
                ["company_id", "Obrigatorio.", "1"],
                ["business_unit_id", "Obrigatorio.", "1"],
                ["product_group_id", "Obrigatorio.", "10"],
                ["sku", "Unico por company.", "PLUS"]
              ]
            },
            {
              title: "Valores controlados",
              columns: ["Campo", "Descricao", "Valores"],
              rows: [
                ["product_group.status", "Disponibilidade do agrupamento de configuracao.", "ACTIVE | INACTIVE"],
                ["product.status", "Disponibilidade do produto.", "ACTIVE | INACTIVE"]
              ]
            },
            {
              title: "Identificacao publica",
              columns: ["Campo", "Regra", "Exemplo"],
              rows: [
                ["sku", "Codigo publico do produto.", "curso-ia"],
                ["pagina do produto", "Usa o sku para resolver o produto dentro da empresa.", "/produto/curso-ia"],
                ["rota da oferta", "Usa sku + product_version.code para resolver uma oferta especifica.", "/produto/curso-ia/12m-bonus-2"]
              ]
            }
          ],
          diagram: `erDiagram
  PRODUCT_GROUP {
    INTEGER id
    VARCHAR code
    VARCHAR name
  }
  PRODUCT {
    INTEGER id
    INTEGER product_group_id
    VARCHAR sku
    VARCHAR name
  }
  PRODUCT_GROUP ||--o{ PRODUCT : "1:N"
  PRODUCT ||--o{ PRODUCT_VERSION : "1:N"
  PRODUCT_VERSION {
    INTEGER id
    INTEGER product_id
    VARCHAR code
    INTEGER access_months
    INTEGER bonus_months
    DECIMAL_12_2 price_amount
    CHAR_3 currency
    TIMESTAMP valid_from
    TIMESTAMP valid_to
  }`,
          sql: `INSERT INTO product_group (id, company_id, business_unit_id, code, name, status, created_at, updated_at)
VALUES
  (10, 1, 1, 'B2C-EDU', 'Configuracao B2C Educacao', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO product (id, company_id, business_unit_id, product_group_id, sku, name, description, status, created_at, updated_at)
VALUES
  (1, 1, 1, 10, 'CURSO-IA', 'Curso de IA aplicado', 'Produto digital principal', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
        },
        {
          id: "catalogo-versao-comercial",
          label: "Oferta comercial",
          title: "02. Versao comercial",
          copy: `\`product_version\` define **como aquele produto esta sendo vendido em um periodo especifico**.

Nessa tabela ficam prazo, bonus, preco, moeda, vigencia e o \`code\` que identifica publicamente a oferta dentro do produto. Quando algum desses termos muda, entra uma nova linha e a anterior continua como historico.

\`valid_to\` nulo quer dizer "versao ainda vigente". Nao quer dizer "acesso vitalicio".`,
          tables: [
            {
              title: "Historico comercial",
              columns: ["Versao", "Code", "Periodo", "Bonus", "Preco", "valid_from", "valid_to"],
              rows: [
                ["1", "12m-base", "12 meses", "0", "BRL 199.90", "2026-01-01", "2026-03-31"],
                ["2", "12m-bonus-2", "12 meses", "2", "BRL 199.90", "2026-04-01", "NULL"],
                ["3", "24m", "24 meses", "0", "BRL 349.90", "2026-01-01", "NULL"]
              ]
            },
            {
              title: "Regra de leitura",
              columns: ["Regra", "Leitura", "Efeito"],
              rows: [
                ["sku resolve o produto", "A pagina comercial nasce do product.sku.", "O cliente chega ao produto certo dentro da empresa."],
                ["product_version.code resolve a oferta", "A URL completa da oferta usa sku + code.", "A camada publica encontra uma oferta especifica sem depender de access_months."],
                ["Mais de uma versao vigente no produto", "E permitido quando cada oferta tiver code proprio.", "A pagina do produto pode listar 12m, 24m e outras ofertas ativas ao mesmo tempo."],
                ["Mudou o termo comercial", "Preco, bonus, periodo ou vigencia mudaram.", "Nova linha em product_version."],
                ["Carrinho sempre usa snapshot", "O checkout nao relanca a versao ao reabrir.", "cart_item.product_version_id continua sendo a referencia da compra."]
              ]
            }
          ],
          subsections: [
            {
              id: "catalogo-versao-historico",
              title: "Quando nasce uma nova versao",
              copy: `A linha antiga nao e sobrescrita. Ela recebe \`valid_to\` e uma nova linha passa a valer a partir do novo \`valid_from\`.

Quando a oferta comercial muda de identidade publica, a nova linha recebe um novo \`code\`. A pagina do produto continua chegando pelo \`sku\`; a oferta especifica continua chegando por \`sku + code\`.

O fluxo completo de resolucao publica por \`sku\` e \`product_version.code\` esta em [Regras e fluxos](./regras.html#fluxo-sku-checkout).`,
              diagram: `flowchart LR
  V1["12m-base / bonus 0 / BRL 199.90"] --> V2["12m-bonus-2 / bonus 2 / BRL 199.90"]
  V2 --> V3["24m / bonus 0 / BRL 349.90"]`,
              sql: `UPDATE product_version
SET valid_to = '2026-03-31'
WHERE id = 1;

INSERT INTO product_version (id, product_id, code, access_months, bonus_months, price_amount, currency, valid_from, valid_to, created_at, updated_at)
VALUES
  (2, 1, '12m-bonus-2', 12, 2, 199.90, 'BRL', '2026-04-01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, '24m', 24, 0, 349.90, 'BRL', '2026-01-01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
            }
          ],
          sql: `INSERT INTO product_version (id, product_id, code, access_months, bonus_months, price_amount, currency, valid_from, valid_to, created_at, updated_at)
VALUES
  (1, 1, '12m-base', 12, 0, 199.90, 'BRL', '2026-01-01', '2026-03-31', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, '12m-bonus-2', 12, 2, 199.90, 'BRL', '2026-04-01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, '24m', 24, 0, 349.90, 'BRL', '2026-01-01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
        },
        {
          id: "catalogo-bundle",
          label: "Composicao publica",
          title: "03. Bundle versionado",
          copy: `\`bundle\` representa uma composicao predefinida. Ele existe para abrir o carrinho ja com os itens carregados.

\`bundle_version\` guarda o historico da composicao, o valor do combo e a lista de produtos daquele snapshot.

O fluxo ponta a ponta de abertura por \`bundle.code\` esta em [Regras e fluxos](./regras.html#fluxo-bundle-checkout).`,
          tables: [
            {
              title: "Contexto do bundle",
              columns: ["Campo", "Regra", "Leitura"],
              rows: [
                ["bundle.company_id", "Obrigatorio.", "Bundle pertence a empresa."],
                ["bundle.business_unit_id", "Opcional.", "Preenchido quando a composicao fica em uma unica BU."],
                ["bundle.code", "Unico por company.", "Identificador publico do bundle."],
                ["cart.bundle_version_id", "Opcional no carrinho.", "Snapshot da versao usada na abertura."],
                ["cart_item.bundle_version_id", "Opcional na linha.", "Preenchido quando a linha veio da composicao do bundle."]
              ]
            },
            {
              title: "Regras do versionamento",
              columns: ["Regra", "Leitura", "Efeito"],
              rows: [
                ["Uma bundle_version ativa por bundle", "Mais de uma ativa e erro de cadastro.", "A rota publica nao pode escolher uma composicao arbitraria."],
                ["bundle_version guarda a composicao", "A lista de produtos e quantidades fica presa ao historico da versao.", "O carrinho cria exatamente aquela composicao."],
                ["Bundle e pre-carregado", "Nao depende de selecao posterior para existir.", "Abre o carrinho com itens prontos."]
              ]
            }
          ],
          diagram: `erDiagram
  COMPANY ||--o{ BUNDLE : "1:N"
  BUSINESS_UNIT ||--o{ BUNDLE : "0:N"
  BUNDLE ||--o{ BUNDLE_VERSION : "1:N"
  PRODUCT_VERSION ||--o{ BUNDLE_VERSION : "0:N"`,
          subsections: [
            {
              id: "catalogo-bundle-abertura",
              title: "O que o checkout recebe",
              copy: `Quando a rota publica resolve \`bundle.code\`, ela encontra a \`bundle_version\` ativa e abre o carrinho com \`bundle_version_id\`.

Daqui em diante, a composicao deixa de ser cadastro e passa a existir como \`cart_item\` no checkout, com a mesma \`bundle_version_id\` gravada na linha.`,
              tables: [
                {
                  title: "Passos resumidos",
                  columns: ["Passo", "Origem", "Resultado"],
                  rows: [
                    ["Resolver bundle", "bundle.code", "bundle da empresa encontrado."],
                    ["Escolher versao", "bundle_version ativa", "snapshot da composicao definido."],
                    ["Materializar itens", "bundle_version.composition_json", "linhas em cart_item."],
                    ["Abrir carrinho", "cart", "checkout pronto para pagamento."]
                  ]
                }
              ]
            }
          ],
          sql: `INSERT INTO bundle (id, company_id, business_unit_id, code, name, status, created_at, updated_at)
VALUES
  (1, 1, NULL, 'BUNDLE-PLUS', 'Bundle Plus', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO bundle_version (id, bundle_id, version_number, price_amount, currency, composition_json, valid_from, valid_to, created_at, updated_at)
VALUES
  (1, 1, 1, 499.90, 'BRL', '{"items":[{"product_version_id":10,"quantity":1},{"product_version_id":21,"quantity":2}]}', '2026-01-01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
        },
        {
          id: "catalogo-oferta-configurada",
          label: "Addon opcional",
          title: "04. Oferta configurada para o checkout",
          copy: `\`checkout_offer\` modela uma sugestao opcional mostrada durante o checkout. Ela liga uma origem do checkout a uma versao ofertada.

A origem pode ser uma \`product_version\` ou uma \`bundle_version\`. O addon pode ser a mesma linha em outra versao, um produto de outra BU ou um produto de empresa parceira. Quando houver cortesia, a configuracao ja deixa claro qual \`product_version\` gratuita entra junto com a selecao.

Nesta pagina fica so a configuracao. A decisao do comprador aparece em [Checkout](./checkout.html#checkout-oferta-aceita). O fluxo parceiro fica em [Regras e fluxos](./regras.html#fluxo-oferta-multiempresa).`,
          tables: [
            {
              title: "Valores controlados",
              columns: ["Campo", "Descricao", "Valores"],
              rows: [["checkout_offer.active", "Disponibilidade da oferta.", "true | false"]]
            },
            {
              title: "Contexto da oferta",
              columns: ["Campo", "Regra", "Uso"],
              rows: [
                ["company_id", "Obrigatorio.", "Empresa que publica a oferta."],
                ["source_product_version_id", "Opcional.", "Versao que dispara a oferta quando a origem e produto."],
                ["source_bundle_version_id", "Opcional.", "Bundle que dispara a oferta quando a origem e bundle."],
                ["offered_product_version_id", "Obrigatorio.", "Addon sugerido; pode ser upsell, cross-sell ou item de empresa parceira."],
                ["courtesy_product_version_id", "Opcional.", "Produto gratuito quando o addon e selecionado; pode vir da empresa parceira."],
                ["priority", "Menor valor primeiro.", "Define a ordem quando houver mais de uma oferta ativa para a mesma origem."]
              ]
            }
          ],
          diagram: `flowchart LR
  SOURCE_PRODUCT[product_version origem]
  SOURCE_BUNDLE[bundle_version origem]
  SOURCE_PRODUCT --> OFFER_RULE[checkout_offer]
  SOURCE_BUNDLE --> OFFER_RULE
  OFFER_RULE --> ADDON[product_version ofertada]
  OFFER_RULE --> COURTESY[product_version cortesia]`
        }
      ]
    },
    checkout: {
      metaTitle: "Checkout",
      metaDescription: "Carrinho, snapshot da compra, oferta aceita como item e venda mista por BU ou empresa.",
      badge: "Pagina 04",
      kicker: "Snapshot da compra",
      title: "Checkout, itens e selecao do comprador",
      summary:
        "No checkout, o modelo deixa de ser cadastro e vira compra em andamento. A pagina cobre o cabecalho do carrinho, os itens congelados, a selecao de oferta e a venda mista por BU ou empresa.",
      tags: ["cart", "cart_item", "snapshot", "venda mista", "multiempresa"],
      panelTitle: "O que olhar aqui",
      panelItems: [
        "qual contexto fica no cart",
        "quais campos o cart_item congela",
        "como a oferta vira item adicional",
        "quando a linha vem de outra empresa"
      ],
      summaryCards: [
        {
          title: "Snapshot vale mais que releitura",
          text: "Ao reabrir o checkout, a interface usa cart_item.product_version_id e, quando houver bundle, cart_item.bundle_version_id."
        },
        {
          title: "Empresa, BU e grupo por linha",
          text: "Quando a venda mistura BUs ou empresas, o snapshot da origem real fica em cart_item.company_id e cart_item.business_unit_id."
        },
        {
          title: "Oferta vira item",
          text: "A configuracao do addon nasce em checkout_offer; a aceitacao cria uma linha em cart_item."
        }
      ],
      sidebarTitle: "Checkout",
      sidebarCopy: "Daqui em diante o modelo registra a compra em andamento, nao so cadastro.",
      sections: [
        {
          id: "checkout-carrinho",
          label: "Cabecalho da compra",
          title: "01. Carrinho",
          copy: `\`cart\` representa o checkout publicado por uma empresa. Ele carrega o contexto geral da venda: empresa que abriu a jornada, produto de origem quando houver, grupo de configuracao usado no checkout, bundle de origem quando houver, moeda do comprador, politica de FX, taxa congelada, totais base e convertidos, status e, quando a venda for internacional, a cotacao congelada.

\`cart.company_id\` identifica a empresa que publica o checkout, as ofertas e as configuracoes de pagamento. Isso nao obriga todas as linhas a pertencerem a ela. \`business_unit_id\` no cabecalho so fica preenchido quando a venda inteira fecha em uma unica BU da empresa do checkout.`,
          tables: [
            {
              title: "Contexto da venda",
              columns: ["Campo", "Regra", "Uso"],
              rows: [
                ["company_id", "Obrigatorio.", "Empresa que publica o checkout e resolve os metodos."],
                ["origin_product_version_id", "Opcional.", "Oferta que abriu a jornada quando o checkout nasce da rota de produto."],
                ["bundle_version_id", "Opcional.", "Versao do bundle de origem do carrinho."],
                ["buyer_country_code", "Opcional.", "Pais escolhido pelo comprador para precificacao local."],
                ["fx_mode", "Opcional.", "Politica de FX congelada no carrinho."],
                ["fx_rate", "Opcional.", "Taxa aplicada no momento da cotacao."],
                ["fx_rate_source", "Opcional.", "Origem da cotacao usada."],
                ["fx_quoted_at", "Opcional.", "Timestamp da cotacao aplicada."],
                ["subtotal_base_amount", "Opcional.", "Subtotal na moeda base antes da conversao."],
                ["business_unit_id", "Opcional.", "Unidade do cabecalho; nulo quando a venda mistura BUs ou empresas."],
                ["total_base_amount", "Opcional.", "Total na moeda base antes da conversao."],
                ["cart_item.company_id", "Obrigatorio.", "Empresa congelada em cada linha; pode divergir do cabecalho."],
                ["cart_item.business_unit_id", "Obrigatorio.", "BU congelada em cada linha."],
                ["cart_item.bundle_version_id", "Opcional.", "Versao do bundle quando a linha veio da composicao."]
              ]
            },
            {
              title: "Valores controlados",
              columns: ["Campo", "Descricao", "Valores"],
              rows: [
                ["status", "Estado do checkout.", "DRAFT | CHECKOUT | COMPLETED | CANCELED | EXPIRED"],
                ["currency", "Moeda do carrinho.", "BRL | USD | ARS | MXN | COP"],
                ["buyer_country_code", "Pais do comprador.", "ISO 3166-1 alpha-2"],
                ["fx_mode", "Politica de FX aplicada.", "PROVIDER_API | FIXED_RATE"],
                ["fx_rate_source", "Origem da cotacao.", "EBANX_API | BACKOFFICE"]
              ]
            },
            {
              title: "Cenarios do checkout",
              columns: ["Momento", "cart.status", "Leitura"],
              rows: [
                ["Carrinho aberto", "DRAFT", "Itens ainda podem mudar."],
                ["Meio escolhido", "CHECKOUT", "Checkout segue aberto aguardando desfecho da tentativa."],
                ["Sucesso", "COMPLETED", "Carrinho fechado."],
                ["Falha", "CHECKOUT", "Nova tentativa permitida."],
                ["Expirado", "EXPIRED", "Checkout nao pode mais receber nova tentativa."]
              ]
            }
          ],
          diagram: `erDiagram
  CART ||--o{ CART_ITEM : "1:N"
  CART ||--o{ CART_PAYMENT : "1:N"`
        },
        {
          id: "checkout-snapshot",
          label: "Linha congelada",
          title: "02. Snapshot do item",
          copy: `\`cart_item\` grava a versao comercial escolhida no momento da compra. Isso inclui empresa, BU, agrupamento de configuracao, prazo, bonus, preco base, preco convertido e quantidade da linha.

O checkout nao depende de reler \`product_version\` para reconstruir esse item. Ele ja carrega o snapshot necessario para mostrar a compra de novo. Quando a linha nasce de um bundle, ela tambem preserva a \`bundle_version\` usada na composicao.`,
          tables: [
            {
              title: "Snapshot do item",
              columns: ["Campo", "Origem", "Uso"],
              rows: [
                ["product_version_id", "product_version.id", "Referencia da oferta escolhida e versao exibida ao reabrir o carrinho."],
                ["bundle_version_id", "cart.bundle_version_id", "Versao do bundle quando a linha foi materializada de uma composicao pre-carregada."],
                ["company_id", "product.company_id", "Empresa congelada da linha."],
                ["business_unit_id", "product.business_unit_id", "BU congelada na linha."],
                ["quantity", "Definido no carrinho", "Unidades compradas. Assinatura costuma ser 1; evento pode ser maior."],
                ["access_months", "product_version.access_months", "Periodo base contratado na compra."],
                ["bonus_months", "product_version.bonus_months", "Meses extras concedidos na compra."],
                ["total_access_months", "access_months + bonus_months", "Prazo final de acesso."],
                ["base_unit_price", "product_version.price_amount", "Preco base congelado no carrinho."],
                ["unit_price", "base_unit_price convertido", "Preco convertido no carrinho."],
                ["base_total_price", "base_unit_price * quantity", "Total base congelado na linha."],
                ["total_price", "unit_price * quantity", "Total convertido da linha."]
              ]
            }
          ],
          subsections: [
            {
              id: "checkout-snapshot-exemplo",
              title: "Exemplo do snapshot",
              copy: `No exemplo, a oferta de 12 meses com 2 meses de bonus entra no carrinho como 14 meses de acesso.

O fluxo completo de \`sku\` e \`product_version.code\` ate o pagamento esta em [Regras e fluxos](./regras.html#fluxo-sku-checkout). Neste trecho, o foco fica so no que foi persistido na linha.`,
              tables: [
                {
                  title: "Snapshot do exemplo",
                  columns: ["Tabela", "Dados", "Leitura"],
                  rows: [
                    ["product_version", "id=2 | code=12m-bonus-2 | access_months=12 | bonus_months=2 | price_amount=199.90", "Oferta usada no fechamento."],
                    ["cart_item", "product_version_id=2 | bundle_version_id=NULL | company_id=1 | business_unit_id=1 | quantity=1 | access_months=12 | bonus_months=2 | total_access_months=14 | base_unit_price=199.90 | unit_price=3448.00", "Snapshot da linha."],
                    ["cart_payment", "status=PENDING -> APPROVED", "Tentativa de pagamento concluida com sucesso."]
                  ]
                }
              ],
              diagram: `sequenceDiagram
  participant U as Usuario
  participant C as cart
  participant V as product_version
  participant I as cart_item

  U->>C: abre carrinho
  U->>V: seleciona versao 2
  C->>I: grava product_version_id=2
  C->>I: grava total_access_months=14
  C-->>U: checkout reabre pelo snapshot`
            }
          ],
          sql: `INSERT INTO cart (id, company_id, origin_product_version_id, bundle_version_id, buyer_country_code, business_unit_id, buyer_reference, status, currency, fx_mode, fx_rate, fx_rate_source, fx_quoted_at, subtotal_amount, subtotal_base_amount, discount_amount, total_amount, total_base_amount, expires_at, created_at, updated_at)
VALUES
  (1, 1, 2, 1, 'MX', NULL, 'BUYER-1001', 'DRAFT', 'MXN', 'PROVIDER_API', 17.25000000, 'EBANX_API', CURRENT_TIMESTAMP, 3448.00, 199.90, 0.00, 3448.00, 199.90, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cart_item (id, cart_id, product_version_id, bundle_version_id, company_id, business_unit_id, quantity, base_unit_price, unit_price, base_total_price, total_price, access_months, bonus_months, total_access_months, created_at, updated_at)
VALUES
  (1, 1, 2, NULL, 1, 1, 1, 199.90, 3448.00, 199.90, 3448.00, 12, 2, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
        },
        {
          id: "checkout-oferta-aceita",
          label: "Resposta do comprador",
          title: "03. Oferta aceita no checkout",
          copy: `\`checkout_offer\` define a sugestao opcional. Quando a oferta e aceita, o checkout cria uma nova linha em \`cart_item\` com \`cart_item_type = ADDON\`. Se houver cortesia, o mesmo vale para \`cart_item_type = COURTESY\`. Se a oferta for recusada, nenhuma linha adicional e criada.`,
          tables: [
            {
              title: "Valores controlados",
              columns: ["Campo", "Descricao", "Valores"],
              rows: [["cart_item_type", "Tipo da linha criada pela oferta.", "ADDON | COURTESY | BASE"]]
            },
            cartOfferSelectionTable
          ],
          diagram: `flowchart LR
  OFFER_RULE[checkout_offer] --> ADDON[cart_item addon]
  OFFER_RULE --> COURTESY[cart_item cortesia]`
        },
        {
          id: "checkout-venda-mista",
          label: "Empresa, BU e grupo",
          title: "04. Venda mista por empresa, BU e grupo",
          copy: `Uma venda mista acontece quando o mesmo carrinho carrega linhas de business units diferentes, de grupos diferentes, de empresas diferentes ou de varias combinacoes disso.

Nesse caso, o cabecalho continua ligado a \`cart.company_id\`, mas \`business_unit_id\` do \`cart\` pode ficar nulo. A origem real passa a ser lida linha por linha em \`cart_item.company_id\`, \`cart_item.business_unit_id\` e \`cart_item.product_group_id\`. O exemplo Alura + StartSe aparece em [Regras e fluxos](./regras.html#fluxo-oferta-multiempresa).`,
          tables: [
            {
              title: "Exemplo de linhas",
              columns: ["Tabela", "Dados", "Leitura"],
              rows: [
                ["cart", "company_id=ALURA | business_unit_id=NULL", "Checkout publicado pela Alura."],
                ["cart_item 1", "product_version_id=ALURA-12M | bundle_version_id=NULL | company_id=ALURA | business_unit_id=PLATAFORMA | product_group_id=B2C-EDU | quantity=1", "Linha da empresa do checkout."],
                ["cart_item 2", "product_version_id=STARTSE-INGRESSO | bundle_version_id=NULL | company_id=STARTSE | business_unit_id=EVENTOS | product_group_id=EVENTOS-LATAM | quantity=2", "Linha da empresa parceira."]
              ]
            },
            {
              title: "Regra",
              columns: ["Cenario", "Leitura", "Uso"],
              rows: [
                ["Uma empresa e uma BU", "cart.company_id e cart.business_unit_id resumem o checkout", "Checkout simples."],
                ["Mais de uma BU na mesma empresa", "cart.business_unit_id = NULL", "Venda mista interna."],
                ["Empresa parceira no carrinho", "cart_item.company_id pode divergir de cart.company_id", "Venda multiempresa."]
              ]
            }
          ],
          diagram: `flowchart LR
  CART[checkout Alura] --> ITEM1[cart_item Alura]
  CART --> ITEM2[cart_item StartSe]
  ITEM1 --> TOTAL[cart totals]
  ITEM2 --> TOTAL`
        }
      ]
    },
    pagamento: {
      metaTitle: "Pagamento",
      metaDescription: "Provedores configurados, metodos exibidos, fallback, FX e desfecho da tentativa.",
      badge: "Pagina 05",
      kicker: "Desfecho financeiro",
      title: "Provedor, FX, metodo e tentativa de pagamento",
      summary:
        "Pagamento separa cinco perguntas: quais provedores a empresa configurou, como o FX internacional e congelado funciona, quais metodos o checkout exibe, qual fallback entra em cena e como a tentativa termina em PENDING, APPROVED ou FAILED.",
      tags: ["payment_provider", "company_provider", "company_provider_method", "company_provider_method_fx_rule", "payment_option_rule", "cart_payment", "PENDING", "APPROVED", "FAILED"],
      panelTitle: "No fim da leitura",
      panelItems: [
        "como a empresa cadastra provedores",
        "como o metodo exibido resolve a rota real",
        "como product, product_group e BU entram na regra",
        "como fallback e desfecho ficam auditados"
      ],
      summaryCards: [
        {
          title: "Metodo visivel nao e rota",
          text: "CARD e PAYPAL podem usar credito por baixo, mas cada uma tem sua propria fila de rotas."
        },
        {
          title: "Produto e grupo antes da BU",
          text: "A precedencia passa por PRODUCT, PRODUCT_GROUP, BUSINESS_UNIT e COMPANY."
        },
        {
          title: "Fallback deixa rastro",
          text: "cart_payment grava a combinacao provider + method e a tentativa anterior quando houve failover."
        }
      ],
      sidebarTitle: "Pagamento",
      sidebarCopy: "Comece pelos provedores da empresa. Depois veja exibicao, fallback e tentativa.",
      sections: [
        {
          id: "pagamento-provedores",
          label: "Cadastro base",
          title: "01. Provedores e meios habilitados",
          copy: `\`payment_provider\` e o catalogo global de integracoes suportadas. \`company_provider\` e a configuracao concreta daquele provedor dentro da empresa.

\`company_provider_method\` registra os meios suportados por essa configuracao: PIX, credito, debito, boleto, OXXO, SPEI e assim por diante. O meio nunca entra desacoplado do provedor; a regra sempre trabalha com a combinacao \`company_provider\` + \`company_provider_method\`. Quando a venda acontece em moeda local sobre preco base em USD, a mesma linha pode carregar \`country_code\`, \`buyer_currency\`, \`pricing_currency\` e \`fx_mode = PROVIDER_FX\`.`,
          tables: [
            {
              title: "Valores controlados",
              columns: ["Campo", "Descricao", "Valores"],
              rows: [
                ["payment_provider.code", "Catalogo global de provedores.", "MALGA | BRAINTREE | EBANX | PAYPAL"],
                ["company_provider.status", "Disponibilidade administrativa da configuracao.", "ACTIVE | INACTIVE"],
                ["company_provider.health_status", "Leitura operacional da configuracao.", "ONLINE | DEGRADED | OFFLINE"],
                ["company_provider_method.payment_method_code", "Meio suportado pela configuracao do provedor.", "PIX | CREDIT_CARD | DEBIT_CARD | NUPAY | BOLETO | OXXO | SPEI"],
                ["company_provider_method.fx_mode", "Origem da conversao cambial.", "NONE | PROVIDER_FX"]
              ]
            },
            {
              title: "Leitura da configuracao",
              columns: ["Campo", "Uso", "Observacao"],
              rows: [
                ["company_provider.code", "Identifica a configuracao dentro da empresa.", "Permite mais de uma conta do mesmo provedor no tenant."],
                ["company_provider_method.code", "Identifica a rota habilitada.", "Ex.: MALGA_PIX, BRAINTREE_CARD, EBANX_MX_OXXO."],
                ["country_code", "Delimita a rota local quando houver.", "Usado para MX, AR, CO e outros mercados."],
                ["pricing_currency", "Moeda base do produto.", "Ex.: USD no catalogo."],
                ["buyer_currency", "Moeda cobrada no checkout.", "Ex.: MXN ou COP."],
                ["fx_mode", "Explica quem converte o valor.", "EBANX pode operar com PROVIDER_FX."]
              ]
            }
          ],
          diagram: `erDiagram
  PAYMENT_PROVIDER ||--o{ COMPANY_PROVIDER : "1:N"
  COMPANY ||--o{ COMPANY_PROVIDER : "1:N"
  COMPANY_PROVIDER ||--o{ COMPANY_PROVIDER_METHOD : "1:N"`,
          sql: `INSERT INTO payment_provider (id, code, name, status, created_at, updated_at)
VALUES
  (1, 'MALGA', 'Malga', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'BRAINTREE', 'Braintree', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 'EBANX', 'Ebanx', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 'PAYPAL', 'PayPal', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO company_provider (id, company_id, payment_provider_id, code, name, status, health_status, created_at, updated_at)
VALUES
  (1, 1, 1, 'MALGA_MAIN', 'Malga principal', 'ACTIVE', 'ONLINE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 2, 'BRAINTREE_MAIN', 'Braintree principal', 'ACTIVE', 'ONLINE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, 3, 'EBANX_LATAM', 'Ebanx Latam', 'ACTIVE', 'ONLINE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 1, 4, 'PAYPAL_MAIN', 'PayPal principal', 'ACTIVE', 'ONLINE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO company_provider_method (id, company_provider_id, code, name, payment_method_code, country_code, buyer_currency, pricing_currency, fx_mode, active, created_at, updated_at)
VALUES
  (1, 1, 'MALGA_PIX', 'Pix Malga', 'PIX', NULL, 'BRL', 'BRL', 'NONE', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 'MALGA_CARD', 'Credito Malga', 'CREDIT_CARD', NULL, 'BRL', 'BRL', 'NONE', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, 'MALGA_NUPAY', 'NuPay Malga', 'NUPAY', NULL, 'BRL', 'BRL', 'NONE', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 2, 'BRAINTREE_CARD', 'Credito Braintree', 'CREDIT_CARD', NULL, 'BRL', 'BRL', 'NONE', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 3, 'EBANX_MX_CARD', 'Credito MX Ebanx', 'CREDIT_CARD', 'MX', 'MXN', 'USD', 'PROVIDER_FX', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 3, 'EBANX_MX_OXXO', 'OXXO MX Ebanx', 'OXXO', 'MX', 'MXN', 'USD', 'PROVIDER_FX', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, 3, 'EBANX_MX_SPEI', 'SPEI MX Ebanx', 'SPEI', 'MX', 'MXN', 'USD', 'PROVIDER_FX', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (8, 4, 'PAYPAL_CARD', 'Credito PayPal', 'CREDIT_CARD', NULL, 'BRL', 'BRL', 'NONE', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
        },
        {
          id: "pagamento-fx",
          label: "Cambio",
          title: "02. Câmbio internacional por país",
          copy: `Quando a venda entra em moeda local, o preco base continua vindo do catalogo em USD. A conversao fica congelada no carrinho no momento da cotacao para que a tela nao mude depois.

O mesmo metodo pode operar com duas politicas de FX. Em alguns paises a taxa vem da API do provedor; em outros a empresa fixa uma taxa no backoffice por pais e metodo.`,
          tables: [
            {
              title: "Valores controlados",
              columns: ["Campo", "Descricao", "Valores"],
              rows: [
                ["company_provider_method_fx_rule.fx_mode", "Politica de conversao.", "PROVIDER_API | FIXED_RATE"],
                ["cart.fx_mode", "Politica aplicada no carrinho.", "PROVIDER_API | FIXED_RATE"],
                ["cart.buyer_country_code", "Pais escolhido pelo comprador.", "ISO 3166-1 alpha-2"]
              ]
            },
            {
              title: "Leitura do FX",
              columns: ["Campo", "Uso", "Observacao"],
              rows: [
                ["company_provider_method_fx_rule.fixed_rate", "Taxa fixa do backoffice.", "Usada quando fx_mode = FIXED_RATE."],
                ["cart.fx_rate", "Taxa efetivamente usada no carrinho.", "Snapshot da cotacao."],
                ["cart.fx_rate_source", "Origem da cotacao.", "Ex.: EBANX_API ou BACKOFFICE."],
                ["cart.fx_quoted_at", "Momento da cotacao.", "Congela a leitura do valor."]
              ]
            }
          ],
          diagram: `flowchart LR
  PRODUCT_VERSION[product_version USD]
  COUNTRY[buyer_country_code]
  RULE[company_provider_method_fx_rule]
  CART[cart snapshot]
  PRODUCT_VERSION --> RULE
  COUNTRY --> RULE
  RULE --> CART`,
          sql: `INSERT INTO company_provider_method_fx_rule (id, company_provider_method_id, country_code, fx_mode, fixed_rate, active, valid_from, valid_to, created_at, updated_at)
VALUES
  (1, 5, 'MX', 'PROVIDER_API', NULL, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 6, 'MX', 'PROVIDER_API', NULL, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 7, 'MX', 'FIXED_RATE', 17.25000000, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 8, 'AR', 'FIXED_RATE', 1200.00000000, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
        },
        {
          id: "pagamento-metodos",
          label: "Checkout",
          title: "03. Metodo exibido e fallback",
          copy: `O checkout exibe diretamente o \`company_provider_method\`. Isso evita uma camada extra so para nomear o metodo: o que o comprador ve e a combinacao real de provedor e meio.

\`MALGA:PIX\` pode cair para \`BRAINTREE:PIX\`, e \`MALGA:CREDIT_CARD\` pode cair para \`BRAINTREE:CREDIT_CARD\`. A regra e sempre entre metodos da empresa, nao entre labels soltas.`,
          tables: [
            {
              title: "Valores controlados",
              columns: ["Campo", "Descricao", "Valores"],
              rows: [
                ["company_provider_method.code", "Metodo visivel no checkout.", "MALGA_PIX | MALGA_CREDIT_CARD | BRAINTREE_CREDIT_CARD | EBANX_MX_OXXO"],
                ["company_provider_method.active", "Disponibilidade do metodo.", "true | false"],
                ["company_provider_method.fallback_company_provider_method_id", "Fallback do metodo.", "Aponta para outro company_provider_method da empresa."]
              ]
            },
            {
              title: "Leitura do metodo",
              columns: ["Campo", "Uso", "Observacao"],
              rows: [
                ["company_provider_method.payment_method_code", "Meio logico por baixo do metodo.", "CREDIT_CARD, PIX, SPEI, OXXO, etc."],
                ["company_provider_method.code", "Codigo publico do metodo.", "MALGA_PIX, BRAINTREE_CREDIT_CARD, etc."],
                ["fallback_company_provider_method_id", "Fallback de processamento.", "A primeira combinacao saudavel vence."]
              ]
            }
          ],
          diagram: `flowchart LR
  METHOD[payment method]
  FALLBACK[company_provider_method fallback]
  METHOD --> FALLBACK`,
          sql: `ALTER TABLE company_provider_method
ADD COLUMN fallback_company_provider_method_id INTEGER;

UPDATE company_provider_method
SET fallback_company_provider_method_id = 4
WHERE code = 'MALGA_CREDIT_CARD';

UPDATE company_provider_method
SET fallback_company_provider_method_id = 2
WHERE code = 'MALGA_PIX';`
        },
        {
          id: "pagamento-regras",
          label: "Exibicao",
          title: "04. Regras de exibicao",
          copy: `\`payment_option_rule\` define quais \`company_provider_method\` da empresa podem aparecer para um carrinho.

A leitura sempre parte da empresa do checkout. Quando existir item de empresa parceira, essa linha nao troca a configuracao do pagamento: a lista continua vindo de \`cart.company_id\`. Depois pode haver refinamento por produto, por grupo do produto e, se nao houver regra especifica, por business unit. Os niveis nao se misturam: o primeiro scope com regra ativa vence e so ele entra na lista.`,
          tables: [
            {
              title: "Valores controlados",
              columns: ["Campo", "Descricao", "Valores"],
              rows: [
                ["payment_option_rule.scope", "Nivel da regra.", "COMPANY | BUSINESS_UNIT | PRODUCT_GROUP | PRODUCT"],
                ["payment_option_rule.company_provider_method_id", "Metodo da empresa usado naquele escopo.", "Qualquer company_provider_method ativa da empresa do checkout."]
              ]
            },
            paymentScopeTable,
            {
              title: "Precedencia",
              columns: ["Chave", "Leitura", "Uso"],
              rows: [
                ["scope", "PRODUCT > PRODUCT_GROUP > BUSINESS_UNIT > COMPANY", "Primeiro nivel com regras ativas vence."],
                ["priority", "menor valor primeiro", "Ordena os metodos dentro do mesmo nivel."],
                ["company_provider_method_id", "company_provider_method da empresa", "Define a combinacao de provedor + meio associada ao escopo."],
                ["cart.business_unit_id", "So participa quando o checkout fecha em uma unica BU.", "Venda mista cai para COMPANY."]
              ]
            }
          ],
          diagram: `flowchart LR
  COMPANY[company] --> CART[cart]
  CART --> RULE[payment_option_rule]
  PRODUCT[product opcional] --> RULE
  GROUP[product_group opcional] --> RULE
  RULE --> METHOD[company_provider_method]`,
          sql: `INSERT INTO payment_option_rule (id, company_id, scope, business_unit_id, product_group_id, product_id, company_provider_method_id, priority, active, valid_from, valid_to, created_at, updated_at)
VALUES
  (1, 1, 'COMPANY', NULL, NULL, NULL, 2, 100, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 'BUSINESS_UNIT', 10, NULL, NULL, 1, 10, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (3, 1, 'BUSINESS_UNIT', 10, NULL, NULL, 2, 20, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (4, 1, 'BUSINESS_UNIT', 10, NULL, NULL, 3, 30, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (5, 1, 'BUSINESS_UNIT', 10, NULL, NULL, 4, 40, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (6, 1, 'PRODUCT_GROUP', NULL, 30, NULL, 4, 15, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (7, 1, 'PRODUCT', NULL, NULL, 20, 2, 10, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
        },
        {
          id: "pagamento-fallback",
          label: "Alta disponibilidade",
          title: "05. Fallback por metodo",
          copy: `Cada \`company_provider_method\` pode apontar para outro \`company_provider_method\` da mesma empresa como reserva. Isso permite uma fila clara entre combinacoes como \`MALGA:PIX\` e \`BRAINTREE:PIX\`, ou \`MALGA:CREDIT_CARD\` e \`BRAINTREE:CREDIT_CARD\`.

Na leitura operacional, o sistema ignora rotas inativas e provedores com \`company_provider.health_status = OFFLINE\`. A primeira rota saudavel vence.`,
          tables: [
            paymentFallbackTable,
            {
              title: "Acoes da empresa",
              columns: ["Acao", "Tabela", "Uso"],
              rows: [
                ["Tirar provedor da fila", "company_provider.health_status = OFFLINE", "Bloqueia novas tentativas naquela configuracao."],
                ["Desabilitar metodo especifico", "company_provider_method.active = false", "Remove uma combinacao provider + method sem mexer no resto da fila."],
                ["Trocar o fallback", "fallback_company_provider_method_id", "Promove o fallback a combinacao principal."]
              ]
            }
          ],
          diagram: `flowchart LR
  R1[MALGA_CARD]
  R2[BRAINTREE_CARD]
  R1 --> R2
  R1 --> DECISION{ONLINE?}
  DECISION -->|sim| TRY1[tenta Malga]
  DECISION -->|nao| TRY2[tenta Braintree]`,
          sql: `UPDATE company_provider
SET health_status = 'OFFLINE'
WHERE company_id = 1
  AND code = 'MALGA_MAIN';

UPDATE company_provider_method
SET fallback_company_provider_method_id = 4
WHERE code = 'MALGA_CREDIT_CARD';`
        },
        {
          id: "pagamento-tentativa",
          label: "Tentativa",
          title: "06. cart_payment",
          copy: `\`cart_payment\` registra uma tentativa ligada ao carrinho. Ela guarda o \`company_provider_method\` usado pelo comprador e nao precisa de uma camada separada de metodo.

Na v1, toda tentativa nasce em \`PENDING\`. Se o provedor aprovar, vai para \`APPROVED\`. Se recusar, vai para \`FAILED\`. Quando o fallback abrir uma nova tentativa automatica, a linha nova aponta para a anterior em \`fallback_from_payment_id\`.`,
          tables: [
            {
              title: "Campos de resultado",
              columns: ["Campo", "Uso", "Quando preencher"],
              rows: [
                ["company_provider_method_id", "Combinacao provider + method usada na tentativa.", "Sempre."],
                ["fallback_from_payment_id", "Liga a tentativa anterior quando houve failover.", "Quando a empresa abre nova tentativa em outra rota."],
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
            },
            {
              title: "Transicao de estados",
              columns: ["Origem", "Evento", "Destino"],
              rows: [
                ["PENDING", "aprovacao do provedor", "APPROVED"],
                ["PENDING", "recusa do provedor", "FAILED"]
              ]
            }
          ],
          sql: `INSERT INTO cart_payment (id, cart_id, company_provider_method_id, fallback_from_payment_id, amount, status, provider_reference, authorization_code, failure_code, failure_message, approved_at, failed_at, created_at, updated_at)
VALUES
  (1, 1, 2, NULL, 199.90, 'FAILED', NULL, NULL, 'provider_unavailable', 'Provider timeout before authorization.', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 1, 4, 1, 199.90, 'PENDING', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`,
          diagram: `stateDiagram-v2
  [*] --> PENDING
  PENDING --> APPROVED: aprovacao
  PENDING --> FAILED: recusa
  APPROVED --> [*]
  FAILED --> [*]`
        }
      ]
    },
    regras: {
      metaTitle: "Regras e fluxos",
      metaDescription: "Fluxos ponta a ponta do catalogo ao pagamento e regras de negocio multi-entidade.",
      badge: "Pagina 06",
      kicker: "Ponto canonico dos fluxos",
      title: "Regras de negocio e fluxos ponta a ponta",
      summary:
        "Quando uma regra atravessa mais de uma entidade, a consulta certa e esta pagina. Ela concentra as jornadas publicas, a venda parceira no checkout, a resolucao dos metodos com fallback e os exemplos de retorno do provedor.",
      tags: ["sku", "product_version.code", "bundle.code", "checkout_offer", "cart_item", "multiempresa", "fallback", "gateway"],
      panelTitle: "Use esta pagina quando",
      panelItems: [
        "precisar ver a historia completa",
        "quiser revisar um fluxo ponta a ponta",
        "buscar a regra canonica de metodos e fallback",
        "quiser exemplos de retorno do provedor"
      ],
      summaryCards: [
        {
          title: "Fluxo concentrado",
          text: "Os fluxos que cruzam catalogo, checkout e pagamento ficam aqui para evitar repeticao em outras paginas."
        },
        {
          title: "Regra primeiro, tela depois",
          text: "Cada fluxo mostra a ordem das decisoes e as tabelas afetadas em cada passo."
        },
        {
          title: "Provedor mapeado",
          text: "Os exemplos de APPROVED e FAILED mostram como os campos de cart_payment ficam preenchidos."
        }
      ],
      sidebarTitle: "Regras e fluxos",
      sidebarCopy: "Use esta pagina para validar o encadeamento completo das regras e dos fluxos.",
      sections: [
        {
          id: "fluxo-sku-checkout",
          label: "Fluxo canonico",
          title: "01. Produto por sku e oferta por code ate o carrinho",
          copy: `Na camada publica, o produto e resolvido por \`sku\` dentro da empresa. Nessa pagina comercial, podem coexistir varias \`product_version\` vigentes do mesmo produto.

Quando a jornada aponta para uma oferta especifica, a URL usa \`sku + product_version.code\`. O carrinho abre com essa versao e salva o snapshot em \`cart_item\`.

A leitura fica mais simples quando voce separa **resolucao do produto** de **resolucao da oferta**. A vitrine bate no \`sku\`. A escolha comercial bate no \`code\`. A compra fechada referencia a \`product_version\` salva no carrinho.`,
          tables: [
            {
              title: "Resolucao publica",
              columns: ["Regra", "Fonte", "Resultado"],
              rows: [
                ["sku", "product.sku", "Resolve a pagina do produto."],
                ["product_version.code", "product_version.code", "Resolve uma oferta comercial especifica dentro do produto."],
                ["ofertas vigentes", "product_version.valid_to = NULL", "A pagina do produto pode listar varias ofertas ativas ao mesmo tempo."],
                ["codigo repetido", "mais de uma linha com o mesmo code no mesmo product", "Erro de cadastro."]
              ]
            },
            {
              title: "Passos do fluxo",
              columns: ["Passo", "Tabela afetada", "Resultado"],
              rows: [
                ["Resolver empresa e sku", "company, product", "Pagina do produto correta dentro do tenant."],
                ["Listar ofertas vigentes", "product_version", "Versoes comerciais ativas exibidas para o cliente."],
                ["Resolver empresa, sku e code", "product, product_version", "Oferta comercial escolhida encontrada."],
                ["Abrir checkout", "cart", "Carrinho criado com origin_product_version_id e bundle_version_id da configuracao."],
                ["Congelar compra", "cart_item", "Snapshot da versao salvo na linha."]
              ]
            }
          ],
          diagram: `sequenceDiagram
  participant U as Usuario
  participant P as product
  participant V as product_version
  participant C as cart
  participant I as cart_item

  U->>P: acessa sku
  P->>V: lista ofertas vigentes
  V-->>U: pagina comercial com metodos
  U->>V: escolhe code da oferta
  V->>C: abre carrinho com a oferta
  C->>I: grava snapshot na compra
  I-->>U: item congelado`
        },
        {
          id: "fluxo-bundle-checkout",
          label: "Fluxo canonico",
          title: "02. Bundle.code ate o carrinho",
          copy: `A rota publica de bundle resolve \`bundle.code\` dentro da empresa, encontra a \`bundle_version\` ativa e abre o carrinho com os itens ja carregados.

Nesse fluxo, o snapshot vem da composicao versionada do bundle, nao de uma montagem linha a linha feita pelo comprador. O \`cart\` e os \`cart_item\` guardam a \`bundle_version\` usada nessa abertura.`,
          tables: [
            {
              title: "Passos do fluxo",
              columns: ["Passo", "Tabela afetada", "Resultado"],
              rows: [
                ["Resolver bundle", "bundle", "Bundle correto dentro da empresa."],
                ["Ler versao ativa", "bundle_version", "Composicao vigente encontrada."],
                ["Listar composicao", "bundle_version.composition_json", "Itens que entram no carrinho."],
                ["Abrir checkout", "cart, cart_item", "Carrinho nasce com bundle_version_id e linhas materializadas; cada linha do bundle guarda a mesma bundle_version_id."]
              ]
            }
          ],
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
  V->>I: materializa itens com bundle_version_id
  C-->>U: carrinho carregado`
        },
        {
          id: "fluxo-oferta-checkout",
          label: "Fluxo canonico",
          title: "03. Oferta opcional no checkout",
          copy: `A oferta parte de uma origem valida do checkout. Essa origem pode ser uma \`product_version\` ou uma \`bundle_version\`. Quando o comprador aceita, o checkout cria os itens adicionais necessarios em \`cart_item\`.

O ganho dessa separacao e simples: \`checkout_offer\` define a regra; \`cart_item\` registra o que foi comprado.`,
          tables: [
            {
              title: "Cenarios",
              columns: ["Cenario", "Leitura", "Snapshot"],
              rows: [
                ["Upsell", "Mesma linha, prazo maior.", "12 meses -> 24 meses."],
                ["Cross sell", "Produto de outra BU ou de empresa parceira.", "Produto A oferece Produto B."],
                ["Cortesia", "Addon escolhido gera brinde.", "Addon selecionado -> produto gratis."],
                ["Oferta sobre bundle", "Bundle ativo dispara addon no checkout.", "bundle_version -> checkout_offer -> cart_item."]
              ]
            },
            {
              title: "Estado da oferta",
              columns: ["Estado", "Leitura", "Efeito"],
              rows: [
                ["OFFERED", "Oferta exibida ao comprador.", "Aguardando decisao."],
                ["SELECTED", "Oferta aceita.", "cart_item do addon e da cortesia ficam criados."],
                ["DECLINED", "Oferta recusada.", "Nenhum item adicional e criado."],
                ["EXPIRED", "Prazo da oferta encerrou.", "Oferta nao pode mais ser selecionada."]
              ]
            },
            cartOfferSelectionTable
          ],
          diagram: `sequenceDiagram
  participant U as Usuario
  participant C as cart
  participant O as checkout_offer
  participant I as cart_item

  U->>C: abre checkout
  C->>O: carrega ofertas ativas
  U->>I: seleciona addon
  O->>I: cria cart_item addon
  O->>I: cria cart_item cortesia
  C->>I: atualiza totais`
        },
        {
          id: "fluxo-oferta-multiempresa",
          label: "Fluxo canonico",
          title: "04. Checkout parceiro: Alura + StartSe no mesmo carrinho",
          copy: `Neste fluxo, a jornada nasce na Alura, mas uma oferta opcional adiciona um item da StartSe no mesmo checkout.

O cabecalho do \`cart\` continua com \`company_id = ALURA\`. Quando o comprador aceita o ingresso parceiro, o checkout cria um novo \`cart_item\` com \`company_id = STARTSE\`. Os totais continuam sendo a soma das linhas, e a lista de metodos segue na empresa que publicou o checkout.`,
          tables: [
            {
              title: "Passos do fluxo",
              columns: ["Passo", "Tabelas afetadas", "Resultado"],
              rows: [
                ["Abrir checkout pela oferta Alura", "company, product, product_version, cart", "Carrinho nasce com company_id = ALURA."],
                ["Ler addon parceiro", "checkout_offer, product_version", "Oferta ativa aponta para o ingresso da StartSe."],
                ["Selecionar oferta", "cart_item", "Linha addon criada."],
                ["Materializar item parceiro", "cart_item", "Nova linha entra com company_id = STARTSE e BU da StartSe."],
                ["Recalcular totais", "cart, cart_item", "Subtotal e total passam a refletir as duas empresas."],
                ["Resolver pagamento", "payment_option_rule, company_provider_method", "Lista de metodos continua vindo da Alura."]
              ]
            },
            {
              title: "Snapshot do exemplo",
              columns: ["Tabela", "Dados", "Leitura"],
              rows: [
                ["cart", "company_id=ALURA | business_unit_id=NULL", "Checkout publicado pela Alura."],
                ["cart_item 1", "product_version_id=ALURA-12M | bundle_version_id=NULL | company_id=ALURA | business_unit_id=PLATAFORMA", "Linha principal da jornada."],
                ["cart_item 2", "product_version_id=STARTSE-INGRESSO | bundle_version_id=NULL | company_id=STARTSE | business_unit_id=EVENTOS", "Linha parceira adicionada pela oferta."],
                ["cart_payment", "company_provider_method_id=MALGA_PIX", "Pagamento segue o cadastro da Alura."]
              ]
            }
          ],
          diagram: `sequenceDiagram
  participant U as Usuario
  participant A as checkout Alura
  participant O as checkout_offer
  participant I as cart_item
  participant P as payment_option_rule

  U->>A: abre checkout pela oferta Alura
  A->>O: carrega addon parceiro StartSe
  U->>I: aceita ingresso parceiro
  O->>I: cria linha company_id = STARTSE
  I->>A: recalcula totais
  A->>P: resolve metodos pela ALURA
  P-->>U: exibe os metodos configurados`
        },
        {
          id: "fluxo-venda-mista",
          label: "Regra de leitura",
          title: "05. Venda mista e origem dos totais",
          copy: `A venda mista existe quando o mesmo carrinho carrega linhas de BUs diferentes, de empresas diferentes ou das duas coisas ao mesmo tempo.

O cabecalho do checkout continua apontando para a empresa que publicou a jornada. A BU do cabecalho so existe quando a venda fecha em uma unica BU dessa empresa. Os totais continuam sendo calculados pela soma dos itens do carrinho.`,
          tables: [
            {
              title: "Origem dos campos do carrinho",
              columns: ["Campo", "Fonte", "Regra"],
              rows: [
                ["company_id", "empresa que publica o checkout", "Identifica a empresa da jornada e da resolucao dos metodos."],
                ["bundle_version_id", "bundle.code resolvido", "Versao do bundle que originou o carrinho."],
                ["business_unit_id", "header do cart", "Resumo do checkout quando existir uma unica BU na empresa do checkout."],
                ["cart_item.company_id", "product.company_id", "Origem real de cada linha vendida."],
                ["cart_item.business_unit_id", "product.business_unit_id", "BU real de cada linha vendida."],
                ["cart_item.bundle_version_id", "bundle_version usada na origem", "Preenchido quando a linha veio de bundle."],
                ["buyer_reference", "sessao, token ou customer futuro", "Identifica o dono do checkout."],
                ["subtotal_amount", "soma de cart_item.total_price", "Resumo dos itens."],
                ["discount_amount", "cupom ou campanha futura", "Zero na v1."],
                ["total_amount", "subtotal_amount - discount_amount", "Total cobrado."]
              ]
            },
            {
              title: "Regra do cabecalho",
              columns: ["Cenario", "Leitura", "Uso"],
              rows: [
                ["Uma empresa e uma BU", "cart.business_unit_id preenchido", "Checkout simples."],
                ["Multiplas BUs na mesma empresa", "cart.business_unit_id = NULL", "Venda mista interna."],
                ["Empresa parceira no carrinho", "cart_item.company_id pode divergir de cart.company_id", "Venda multiempresa."]
              ]
            }
          ],
          diagram: `flowchart LR
  CART[cart]
  ITEM1[cart_item Alura]
  ITEM2[cart_item StartSe]
  TOTAL[totais do cart]

  CART --> ITEM1
  CART --> ITEM2
  ITEM1 --> TOTAL
  ITEM2 --> TOTAL`
        },
        {
          id: "fluxo-meios-pagamento",
          label: "Regra canonica",
          title: "06. Resolucao dos metodos e fallback",
          copy: `A lista de metodos parte de \`cart.company_id\`. Mesmo quando uma linha vem de empresa parceira, a empresa da linha nao redefine \`payment_option_rule\`: a resolucao continua na empresa que publicou o checkout. Depois o sistema procura o primeiro scope com regra ativa na ordem PRODUCT, PRODUCT_GROUP, BUSINESS_UNIT e COMPANY.

Quando o comprador escolhe um metodo, o sistema usa o \`company_provider_method\` resolvido pela regra e, se houver fallback, segue a cadeia da mesma empresa. Em venda mista, a regra de business unit so vale quando a compra fecha em uma unica BU da empresa do checkout. O mesmo vale para \`product_group\`: o agrupamento do cabecalho so participa quando a jornada fecha em um unico grupo.`,
          tables: [
            {
              title: "Precedencia",
              columns: ["Chave", "Leitura", "Uso"],
              rows: [
                ["scope", "PRODUCT > BUSINESS_UNIT > COMPANY", "Primeiro nivel com regras ativas vence."],
                ["priority", "menor valor primeiro", "Ordena os metodos dentro do mesmo nivel."],
                ["fallback_company_provider_method_id", "cadeia de fallback do metodo", "Define a proxima combinacao saudavel."]
              ]
            },
            paymentPriorityExamplesTable,
            paymentFallbackTable
          ],
          diagram: `flowchart LR
  COMPANY[company] --> CART[cart]
  CART --> RULE[payment_option_rule]
  PRODUCT[product opcional] --> RULE
  RULE --> METHOD[company_provider_method]`
        },
        {
          id: "fluxo-desfecho-pagamento",
          label: "Retorno externo",
          title: "07. Tentativa e desfecho do pagamento",
          copy: `A tentativa nasce em \`PENDING\`. O provedor decide se ela vira \`APPROVED\` ou \`FAILED\`.

Se a rota principal ficar indisponivel antes do desfecho, a empresa pode abrir uma nova tentativa em outra rota e ligar as duas linhas por \`fallback_from_payment_id\`. Os exemplos abaixo mostram como os campos de \`cart_payment\` ficam preenchidos de acordo com o retorno do provedor.`,
          tables: [
            {
          title: "Cenarios por metodo",
              columns: ["Metodo", "Tempo", "Estado inicial", "Estado final"],
              rows: [
                ["CARD", "Sincrono", "PENDING", "APPROVED ou FAILED"],
                ["PIX", "Assincrono", "PENDING", "APPROVED ou FAILED"],
                ["NUPAY", "Assincrono", "PENDING", "APPROVED ou FAILED"],
                ["PAYPAL", "Assincrono", "PENDING", "APPROVED ou FAILED"],
                ["OXXO", "Assincrono", "PENDING", "APPROVED ou FAILED"]
              ]
            },
            {
              title: "Impacto no cart_payment",
              columns: ["Status final", "Campos preenchidos", "Campos nulos"],
              rows: [
                ["APPROVED", "authorization_code quando existir, approved_at", "failure_code, failure_message, failed_at"],
                ["FAILED", "failure_code, failure_message, failed_at", "authorization_code, approved_at"],
                ["FAILED -> fallback", "fallback_from_payment_id na nova tentativa, company_provider_method_id da rota reserva", "Campos de sucesso continuam nulos ate nova resposta."]
              ]
            },
            gatewayExamplesTable
          ]
        }
      ]
    }
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
    PRODUCT_GROUP: [
      { name: "id", type: "Integer", description: "Identificador da linha." },
      { name: "company_id", type: "Integer", description: "Empresa dona do agrupamento." },
      { name: "business_unit_id", type: "Integer", description: "BU do agrupamento, quando ele ficar dentro de uma unica BU." },
      { name: "code", type: "Varchar", description: "Codigo do agrupamento dentro da empresa." },
      { name: "name", type: "Varchar", description: "Nome interno do agrupamento de configuracao." },
      { name: "status", type: "Varchar", description: "Disponibilidade do agrupamento de configuracao.", values: "ACTIVE | INACTIVE" },
      { name: "created_at", type: "Timestamp", description: "Data de criacao." },
      { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
    ],
    PRODUCT: [
      { name: "id", type: "Integer", description: "Identificador da linha." },
      { name: "company_id", type: "Integer", description: "Empresa dona do produto." },
      { name: "business_unit_id", type: "Integer", description: "Unidade de negocio do produto." },
      { name: "product_group_id", type: "Integer", description: "Agrupamento de configuracao do produto." },
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
      { name: "code", type: "Varchar", description: "Codigo publico da oferta comercial dentro do produto." },
      { name: "access_months", type: "Integer", description: "Periodo base da oferta." },
      { name: "bonus_months", type: "Integer", description: "Meses extras da oferta." },
      { name: "price_amount", type: "Decimal(12,2)", description: "Preco da versao comercial." },
      { name: "currency", type: "Char(3)", description: "Moeda da oferta.", values: "BRL | USD | ARS | MXN | COP" },
      { name: "valid_from", type: "Timestamp", description: "Inicio da vigencia comercial." },
      { name: "valid_to", type: "Timestamp", description: "Fim da vigencia comercial. Null enquanto a versao estiver ativa." },
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
      { name: "price_amount", type: "Decimal(12,2)", description: "Preco do combo na versao." },
      { name: "currency", type: "Char(3)", description: "Moeda do combo.", values: "BRL | USD | ARS | MXN | COP" },
      { name: "composition_json", type: "Text", description: "Snapshot da lista de produtos e quantidades do combo." },
      { name: "valid_from", type: "Timestamp", description: "Inicio da vigencia da versao." },
      { name: "valid_to", type: "Timestamp", description: "Fim da vigencia da versao. Null enquanto a versao estiver ativa." },
      { name: "created_at", type: "Timestamp", description: "Data de criacao." },
      { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
    ],
    CHECKOUT_OFFER: [
      { name: "id", type: "Integer", description: "Identificador da linha." },
      { name: "company_id", type: "Integer", description: "Empresa que publica a oferta." },
      { name: "source_product_version_id", type: "Integer", description: "Versao que dispara a oferta quando a origem e produto." },
      { name: "source_bundle_version_id", type: "Integer", description: "Bundle que dispara a oferta quando a origem e bundle." },
      { name: "offered_product_version_id", type: "Integer", description: "Versao sugerida como addon, inclusive de empresa parceira." },
      { name: "courtesy_product_version_id", type: "Integer", description: "Versao gratuita, quando houver cortesia." },
      { name: "priority", type: "Integer", description: "Ordem de exibicao da oferta." },
      { name: "active", type: "Boolean", description: "Indica se a oferta esta habilitada." },
      { name: "valid_from", type: "Timestamp", description: "Inicio da vigencia da oferta." },
      { name: "valid_to", type: "Timestamp", description: "Fim da vigencia da oferta. Null enquanto a oferta estiver ativa." },
      { name: "created_at", type: "Timestamp", description: "Data de criacao." },
      { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
    ],
    CART: [
      { name: "id", type: "Integer", description: "Identificador da linha." },
      { name: "company_id", type: "Integer", description: "Empresa que publica o checkout." },
      { name: "origin_product_version_id", type: "Integer", description: "Oferta de origem quando a jornada nasce pela rota de produto." },
      { name: "bundle_version_id", type: "Integer", description: "Versao do bundle de origem, quando houver." },
      { name: "business_unit_id", type: "Integer", description: "Unidade de negocio do cabecalho quando toda a venda fica em uma unica BU da empresa do checkout; nulo em venda mista." },
      { name: "buyer_country_code", type: "Char(2)", description: "Pais escolhido pelo comprador para precificacao local." },
      { name: "buyer_reference", type: "Varchar", description: "Referencia do comprador." },
      { name: "status", type: "Varchar", description: "Estado do checkout.", values: "DRAFT | CHECKOUT | COMPLETED | CANCELED | EXPIRED" },
      { name: "currency", type: "Char(3)", description: "Moeda do carrinho.", values: "BRL | USD | ARS | MXN | COP" },
      { name: "fx_mode", type: "Varchar", description: "Politica aplicada no carrinho.", values: "PROVIDER_API | FIXED_RATE" },
      { name: "fx_rate", type: "Decimal(18,8)", description: "Taxa efetivamente usada na cotacao do carrinho." },
      { name: "fx_rate_source", type: "Varchar", description: "Origem da taxa usada na cotacao." },
      { name: "fx_quoted_at", type: "Timestamp", description: "Momento em que a taxa foi congelada." },
      { name: "subtotal_amount", type: "Decimal(12,2)", description: "Subtotal antes de descontos." },
      { name: "subtotal_base_amount", type: "Decimal(12,2)", description: "Subtotal na moeda base antes da conversao." },
      { name: "discount_amount", type: "Decimal(12,2)", description: "Valor de desconto aplicado." },
      { name: "total_amount", type: "Decimal(12,2)", description: "Total final do carrinho." },
      { name: "total_base_amount", type: "Decimal(12,2)", description: "Total na moeda base antes da conversao." },
      { name: "expires_at", type: "Timestamp", description: "Momento de expiracao do carrinho." },
      { name: "created_at", type: "Timestamp", description: "Data de criacao." },
      { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
    ],
    CART_ITEM: [
      { name: "id", type: "Integer", description: "Identificador da linha." },
      { name: "cart_id", type: "Integer", description: "Carrinho pai." },
      { name: "product_version_id", type: "Integer", description: "Versao comercial referenciada." },
      { name: "bundle_version_id", type: "Integer", description: "Versao do bundle quando a linha foi materializada de uma composicao." },
      { name: "checkout_offer_id", type: "Integer", description: "Oferta que originou a linha, quando ela veio de addon." },
      { name: "cart_item_type", type: "Varchar", description: "Tipo da linha.", values: "BASE | ADDON | COURTESY" },
      { name: "company_id", type: "Integer", description: "Empresa congelada da linha." },
      { name: "business_unit_id", type: "Integer", description: "BU congelada da linha." },
      { name: "quantity", type: "Integer", description: "Quantidade do item." },
      { name: "base_unit_price", type: "Decimal(12,2)", description: "Preco base da oferta antes do cambio." },
      { name: "unit_price", type: "Decimal(12,2)", description: "Preco unitario no fechamento." },
      { name: "base_total_price", type: "Decimal(12,2)", description: "Total base antes do cambio." },
      { name: "total_price", type: "Decimal(12,2)", description: "Total do item." },
      { name: "access_months", type: "Integer", description: "Periodo base congelado." },
      { name: "bonus_months", type: "Integer", description: "Bonus congelado." },
      { name: "total_access_months", type: "Integer", description: "Prazo final entregue." },
      { name: "created_at", type: "Timestamp", description: "Data de criacao." },
      { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
    ],
    COMPANY_PROVIDER_METHOD_FX_RULE: [
      { name: "id", type: "Integer", description: "Identificador da linha." },
      { name: "company_provider_method_id", type: "Integer", description: "Metodo do provedor que recebe a regra." },
      { name: "country_code", type: "Char(2)", description: "Pais para o qual a regra vale." },
      { name: "fx_mode", type: "Varchar", description: "Politica de conversao.", values: "PROVIDER_API | FIXED_RATE" },
      { name: "fixed_rate", type: "Decimal(18,8)", description: "Taxa fixa quando a politica nao vier do provedor." },
      { name: "active", type: "Boolean", description: "Indica se a regra esta habilitada." },
      { name: "valid_from", type: "Timestamp", description: "Inicio da vigencia da regra." },
      { name: "valid_to", type: "Timestamp", description: "Fim da vigencia da regra." },
      { name: "created_at", type: "Timestamp", description: "Data de criacao." },
      { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
    ],
    PAYMENT_PROVIDER: [
      { name: "id", type: "Integer", description: "Identificador da linha." },
      { name: "code", type: "Varchar", description: "Codigo global do provedor.", values: "MALGA | BRAINTREE | EBANX | PAYPAL" },
      { name: "name", type: "Varchar", description: "Nome comercial do provedor." },
      { name: "status", type: "Varchar", description: "Disponibilidade do provedor no catalogo.", values: "ACTIVE | INACTIVE" },
      { name: "created_at", type: "Timestamp", description: "Data de criacao." },
      { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
    ],
    COMPANY_PROVIDER: [
      { name: "id", type: "Integer", description: "Identificador da linha." },
      { name: "company_id", type: "Integer", description: "Empresa dona da configuracao." },
      { name: "payment_provider_id", type: "Integer", description: "Provedor do catalogo ligado a empresa." },
      { name: "code", type: "Varchar", description: "Codigo da configuracao dentro da empresa." },
      { name: "name", type: "Varchar", description: "Nome operacional da configuracao." },
      { name: "status", type: "Varchar", description: "Disponibilidade administrativa da configuracao.", values: "ACTIVE | INACTIVE" },
      { name: "health_status", type: "Varchar", description: "Estado operacional da configuracao.", values: "ONLINE | DEGRADED | OFFLINE" },
      { name: "created_at", type: "Timestamp", description: "Data de criacao." },
      { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
    ],
    COMPANY_PROVIDER_METHOD: [
      { name: "id", type: "Integer", description: "Identificador da linha." },
      { name: "company_provider_id", type: "Integer", description: "Configuracao do provedor dona da rota." },
      { name: "code", type: "Varchar", description: "Codigo da rota dentro da configuracao." },
      { name: "name", type: "Varchar", description: "Nome operacional da rota." },
      { name: "payment_method_code", type: "Varchar", description: "Meio habilitado na rota.", values: "PIX | CREDIT_CARD | DEBIT_CARD | NUPAY | BOLETO | OXXO | SPEI" },
      { name: "country_code", type: "Char(2)", description: "Pais da rota local, quando houver." },
      { name: "buyer_currency", type: "Char(3)", description: "Moeda cobrada do comprador." },
      { name: "pricing_currency", type: "Char(3)", description: "Moeda base do preco no catalogo." },
      { name: "fx_mode", type: "Varchar", description: "Origem da conversao cambial.", values: "NONE | PROVIDER_FX" },
      { name: "active", type: "Boolean", description: "Indica se a rota esta habilitada." },
      { name: "created_at", type: "Timestamp", description: "Data de criacao." },
      { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
    ],
    PAYMENT_OPTION_RULE: [
      { name: "id", type: "Integer", description: "Identificador da linha." },
      { name: "company_id", type: "Integer", description: "Empresa dona da regra." },
      { name: "scope", type: "Varchar", description: "Nivel da regra.", values: "COMPANY | BUSINESS_UNIT | PRODUCT_GROUP | PRODUCT" },
      { name: "business_unit_id", type: "Integer", description: "Unidade de negocio da regra, quando houver." },
      { name: "product_group_id", type: "Integer", description: "Grupo de produto da regra, quando houver." },
      { name: "product_id", type: "Integer", description: "Produto da excecao, quando houver." },
      { name: "company_provider_method_id", type: "Integer", description: "Rota da empresa associada ao escopo." },
      { name: "priority", type: "Integer", description: "Ordem de precedencia dentro do escopo." },
      { name: "active", type: "Boolean", description: "Indica se a regra esta habilitada." },
      { name: "valid_from", type: "Timestamp", description: "Inicio da vigencia da regra." },
      { name: "valid_to", type: "Timestamp", description: "Fim da vigencia da regra." },
      { name: "created_at", type: "Timestamp", description: "Data de criacao." },
      { name: "updated_at", type: "Timestamp", description: "Data da ultima atualizacao." }
    ],
    CART_PAYMENT: [
      { name: "id", type: "Integer", description: "Identificador da linha." },
      { name: "cart_id", type: "Integer", description: "Carrinho da tentativa." },
      { name: "company_provider_method_id", type: "Integer", description: "Rota real usada na tentativa." },
      { name: "fallback_from_payment_id", type: "Integer", description: "Tentativa anterior quando houve failover." },
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

  return {
    siteNavigation,
    sitePages,
    entityAttributes
  };
})();
