# Fine-tuning

Fine-tuning retreina os pesos do modelo para fixar um comportamento,
formato ou tarefa. É a técnica mais cara, mais lenta de iterar e a que mais
frequentemente é escolhida por engano quando prompt engineering ou RAG
resolveriam com muito menos esforço.

## Antes de qualquer coisa: tentou o caminho mais barato?

Ordem de tentativa recomendada, sempre, antes de fine-tuning:
1. **System prompt bem escrito** com instruções claras e exemplos inline
   (few-shot). Resolve a maioria dos casos de "quero que sempre responda
   nesse formato/tom".
2. **RAG** se o problema é falta de conhecimento específico, não de
   comportamento (ver `references/rag.md`).
3. **Prompt caching** se o problema é custo/latência de um contexto grande
   repetido, não comportamento do modelo.
4. **Fine-tuning** só quando as anteriores foram testadas e o modelo ainda
   falha de forma consistente numa tarefa bem definida e com muitos
   exemplos disponíveis (tipicamente centenas a milhares).

## Quando fine-tuning é justificado

- Tarefa muito específica e repetitiva com formato de saída rígido, onde
  few-shot no prompt já ficou grande demais ou inconsistente.
- Necessidade de reduzir latência/custo por chamada removendo instruções
  longas do prompt (o comportamento "vira" o modelo, não fica no contexto).
- Domínio de linguagem muito específico (jargão interno, formato de
  documento incomum) onde o modelo base erra sistematicamente mesmo com
  bons exemplos no prompt.
- Já existe um volume real de exemplos rotulados de qualidade (não
  gerados só para preencher — dado ruim de treino piora o modelo).

## Fine-tuning de modelos Anthropic (Claude)

A Anthropic oferece fine-tuning sob solicitação/parceria para clientes
enterprise via console — não é self-service público como OpenAI. Antes de
planejar um pipeline de fine-tuning para Claude, confirmar disponibilidade
atual e requisitos com a documentação oficial/time de conta, porque isso
muda com frequência. Não assumir que existe um endpoint self-service.

## Fine-tuning de modelos OpenAI (self-service, referência de fluxo geral)

Formato de dataset (JSONL, um exemplo por linha):
```json
{"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
```

Fluxo:
1. Preparar dataset de treino (e um de validação, separado, nunca do
   mesmo lote de exemplos usados no treino).
2. Upload do arquivo.
3. Criar job de fine-tuning apontando pro arquivo + modelo base.
4. Avaliar o modelo resultante contra o mesmo conjunto de perguntas do
   modelo base, lado a lado — nunca aceitar "parece melhor" sem comparação
   objetiva.

## Preparo de dataset — regras que valem para qualquer provedor

- **Qualidade > quantidade.** 200 exemplos bons superam 2000 ruidosos.
- **Diversidade de casos**, incluindo casos de borda e exemplos de "recusa
  correta" quando aplicável (ex: quando o modelo deve dizer que não sabe).
- **Sem dado pessoal/sensível de cliente real no dataset** sem anonimização
  — dataset de fine-tuning é um artefato que pode vazar via output do
  modelo treinado. Ver [[feedback_lgpd_seguranca_dados_sr_contador]].
- **Separar treino/validação/teste** antes de qualquer treino — nunca
  avaliar com dado que o modelo viu.
- **Versionar o dataset** junto com o modelo resultante — sem isso fica
  impossível reproduzir ou depurar uma regressão depois.

## Avaliação antes/depois — obrigatório

Nunca declarar "o fine-tuning funcionou" sem:
1. Conjunto de teste fixo, não visto no treino.
2. Métrica objetiva definida antes do treino (não escolhida depois pra
   justificar o resultado).
3. Comparação lado a lado: modelo base (com o melhor prompt possível) vs
   modelo fine-tunado, nas mesmas perguntas.
4. Checagem de regressão: o modelo fine-tunado não pode ter piorado em
   tarefas fora do escopo do fine-tuning (efeito colateral comum é
   "esquecimento catastrófico" de capacidades gerais).

## Custo e manutenção

Fine-tuning não é "treinar uma vez e esquecer": todo re-treino custa tempo e
dinheiro, e o modelo fine-tunado fica desalinhado se o domínio mudar (ex:
legislação fiscal muda, formato de documento muda). Se o conteúdo muda com
frequência, isso é sinal de que RAG era a escolha certa, não fine-tuning —
ver tabela de decisão no `SKILL.md` principal.
