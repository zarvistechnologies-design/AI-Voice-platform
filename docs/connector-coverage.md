# Connector coverage and verification

This tracks the 20 connector entries requested for Vozon. An entry shown in the panel does not mean the provider has authorized Vozon or that all of its actions are available.

| Entry | Current Vozon capability | Remaining work for full provider support |
| --- | --- | --- |
| Atlassian | Remote MCP server can be added with an HTTPS endpoint and bearer token | Provider sign-in, official endpoint setup, live tests |
| Razorpay API | Remote MCP server can be added | Merchant API key setup, payment actions, live tests |
| Zapier | Existing outbound webhooks; remote MCP server can be added | Dedicated account connection and agent actions, live tests |
| Zoho CRM | Remote MCP server can be added | Zoho MCP URL/account setup, live tests |
| Asana | Remote MCP server can be added | Provider sign-in and live tests |
| ClickUp | Remote MCP server can be added | Provider sign-in and live tests |
| Freshsales | Remote MCP server can be added | Provider sign-in and live tests |
| Google Calendar | Limited native availability and appointment actions; remote MCP server can also be added | Broader tool coverage and live authorized tests |
| Google Docs | Remote MCP server can be added | Google Docs consent scopes and dedicated actions, live tests |
| Google Drive | Remote MCP server can be added | Google Drive consent scopes and dedicated actions, live tests |
| Google Sheets | Limited native call export; remote MCP server can also be added | Broader tool coverage and live authorized tests |
| Gmail | Remote MCP server can be added | Gmail consent scopes and dedicated actions, live tests |
| Linear | Remote MCP server can be added | Provider sign-in and live tests |
| monday.com | Remote MCP server can be added | Provider sign-in and live tests |
| Notion | Remote MCP server can be added | Provider sign-in and live tests |
| Prospeo | Remote MCP server can be added | API key setup and live tests |
| Razorpay OAuth | Remote MCP server can be added | Merchant OAuth app and live tests |
| Salesforce | Remote MCP server can be added | Provider sign-in and live tests |
| Slack | Limited native call notifications; remote MCP server can also be added | Broader tool coverage and live authorized tests |
| Jira | Remote MCP server can be added | Atlassian account setup and live tests |

The remote MCP path is **conditional**: a provider or third party must supply a reachable Streamable HTTP MCP endpoint and, where needed, a bearer token. The connection is only saved after MCP initialization and tool discovery succeed. Selected tools are attached per agent, and every invocation checks that the agent still has the tool and that the connection belongs to the same workspace. Full URLs and bearer tokens are encrypted at rest.

## Test evidence

- `npx tsx --test test/remoteMcpSafety.test.ts`: URL safety, schema persistence, MCP handshake, tool discovery and tool invocation against a mock server.
- `npx tsx scripts/remoteMcpSmoke.ts`: authenticated HTTP and MongoDB flow covering connect, encrypted secrets, redacted list response, attach, agent tool call, detach and removal.
- `npm run smoke:phase7`: mocked HubSpot, Calendly and Slack connection/action tests, including post-call delivery.
- Backend and frontend type checks and production builds passed.

These are local mock/integration tests. None of the 20 entries was live-authorized against a real provider account in this run because no provider test accounts are available. The panel labels missing connections as **Setup needed** and existing limited actions as **Limited native**.
