---
name: gerador-propostas
description: >
  Gera proposta comercial visual (HTML pronto pra link ou PDF) a partir de dado solto de um
  lead, mesmo contato frio sem briefing formal. Cobre site, landing page, posicionamento e
  tráfego pago, isolado ou combinado. Use quando pedirem pra gerar/montar proposta comercial
  ou passarem dado de lead pedindo pra fechar oferta.
---

# /gerador-propostas

Transforma dado solto de lead frio em proposta pronta — visual, no padrão da marca — pra
mandar por WhatsApp, email ou link, sem precisar de reunião prévia.

Diferença das skills próximas: `/prospectar-lead` cobre a mensagem de primeiro contato;
`/briefing-cliente` organiza informação de cliente já fechado. Essa aqui é o documento de
venda — o que convence o lead a aceitar uma call ou fechar direto.

## O que ler antes

`_memoria/empresa.md` (serviço, prazo padrão, posicionamento), `_memoria/preferencias.md`
(tom), `identidade/design-guide.md` (cores, tipografia, estilo), e o template HTML em
`.claude/skills/gerador-propostas/template.html`.

## Entrada esperada

Pedir o que faltar: nome do negócio/cliente, segmento, cidade, nome do responsável, serviço a
oferecer (site / landing page / posicionamento / tráfego pago, isolado ou combo), observação
rápida sobre o que falta na presença digital dele (perguntar ou assumir análise superficial se
o usuário não souber), investimento (sugerir com base em `empresa.md` e confirmar antes de
fechar), prazo (usar o padrão de `empresa.md` se não vier). Nunca inventar contato do lead —
só usar o que foi informado.

## Passos

**1. Diagnóstico** — 2-3 dores específicas do nicho + observação recebida, cada uma numa
frase curta e direta, tom de quem percebeu, não de quem critica.

**2. Contexto de mercado** — parágrafo curto sobre por que presença digital decente importa
pra esse nicho especificamente, citando comportamento real do público, não frase de prateleira.

**3. Objetivo** — uma frase do que a proposta entrega no fim das contas.

**4. Escopo em 3 frentes**, conforme o serviço escolhido (ex.: site institucional vai de
diagnóstico → design → publicação; landing page vai de copy/estrutura → design de conversão →
publicação e teste; tráfego pago vai de estruturação de campanha → criativo/copy → otimização).
Combo de serviços junta as frentes relevantes, no máximo 3-4 no total.

**5. Entregáveis** — lista objetiva do que o cliente recebe ao final, adaptada ao serviço.

**6. Cronograma** — dividir o prazo total em 3-4 fases nomeadas, sem esticar artificialmente
pra parecer maior.

**7. Investimento** — valor, forma de pagamento e validade da proposta (padrão: 7 dias).

**8. Próximos passos** — 2-3 ações objetivas pro lead avançar.

**9. Fechamento** — nome do responsável (de `empresa.md`), contato comercial, e uma linha de
agradecimento direta, sem "conte conosco" ou fórmula de vendedor.

**10. Gerar o documento** — preencher o template HTML com o conteúdo das etapas anteriores e
publicar como artefato visual. Respeitar a identidade de marca já configurada, sem trocar
paleta ou estilo por conta própria. Entregar também um resumo curto em texto puro, pronto pra
colar em WhatsApp/email.

## Regras

- Contato do lead nunca inventado — só o que foi informado
- Diagnóstico sempre específico ao nicho/perfil, nunca genérico
- Investimento e prazo seguem `empresa.md` como padrão, usuário pode sobrescrever
- Tom alinhado a `_memoria/preferencias.md` — direto, sem jargão, sem "solução inovadora"
- Faltando nicho, serviço ou nome do lead: perguntar antes de gerar, sem preencher com placeholder genérico
- Proposta é documento de venda, não briefing — registro interno é papel de `/briefing-cliente`
