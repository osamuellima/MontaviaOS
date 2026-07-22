---
name: carrossel
description: >
  Cria carrosséis e posts visuais pra redes sociais com a identidade da marca — HTML estilizado
  renderizado em PNG via Playwright, com legenda pronta. Cobre carrossel só-texto, carrossel
  com foto e post único. Use quando pedirem carrossel, post visual, conteúdo pra Instagram/TikTok
  ou /carrossel.
---

# /carrossel

Do tema ao arquivo pronto pra postar: HTML estilizado, PNGs renderizados, legenda no mesmo pacote.

## O que ler antes

- `identidade/design-guide.md` — sempre, antes de qualquer decisão visual
- `_memoria/empresa.md`, `_memoria/preferencias.md`
- Playwright disponível pra renderizar (script de screenshot dedicado)
- Geração de foto por IA é opcional — só entra se houver chave de API configurada
- Saída em `marketing/conteudo/<tipo>-<tema>-<data>/`

## Que tipo de peça é essa

- **Carrossel texto puro** — post educativo, dica, lista. Tipografia limpa, cores da marca
  alternando, sem foto.
- **Carrossel com foto** — capa com imagem (gerada ou fornecida) + gradiente + slides internos.
- **Post único** — frase de impacto, dado isolado, depoimento, bastidor.

Sem clareza de qual é, perguntar direto: texto, foto ou único.

## Diretriz visual quando o design-guide estiver vago

Um estilo-base editorial e sóbrio serve de fallback — nunca travar o trabalho esperando
`/instalar` preencher a identidade. Regras gerais:

- Uma família tipográfica, contraste de peso entre título grande (compacto, kerning fechado)
  e rótulo pequeno (todo maiúsculo, kerning bem aberto) — esse contraste é o que dá
  personalidade ao conjunto.
- Paleta enxuta: fundo escuro ou claro + uma única cor de destaque. Nunca várias cores
  competindo no mesmo slide.
- Elementos de apoio reutilizáveis: uma linha fina como divisor, logo e contador de slide
  sempre nos mesmos cantos, selo circular pra data/categoria quando fizer sentido.
- Vocabulário de composição por slide — dar nome interno a cada arranjo (capa, imagem+texto
  lado a lado, texto+imagens embaixo, número grande em destaque, citação) e variar entre eles
  ao longo do carrossel, nunca repetir o mesmo arranjo em slides consecutivos.
- Alternar o fundo (escuro/claro/cor de destaque) de slide a slide — nunca dois iguais seguidos.

Quando `design-guide.md` estiver preenchido, ele manda; isso aqui é só o piso de qualidade
quando não há nada definido ainda.

## Estrutura do carrossel

5 a 10 slides: abertura, miolo variando entre 2-3 arranjos diferentes, fechamento com
chamada pra ação e identidade da marca. Antes de escolher a capa nova, considerar qual foi a
última publicada e alternar o estilo (se a última era clara, a próxima não é; se a última era
foto/escura, a próxima é cor sólida; nunca repetir consecutivamente) — perguntar ao usuário se
ele não souber informar.

## Linguagem

Seguir `_memoria/preferencias.md` à risca. Regra geral: frase natural, sem jargão de
marketing nem corporativês — quem consome o conteúdo raramente fala do jeito que uma agência
fala internamente.

## Legenda — parte obrigatória da entrega, não opcional

Gerar a legenda junto, sem esperar pedido, salva em `legenda.md` na mesma pasta: gancho de
abertura, contexto em 1-2 frases, chamada pra passar o carrossel, bloco de oferta/contato, e
um conjunto de hashtags relevantes (público + nicho + região se fizer sentido).

## Passos

**1. Alinhar** — ler contexto/preferência/identidade, identificar o tipo de peça, definir tema e ângulo.

**2. Escrever o texto primeiro.** Capa com poucas palavras (oferecer variações pra escolher);
cada slide interno carrega uma ideia só, em frase corrida, não bullet; fechamento com chamada
+ marca. Pausa aqui: mostrar o texto completo e esperar aprovação antes de ir pro visual.

**3. Se for carrossel com foto gerada por IA**: montar o prompt em inglês (funciona melhor),
descrevendo assunto, ambiente, iluminação, ângulo e estilo com linguagem de still fotográfico
editorial. Gerar via script configurado, mostrar o resultado antes de seguir — sem aprovação,
ajustar o prompt e tentar de novo. Nunca gerar rosto de pessoa identificável.

**4. Montar o HTML** — um único arquivo com todos os slides como blocos internos, CSS inline,
única dependência externa é a fonte. Aplicar cores/tipografia da identidade, variar arranjo
entre slides, manter logo e contador de página nos mesmos cantos em todos. Slide de
fechamento usa a cor de destaque como fundo.

**5. Renderizar** — script Playwright que abre o HTML e tira print de cada slide no formato
retrato padrão de feed (proporção 4:5); formato vertical de Reels/TikTok (9:16) só quando
pedido explicitamente. Mostrar a capa, um slide interno e o fechamento pro usuário antes de
liberar o restante.

**6. Organizar a saída:**

```
marketing/conteudo/<tipo>-<tema>-<data>/
  texto.md
  foto-<nome>.png        (se houver)
  carrossel.html
  render.js
  instagram/slide-01.png … slide-NN.png
  tiktok/ (se pedido, formato vertical)
  legenda.md
  legenda-linkedin.md    (se pedido, tom mais formal)
```

**7. Oferecer o desdobramento** — perguntar se o mesmo tema vale virar artigo de blog via
`/publicar-tema`.

## Regras

- Identidade visual sempre lida antes de qualquer peça
- Formato padrão retrato 4:5; vertical 9:16 só sob pedido
- Linguagem segue preferências à risca
- Sequência de capa no feed sempre considerada antes de definir a próxima
- Legenda sempre gerada junto, nunca como etapa separada que espera pedido
- Foto por IA sempre aprovada antes de entrar no carrossel, prompt em inglês, nunca rosto identificável
- HTML único por carrossel + script de render na mesma pasta, CSS inline
- Nunca repetir o mesmo arranjo visual em slides seguidos
