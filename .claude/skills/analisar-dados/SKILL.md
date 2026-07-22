---
name: analisar-dados
description: >
  Lê um arquivo de dados (CSV, Excel, TXT, JSON) e devolve um resumo executivo com o que
  importa, o que preocupa e o que fazer a seguir. Use quando o usuário pedir pra ler, resumir
  ou interpretar um arquivo de dados, relatório ou planilha.
---

# /analisar-dados

## O que ler antes

- `_memoria/empresa.md` — pra entender o que os números representam no contexto do negócio
- `_memoria/preferencias.md` — tom da entrega

## Passos

**1. Confirmar o que é o arquivo**, se não estiver óbvio pelo nome/conteúdo: o que ele mede, e qual pergunta o usuário quer responder com ele. Se já estiver claro, pular direto pra análise.

**2. Ler o arquivo por completo** (inclusive extrair conteúdo de célula em Excel).

**3. Organizar o que aparece em quatro grupos:**
- **Indo bem** — métrica em alta, destaque positivo, quem/o que performa acima da média
- **Merece atenção** — queda, anomalia, abaixo do esperado, gargalo visível
- **Comparação** — período a período, top vs. bottom, distribuição entre categoria
- **Não óbvio** — correlação ou padrão que só aparece olhando com calma, não na primeira leitura

**4. Entregar em prosa corrida**, não só bullet solto — quem ler não deveria precisar abrir o arquivo original pra entender o panorama:

```markdown
# Análise — [nome do arquivo]
*[data]*

## Panorama
[o que os dados mostram, em parágrafo]

## Indo bem
[com contexto, não só listado]

## Atenção
[idem]

## 3 recomendações
1.
2.
3.

## Números que sustentam a análise
| Métrica | Valor | Contexto |
```

Salvar na pasta de saída apropriada ao perfil do workspace. Oferecer exportar em HTML se for pra compartilhar/apresentar.

## Regras

- Prosa, não telegrama de bullets
- Zero número inventado — só o que está no arquivo
- Dado incompleto ou inconsistente: avisar antes de analisar, não depois
- Tom segue `_memoria/preferencias.md`
