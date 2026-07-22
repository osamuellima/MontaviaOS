---
name: aprovar-post
description: >
  Publica um conteúdo já pronto (criado por /publicar-tema): tira o blog do modo rascunho,
  leva as imagens do carrossel pro site, faz commit/push pro deploy automático, e publica o
  carrossel no Instagram e Facebook via Meta Graph API. Use quando o usuário aprovar um post
  específico pra ir ao ar, ou pedir /aprovar-post.
---

# /aprovar-post

Liga o conteúdo já revisado (blog + carrossel + legendas) à publicação de verdade no site e
nas redes.

## Quando não é essa skill

- Conteúdo ainda não existe → rodar `/publicar-tema` antes
- Usuário ainda revisando, sem aprovação explícita → esperar
- Site ou credenciais da Meta não configurados → resolver o setup primeiro

## Pré-requisito (configura uma vez)

`.env` com `META_PAGE_ACCESS_TOKEN`, `META_PAGE_ID`, `META_IG_USER_ID`, `SITE_URL`; site com
deploy automático a partir da branch principal; conta Instagram Business ligada à Página do
Facebook com permissão correta no app da Meta; scripts de postagem (`scripts/postar-instagram.js`,
`scripts/postar-facebook.js`) já configurados. Faltando algo, parar e apontar o que falta —
documentar em `marketing/automacao-meta-setup.md` se ainda não existir.

## Argumento

`/aprovar-post <slug>` (nome do arquivo do blog, sem extensão). Sem slug informado, listar os
posts em rascunho e perguntar qual.

## Passos

**1. Localizar tudo.** Blog no caminho do stack do site; pasta do carrossel em
`marketing/conteudo/<slug>-<data>/`; confirmar que existem as imagens (2 a 10 slides) e as
duas legendas (feed e LinkedIn). Faltando qualquer peça, parar e reportar.

**2. Resumo + confirmação.** Mostrar título, quantidade de slides, início da legenda e a URL
final. Perguntar "confirma publicação?" e só avançar com sim explícito.

**3. Tirar do rascunho** — mudar o campo de status no frontmatter do post.

**4. Copiar as imagens** pra pasta pública do site (criar destino se não existir; sobrescrever
em caso de republicação).

**5. Commit e push** do blog + imagens, mensagem descrevendo a publicação.

**6. Esperar o deploy** e confirmar no ar com uma checagem HTTP no post e em pelo menos uma
imagem (a Meta API busca a imagem por URL pública — sem isso disponível, a postagem falha).

**7. Publicar no Instagram** via script configurado; capturar o ID do post. Falhou? Parar
antes de tentar o Facebook.

**8. Publicar no Facebook**, capturar o ID do post.

**9. LinkedIn fica manual** (API de empresa exige aprovação à parte) — entregar o texto pronto
pra colar.

**10. Fechar com o resumo**: link do post no site, link do post no Instagram, link no Facebook,
e o aviso de que o LinkedIn ainda depende de colagem manual.

## Tratamento de falha

- Push falhou → reverter o campo de rascunho, reportar, parar
- Deploy não confirmou dentro do tempo esperado → reportar e perguntar se segue mesmo assim
- Instagram falhou → parar (site e blog já publicados, só o post no feed que não saiu)
- Facebook falhou com Instagram OK → reportar, sugerir repetir só essa etapa depois

## Princípios

1. Nada irreversível roda sem confirmação humana explícita — o passo 2 nunca é pulado
2. Rodar de novo com o mesmo slug deve reconhecer que já foi publicado e perguntar se é
   republicação ou só atualização
3. Pré-requisito faltando aborta cedo, com explicação clara do que falta
4. Cada etapa relata o que está fazendo e o resultado, sem caixa preta
