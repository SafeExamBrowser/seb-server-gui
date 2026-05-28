# SEB Server OpenAPI Client

This folder contains the generated Hey API client for the frontend domains that have been migrated to OpenAPI.

User Account is the first migrated slice. Other domains should stay on `src/services/apiService.ts` until they are migrated intentionally.

## Refresh

Start `seb-server`, then run:

```sh
npm run openapi:refresh
```

By default the script reads:

```text
http://localhost:8080/v3/api-docs/user-account
```

Use `SEB_SERVER_OPENAPI_URL` to point at a different backend OpenAPI URL.

## Files

- `openapi/seb-server.user-account.openapi.json`: backend-owned User Account OpenAPI group used by Hey API.
- `generated/hey-api/`: generated SDK, TypeScript types, TanStack Vue Query helpers, Axios client code, and Zod schemas.
- `http/heySebServerClient.ts`: app-configured Hey API client using the shared frontend Axios auth/error behavior.

Do not edit files under `generated/hey-api/` manually. Change the backend OpenAPI annotations/customizers or `openapi-ts.config.ts`, then regenerate.

The frontend generation step should not patch the OpenAPI schema. If generated output looks wrong, fix the backend OpenAPI contract first.
