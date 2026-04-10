# AGENTS.md

Este projeto documenta uma modelagem incremental de pagamentos.

## Arquivos principais

- `schema.sql`
- `docs/index.html`

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
- documentar estados com tabela de transicao e diagrama de ciclo na secao correspondente
- na v1, `PENDING` cobre a espera da resposta; sucesso do pagamento e `APPROVED`; `CAPTURED` fica para evolucao posterior se houver separacao entre aprovacao e captura
- produto e o catalogo base; a variacao de periodo, preco, bonus e vigencia fica em `product_version`
- `sku` e o codigo publico do produto
- a camada publica resolve o produto por `sku` e exibe apenas a versao vigente daquele `sku`
- se houver mais de uma versao vigente para o mesmo `sku`, isso e erro de cadastro
- `valid_to` nulo significa versao comercial ainda vigente, nao versao vitalicia
- a tela de produto pode listar versoes vigentes; o carrinho sempre exibe o snapshot salvo em `cart_item.product_version_id`
- nao criar um produto por periodo de acesso; usar versao comercial para 12m, 24m, 36m e ofertas
- mudanca de preco, bonus de meses ou vigencia gera nova linha em `product_version`
- `cart_item` deve gravar o snapshot da versao escolhida, incluindo `quantity`, periodo base, bonus, total de acesso e preco unitario
- `cart_item.access_months` e `cart_item.bonus_months` sao copia dos termos da `product_version` no momento da compra
- `quantity` costuma ser `1` em assinaturas e pode ser maior em produtos como eventos ou ingressos
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
