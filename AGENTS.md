# AGENTS.md

Este projeto documenta uma modelagem incremental de pagamentos.

## Arquivos principais

- `schema.sql`
- `docs/index.html`

## Regra central

- comecar por `produto`, `carrinho/checkout` e `pagamento`
- manter a modelagem simples na primeira versao
- evoluir em passos pequenos quando uma nova regra de negocio existir de verdade
- atualizar `schema.sql` e a wiki sempre juntos
- nao criar tabelas antecipadas apenas por parecerem uteis no futuro

## Diretriz de evolucao

1. Primeiro registrar o essencial.
2. Depois acrescentar o que muda o fluxo real.
3. So entao detalhar tentativas, estornos, conciliacao ou outras camadas avancadas.

## Critério de qualidade

Uma mudanca esta boa quando:

- a regra ficou clara na wiki
- o schema continua coerente com a narrativa
- a solucao nao ficou mais complexa do que o necessario

