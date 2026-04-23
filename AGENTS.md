# AGENTS.md

Este projeto documenta uma modelagem incremental de pagamentos.

## Arquivos principais

- `schema.sql`
- `docs/index.html`
- `docs/regras.html`

## Regra central

- comecar por `produto`, `versao comercial`, `carrinho/checkout` e `pagamento`
- manter a modelagem simples na primeira versao
- evoluir em passos pequenos quando uma nova regra de negocio existir de verdade
- atualizar `schema.sql` e a wiki sempre juntos
- nao criar tabelas antecipadas apenas por parecerem uteis no futuro
- evitar frases de contextualizacao do tipo "esta versao cobre" ou "a modelagem cresce"
- documentar campos com valores controlados na secao correspondente, com tabela objetiva de descricao e valores
- ilustrar o fluxo com diagramas nas secoes correspondentes de carrinho e pagamento; quando o fluxo cruzar mais de uma entidade, usar uma pagina top-level propria e mostrar as tabelas afetadas e o relacionamento em cada passo
- regras de negocio e fluxos que cruzam produto, carrinho e pagamento devem ficar em uma pagina top-level propria, nao como subsecao escondida na pagina principal; os fluxos devem aparecer de forma visivel na propria pagina
- evitar repetir o mesmo fluxo ou diagrama em mais de uma secao; cada ciclo deve ter um ponto canonico e as outras secoes devem ficar com a visao resumida
- quando a modelagem ficar densa, o mapa geral da secao Empresa deve usar camadas claras como catalogo, bundle, ofertas, checkout e pagamento; evitar um unico ER grande com muitas arestas
- documentar estados com tabela de transicao e diagrama de ciclo na secao correspondente
- na v1, `PENDING` cobre a espera da resposta; sucesso do pagamento e `APPROVED`; `CAPTURED` fica para evolucao posterior se houver separacao entre aprovacao e captura
- em `cart_payment`, `authorization_code` guarda o codigo de aprovacao quando existir, `failure_code` guarda o codigo da recusa, `failure_message` guarda a mensagem da recusa, e `approved_at`/`failed_at` sao timestamps mutuamente exclusivos do desfecho da tentativa; em `PENDING`, esses campos ficam nulos
- `company` define o tenant; `business_unit` e um recorte dentro da empresa
- na secao Empresa, mostrar o diagrama geral por camadas e logo abaixo os diagramas pequenos de `catalogo`, `bundle`, `ofertas`, `checkout` e `pagamento`; os fluxos detalhados de `product_version`, `bundle_version` e `checkout_offer` podem aparecer depois, quando ajudarem a leitura
- `product_group` agrupa produtos para customizacao de checkout e pagamento; ele nao e vendido comercialmente e pode apontar `checkout_profile_code`
- `product` e `cart` sempre carregam `company_id`; `product.product_group_id` e obrigatorio
- `bundle` carrega `company_id` e pode carregar `business_unit_id` quando a composicao for de uma unica BU
- `bundle_version` guarda o historico da composicao; `bundle_item` pertence a `bundle_version`
- `checkout_offer` modela upsell, cross-sell e cortesia no checkout; a origem pode ser `product_version` ou `bundle_version`; o addon pode ser o mesmo produto em outra versao ou outro produto de outra BU; `cart_offer` registra a oferta mostrada e a selecao do comprador
- em `checkout_offer`, exatamente um entre `source_product_version_id` e `source_bundle_version_id` deve ficar preenchido; `offered_product_version_id` aponta o addon; `courtesy_product_version_id` e opcional e vira um `cart_item` gratuito quando o addon e escolhido
- use `checkout_offer` para add-ons opcionais no checkout; mantenha `bundle` apenas para composicoes pre-carregadas
- `product.business_unit_id` e obrigatorio; `cart.business_unit_id` e opcional e pode ficar nulo quando a venda mistura BUs; `cart_item.business_unit_id` e obrigatorio
- `cart.product_group_id` resume o agrupamento de configuracao da jornada quando o checkout fecha em um unico grupo; `cart_item.product_group_id` e obrigatorio
- `cart.origin_product_version_id` aponta a oferta que abriu a jornada quando o checkout nasce da rota de produto
- `cart.bundle_version_id` aponta a versao usada na abertura do carrinho, quando houver
- `cart_item.product_version_id` aponta a versao comprada; `cart_item.bundle_version_id` aponta a composicao de origem quando a linha veio de bundle
- `bundle_item` define a composicao publica da `bundle_version` e os itens sao materializados em `cart_item` na abertura do carrinho
- `sku`, `product_group.code`, `company_provider.code` e `payment_option.code` sao unicos por empresa, nao globais
- `cart.commercial_segment` define o contexto comercial da venda, com valores como `B2C`, `B2B` e `B2B2C`
- `payment_provider` e o catalogo global de provedores; `company_provider` e a configuracao do provedor na empresa; `company_provider_method` guarda os meios habilitados nessa configuracao
- `company_provider.health_status` controla a leitura operacional da configuracao com valores como `ONLINE`, `DEGRADED` e `OFFLINE`
- `company_provider_method` pode carregar `country_code`, `buyer_currency`, `pricing_currency` e `fx_mode` para vendas locais sobre preco base em outra moeda
- `payment_option` e a opcao exibida no checkout; `payment_option_route` ordena as rotas reais do provedor e o fallback por opcao
- `payment_option_rule` define a disponibilidade das opcoes por `scope`; a precedencia e `PRODUCT` acima de `PRODUCT_GROUP`, acima de `BUSINESS_UNIT`, acima de `COMPANY`
- a resolucao de opcoes nao mescla scopes: primeiro scope com regras ativas vence; dentro do mesmo scope, `priority` menor vem primeiro
- a resolucao padrao de opcoes parte da empresa do carrinho, com override por BU, por agrupamento ou por produto apenas quando existir regra especifica; a regra de BU vale apenas quando a compra fecha em uma unica BU
- o fallback por empresa e resolvido em `payment_option_route`; a empresa pode tirar uma configuracao da fila marcando `company_provider.health_status = OFFLINE` ou reordenando `priority`
- quando a venda mistura BUs, o cart fica sem uma BU unica no cabecalho; a BU de cada linha fica em `cart_item.business_unit_id`
- quando a venda mistura grupos, o cart fica sem um `product_group_id` unico no cabecalho; o grupo de configuracao de cada linha fica em `cart_item.product_group_id`
- a venda mista e representada por varios `cart_item` no mesmo `cart`; bundle e representado por `bundle`, `bundle_version` e `bundle_item`
- bundle e uma composicao predefinida que abre o carrinho ja com os itens carregados
- as rotas publicas de bundle resolvem `bundle.code` na empresa, carregam a `bundle_version` ativa e geram `cart` com `bundle_version_id`
- se existir mais de uma `bundle_version` ativa para o mesmo `bundle`, isso e erro de cadastro
- se existir mais de uma `checkout_offer` ativa para a mesma `source_product_version_id` ou `source_bundle_version_id`, a ordenacao usa `priority`
- exemplos de referencia: `PRODUCT_B2B` na empresa A -> `CARD`; `PRODUCT_GROUP B2C` na empresa A -> `PIX`, `CARD`, `NUPAY`, `PAYPAL`; `BU EDU` na empresa A -> `CARD`, `PIX`; `CARD` -> `MALGA_CARD` com fallback para `BRAINTREE_CARD`
- a pagina de regras deve registrar exemplos de retorno do gateway para `APPROVED` e `FAILED`, mostrando o mapeamento dos campos de `cart_payment`
- produto e o catalogo da empresa; a variacao de periodo, preco, bonus e vigencia fica em `product_version`
- `sku` e o codigo publico do produto
- `product_version.code` e o codigo publico da oferta comercial dentro do produto
- a camada publica resolve a pagina do produto por `sku` dentro da empresa
- a rota publica da oferta resolve `sku` + `product_version.code` dentro da empresa
- o produto pode ter mais de uma `product_version` vigente ao mesmo tempo
- se houver mais de uma `product_version` com o mesmo `code` para o mesmo produto, isso e erro de cadastro
- `valid_to` nulo significa versao comercial ainda vigente, nao versao vitalicia
- a tela de produto pode listar versoes vigentes; o carrinho sempre exibe o snapshot salvo em `cart_item.product_version_id`
- nao criar um produto por periodo de acesso; usar versao comercial para 12m, 24m, 36m e ofertas
- mudanca de preco, bonus de meses ou vigencia gera nova linha em `product_version`
- `cart_item` deve gravar o snapshot da versao escolhida, incluindo `bundle_version_id` quando houver, `business_unit_id`, `product_group_id`, `quantity`, periodo base, bonus, total de acesso e preco unitario
- `cart_item.access_months` e `cart_item.bonus_months` sao copia dos termos da `product_version` no momento da compra
- `quantity` costuma ser `1` em assinaturas e pode ser maior em produtos como eventos ou ingressos
- a pagina principal deve explicar empresa, unidade de negocio, produto, carrinho e pagamento antes de detalhar regras mais especificas
- fazer commits atomicos, com uma unica mudanca logica por commit
- usar mensagem no padrao Conventional Commits, com prefixos como `feat:`, `docs:`, `chore:` e similares

## Diretriz de evolucao

1. Primeiro registrar o essencial.
2. Depois acrescentar o que muda o fluxo real.
3. So entao detalhar estornos, conciliacao ou outras camadas avancadas.

## Critério de qualidade

Uma mudanca esta boa quando:

- a regra ficou clara na wiki
- o schema continua coerente com a narrativa
- a solucao nao ficou mais complexa do que o necessario
- a escrita e tecnica, sucinta e direta, com titulos curtos e neutros
