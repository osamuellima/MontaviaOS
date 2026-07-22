---
name: aviso-ia
description: >
  Insere um aviso de "página demonstrativa gerada por IA" no rodapé de um site/modelo de
  demonstração. Use quando o usuário pedir pra adicionar disclaimer de conteúdo gerado por IA
  numa peça que ainda não é de cliente real, ou disser "/aviso-ia".
---

# /aviso-ia

Marca claramente que uma página é demo — protege contra confusão sobre dado fictício (nome,
depoimento, endereço, registro profissional) que só existe pra mostrar o modelo.

## Texto padrão

```
Página demonstrativa — as imagens, nomes, informações, depoimentos, registros profissionais,
endereços e dados comerciais apresentados nesta página foram gerados por inteligência
artificial e usados apenas para fins de demonstração.
```

## Passos

1. Confirmar com o usuário qual `index.html` (ou página equivalente) recebe o aviso.
2. Localizar o rodapé do arquivo (bloco de fechamento, classe de rodapé existente).
3. Inserir o aviso logo abaixo do último elemento do rodapé, reaproveitando a classe de
   texto de rodapé já usada no arquivo (tamanho pequeno, opacidade reduzida, texto centralizado).
4. Se não existir uma classe de rodapé pra reaproveitar, aplicar estilo inline equivalente
   (fonte pequena, cor de baixo contraste proposital, mesma família tipográfica do resto da página).

## Regra

Esse aviso só entra em página de demonstração/modelo — nunca em site de cliente real com dado
verdadeiro, onde ele não faz sentido.
