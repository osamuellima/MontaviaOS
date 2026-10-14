# RAG — Retrieval-Augmented Generation

RAG existe para uma coisa: dar ao modelo acesso a conhecimento que não cabe
(ou não deveria ficar) no prompt, buscando só os trechos relevantes na hora
da pergunta. Não é treinamento — o modelo continua o mesmo, só muda o que
entra no contexto.

## Quando NÃO usar RAG

- O documento inteiro cabe no contexto do modelo (ex: um PDF de 10-30
  páginas) — jogar o texto direto no prompt costuma ter menos falhas de
  recuperação do que RAG mal ajustado.
- A pergunta precisa de dado vivo/atual de um sistema (saldo de hoje, status
  de um pedido) — isso é MCP/tool use, não RAG.
- O volume de conteúdo é pequeno e estático (menos de ~20 documentos curtos)
  — um índice simples por palavra-chave ou até busca linear pode bastar.

## Arquitetura padrão

```
Documentos → Ingestão → Chunking → Embeddings → Banco vetorial
                                                        ↓
Pergunta do usuário → Embedding da pergunta → Busca por similaridade → Top-K chunks
                                                        ↓
                                    Chunks + pergunta → Prompt do modelo → Resposta
```

### 1. Ingestão
Extrair texto de origem (PDF, DOCX, XML fiscal, HTML, banco de dados). Para
documentos fiscais/contábeis (NF-e, XML), preservar estrutura de campos, não
só texto solto — buscar por "valor do ICMS na NF-e X" funciona melhor se o
chunk mantiver o contexto de campo.

### 2. Chunking
- Tamanho típico: 200-800 tokens por chunk, com overlap de 10-20% entre
  chunks vizinhos para não cortar uma frase relevante ao meio.
- Chunking semântico (por seção/parágrafo) tende a superar chunking por
  contagem fixa de caracteres quando o documento tem estrutura (contratos,
  relatórios).
- Guardar metadata em cada chunk: fonte, data, cliente/tenant, número de
  página — necessário tanto para citar a fonte na resposta quanto para
  filtrar por tenant (ver nota de LGPD no SKILL.md principal).

### 3. Embeddings
- Modelo de embedding é escolha independente do modelo de geração (pode
  usar embeddings da OpenAI/Voyage/Cohere mesmo gerando resposta com Claude).
- Voyage AI tem modelos otimizados e integração recomendada pela Anthropic
  para uso com Claude (`voyage-3`, `voyage-3-lite`).
- Manter o mesmo modelo de embedding entre ingestão e consulta — trocar de
  modelo exige reprocessar todo o índice.

### 4. Banco vetorial
Para os projetos deste usuário (Next.js + Supabase), a opção natural é
**pgvector no Supabase** — já é o banco em uso, evita infra extra:

```sql
create extension if not exists vector;

create table document_chunks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references clientes(id),
  document_id uuid not null,
  content text not null,
  embedding vector(1536),
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index on document_chunks using ivfflat (embedding vector_cosine_ops);

-- RLS: isolar por tenant, igual ao resto do sistema BPO
alter table document_chunks enable row level security;
create policy "tenant isolado" on document_chunks
  using (tenant_id = auth.jwt() ->> 'tenant_id');
```

Alternativas só se pgvector não bastar em escala (milhões de vetores):
Pinecone, Qdrant, Weaviate — não introduzir infra nova sem necessidade
comprovada de performance.

### 5. Retrieval
```sql
select content, metadata,
       1 - (embedding <=> query_embedding) as similarity
from document_chunks
where tenant_id = $1
order by embedding <=> query_embedding
limit 8;
```
- `<=>` é distância de cosseno no pgvector.
- Top-K típico: 5-10 chunks. Ajustar por teste, não por palpite.
- Re-rank opcional (ex: Cohere rerank) quando o retrieval bruto por
  similaridade traz muito ruído — só adicionar se o retrieval simples já foi
  testado e ficou abaixo do esperado.

### 6. Geração
Montar o prompt com os chunks recuperados + instrução de citar a fonte +
instrução explícita de dizer "não sei" se os chunks não cobrirem a
pergunta — RAG sem essa instrução tende a alucinar preenchendo lacunas.

## Checklist antes de considerar "pronto"
- [ ] RLS/isolamento por tenant testado com dois clientes diferentes.
- [ ] Teste com pergunta cuja resposta NÃO está nos documentos (deve dizer
      que não sabe, não inventar).
- [ ] Custo de reingestão calculado se os documentos mudam com frequência.
- [ ] Pipeline de ingestão roda contra ambiente de dev, nunca direto em
      produção, na fase de prototipagem.
