---
name: ai-integration
description: Guia de decisão e scaffold de implementação para as três formas de estender um LLM a um domínio específico — RAG (busca vetorial sobre documentos), MCP (conectar o modelo a ferramentas/sistemas externos) e fine-tuning (retreinar o modelo para um comportamento). Use quando o usuário quiser "o modelo saber sobre meus documentos", "o Claude/GPT acessar meu sistema/API", "treinar um modelo pros meus dados", ou pedir explicitamente RAG/MCP/fine-tuning. Primeiro decide qual abordagem (ou combinação) resolve o problema real, depois — só se o usuário confirmar que quer código — gera o scaffold correspondente (pipeline RAG com embeddings/vetor, servidor MCP em TypeScript ou Python, dataset e job de fine-tuning). Não é a skill claude-api (referência de API do Claude) nem vuln-scan (auditoria de segurança).
---

# AI Integration — RAG, MCP e Fine-tuning

Três técnicas resolvem problemas diferentes. O erro mais comum é escolher a
técnica errada porque as três "parecem" a mesma coisa ("fazer a IA saber
algo que ela não sabe"). Esta skill começa sempre pelo diagnóstico, não pela
implementação.

## Princípio central: diagnosticar antes de construir

Nunca pule direto para gerar código de RAG, MCP ou fine-tuning só porque o
usuário usou uma dessas palavras. É comum o termo estar errado para o
problema descrito. Primeiro entenda:

1. **O que precisa mudar**: o modelo precisa *saber* algo (conhecimento),
   *fazer* algo (ação em sistema externo), ou *se comportar* de um jeito
   específico (estilo, formato, tarefa repetitiva)?
2. **Com que frequência a informação muda**: documentos que mudam toda
   semana pedem RAG, não fine-tuning (retreinar toda semana é caro e lento).
3. **O dado é grande demais pro contexto**: se cabe inteiro no prompt (ex:
   um manual de 20 páginas), muitas vezes nem precisa de RAG — contexto
   longo direto resolve com menos engenharia.
4. **Precisa de ação em tempo real** (consultar um banco, chamar uma API,
   ler um arquivo agora): isso é sempre MCP (ou tool use), nunca RAG nem
   fine-tuning.

Ver [[reference_glossario_sr_contador]] e [[feedback_arquitetura_antes_de_features]]
— pensar propósito e conexões antes de escrever código vale também aqui.

### Tabela de decisão rápida

| Sintoma do pedido do usuário | Técnica |
|---|---|
| "o modelo precisa responder com base nesses PDFs/planilhas/contratos" | RAG |
| "a IA precisa consultar/atualizar meu banco de dados ou sistema agora" | MCP (tool use) |
| "quero que sempre responda nesse formato/tom/estrutura específica" | Fine-tuning (ou, primeiro, tentar prompt/system prompt — costuma bastar) |
| "preciso que ela busque na web ou num CRM externo" | MCP |
| "tenho milhares de exemplos rotulados de uma tarefa bem definida" | Fine-tuning |
| "o conteúdo muda toda semana e preciso que fique sempre atualizado" | RAG (nunca fine-tuning) |
| "quero reduzir tokens/latência num prompt repetitivo" | Prompt caching, não estas três |

Quando mais de uma linha se aplica, combine — é comum um agente real usar
RAG (conhecimento) + MCP (ação) juntos, e fine-tuning raramente é
necessário se prompting + RAG + MCP já resolvem.

**Antes de recomendar fine-tuning**: sempre pergunte se prompt engineering
bem feito (few-shot, system prompt detalhado, RAG) já foi tentado. Fine-tuning
é a opção mais cara, mais lenta de iterar e mais fácil de errar — é
penúltimo recurso, não primeira escolha.

## Fluxo desta skill

1. **Entender o problema** — conversa curta com o usuário sobre os 4 pontos
   do diagnóstico acima. Não pedir para o usuário "escolher a técnica";
   pedir para descrever o problema e você recomendar.
2. **Recomendar e confirmar** — apresentar a recomendação (uma técnica ou
   combinação) com a razão, em 2-3 frases. Perguntar se o usuário quer só
   entender a diferença ou também quer o scaffold de código.
3. **Se só quer entender**: parar aqui, sem gerar arquivos.
4. **Se quer implementar**: carregar a referência específica listada abaixo
   e seguir o passo a passo dela.

## Referências por técnica

- `references/rag.md` — arquitetura de pipeline RAG (ingestão, chunking,
  embeddings, banco vetorial, retrieval, re-rank), opções compatíveis com
  Supabase (pgvector, já usado nos projetos SR Contador) e scaffold mínimo.
- `references/mcp.md` — quando construir um servidor MCP vs usar tool use
  direto na API, estrutura de um servidor MCP (TypeScript e Python),
  registro de tools/resources, e como testar localmente.
- `references/fine-tuning.md` — quando fine-tuning é justificado, preparo de
  dataset, formatos por provedor, avaliação antes/depois, e alternativas
  mais baratas a tentar primeiro.

## Notas de contexto do usuário

Os projetos deste usuário usam Next.js + Supabase (ver
[[project_bpo_financeiro]]). Se o cenário for RAG sobre documentos fiscais/
contábeis de clientes, sempre lembrar [[feedback_lgpd_seguranca_dados_sr_contador]]
— dados de clientes em embeddings/vetor ainda são dados pessoais/fiscais e
exigem os mesmos cuidados de acesso e isolamento por tenant que o resto do
sistema. Nunca alterar dados de produção fora do fluxo do app ao prototipar
(ver [[feedback_sem_alteracao_dados_por_fora]]) — pipelines de ingestão RAG
devem rodar contra ambiente de teste/dev, não direto em produção.
