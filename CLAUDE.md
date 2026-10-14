# MontaviaOS

Esse arquivo é o núcleo de operação do MontaviaOS: define como o Claude
carrega contexto de negócio no início de cada conversa, quando registrar
uma correção como regra permanente, e como skills novas entram no
sistema com o tempo. É editável — trate como configuração viva, não como
documentação estática.

`/instalar` grava aqui a seção "Perfil do negócio" na primeira execução.
Tudo mais nesse arquivo é mecânica fixa do sistema, comum a qualquer
instalação.

---

## Carregamento de contexto

Antes de responder qualquer coisa numa conversa nova, ler (se existirem
e tiverem conteúdo):

1. `_memoria/empresa.md` — quem opera esse negócio e como ele funciona
2. `_memoria/preferencias.md` — tom de escrita e o que evitar
3. `_memoria/estrategia.md` — o que é prioridade agora

Esse contexto orienta toda sugestão de abordagem, prazo ou formato daqui
pra frente — não precisa citar que foi lido, só aplicar.

Contextos adicionais, carregados sob demanda conforme o tipo de tarefa:

- **Peça visual** (carrossel, post, página) → `identidade/design-guide.md`
- **Código de sistema, SaaS ou ferramenta** → `_memoria/padroes-tecnicos.md`
  (segurança, LGPD, armadilhas de deploy, princípios de engenharia). Vale
  mesmo se o negócio não for de tecnologia — é bagagem disponível pra
  quando a entrega pedir código.
- **Dado pessoal de terceiro envolvido** → `_memoria/lgpd-referencia.md` e
  os modelos em `templates/lgpd-*.md`
- **Interface/UI de verdade** (site, painel, produto) → skill `impeccable`,
  documentada em `.claude/skills/impeccable/SKILL.md`

---

## Reflexo padrão: existe skill pra isso?

Antes de resolver uma tarefa do zero, olhar `.claude/skills/` — se tiver
skill que cobre o pedido, seguir o roteiro dela. Se não tiver, resolver
normalmente.

Terminou uma tarefa sem skill que claramente vai se repetir? Perguntar:

> "Dá pra transformar isso numa skill pra da próxima vez. Quer que eu monte?"

Só pergunta quando o padrão de repetição é óbvio — não em tarefa avulsa.

---

## Registrar correção como regra permanente

O usuário corrige algo, ou dá uma instrução com cara de definitiva
("na real funciona assim", "para de fazer isso", "sempre que...", "evita
X daqui pra frente")? Perguntar:

> "Guardo isso pra não precisar repetir da próxima vez?"

Se a resposta for sim, decidir o destino certo:

| Tipo de correção | Vai pra |
|---|---|
| Sobre o negócio (cliente, serviço, mercado) | `_memoria/empresa.md` |
| Sobre tom/formato/o que evitar | `_memoria/preferencias.md` |
| Sobre prioridade/foco atual | `_memoria/estrategia.md` |
| Sobre comportamento do sistema em si | este `CLAUDE.md` |

Adicionar uma linha nova e objetiva, sem reescrever o arquivo inteiro, e
mostrar o que foi gravado. Correção óbvia de contexto imediato ("o
arquivo se chama X, não Y") não precisa passar por essa pergunta — só
vale registrar o que tem valor daqui a semanas.

---

## Manter a memória sincronizada

Terminou algo que muda o retrato do negócio (cliente novo, ferramenta
adotada, processo mudou, prioridade mudou)? Perguntar:

> "Isso muda alguma coisa no contexto salvo. Atualizo a memória?"

Mesma tabela de destino da seção anterior, mais `identidade/design-guide.md`
pra mudança visual. Mostrar o diff antes de gravar, editar só o trecho
relevante.

Não perguntar em tarefa isolada sem repercussão (email avulso, post
único) nem quando a correção já foi coberta pela seção anterior. Em caso
de dúvida sobre o que ficou desatualizado, `/atualizar` faz a varredura
completa.

---

## Quando o usuário pedir uma skill nova

1. Checar `templates/skills/catalogo.md` — se tiver molde parecido, partir dali
2. Perguntar se é algo específico dessa instalação (`.claude/skills/`) ou
   de uso geral em qualquer projeto (`~/.claude/skills/`)
3. Ler `_memoria/empresa.md` e `_memoria/preferencias.md` antes de
   escrever, pra a skill nascer calibrada
4. Arquivo de apoio (template, exemplo) vai dentro da própria pasta da skill
5. Seguir o fluxo padrão de criação de skill do Claude Code

---

## Segurança por padrão

O checklist completo vive em `_memoria/padroes-tecnicos.md` — não
duplicado aqui de propósito, pra não ter duas cópias divergindo com o
tempo. Regra geral: aplicar esse checklist desde o commit inicial de
qualquer projeto que vai pra produção, sem esperar pedido; revisitar
sempre que mexer em autenticação, controle de acesso ou armazenamento de
um projeto já existente.
