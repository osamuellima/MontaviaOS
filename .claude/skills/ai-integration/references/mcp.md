# MCP — Model Context Protocol

MCP existe para uma coisa: dar ao modelo capacidade de **agir** — consultar
ou alterar um sistema externo em tempo real — de forma padronizada e
reutilizável entre clientes (Claude Code, Claude Desktop, outras apps).

## Quando NÃO usar MCP

- A ação é só dentro do mesmo processo/app que já está chamando o modelo —
  aí basta tool use direto na API (Messages API `tools`), sem o overhead de
  rodar um servidor MCP separado.
- É uma automação única, de um só uso — um script direto resolve mais
  rápido que construir um servidor MCP reutilizável.
- MCP compensa quando a integração vai ser reusada por múltiplas
  conversas/clientes/agentes, ou quando o sistema-alvo já tem um servidor
  MCP pronto de terceiros (não reinventar).

## Tool use direto vs servidor MCP

| | Tool use direto (Messages API) | Servidor MCP |
|---|---|---|
| Escopo | Uma aplicação específica | Reutilizável entre Claude Code, Desktop, outros clientes |
| Setup | Zero infra extra, só função + schema no código da app | Processo separado (stdio ou HTTP), protocolo JSON-RPC |
| Quando escolher | Feature dentro de um produto já existente | Ferramenta/dado que deveria estar disponível em qualquer sessão de IA que o usuário abrir |

Se a dúvida for "MCP ou tool use", a pergunta certa é: *isso deveria estar
disponível toda vez que eu abro uma conversa com Claude, ou só dentro desta
aplicação específica?* Primeira resposta → MCP. Segunda → tool use direto.

## Anatomia de um servidor MCP

Um servidor MCP expõe três tipos de coisas ao cliente:
- **Tools**: funções que o modelo pode chamar (ex: `buscar_cliente`,
  `gerar_guia_das`).
- **Resources**: dados que o cliente pode ler (ex: um arquivo, uma URL).
- **Prompts**: templates de prompt reutilizáveis (menos comum).

### Scaffold mínimo — TypeScript (SDK oficial `@modelcontextprotocol/sdk`)

```bash
mkdir meu-servidor-mcp && cd meu-servidor-mcp
npm init -y
npm install @modelcontextprotocol/sdk zod
```

```typescript
// index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "meu-servidor", version: "1.0.0" });

server.registerTool(
  "buscar_cliente",
  {
    title: "Buscar cliente",
    description: "Busca dados de um cliente pelo CNPJ",
    inputSchema: { cnpj: z.string().describe("CNPJ do cliente, só dígitos") },
  },
  async ({ cnpj }) => {
    // chamada real ao banco/API aqui — nunca mockar em produção
    const cliente = await buscarClientePorCnpj(cnpj);
    return {
      content: [{ type: "text", text: JSON.stringify(cliente) }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Scaffold mínimo — Python (SDK oficial `mcp`)

```bash
pip install mcp
```

```python
# server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("meu-servidor")

@mcp.tool()
def buscar_cliente(cnpj: str) -> dict:
    """Busca dados de um cliente pelo CNPJ."""
    return buscar_cliente_por_cnpj(cnpj)

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

## Transporte: stdio vs HTTP

- **stdio**: para uso local (Claude Code, Claude Desktop rodando na mesma
  máquina). Mais simples, é o padrão para a maioria dos casos deste usuário.
- **HTTP (Streamable HTTP)**: quando o servidor precisa ser acessado
  remotamente ou por múltiplos usuários/sessões simultâneas — exige mais
  cuidado com autenticação.

## Registrar o servidor no Claude Code

```bash
claude mcp add meu-servidor -- node /caminho/absoluto/index.js
# ou, para Python:
claude mcp add meu-servidor -- python /caminho/absoluto/server.py
```
Confirmar com `/mcp` dentro de uma sessão interativa.

## Segurança — obrigatório antes de expor qualquer tool

- Toda tool que lê/escreve dado de cliente precisa respeitar isolamento por
  tenant, igual ao resto do sistema (ver [[feedback_lgpd_seguranca_dados_sr_contador]]).
- Nunca dar a uma tool MCP permissão de escrita direta em produção sem
  passar pelo mesmo fluxo de validação do app (ver
  [[feedback_sem_alteracao_dados_por_fora]]) — uma tool mal desenhada é
  literalmente um "script por fora" com superpoderes, porque o modelo decide
  quando chamá-la.
- Tools destrutivas (delete, update em massa) devem pedir confirmação
  explícita antes de executar, ou nem existir como tool — preferir só leitura
  quando a ação puder esperar revisão humana.
- Nunca logar ou retornar segredos (chaves de API, tokens) no `content` de
  uma tool response.

## Testar localmente

MCP Inspector (ferramenta oficial) para testar tools sem precisar de um
cliente completo:
```bash
npx @modelcontextprotocol/inspector node index.js
```
