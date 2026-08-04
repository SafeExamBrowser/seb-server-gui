# Context Map

## Contexts

- [SEB Server GUI (client)](./client/CONTEXT.md) — the Vue SPA; exam, template, and monitoring administration
- server — the api gateway (`server/`); no glossary yet, created lazily when its first term is resolved

## Relationships

- **client → server**: the client calls the gateway's `/api/*` routes, which proxy to the backend api servers; the client's domain language mirrors the backend's REST models
