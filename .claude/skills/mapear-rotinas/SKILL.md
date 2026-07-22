---
name: mapear-rotinas
description: >
  Descobre tarefas que o usuário repete no dia a dia e transforma as que fizerem sentido em
  skills novas dentro de `.claude/skills/`. Use quando o usuário pedir pra automatizar rotina,
  criar skill personalizada, ou disser "/mapear-rotinas".
---

# /mapear-rotinas

Skill de descoberta: sai de "o que eu fico repetindo" pra automação de verdade instalada.

## Passos

**1. Entrevista curta, uma pergunta de cada vez:**
- Quais tarefas você repete toda semana e queria parar de pensar sobre?
- Pra cada uma, qual é o input típico (um link, uma planilha, um nome de cliente)?
- E o que você espera receber de volta?

**2. Checar sobreposição** — antes de propor skill nova, olhar `templates/skills/catalogo.md`
e as skills já instaladas. Se a tarefa já tem cobertura, sugerir usar/ativar a existente em
vez de duplicar.

**3. Propor uma skill por tarefa sem cobertura**, no formato:

```
### /<nome>
O que faz: [uma frase]
Recebe: [input]
Entrega: [output]
Depende de: [arquivo de _memoria/identidade, ou ferramenta externa]
```

Mostrar todas juntas e perguntar quais criar agora — pode ser todas, algumas ou nenhuma.

**4. Criar as aprovadas** — pasta própria em `.claude/skills/<nome>/`, `SKILL.md` com
frontmatter (`name` + `description` que deixa claro quando a skill deve disparar), passo a
passo estruturado, dependências explícitas e regras claras do que sempre/nunca fazer.
Calibrar tom e contexto lendo `_memoria/preferencias.md` e `_memoria/empresa.md` antes de
escrever. Arquivo de apoio (template, exemplo) fica dentro da própria pasta da skill.

**5. Fechar com resumo** — lista do que foi criado, caminho de cada `SKILL.md`, lembrete de
que basta digitar `/` + nome pra usar, e que editar o `SKILL.md` ajusta o comportamento depois.

## Regras

- Tarefa que só aconteceu uma vez não vira skill — tem que ser repetível de verdade
- No máximo 5 skills novas por rodada; mais que isso, dividir em outra sessão
- Toda skill precisa de gatilho claro na `description` — sem isso, ninguém a encontra
- Dependência de ferramenta que o usuário ainda não tem configurada: avisar antes de criar e
  oferecer versão simplificada sem essa dependência
