---
name: publicar-tema
description: >
  Orquestra a criação completa de uma peça de conteúdo a partir de um tema — escreve o artigo
  de blog, aciona a skill de carrossel pra gerar o resumo visual, e produz legendas pra
  Instagram, Facebook e LinkedIn, tudo amarrado e apontando pro blog. Use quando pedirem pra
  transformar um tema em conteúdo completo, publicar tema, ou /publicar-tema.
---

# /publicar-tema

Pipeline orquestrador: um tema entra, saem artigo + carrossel + três legendas conectados.

## O que ler antes

- Estratégia de conteúdo (`marketing/seo/05-estrategia-conteudo.md`), se existir, como banco de temas
- Pesquisas SEO já feitas (`marketing/seo/01-pesquisa-demanda.md`, `02-analise-concorrencia.md`,
  `08-geo-otimizacao-ia.md`) como insumo, se existirem
- `.claude/skills/carrossel/SKILL.md` — reaproveitada na etapa de carrossel
- Onde fica o blog do site (perguntar se ainda não estiver claro)
- `_memoria/preferencias.md`, `_memoria/empresa.md`, `identidade/design-guide.md`

## Passos

**1. Definir o tema** — se veio explícito, usar. Se não, ler a estratégia de conteúdo, listar
as opções (evitando repetir o que já virou blog) e perguntar qual.

**2. Pesquisa rápida** — antes de escrever, checar keyword principal e variações, como a
concorrência trata o tema (pra fugir do óbvio), e ângulo de otimização pra resposta de IA se
houver material sobre isso.

**3. Escrever o artigo** (800-1500 palavras), destino conforme o stack do site em uso:

- Slug curto em kebab-case, sem palavra de function.
- Frontmatter com título, meta description (150-160 caracteres), data, autor, palavras-chave,
  e **sempre nascendo em rascunho** — só o usuário decide publicar.
- Estrutura: abertura com o problema real do público sem enrolação; um bloco explicando o quê
  e por quê; um bloco prático de como fazer/o que observar; opcionalmente um bloco comparativo
  ou técnico; conexão natural com o que o negócio entrega (sem soar propaganda); chamada final
  pro contato configurado.
- Escrita: frase curta, parágrafo de poucas linhas, dado concreto quando disponível (número,
  prazo, certificação), markdown limpo. Tom sempre de `_memoria/preferencias.md`.

**4. Carrossel-resumo, sem esperar pedido** — acionar a skill de carrossel (formato só-texto),
salvando na pasta do mesmo tema. Abertura ecoa o título do blog; miolo cobre os pontos-chave
do artigo (uma ideia por slide, frase natural); fechamento é chamada pro blog com a URL.
Escolher a capa considerando a sequência recente do feed, igual a skill de carrossel já faz.

**5. Três legendas, salvas na mesma pasta do carrossel:**
- **Feed (Instagram/Facebook)** — gancho na primeira linha, contexto em poucos parágrafos,
  chamada pro carrossel e pro blog, bloco de oferta/contato, conjunto de hashtags relevantes.
- **LinkedIn** — tom mais formal, sem "arraste pro lado", parágrafos mais longos e analíticos
  (o formato comporta), fechamento com uma linha de quem é o negócio em vez de oferta
  explícita, poucas hashtags profissionais.

**6. Fechar com um resumo objetivo** do que foi criado (caminho do blog em rascunho, pasta do
carrossel, arquivos de legenda) e o passo a passo pra publicar de fato — revisar e tirar do
rascunho, rebuild/deploy do site, renderizar os PNGs do carrossel, publicar (manual ou via
`/aprovar-post`).

## Quando não é essa skill

- Carrossel avulso sem blog por trás → `/carrossel` direto
- Só atualizar um artigo que já existe → editar o arquivo direto
- Post único de impacto sem virar artigo → `/carrossel`

## Princípios

1. O blog é a peça-mãe — carrossel e legendas derivam dele, nunca o contrário
2. Cada peça referencia a outra — o carrossel aponta pro blog, o blog fecha com o contato
3. Sempre nasce em rascunho — publicação é decisão humana, direta ou via `/aprovar-post`
4. Linguagem do público real, nunca corporativês
