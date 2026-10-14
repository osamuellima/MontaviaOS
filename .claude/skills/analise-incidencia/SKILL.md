---
name: analise-incidencia
description: Dado um edital de concurso (PDF/texto) e a banca, monta um MAPA DE INCIDÊNCIA — quais assuntos mais caem e mais se repetem — para o candidato estudar pela prova real em vez de banco de questões genérico. Extrai o conteúdo programático oficial do edital, levanta na web o padrão histórico de incidência daquele tipo de concurso (transversal a bancas, mais o estilo específico da banca do edital), cruza os dois e entrega um mapa priorizado por matéria (🔴 alta / 🟡 média / 🟢 baixa) com ordem de ataque e recomendação de estudo. Serve para qualquer concurso, mas foi calibrada em carreiras policiais (PC/PP/PF/PRF). Não é gerador de plano de estudo dia-a-dia por si só — o mapa é o insumo; o cronograma é passo opcional no fim. Use quando o usuário disser "o que mais cai", "análise de incidência", "estudar pela prova e não por banco de questões", "mapa de prioridades do edital", ou entregar um edital pedindo por onde começar.
---

# Análise de Incidência

Transforma um edital + banca em um **mapa de prioridades de estudo** baseado no
que a prova realmente cobra, cruzando o conteúdo programático oficial com o
padrão histórico de incidência. O objetivo é o candidato estudar o que mais
cai, na ordem que mais rende, em vez de resolver questão aleatória de banco.

## Princípios

1. **Ancorar no edital real, nunca em memória.** O conteúdo programático que
   vale é o do edital em mãos — extraia-o do PDF/texto e trabalhe em cima
   dele. Não liste assunto que não está no edital, mesmo que "sempre caia".
2. **Incidência é transversal à banca; estilo é da banca.** O QUE cai (temas)
   costuma se repetir entre bancas no mesmo tipo de concurso — levante isso
   amplo. COMO cai (formato, pegadinha, peso em interpretação x lei seca) é da
   banca do edital — levante isso à parte. Combine os dois no mapa.
3. **Busca web ampla e datada.** Faça várias buscas por matéria, cruzando
   fontes (cursinhos, professores, análises de prova, editais anteriores).
   Nunca cravar incidência "de cabeça" — sempre citar de onde veio.
4. **Cruzar, não só listar.** O valor está no cruzamento: um tema entra como
   🔴 ALTA só quando está no edital E tem alta incidência histórica. Alta
   incidência de algo fora do edital = descartar. No edital mas raríssimo em
   prova = 🟢 baixa.
5. **Priorizar por custo-benefício, não por ordem do edital.** A saída é
   ordenada por onde a nota é ganha (o que mais elimina / mais pesa), não pela
   sequência de matérias do edital. Sinalize os "custo-benefício ocultos"
   (ex.: leis estaduais que quase ninguém estuda e caem).
6. **Confirmar o escopo antes de rodar a busca pesada.** Confirme banca e
   cargo com o usuário antes das buscas (banca errada = análise inteira
   errada). Bancas se confundem por nome parecido — validar sempre.
7. **Mapa é o produto; cronograma é opcional.** Entregue primeiro o mapa de
   incidência. Só monte plano dia-a-dia se o usuário pedir, e aí calibrado à
   vida real dele (tempo disponível, estudo passivo x ativo). Ver
   [[feedback_workflow_claude_code]] sobre prompts pequenos e revisão em tempo
   real; não despejar cronograma gigante que ele não vai cumprir.

## Etapas

### Etapa 1 — Localizar e extrair o edital
- Ache o PDF/texto do edital (na pasta do projeto ou fornecido pelo usuário).
- Extraia o texto (`pdftotext -layout` para preservar colunas).
- Isole: **cargo(s)**, **banca**, **matérias**, e o **conteúdo programático**
  completo (Conhecimentos Básicos + Específicos), além de nº de questões/peso
  por matéria se o edital trouxer, e etapas (objetiva/discursiva/títulos).

### Etapa 2 — Confirmar banca e cargo
- Confirme com o usuário a **banca** (validando o nome — confusões são comuns)
  e o **cargo** foco. Só siga com isso travado.

### Etapa 3 — Levantar a incidência (busca web)
- **Transversal (o que cai):** buscas por matéria do tipo "assuntos que mais
  caem em [tipo de concurso] [matéria]", varrendo várias bancas.
- **Da banca (como cai):** "perfil/estilo da banca [X]", peso em interpretação
  x lei seca, tipos de pegadinha, provas anteriores da banca.
- **Histórico:** editais e provas anteriores do mesmo órgão, se houver.
- Se o usuário fornecer PDFs de provas anteriores, leia questão a questão e
  faça a contagem real — é o dado mais forte; prefira-o ao levantamento web.

### Etapa 4 — Cruzar e montar o mapa
- Para cada matéria do edital, classifique os tópicos em 🔴/🟡/🟢 pela regra do
  princípio 4. Use o gabarito de referência em
  `references/incidencia-policial.md` como ponto de partida para carreiras
  policiais (ajuste ao edital específico; não copie cegamente).
- Saída em Markdown:
  - Matérias ordenadas por peso estratégico (não pela ordem do edital).
  - Dentro de cada uma, tópicos 🔴/🟡/🟢 com o porquê (o que mais cai).
  - Seção "custo-benefício oculto" (temas fáceis/pouco estudados que caem).
  - **Ordem de ataque** sugerida (sequência de estudo por rendimento).
  - Citar as fontes web usadas ao final (links markdown).

### Etapa 5 — (Opcional) Cronograma
- Só se o usuário pedir. Pergunte: tempo/dia disponível, melhor turno, estudo
  passivo (ex.: áudio em deslocamento/trabalho) x ativo (sentado, questões), e
  data da prova. Monte semanas realistas dividindo em camada passiva
  (primeiro contato) e ativa (fixação por questão), respeitando a data.

## Observações

- Funciona para qualquer concurso; o `references/` cobre carreiras policiais.
  Para outras áreas, faça o levantamento web do zero seguindo os princípios.
- Não invente estatística de incidência ("cai 30%") sem fonte. Se o dado exato
  não existe, diga o padrão qualitativo (alta/média/baixa) e a base.
