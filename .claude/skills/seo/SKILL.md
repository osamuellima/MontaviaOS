---
name: seo
description: >
  Fluxo completo de SEO, presença em IA generativa (GEO) e Google Ads em 8 etapas: demanda,
  concorrência, Google Meu Negócio, on-page, estratégia de conteúdo, Google Ads, monitoramento
  e otimização pra aparecer em respostas de IA. Use quando pedirem SEO, GEO, pesquisa de
  palavra-chave, otimizar Google Meu Negócio, ou aparecer nas respostas de ChatGPT/Gemini/Perplexity.
---

# /seo

## O que ler antes

`_memoria/empresa.md`, `_memoria/preferencias.md`, `_memoria/estrategia.md`. Ferramenta
usada: busca e leitura de página na web. Saída em `marketing/seo/`.

## Etapa 1 — Demanda real

Levantar produto/serviço/região/diferencial em `empresa.md`, gerar 30-50 termos-semente
cobrindo categoria de oferta, intenção de busca (informacional/comercial/transacional),
localização e contexto de uso. Pesquisar cada grupo pra entender sazonalidade, o que já
aparece nos resultados, e termos relacionados que expandem a lista. Classificar cada termo por
volume estimado, intenção, dificuldade (quantos concorrentes fortes disputam) e relevância
(direto, indireto, tangencial).

Salvar em `marketing/seo/01-pesquisa-demanda.md`: tabela classificada, top 10 prioritários
(volume + intenção comercial + baixa disputa), termos sazonais, e o que foi descartado e por quê.

## Etapa 2 — Concorrência

Pra cada um dos top 10 termos, mapear os primeiros resultados orgânicos (quem são, que tipo
de página), o pacote local do mapa (quem aparece, quantas avaliações) e se alguém já anuncia
ali. Aprofundar nos concorrentes mais relevantes (até 8): estrutura do site, meta tags das
páginas principais, profundidade do conteúdo, uso de dados estruturados, completude do perfil
no Google Meu Negócio. Sintetizar em: onde ninguém domina (oportunidade), onde a disputa é
forte demais pra atacar de frente (ameaça), e o padrão mínimo que o negócio precisa alcançar.

Salvar em `marketing/seo/02-analise-concorrencia.md`: tabela de concorrentes, mapa de gaps, e
recomendação de por onde atacar primeiro.

## Etapa 3 — Google Meu Negócio

Checar o estado atual do perfil (se existir) e montar o que falta preencher/otimizar:
categoria principal e secundárias adequadas ao nicho, dados básicos completos, descrição
otimizada (com palavra-chave natural, tom de `preferencias.md`), atributos e lista de
serviços, checklist de foto recomendada (fachada, interior, produto, equipe), sugestão de
posts iniciais e calendário recorrente, estratégia de captar avaliação de cliente atual, e
lista de diretórios relevantes pro nicho com nome/endereço/telefone consistentes em todos.

Salvar em `marketing/seo/03-google-meu-negocio.md`.

## Etapa 4 — Otimização on-page

Pra cada página do site (existente ou planejada): palavra-chave alvo, title (curto, com o
termo logo no início), meta description com chamada, sugestão de H1/H2/H3, dado estruturado
relevante (negócio local, produto, FAQ conforme o caso), e checklist técnico (URL amigável,
texto alternativo de imagem, velocidade, adaptação a celular, sitemap, robots.txt, canonical,
Open Graph). Mapear também os links internos entre páginas.

Salvar em `marketing/seo/04-otimizacao-on-page.md`: tabela página → keyword → title →
description → H1, dado estruturado pronto pra copiar, checklist com status.

## Etapa 5 — Estratégia de conteúdo

A partir dos termos informacionais da etapa 1: 5-10 ideias de conteúdo evergreen que
respondem dúvida real do público (título, termo-alvo, estrutura de tópicos, tamanho
estimado), organizadas em cluster (uma página-pilar + páginas satélite linkando pra ela), com
calendário de prioridade e frequência, e conteúdo de página local se fizer sentido pro negócio.

Salvar em `marketing/seo/05-estrategia-conteudo.md` — essa lista alimenta diretamente a skill
`/publicar-tema`, que transforma cada item em artigo + carrossel + legendas.

## Etapa 6 — Google Ads

Definir objetivo (lead por ligação/WhatsApp/formulário, visita ao site, alcance local).
Estruturar campanha Search com um grupo por cluster de palavra-chave (10-15 termos, lista de
negativa, 3 anúncios responsivos, extensão), orçamento e segmentação geográfica; campanha
local e remarketing como opcional. Copy segue o tom de `preferencias.md`, com diferencial
concreto e chamada específica — 15 variações de headline, 4 de descrição por anúncio. Avaliar
se o site atual serve de destino ou se precisa de página dedicada.

Salvar em `marketing/seo/06-google-ads.md` — a skill `/anuncio-google` usa esse arquivo como
insumo direto pra gerar os CSVs de importação.

## Etapa 7 — Monitoramento

Rotina semanal: posição nos termos prioritários, resposta a avaliação no Google Meu Negócio,
ao menos um post por semana lá. Rotina mensal: revisão de métrica de ads (via
`/relatorio-ads`), tráfego orgânico, atualização de negativa, publicação de conteúdo do
calendário, checagem de diretório. Rotina trimestral: nova rodada resumida da etapa 2, fotos e
posts do perfil atualizados, revisão da estratégia de conteúdo, novas oportunidades de termo.

Salvar em `marketing/seo/07-checklist-monitoramento.md`.

## Etapa 8 — Presença em resposta de IA (GEO)

Cada vez mais gente pergunta direto pra uma IA generativa qual o melhor fornecedor de algo —
aparecer nessa resposta traz lead qualificado sem pagar por clique.

Auditar se o negócio (ou concorrente) já aparece quando os termos prioritários são perguntados
a um assistente de IA, e quais fontes essas respostas costumam citar. Ajustar o conteúdo já
produzido pra responder de forma direta logo nas primeiras linhas, com dado concreto e
verificável, estruturado em formato pergunta-resposta. Montar uma seção de perguntas
frequentes reais do nicho com dado estruturado de FAQ. Buscar menção externa em fonte confiável
(diretório, avaliação, menção em conteúdo do nicho) — IA generativa pesa isso na hora de
decidir quem citar. Reforçar dado estruturado no site de forma geral. Repetir o teste a cada
mês nos termos prioritários e ajustar conforme o resultado.

Salvar em `marketing/seo/08-geo-otimizacao-ia.md`.

## Como rodar

Rodar `/seo` sem especificar etapa executa as 8 em sequência, mostrando um resumo entre cada
uma antes de seguir pra próxima. Pedir uma etapa específica (ex.: "só o Google Meu Negócio")
roda só aquela.

Ao final de uma rodada completa, fechar com: top 5 oportunidades encontradas, ação prioritária
(o que fazer primeiro), estimativa de investimento em ads, e próximo passo recomendado.

## Regras

- Toda pesquisa usa busca/leitura real — nunca inventar volume ou dado de concorrência
- Copy e texto seguem `_memoria/preferencias.md` à risca
- Termo em português do Brasil, do jeito que o público de fato busca
- Dado que não pode ser confirmado com precisão: marcar como estimativa e explicar o raciocínio
- Foco em termo de intenção comercial/transacional
- Dado estruturado sempre em JSON-LD
- Nunca inventar CPC ou custo de anúncio sem base real
