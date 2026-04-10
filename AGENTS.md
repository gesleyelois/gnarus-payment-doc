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
- `product`, `cart`, `payment_method` e `payment_method_rule` sempre carregam `company_id`
- `bundle` carrega `company_id` e pode carregar `business_unit_id` quando a composicao for de uma unica BU
- `bundle_version` guarda o historico da composicao; `bundle_item` pertence a `bundle_version`
- `checkout_offer` modela upsell, cross-sell e cortesia no checkout; o addon pode ser o mesmo produto em outra versao ou outro produto de outra BU; `cart_offer` registra a oferta mostrada e a selecao do comprador
- `checkout_offer.source_product_version_id` aponta a versao de origem; `offered_product_version_id` aponta o addon; `courtesy_product_version_id` e opcional e vira um `cart_item` gratuito quando o addon e escolhido
- use `checkout_offer` para add-ons opcionais no checkout; mantenha `bundle` apenas para composicoes pre-carregadas
- `product.business_unit_id` e obrigatorio; `cart.business_unit_id` e opcional e pode ficar nulo quando a venda mistura BUs; `cart_item.business_unit_id` e obrigatorio
- `cart.bundle_version_id` aponta a versao usada na abertura do carrinho, quando houver
- `bundle_item` define a composicao publica da `bundle_version` e os itens sao materializados em `cart_item` na abertura do carrinho
- `sku` e `payment_method.code` sao unicos por empresa, nao globais
- `cart.commercial_segment` define o contexto comercial da venda, com valores como `B2C`, `B2B` e `B2B2C`
- `payment_method_rule` define a disponibilidade de meios por `scope`; a precedencia e `PRODUCT` acima de `BUSINESS_UNIT`, acima de `SEGMENT`, acima de `GLOBAL`
- a resolucao de meios nao mescla scopes: primeiro scope com regras ativas vence; dentro do mesmo scope, `priority` menor vem primeiro
- a resolucao padrao de meios parte da empresa do carrinho, com override por BU, por segmento ou por produto apenas quando existir regra especifica; a regra de BU vale apenas quando a compra fecha em uma unica BU
- quando a venda mistura BUs, o cart fica sem uma BU unica no cabecalho; a BU de cada linha fica em `cart_item.business_unit_id`
- a venda mista e representada por varios `cart_item` no mesmo `cart`; bundle e representado por `bundle`, `bundle_version` e `bundle_item`
- bundle e uma composicao predefinida que abre o carrinho ja com os itens carregados
- as rotas publicas de bundle resolvem `bundle.code` na empresa, carregam a `bundle_version` ativa e geram `cart` com `bundle_version_id`
- se existir mais de uma `bundle_version` ativa para o mesmo `bundle`, isso e erro de cadastro
- se existir mais de uma `checkout_offer` ativa para a mesma `source_product_version_id`, a ordenacao usa `priority`
- exemplos de referencia: `B2B` na empresa A -> `CARD`; `B2C` na empresa A -> `PIX`, `NUPAY`, `CARD`, `PAYPAL`; `BU EDU` na empresa A -> `PIX`, `CARD`; `PRODUCT_I` em `B2C` -> `PIX`, `CARD`
- a pagina de regras deve registrar exemplos de retorno do gateway para `APPROVED` e `FAILED`, mostrando o mapeamento dos campos de `cart_payment`
- produto e o catalogo da empresa; a variacao de periodo, preco, bonus e vigencia fica em `product_version`
- `sku` e o codigo publico do produto
- a camada publica resolve o produto por `sku` dentro da empresa e exibe apenas a versao vigente daquele `sku`
- se houver mais de uma versao vigente para o mesmo `sku` dentro da mesma empresa, isso e erro de cadastro
- `valid_to` nulo significa versao comercial ainda vigente, nao versao vitalicia
- a tela de produto pode listar versoes vigentes; o carrinho sempre exibe o snapshot salvo em `cart_item.product_version_id`
- nao criar um produto por periodo de acesso; usar versao comercial para 12m, 24m, 36m e ofertas
- mudanca de preco, bonus de meses ou vigencia gera nova linha em `product_version`
- `cart_item` deve gravar o snapshot da versao escolhida, incluindo `business_unit_id`, `quantity`, periodo base, bonus, total de acesso e preco unitario
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
