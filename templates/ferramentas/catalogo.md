# Catálogo de ferramentas

Referência de API, CLI e conector reaproveitável dentro de uma skill. Consultar antes de criar
skill nova pra saber o que já está disponível.

---

## Renderizar HTML em imagem

**Playwright** — roda local, sem conta. Tira print de HTML em qualquer resolução.

```bash
npx playwright install chromium
npx playwright screenshot --viewport-size=1080,1350 --full-page "file:///caminho/slide.html" "slide.png"
```

Tamanhos comuns: feed 1080×1350, story/reels 1080×1920, slide 16:9 1920×1080, quadrado 1080×1080.

## Publicar HTML com link público

Serviço de hospedagem estática com API (ex.: Cloudflare Pages) — publica arquivo com link
compartilhável, útil sempre que uma skill gera HTML que precisa circular por link.

## Publicar em rede social

Serviço de publicação automática de post (varia por provedor) — usado por skill de conteúdo
visual que fecha o ciclo até o post ir ao ar sem intervenção manual.

## Buscar conteúdo da web

**Busca e leitura de URL nativas** — já disponíveis sem configuração, pra pesquisa de
referência, leitura de artigo, extração de dado de página.

**Leitor de artigo alternativo** — serviço que converte URL em markdown limpo, mais confiável
que leitura direta em página com muito HTML de layout.

## Extrair conteúdo de vídeo

**yt-dlp** (CLI, `brew install yt-dlp`) — baixa transcrição/legenda de vídeo, útil como ponto
de partida pra carrossel, newsletter ou roteiro derivado de um vídeo existente.

## Gerar imagem com IA

Provedor de geração de imagem por texto (Gemini, DALL-E ou equivalente) — chave de API salva
em `.env`, usado por skill de conteúdo visual quando não há foto real disponível.

---

## Conectores de plataforma (MCP)

MCP dá acesso direto a uma plataforma externa dentro do Claude Code. Listar instalado com
`claude mcp list`, remover com `claude mcp remove <nome>`.

| Plataforma | Uso típico |
|---|---|
| Notion | ler/escrever tarefa, base de cliente, documento |
| Gmail | ler e compor email, follow-up |
| Google Calendar | agenda, evento, horário disponível |
| Canva | acessar e criar peça visual |
| Meta Ads | gestão de campanha Facebook/Instagram |
| Google Ads | gestão de campanha e leitura de performance |
| N8N | disparar automação/workflow externo |
| Supabase | banco de dado e backend |
| Telegram | notificação e mensagem via bot |

Instalação segue o padrão `claude mcp add <nome> -- <comando do servidor MCP>`, com a chave
de acesso da plataforma configurada conforme a documentação de cada uma.

---

## Como adicionar uma ferramenta nova

```markdown
### Nome da ferramenta
O que faz: [uma frase]
Precisa de conta: [sim/não]
Configurar: [o que salvar em .env, se aplicável]
Como usar numa skill: [comando]
Quando usar: [tipo de skill onde faz sentido]
```
