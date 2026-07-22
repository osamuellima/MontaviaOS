---
name: atualizar
description: >
  Compara o que está registrado em _memoria/, CLAUDE.md e identidade/design-guide.md com o
  estado real do workspace, e propõe correções pro que ficou desatualizado. Use quando o
  usuário pedir uma varredura geral ou disser "/atualizar".
---

# /atualizar

Reconciliação entre o que o sistema "acha" que é verdade e o que de fato existe no projeto.

## Passos

**1. Levantar o estado real** — pastas na raiz, subpastas de cliente (se houver `clientes/`),
skills instaladas hoje em `.claude/skills/`, e arquivos criados/alterados recentemente nas
pastas de saída relevantes.

**2. Comparar contra o que está escrito:**
- `_memoria/empresa.md` — a lista de cliente/serviço/ferramenta ainda bate com a realidade?
- `_memoria/estrategia.md` — a prioridade registrada ainda faz sentido, ou já passou da data?
- `CLAUDE.md` — a estrutura de pastas descrita bate com o que existe de verdade?
- `identidade/design-guide.md` — ainda condiz com o que as últimas peças geradas usaram?

**3. Propor, não aplicar direto** — listar cada divergência encontrada com a evidência
concreta que a sustenta, e perguntar se aplica tudo, escolhe algumas, ou ignora.

**4. Aplicar com cirurgia** — só a linha que mudou, nunca reescrever o arquivo inteiro. Mostrar
o que foi alterado em cada arquivo tocado.

## Regras

- Nada de inferência sem evidência no workspace — se a pista for ambígua (pasta vazia com
  nome genérico, por exemplo), perguntar antes de registrar como fato
- Atualizar e complementar, nunca apagar conteúdo existente sem necessidade
- Sem nada pra atualizar, dizer isso claramente em vez de forçar uma mudança
