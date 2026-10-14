# Checklist completo de varredura de vulnerabilidades

Fonte da verdade para os itens de cada categoria. O `SKILL.md` referencia este
arquivo — carregue-o inteiro quando for montar o escopo de uma varredura ou
verificar um item específico. Organizado em 76 categorias, agrupadas por
domínio para facilitar a navegação. Numeração vai de 1 a 76 pulando o número
75 (categoria removida/reorganizada em versão anterior do checklist) e
incluindo a subcategoria 48b — não falta nenhuma categoria, é só um buraco
histórico na numeração; não reutilizar o número 75 para uma categoria nova.

---

## Aplicação — núcleo (quase sempre aplicável a qualquer web app)

### 1. Autenticação
login inseguro; senha fraca; senha armazenada sem hash adequado; recuperação
de senha vulnerável; tokens de reset reutilizáveis; tokens sem expiração;
ausência de MFA para contas administrativas; enumeração de usuários; brute
force; credential stuffing; sessões que nunca expiram; logout que não
invalida sessão; autenticação somente no frontend; confiar em userId enviado
pelo cliente; contas administrativas com credenciais padrão.

### 2. Autorização e controle de acesso
usuário comum acessando rota de administrador; IDOR; BOLA; Broken Access
Control; alteração de ID na URL para acessar dados de outro usuário; acessar
/admin apenas conhecendo a URL; frontend esconder botão mas backend não
validar permissão; usuário modificando próprio role; permissões excessivas;
falta de RBAC/ABAC; falha na separação entre usuários; falha na separação
entre empresas/tenants. (A01 do OWASP Top 10 2025.)

### 3. Segurança multi-tenant de SaaS
empresa A enxergar dados da empresa B; consultas sem tenant_id; confiar no
tenant_id recebido pelo navegador; RLS inexistente; RLS configurado
incorretamente; usuário trocar ID da organização; cache misturar dados de
tenants; arquivos sem isolamento por organização; painel admin sem
segregação adequada; background jobs processando tenant errado.

### 4. Banco de dados
banco acessível diretamente da internet; porta PostgreSQL/MySQL aberta;
credenciais padrão; usuário da aplicação com privilégios de administrador;
service_role exposta; banco sem TLS; backups públicos; backups sem
criptografia; dados pessoais sem necessidade; senha em texto puro; SQL
Injection; NoSQL Injection; queries construídas por concatenação; migrations
inseguras; ausência de constraints; ausência de política de exclusão; dados
de produção copiados para ambiente de desenvolvimento.

### 5. Supabase
service_role no frontend; RLS desativado; policies permissivas; policies
usando lógica incorreta; Storage Bucket público sem necessidade; Edge
Functions sem autorização; funções SECURITY DEFINER perigosas; RPC
permitindo operações privilegiadas; confiar somente no anon key; tabela
podendo ser consultada diretamente sem restrição; dados entre tenants sem
isolamento. Nota: a anon key normalmente pode aparecer no cliente — o
problema crítico é exposição da service_role ou uma policy RLS insegura.

### 6. Firebase
Firestore com regra do tipo acesso universal; Realtime Database público;
Storage público; autenticação sem regras de autorização; regras baseadas em
dados controláveis pelo cliente; credenciais administrativas expostas; Cloud
Functions sem autenticação; App Check ignorado quando seria pertinente.

### 7. APIs
endpoint sem autenticação; endpoint sem autorização; BOLA; BFLA; mass
assignment; propriedades internas modificáveis pelo cliente; API retornando
dados demais; API expondo PII; ausência de rate limiting; ausência de
quotas; APIs antigas esquecidas; endpoints de teste em produção;
Swagger/OpenAPI expondo rotas internas; versões antigas de API ainda
ativas; SSRF; consumo inseguro de APIs de terceiros; parâmetros sem
validação; GraphQL sem limites de profundidade/complexidade; introspection
desnecessariamente aberta. (OWASP API Top 10: BOLA, autenticação quebrada,
consumo irrestrito de recursos, SSRF, inventário inadequado, consumo
inseguro de APIs.)

### 8. Secrets e credenciais
.env enviado ao GitHub; API key dentro do JavaScript; senha hardcoded; token
dentro do código; chave privada commitada; secrets em logs; secrets
enviados para IA; credenciais aparecendo em screenshot; credenciais dentro
de Docker image; secrets em arquivos de configuração públicos; chave de
produção utilizada em desenvolvimento; API keys sem rotação; mesma chave
usada por vários sistemas; tokens sem escopo mínimo. **Gestão moderna de
segredos (padrão de mercado 2026):** segredo de produção existindo em mais
de um lugar (o cofre deveria ser a única fonte, tudo mais é cópia
regenerável a partir dele); segredo copiado manualmente entre pessoas via
WhatsApp/e-mail em vez de convite direto no cofre/plataforma; ausência de
rotação automática (credencial estática vivendo meses/anos sem trocar);
"vault como arquivo morto" — segredo guardado no cofre mas nunca
rotacionado nem revogado quando alguém sai do time; ausência de vigilância
de repositório (scanning de secret em todos os branches/commits, não só
no HEAD atual).

### 9. Git e GitHub
segredo apagado do arquivo mas ainda presente no histórico Git; repositório
privado tornado público; branches contendo credenciais; pull request
expondo dados; GitHub Actions com permissões excessivas; secrets acessíveis
a workflows inseguros; actions de terceiros não fixadas por versão/commit;
ausência de branch protection; push direto em produção; ausência de secret
scanning; deploy automático sem revisão.

### 10. Frontend
XSS; DOM XSS; HTML não sanitizado; dangerouslySetInnerHTML mal utilizado;
tokens sensíveis em localStorage; dados confidenciais embutidos no bundle;
source maps expondo código; endpoints internos hardcoded; lógica de
segurança exclusivamente no navegador; validação somente client-side;
informações administrativas enviadas ao cliente e apenas ocultadas por CSS;
chaves privadas dentro de React/Vue/Next frontend.

### 11. Backend
SQL Injection; Command Injection; Template Injection; LDAP Injection;
XML/XXE; SSRF; path traversal; deserialização insegura; execução de código;
parâmetros não validados; objetos inteiros aceitos diretamente do cliente;
endpoints administrativos sem proteção; debug habilitado em produção; stack
trace retornado ao usuário.

**Fingerprint de paths administrativos (teste em app já publicado, via
HTTP direto):** testar a lista de paths comuns (`/admin`, `/admin/`,
`/wp-admin`, `/wp-login.php`, `/cpanel`, `/phpmyadmin`, `/adminer`,
`/painel`, `/backoffice`, `/api/admin`, `/api/health`, `/api/debug`,
`/.env`, `/.env.local`, `/.git/config`, `/.git/HEAD`, `/config.json`,
`/server-status`, `/actuator`, `/actuator/health`, `/swagger`,
`/swagger-ui`, `/api-docs`, `/graphql`, `/debug`, `/console`, `/setup`,
`/install`) via `curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}"`.

**Passo obrigatório — controle negativo antes de reportar qualquer path
como achado:** testar em paralelo um path totalmente inventado (ex.
`/this-path-does-not-exist-xyz123`). Se ele recebe a mesma resposta
(mesmo status, mesmo redirect) que os paths da lista, o app tem um
middleware catch-all de auth interceptando qualquer rota não pública
antes do roteamento — isso é bom (sem enumeração possível) e nenhum dos
paths testados deve ser reportado como exposto, mesmo que todos deem
307/308. Só é achado real quando um path específico se comporta
DIFERENTE do controle (ex: 404 puro enquanto o resto redireciona, ou 200
com conteúdo). Antes de reportar essa diferença, confirmar via header
`x-matched-path`: se vier `/404`, é o 404 estático padrão da
plataforma (Vercel/Next), não uma rota real — descartar. Testar também
source maps (`/_next/static/.../chunk.js.map` deve dar 403/404, nunca
200 com conteúdo).

### 12. Upload de arquivos
aceitar qualquer extensão; confiar no MIME enviado pelo navegador; permitir
executáveis; nomes de arquivos manipuláveis; path traversal; arquivos
armazenados dentro de diretório executável; tamanho ilimitado; ausência de
antivírus quando necessário; SVG malicioso; arquivos privados com URL
pública; URLs previsíveis; documentos contendo dados sensíveis expostos.

### 13. Criptografia
HTTP em vez de HTTPS; TLS configurado inadequadamente; algoritmo
criptográfico obsoleto; chave hardcoded; criptografia caseira; senha
criptografada em vez de hashed; dados sensíveis sem criptografia em repouso
quando necessária; backups sem criptografia; chave armazenada junto dos
dados; IV/nonce utilizado incorretamente; JWT com configuração insegura;
segredo JWT fraco.

### 14. JWT e sessões
JWT sem expiração; aceitar algoritmo incorreto; não validar assinatura; não
validar issuer; não validar audience; confiar no payload sem verificar
token; dados sensíveis dentro do JWT; refresh token eterno; refresh token
reutilizável; tokens vazados via URL; cookie sem HttpOnly; cookie sem
Secure; SameSite inadequado; session fixation.

### 15. OAuth e login social
redirect URI ampla; state não verificado; PKCE ausente quando aplicável;
token OAuth exposto; scopes excessivos; conta vinculada apenas pelo e-mail
sem validação adequada; falha no fluxo de callback; open redirect; client
secret no frontend.

### 16. CORS
Access-Control-Allow-Origin: * inadequadamente usado; permitir qualquer
origem com credenciais; refletir Origin sem validação; liberar métodos
desnecessários; liberar headers desnecessários; considerar CORS como
mecanismo de autenticação.

### 17. CSRF
operações sensíveis via cookie sem proteção; mudança de senha vulnerável;
mudança de e-mail vulnerável; exclusão de conta vulnerável; painel
administrativo vulnerável; ausência de token anti-CSRF quando necessário.

### 18. Headers HTTP e navegador
ausência de Content Security Policy; ausência de proteção contra
clickjacking; MIME sniffing; política de referrer inadequada; HSTS ausente
quando deveria existir; cache de páginas contendo dados sensíveis; cookies
inseguros.

---

## Infraestrutura e plataforma (aplicável se houver deploy/cloud/containers)

### 19. Cloud e infraestrutura
buckets S3/R2/Blob Storage públicos; banco gerenciado exposto à internet;
security groups excessivamente permissivos; porta 22/3306/5432/6379 aberta
para 0.0.0.0/0; IAM com *:*; usuário de aplicação com privilégios
administrativos; credenciais permanentes em vez de temporárias; ausência de
MFA em cloud; chaves antigas ainda válidas; ambientes dev/staging acessando
produção; snapshots públicos; discos sem criptografia; metadata service
vulnerável; falta de segmentação de rede; recursos esquecidos ainda ativos;
serviços de teste expostos; console administrativo público; ausência de
Cloud Audit Logs; ausência de alertas para mudanças críticas.

### 20. Docker e containers
rodar container como root; imagem com secrets; imagens antigas e
vulneráveis; usar `latest` sem controle; Docker socket exposto;
`/var/run/docker.sock` montado desnecessariamente; capabilities excessivas;
`--privileged`; filesystem gravável sem necessidade; portas administrativas
publicadas; imagens de origem desconhecida; dependências desatualizadas
dentro da imagem; secrets em Dockerfile; .env copiado para imagem; ausência
de scan de vulnerabilidades; ausência de assinatura/verificação de imagem.

### 21. Kubernetes
pods privilegiados; service accounts com permissões excessivas; RBAC mal
configurado; secrets Kubernetes tratados como se fossem criptografia forte;
dashboard exposto; API Server publicamente acessível; NetworkPolicy
inexistente; namespace sem isolamento; containers rodando como root; host
filesystem montado; admission controls inexistentes; imagens não
assinadas; secrets acessíveis a pods desnecessários; ingress permissivo;
etcd inadequadamente protegido.

### 22. CI/CD
pipeline podendo alterar produção sem aprovação; secrets disponíveis para
qualquer workflow; GitHub Actions de terceiros não confiáveis; action
apontando apenas para tag mutável; pull request executando código com
secrets; deploy vindo diretamente de fork; runners compartilhados
inadequadamente; runner self-hosted comprometível; branch de produção sem
proteção; artefatos não assinados; build de produção não reproduzível;
ausência de provenance; pipeline com credenciais administrativas; deploy
sem rollback; logs do pipeline contendo tokens. (OWASP trata supply chain e
CI/CD como superfícies críticas — hardening de repositório, workstation,
build servers, artefatos e IaC.)

### 23. Supply chain
pacote npm malicioso; typosquatting; dependency confusion; package
takeover; biblioteca abandonada; dependência transitiva vulnerável; pacote
sem version pinning; atualização automática sem revisão; scripts
postinstall maliciosos; CDN comprometida; plugin de CMS vulnerável;
extensão de IDE maliciosa; pacote criado por IA sem verificar origem;
biblioteca inventada por LLM; ausência de SBOM; ausência de política de
atualização. (Categoria própria do OWASP Top 10 2025 — A03:2025 Software
Supply Chain Failures, a #3 do ranking atual.) **SBOM e proveniência de
build:** ausência de SBOM (inventário formal de componentes) em qualquer
release que vá pra produção — exigência mínima consolidada pela CISA em
2026, cobrindo software próprio, open-source e SaaS; ausência de
verificação de proveniência/assinatura (padrão SLSA) em pacote ou imagem
antes de usar — nota real de 2026: proveniência válida sozinha não é mais
suficiente (ataques em cadeia como o "Shai-Hulud" produziram pacotes com
proveniência válida), então tratar SLSA como uma camada a mais, nunca a
única defesa; ausência de relatório de idade de vulnerabilidade (CVE
conhecido há muito tempo sem correção) nas dependências do projeto.

### 24. Infrastructure as Code
Terraform contendo secrets; state file público; state file contendo
senhas; permissões excessivas criadas por IaC; recursos públicos por
padrão; ausência de revisão de Terraform; templates CloudFormation
inseguros; ausência de policy-as-code; drift entre infraestrutura real e
código; alterações manuais fora do IaC; módulos de terceiros não
auditados.

### 25. DNS e domínio
DNS mal configurado; subdomain takeover; CNAME apontando para recurso
removido; domínio administrativo sem MFA; registrar comprometido; ausência
de DNSSEC quando pertinente; registros TXT expondo informações; serviços
internos publicados em DNS público; ambiente staging indexado; painel de
homologação acessível pela internet.

### 26. E-mail
SPF ausente; DKIM ausente; DMARC ausente; spoofing do domínio; templates
permitindo injection; links de reset previsíveis; token de reset
aparecendo em logs; reset enviado para e-mail alterável sem reautenticação;
e-mails contendo dados pessoais excessivos; anexos sensíveis sem proteção.

### 27. Webhooks
webhook sem assinatura; não validar assinatura; segredo de webhook fraco;
replay attack; ausência de timestamp/nonce; aceitar qualquer IP como prova
de autenticidade; confiar cegamente no payload; processamento duplicado;
alteração de preço via payload; endpoints de webhook públicos sem rate
limiting; logging completo de payload contendo PII.

### 28. Pagamentos
confiar no valor enviado pelo frontend; usuário modificar preço; usuário
modificar quantidade; desconto manipulável; cupom reutilizável
indevidamente; status de pagamento alterável pelo cliente; considerar
pagamento concluído antes de confirmar no gateway; webhook falso; race
condition em pagamento; pedido duplicado; estorno sem autorização
adequada; armazenar cartão quando não deveria; CVV armazenado; dados PCI
circulando desnecessariamente pelo sistema.

### 29. Regras de negócio
comprar produto por preço negativo; alterar valor no request; aplicar
cupom infinitamente; criar saldo artificial; convidar a si mesmo; referral
abuse; cashback duplicado; cancelar depois de consumir benefício;
transferências simultâneas; race conditions; estoque negativo; bypass de
etapas obrigatórias; alterar status diretamente pela API; usuário aprovar
a própria operação; workflow incompleto tratado como concluído.

### 30. Concorrência e race conditions
dupla compra; double spending; múltiplos resgates; estoque vendido duas
vezes; saldo atualizado sem atomicidade; processamento paralelo alterando
o mesmo registro; ausência de transações; ausência de locks quando
necessários; ausência de idempotência; webhook processado diversas vezes.

### 31. Cache
Redis público; Redis sem senha; dados de usuário A servidos ao usuário B;
cache key sem tenant; cache de página autenticada; tokens armazenados
indevidamente; informações sensíveis persistidas além do necessário; CDN
cacheando resposta privada; invalidation incorreta; cache poisoning.

### 32. Filas e jobs
worker sem autenticação; fila exposta; mensagem contendo senha/token;
usuário forjando jobs; retries infinitos; job processando tenant errado;
dead-letter queue contendo dados sensíveis; ausência de idempotência;
privilégios excessivos do worker; jobs administrativos iniciáveis por
usuário comum.

### 33. Logs
senha em log; token JWT em log; API key em log; cartão em log; CPF em
excesso; conteúdo de requisição inteiro armazenado; logs acessíveis
publicamente; logs alteráveis por atacante; ausência de correlação de
eventos; ausência de timestamp confiável; ausência de logs de ações
administrativas; log injection; retenção indefinida.

### 34. Monitoramento e detecção
ninguém percebe login anormal; ausência de alertas; nenhuma detecção de
brute force; nenhuma detecção de mudança administrativa; ausência de
alertas para criação de API keys; nenhuma auditoria de acesso ao banco;
ausência de SIEM quando necessário; ausência de correlação; alertas
ignorados; nenhum monitoramento de dependências vulneráveis.

### 35. Backup e recuperação
sem backup; backup nunca testado; backup no mesmo servidor; backup
público; backup sem criptografia; ransomware atingindo produção e backup;
credenciais de backup iguais às de produção; ausência de versionamento;
ausência de disaster recovery; RPO/RTO inexistentes; restaurar backup sem
verificar integridade.

### 36. Disponibilidade e DoS
endpoints caros sem limite; geração de PDF ilimitada; upload gigante;
consultas pesadas; GraphQL muito profundo; exportação de milhões de
registros; IA consumida sem quota; chamadas pagas sem limite; ausência de
timeout; ausência de circuit breaker; ausência de rate limiting; ausência
de limites por usuário/IP/tenant; bombas de ZIP; regex DoS; recursos
assíncronos sem controle.

### 37. Gestão de erros
stack trace completo para usuário; mensagem revelando SQL; caminho interno
do servidor; nomes de tabela; versões de framework; exception contendo
token; páginas de debug; comportamento fail-open; autorização falhar e
permitir acesso; erro de integração tratado como sucesso. (Categoria
elevada a risco próprio no OWASP Top 10 2025 — A10:2025 Mishandling of
Exceptional Conditions, cobrindo 24 CWEs.) **Condições excepcionais
específicas a checar:** parâmetro obrigatório ausente não tratado (CWE-234);
null pointer / valor nulo não verificado antes do uso (CWE-476); privilégio
insuficiente tratado como erro genérico em vez de negar a ação com clareza
(CWE-274); mensagem de erro contendo dado sensível (CWE-209, já coberto
acima mas agora com CWE oficial associado); qualquer ponto do código onde
uma exceção não tratada resulta em autorizar por padrão em vez de negar
por padrão (CWE-636, "Not Failing Securely") — esse é o item de maior
risco da categoria: todo catch/except genérico que precede uma decisão de
acesso precisa ser lido explicitamente pra confirmar que o caminho de erro
nega, nunca permite.

### 38. Ambientes
desenvolvimento usando banco de produção; staging acessível sem senha;
staging com dados reais; credenciais iguais entre ambientes; API de teste
apontando para produção; feature flags administrativas expostas; debug
ativo; dados reais usados em testes; backup de produção copiado para
notebook pessoal.

### 39. Gestão de configurações
credencial padrão; flags inseguras; portas abertas; serviços
desnecessários habilitados; directory listing; painel administrativo
padrão; erro verboso; framework em modo development; permissões default
permissivas; configuração divergente entre servidores.

---

## Plataformas específicas (aplicável só se o projeto tiver esse componente)

### 40. Mobile Android/iOS
tokens armazenados em texto claro; secrets dentro do APK/IPA;
SharedPreferences inseguro; Keychain/Keystore mal utilizado; dados
sensíveis em logs; screenshot contendo informação sensível; clipboard com
senha/token; deep link hijacking; intents exportadas; componentes Android
exportados desnecessariamente; WebView inseguro; JavaScript bridge
vulnerável; certificate pinning incorreto; tráfego HTTP; backup contendo
dados sensíveis; reverse engineering simples; app repackaging; ausência de
app attestation; Play Integrity/App Attest não utilizados quando
necessários. (OWASP MASVS: armazenamento, criptografia, autenticação,
rede, interação com plataforma, código, resiliência, privacidade.)

### 41. Desktop
auto-update sem assinatura; aplicação executando com administrador;
credenciais em arquivo local; banco SQLite contendo dados em claro; IPC
inseguro; plugins não confiáveis; DLL hijacking; caminhos graváveis;
atualização baixada por HTTP; logs locais contendo credenciais.

### 56. Serverless e Edge Functions
função pública; função confiando no frontend; secrets no código; service
account excessiva; ausência de limite; função permitindo SSRF; invocation
pública; CORS permissivo; dados de tenants misturados; logs contendo
secrets.

### 57. Microservices
serviço interno considerado automaticamente confiável; autenticação apenas
no gateway; comunicação interna sem proteção; service-to-service auth
inexistente; permissões excessivas; lateral movement; secrets
compartilhados; ausência de mTLS quando necessário; APIs internas
expostas; authorization inconsistente entre serviços.

### 58. GraphQL
introspection desnecessariamente aberta; query depth ilimitada; query
complexity ilimitada; batching abuse; autorização apenas no resolver
principal; field-level authorization inexistente; informações sensíveis em
campos secundários; enumeração do schema; N+1 usado para DoS; subscriptions
sem isolamento.

### 59. WebSockets
conexão sem autenticação; autenticação apenas no handshake; token expirado
continuando válido; channel hijacking; usuário entrando em sala alheia;
dados entre tenants; ausência de rate limit; origem não validada; mensagens
não validadas.

### 55. CDN
origem acessível diretamente; cache de conteúdo privado; cache poisoning;
headers incorretos; bypass das regras do WAF; arquivos antigos acessíveis;
URL assinada sem expiração; invalidação incompleta.

### 53. Search
Elasticsearch/OpenSearch público; índice contendo dados privados; consulta
sem autorização; tenant não filtrado; snapshot público; informações
removidas do banco ainda pesquisáveis; query abuse; cluster administrativo
acessível.

---

## Privacidade e dados

### 42. Privacidade e LGPD
coletar dado sem necessidade; ausência de finalidade definida; base legal
incorreta ou inexistente; consentimento inválido; consentimento
obrigatório quando não deveria; ausência de prova do consentimento;
finalidade mudar sem revisão; retenção indefinida; impossibilidade de
exclusão; impossibilidade de correção; impossibilidade de acesso;
compartilhar dados sem transparência; fornecedores recebendo dados
excessivos; transferência internacional não analisada; dados de crianças
tratados inadequadamente; dados sensíveis sem proteção adicional; ausência
de minimização; dados pessoais em logs; dados pessoais em analytics; dados
pessoais enviados para IA sem avaliação; ambiente de teste contendo PII;
ausência de controle de acesso; ausência de política de retenção; ausência
de descarte seguro; ausência de procedimento de incidente. (A LGPD exige
medidas técnicas e administrativas para proteger dados pessoais contra
acesso não autorizado, destruição, perda, alteração, comunicação ou
tratamento inadequado ou ilícito — ver [[feedback_lgpd_seguranca_dados_sr_contador]].)

**Itens documentais/organizacionais — perguntar direto ao usuário, não dá
pra confirmar por grep (mesma lógica da categoria 76):** estes quatro são
o que a ANPD de fato usa pra multar na prática — a única multa paga até
hoje (Telekall, 2023) foi por ausência de encarregado e base legal
incorreta, não por vazamento técnico; e "vazamento sem notificação" é o
motivo de sanção mais recorrente, mais do que o vazamento em si. Sempre
perguntar, mesmo em varredura rápida:

1. **Encarregado (DPO) nomeado e com canal de contato público.** Verificar
   se existe nome/e-mail/canal do encarregado visível no site (rodapé,
   política de privacidade) e nos contratos — não basta existir
   internamente, precisa ser encontrável por um titular de dado.
2. **Protocolo de comunicação de incidente com prazo de 3 dias úteis.**
   A ANPD exige comunicação à autoridade e aos titulares em até 3 dias
   úteis da descoberta de incidente com risco relevante (Resolução
   CD/ANPD nº 15/2024), mais comunicação suplementar em até 20 dias úteis
   se necessário. Perguntar se existe esse protocolo escrito (quem
   aciona, prazo, o que informar) — não ter um documentado é tratado como
   indício de má-fé na dosimetria da multa, mesmo que o incidente nunca
   tenha ocorrido.
3. **Registro de Operações de Tratamento (ROPA, Art. 37).** Obrigatório
   mesmo para empresa pequena — agente de tratamento de pequeno porte
   pode usar o modelo simplificado que a própria ANPD publica, mas
   "não ter registro nenhum" não é opção. Costuma ser o primeiro
   documento pedido numa fiscalização.
4. **Política de privacidade reflete a operação real, não é template
   genérico copiado.** Checar se a política cita as bases legais
   realmente usadas, o prazo de retenção real e o contato do encarregado
   — política copiada de outro site/gerador automático sem adaptação é
   considerada agravante na dosimetria (Resolução CD/ANPD nº 4/2023),
   porque demonstra ausência de avaliação real de risco.

### 43. Inventário de dados
empresa não saber quais dados possui; não saber em qual banco estão; não
saber quem acessa; não saber quais terceiros recebem; não saber onde
backups existem; não saber prazo de retenção; shadow databases; planilhas
paralelas; arquivos pessoais contendo dados de clientes; dados esquecidos
em SaaS antigos.

### 72. Dados apagados
usuário exclui conta mas dados continuam no backup; índice de pesquisa
mantém dados; analytics mantém identificadores; logs mantêm CPF/e-mail;
vector DB mantém embeddings; cache mantém registros; fornecedor continua
armazenando dados; soft-delete confundido com exclusão definitiva.

### 54. Analytics e observabilidade
session replay gravando senha; replay capturando cartão; analytics
recebendo CPF; URL contendo token; query string contendo PII; terceiros
coletando formulário; ferramenta de erro capturando request completo;
telemetry contendo secrets.

---

## Organização e processo (aplicável em auditorias amplas, não por arquivo de código)

### 44. IAM corporativo
funcionários compartilhando contas; contas de ex-funcionários ativas;
admin em excesso; ausência de MFA; service account sem owner; credenciais
eternas; falta de revisão periódica; menor privilégio inexistente;
permissões herdadas indevidamente; acesso de fornecedor nunca removido.

### 45. Gestão de terceiros
SDK coletando dados sem conhecimento; analytics excessivo; pixel de
marketing recebendo PII; fornecedor comprometido; API de terceiro insegura;
DPA inexistente; subprocessadores desconhecidos; biblioteca enviada dados
para terceiros; dependência SaaS encerrada sem revogar credenciais.

### 64. Segurança de dependências e atualização
dependência vulnerável ignorada; CVE crítico sem correção; runtime EOL;
Node/PHP/Python/Java sem suporte; framework EOL; sistema operacional EOL;
container base EOL; library pinning inexistente; updates quebrando
controles de segurança.

### 65. Gestão de vulnerabilidades
ninguém responsável por corrigir; findings sem SLA; CVEs ignorados;
pentest feito e nunca corrigido; vulnerabilidade reintroduzida; ausência de
regression testing; nenhum inventário de ativos; nenhum severity model;
nenhum processo de disclosure.

### 66. Testes de segurança
ausência de SAST; ausência de DAST; ausência de SCA; ausência de secret
scanning; ausência de IaC scanning; ausência de container scanning;
ausência de API security testing; ausência de testes de autorização;
ausência de fuzzing quando pertinente; ausência de pentest periódico;
testes apenas no frontend.

### 67. Threat modeling
equipe não sabe quem é atacante; assets críticos não identificados; trust
boundaries não identificadas; fluxos de dados desconhecidos; ameaças
avaliadas apenas depois do desenvolvimento; nenhuma análise STRIDE/PASTA ou
equivalente; novas funcionalidades sem revisão de risco.

### 68. Secure SDLC
requisitos de segurança inexistentes; segurança aparece somente antes do
lançamento; nenhum review de código; nenhuma aprovação para mudanças
críticas; nenhum checklist antes de produção; nenhuma classificação de
dados; nenhum processo de patch; ausência de ownership.

### 69. Incident response
empresa não sabe o que fazer após invasão; nenhum playbook; ninguém
definido como responsável; logs insuficientes; credenciais não
rotacionáveis rapidamente; nenhuma capacidade de revogar sessões; nenhum
processo para isolar sistema; nenhum procedimento para preservar
evidências; nenhum processo de comunicação ao usuário/autoridade quando
aplicável.

### 70. Segurança operacional
servidor nunca atualizado; credenciais compartilhadas; SSH com senha
fraca; root login; máquinas administrativas infectadas; funcionário usando
computador pessoal inseguro; ausência de EDR/antimalware quando pertinente;
ausência de inventory; shadow IT.

### 71. Código legado
endpoints esquecidos; autenticação antiga; hashes obsoletos; bibliotecas
abandonadas; APIs v1 ainda disponíveis; flags antigas; contas técnicas sem
owner; código morto ainda exposto; funcionalidades "temporárias"
permanentes.

### 73. Segurança física e humana
notebook desbloqueado; senha compartilhada; phishing; engenharia social;
funcionário entregando OTP; secret mostrado em chamada; token em
screenshot; arquivo confidencial em WhatsApp; acesso administrativo sem
treinamento.

### 74. Governança
ninguém é responsável pela segurança; ninguém é responsável pela
privacidade; nenhuma classificação de risco; nenhuma política de acesso;
nenhuma gestão de fornecedores; nenhuma revisão periódica; nenhum
inventário de sistemas; nenhuma gestão de exceções; decisão de segurança
feita informalmente.

### 76. Segurança do desenvolvedor e da cadeia de acesso
Diferente das demais categorias, não é auditada lendo código-fonte — é
checada perguntando ao usuário e/ou inspecionando configs de conta/CLI
locais (`gh auth status`, `vercel whoami`, `~/.ssh/`, `.git/config`,
histórico de commits). Sempre perguntar antes de assumir que algo está OK
aqui, porque não há como confirmar via grep.

**Higiene de conta do desenvolvedor:** 2FA ausente em GitHub, Vercel,
Supabase, provedor de hospedagem/registrador de domínio, ou qualquer
plataforma com poder de deploy/DNS; chave SSH sem passphrase; Personal
Access Token (PAT) com escopo mais amplo que o necessário (`repo` inteiro
quando só precisava de `repo:status`) ou sem data de expiração; extensão
de editor (VSCode/JetBrains) ou de navegador instalada sem verificar
origem/permissões, rodando na mesma máquina que tem sessão ativa em
produção; gerenciador de senha ausente (senha de conta crítica reutilizada
ou memorizada); reuso de senha entre GitHub e outros serviços.

**Superfície do próprio agente de IA/MCP local:** segredo colado direto
numa conversa de chat com IA que fica salva em histórico local
(`~/.claude/`) ou enviada a um provedor externo sem necessidade;
`.claude/settings.json`, `.mcp.json` ou credenciais de servidor MCP
versionados no git por engano; hook (`PreToolUse`/`PostToolUse`) rodando
comando de shell sem revisão do que faz; skill/agente com permissão de
rede ou de execução de comando mais ampla do que a tarefa exige; servidor
MCP de terceiro com token de longa duração e sem rotação.

**Acesso de terceiros à infraestrutura:** colaborador, freelancer ou
ex-funcionário que saiu do projeto mas continua com acesso a GitHub,
Vercel, Supabase, DNS ou qualquer painel administrativo; token de CI/CD ou
API key de integração de parceiro que encerrou e nunca foi revogada;
conta de serviço (service account) sem dono identificável; convite
pendente de colaborador que nunca foi aceito nem cancelado.

**Controle de quem publica em produção:** branch protection na branch de
produção sem exigir review/aprovação antes do merge; ausência de commit
signing (GPG/SSH signing) em repositório com múltiplos colaboradores;
qualquer pessoa com acesso ao terminal local conseguindo rodar deploy
manual sem passar pelo pipeline (`vercel --prod`, FTP direto) e sem deixar
trilha de quem publicou o quê e quando; segredo de deploy (chave FTP,
token do provedor) compartilhado por WhatsApp/e-mail em vez de cofre de
senhas ou variável de ambiente da plataforma de CI.

---

## Padrões técnicos transversais

### 46. Segurança de IA integrada à aplicação
prompt injection; indirect prompt injection; vazamento de system prompt;
vazamento de dados sensíveis; modelo revelando informação de outro
usuário; saída da IA executada diretamente; IA gerando SQL executado sem
validação; IA chamando APIs privilegiadas; agente com acesso excessivo;
ferramenta administrativa disponível para agente comum; falta de
confirmação para ações destrutivas; hallucination tratada como dado
confiável; custo ilimitado de tokens; abuso da API de IA; RAG retornando
documento proibido; embeddings misturando tenants; documentos maliciosos
envenenando RAG; model/data poisoning; plugins/tools não confiáveis.
(OWASP GenAI Top 10 2025: prompt injection, divulgação de informação
sensível, supply chain, data/model poisoning, tratamento inseguro de
output, agência excessiva, vazamento de system prompt, vulnerabilidades em
vetores/embeddings, consumo sem limites.)

### 47. Vibe coding
aceitar código da IA sem entender; IA inventar biblioteca; copiar pacote
malicioso; IA remover autorização para "resolver" erro; desabilitar RLS
para fazer aplicação funcionar; usar service_role no frontend porque
"resolve"; colocar CORS * para eliminar erro; desabilitar verificação TLS;
adicionar sudo/root desnecessariamente; transformar endpoint privado em
público; ignorar erros de segurança; hardcode de credenciais; IA criar SQL
destrutivo; migrations não revisadas; autenticação implementada pela
metade; criptografia improvisada; confiar na validação do frontend; gerar
configuração cloud permissiva; IA alterar infraestrutura sem revisão; AI
agent executando comandos destrutivos; código gerado sem testes; nenhuma
threat model; nenhum security review.

### 48. Claude Code/Codex/agentes de desenvolvimento
agente com acesso irrestrito ao filesystem; agente lendo .env; agente
enviando segredo para modelo externo; agente acessando SSH keys; agente
acessando cloud credentials; agente executando shell automaticamente; rm
-rf ou comandos destrutivos; agente alterando IAM; agente alterando banco
de produção; agente fazendo deploy sem revisão; MCP server malicioso; tool
poisoning; MCP com scope excessivo; tokens MCP vazados; servidor MCP de
terceiro comprometido; prompt injection dentro de README/documentação;
issue maliciosa instruindo agente; dependência contendo texto projetado
para manipular agente; agente obedecendo conteúdo não confiável como
instrução. (OWASP mantém projeto específico para riscos de MCP: exposição
de tokens/secrets, escalada de privilégios por scope creep, tool
poisoning, supply-chain attacks.)

### 48b. OWASP Top 10 para aplicações agênticas (ASI01-ASI10, 2026)
Framework dedicado a sistemas onde um agente de IA planeja, usa ferramentas
e age em múltiplos passos (é exatamente o perfil de qualquer projeto que
roda Claude Code/skills/MCP com autonomia — aplica-se tanto ao produto do
cliente quanto ao próprio ambiente MazyOS). Complementa 46-48/50, que
cobrem prompt injection/RAG/MCP em si; aqui o foco é o *comportamento do
agente ao longo de uma cadeia de decisões e ferramentas*, não um prompt
isolado:

- **ASI01 Agent Goal Hijack** — documento, e-mail, issue ou dado externo
  envenenado desvia o objetivo que o agente está perseguindo, sem que o
  usuário tenha pedido isso (indirect prompt injection com efeito sobre o
  *plano*, não só sobre uma resposta pontual).
- **ASI02 Tool Misuse & Exploitation** — instrução ambígua ou ferramenta
  com privilégio maior que o necessário é usada de forma legítima na
  superfície, mas o resultado é abusivo (ex.: ferramenta de "enviar
  e-mail" usada pra exfiltrar dado por BCC oculto).
- **ASI03 Agent Identity & Privilege Abuse** — agente sem identidade
  própria bem delimitada, reaproveitando credencial cacheada, ou repassando
  instrução pra um sistema de privilégio maior sem verificação equivalente
  à que um humano precisaria passar.
- **ASI04 Agentic Supply Chain Compromise** — ferramenta, protocolo (MCP)
  ou fonte de dado de terceiro, integrados em tempo de execução, injetando
  instrução maliciosa na cadeia de decisão do agente (distinto de supply
  chain "estático" de pacote npm — aqui o componente comprometido é
  carregado dinamicamente durante a execução do agente).
- **ASI05 Unexpected Code Execution** — agente gera e roda código sem
  revisão humana pra "resolver" uma tarefa, e esse código acaba executando
  algo destrutivo ou fora do escopo pedido.
- **ASI06 Memory & Context Poisoning** — memória de longo prazo ou base de
  recuperação do agente é corrompida de forma persistente, enviesando
  decisões futuras muito depois do ataque inicial (memória de negócio,
  arquivos de skill, `_memoria/*.md` — qualquer coisa que o agente relê
  automaticamente em toda sessão é candidata a esse vetor).
- **ASI07 Insecure Inter-Agent Communication** — mensagem entre agentes (ou
  entre skills/subagents) sem autenticação/criptografia, permitindo
  interceptação, spoofing ou replay que altera o comportamento combinado.
- **ASI08 Cascading Failures** — comprometer um agente/skill se propaga
  automaticamente pra outros sistemas conectados por causa de ações em
  cadeia sem ponto de contenção (ex.: skill A aciona skill B que aciona
  deploy, sem revisão humana em nenhum ponto do caminho).
- **ASI09 Human-Agent Trust Exploitation** — agente (ou conteúdo que o
  manipula) explora o viés de autoridade do usuário, convencendo-o a
  aprovar uma ação arriscada com explicação convincente mas fabricada —
  cobre exatamente o risco de o usuário confiar cegamente num "relatório"
  ou "resumo" gerado sem checagem.
- **ASI10 Rogue Agents** — agente desalinhado passa a otimizar a métrica
  errada, agir fora da função pretendida, ou se auto-replicar/persistir
  sem autorização — risco maior conforme cresce automação (loops, cron
  jobs, agentes disparando outros agentes sem supervisão a cada execução).

### 49. RAG e vector databases
usuário A pesquisando embeddings do usuário B; filtro de tenant
inexistente; documento privado indexado como público; embeddings
considerados "não sensíveis"; prompt injection persistente dentro de
documento; poisoning da base vetorial; metadata manipulável; ACL original
não replicada no vector DB; arquivo deletado permanecendo no índice;
documentos antigos permanecendo disponíveis; recuperação por similaridade
ignorando autorização.

### 50. MCP
servidor MCP não confiável; ferramenta com descrição maliciosa; tool
poisoning; credenciais passadas ao MCP; acesso amplo ao computador;
filesystem inteiro exposto; banco inteiro disponível; MCP externo
recebendo dados internos; OAuth/scopes excessivos; ferramenta alterada
após instalação; confiança automática em resposta de tool; ausência de
allowlist.

### 51. SaaS administrativo
painel admin na mesma autenticação do cliente; ausência de MFA;
impersonation sem auditoria; funcionário vendo dados sem justificativa;
busca global expondo dados; exportação total sem autorização adicional;
ações destrutivas sem confirmação; alteração de saldo/preço sem log;
ausência de trilha de auditoria; suporte podendo trocar e-mail do usuário
arbitrariamente.

### 52. Feature flags
flags administrativas expostas ao frontend; usuário ativar plano premium;
feature flag alterar autorização; endpoint permitindo alteração de flag;
flags antigas esquecidas; teste de feature em produção sem isolamento.

### 60. Filesystem
path traversal; symlink attacks; permissões excessivas; arquivos
temporários previsíveis; dados confidenciais em /tmp; diretórios públicos;
backup config.bak; arquivos .old; .git exposto; .env servido pelo
webserver.

### 61. SSRF e serviços internos
aplicação acessando URL arbitrária; acesso a localhost; acesso a metadata
cloud; acesso a Redis interno; acesso a painéis internos; redirects
usados para bypass; DNS rebinding; protocolos não HTTP permitidos.

### 62. Deserialização e parsers
objetos serializados não confiáveis; YAML inseguro; XML XXE; pickle; Java
serialization; parsers vulneráveis; arquivos complexos sem sandbox;
formatos enviados pelo usuário processados com privilégios excessivos.

### 63. Geração de documentos
HTML → PDF permitindo acesso interno; SSRF no gerador de PDF; template
injection; execução de JavaScript; arquivo arbitrário incorporado; imagens
remotas sem restrição; dados de outro tenant inseridos no PDF.

---

## Checklist mínimo pré-produção

Antes de qualquer aplicação ir para produção, no mínimo verificar:
autenticação; autorização; isolamento de tenants; banco; RLS; APIs;
secrets; frontend; backend; cloud; storage; uploads; criptografia; logs;
backup; LGPD; dependências; CI/CD; mobile (se houver); IA (se houver);
MCP/agentes (se houver); testes de segurança; pentest ou revisão
equivalente conforme o risco; monitoramento; resposta a incidentes;
segurança do desenvolvedor e da cadeia de acesso (2FA nas plataformas de
deploy, colaboradores/tokens residuais revogados, branch protection na
produção).
