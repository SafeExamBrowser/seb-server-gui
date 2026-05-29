# SEB Server OpenAPI Client

This folder contains the generated Hey API client for the frontend domains that have been migrated to OpenAPI.

User Account is the first migrated slice. Other domains stay on `src/services/apiService.ts` until they are migrated intentionally.

## Refresh

Start `seb-server`, then run:

```sh
npm run openapi:refresh
```

By default the script reads:

```text
http://localhost:8080/v3/api-docs
```

The script fetches the full SEB Server OpenAPI document and runs `scripts/openapi/transformSebServerSpec.mjs` to extract the User Account slice. It writes two files:

- `openapi/seb-server.openapi.json` — full backend dump, **gitignored**, kept locally for debugging.
- `openapi/seb-server.user-account.openapi.json` — User Account slice, committed; consumed by Hey API.

Use `SEB_SERVER_OPENAPI_URL` to point at a different backend OpenAPI URL.

## Why a frontend transformer?

The transformer is the frontend-side contract for what enters the generated client. It:

- strips the `/admin-api/v1` path prefix (the GUI gateway exposes the backend under `/api`)
- selects only the User Account operations we care about
- drops frontend-hostile inherited parameters (e.g. `formParams`, `filterCriteria`)
- normalises `int64` to plain integer (avoids generated `bigint`/`number` drift)
- adds the few filter parameters the backend doesn't document yet (e.g. `surname`, `active`)
- supplies stable `operationId` fallbacks where the backend hasn't named inherited endpoints yet

These are all frontend concerns. A backend `GroupedOpenApi` bean is not enough to express them; even when one is added, the transformer remains the right place for client-side normalisation.

## Files

- `openapi/seb-server.user-account.openapi.json` — User Account OpenAPI slice consumed by Hey API.
- `generated/hey-api/` — generated SDK, TypeScript types, TanStack Vue Query helpers, Axios client code, and Zod schemas.
- `http/heySebServerClient.ts` — app-configured Hey API client using the shared frontend Axios auth/error behaviour.

Do not edit files under `generated/hey-api/` manually. Change `scripts/openapi/transformSebServerSpec.mjs` or the backend OpenAPI annotations, then regenerate.

The frontend generation step is allowed (and expected) to fix client-side concerns. Backend OpenAPI quirks that affect every client should still be fixed in the backend.
