# Migrating a domain to the OpenAPI / HeyAPI stack

This guide describes how to migrate one backend domain (e.g. _Institution_, _Exam_) from
the legacy `apiService` + `useFetch` setup to the generated **HeyAPI** stack, where the
backend OpenAPI document is the single source of truth for TypeScript models,
request/response types, SDK methods, Zod schemas, and TanStack Query keys.

The migration touches **two repositories**:

| Repo                         | What changes                                                                                                            |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `seb-server` (backend)       | OpenAPI annotations + one central customizer entry so the spec describes the domain cleanly. No business-logic changes. |
| `seb-server-gui` (this repo) | Regenerated client, a thin service, TanStack composables, thin model aliases, zod-derived form rules, page wiring.      |

**User Account** is the reference implementation. Every step below links to a concrete UA
file you can copy. Migrate **one domain at a time** — the legacy `apiService`/`useFetch`
flow keeps serving every non-migrated domain in parallel.

---

## 0. Mental model

- There are **two HTTP clients**, and they share the same Axios behaviour on purpose:
  - Legacy: `client/src/services/apiService.ts` (used by non-migrated domains).
  - HeyAPI: `client/src/api/seb-server/http/heySebServerClient.ts` (used by migrated domains).
  - Both are built by `client/src/services/http/configureApiAxios.ts`, so they share base
    URL, token attach/refresh, `401 → logout`, `toAppError` normalisation, transport-error
    toast de-duplication, and the `_authType` / `_skipErrorToast` request flags.
- The HeyAPI client additionally threads TanStack's `AbortSignal` into the SDK, so
  in-flight requests are really cancelled (the legacy `useFetch` could not do this).
- **Generated code is never hand-edited.** It lives only under
  `client/src/api/seb-server/generated/hey-api/` and is reproducible from the committed
  spec (see §5). Handwritten code is small glue around it.

```
backend @Schema/@Operation annotations
        │  (npm run openapi:refresh)
        ▼
generated/hey-api/{types,sdk,zod,@tanstack/vue-query}.gen.ts   ← never edit
        │
services/seb-server/<domain>Service.ts        ← thin: SDK call + zod parse + signal
        │
pages/(app)/<domain>/api/use*.ts              ← TanStack useQuery/useMutation + generated keys
        │
pages/(app)/<domain>/composables + components ← form rules from zod, page wiring
```

---

## Part A — Backend (`seb-server`, branch `OpenAPI-HeyAPI-CodeGen`)

Goal: make the generated identifiers and types **useful** without a frontend spec
transformer. All paths below are in the `seb-server` repo.

Most CRUD endpoints are **inherited** from the generic base controllers
(`EntityController<T,M>`, `ActivatableEntityController`, `ReadonlyEntityController`).
springdoc would otherwise document them with unusable names (`getPage_1`, `hardDelete_1`)
and an untyped `filterCriteria` map. The class
`webservice/weblayer/api/EntityControllerOpenApiCustomizer.java` patches the spec at
runtime so you usually only add **annotations + one filter-registry entry**.

### A1. Name the controller `<Domain>Controller` and extend the generic base

```java
@Tag(name = "Institution", description = "Institution administration endpoints.")
@SecurityRequirement(name = WebserviceConfig.SWAGGER_AUTH_ADMIN_API)   // authenticated admin API
public class InstitutionController extends ActivatableEntityController<Institution, InstitutionMod> {
```

- `resourceName()` strips the trailing `Controller`, so `InstitutionController → Institution`.
- The customizer (`inheritedOperationId`, `EntityControllerOpenApiCustomizer.java:231-246`)
  then auto-names every inherited operation:
  `getPage→getInstitutions`, `create→createInstitution`, `getBy→getInstitutionById`,
  `savePut→editInstitution`, `hardDelete→deleteInstitution`, `activate→activateInstitution`,
  `deactivate→deactivateInstitution`, …
- The create body (`application/x-www-form-urlencoded`, `$ref` to `M`) and the `200`
  response (`application/json`, `$ref` to `T`) are synthesised automatically, and the `T`/`M`
  schemas are auto-registered (`entityControllerSchemaOpenApiCustomizer`). **You add nothing
  for inherited operations beyond the steps below.**

### A2. Annotate the model classes `T` (info/response) and `M` (create/mod)

In `gbl/model/...`, mirror what `UserInfo` / `UserMod` / `PasswordChange` do:

- Class level: `@Schema(name = "Institution", description = "...")` for a stable schema name
  (this becomes the generated TS type name).
- Each field: `@Schema(description, example, requiredMode, nullable, format, minLength, maxLength)`.
  These constraints are what the frontend form rules read back (§D3), so fill in
  `min/maxLength`, `format = "email"`, and `requiredMode = REQUIRED` where they matter.
- Identifiers / required fields: `@Schema(requiredMode = Schema.RequiredMode.REQUIRED)` + `@NotNull`.
- Enum collections → `@ArraySchema(schema = @Schema(type = "string", allowableValues = {...}))`
  so they generate a TS string-union, not an opaque object.
- Non-trivial Java types must be pinned to primitives for clean codegen:
  `Locale` / `DateTimeZone` → `type = "string"`; `DateTime` → `type = "string", format = "date-time"`.
- Backend-only getters: `@JsonIgnore` + `@Schema(hidden = true)`.

> **int64 ids.** `Long` ids emit `integer / format: int64`. The frontend fetch script strips
> `format: int64` so both TS and Zod use plain `number` (safe within JS's 53-bit range). You
> do **not** need to annotate ids unless you want string ids in the spec itself.

### A3. Register typed list filters (the one per-domain manual touchpoint)

Add **one entry** to the `ENTITY_FILTER_PARAMETERS` map, keyed by the **response type `T`**,
in `EntityControllerOpenApiCustomizer.java:55`. Copy the `UserInfo` entry:

```java
private static final Map<Class<?>, List<EntityFilterParameter>> ENTITY_FILTER_PARAMETERS = Map.of(
    UserInfo.class, List.of(
        stringFilter(Entity.FILTER_ATTR_NAME, "Filters user accounts by first or full name."),
        stringFilter(UserInfo.FILTER_ATTR_SURNAME, "Filters user accounts by surname."),
        ...
        booleanFilter(Entity.FILTER_ATTR_ACTIVE, "Filters user accounts by active state.")),
    // add your domain here, keyed by its response type:
    Institution.class, List.of(
        stringFilter(Entity.FILTER_ATTR_NAME, "Filters institutions by name."),
        booleanFilter(Entity.FILTER_ATTR_ACTIVE, "Filters institutions by active state.")));
```

Each entry becomes a typed `query` parameter on `getPage`. Without it, the list endpoint
still works and still loses the untyped `filterCriteria` param, but exposes **no** typed
filters. `institutionId` and the paging params are documented by the base `getPage` and
de-duplicated automatically, so don't re-list them.

### A4. Annotate only the hand-written (non-inherited) endpoints

For endpoints declared directly on your controller (custom routes like `/me`, `/supervisors`,
`/password` on `UserAccountController`):

```java
@Operation(operationId = "getInstitutionLogo", summary = "...", description = "...")
@ApiResponses({ @ApiResponse(responseCode = "200", description = "...",
    content = @Content(mediaType = APPLICATION_JSON_VALUE, schema = @Schema(implementation = ...))) })
public ... endpoint(
    @Parameter(hidden = true) final HttpServletRequest request) { ... }
```

- Always set an explicit `operationId` (it becomes the SDK method name).
- Hide infrastructure args with `@Parameter(hidden = true)`.
- Exclude internal endpoints entirely with `@Operation(hidden = true)`.

### A5. Public (unauthenticated) endpoints — two independent edits

`/register` is the worked example (`RegisterUserController`). To make an endpoint public you
must do **both**:

1. **Documentation**: omit `@SecurityRequirement` on the operation/controller so the spec
   shows no security (this is why the generated `registerUserAccount` SDK call has no `security`).
2. **Runtime**: add the path to `.permitAll()` in
   `webservice/weblayer/oauth/resserver/AdminAPIResourceServerConfig.java:55` (alongside
   `API.REGISTER_ENDPOINT`), otherwise the documented-public endpoint still `401`s.

Then on the **frontend** add the endpoint's generated SDK URL to `PUBLIC_PATHS` (§D6).

> Reuse `@Tag(name = "...")` across sibling controllers (as `RegisterUserController` reuses
> `"UserAccount"`) to group them in the spec.

### A6. If you add a new generic base method

If you add a method to `EntityController`/`ActivatableEntityController`, also add it to
`isMappedOperationMethod` (`EntityControllerOpenApiCustomizer.java:~210`) **and**
`inheritedOperationId` (`:231`), or it keeps its generic springdoc id.

No changes to `pom.xml`, springdoc config, the global `OpenAPI` bean, or schema registration
are needed per domain.

---

## Part B — Regenerate the client

With the backend running:

```sh
cd client
npm run openapi:refresh          # fetch spec → strip int64 → regenerate generated/hey-api
```

`openapi:refresh` = `openapi:fetch:seb-server` (writes
`src/api/seb-server/openapi/seb-server.openapi.json`, dropping every `format: int64`) +
`openapi:generate` (runs `@hey-api/openapi-ts` per `openapi-ts.config.ts`). Point at a
non-default backend with `SEB_SERVER_OPENAPI_URL`.

**Commit the spec and the regenerated output together** so the client stays reproducible from
history (see §5). Do not hand-edit anything under `generated/hey-api/`.

---

## Part C — Frontend service (thin glue)

Create `client/src/services/seb-server/<domain>Service.ts`. Reference:
`client/src/services/seb-server/userAccountService.ts`. Rules:

- Import the **generated** SDK functions, zod schemas, and types — never hand-roll URLs or
  models.
- Bind the shared client once: `import { heySebServerClient as client } from ".../heySebServerClient.ts"`.
- Parse **both** the request (body/path/query) **and** the response with the generated `z*`
  schemas. This is the runtime safety net that makes the generated types trustworthy.
- Thread the optional `signal` so TanStack can cancel.

```ts
import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
  getInstitutions as getInstitutionsSdk,
  createInstitution as createInstitutionSdk,
} from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import {
  zGetInstitutionsQuery,
  zGetInstitutionsResponse,
  zCreateInstitutionBody,
  zCreateInstitutionResponse,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import type { GetInstitutionsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";

type RequestOptions = { signal?: AbortSignal };

export const getInstitutions = (
  query?: GetInstitutionsData["query"],
  opts?: RequestOptions,
) =>
  getInstitutionsSdk({
    client,
    query: query ? zGetInstitutionsQuery.parse(query) : undefined,
    signal: opts?.signal,
  }).then(({ data }) => zGetInstitutionsResponse.parse(data));

export const createInstitution = (body: InstitutionCreateRequest) =>
  createInstitutionSdk({
    client,
    body: zCreateInstitutionBody.parse(body),
  }).then(({ data }) => zCreateInstitutionResponse.parse(data));
```

- Type query/path params with the **generated** `GetXxxData["query"]` / `["path"]`, not
  hand-written models.
- `.then(({ data }) => z*.parse(data))` is the canonical idiom. Note `.parse` **throws** on
  contract drift; that surfaces as an error in the composable's `error` ref (acceptable, but
  see §6 "known trade-offs").

---

## Part D — Frontend composables, models, forms

### D1. Thin model aliases (`client/src/models/<domain>.ts`)

Re-export generated types; derive enums from the generated zod so they can't drift. Reference:
`client/src/models/userAccount.ts`.

```ts
import { zInstitution } from "@/api/seb-server/generated/hey-api/zod.gen.ts";
import type {
  Institution as GenInstitution,
  InstitutionMod,
} from "@/api/seb-server/generated/hey-api/types.gen.ts";

export type Institution = GenInstitution;
export type InstitutionCreateRequest = InstitutionMod;
// derive option lists / unions from the schema, never hand-copy them:
// export const SOME_ENUM = zInstitution.shape.someField.options;
```

### D2. TanStack query/mutation composables (`pages/(app)/<domain>/api/use*.ts`)

One file per operation. Reference: `client/src/pages/(app)/user-account/api/*`. Always:

- reads → `useQuery`; writes → `useMutation`;
- keys come from the **generated** helper, bound to the client:
  `getInstitutionsQueryKey({ client: heySebServerClient, query: ... })`;
- expose a normalised error: `computed(() => toAppErrorOrUndefined(result.error.value))`;
- invalidate / `setQueryData` with the **same** generated key after mutations.

```ts
// useInstitutions.ts
import { computed, type Ref } from "vue";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { getInstitutionsQueryKey } from "@/api/seb-server/generated/hey-api/@tanstack/vue-query.gen.ts";
import { heySebServerClient } from "@/api/seb-server/http/heySebServerClient.ts";
import { getInstitutions } from "@/services/seb-server/institutionService.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import type { GetInstitutionsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";

export const useInstitutions = (
  query: Readonly<Ref<GetInstitutionsData["query"]>>,
) => {
  const result = useQuery({
    queryKey: computed(() =>
      getInstitutionsQueryKey({
        client: heySebServerClient,
        query: query.value,
      }),
    ),
    queryFn: ({ signal }) => getInstitutions(query.value, { signal }),
    placeholderData: keepPreviousData,
  });
  return {
    data: result.data,
    isFetching: result.isFetching,
    error: computed(() => toAppErrorOrUndefined(result.error.value)),
    refetch: () => result.refetch(),
  };
};
```

For mutations, invalidate the list key in `onSuccess` and optionally optimistically patch the
cached page (see `useToggleUserAccountStatus.ts` / `useDeleteUserAccount.ts`).

### D3. Form rules from generated zod (`useZodFormRules`)

Drive `required` / length / format from the generated schema instead of hard-coding. Reference:
`client/src/pages/(app)/user-account/composables/useUserAccountFormFields.ts` +
`client/src/composables/useZodFormRules.ts`.

```ts
const { isRequired, lengthRules, formatRules } = useZodFormRules();
// ...
{
    name: "name",
    required: isRequired(zInstitution.shape.name),
    rules: lengthRules(zInstitution.shape.name),
}
```

- **Derive from the schema that is actually submitted.** For a create form, derive from the
  create body schema (`zCreateXxxBody`); for edit/profile, from the entity schema. (UA currently
  reads `zUserInfo` for create fields — they happen to match `zUserMod`, but prefer the body
  schema to avoid latent drift.)
- Cross-field rules (e.g. "passwords match") are necessarily hand-written — that's fine.
- `useZodFormRules` currently unwraps a single optional/default wrapper and reads string
  `min/maxLength` + `email` format. If your domain has array-min or deeper-wrapped constraints,
  extend the helper (loop the unwrap; bail out for arrays) rather than hard-coding.

### D4. Backend field-error mapping + canonical submit path

Wire backend validation errors into form fields with the shared infra. Reference:
`client/src/pages/(app)/user-account/components/UserAccountForm.vue` (the `applyBackendErrors`
function + `USER_ACCOUNT_FIELD_ALIASES`) and the pages that call `submitWithFormErrors`.

- Map backend field names → form field names with a `BackendFieldAliasMap`.
- Apply them with `applyBackendFieldErrors(error, { aliases, forms })`.
- **Submit through `submitWithFormErrors`** — this is the canonical submit path (it runs the
  mutation, applies field errors, and only toasts the genuinely-unhandled messages). Do **not**
  re-inline the old try/catch/notify block that legacy pages still use.

```ts
const saved = await submitWithFormErrors({
  run: () => save(payload),
  applyErrors: (err) => formRef.value?.applyBackendErrors(err),
  error: saveError,
  contextLabel: "institution",
});
if (!saved) return;
```

### D5. Avoid casts after validation

To turn a validated optional ref into a required value without an `as` cast, throw on the
unreachable case (see `requireValidatedField` in `UserAccountForm.vue`). Banned: `as Foo`.

### D6. Public endpoints on the client

If the domain has a public endpoint (no auth), add its **generated SDK URL** to `PUBLIC_PATHS`
in `client/src/api/seb-server/http/heySebServerClient.ts` — use the exact path the SDK emits
(e.g. `"/admin-api/v1/register"`, not `"/register"`), otherwise the default-secure interceptor
forces `seb` auth (and logs the user out when no token exists).

---

## Part E — Pages

Replace the page's legacy `useFetch`/service calls with the new composables. The
overview/list/filters/table-headers/table-actions composables are page-local
(`pages/(app)/<domain>/composables/`). Reference the whole `user-account/` tree. Keep
detail-route helpers returning `undefined` (not `null`).

---

## §5. Verification checklist (before opening a PR)

Run from `client/`:

- [ ] `npm run openapi:refresh` committed (spec + generated output together).
- [ ] **Reproducibility / no hand-edits**: regenerate from the committed spec
      (`npx openapi-ts --file openapi-ts.config.ts`), then confirm
      `git diff --stat src/api/seb-server/generated` is empty.
- [ ] `npx vue-tsc --noEmit` is clean.
- [ ] `npm run lint:check:all` and `npm run prettier:check:all` are clean.
- [ ] Generated identifiers for the domain are **domain-named** (`getInstitutions`, not
      `getPage_1`) and the list query params are **typed** (no `unknown`, no `filterCriteria`).
- [ ] The domain's generated types are real fields, not `unknown` (a few HeyAPI idioms like
      `body?: unknown` are normal).
- [ ] Service parses request **and** response with generated `z*`.
- [ ] Composables use generated query-key helpers and `toAppErrorOrUndefined`.
- [ ] No `as Foo` casts, no `any`, `undefined` not `null` in new code.
- [ ] Manually exercise the flows (list/filter, create, edit, delete, activate, and any public
      endpoint) against a running backend.

---

## §6. Pitfalls learned from the User Account PoC

- **One source of truth for the current user.** The authenticated user lives only in the TanStack
  cache under `currentUserQueryKey`. Read it with `useCurrentUser()` in components/composables
  (reactive) and with the synchronous `getCurrentUser()` accessor in imperative/non-setup code
  (route guards, `ability`, utils). The router guard `fetchQuery`s the key before protected routes
  resolve, so synchronous readers always see a populated value; logout clears it via
  `clearCurrentUser()`. Do **not** add a parallel Pinia store for identity — only auth/token state
  belongs in a store (the earlier `userAccountStore` was removed for exactly this reason).
- **Public-path matching is exact.** The interceptor compares the generated SDK URL; a public
  endpoint must be added to `PUBLIC_PATHS` with its full generated path (§D6).
- **`.parse` throws.** Response parsing turns a backend contract drift into a thrown error. That
  is intentional (fail fast), but if a domain needs to tolerate partial drift, parse with
  `safeParse` at the boundary and normalise instead.
- **Don't over-abstract for one domain, but do reuse what exists.** The error layer
  (`applyBackendFieldErrors`, `submitWithFormErrors`, `useZodFormRules`) is already multi-domain
  — reuse it. Only introduce new shared helpers when a second domain demonstrably repeats code.
- **Don't migrate unrelated domains** to make yours compile. Widen shared infra
  conservatively (e.g. accept `| undefined` additively) rather than flipping every legacy
  consumer.

---

## Reference files

**Backend (`seb-server`, branch `OpenAPI-HeyAPI-CodeGen`)**

- `webservice/weblayer/api/EntityControllerOpenApiCustomizer.java` — operationId remap, filter
  registry (`:55`), create body/response synthesis, schema registration.
- `webservice/weblayer/api/UserAccountController.java`, `RegisterUserController.java` — controller,
  hand-written, and public-endpoint annotations.
- `webservice/weblayer/oauth/resserver/AdminAPIResourceServerConfig.java:55` — `permitAll` for
  public endpoints.
- `gbl/model/user/{UserInfo,UserMod,PasswordChange}.java` — model `@Schema` annotations.

**Frontend (`seb-server-gui`)**

- `client/src/api/seb-server/http/heySebServerClient.ts`, `openapi-ts.config.ts`,
  `scripts/fetch-seb-server-openapi.mjs`, `client/src/api/seb-server/README.md`.
- `client/src/services/seb-server/userAccountService.ts`.
- `client/src/pages/(app)/user-account/` (api, composables, components, pages).
- `client/src/composables/useZodFormRules.ts`, `useCurrentUser.ts`.
- `client/src/services/errors/{toAppError,formErrorMapping,submitWithFormErrors}.ts`,
  `client/src/services/http/configureApiAxios.ts`.
