---
name: novo-projeto
description: >
  Cria uma pasta de projeto novo com CLAUDE.md dedicado, depois de uma entrevista curta sobre
  cliente/objetivo/entregas. Use quando pedirem pra começar projeto novo, cliente novo, ou
  estruturar um trabalho novo.
---

# /novo-projeto

Abre pasta própria pra um cliente, iniciativa ou produto novo, com contexto que herda da raiz
e complementa com o que é específico dali.

## Passos

**1. Entrevista rápida** — nome do projeto/cliente; se é cliente novo, projeto interno ou
iniciativa pessoal; objetivo principal numa frase; que tipo de entrega vai ter (ads, site,
conteúdo, automação, proposta — pode ser mais de uma).

**2. Se a entrega envolver software** (sistema, SaaS, ferramenta, app, plataforma, painel —
qualquer coisa com código rodando pra terceiro, não peça estática de conteúdo/design), duas
perguntas a mais antes de seguir: esse sistema vai lidar com dado sensível de terceiro
(financeiro, pessoal, cadastral, de saúde)? Vai ter mais de uma organização/cliente usando o
mesmo sistema com dado que precisa ficar isolado (multi-tenant)? As respostas alimentam a
seção de segurança do `CLAUDE.md` do projeto — o checklist completo em
`_memoria/padroes-tecnicos.md` da raiz já se aplica de qualquer forma, independente das respostas.

**3. Decidir onde a pasta nasce** — cliente novo em `clientes/<nome>/` (ou a convenção
equivalente do perfil, conferir no `CLAUDE.md` da raiz); projeto interno em `projetos/<nome>/`
(criando a pasta-mãe se ainda não existir); iniciativa pessoal, perguntar preferência.

**4. Montar a estrutura básica**: `CLAUDE.md` do projeto, `briefing.md` com o que foi coletado
na entrevista, e uma subpasta por tipo de entrega mencionado (nada além disso).

**5. Escrever o `CLAUDE.md` do projeto:**

```markdown
# [nome do projeto]

> Criado em [data]. Instruções daqui sobrescrevem as da raiz quando conflitarem.

## Sobre
[objetivo em uma frase]

## Tipo
[cliente novo / projeto interno / iniciativa pessoal]

## Entregas previstas
- [uma por linha]

## Onde salvar o quê
- Briefing e contexto: nessa pasta
- Entrega: cada subpasta criada

## O que herda da raiz
Tom de voz, marca e contexto de negócio vêm de `_memoria/` e `identidade/` da raiz — não duplicar aqui.

[só se o passo 2 rodou:]
## Segurança e LGPD
Checklist de `_memoria/padroes-tecnicos.md` vale desde o primeiro commit, não é opcional.
- Dado sensível de terceiro: [resposta, ou "nenhum identificado ainda"]
- Multi-tenant: [resposta — se sim, isolamento por organização é obrigatório desde a primeira tabela]

## Específico desse projeto
[vazio — preencher conforme for aparecendo regra própria]
```

**6. Fechar com resumo** — caminho da pasta criada, arquivos gerados, subpastas, e (se
aplicável) confirmação de que a seção de segurança/LGPD entrou. Lembrar que abrir o terminal
já dentro dessa pasta carrega o `CLAUDE.md` específico junto com o da raiz.

## Regras

- Nome de pasta reflete o que o usuário falou, sem normalizar agressivamente — acento fica,
  espaço vira hífen, mas o nome continua reconhecível
- Só cria subpasta que corresponde a uma entrega mencionada — nunca "pra organizar melhor" por conta própria
- Pasta com esse nome já existe → avisar e perguntar se é pra completar dentro dela ou criar com sufixo
