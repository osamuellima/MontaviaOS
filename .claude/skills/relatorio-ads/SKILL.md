---
name: relatorio-ads
description: >
  Lê exports de Google Ads e Meta Ads (CSV ou print) e devolve relatório semanal executivo com
  KPIs, comparação com a semana anterior, alertas de risco e recomendação prática pra semana
  seguinte. Use quando pedirem relatório de campanha, performance de ads, ou /relatorio-ads.
---

# /relatorio-ads

Transforma export bruto de plataforma em relatório que o dono do negócio entende sem abrir o
painel do Google ou da Meta.

## O que ler antes

`_memoria/empresa.md`, `_memoria/estrategia.md`, `_memoria/preferencias.md`. Histórico de
relatórios anteriores em `marketing/campanhas/relatorios/` (criar a pasta se ainda não existir).

## Entrada

CSV do Google Ads e/ou Meta Ads Manager — print também serve, transcrever antes de analisar.
Sem arquivo anexado no pedido, perguntar onde estão os exports da semana.

## Passos

**1. Ler os exports.** Google Ads: campanha, grupo, impressão, clique, CTR, CPC médio, custo,
conversão, CPA, taxa de conversão. Meta Ads: campanha, conjunto, impressão, alcance, clique no
link, CTR, CPM, frequência, custo, resultado, custo por resultado. Coluna de conversão
ausente: avisar e seguir só com dado de tráfego.

**2. Comparar com a semana anterior**, se houver relatório salvo: variação de investimento
total, clique/impressão, CTR, CPC/CPM, conversão total, CPA, custo por canal. Primeira leitura
sem histórico: registrar como linha de base, sem comparação.

**3. Montar o resumo executivo** (leitura de até 2 minutos, no topo do relatório): investimento
total com variação, conversão total com variação, CPA médio com variação, quebra por canal, e
uma linha só com o que mais importa da semana (campanha que se destacou, alerta relevante,
queda inesperada).

**4. Detalhar por canal**: top 3 e bottom 3 campanha/grupo por CPA e taxa de conversão; top e
bottom criativo (Meta) por CTR e custo por resultado; termo de busca caro sem conversão
(Google) como candidato a negativa.

**5. Gerar alertas, do mais grave pro mais leve:**
- Campanha com gasto relevante e zero conversão
- Queda forte de CTR frente à semana anterior
- Frequência alta no Meta (público saturando)
- Taxa de conversão baixa em campanha Search
- CPC subindo de forma consistente
- Oportunidade: campanha com métrica acima da média e orçamento limitado — candidata a receber mais verba

**6. Recomendações objetivas** (3-5 itens, cada um citando campanha/grupo, valor e motivo —
nunca genérico tipo "otimizar campanhas").

**7. Salvar** em `marketing/campanhas/relatorios/<data>-relatorio.md`, com um cabeçalho de
dados estruturados (período, investimento total, conversão total, CPA médio, canais) que
facilita comparação automática nos relatórios seguintes.

**8. Entregar** o resumo executivo direto na conversa, apontando pro arquivo completo, e
perguntar se quer que o resumo vire email pro cliente (aciona `/email-profissional`).

## Regras

- Número nunca inventado — export truncado ou ilegível vira "dado incompleto", seguir só com
  o que dá pra confirmar
- Número solto sem comparação não diz nada — o comparativo é o que importa
- Alertas em ordem de gravidade
- Recomendação sempre nomeada (campanha, valor, motivo), nunca vaga
- Termo técnico (CPM, CTR, CPA) só sem tradução se o interlocutor já usa esses termos — senão, traduzir em linguagem simples
- Frequência de anúncio no Meta: até ~3 é saudável, acima disso já indica saturação
- Perda reportada sem suavizar — "a campanha gastou X sem gerar venda" é mais útil que eufemismo
