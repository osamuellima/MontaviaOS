---
name: estoque
description: >
  Controla estoque, pedido de cliente, preço por cliente/representante e sugestão de
  reposição pra distribuidora/atacado — adaptado ao jeito de operar de cada negócio, não um
  fluxo fixo. Na primeira vez, descobre como essa distribuidora específica trabalha (lote?
  representante? tabela de preço por cliente? ponto de pedido?) e grava como perfil em
  `_memoria/operacao.md`. Use quando pedirem saldo de estoque, registrar pedido, calcular
  preço pra um cliente, saber o que repor, ou disser `/estoque`.
---

# /estoque

Skill de estoque e pedido pra negócio de atacado/revenda. Cada distribuidora opera diferente —
uma controla por lote e validade, outra não; uma tem representante externo com comissão, outra
vende direto; uma repõe por ponto de pedido, outra por pedido mínimo do fornecedor. Em vez de
impor um fluxo único, essa skill primeiro aprende o modelo daquele negócio e depois se comporta
de acordo.

## Antes de agir

Ler `_memoria/empresa.md` (contexto geral do negócio) e `_memoria/operacao.md` **se existir**
(perfil operacional já configurado). Sem `_memoria/operacao.md`, ou com ele ainda em
placeholder, ir pro **Passo 0 — Descobrir o modelo**. Com ele preenchido, pular direto pro
módulo pedido (Passos 1 a 5).

## Passo 0 — Descobrir o modelo de operação (só na primeira vez)

Conduzir como conversa curta, uma pergunta por vez — não é formulário. Objetivo: saber o
suficiente pra não tratar errado o estoque desse negócio específico.

1. **Unidade de controle** — controla por item simples, ou por variação (tamanho/cor/sabor)?
   Controla lote e validade (relevante pra alimento, cosmético, farmacêutico), ou isso não se
   aplica?
2. **Canal de venda** — vende direto pro cliente final de varejo, através de representante
   comercial (com comissão), ou os dois? Se tem representante, a reposição de estoque e o
   fechamento de pedido passam por ele ou vão direto pro cliente?
3. **Preço** — preço único de tabela, ou varia por cliente/volume/região? Se varia, qual é o
   critério (cliente específico, faixa de quantidade, categoria de cliente tipo "ouro/prata")?
4. **Reposição** — repõe por ponto de pedido (quando saldo cai de X, comprar), por pedido
   mínimo do fornecedor, ou de outro jeito (ex: visita periódica do representante do
   fornecedor)? Tem fornecedor fixo por produto ou cotação entre fornecedores?
5. **Onde estão os dados hoje** — já tem planilha de estoque/produtos? Pedir pra soltar em
   `dados/` (CSV ou Excel) com as colunas que já existem, nem que estejam bagunçadas. Sem
   planilha, construir uma do zero com as colunas do Passo 3 abaixo, a partir do que a pessoa
   souber de cabeça (nem que incompleto).

Resposta vaga, pedir concretude uma vez — sem insistir além disso. Preenchimento nunca
inventado: o que não foi respondido fica como lacuna explícita no perfil, não como suposição.

**Gravar o resultado em `_memoria/operacao.md`** (criar se não existir):

```markdown
# Operação

> Como essa distribuidora controla estoque, pedido e preço. Preenchido pela skill `/estoque`.

**Unidade de controle:** [item simples / variação / lote+validade]
**Canal de venda:** [direto / representante / ambos — e como se divide]
**Critério de preço:** [único / por cliente / por volume / por categoria — detalhar]
**Modelo de reposição:** [ponto de pedido / pedido mínimo / visita periódica — detalhar]
**Fornecedores:** [fixo por produto / cotação — se souber, listar principais]
**Planilha de origem:** [caminho em dados/, ou "construída do zero em [data]"]
```

Depois de gravar, seguir direto pro que a pessoa pediu originalmente (se vieram de um pedido
concreto tipo "quanto tenho de X") usando o módulo correspondente abaixo.

## Estrutura de dados (planilha de referência)

Independente do modelo, manter uma planilha em `dados/estoque.csv` (ou `.xlsx`) com, no mínimo:
`produto, variação (se houver), saldo atual, unidade, preço base, fornecedor, ponto de pedido
(se aplicável), lote/validade (se aplicável)`. E uma segunda planilha ou aba `dados/pedidos.csv`
com: `data, cliente, produto, quantidade, preço aplicado, status (pendente/confirmado/entregue)`.

Se a distribuidora já usa ERP (ex: ERPNext, Odoo) ou planilha online, essa skill trabalha sobre
uma exportação/cópia local — não substitui o sistema de origem, é camada de consulta e rascunho
rápido via conversa.

## Passo 1 — Saldo e ruptura

Pedido tipo "quanto tenho de X" ou "o que está acabando": ler `dados/estoque.csv`, responder
saldo direto. Pra ruptura, cruzar saldo atual com ponto de pedido (se configurado) ou com
velocidade de venda recente (se `dados/pedidos.csv` tiver histórico) — listar o que está
abaixo do normal, ordenado por criticidade, não por ordem alfabética.

## Passo 2 — Registrar pedido

Pedido tipo "registra um pedido do cliente Y de Z unidades do produto X": calcular o preço
aplicável segundo o **Critério de preço** gravado no perfil (tabela única, por cliente, por
volume), confirmar o valor antes de gravar, dar baixa no saldo em `dados/estoque.csv` e
adicionar linha em `dados/pedidos.csv`. Se o saldo for insuficiente, avisar antes de confirmar
— nunca gravar pedido que deixa saldo negativo sem alertar explicitamente.

## Passo 3 — Preço por cliente

Pedido tipo "qual o preço de X pra esse cliente": aplicar o critério gravado no perfil. Critério
"por cliente" sem tabela própria ainda registrada, perguntar e oferecer gravar como regra nova
pra não perguntar de novo da próxima vez.

## Passo 4 — Sugestão de reposição

Pedido tipo "o que preciso comprar": segundo o **Modelo de reposição** do perfil — ponto de
pedido dispara lista de quem está abaixo do limite; pedido mínimo do fornecedor soma o que falta
por fornecedor e avisa se ainda não bateu o mínimo; agrupar por fornecedor quando houver mais de
um, pra virar um pedido de compra por fornecedor, não uma lista solta.

## Passo 5 — Relatório

Pedido tipo "como está o estoque" ou fechamento de período: resumo em prosa (não só tabela) com
o que vendeu mais, o que está em risco de ruptura, o que está parado há muito tempo (capital
empatado), e o que precisa de decisão agora — mesmo padrão de entrega de `/analisar-dados`.

## Regras

- Nunca inventar saldo, preço ou cliente que não está na planilha — lacuna vira pergunta, não
  suposição
- Mudança de preço ou baixa de estoque sempre confirmada antes de gravar, nunca silenciosa
- Perfil em `_memoria/operacao.md` é vivo — se a forma de operar mudar (passou a ter
  representante, começou a controlar lote), atualizar o arquivo em vez de reperguntar tudo do
  zero
- Planilha grande ou com estrutura muito diferente do esperado: adaptar a leitura ao que existe
  em vez de pedir pra reformatar antes
