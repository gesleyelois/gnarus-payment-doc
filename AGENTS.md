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
- ilustrar o fluxo com diagramas nas secoes correspondentes de carrinho e pagamento, sem criar uma secao separada, sempre mostrando as tabelas afetadas e o relacionamento em cada passo
- documentar estados com tabela de transicao e diagrama de ciclo na secao correspondente
- na v1, `PENDING` cobre a espera da resposta; sucesso do pagamento e `APPROVED`; `CAPTURED` fica para evolucao posterior se houver separacao entre aprovacao e captura
- produto e o catalogo base; a variacao de periodo, preco, bonus e vigencia fica em `product_version`
- `valid_to` nulo significa versao comercial ainda vigente, nao versao vitalicia
- nao criar um produto por periodo de acesso; usar versao comercial para 12m, 24m, 36m e ofertas
- mudanca de preco, bonus de meses ou vigencia gera nova linha em `product_version`
- `cart_item` deve gravar o snapshot da versao escolhida, incluindo periodo base, bonus, total de acesso e preco unitario
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
