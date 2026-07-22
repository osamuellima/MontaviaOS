# Checklist LGPD — Projetos [SUA EMPRESA]

> Aplicar em todo projeto que envolva site, landing page, sistema sob medida ou SaaS entregue a cliente.
> A skill `/novo-projeto` copia este arquivo para `clientes/<Nome>/checklist-lgpd.md` na abertura de cada projeto.

---

## Obrigatório em todo projeto

### Formulários de captação
- [ ] Checkbox de consentimento explícito antes do envio ("Concordo com a Política de Privacidade")
- [ ] Link para a política de privacidade do cliente (ou da [SUA EMPRESA], se for o site institucional) junto ao checkbox
- [ ] Campo de e-mail / telefone nunca pré-marcado como "aceito receber comunicações"
- [ ] Mensagem clara sobre pra que serve o formulário (ex: "Entraremos em contato em até 24h")
- [ ] Se o formulário redireciona pra WhatsApp (deep link `wa.me`), informar isso ao usuário — os dados trafegam para um terceiro (Meta)

### Política de privacidade
- [ ] Página `/politica-de-privacidade` criada no projeto
- [ ] Política adaptada ao tipo de dado que o site/sistema coleta
- [ ] Identificação do responsável pelos dados (nome + e-mail de contato)
- [ ] Data de vigência visível
- [ ] Base legal (Art. 7º da LGPD) explícita para cada finalidade de tratamento

### Cookies e rastreamento
- [ ] Banner de consentimento de cookies na primeira visita (se usar analytics/pixel)
- [ ] Opção de aceitar ou recusar (não apenas "fechar")
- [ ] Se usar Google Analytics / Meta Pixel: mencionar explicitamente na política de privacidade

### Segurança técnica
- [ ] HTTPS ativo (certificado SSL instalado e forçado via redirect, como já configurado no `.htaccess`)
- [ ] Formulários com proteção anti-spam (reCAPTCHA ou honeypot)
- [ ] Dados do formulário não ficam expostos em URL (método POST, não GET)
- [ ] Integrações de CRM/e-mail só recebem o que foi consentido

### Sistemas e SaaS sob medida (quando aplicável)
- [ ] Mapear quais dados pessoais o sistema armazena e por quanto tempo
- [ ] Definir se o cliente (contratante) é Controlador e a [SUA EMPRESA] é Operadora, deixar isso explícito em contrato
- [ ] Prever mecanismo de exportação/exclusão de dados a pedido do titular (Art. 18 da LGPD)
- [ ] Se o sistema tratar dado sensível (saúde, biometria, etc.), ver Seção II da LGPD, exigências adicionais
- [ ] Se usar login social/federado (Google, etc.), a política de privacidade precisa listar exatamente quais campos são lidos do provedor (nome, e-mail, foto, endereço...), a finalidade de cada um, a base legal e o prazo de retenção — não basta o botão de login, o titular precisa saber o que está sendo coletado
- [ ] Scripts de analytics/tracking (GA4, Meta Pixel) só podem ser injetados no DOM **depois** do consentimento — um banner "avisando" que já carregou o script antes não é opt-in válido; seguir o padrão de `initCookieConsent()` no site da [SUA EMPRESA] como referência de implementação
- [ ] Dados sensíveis em texto claro no banco (e-mail, CPF, telefone) devem ter controle de acesso e, quando possível, hashing/criptografia em repouso — não é aceitável armazenar em claro sem justificativa e sem medida de segurança proporcional (Art. 6º, VII e Art. 46)

---

## Boas práticas (recomendado, não obrigatório)

- [ ] Aviso de cookies em português claro, sem juridiquês
- [ ] Política de privacidade em linguagem simples + versão técnica
- [ ] Botão "Fale sobre seus dados" visível no rodapé
- [ ] Registro de quando o usuário deu consentimento (data/hora, se houver CRM)

---

## O que entregar ao cliente junto com o projeto

1. **Política de privacidade** gerada e adaptada pro negócio dele
2. **Termo de responsabilidade**: documento simples confirmando que o cliente é o Controlador dos dados coletados no site após a entrega
3. **Instruções de manutenção LGPD**: o que ele precisa fazer se receber pedido de exclusão de dados (Art. 18, incisos IV, VI e IX)

---

## Aviso importante — papel da [SUA EMPRESA]

A [SUA EMPRESA] atua como **Operadora** durante o desenvolvimento do projeto (trata dados em nome do cliente).
Após a entrega, o **cliente passa a ser o Controlador** e assume a responsabilidade legal pelos dados coletados no site/sistema entregue.
Essa cláusula deve constar no contrato de prestação de serviço.

No site institucional próprio (`[seudominio.com.br]`), a [SUA EMPRESA] é **Controladora** dos dados que coleta via formulário de contato — ver `politica-de-privacidade.html`.

---

> Referência legal: Lei nº 13.709/2018 (LGPD). Ver resumo aplicado em `_memoria/lgpd-referencia.md`.
> Revisar este checklist anualmente ou quando houver atualização relevante da ANPD.
