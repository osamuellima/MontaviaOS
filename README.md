# MontaviaOS

> Sistema operacional de negócio construído sobre o Claude Code.

Instalar o MontaviaOS dá pro seu negócio uma memória própria (quem você
é, como fala, o que é prioridade agora), uma identidade visual aplicada
em tudo que o sistema produzir, e um conjunto de skills prontas pra
marketing, conteúdo, anúncios e operação do dia a dia.

---

## Instalação

Clone o repositório, abra na sua ferramenta de desenvolvimento com
Claude Code e rode `/instalar`:

```
git clone <url-do-seu-fork-ou-repo> minha-empresa
cd minha-empresa
claude
```

Dentro da sessão do Claude Code: `/instalar`. Ele te entrevista sobre o
negócio (nome, o que entrega, quem paga, tom de voz, foco atual,
identidade visual) e preenche `_memoria/` e `identidade/` com o que
você respondeu — sem apagar a mecânica do sistema que já vem pronta.

Depois do `/instalar`, renomeie a pasta pro nome do seu negócio — ela
deixa de ser "genérica" e passa a ser a operação de verdade.

`/instalar` roda uma vez. Dali em diante é só trabalhar; `/abrir` no
começo de cada sessão carrega o contexto salvo automaticamente.

---

## O que vem instalado

**Operação do sistema** — `/abrir` carrega contexto no início da sessão ·
`/salvar` versiona no Git/GitHub · `/atualizar` revisita o projeto e
sincroniza a memória · `/novo-projeto` abre uma pasta isolada por
cliente/iniciativa, com checklist de segurança e LGPD automático quando
a entrega envolve software · `/mapear-rotinas` transforma trabalho
repetitivo em skill nova.

**Conteúdo** — `/carrossel` monta carrossel pronto pra publicar, com a
identidade visual aplicada · `/publicar-tema` desdobra um tema em
artigo + carrossel + legendas · `/planejar-conteudo` organiza a pauta ·
`/seo` cobre o fluxo completo (pesquisa de demanda, concorrência, Google
Meu Negócio, on-page, estratégia de conteúdo, monitoramento) ·
`/responder-avaliacoes` escreve resposta pras reviews do Google ·
`/aprovar-post` publica nos canais configurados.

**Aquisição** — `/prospectar-lead` monta a primeira mensagem de contato ·
`/gerador-propostas` gera proposta comercial pronta a partir de dado
solto de lead · `/briefing-cliente` organiza o que foi combinado com
cliente já fechado · `/anuncio-google` monta campanha em CSV pronto pra
importar · `/relatorio-ads` lê exports de campanha e devolve relatório
com recomendação.

**Produção e suporte** — `/analisar-dados` lê CSV/XLSX/PDF e devolve
resumo executivo · `/email-profissional` rascunha email a partir de
contexto solto · `/aviso-ia` sinaliza quando um conteúdo precisa de
aviso de uso de IA · `impeccable` cobre design/UI de produção, da
criação à auditoria de acessibilidade e responsividade.

**Distribuição e atacado** — `/estoque` controla saldo, ruptura, pedido
de cliente, preço por cliente/representante e sugestão de reposição,
adaptado ao jeito de operar de cada distribuidora (lote, representante,
ponto de pedido — o que se aplicar a cada negócio).

---

## Como o sistema é organizado

`_memoria/` guarda o que o Claude precisa saber antes de qualquer
resposta: `empresa.md` (o negócio), `preferencias.md` (tom de voz),
`estrategia.md` (prioridade atual), `operacao.md` (como a distribuidora
controla estoque, pedido e preço — gravado pela skill `/estoque`),
`padroes-tecnicos.md` (segurança, LGPD e engenharia — aplicado sempre
que a entrega envolve código) e `lgpd-referencia.md` (resumo legal
aplicado ao dia a dia).

`identidade/` guarda a marca — cores, tipografia, logo — lida por
qualquer skill que gera peça visual.

`templates/` guarda moldes reaproveitáveis: perfis de `CLAUDE.md` por
tipo de negócio, modelos de contrato/checklist de LGPD, catálogo de
skills e ferramentas.

`marketing/`, `saidas/`, `dados/` e `scripts/` são onde o trabalho de
verdade acontece e fica versionado.

---

## Por que um sistema, não uma ferramenta solta

O ganho não é só velocidade de execução — é o Claude carregando o
contexto certo (quem é o negócio, como ele fala, o que importa agora)
antes de qualquer tarefa, em vez de reexplicar tudo a cada conversa.
Cada correção vira regra permanente; cada tarefa repetida vira skill
nova. O sistema cresce com o uso, não fica parado no que veio de
fábrica.
