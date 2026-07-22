---
name: abrir
description: >
  Inicia uma sessão de trabalho: carrega a memória do negócio (empresa, preferências, estratégia,
  identidade) e devolve um resumo curto pra retomar o trabalho. Use no primeiro turno de uma sessão,
  quando o usuário disser "abrir", "começar", "bora trabalhar" ou "/abrir".
---

# /abrir — Início de sessão

Skill rápida: carregar contexto e devolver uma síntese de poucas linhas, sem cerimônia.

## Passos

1. Ler, nessa ordem: `_memoria/empresa.md`, `_memoria/preferencias.md`,
   `_memoria/estrategia.md`, e conferir (sem precisar ler todo o
   conteúdo) se `identidade/design-guide.md` está preenchido ou vazio.

2. Se `empresa.md`, `preferencias.md` ou `estrategia.md` ainda estiver
   com placeholder vazio, responder só:
   > "`_memoria/<arquivo>.md` ainda tá vazio. Rodo o `/instalar` agora?"
   e esperar.

3. Se os três estiverem preenchidos, responder num bloco curto:

```
[negócio] — [o que faz, poucas palavras]
Foco agora: [prioridade tirada de estrategia.md]
Tom: [3-4 palavras do jeito de escrever]

Pronto pra começar.
```

4. Não narrar quais arquivos foram lidos — só aplicar o contexto direto.

## Regras

- Resposta cabe em poucas linhas, sem enrolação
- Uma pergunta só, no máximo ("o que fazemos agora?" fica implícito, não precisa repetir)
- `design-guide.md` vazio não é assunto aqui — só vira relevante quando uma skill visual precisar dele
