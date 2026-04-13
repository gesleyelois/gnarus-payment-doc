window.DOC_SITE = (() => {
  const cartOfferSelectionTable = {
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
  };

  const paymentResolutionTable = {
    title: "Resolucao dos meios",
    columns: ["Nivel", "Fonte", "Uso"],
    rows: [
      ["PRODUCT", "payment_method_rule.scope = PRODUCT", "Override para um produto especifico."],
      ["BUSINESS_UNIT", "payment_method_rule.scope = BUSINESS_UNIT", "Regra para uma unidade de negocio da empresa."],
      ["SEGMENT", "payment_method_rule.scope = SEGMENT", "Regra padrao para B2C, B2B ou B2B2C."],
      ["GLOBAL", "payment_method_rule.scope = GLOBAL", "Fallback quando nao houver regra mais especifica."]
    ]
  };

  const paymentPriorityExamplesTable = {
    title: "Exemplos de prioridade",
    columns: ["Cenario", "Regras que batem", "Ordem final"],
    rows: [
      ["B2B na empresa A", "SEGMENT:B2B com CARD(10)", "CARD"],
      ["B2C na empresa A", "SEGMENT:B2C com PIX(10), NUPAY(20), CARD(30), PAYPAL(40)", "PIX, NUPAY, CARD, PAYPAL"],
      ["BU EDU na empresa A", "BUSINESS_UNIT:EDU com PIX(5), CARD(10)", "PIX, CARD"],
      ["PRODUCT_I em B2C", "PRODUCT:PRODUCT_I com PIX(1), CARD(2)", "PIX, CARD"],
      ["Fallback global", "GLOBAL com CARD(100)", "CARD"]
    ]
  };

  const gatewayExamplesTable = {
    title: "Exemplos de retorno do gateway",
    columns: ["Cenario", "provider_reference", "authorization_code", "failure_code", "failure_message", "status"],
    rows: [
      ["APPROVED / CARD", "pi_3QxjD9xQ9M7A1B2C3D4", "832741", "NULL", "NULL", "APPROVED"],
      ["FAILED / CARD", "pi_3QxjD9xQ9M7A1B2C3D4", "NULL", "card_declined", "The card was declined.", "FAILED"],
      ["APPROVED / PIX", "E2E123456789012345678901234567890", "NULL", "NULL", "NULL", "APPROVED"],
      ["FAILED / PIX", "E2E123456789012345678901234567890", "NULL", "expired", "Payment QR code expired.", "FAILED"]
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
      description: "Carrinho, snapshot e venda mista",
      href: "./checkout.html"
    },
    {
      id: "pagamento",
      step: "05",
      label: "Pagamento",
      description: "Meios, regras e tentativa",
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
        "Esta wiki explica a modelagem por etapas. A leitura comeca no tenant, passa pelo catalogo, entra no checkout, chega ao pagamento e fecha nos fluxos que cruzam mais de uma entidade.",
      tags: ["Empresa", "Catalogo", "Bundle", "Checkout", "Pagamento", "Fluxos"],
      panelTitle: "Voce vai entender",
      panelItems: [
        "qual pagina ler primeiro",
        "onde cada conceito mora",
        "como a modelagem se conecta",
        "em qual pagina esta o fluxo canonico"
      ],
      summaryCards: [
        {
          title: "Leitura guiada",
          text: "Cada pagina resolve uma pergunta especifica. A narrativa avanca do conceito mais estavel para o fluxo mais operacional."
        },
        {
          title: "Sem mudar a modelagem",
          text: "A documentacao foi reorganizada para clareza. Nenhuma tabela, campo, estado ou regra foi alterado."
        },
        {
          title: "Fluxo canonico",
          text: "Os fluxos que cruzam catalogo, checkout e pagamento ficam concentrados em Regras e fluxos."
        }
      ],
      sidebarTitle: "Inicio",
      sidebarCopy: "Use esta pagina para entender a ordem da documentacao antes de entrar nos detalhes.",
      sections: [
        {
          id: "intro-linha-de-leitura",
          label: "Comece por aqui",
          title: "01. Linha de leitura",
          copy: `A melhor forma de ler esta wiki e seguir a mesma ordem em que o sistema toma decisoes.

Primeiro voce precisa saber **quem e a empresa** e onde a **business unit** entra. Depois faz sentido entender **o catalogo**, ou seja, produto, versao comercial, bundle e oferta configurada. So entao vale entrar no **checkout**, porque o carrinho guarda um snapshot do que veio do catalogo. O **pagamento** fecha a jornada com meios disponiveis, tentativa e desfecho.

Se voce quiser ver a historia completa, do acesso publico ao retorno do gateway, termine em [Regras e fluxos](./regras.html).`,
          tables: [
            {
              title: "Ordem sugerida",
              columns: ["Pagina", "Pergunta que responde", "Saida da leitura"],
              rows: [
                ["Inicio", "Qual e a linha de raciocinio da wiki?", "Mapa geral e ordem da documentacao."],
                ["Empresa", "Quem define o tenant e o recorte interno?", "company, business_unit e camadas da modelagem."],
                ["Catalogo", "O que pode ser vendido?", "product, product_version, bundle e checkout_offer."],
                ["Checkout", "O que fica congelado na compra?", "cart, cart_item, cart_offer e venda mista."],
                ["Pagamento", "Como o meio aparece e como a tentativa termina?", "payment_method, payment_method_rule e cart_payment."],
                ["Regras e fluxos", "Como tudo se encadeia do inicio ao fim?", "Jornadas ponta a ponta e regras de negocio."]
              ]
            }
          ]
        },
        {
          id: "intro-mapa-geral",
          label: "Mapa da wiki",
          title: "02. Mapa geral da modelagem",
          copy: `A documentacao esta dividida pelas mesmas camadas usadas para explicar a modelagem.

Cada camada tem uma responsabilidade clara. Isso evita que empresa, catalogo, checkout e pagamento fiquem misturados na leitura.`,
          tables: [
            {
              title: "Camadas",
              columns: ["Camada", "Foco", "Entidades principais"],
              rows: [
                ["Empresa", "Tenant e recortes internos.", "company, business_unit"],
                ["Catalogo", "O que pode ser vendido e em que versao.", "product, product_version"],
                ["Bundle e ofertas", "Composicoes e sugestoes opcionais.", "bundle, bundle_version, bundle_item, checkout_offer"],
                ["Checkout", "Snapshot da compra.", "cart, cart_item, cart_offer"],
                ["Pagamento", "Disponibilidade de meios e desfecho da tentativa.", "payment_method, payment_method_rule, cart_payment"]
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

O objetivo nao e decorar nomes de tabela. O objetivo e entender o papel de cada conceito no fluxo.`,
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
                ["bundle_version", "Composicao historica de um bundle.", "Catalogo"],
                ["checkout_offer", "Oferta opcional mostrada no checkout.", "Catalogo"],
                ["cart", "Cabecalho do checkout.", "Checkout"],
                ["cart_item", "Snapshot da linha comprada.", "Checkout"],
                ["cart_payment", "Tentativa de pagamento.", "Pagamento"]
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
        "Esta pagina trava o vocabulario base do sistema. company define o tenant; business_unit define o recorte interno; o resto da modelagem se organiza em camadas acima dessa base.",
      tags: ["company", "business_unit", "tenant", "camadas", "identificadores"],
      panelTitle: "Leia esta pagina para",
      panelItems: [
        "entender o tenant da venda",
        "saber onde a BU entra",
        "mapear as camadas da modelagem",
        "ver onde cada tabela se encaixa"
      ],
      summaryCards: [
        {
          title: "Tenant primeiro",
          text: "Quase toda entidade relevante carrega company_id porque a consulta sempre acontece dentro da empresa."
        },
        {
          title: "BU como recorte",
          text: "business_unit organiza o catalogo e as regras internas. No checkout ela pode aparecer no cabecalho ou so nas linhas."
        },
        {
          title: "Mapa por camadas",
          text: "A visao geral da secao Empresa mostra catalogo, bundle, ofertas, checkout e pagamento em blocos separados."
        }
      ],
      sidebarTitle: "Empresa",
      sidebarCopy: "Entenda o tenant e o mapa geral antes de entrar em produto, carrinho e pagamento.",
      sections: [
        {
          id: "empresa-fundamentos",
          label: "Fundamento",
          title: "01. Empresa e unidade de negocio",
          copy: `\`company\` define o tenant. Toda consulta publica, todo carrinho e toda regra de pagamento partem dessa empresa.

\`business_unit\` e um recorte dentro da empresa. Ela organiza o catalogo e pode restringir algumas regras. Nem todo carrinho termina em uma unica BU, por isso o cabecalho do carrinho pode ficar sem \`business_unit_id\` quando a venda mistura linhas de BUs diferentes.`,
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
                ["company", "Tenant da venda.", "Delimita catalogo, checkout e pagamento."],
                ["business_unit", "Recorte interno da empresa.", "Organiza produto e pode participar da resolucao dos meios."],
                ["product", "Item de catalogo da empresa.", "Sempre aponta para uma BU."],
                ["cart", "Checkout da empresa.", "Pode ter BU unica ou ficar nulo em venda mista."]
              ]
            }
          ],
          diagram: `erDiagram
  COMPANY ||--o{ BUSINESS_UNIT : "1:N"
  COMPANY ||--o{ PRODUCT : "1:N"
  BUSINESS_UNIT ||--o{ PRODUCT : "0:N"
  COMPANY ||--o{ CART : "1:N"
  BUSINESS_UNIT ||--o{ CART : "0:N"`
        },
        {
          id: "empresa-identificadores",
          label: "Leitura publica",
          title: "02. Identificadores dentro do tenant",
          copy: `O sistema precisa de codigos publicos para resolver empresa, produto, bundle e meio de pagamento sem ambiguidade.

Esses codigos nao sao globais. Eles sao unicos **dentro da empresa**. Isso permite que empresas diferentes usem o mesmo \`sku\` ou o mesmo codigo de meio sem colidir entre si.`,
          tables: [
            {
              title: "Identificacao por tenant",
              columns: ["Campo", "Regra", "Exemplo"],
              rows: [
                ["company.code", "Identificador publico da empresa.", "GROUP_A"],
                ["business_unit.code", "Unico por company.", "EDU"],
                ["product.sku", "Unico por company.", "PLUS"],
                ["bundle.code", "Unico por company.", "BUNDLE-PLUS"],
                ["payment_method.code", "Unico por company.", "PIX"]
              ]
            },
            {
              title: "Contexto de uso",
              columns: ["Tabela", "company_id", "business_unit_id", "Leitura"],
              rows: [
                ["product", "obrigatorio", "obrigatorio", "Catalogo da empresa."],
                ["bundle", "obrigatorio", "opcional", "Composicao publica da empresa."],
                ["checkout_offer", "obrigatorio", "-", "Oferta opcional ligada ao catalogo."],
                ["cart", "obrigatorio", "opcional", "Checkout da empresa."],
                ["cart_item", "via cart", "obrigatorio", "Snapshot da linha comprada."],
                ["payment_method", "obrigatorio", "-", "Meio liberado por empresa."],
                ["payment_method_rule", "obrigatorio", "opcional", "Regra aplicada dentro da empresa."]
              ]
            }
          ]
        },
        {
          id: "empresa-camadas",
          label: "Mapa geral",
          title: "03. Camadas da modelagem",
          copy: `A melhor forma de ler a secao Empresa e enxergar a modelagem por blocos. Isso evita um ER unico com muitas arestas e ajuda a separar cadastro, composicao, checkout e pagamento.

Os detalhes de cada bloco aparecem nas proximas paginas. Aqui o objetivo e fixar **onde cada entidade mora**.`,
          tables: [
            {
              title: "Camadas da modelagem",
              columns: ["Camada", "Entidades", "Leitura"],
              rows: [
                ["Catalogo", "company, business_unit, product, product_version", "Cadastro e historico comercial."],
                ["Bundle", "bundle, bundle_version, bundle_item", "Composicao publica versionada."],
                ["Ofertas", "checkout_offer, cart_offer", "Addons opcionais no checkout."],
                ["Checkout", "cart, cart_item", "Snapshot da compra."],
                ["Pagamento", "payment_method, payment_method_rule, cart_payment", "Meios e desfecho da tentativa."]
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
  end

  subgraph PAGAMENTO_GROUP["Pagamento"]
    PAYMENT_METHOD[payment_method]
    PAYMENT_METHOD_RULE[payment_method_rule]
    CART_PAYMENT[cart_payment]
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

  COMPANY --> PAYMENT_METHOD
  COMPANY --> PAYMENT_METHOD_RULE
  BUSINESS_UNIT --> PAYMENT_METHOD_RULE
  PRODUCT --> PAYMENT_METHOD_RULE
  PAYMENT_METHOD --> PAYMENT_METHOD_RULE
  PAYMENT_METHOD --> CART_PAYMENT
  CART --> CART_PAYMENT`,
          subsections: [
            {
              id: "empresa-camadas-catalogo",
              title: "Catalogo",
              copy: `Aqui vivem empresa, unidade de negocio, produto e versao comercial. E a camada que responde **o que a empresa vende**.`,
              diagram: `erDiagram
  COMPANY ||--o{ BUSINESS_UNIT : "1:N"
  COMPANY ||--o{ PRODUCT : "1:N"
  BUSINESS_UNIT ||--o{ PRODUCT : "0:N"
  PRODUCT ||--o{ PRODUCT_VERSION : "1:N"`
            },
            {
              id: "empresa-camadas-bundle",
              title: "Bundle",
              copy: `Bundle e uma composicao publica predefinida. \`bundle_version\` guarda o historico da composicao e \`bundle_item\` aponta a versao comercial que entra nela.`,
              diagram: `erDiagram
  COMPANY ||--o{ BUNDLE : "1:N"
  BUSINESS_UNIT ||--o{ BUNDLE : "0:N"
  BUNDLE ||--o{ BUNDLE_VERSION : "1:N"
  BUNDLE_VERSION ||--o{ BUNDLE_ITEM : "1:N"
  PRODUCT_VERSION ||--o{ BUNDLE_ITEM : "1:N"`
            },
            {
              id: "empresa-camadas-ofertas",
              title: "Ofertas",
              copy: `\`checkout_offer\` configura o addon antes do checkout. \`cart_offer\` registra o que aconteceu quando a oferta foi exibida para o comprador.`,
              diagram: `flowchart LR
  SOURCE[product_version origem] --> RULE[checkout_offer]
  RULE --> OFFERED[cart_offer]
  OFFERED --> ADDON[cart_item addon]
  OFFERED --> COURTESY[cart_item cortesia]`
            },
            {
              id: "empresa-camadas-checkout",
              title: "Checkout",
              copy: `A camada de checkout guarda o snapshot da compra. O carrinho nao depende de reler o catalogo para saber o que foi vendido.`,
              diagram: `erDiagram
  COMPANY ||--o{ CART : "1:N"
  BUSINESS_UNIT ||--o{ CART : "0:N"
  BUNDLE_VERSION ||--o{ CART : "0:N"
  CART ||--o{ CART_ITEM : "1:N"
  PRODUCT_VERSION ||--o{ CART_ITEM : "1:N"`
            },
            {
              id: "empresa-camadas-pagamento",
              title: "Pagamento",
              copy: `A camada de pagamento define quais meios podem aparecer e registra o desfecho da tentativa em \`cart_payment\`.`,
              diagram: `erDiagram
  COMPANY ||--o{ PAYMENT_METHOD : "1:N"
  COMPANY ||--o{ PAYMENT_METHOD_RULE : "1:N"
  BUSINESS_UNIT ||--o{ PAYMENT_METHOD_RULE : "0:N"
  PRODUCT ||--o{ PAYMENT_METHOD_RULE : "0:N"
  PAYMENT_METHOD ||--o{ PAYMENT_METHOD_RULE : "1:N"
  PAYMENT_METHOD ||--o{ CART_PAYMENT : "1:N"`
            }
          ]
        }
      ]
    },
    catalogo: {
      metaTitle: "Catalogo",
      metaDescription: "Produto, versao comercial, bundle versionado e oferta configurada.",
      badge: "Pagina 03",
      kicker: "O que pode ser vendido",
      title: "Catalogo, versao comercial e composicao",
      summary:
        "Esta pagina explica o que nasce no catalogo antes do checkout existir: produto, versao comercial, bundle versionado e oferta configurada para o checkout.",
      tags: ["product", "product_version", "bundle", "bundle_version", "checkout_offer"],
      panelTitle: "Voce vai sair sabendo",
      panelItems: [
        "o papel de product e product_version",
        "quando nasce uma nova versao comercial",
        "como bundle se diferencia de checkout_offer",
        "o que vem pronto para o checkout"
      ],
      summaryCards: [
        {
          title: "Produto nao vira periodo",
          text: "O produto continua o mesmo. Periodo, bonus, preco e vigencia ficam em product_version."
        },
        {
          title: "Bundle e pre-carregado",
          text: "Bundle abre o carrinho com itens materializados. Ele nao substitui a oferta opcional do checkout."
        },
        {
          title: "Oferta e opcional",
          text: "checkout_offer so configura a sugestao. A materializacao final aparece em cart_offer no checkout."
        }
      ],
      sidebarTitle: "Catalogo",
      sidebarCopy: "Tudo o que o checkout consome nasce aqui: produto, versao, bundle e oferta configurada.",
      sections: [
        {
          id: "catalogo-produto",
          label: "Catalogo base",
          title: "01. Produto",
          copy: `\`product\` e o item de catalogo da empresa. Ele identifica **o que esta sendo vendido**.

\`company_id\` delimita o tenant e \`business_unit_id\` e obrigatorio. O \`sku\` identifica o produto na camada publica dentro da empresa.

O produto sozinho ainda nao traz prazo, preco ou bonus. Esses dados ficam em \`product_version\`, que tambem passa a carregar o codigo publico da oferta comercial.`,
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
              rows: [["status", "Disponibilidade do produto.", "ACTIVE | INACTIVE"]]
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
  PRODUCT {
    INTEGER id
    VARCHAR sku
    VARCHAR name
  }
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
          sql: `INSERT INTO product (id, company_id, business_unit_id, sku, name, description, status, created_at, updated_at)
VALUES
  (1, 1, 1, 'CURSO-IA', 'Curso de IA aplicado', 'Produto digital principal', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
        },
        {
          id: "catalogo-versao-comercial",
          label: "Oferta comercial",
          title: "02. Versao comercial",
          copy: `\`product_version\` define **como aquele produto esta sendo vendido em um periodo especifico**.

Aqui moram prazo, bonus, preco, moeda e vigencia. Aqui tambem mora \`code\`, que identifica publicamente a oferta comercial dentro do produto. Quando algum desses termos muda, nasce uma nova linha. A linha antiga continua existindo como historico.

\`valid_to\` nulo significa "versao ainda vigente". Nao significa "acesso vitalicio".`,
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
              copy: `A versao antiga nao e sobrescrita. Ela recebe \`valid_to\` e uma nova linha passa a valer a partir do novo \`valid_from\`.

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

\`bundle_version\` guarda o historico da composicao. \`bundle_item\` pertence a essa versao e aponta para a \`product_version\` que entra na composicao.

O fluxo ponta a ponta de abertura por \`bundle.code\` esta em [Regras e fluxos](./regras.html#fluxo-bundle-checkout).`,
          tables: [
            {
              title: "Contexto do bundle",
              columns: ["Campo", "Regra", "Leitura"],
              rows: [
                ["bundle.company_id", "Obrigatorio.", "Bundle pertence a empresa."],
                ["bundle.business_unit_id", "Opcional.", "Preenchido quando a composicao fica em uma unica BU."],
                ["bundle.code", "Unico por company.", "Identificador publico do bundle."],
                ["cart.bundle_version_id", "Opcional no carrinho.", "Snapshot da versao usada na abertura."]
              ]
            },
            {
              title: "Regras do versionamento",
              columns: ["Regra", "Leitura", "Efeito"],
              rows: [
                ["Uma bundle_version ativa por bundle", "Mais de uma ativa e erro de cadastro.", "A rota publica nao pode escolher uma composicao arbitraria."],
                ["bundle_item pertence a bundle_version", "A composicao fica presa ao historico da versao.", "O carrinho materializa exatamente aquela composicao."],
                ["Bundle e pre-carregado", "Nao depende de selecao posterior para existir.", "Abre o carrinho com itens prontos."]
              ]
            }
          ],
          diagram: `erDiagram
  COMPANY ||--o{ BUNDLE : "1:N"
  BUSINESS_UNIT ||--o{ BUNDLE : "0:N"
  BUNDLE ||--o{ BUNDLE_VERSION : "1:N"
  BUNDLE_VERSION ||--o{ BUNDLE_ITEM : "1:N"
  PRODUCT_VERSION ||--o{ BUNDLE_ITEM : "1:N"`,
          subsections: [
            {
              id: "catalogo-bundle-abertura",
              title: "O que o checkout recebe",
              copy: `Quando a rota publica resolve \`bundle.code\`, ela carrega a \`bundle_version\` ativa e cria o carrinho com \`bundle_version_id\`.

Os itens da composicao deixam de ser apenas cadastro e passam a existir como \`cart_item\` no checkout.`,
              tables: [
                {
                  title: "Passos resumidos",
                  columns: ["Passo", "Origem", "Resultado"],
                  rows: [
                    ["Resolver bundle", "bundle.code", "bundle da empresa encontrado."],
                    ["Escolher versao", "bundle_version ativa", "snapshot da composicao definido."],
                    ["Materializar itens", "bundle_item", "linhas em cart_item."],
                    ["Abrir carrinho", "cart", "checkout pronto para pagamento."]
                  ]
                }
              ]
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
  (2, 1, 21, 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
        },
        {
          id: "catalogo-oferta-configurada",
          label: "Addon opcional",
          title: "04. Oferta configurada para o checkout",
          copy: `\`checkout_offer\` modela uma sugestao opcional mostrada durante o checkout. Ela liga uma versao de origem a uma versao ofertada.

O addon pode ser a mesma linha em outra versao ou um produto de outra BU. Quando houver cortesia, a configuracao ja deixa claro qual \`product_version\` gratuita entra junto com a selecao.

Nesta pagina voce entende a configuracao. A decisao do comprador e a materializacao em \`cart_offer\` aparecem em [Checkout](./checkout.html#checkout-oferta-materializada).`,
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
                ["company_id", "Obrigatorio.", "Oferta pertence a empresa."],
                ["source_product_version_id", "Obrigatorio.", "Versao que dispara a oferta."],
                ["offered_product_version_id", "Obrigatorio.", "Addon sugerido; pode ser upsell ou cross-sell."],
                ["courtesy_product_version_id", "Opcional.", "Produto gratuito quando o addon e selecionado."],
                ["priority", "Menor valor primeiro.", "Define a ordem quando houver mais de uma oferta ativa."]
              ]
            }
          ],
          diagram: `flowchart LR
  SOURCE[product_version origem] --> OFFER_RULE[checkout_offer]
  OFFER_RULE --> ADDON[product_version ofertada]
  OFFER_RULE --> COURTESY[product_version cortesia]`
        }
      ]
    },
    checkout: {
      metaTitle: "Checkout",
      metaDescription: "Carrinho, snapshot da compra, materializacao da oferta e venda mista.",
      badge: "Pagina 04",
      kicker: "Snapshot da compra",
      title: "Checkout, itens e selecao do comprador",
      summary:
        "Esta pagina mostra o que o checkout congela no momento da compra: o cabecalho do carrinho, os itens materializados, a selecao de oferta e o comportamento de uma venda mista.",
      tags: ["cart", "cart_item", "cart_offer", "snapshot", "venda mista"],
      panelTitle: "Esta pagina explica",
      panelItems: [
        "o que fica no cart",
        "o que o cart_item copia da versao comercial",
        "como a oferta vira item adicional",
        "quando o cabecalho do carrinho perde a BU"
      ],
      summaryCards: [
        {
          title: "Snapshot vale mais que releitura",
          text: "Ao reabrir o checkout, a interface usa cart_item.product_version_id e os campos congelados no item."
        },
        {
          title: "BU por linha",
          text: "Quando a venda mistura unidades de negocio, a BU sai do cabecalho e fica obrigatoria em cada cart_item."
        },
        {
          title: "Oferta vira registro",
          text: "A configuracao do addon nasce em checkout_offer, mas a resposta do comprador fica em cart_offer."
        }
      ],
      sidebarTitle: "Checkout",
      sidebarCopy: "Aqui a modelagem deixa de ser cadastro e passa a registrar a compra em andamento.",
      sections: [
        {
          id: "checkout-carrinho",
          label: "Cabecalho da compra",
          title: "01. Carrinho",
          copy: `\`cart\` representa o checkout da empresa. Ele carrega o contexto geral da venda: empresa, segmento comercial, bundle de origem quando houver, totais e status.

\`business_unit_id\` no cabecalho e opcional. Ele so fica preenchido quando a venda inteira fecha em uma unica BU.`,
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
  CART ||--o{ CART_OFFER : "1:N"
  CART ||--o{ CART_PAYMENT : "1:N"`
        },
        {
          id: "checkout-snapshot",
          label: "Linha congelada",
          title: "02. Snapshot do item",
          copy: `\`cart_item\` grava a versao comercial escolhida no momento da compra. Isso inclui prazo, bonus, preco, quantidade e BU da linha.

O checkout nao depende de reler \`product_version\` para reconstruir esse item. Ele ja carrega o snapshot necessario para mostrar a compra de novo.`,
          tables: [
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
            }
          ],
          subsections: [
            {
              id: "checkout-snapshot-exemplo",
              title: "Exemplo do snapshot",
              copy: `A oferta ativa de 12 meses com 2 meses de bonus entra no carrinho como 14 meses de acesso.

O fluxo completo do \`sku\` e \`product_version.code\` ate o pagamento esta em [Regras e fluxos](./regras.html#fluxo-sku-checkout). Aqui o foco e ver o que fica salvo na linha.`,
              tables: [
                {
                  title: "Snapshot do exemplo",
                  columns: ["Tabela", "Dados", "Leitura"],
                  rows: [
                    ["product_version", "id=2 | code=12m-bonus-2 | access_months=12 | bonus_months=2 | price_amount=199.90", "Oferta usada no fechamento."],
                    ["cart_item", "product_version_id=2 | business_unit_id=1 | quantity=1 | access_months=12 | bonus_months=2 | total_access_months=14 | unit_price=199.90", "Snapshot da linha."],
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
          sql: `INSERT INTO cart (id, company_id, bundle_version_id, business_unit_id, buyer_reference, commercial_segment, status, currency, subtotal_amount, discount_amount, total_amount, expires_at, created_at, updated_at)
VALUES
  (1, 1, 1, NULL, 'BUYER-1001', 'B2C', 'DRAFT', 'BRL', 199.90, 0.00, 199.90, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO cart_item (id, cart_id, product_version_id, business_unit_id, quantity, unit_price, total_price, access_months, bonus_months, total_access_months, created_at, updated_at)
VALUES
  (1, 1, 2, 1, 1, 199.90, 199.90, 12, 2, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
        },
        {
          id: "checkout-oferta-materializada",
          label: "Resposta do comprador",
          title: "03. Oferta materializada no checkout",
          copy: `\`cart_offer\` registra a oferta exibida e a decisao do comprador. E aqui que a sugestao configurada em \`checkout_offer\` vira um fato no checkout.

Se a oferta for aceita, o carrinho cria o item addon e, quando houver, o item de cortesia. Se for recusada, o registro continua servindo como historico da exibicao.`,
          tables: [
            {
              title: "Valores controlados",
              columns: ["Campo", "Descricao", "Valores"],
              rows: [["cart_offer.status", "Estado da selecao da oferta.", "OFFERED | SELECTED | DECLINED | EXPIRED"]]
            },
            cartOfferSelectionTable
          ],
          diagram: `flowchart LR
  SOURCE[cart_item origem] --> OFFER_RULE[checkout_offer]
  OFFER_RULE --> CART_OFFER[cart_offer]
  CART_OFFER --> ADDON[cart_item addon]
  CART_OFFER --> COURTESY[cart_item cortesia]`
        },
        {
          id: "checkout-venda-mista",
          label: "Mais de uma BU",
          title: "04. Venda mista",
          copy: `Uma venda mista acontece quando o mesmo carrinho carrega linhas de business units diferentes.

Nesse caso, o cabecalho continua ligado a \`company\` e ao segmento comercial, mas o \`business_unit_id\` do \`cart\` fica nulo. A BU passa a ser lida linha por linha em \`cart_item\`.`,
          tables: [
            {
              title: "Exemplo de linhas",
              columns: ["Tabela", "Dados", "Leitura"],
              rows: [
                ["cart", "company_id=1 | business_unit_id=NULL | commercial_segment=B2C", "Carrinho com mais de uma BU."],
                ["cart_item 1", "product_version_id=10 | business_unit_id=EDU | quantity=1", "Linha da BU EDU."],
                ["cart_item 2", "product_version_id=21 | business_unit_id=EVENTOS | quantity=2", "Linha da BU EVENTOS."]
              ]
            },
            {
              title: "Regra",
              columns: ["Cenario", "Leitura", "Uso"],
              rows: [
                ["Uma BU", "cart.business_unit_id preenchido", "Checkout simples."],
                ["Multiplas BUs", "cart.business_unit_id = NULL", "Venda mista."],
                ["Bundle", "varios cart_item no mesmo carrinho", "Composicao pre-carregada."]
              ]
            }
          ],
          diagram: `flowchart LR
  CART[cart] --> ITEM1[cart_item EDU]
  CART --> ITEM2[cart_item EVENTOS]
  ITEM1 --> TOTAL[cart totals]
  ITEM2 --> TOTAL`
        }
      ]
    },
    pagamento: {
      metaTitle: "Pagamento",
      metaDescription: "Meios de pagamento, regras de disponibilidade e desfecho da tentativa.",
      badge: "Pagina 05",
      kicker: "Desfecho financeiro",
      title: "Meios, regras e tentativa de pagamento",
      summary:
        "Esta pagina explica como os meios ficam disponiveis para o carrinho e como a tentativa de pagamento termina em PENDING, APPROVED ou FAILED.",
      tags: ["payment_method", "payment_method_rule", "cart_payment", "PENDING", "APPROVED", "FAILED"],
      panelTitle: "Ao terminar esta pagina",
      panelItems: [
        "voce entende o cadastro dos meios",
        "sabe como a precedencia de regras funciona",
        "consegue ler os campos de cart_payment",
        "sabe onde fica o ciclo de estados"
      ],
      summaryCards: [
        {
          title: "PENDING e o ponto de espera",
          text: "Na v1, toda tentativa comeca em PENDING e so sai desse estado quando o provedor devolve sucesso ou falha."
        },
        {
          title: "Resolucao nao mescla scopes",
          text: "O primeiro nivel com regra ativa vence. Dentro desse nivel, priority menor aparece primeiro."
        },
        {
          title: "Resultado fica em cart_payment",
          text: "authorization_code, failure_code, failure_message, approved_at e failed_at descrevem o desfecho da tentativa."
        }
      ],
      sidebarTitle: "Pagamento",
      sidebarCopy: "Entenda primeiro quais meios podem aparecer. Depois leia como a tentativa termina.",
      sections: [
        {
          id: "pagamento-meios",
          label: "Cadastro",
          title: "01. Meios de pagamento",
          copy: `\`payment_method\` representa um meio disponivel dentro da empresa.

O codigo do meio nao e global. Ele e unico dentro do tenant. Isso vale para \`PIX\`, \`CARD\`, \`PAYPAL\` e \`NUPAY\`.`,
          tables: [
            {
              title: "Valores controlados",
              columns: ["Campo", "Descricao", "Valores"],
              rows: [
                ["payment_method.code", "Codigo do meio de pagamento.", "PIX | CARD | PAYPAL | NUPAY"],
                ["payment_method.active", "Disponibilidade do meio.", "true | false"]
              ]
            },
            {
              title: "Leitura do cadastro",
              columns: ["Campo", "Uso", "Observacao"],
              rows: [
                ["company_id", "Delimita o tenant.", "Dois tenants podem ter meios com o mesmo code."],
                ["code", "Identificador funcional do meio.", "Usado pelas regras."],
                ["provider", "Gateway ou adquirente.", "Explica de onde vira o retorno externo."]
              ]
            }
          ],
          diagram: `erDiagram
  COMPANY ||--o{ PAYMENT_METHOD : "1:N"
  COMPANY ||--o{ PAYMENT_METHOD_RULE : "1:N"
  PAYMENT_METHOD ||--o{ PAYMENT_METHOD_RULE : "1:N"
  PAYMENT_METHOD ||--o{ CART_PAYMENT : "1:N"`
        },
        {
          id: "pagamento-regras",
          label: "Disponibilidade",
          title: "02. Regras de disponibilidade dos meios",
          copy: `\`payment_method_rule\` define quais meios podem aparecer para um carrinho.

A resolucao parte da empresa do checkout e pode ser refinada por produto, por business unit ou por segmento comercial. O sistema nao mistura niveis. Ele procura o primeiro scope com regras ativas e usa apenas esse conjunto.`,
          tables: [
            {
              title: "Valores controlados",
              columns: ["Campo", "Descricao", "Valores"],
              rows: [["payment_method_rule.scope", "Nivel da regra.", "GLOBAL | SEGMENT | BUSINESS_UNIT | PRODUCT"]]
            },
            paymentResolutionTable,
            {
              title: "Precedencia",
              columns: ["Chave", "Leitura", "Uso"],
              rows: [
                ["scope", "PRODUCT > BUSINESS_UNIT > SEGMENT > GLOBAL", "Primeiro nivel com regras ativas vence."],
                ["priority", "menor valor primeiro", "Ordena os meios dentro do mesmo nivel."]
              ]
            }
          ],
          diagram: `flowchart LR
  COMPANY[company] --> CART[cart]
  CART --> RULE[payment_method_rule]
  PRODUCT[product opcional] --> RULE
  RULE --> METHOD[payment_method]`,
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
  (10, 1, 'PRODUCT', 1, NULL, NULL, 2, 2, TRUE, CURRENT_TIMESTAMP, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
        },
        {
          id: "pagamento-tentativa",
          label: "Tentativa",
          title: "03. cart_payment",
          copy: `\`cart_payment\` registra uma tentativa de pagamento ligada ao carrinho.

Na v1, a tentativa entra em \`PENDING\`. Quando o provedor responde com sucesso, vira \`APPROVED\`. Quando recusa, vira \`FAILED\`.`,
          tables: [
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
          sql: `INSERT INTO cart_payment (id, cart_id, payment_method_id, amount, status, provider_reference, authorization_code, failure_code, failure_message, approved_at, failed_at, created_at, updated_at)
VALUES
  (1, 1, 2, 199.90, 'PENDING', NULL, NULL, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`
        },
        {
          id: "pagamento-estados",
          label: "Estado da tentativa",
          title: "04. Ciclo do pagamento",
          copy: `O ciclo abaixo resume os estados da tentativa. O ponto importante e que \`PENDING\` cobre o tempo de espera pela resposta do provedor.

Exemplos concretos de retorno do gateway ficam em [Regras e fluxos](./regras.html#fluxo-desfecho-pagamento).`,
          tables: [
            {
              title: "Transicao de estados",
              columns: ["Origem", "Evento", "Destino"],
              rows: [
                ["PENDING", "aprovacao do provedor", "APPROVED"],
                ["PENDING", "recusa do provedor", "FAILED"]
              ]
            },
            {
              title: "Tempo de resposta por meio",
              columns: ["Meio", "Comportamento comum", "Observacao"],
              rows: [
                ["CARD", "Sincrono", "Aprova ou recusa na hora em muitos cenarios."],
                ["PIX", "Assincrono", "Pode ficar em PENDING ate a confirmacao."],
                ["NUPAY", "Assincrono", "Pode ficar em PENDING ate a confirmacao."],
                ["PAYPAL", "Assincrono", "Pode ficar em PENDING ate a confirmacao."]
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
    regras: {
      metaTitle: "Regras e fluxos",
      metaDescription: "Fluxos ponta a ponta do catalogo ao pagamento e regras de negocio multi-entidade.",
      badge: "Pagina 06",
      kicker: "Ponto canonico dos fluxos",
      title: "Regras de negocio e fluxos ponta a ponta",
      summary:
        "Esta e a pagina canonica para regras que cruzam mais de uma entidade. Aqui estao as jornadas publicas, a resolucao dos meios e os exemplos de retorno do gateway.",
      tags: ["sku", "product_version.code", "bundle.code", "checkout_offer", "meios", "gateway"],
      panelTitle: "Use esta pagina quando",
      panelItems: [
        "precisar ver a historia completa",
        "quiser revisar um fluxo ponta a ponta",
        "buscar a regra canonica de meios",
        "quiser exemplos de retorno do gateway"
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
          title: "Gateway mapeado",
          text: "Os exemplos de APPROVED e FAILED mostram como os campos de cart_payment ficam preenchidos."
        }
      ],
      sidebarTitle: "Regras e fluxos",
      sidebarCopy: "Use esta pagina como referencia final para entender o raciocinio completo da modelagem.",
      sections: [
        {
          id: "fluxo-sku-checkout",
          label: "Fluxo canonico",
          title: "01. Produto por sku e oferta por code ate o carrinho",
          copy: `A camada publica resolve a pagina do produto por \`sku\` dentro da empresa. A partir dessa pagina, o cliente pode ver varias \`product_version\` vigentes do mesmo produto.

Quando a jornada aponta para uma oferta especifica, a URL usa \`sku + product_version.code\`. O carrinho abre com essa versao e salva o snapshot em \`cart_item\`.

O ponto importante aqui e separar **resolucao do produto** de **resolucao da oferta**. A vitrine olha para o \`sku\`. A oferta olha para o \`code\`. O carrinho olha para a \`product_version\` escolhida e salva o snapshot em \`cart_item\`.`,
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
                ["Abrir checkout", "cart", "Carrinho criado no contexto da empresa."],
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
  V-->>U: pagina comercial com opcoes
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

Aqui o snapshot nasce da composicao versionada do bundle, nao de uma escolha de itens feita linha a linha pelo comprador.`,
          tables: [
            {
              title: "Passos do fluxo",
              columns: ["Passo", "Tabela afetada", "Resultado"],
              rows: [
                ["Resolver bundle", "bundle", "Bundle correto dentro da empresa."],
                ["Ler versao ativa", "bundle_version", "Composicao vigente encontrada."],
                ["Listar composicao", "bundle_item", "Itens que entram no carrinho."],
                ["Abrir checkout", "cart, cart_item", "Carrinho nasce com bundle_version_id e linhas materializadas."]
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
  V->>I: materializa bundle_item
  C-->>U: carrinho carregado`
        },
        {
          id: "fluxo-oferta-checkout",
          label: "Fluxo canonico",
          title: "03. Oferta opcional no checkout",
          copy: `A oferta parte da versao de origem do produto. Quando o comprador aceita, o checkout grava \`cart_offer\` e cria os itens adicionais necessarios.

O valor desta modelagem e separar a **configuracao da oferta** de sua **execucao no checkout**.`,
          tables: [
            {
              title: "Cenarios",
              columns: ["Cenario", "Leitura", "Snapshot"],
              rows: [
                ["Upsell", "Mesma linha, prazo maior.", "12 meses -> 24 meses."],
                ["Cross sell", "Produto de outra BU.", "Produto A oferece Produto B."],
                ["Cortesia", "Addon escolhido gera brinde.", "Addon selecionado -> produto gratis."]
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
            cartOfferSelectionTable
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
          id: "fluxo-venda-mista",
          label: "Regra de leitura",
          title: "04. Venda mista e origem dos totais",
          copy: `A venda mista existe quando o mesmo carrinho carrega linhas de BUs diferentes.

O cabecalho do checkout continua apontando para a empresa e para o segmento comercial. A BU do cabecalho so existe quando a venda fecha em uma unica BU. Os totais continuam sendo calculados pela soma dos itens do carrinho.`,
          tables: [
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
            },
            {
              title: "Regra da BU",
              columns: ["Cenario", "Leitura", "Uso"],
              rows: [
                ["Uma BU", "cart.business_unit_id preenchido", "Checkout simples."],
                ["Multiplas BUs", "cart.business_unit_id = NULL", "Venda mista."],
                ["Linha do carrinho", "cart_item.business_unit_id obrigatorio", "Origem real da linha."]
              ]
            }
          ],
          diagram: `flowchart LR
  CART[cart]
  ITEM1[cart_item EDU]
  ITEM2[cart_item EVENTOS]
  TOTAL[totais do cart]

  CART --> ITEM1
  CART --> ITEM2
  ITEM1 --> TOTAL
  ITEM2 --> TOTAL`
        },
        {
          id: "fluxo-meios-pagamento",
          label: "Regra canonica",
          title: "05. Resolucao dos meios de pagamento",
          copy: `A lista de meios parte da empresa do carrinho. Depois o sistema procura o primeiro scope com regra ativa na ordem PRODUCT, BUSINESS_UNIT, SEGMENT e GLOBAL.

Em venda mista, a regra de business unit so vale quando a compra fecha em uma unica BU. Nos demais casos, a resolucao segue produto, segmento ou fallback global.`,
          tables: [
            {
              title: "Precedencia",
              columns: ["Chave", "Leitura", "Uso"],
              rows: [
                ["scope", "PRODUCT > BUSINESS_UNIT > SEGMENT > GLOBAL", "Primeiro nivel com regras ativas vence."],
                ["priority", "menor valor primeiro", "Ordena os meios dentro do mesmo nivel."]
              ]
            },
            paymentPriorityExamplesTable
          ],
          diagram: `flowchart LR
  COMPANY[company] --> CART[cart.commercial_segment]
  CART --> RULE[payment_method_rule]
  PRODUCT[product opcional] --> RULE
  RULE --> METHOD[payment_method]`
        },
        {
          id: "fluxo-desfecho-pagamento",
          label: "Retorno externo",
          title: "06. Tentativa e desfecho do pagamento",
          copy: `A tentativa nasce em \`PENDING\`. O provedor decide se ela vira \`APPROVED\` ou \`FAILED\`.

Os exemplos abaixo mostram como os campos de \`cart_payment\` ficam preenchidos de acordo com o retorno do gateway.`,
          tables: [
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
              title: "Impacto no cart_payment",
              columns: ["Status final", "Campos preenchidos", "Campos nulos"],
              rows: [
                ["APPROVED", "authorization_code quando existir, approved_at", "failure_code, failure_message, failed_at"],
                ["FAILED", "failure_code, failure_message, failed_at", "authorization_code, approved_at"]
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
    { name: "code", type: "Varchar", description: "Codigo publico da oferta comercial dentro do produto." },
    { name: "access_months", type: "Integer", description: "Periodo base da oferta." },
    { name: "bonus_months", type: "Integer", description: "Meses extras da oferta." },
      { name: "price_amount", type: "Decimal(12,2)", description: "Preco da versao comercial." },
      { name: "currency", type: "Char(3)", description: "Moeda da oferta.", values: "BRL" },
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

  return {
    siteNavigation,
    sitePages,
    entityAttributes
  };
})();
