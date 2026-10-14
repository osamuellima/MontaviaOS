---
name: instalar
description: >
  Configura o MontaviaOS pro negócio de quem está instalando: entrevista sobre a empresa, o
  jeito de escrever, a prioridade atual e a identidade visual, e preenche `_memoria/empresa.md`,
  `_memoria/preferencias.md`, `_memoria/estrategia.md`, `identidade/design-guide.md`, além de
  inserir o perfil escolhido no `CLAUDE.md`. Use logo depois de clonar o repositório, ou quando
  pedirem explicitamente pra instalar/configurar o sistema pela primeira vez.
---

# /instalar

Primeiro comando depois do clone. Conduzir como conversa, não como formulário — uma pergunta
de cada vez, ouvindo de verdade antes de seguir pra próxima. Ao final, o sistema precisa saber
quem é o negócio, como ele se comunica, e onde está o atrito do dia a dia.

## Antes de começar

**Nome da pasta genérico?** Se `basename "$(pwd)"` ainda for algo tipo `montaviaos`,
`montaviaos-main` ou variação sem nome próprio, avisar que o ideal é a pasta levar o nome do
negócio, e que isso será lembrado no fim da instalação. Guardar o nome atual pra usar depois.

**Contexto já existe?** Checar se `_memoria/empresa.md`, `preferencias.md`, `estrategia.md` ou
`identidade/design-guide.md` já têm conteúdo real (não placeholder). Se tiverem, perguntar se
é pra sobrescrever do zero ou complementar o que falta. Setup limpo, seguir direto.

## Passo 1 — Perfil do negócio

O critério que separa as duas primeiras opções não é o tamanho da equipe — é **de onde vem a
receita**:

1. **Marca pessoal / criador solo** — vive de audiência e/ou produto próprio (curso, ebook,
   mentoria, assinatura); o dinheiro vem de quem acompanha, não de projeto fechado com cliente.
2. **Prestador independente** — atende cliente terceiro, organiza por projeto, mesmo sozinho e
   sem estrutura de agência. Quem vende site, design, marketing ou consultoria pra outras
   empresas entra aqui, mesmo trabalhando sozinho — nunca na opção 1.
3. **Time pequeno atendendo vários clientes** (agência/consultoria)
4. **Empresa estruturada em setores** (marketing, comercial, financeiro etc.)

Resposta ambígua ("sou só eu, mas atendo cliente") resolve pelo sinal de receita: presta
serviço pra terceiro vai pra opção 2, mesmo sendo uma pessoa só.

A escolha decide qual arquivo de `templates/perfis/` usar.

## Passo 2 — Entrevista

Uma pergunta por vez, esperando resposta antes de seguir. Resposta vaga, pedir concretude uma
vez só — sem insistir além disso.

**Negócio**: como se chama, o que entrega numa frase simples, quem realmente paga (perfil de
cliente real, não persona genérica), sozinho ou com equipe (e se tem, quem faz o quê).

**Voz**: pedir um exemplo real e recente de escrita (legenda, email, mensagem) pra calibrar o
tom sem chutar; o que incomoda quando alguém escreve de um certo jeito (jargão vazio, emoji
fora de hora, saudação genérica).

**Foco**: o que está travando o crescimento hoje; se pudesse tirar uma tarefa repetitiva das
próprias costas, qual seria.

**Identidade**: se já tem cor/fonte definida (pedir as principais); se tem logo (pedir pra
colocar em `identidade/logo.png` ou `.svg`).

## Passo 3 — Preencher os arquivos

**`_memoria/empresa.md`** — nome, o que faz, perfil de cliente, equipe, a partir das respostas
sobre o negócio.

**`_memoria/preferencias.md`** — tom de voz descrito com base no exemplo real dado (não em
adjetivo solto), o que evitar listado direto, síntese do que combina e do que destoa.

**`_memoria/estrategia.md`** — gargalo atual, a tarefa candidata a virar skill (registrar
como próxima pauta de `/mapear-rotinas`), e prioridade derivada do próprio gargalo.

**`identidade/design-guide.md`** — preencher só o que foi informado. Sem cor/fonte/logo,
deixar em branco e avisar que qualquer skill visual lê esse arquivo antes de criar algo, então
vale preencher assim que a identidade for definida.

**`CLAUDE.md`** — **nunca sobrescrever o arquivo inteiro.** A mecânica de fábrica (leitura de
contexto, reflexo de checar skill antes de agir, registro de correção, sincronização de
memória, criação de skill, e as referências a `padroes-tecnicos.md`/`lgpd-referencia.md`/
`impeccable`) precisa sobreviver a toda instalação — é o que faz o sistema funcionar, não só o
perfil de negócio. Em vez disso, pegar o template do perfil escolhido no Passo 1, adaptar com
o nome do negócio e a estrutura de pasta que apareceu nas respostas, e **inserir como seção
nova** logo após "Carregamento de contexto" e antes de "Reflexo padrão: existe skill pra
isso?" — mesmo nível de título das demais seções (`## Perfil do negócio`). Todo o resto do
arquivo permanece intocado.

## Passo 4 — Resumo

Mostrar o que ficou configurado: perfil aplicado, os três arquivos de memória preenchidos,
identidade (preenchida ou em branco), confirmação de que o `CLAUDE.md` recebeu a seção nova
sem perder a mecânica existente, e o lembrete de que `_memoria/padroes-tecnicos.md` já vem
pronto — entra em ação sozinho no dia em que a entrega envolver construir algum sistema/SaaS,
mesmo que hoje não seja o foco do negócio.

## Passo 5 — Renomear a pasta, se for o caso

Só se a pasta ainda tinha nome genérico no início. Gerar um slug do nome do negócio
(minúsculo, sem acento, espaço vira hífen, sem caractere especial) e orientar: fechar o
editor, renomear a pasta no sistema de arquivos (ou `mv` no terminal), abrir de novo na pasta
renomeada. Pasta já com nome próprio, pular esse passo.

## Passo 6 — Encerramento

Confirmar que o sistema já reconhece o negócio, lembrar que `/abrir` no início de cada sessão
carrega tudo automaticamente, e que qualquer skill relevante pode ser chamada direto. Retomar
a tarefa repetitiva mencionada no Passo 2 como gancho pro `/mapear-rotinas`. Se o usuário
quiser versionar o trabalho, mencionar `/salvar`.

## Regras

- Nunca inventar resposta — resposta vaga vira registro vago ou placeholder explícito, nunca preenchimento inventado
- Nenhum arquivo final deve conter aviso de "isso será preenchido depois" — esse aviso é só do placeholder
- Setup cabe em poucos minutos; usuário enrolando numa pergunta, registrar o que tem e seguir
- Sem pergunta extra além das listadas, a menos que haja motivo concreto
