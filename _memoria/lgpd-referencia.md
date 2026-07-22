# LGPD aplicada à [SUA EMPRESA]

> Resumo operacional da Lei nº 13.709/2018 (LGPD), focado no que muda o trabalho do dia a dia.
> Não é o texto integral da lei — isso está disponível em planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm.
> Usado como referência por `templates/lgpd-projeto.md` (checklist de projeto) e `politica-de-privacidade.html` (site institucional).

---

## Papéis (Art. 5º)

- **Controlador**: quem decide o que fazer com os dados pessoais.
- **Operador**: quem trata os dados em nome do controlador (ex: a [SUA EMPRESA] durante o desenvolvimento de um site pro cliente).
- **Titular**: a pessoa dona dos dados.

No site institucional da [SUA EMPRESA], a [SUA EMPRESA] é **Controladora**. Nos projetos entregues a clientes, a [SUA EMPRESA] é **Operadora** durante o desenvolvimento; o cliente vira **Controlador** após a entrega.

## Bases legais mais usadas pela [SUA EMPRESA] (Art. 7º)

| Situação | Base legal |
|---|---|
| Formulário de contato / prospecção no site | Consentimento (I) ou legítimo interesse (IX) |
| Execução do contrato fechado com cliente | Execução de contrato (V) |
| Emissão de nota fiscal, CPF/CNPJ | Obrigação legal (II) |

## Dado pessoal sensível (Art. 5º, II / Art. 11)

Origem racial/étnica, convicção religiosa, opinião política, saúde, vida sexual, dado genético ou biométrico. A [SUA EMPRESA] normalmente não trata esse tipo de dado — exceção: projetos para clientes de saúde (medicina, odontologia, psicologia), onde o **sistema entregue** pode vir a tratar dado sensível de paciente. Nesse caso o cliente (Controlador) precisa de base legal específica (Art. 11) e cuidado redobrado — sinalizar isso no checklist de projeto.

## Direitos do titular (Art. 18) — o que qualquer pessoa pode pedir

Confirmação de tratamento, acesso, correção, anonimização/bloqueio/eliminação, portabilidade, informação sobre compartilhamento, revogação de consentimento. Pedidos devem ser atendidos sem custo, dentro de prazo razoável (Art. 19: 15 dias para resposta formal).

## Consentimento (Art. 8º)

Deve ser específico, informado, inequívoco, e revogável a qualquer momento. Autorização genérica ("aceito os termos") sem explicar a finalidade é nula. Por isso todo formulário precisa de checkbox explícito + link pra política de privacidade, nunca pré-marcado.

## Crianças e adolescentes (Art. 14)

Se algum projeto de cliente coletar dados de menores, precisa de consentimento específico de responsável legal — normalmente fora do escopo da [SUA EMPRESA], mas sinalizar ao cliente se o site dele for direcionado a esse público.

## Segurança e retenção (Art. 6º, VII / Art. 15-16)

Dados devem ser eliminados quando a finalidade for atingida, exceto para cumprir obrigação legal, estudo com anonimização, ou uso interno anonimizado. Prazo prático adotado pela [SUA EMPRESA]:

| Tipo de dado | Retenção |
|---|---|
| Lead sem contrato fechado | Até 12 meses após o último contato |
| Dados de contrato/cliente ativo | 5 anos (prazo fiscal) |
| Acessos a plataformas de cliente (login, senha) | Excluídos logo após a entrega do projeto |

## Onde isso vive no sistema

- `politica-de-privacidade.html` — política de privacidade pública do site da [SUA EMPRESA]
- `templates/lgpd-projeto.md` — checklist aplicado a todo projeto novo (via skill `/novo-projeto`)
- `.htaccess` — já força HTTPS e cabeçalhos de segurança (ver comentários no próprio arquivo)
