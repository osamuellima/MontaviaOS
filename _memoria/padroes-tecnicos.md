# Padrões técnicos — segurança, LGPD e engenharia

> Checklist permanente pra qualquer sistema/SaaS/micro-SaaS/ferramenta construído sob o FrameupOS.
> Aplicar desde o início do projeto, sem esperar o cliente/usuário pedir — não é opcional nem "se sobrar tempo".
> Consultar junto com `_memoria/empresa.md` e `_memoria/preferencias.md` no início de qualquer sessão que envolva escrever código.

---

## 1. Checklist mínimo de segurança (todo projeto que vai pra nuvem)

Todo sistema que roda na nuvem (Vercel, Supabase, etc.) — site, painel, sistema interno, portal de cliente — nasce (ou é corrigido pra) seguir isso, sem esperar o cliente pedir:

1. **Security headers HTTP** (CSP, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) — via `next.config.ts` `headers()` em projetos Next.js, ou `vercel.json` em sites estáticos.
2. **Autenticação**: nunca senha hardcoded em código-fonte — sempre variável de ambiente. Comparação de senha timing-safe (`crypto.timingSafeEqual`), nunca `===` puro. Cookie de sessão com `httpOnly`, `secure`, `sameSite`.
3. **Rate limiting em login** — mesmo que só em memória (não escala em serverless multi-instância, mas já eleva o custo de um ataque de força bruta simples).
4. **RLS/multi-tenant no banco**: toda tabela com dado de um cliente específico precisa de Row Level Security ativa e policy testada — especialmente o INSERT/UPDATE em tabelas de membership/role, que é onde mais aparece brecha de "qualquer usuário vira owner de qualquer organização".
5. **Menor privilégio**: role "viewer"/leitura não deve conseguir escrever; funções que concedem privilégio administrativo não podem se basear em algo que o próprio usuário controla (criar sua própria org e virar owner dela, editar seu próprio `user_metadata`) — sempre atrelar a um convite/registro verificado.
6. **Validação de input no servidor** (zod ou equivalente) em toda rota de API/Server Action que recebe dado do usuário — nunca confiar só em validação client-side.
7. **Nunca expor stack trace/erro de banco bruto** pro cliente — logar server-side, devolver mensagem genérica.
8. **Arquivos sensíveis em storage** (Vercel Blob, Supabase Storage) privados por padrão; se algum recurso de terceiro exigir URL pública, usar path aleatório/não adivinhável e apagar versões antigas ao trocar o arquivo.
9. **Sanitização contra CSV/Excel formula injection** ao escrever dado vindo de upload/CSV em planilha gerada (prefixar valores que começam com `=`, `+`, `-`, `@`).
10. `npm audit` checado e reportado (não necessariamente `--force` — pode quebrar o app; avaliar caso a caso).

## 2. LGPD — dado pessoal/sensível de terceiros

Qualquer sistema que lida com dado de terceiros (financeiro, cadastral, bancário, pessoal, de saúde) segue LGPD por padrão:

- Não expor dado sensível desnecessariamente (logs, prints, exports públicos).
- RLS/controle de acesso por organização — isolamento real entre tenants, não só filtro na query.
- Anonimizar/mascarar dado pessoal em exemplos, demos ou material de marketing/venda.
- Não incluir CPF/CNPJ, dado bancário completo ou informação identificável de terceiro em documento que não precise disso (proposta, case, apresentação).
- Sinalizar proativamente pro usuário se um pedido implicar risco de exposição de dado pessoal sem base legal clara.
- Ao começar um sistema novo (ver `.claude/skills/novo-projeto`), perguntar de cara: que tipo de dado sensível ele vai tocar, e se é multi-tenant. A resposta determina se os itens 4/5/2 acima entram desde o commit inicial.
- Referência legal completa (papéis, bases legais, dado sensível, direitos do titular, retenção): `_memoria/lgpd-referencia.md`. Checklist aplicável a todo projeto de site/sistema/SaaS entregue a cliente: `templates/lgpd-projeto.md`. Cláusula pronta pra contrato de prestação de serviço: `templates/clausula-lgpd-contrato.md`.

## 3. Armadilhas de deploy já vividas (não repetir)

- **CSP com nonce por requisição exige `export const dynamic = "force-dynamic"`** em `app/layout.tsx` (Next.js). Sem isso, páginas marcadas `○ Static` no build são pré-renderizadas uma vez com nonce fixo, que nunca bate com o nonce novo do middleware — quebra hidratação/login de forma intermitente **só em produção**, sem erro visível (login "carrega e volta"). `next dev` não reproduz o bug. Depois de qualquer deploy que mexa em auth/CSP/middleware, validar com navegador real contra produção, 2-3x seguidas (não só uma, não só curl).
- **`supabase config push` sincroniza o `config.toml` inteiro**, não só a seção editada — pode reverter silenciosamente config de produção (ex.: `enable_confirmations`, `max_frequency` do e-mail, MFA) que nunca foi tocada intencionalmente. Sempre olhar o diff `remote[x]` vs `local[x]` linha a linha antes de confirmar.
- **Env var nova nunca sincroniza sozinha pra Vercel** — `.env.local` só existe na máquina local. Depois de migração que introduz variável nova, rodar `vercel env ls production` antes de declarar o deploy pronto; se faltar, `vercel env add` antes do deploy, não depois. Validar com chamada real (curl/browser) contra produção, não só localhost.
- **Chave Resend sem domínio verificado (`from: algo@resend.dev`) só entrega pro dono da própria conta** — 403 pra qualquer outro destinatário. Não dá pra usar como SMTP de auth/convite pra usuário real sem verificar domínio em resend.com/domains. Serviço de e-mail embutido do Supabase (sem SMTP customizado) tem limite de 2 e-mails/hora — baixo demais pra login+convite+reset juntos num produto real.

## 4. Princípios de engenharia a aplicar por padrão

- **KISS**: lógica simples e direta em vez de engenharia complexa que ninguém vai conseguir manter depois.
- **Acoplamento fraco / alta coesão**: separar responsabilidades em vez de misturar tudo num arquivo/função só.
- **MVVM conceitual**: View só cuida de UI/renderização; ViewModel gerencia estado da tela; Model fica com dado bruto, chamada de API/serviço, mapeamento de contrato.
- **SRP**: cada arquivo/função tem um motivo só pra mudar — se uma função calcula e também salva, dividir em duas.
- **OCP**: extensível sem reabrir o módulo central e empilhar `if/else` — plugar módulo novo em vez de alterar lógica existente.
- **Pirâmide de testes**: unitário (base, barato/rápido) → integração → E2E.
- **Manutenção é a etapa mais longa do ciclo de vida** — código legível pensando em quem vai mexer nele meses depois (inclusive o próprio usuário).
- **Separação de linguagem por arquivo — regra geral, não só web**: cada linguagem/tecnologia no seu próprio arquivo, nunca misturada por conveniência. HTML/CSS/JS (`.html` + `.css` + `.js`, nunca `<style>`/`<script>` inline no markup) é só o exemplo mais comum — a mesma regra vale pra qualquer combinação: SQL fora de string Python solta (usar arquivo `.sql`/migration ou ORM, não query concatenada no meio da lógica de negócio), config fora do código (`.env`/`.yaml`/`.json`, não constante mágica espalhada), template fora da lógica de renderização, shell script fora de heredoc gigante dentro de outro script. Exceção legítima: quando o próprio framework exige o formato misto por design (JSX/Tailwind em componentes React, um Artifact que precisa ser um único HTML autocontido) — aí a convenção da ferramenta vale, não essa regra. Fora dessas exceções, estrutura tem que estar clara à primeira vista, cada linguagem isolada no seu lugar.
  **Por quê:** qualquer sistema construído sob o FrameupOS pode um dia precisar que outro desenvolvedor (não o Claude, não quem pediu o projeto) entre no código pra dar manutenção. Se ele abrir o projeto e encontrar tudo separado e previsível, entende a estrutura em minutos; se encontrar HTML/CSS/JS/SQL misturados "porque foi mais rápido assim", a entrada dele fica mais lenta e o risco de quebrar algo por não entender o que está mexendo sobe — o custo dessa bagunça é pago por quem vier depois, não por quem escreveu.

## 5. Regra geral pra qualquer dado usado num entregável

Nunca inventar valor de contrato, preço, métrica ou dado real de cliente como se fosse fato — usar placeholder explícito ("[a definir]") quando o número real não foi informado. Dado de mercado/estatística deve ser pesquisado/verificado, não assumido de memória.

---

Ver também `identidade/design-guide.md` (marca) e `_memoria/preferencias.md` (tom de voz) — este arquivo cobre só o lado técnico/segurança/compliance.
