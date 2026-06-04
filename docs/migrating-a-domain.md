# Migrating a domain to the OpenAPI / HeyAPI stack

This is the step-by-step recipe for migrating one backend domain (e.g. _Institution_,
_Exam_) onto the generated **HeyAPI** stack. For the *why* behind the architecture — the
deadline constraints, the "imperfect backend", and the frontend DTO boundary — read the
decision record first: [`client/directive/heyapi-migration-strategy.md`](../client/directive/heyapi-migration-strategy.md).

The short version: the backend OpenAPI document is the source of the **generated** client
(types, SDK, Zod, TanStack keys), but the generated models are **fat and backend-shaped**.
We don't let them leak into the app. Per domain we build a **two-file anti-corruption
boundary** — `src/models/<domain>.ts` (narrow Zod schemas cherry-picked from the generated
Zod, app types inferred from them) and `src/services/seb-server/<domain>Service.ts` (the
bridge) — and everything above it imports only from the model file.

The migration touches **two repositories**:

| Repo                         | What changes                                                                                                            |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `seb-server` (backend)       | OpenAPI annotations + one central customizer entry so the spec describes the domain cleanly. No business-logic changes. |
| `seb-server-gui` (this repo) | Regenerated client, a thin service (decode/encode bridge), TanStack composables, narrow model schemas, zod-derived form rules, page wiring. |

**User Account** is the reference domain. Migrate **one domain at a time** — the legacy
`apiService`/`useFetch` flow keeps serving every non-migrated domain in parallel.

> **Reference status.** User Account is the worked reference end-to-end: its model
> ([`client/src/models/userAccount.ts`](../client/src/models/userAccount.ts)) cherry-picks
> narrow schemas from the generated zod and its service
> ([`userAccountService.ts`](../client/src/services/seb-server/userAccountService.ts))
> `z.decode`s/`z.encode`s across the SDK, on top of the shared plumbing (clients, TanStack
> Query, error/form-error layer, current-user-via-cache, zod form rules). User Account needs
> no codecs (its fields round-trip as wire types); for the **codec** style specifically
> (bidirectional wire⇄app conversion), see
> [`client/src/models/seb-server/examTemplate.ts`](../client/src/models/seb-server/examTemplate.ts)
> and [`examTemplateService.ts`](../client/src/services/seb-server/examTemplateService.ts).
> Caveat: exam-template is **not** HeyAPI-migrated — it still uses the legacy `apiService`
> client and hand-declares its schemas. Copy only the `z.codec`/`z.decode`/`z.encode` idiom
> from it; take the SDK + `heySebServerClient` plumbing and the pick-from-generated-zod model
> from User Account.

---

## 0. Mental model

- There are **two HTTP clients**, sharing the same Axios behaviour on purpose:
  - Legacy: `client/src/services/apiService.ts` (used by non-migrated domains).
  - HeyAPI: `client/src/api/seb-server/http/heySebServerClient.ts` (migrated domains).
  - Both are built by `client/src/services/http/configureApiAxios.ts`, so they share base
    URL, token attach/refresh, `401 → logout`, `toAppError` normalisation, transport-error
    toast de-duplication, and the `_authType` / `_skipErrorToast` request flags.
- The HeyAPI client additionally threads TanStack's `AbortSignal` into the SDK, so
  in-flight requests are really cancelled.
- **Generated code is never hand-edited; generated _models_ never leak above the
  model/service boundary.** It lives only under `client/src/api/seb-server/generated/hey-api/`
  and is reproducible from the committed spec (see §5). The only generated artifacts used
  above that boundary are request-side (TanStack query keys, `GetXxxData` query/path param
  types) and the shared `APIMessage` schema parsed in the error layer (see §D2).

```
backend @Schema/@Operation annotations
        │  (npm run openapi:refresh)
        ▼
generated/hey-api/{types,sdk,zod,@tanstack/vue-query}.gen.ts   ← fat, never edited
        │
src/models/<domain>.ts          ← narrow Zod cherry-picked from generated zod (+ codecs);
        │                          app types INFERRED. The would-be DTO.
        ▼
services/seb-server/<domain>Service.ts   ← SDK call + z.decode() responses / z.encode()
        │                                    inputs + AbortSignal. The fat↔narrow bridge.
        ▼
pages/(app)/<domain>/api/use*.ts          ← TanStack useQuery/useMutation + generated keys
        │
pages/(app)/<domain>/composables + components ← form rules from the narrow schema, wiring
```

---

## Part A — Backend (`seb-server`, branch `OpenAPI-HeyAPI-CodeGen`)

Goal: make the generated identifiers and types **useful**, and make the generated Zod carry
as many constraints as possible (so the frontend has to adjust as little as possible).

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
  `min/maxLength`, `format = "email"`, and `requiredMode = REQUIRED` where they matter. **The
  richer this is, the less the frontend has to adjust.**
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

We regenerate the **whole** spec (every domain). That's expected — we only *consume* the
domains we've migrated. **Commit the spec and the regenerated output together** so the
client stays reproducible from history (see §5). Do not hand-edit anything under
`generated/hey-api/`.

---

## Part C — Model boundary + service (the two hand-written files)

This is where the migration earns its keep. See
[`heyapi-migration-strategy.md`](../client/directive/heyapi-migration-strategy.md) §4 for the
rationale.

### C1. The narrow model (`client/src/models/<domain>.ts`)

Cherry-pick narrow schemas **from the generated Zod**, infer the app types, and use **codecs**
for any wire⇄app type mismatch.

> Migrated HeyAPI-derived models go at the root `client/src/models/<domain>.ts` (where
> `userAccount.ts` lives). Legacy hand-written models stay under `client/src/models/seb-server/`
> until they are migrated — don't follow that location for new work.

```ts
import { z } from "zod";
import {
  zInstitution,        // fat read schema, generated
  zInstitutionMod,     // fat create/mod body schema, generated
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";

// read model: select the fields the app actually uses (drop audit/privilege noise).
export const institutionSchema = zInstitution.pick({
  id: true, name: true, urlSuffix: true, active: true,
});
export type Institution = z.infer<typeof institutionSchema>;

// create/mod model: a pick of the generated body schema that KEEPS every backend-required
// field (so the encoded value stays assignable to the SDK body — no cast). Drop only the
// optional/irrelevant ones.
export const institutionCreateSchema = zInstitutionMod.pick({
  name: true, urlSuffix: true,
});
export type InstitutionCreateRequest = z.infer<typeof institutionCreateSchema>;

// enums stay DERIVED from the schema so they cannot drift:
// export const SOME_ENUM = institutionSchema.shape.someField.options;     // z.enum
// export const SOME_ENUM = institutionSchema.shape.list.element.options;  // z.array(z.enum)
```

Rules:

- **Pick, don't re-declare.** Field rules (`min`/`max`, `email`, enums) must come from the
  generated schema, so backend annotation improvements flow through for free.
- **Narrow the field set**, and narrow enums to the values actually used (as
  `examTemplate.ts` narrows the indicator enum).
- **Codecs for type adjustment**, modelled on `examTemplate.ts`'s `colorCodec`. Use a
  `z.codec(apiSchema, appSchema, { decode, encode })` when the wire form is awkward (e.g. a
  `date-time` string you want as a `Date`, a colour without `#`). The codec owns *both*
  directions; `z.infer` is the app (decoded) type. Overlay it with `.extend({ field: codec })`
  on the picked schema.
- **Compose variants with `.extend()`** (e.g. a base schema → an `…Existing` schema that adds
  the persisted `id`), as `examTemplate.ts` does (`indicatorSchema → indicatorExistingSchema`).
- Prefer fixing a mismatch with **backend annotations** before reaching for a codec.

### C2. The service (`client/src/services/seb-server/<domain>Service.ts`)

The service binds the shared client, calls the generated SDK, and bridges fat↔narrow with
`z.decode` (read) / `z.encode` (write).

```ts
import { z } from "zod";
import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import {
  getInstitutions as getInstitutionsSdk,
  createInstitution as createInstitutionSdk,
} from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import {
  institutionSchema,
  institutionCreateSchema,
  type InstitutionCreateRequest,
} from "@/models/institution.ts";
import type { GetInstitutionsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";

type RequestOptions = { signal?: AbortSignal };

export const getInstitutions = (
  query?: GetInstitutionsData["query"],
  opts?: RequestOptions,
) =>
  getInstitutionsSdk({ client, query, signal: opts?.signal }).then(({ data }) =>
    // decode each row into the narrow model: validates used fields, strips the fat extras.
    (data?.content ?? []).map((row) => z.decode(institutionSchema, row)),
  );

export const createInstitution = (body: InstitutionCreateRequest) =>
  createInstitutionSdk({
    client,
    // encode the narrow input back to the wire shape; assignable to the SDK body (no cast).
    body: z.encode(institutionCreateSchema, body),
  }).then(({ data }) => z.decode(institutionSchema, data));
```

- **Reads → `z.decode(<schema>, data)`.** Because `z.object` strips unknown keys, decoding a
  picked subset both validates and narrows. For a page response, map `z.decode` over
  `content` (and return whatever paging shape the composable needs).
- **Writes → `z.encode(<createSchema>, input)`.** Produces the wire shape (runs codec
  `encode` directions). The result is assignable to the SDK's fat body because the create
  schema keeps all required fields.
- **Type query/path params with the generated `GetXxxData["query"]` / `["path"]`** — those
  are request-side and stay generated (they're not domain models).
- Decode/encode **throw** on contract drift in fields you use — fail-fast, intentional. If a
  domain must tolerate partial drift, `safeParse`/`safeDecode` at the boundary and normalise.
- Thread the optional `signal` so TanStack can cancel.

---

## Part D — Frontend composables, forms

### D1. (See Part C.) Models live in `client/src/models/<domain>.ts`.

Above the service, **import only from the model file** — never from `generated/hey-api/`.

### D2. TanStack query/mutation composables (`pages/(app)/<domain>/api/use*.ts`)

One file per operation. Reference: `client/src/pages/(app)/user-account/api/*`. Always:

- reads → `useQuery`; writes → `useMutation`;
- keys come from the **generated** helper, bound to the client (keys are request-side, so
  they're unaffected by model narrowing):
  `getInstitutionsQueryKey({ client: heySebServerClient, query: ... })`;
- the `queryFn`/`mutationFn` calls the **service** (which returns the narrow model);
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
      getInstitutionsQueryKey({ client: heySebServerClient, query: query.value }),
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

### D3. Form rules from the narrow schema (`useZodFormRules`)

Drive `required` / length / format from the **narrow model schema's `.shape`**, not from
hard-coded rules and not from the fat generated schema. Reference:
`client/src/pages/(app)/user-account/composables/useUserAccountFormFields.ts` +
`client/src/composables/useZodFormRules.ts`.

```ts
const { isRequired, lengthRules, formatRules } = useZodFormRules();
// derive from the schema that is actually SUBMITTED:
//   create form → the narrow create schema (institutionCreateSchema)
//   edit/profile → the narrow entity schema (institutionSchema)
{
    name: "name",
    required: isRequired(institutionCreateSchema.shape.name),
    rules: lengthRules(institutionCreateSchema.shape.name),
}
```

- Because the narrow schema is a `pick` of the generated one, the constraints are intact.
- Cross-field rules (e.g. "passwords match") are hand-written — that's fine.
- `useZodFormRules` currently unwraps a single optional/default wrapper and reads string
  `min/maxLength` + `email` format. For a **codec**-wrapped field, read rules off the codec's
  inner (encoded) schema or hand-write them; extend the helper rather than hard-coding if a
  domain needs deeper unwrapping or array-min.

### D4. Backend field-error mapping + canonical submit path

Wire backend validation errors into form fields with the shared infra. Reference:
`client/src/pages/(app)/user-account/components/UserAccountForm.vue` (the `applyBackendErrors`
function + `USER_ACCOUNT_FIELD_ALIASES`) and the pages that call `submitWithFormErrors`.

- Map backend field names → form field names with a `BackendFieldAliasMap` (e.g.
  `timeZone → timezone`, `userRoles → role`).
- Apply them with `applyBackendFieldErrors(error, { aliases, forms })`.
- **Submit through `submitWithFormErrors`** — the canonical submit path (it runs the
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

### D5. No casts — codecs and validated narrowing instead

Banned: `as Foo`, `any`. The boundary is designed to make casts unnecessary:

- wire⇄app type differences → **codecs** (§C1);
- "validated optional → required value" → throw on the unreachable case (see
  `requireValidatedField` in `UserAccountForm.vue`);
- a narrow create schema that keeps all required fields stays **assignable** to the SDK body,
  so the encoded value needs no cast.

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
      (`npm run openapi:generate:hey-api`), then confirm
      `git diff --stat src/api/seb-server/generated` is empty.
- [ ] **Boundary respected**: nothing outside `src/models/<domain>.ts` and
      `<domain>Service.ts` imports from `generated/hey-api/` (grep the diff).
- [ ] Model schemas are **picked from the generated zod** (not re-declared by hand); enums
      are **derived** from the schema; type adjustments use **codecs**, not casts.
- [ ] Service **`z.decode`s** responses into the narrow model and **`z.encode`s** inputs back;
      `z.encode(createSchema, …)` is assignable to the SDK body with no cast.
- [ ] `npx vue-tsc --noEmit` is clean.
- [ ] `npm run lint:check:all` and `npm run prettier:check:all` are clean.
- [ ] Generated identifiers for the domain are **domain-named** (`getInstitutions`, not
      `getPage_1`) and the list query params are **typed** (no `unknown`, no `filterCriteria`).
- [ ] No `as Foo` casts, no `any`, `undefined` not `null` in new code.
- [ ] Manually exercise the flows (list/filter, create, edit, delete, activate, and any public
      endpoint) against a running backend.

---

## §6. Pitfalls learned from the User Account PoC

- **Don't let the fat model leak.** The whole point of the boundary is that composables,
  components and pages see only the narrow model. If you find yourself importing `UserInfo`
  from `generated/` in a page, the model file is missing a field.
- **Keep all backend-required fields in the create/mod pick**, or the encoded body stops
  being assignable to the SDK and you'll be tempted to cast. Drop only optional/irrelevant
  fields.
- **One source of truth for the current user.** The authenticated user lives only in the
  TanStack cache under `currentUserQueryKey`. Read it with `useCurrentUser()` (reactive) and
  with `getCurrentUser()` in imperative/non-setup code (route guards, `ability`, utils). The
  router guard `fetchQuery`s the key before protected routes resolve; logout clears it via
  `clearCurrentUser()`. Do **not** add a parallel Pinia store for identity — only auth/token
  state belongs in a store (the earlier `userAccountStore` was removed for exactly this reason).
- **Public-path matching is exact.** The interceptor compares the generated SDK URL; a public
  endpoint must be added to `PUBLIC_PATHS` with its full generated path (§D6).
- **`z.decode`/`z.encode` throw on drift** in fields you use (fail-fast, intentional). Drift in
  fields you *didn't* pick is silently stripped — a feature, given the imperfect backend. If a
  domain must tolerate drift in a used field, switch that boundary to the safe variant and
  normalise.
- **Annotate the backend first.** Reach for a frontend codec only when you can't fix the
  representation at the source. Every constraint you add to a backend `@Schema` is one the
  frontend gets for free.
- **Don't over-abstract for one domain, but reuse what exists.** The error layer
  (`applyBackendFieldErrors`, `submitWithFormErrors`, `useZodFormRules`) is multi-domain —
  reuse it. Only introduce new shared helpers when a second domain demonstrably repeats code.
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

- Strategy / why: `client/directive/heyapi-migration-strategy.md`.
- Schema + codec style: `client/src/models/seb-server/examTemplate.ts`,
  `client/src/services/seb-server/examTemplateService.ts` (`z.codec` / `z.decode` / `z.encode`).
- Pipeline: `client/openapi-ts.config.ts`, `client/scripts/fetch-seb-server-openapi.mjs`,
  `client/src/api/seb-server/http/heySebServerClient.ts`, `client/src/api/seb-server/README.md`.
- Plumbing reference: `client/src/pages/(app)/user-account/` (api, composables, components,
  pages), `client/src/composables/{useZodFormRules,useCurrentUser}.ts`,
  `client/src/services/errors/{toAppError,formErrorMapping,submitWithFormErrors}.ts`,
  `client/src/services/http/configureApiAxios.ts`.
