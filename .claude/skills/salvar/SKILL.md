---
name: salvar
description: >
  Versiona o trabalho no Git/GitHub (commit + push), configurando o repositório remoto na
  primeira vez que rodar. Use quando o usuário pedir pra salvar, commitar, subir pro GitHub
  ou fazer backup do trabalho, ou disser /salvar.
---

# /salvar

Skill de uma responsabilidade só: garantir que o estado atual do projeto está versionado e
publicado, mesmo pra quem nunca usou git no terminal.

## Primeira vez (sem repositório ainda)

Checar com `git rev-parse --is-inside-work-tree`. Sem repositório:

1. Perguntar se já existe um repositório remoto criado (pedir a URL) ou se precisa criar um
   novo (pedir um nome).
2. **Com URL existente**: `git init`, `git add .`, commit inicial, `git branch -M main`,
   `git remote add origin <url>`, `git push -u origin main`.
3. **Sem URL, criando agora**: checar se o `gh` CLI está disponível. Com `gh`: `git init` +
   commit inicial + `gh repo create <nome> --private --source=. --push`. Sem `gh`: orientar a
   instalar a CLI do GitHub ou criar o repositório manualmente pelo site e voltar com a URL.

## Uso normal (repositório já configurado)

1. `git status` — sem mudança nenhuma, avisar que já está tudo sincronizado e parar.
2. Mostrar o status resumido e perguntar se o usuário quer descrever a mudança numa frase ou
   deixar a mensagem ser gerada automaticamente a partir dos arquivos alterados.
3. Montar a mensagem de commit (a do usuário, ou uma linha objetiva tipo "atualiza X"/"adiciona Y").
4. `git add .` → commit → `git push`.
5. Confirmar com o link do repositório (via `git remote get-url origin`).

## Regras

- Nunca `--force` sem pedido explícito
- Nunca operação destrutiva (`reset --hard` etc.) sem confirmação clara
- Push rejeitado por divergência: avisar e oferecer `git pull --rebase` antes de tentar de novo
- `git config` de nome/email ausente: perguntar e configurar globalmente na primeira execução
