# SEB Server OpenAPI Client

This folder contains the generated Hey API client for SEB Server. The generation is driven straight from the backend OpenAPI document — no per-domain transformer in between.

## Refresh

Start `seb-server`, then run:

```sh
npm run openapi:refresh
```

By default the script reads:

```text
http://localhost:8080/v3/api-docs
```

Use `SEB_SERVER_OPENAPI_URL` to point at a different backend OpenAPI URL.

`npm run openapi:refresh` does two things:

1. Fetch the full SEB Server spec and write it to `openapi/seb-server.openapi.json`.
2. Run `@hey-api/openapi-ts` to regenerate the SDK, types, TanStack Vue Query helpers, and Zod schemas under `generated/hey-api/`.

The fetch step performs **one** small normalisation: every `format: int64` is dropped. SEB Server uses Java `Long` for ids, which OpenAPI tags as `int64`, which causes `@hey-api/typescript` to emit `number` while the Zod plugin emits `z.coerce.bigint()` — drift that would otherwise force casts at every parse. All SEB Server ids fit comfortably in JavaScript's 53-bit safe integer range, so coercing both sides to plain `number` is safe.

## Files

- `openapi/seb-server.openapi.json` — full backend dump (input to the codegen, committed so the generated client is reproducible from history).
- `generated/hey-api/` — generated SDK, TypeScript types, TanStack Vue Query helpers, Axios client code, and Zod schemas.
- `http/heySebServerClient.ts` — app-configured Hey API client using the shared frontend Axios auth/error behaviour.

Do not edit files under `generated/hey-api/` manually. Change the backend OpenAPI annotations or `openapi-ts.config.ts`, then regenerate.

## Adding a new domain

There is no per-domain filter on the frontend — the generated client covers the whole backend. To migrate the next domain (institutions, exams, etc.):

1. Add a `<domain>Service.ts` next to `userAccountService.ts` that imports the relevant generated SDK functions and zod schemas.
2. Add composables under `pages/(app)/<domain>/api/` that wrap them in TanStack Vue Query.
3. Migrate the pages to the new composables.

The generated source grows with each backend operation, but tree-shaking removes anything you don't import from the final bundle. The repo carries the larger generated file in exchange for not maintaining a per-domain transformer.

## Backend dependencies

Two backend changes underpin the cleanliness of the generated client. Both live in `EntityControllerOpenApiCustomizer` in the backend repo:

- Operation IDs on inherited `EntityController`/`ActivatableEntityController` methods are remapped from `getPage_1`/`hardDelete_1`/etc. to domain-named ids (`getUserAccounts`, `deleteUserAccount`, ...). Without this, the generated client identifiers are unreadable.
- The generic `filterCriteria` Spring `MultiValueMap` parameter is removed from inherited list endpoints. Without this, every list query is forced to carry an untyped map param. Per-domain filter fields can still be passed as flat query parameters — they're handled by Spring's `MultiValueMap` binding even when undocumented.

If you migrate a new domain and the generated identifiers look wrong, check whether the corresponding backend operation has an explicit `@Operation(operationId = ...)` or relies on one of these customiser fallbacks.
