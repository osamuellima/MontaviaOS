---
name: vuln-scan
description: Varredura completa (ou rápida, 5 categorias-chave) de vulnerabilidades para usar depois de finalizar (ou antes de publicar) um site, ferramenta, API ou sistema. Detecta o stack do projeto, monta um escopo de auditoria a partir de um checklist de 76 categorias (OWASP Top 10/API/GenAI, LGPD, Supabase/Firebase, cloud, CI/CD, supply chain, mobile etc) ou roda o modo rápido (tenant/RLS, permissão só no frontend, IDOR, chaves expostas, XSS), confirma o escopo com o usuário, varre item por item e gera relatório em Markdown por severidade — ou, se pedido, PDF visual com gráficos e issues do GitHub prontas pra colar em docs/security-audit/. Não é a revisão de diff (isso é a skill security-review) — é auditoria estática do projeto inteiro.
---

# Vuln Scan

Varredura de vulnerabilidades pós-construção (ou pré-deploy) de um projeto
inteiro — não apenas o diff pendente. Cobre aplicação, infraestrutura,
privacidade/LGPD e processo, a partir do checklist completo em
`references/checklist.md`.

## Princípios

1. **Escopo por detecção, não por adivinhação.** Nunca rode as 76 categorias
   cegamente. Inspecione o projeto primeiro e monte uma lista curta e
   justificada do que se aplica.
2. **Confirmar o escopo antes de varrer.** Mostre ao usuário a lista de
   categorias que você pretende auditar (e as que descartou, com o motivo)
   antes de começar. Ele pode adicionar ou remover categorias.
3. **Item por item, não superficial.** Dentro de cada categoria escolhida,
   percorra os itens do checklist um a um contra o código real — não é para
   ler o checklist e gerar impressões gerais. Ver
   [[feedback_padrao_seguranca_todos_projetos]]: "a verificação deve ser
   feita item por item, um de cada vez, até ficar completa".
4. **Achado real, não teórico.** Todo item reportado precisa apontar para
   arquivo:linha (ou ausência confirmada de proteção) no código atual. Se um
   item do checklist não se aplica ou já está coberto, não vira "achado" —
   fica de fora do relatório (não precisa listar o que está OK, só o que
   está errado ou faltando).
5. **Escanear e relatar, nunca corrigir de imediato.** Esta skill tem duas
   fases estritamente separadas: (a) escaneamento e verificação completos,
   (b) apresentação do que precisa ser alterado. Não edite nenhum arquivo de
   código durante a varredura, mesmo que o fix pareça trivial ou óbvio. Só
   depois de entregar o relatório completo — com todos os achados já
   levantados — é que se pergunta ao usuário se ele quer aplicar correções
   (Etapa 4). Corrigir no meio do escaneamento quebra a visão completa do
   estado real do projeto antes de qualquer mudança.
6. **Nunca vazar segredo real no relatório.** Se encontrar uma chave/senha
   exposta, cite o arquivo:linha e o tipo de segredo, mas não copie o valor
   inteiro para o relatório nem para o chat — trunque (`sk-live-***`).

## Etapa 1 — Reconhecimento do projeto

Rode em paralelo o que for aplicável para identificar o stack:

- `package.json` / `requirements.txt` / `go.mod` / `composer.json` etc. →
  framework, linguagem, dependências.
- Presença de `supabase/`, `firebase.json`, `.firebaserc` → BaaS específico.
- `Dockerfile`, `docker-compose.yml`, `k8s/`, `*.tf` → containers/IaC.
- `.github/workflows/`, `.gitlab-ci.yml`, `vercel.json` → CI/CD e deploy.
- `ios/`, `android/`, `app.json` (Expo), `*.xcodeproj` → mobile.
- Rotas de API (`app/api/`, `pages/api/`, `routes/`, controllers) → superfície
  de API.
- Uso de IA/LLM no código (chamadas a APIs de modelo, RAG, embeddings,
  agentes/MCP) → seção 46-50 do checklist.
- Coleta de dados pessoais (formulários, CPF/CNPJ, cadastro de cliente) →
  seção 42 (LGPD).
- `git log`/histórico para checar se já houve commit de `.env` ou segredo
  (não precisa auditoria de Git completa se o repo é nosso e recente, mas
  vale um `git log --all --full-history -- .env` rápido).

Use Explore (Agent) se o projeto for grande e a varredura de arquivos for
extensa; para projetos pequenos, `grep`/`find` direto via Bash é suficiente.

## Etapa 2 — Montar e confirmar o escopo

As duas velocidades não são alternativas excludentes — a rápida é a
triagem de maior densidade de risco e vive **dentro** da completa:

- **Pedido de varredura completa** (padrão, inclusive quando o usuário só
  diz "roda o vuln-scan" sem qualificar): rodar primeiro as 5 categorias
  do modo rápido (Etapa 3, prioridade máxima), depois seguir pro resto do
  escopo de 76 categorias montado abaixo. O relatório final é único — as
  5 categorias rápidas não geram uma entrega separada, só são a primeira
  fatia a ser varrida e aparecem no relatório como qualquer outra
  categoria.
- **Pedido explícito de algo rápido/enxuto** ("varredura rápida", "só uma
  checada de 5 pontos", "não precisa da auditoria toda agora"): rodar só
  as 5 categorias e entregar um relatório rápido, sem montar o escopo de
  76 categorias. Se o usuário quiser a auditoria completa depois, ela
  reaproveita esse achado em vez de reprocessar as mesmas 5 categorias.

### As 5 categorias de prioridade máxima

Sempre as primeiras a ser varridas — seja como varredura standalone
(modo rápido) ou como abertura da varredura completa. Adaptar cada uma ao
equivalente da stack detectada na Etapa 1:

1. **Banco sem tranca (isolamento de tenant/dono).** Identifique primeiro
   qual é o mecanismo de isolamento do projeto (RLS do Supabase, middleware
   de tenant, filtro manual por `user_id`, etc.) e aponte onde está
   ausente ou furado — queries de listagem/busca/agregação/relatório/
   exportação que não filtram pelo usuário ou organização do chamador.
2. **Permissão definida no navegador.** Cruze cada gate de papel do
   frontend (`isAdmin`, `canEdit`, `role`...) com o endpoint
   correspondente e confirme se o backend valida o mesmo privilégio —
   não só o frontend escondendo botão/UI. Se o app já está publicado
   (URL acessível), complemente com fingerprint de paths administrativos
   via HTTP direto (`/admin`, `/wp-admin`, `/api/admin`, `/.env`,
   `/.git/config` etc. — lista completa e método de controle negativo em
   `references/checklist.md`, categoria 11): teste sempre um path
   inventado em paralelo como controle — se ele recebe a mesma resposta
   dos paths "reais" (ex: mesmo 307 para login), é middleware catch-all
   de auth, não enumeração possível, e nada ali é achado.
3. **IDOR.** Percorra sistematicamente TODOS os handlers de rota do
   backend que buscam/alteram/deletam objeto por ID (path, query ou
   body) — não amostras — e confirme posse/pertencimento ao chamador.
4. **Chaves expostas (hardcode).** API keys, tokens, senhas, segredos de
   assinatura (JWT, webhook), chaves privadas e credenciais padrão em
   código-fonte, configs, docker-compose, charts, CI, scripts e
   documentação. Atenção a defaults públicos que viram segredo real sem
   override (`${VAR:-valor-default}`) e à ausência de validação de
   startup que rejeite esses defaults. Checar também histórico git e
   bundle do frontend.
5. **Inputs sem tratamento (XSS).** Frontend: `innerHTML` /
   `dangerouslySetInnerHTML` / equivalentes (`v-html`, `[innerHTML]`),
   markdown/HTML renderizado sem sanitização, URL controlada pelo usuário
   em `href`/`src` (`javascript:`), `eval`/`new Function`. Backend: input
   do usuário entrando em HTML de e-mail/template/resposta sem escape.
   Verificar se existe lib de sanitização no projeto e se é aplicada nos
   pontos encontrados.

O modo rápido segue as mesmas regras de fundo da Etapa 3 (achado real com
arquivo:linha, severidade, condição de explorabilidade, registrar também o
que está correto) — só o escopo é fixo em vez de escolhido por detecção.
Se uma categoria não se aplicar à stack (ex: projeto sem frontend), diga
isso explicitamente em vez de forçar achado.

### Restante do escopo (categorias 6-76)

Depois de rodar as 5 de prioridade máxima, complete o escopo com o resto
do `references/checklist.md`. Categorias do bloco "Aplicação — núcleo"
(1-18) quase sempre entram se houver qualquer backend/auth/banco — note
que os itens 1-5 já cobrem boa parte de autenticação/autorização/tenant,
então aqui é sobretudo o que sobrou (JWT/sessões, CORS, CSRF, headers,
upload, criptografia). Categorias de infraestrutura (19-39), plataformas
específicas (40-41, 53-59), privacidade (42-43, 54, 72) e processo
(44-45, 64-71, 73-74) entram só se o reconhecimento achou evidência real
do componente correspondente. Os padrões transversais (46-52, 60-63)
entram conforme o que foi detectado (IA/agentes, filesystem, SSRF-prone,
geração de documentos) — **categoria 48b (OWASP Agentic ASI01-10) entra
sempre junto com 46-48/50 quando o projeto usa Claude Code/skills/MCP com
qualquer autonomia de múltiplos passos**, não só quando há "IA no produto
do cliente": o próprio ambiente que roda a varredura é candidato.

**Categoria 76 (segurança do desenvolvedor e da cadeia de acesso) entra
sempre, em qualquer varredura completa** — diferente das outras, não
depende de reconhecimento de arquivo (não tem como confirmar 2FA ou
colaborador removido via grep), então pergunte diretamente ao usuário
sobre 2FA nas plataformas de deploy, PATs/chaves SSH, colaboradores com
acesso residual e controle de quem publica em produção, em vez de pular
por falta de evidência automática.

**Os 4 itens documentais da categoria 42 (DPO nomeado, protocolo de
incidente com prazo de 3 dias úteis, ROPA, política de privacidade real)
também entram sempre que houver qualquer coleta de dado pessoal
detectada** (formulário, cadastro, CPF/CNPJ) — mesma lógica da 76:
perguntar direto ao usuário, nunca pular por falta de achado em código.
Não são achados técnicos, mas são o que a ANPD de fato usa pra multar na
prática (a única multa paga até hoje foi por ausência de DPO e base
legal, não por vazamento técnico) — nunca deixar de fora de uma auditoria
LGPD só porque não aparecem num grep.

Apresente a lista ao usuário (categorias incluídas + por que; categorias
descartadas + por que) via `AskUserQuestion` ou texto direto, e espere
confirmação/ajuste antes de prosseguir. Não pule esta etapa mesmo em
sessões repetidas — o escopo muda a cada projeto.

## Etapa 3 — Varredura item por item

Ordem de execução: as 5 categorias de prioridade máxima primeiro (sempre,
mesmo na varredura completa), depois o restante do escopo confirmado na
Etapa 2. Para cada categoria, percorra os itens do checklist um a um.
Esta é a fase de leitura — nenhuma edição de código acontece aqui.

- Leia o arquivo inteiro, linha a linha, não apenas os trechos que o grep
  destacou — um grep por padrão (`service_role`, `dangerouslySetInnerHTML`,
  `eval(`, etc.) acha o óbvio, mas IDOR, lógica de autorização quebrada e
  race conditions só aparecem lendo o fluxo completo da função/rota.
  Grep/Explore servem para localizar os arquivos candidatos; a verificação
  em si é leitura completa do arquivo relevante.
- Use Read/Grep, ou um Agent Explore por categoria se o escopo for grande
  (pode paralelizar categorias independentes em subagents) — mas o
  julgamento final de "é ou não é achado" é sempre baseado no código lido
  por completo, nunca só no snippet do resultado de busca.
- Para cada item, decida: **não se aplica** (ignore, não reporte),
  **verificado e OK** (ignore, não reporte), ou **achado** (vai para o
  relatório).
- Classifique severidade de cada achado:
  - **Crítico**: exploração direta expõe dados de outro tenant/usuário,
    permite escrita/exclusão não autorizada, ou vaza segredo com privilégio
    alto (service_role, chave de produção, credencial de banco).
  - **Alto**: vulnerabilidade clássica exploravel (IDOR, SQLi, XSS
    persistente, auth bypass) mas com blast radius menor, ou exposição de
    dado sensível sem escrita.
  - **Médio**: falta de defesa em profundidade (rate limiting ausente,
    header de segurança faltando, mensagem de erro verbosa) que não é
    exploração direta mas facilita ataque.
  - **Baixo**: desvio de boa prática, processo ou higiene (dependência
    desatualizada sem CVE conhecido, ausência de SBOM, log verboso não
    sensível).
- Cite sempre arquivo:linha. Se o achado é ausência de algo (ex: nenhuma
  RLS na tabela X), cite onde deveria estar (a migration/tabela) e a
  ausência confirmada.

## Etapa 4 — Relatório

Gere um arquivo Markdown no projeto (ex.: `SECURITY-SCAN-YYYY-MM-DD.md` na
raiz, ou dentro de `docs/security/` se essa convenção já existir no
projeto). Estrutura:

```markdown
# Varredura de vulnerabilidades — <nome do projeto>

Data: <data>
Escopo auditado: <categorias>
Escopo descartado: <categorias + motivo>

## Crítico
### [categoria] título curto do achado
- **Onde:** arquivo:linha
- **Problema:** descrição concreta do que está errado
- **Cenário de exploração:** input/ação → resultado indevido
- **Recomendação:** o que corrigir

## Alto
...
## Médio
...
## Baixo
...

## Itens verificados sem achados
<lista curta das categorias/itens que foram checados e estão OK — só os
títulos, sem detalhar item por item>
```

Depois de entregar o relatório, pergunte ao usuário se quer que os achados
(todos, ou só Crítico/Alto) sejam corrigidos agora — nunca aplique fix sem
essa confirmação explícita, mesmo que o achado seja óbvio.

### Formato de saída alternativo — PDF visual + issues para GitHub

Por padrão o relatório é o Markdown acima. Se o usuário pedir um relatório
em PDF (ou pedir explicitamente "relatório visual", "PDF pra mandar pro
cliente/time"), gerar em vez disso (ou além disso) um PDF em
`docs/security-audit/relatorio-auditoria-seguranca.pdf`, em pt-BR. O PDF é
**um documento único** consolidando tudo que foi varrido na Etapa 3 — as 5
categorias de prioridade máxima e o restante do escopo de 76 categorias aparecem
juntos nas mesmas seções/gráficos/tabelas, sem separação visual entre
"rápida" e "completa" (essa distinção só importa nas Etapas 2-3, não na
entrega):

**Conteúdo do PDF:**
a) Capa — título "Relatório de Auditoria de Segurança — <nome do
   projeto>", data, escopo auditado (todas as categorias efetivamente
   varridas, sejam as 5 prioritárias sozinhas no modo rápido ou o
   conjunto completo) e nota metodológica de como cada categoria foi
   mapeada pra stack detectada na Etapa 1.
b) Resumo executivo — total de achados por severidade, gráfico de rosca
   por severidade e gráfico de barras por categoria. Paleta: crítica
   `#B91C1C`, alta `#EA580C`, média `#D97706`, baixa `#2563EB`, ponto
   forte `#059669`.
c) Pontos fortes (com evidência) e pontos fracos (riscos centrais).
d) Tabela de achados por categoria: Severidade | Arquivo:linha |
   Descrição, com chip de severidade colorido.
e) Recomendações priorizadas (P1, P2, P3...).
f) Seção final "Issues para o GitHub" — para cada achado acionável, o
   texto completo de uma issue em Markdown pronta pra copiar e colar,
   dentro de um bloco delimitado (`--- ISSUE n ---` / `--- FIM ISSUE n
   ---`), contendo: título `[Segurança] <descrição curta>`, labels
   sugeridas (`security` + severidade), descrição do problema e por que é
   explorável, evidência (arquivo:linha + trecho truncado — nunca o valor
   real de um segredo), impacto, sugestão de correção, critérios de
   aceite em checklist. Agrupar achados triviais do mesmo tema numa issue
   única (ex: vários defaults de segredo) para não gerar spam.

**Regras técnicas de geração:**
- Não instalar nada globalmente — usar ambiente isolado (venv Python com
  `reportlab`+`matplotlib`, ou equivalente da stack local; HTML→PDF via
  navegador headless/wkhtmltopdf/pandoc também vale se disponível).
- Deixar o script gerador em `docs/security-audit/` para regerar o
  relatório depois de futuras varreduras.
- Verificar o PDF gerado (número de páginas, renderização dos gráficos,
  legibilidade das tabelas — rasterizar páginas se possível) e corrigir
  defeitos visuais antes de entregar.
- A4, margens ~2cm, cabeçalho/rodapé com nome do relatório e nº de página.
- Mesma regra de segredo do princípio 6: nunca colocar valor real de
  chave/senha no PDF, nem nas issues — sempre truncado.

Entregar ao final: o PDF, e a lista de achados também no chat (arquivo por
arquivo, linha por linha), já que o PDF é documento de distribuição, não
substitui a checagem interativa do achado com o usuário.

## Checks obrigatórios (sempre, em todo projeto web)

Estes quatro itens nunca podem ficar diluídos dentro do checklist geral —
rode-os explicitamente em toda varredura, independente do escopo escolhido
na Etapa 2, porque são causa direta de vazamento de dado real e de exposição
a multa LGPD:

1. **Nenhuma chave/segredo sensível com prefixo `NEXT_PUBLIC_` (ou
   equivalente do framework — `VITE_`, `REACT_APP_`, `PUBLIC_` no
   SvelteKit/Astro).** Qualquer env var com esse prefixo é embutida no
   bundle JS e fica visível no DevTools/"Inspecionar" de qualquer visitante.
   Grep por `NEXT_PUBLIC_` (e equivalentes) em todo `.env*` e no código, e
   confirme que só há ali chaves feitas pra serem públicas por design (ex.:
   Supabase `anon key`, que é pública por padrão — ver seção 5 do
   checklist). Qualquer coisa com privilégio de escrita, bypass de RLS, ou
   acesso administrativo (`service_role`, chave de API paga, segredo de
   assinatura de JWT) com esse prefixo é achado **Crítico** automático.
2. **Nenhum segredo hardcoded no código-fonte — tudo via variável de
   ambiente configurada direto na plataforma de deploy** (Vercel, Supabase,
   etc.), nunca só no `.env` local. Confirmar: (a) grep por padrões de
   chave/token/senha literal no código (`sk-`, `Bearer `, strings longas
   suspeitas atribuídas a constantes); (b) `.env`, `.env.local` e
   equivalentes estão no `.gitignore` **antes** de qualquer commit — rodar
   `git log --all --full-history -- .env .env.local` pra confirmar que
   nunca foram commitados; (c) cruzar com
   [[feedback_verificar_env_vars_deploy]] — variável existir só no
   `.env.local` da máquina do usuário não significa que existe em produção.
3. **Nada sensível em `localStorage`**: grep por `localStorage.setItem` e
   auditar cada uso — token de autenticação, e-mail, CPF/CNPJ ou qualquer
   dado pessoal ali é achado **Alto/Crítico**, porque qualquer XSS na
   página lê `localStorage` via JavaScript sem restrição nenhuma. Token de
   sessão deve viver em cookie, nunca em `localStorage`/`sessionStorage`.
4. **Cookie de sessão/autenticação com `httpOnly`, `secure` e
   `sameSite` configurados** — sem `httpOnly`, o cookie também vira legível
   por JavaScript (mesmo risco de XSS do item 3). Verificar onde o cookie é
   setado (middleware, rota de login, config do client de auth) e confirmar
   as três flags. Isso já está coberto em mais detalhe na seção 14 do
   checklist (JWT e sessões).

Nota sobre `sessionStorage`: ele já é limpo automaticamente pelo navegador
quando a aba fecha — isso é garantido pela especificação, não é algo que o
código da aplicação possa configurar certo ou errado. O risco real não é
"ele persistir" — é o mesmo do item 3: se guardar token/CPF/e-mail ali,
qualquer XSS lê o valor enquanto a aba está aberta. Reporte como achado só
se houver dado sensível sendo escrito em `sessionStorage`, não a mera
existência dele.

## Notas específicas de stack (Next.js + Supabase + Vercel)

Como grande parte dos projetos deste usuário usa esse stack, ao rodar as
categorias 1-5 e 18 valide especificamente:

- CSP com nonce por requisição exige `export const dynamic = "force-dynamic"`
  em todo layout/página que usa o nonce — sem isso, páginas estáticas
  quebram silenciosamente em produção com nonce velho. Ver
  [[feedback_csp_nonce_force_dynamic]].
- RLS: nunca confiar que o `.sql` local reflete o banco real — rodar
  verificação contra `pg_policies`/`information_schema.routines` no projeto
  Supabase de fato antes de marcar um item de RLS como OK.
- `supabase/config.toml`: se o projeto tiver histórico de
  `supabase config push`, checar se configs de auth em produção (MFA,
  confirmação de e-mail, rate limit) não foram revertidas silenciosamente
  por um push anterior. Ver [[feedback_supabase_config_push_risco]].
- Env vars: confirmar com `vercel env ls production` que toda variável que
  o código espera existe de fato em produção, não só local. Ver
  [[feedback_verificar_env_vars_deploy]].

## Referência

Checklist completo (76 categorias, ~1000 itens) em `references/checklist.md`
— carregue esse arquivo inteiro na Etapa 2 e mantenha aberto durante a
Etapa 3. O checklist termina com uma seção "Checklist mínimo
pré-produção" — uma síntese de uma linha por domínio, útil pra decidir
rapidamente com o usuário se vale rodar a varredura completa antes de um
deploy importante, sem precisar reler as 76 categorias inteiras.
