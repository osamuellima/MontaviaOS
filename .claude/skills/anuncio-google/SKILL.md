---
name: anuncio-google
description: >
  Monta a estrutura completa de uma campanha de Google Ads Search a partir de um briefing (ou
  da pesquisa SEO já feita) e devolve os CSVs prontos pra importar no Google Ads Editor —
  campanhas, grupos por cluster de palavra-chave, RSAs, extensões e negativas.
  Use quando o usuário pedir campanha de Google Ads, CSV de anúncio, ou /anuncio-google.
---

# /anuncio-google

Sai do briefing direto pro conjunto de CSVs de importação — sem montar grupo por grupo na
interface do Google.

## O que ler antes

- `_memoria/empresa.md` — o que é vendido, público, região, diferencial
- `_memoria/preferencias.md` — tom das copies
- Se existir, `marketing/seo/01-pesquisa-demanda.md` e `06-google-ads.md` — usar como insumo em vez de repetir pesquisa
- Saída padrão: `marketing/campanhas/google-ads-<AAAA-MM-DD>/`

## Passos

### 1. Levantar o briefing

Sem briefing pronto, perguntar: o que é anunciado, quem é o público, raio geográfico a partir
de qual cidade, orçamento diário, objetivo (ligação / WhatsApp / formulário / visita), e a
URL de destino. Pular o que já está respondido em `marketing/seo/06-google-ads.md`.

### 2. Palavras-chave

Com pesquisa SEO prévia, usar os 10-20 termos de maior intenção comercial/transacional de lá.
Sem pesquisa prévia: gerar 30-50 termos-semente, checar concorrência/sazonalidade, descartar
termos puramente informacionais, e agrupar por cluster de intenção (ex.: variações do mesmo
serviço por formato de entrega).

### 3. Estrutura

Uma campanha Search geral com um grupo de anúncio por cluster (10-15 keywords por grupo,
mix de correspondência exata/frase/ampla modificada, 3 RSAs e negativas locais por grupo);
campanha Local separada é opcional. Lista de negativas globais cobre termo genérico e marca
de concorrente.

### 4. Copies (RSA)

15 headlines por anúncio, distribuídas assim: 5 com a keyword principal do grupo, 3 com
diferencial concreto e verificável (prazo, garantia, certificação), 3 com chamada pra ação
direta, 2 com prova social (tempo de mercado, volume de cliente), 2 de proposta de valor
genérica. 4 descriptions de até 90 caracteres: institucional+CTA, diferencial técnico+CTA,
urgência (se cabível)+CTA, prova social+CTA.

Limite do Google: headline até 30 caracteres, sem emoji, sem caixa alta, sem superlativo sem
fonte ("o melhor" sem prova). Tom sempre alinhado a `_memoria/preferencias.md`.

### 5. Extensões

Sitelinks (4-6, ex. institucional/catálogo/cases/contato/localização), chamada telefônica
(puxar de `empresa.md`), snippet estruturado por linha de serviço/produto, e preço/promoção
quando fizer sentido.

### 6. Configuração da conta

Registrar em `configuracoes.md`: estratégia de lance (maximizar conversão pra começar, migrar
pra tCPA depois de volume mínimo de conversão), orçamento diário, raio geográfico, idioma,
ajuste por dispositivo, programação de horário, e quais conversões precisam estar configuradas
antes de ativar (clique em WhatsApp, envio de formulário, ligação, tempo em página).

### 7. Gerar os arquivos

```
marketing/campanhas/google-ads-<AAAA-MM-DD>/
  campanhas.csv
  grupos.csv
  keywords.csv
  keywords-negativas.csv
  anuncios.csv
  extensoes-sitelinks.csv
  extensoes-chamadas.csv
  extensoes-snippets.csv
  extensoes-preco.csv        (se aplicável)
  configuracoes.md
  README.md                  (passo a passo de import no Editor)
```

Colunas seguem o padrão de importação do Google Ads Editor.

### 8. Fechar com um resumo

Contagem de campanha/grupo/keyword/negativa/RSA gerados, e o passo a passo de importação
(subir `campanhas.csv` primeiro, revisar tudo pausado, ativar manual depois de checar
conversão configurada). Sugerir orçamento inicial conservador por um período de teste curto.

## Regras

- Não inventar valor de CPC — se perguntarem custo, dizer que depende de leilão real e dar
  faixa baseada em pesquisa, nunca número fixo sem fonte
- Toda campanha nasce pausada — ativação é decisão humana
- Sem anunciar termo puramente informacional — isso é papel do SEO orgânico
- Correspondência: frase como padrão, exata pra termo de alto valor, ampla só com histórico de dado
- Lista de negativa global é obrigatória, não opcional
- Sem conversão configurada, o Google não otimiza a campanha — sinalizar isso antes de deixar ativar
