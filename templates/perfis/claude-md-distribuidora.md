# [nome da distribuidora] — perfil distribuidora

> Seção inserida no CLAUDE.md pra distribuidora/atacado de produto físico
> — o ciclo gira em torno de estoque, pedido, representante e fornecedor,
> não em setor interno de marketing/RH. `/instalar` adapta com a
> realidade real.

## O que é esse workspace

[uma frase — ex.: "operação de distribuição de [categoria de produto] pra [tipo de cliente final — mercado, farmácia, loja]"]

**Pastas:**
- `_memoria/` — quem é o negócio, como fala, prioridade atual, e
  `operacao.md` — como estoque/pedido/preço funcionam aqui (gravado
  pela skill `/estoque`)
- `identidade/` — marca aplicada em material de venda/catálogo
- `dados/` — planilha de estoque e pedidos (`estoque.csv`,
  `pedidos.csv`), exportação de representante, nota fiscal
- `marketing/` — material de divulgação, se houver (catálogo, promoção)
- `saidas/` — documento pontual (proposta, relatório de fechamento)
- `scripts/` — automação interna
- `tarefas.md` — o que está em jogo agora

## Sobre o negócio

[nome] distribui [categoria de produto] pra [perfil de cliente — mercado
de bairro, farmácia, loja de material de construção etc.]. Vende
[direto / através de representante comercial / os dois] em [região de
atuação]. Equipe de [N] pessoas, [quem cuida do quê — ex.: dono cuida de
compra e financeiro, representante cuida de venda em campo].

## Como a operação funciona

Detalhe vivo mantido em `_memoria/operacao.md` (unidade de controle,
canal de venda, critério de preço, modelo de reposição, fornecedores) —
não duplicar aqui, só resumir o essencial:

- **Canal:** [direto / representante / ambos]
- **Preço:** [tabela única / por cliente / por volume]
- **Reposição:** [ponto de pedido / pedido mínimo do fornecedor]

## O que mais produzimos

- Pedido de cliente (registrado via `/estoque`)
- Pedido de compra/reposição pro fornecedor
- [entregável frequente adicional — ex.: catálogo de produto, tabela de preço impressa]

## Tom de voz

[como o negócio se comunica — com cliente/mercado pode ser bem direto; com
representante, mais prático ainda]

Evitar: [o que destoa — ex.: jargão de marketing que não combina com o dia a dia de venda em balcão]

## Regras específicas

- Dado de estoque/pedido fica em `dados/` e **nunca é versionado** —
  informação de cliente e preço real não vai pro git
- Mudança de preço ou baixa de estoque sempre confirmada antes de
  gravar (regra da skill `/estoque`)
- Representante com região própria: pedido dele sempre identificado por
  região, não só por nome, pra facilitar comissão e relatório
- [demais regras de organização conforme forem aparecendo]

## Ferramentas conectadas

- [ ] WhatsApp Business (confirmação de pedido com cliente/representante)
- [ ] Emissor de nota fiscal
- [ ] Sistema de pagamento (PIX/boleto)
- [ ] Planilha online (Google Sheets) como origem do `dados/estoque.csv`

*(marcar conforme for conectando)*
