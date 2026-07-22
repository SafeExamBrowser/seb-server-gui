import type { Page, Route } from "@playwright/test";

// A fully mocked SEB Server backend: auth, session bootstrap and the list /
// detail reads of every domain are served from in-memory data, so the suite
// runs hermetically against the dev server alone. Spec-level page.route
// handlers are registered AFTER these and therefore win (Playwright matches
// routes in reverse registration order); handlers that route.fallback() on
// non-matching methods drop through to the routes below.

export const MOCK_USERNAME = "testmain";
export const MOCK_PASSWORD = "testmain";

const TOKEN_RESPONSE = {
    access_token: "e2e-mock-access-token",
    refresh_token: "e2e-mock-refresh-token",
    // seconds; large enough that no token refresh fires mid-test
    expires_in: 3600,
};

export const MOCK_CURRENT_USER = {
    uuid: "test-main",
    institutionId: 11,
    creationDate: "2019-01-01T00:00:00.000Z",
    name: "Test",
    surname: "Main",
    username: MOCK_USERNAME,
    email: "test-main@main.nomail",
    active: true,
    directLogin: true,
    localAccount: true,
    language: "en",
    timezone: "UTC",
    userRoles: [
        "SEB_SERVER_ADMIN",
        "INSTITUTIONAL_ADMIN",
        "EXAM_ADMIN",
        "EXAM_SUPPORTER",
        "TEACHER",
    ],
};

const GUI_ABILITIES = {
    components: [
        "NAVIGATION_OVERVIEW",
        "HOME",
        "SETTINGS",
        "INSTITUTIONS",
        "USER_ACCOUNTS",
        "CONNECTION_CONFIGS",
        "LMS_SETUPS",
        "CERTIFICATES",
        "EXAM_TEMPLATE",
        "PREPARE_EXAM",
        "ADD_EXAM_WITH_URL",
        "EXAMS",
        "RUNNING_EXAMS",
        "SCREEN_PROCTORING",
        "SCREEN_PROCTORING_SEARCH",
        "SCREEN_PROCTORING_APPLICATION_SEARCH",
        "ANALYZE_EXAMS",
        "ARCHIVE_EXAMS",
        "SCHEDULED_DELETION",
    ],
    actions: [
        "EDIT_EXAM_SETTINGS",
        "ARCHIVE_EXAM",
        "DELETE_EXAM",
        "APPLY_TEST_RUN",
        "DISABLE_TEST_RUN",
        "EXPORT_EXAM_CLIENT_CONFIG",
        "VIEW_ASK_SETTINGS",
        "EDIT_ASK_SETTINGS",
        "EDIT_SCREEN_PROCTORING",
        "EDIT_SEB_SETTINGS",
        "EDIT_FULL_SEB_SETTINGS",
        "EDIT_SUPERVISORS",
        "EDIT_INDICATORS",
        "EDIT_CLIENT_GROUPS",
        "APPLY_SEB_RESTRICTION",
        "SHOW_MONITORING",
        "SHOW_FINISHED_EXAM_DATA",
        "EXCLUDE_FROM_DELETION",
    ],
};

// Mirrors the seb-server e2e Flyway seed (V200): institutions 11-13.
const INSTITUTIONS = [
    { id: 11, name: "SEB Server", urlSuffix: "sebserv", active: true },
    { id: 12, name: "Test Institution", urlSuffix: "testinst", active: false },
    { id: 13, name: "ETHZ", urlSuffix: "ethz", active: true },
];

const INSTITUTION_NAMES = INSTITUTIONS.map((institution) => ({
    modelId: String(institution.id),
    name: institution.name,
}));

// Mirrors the V240 assessment-tool seed rows the 05 specs reference.
const LMS_SETUPS = [true, false, false, false, false, true].map(
    (active, index) => ({
        id: 9101 + index,
        institutionId: 11,
        name: `e2e-getall-assessment-tool-${String(index + 1).padStart(2, "0")}`,
        lmsType: "MOCKUP",
        lmsUrl: "https://mockup.example",
        lmsClientname: "mockup-client",
        lmsClientsecret: "",
        lmsRestApiToken: "e2e-rest-api-token",
        active,
        updateTime: 0,
        connectionId: `e2e-conn-${9101 + index}`,
        integrationActive: false,
    }),
);

// Mirrors the V230 connection-configuration seed rows (ids 9001-9006).
const CLIENT_CONFIGURATIONS = [true, false, true, true, true, true].map(
    (active, index) => ({
        id: 9001 + index,
        institutionId: 11,
        name: `e2e-getall-connection-config-${String(index + 1).padStart(2, "0")}`,
        sebConfigPurpose: "START_EXAM",
        sebServerPingTime: 1000,
        vdiSetup: "NO",
        sebServerFallback: false,
        date: "2026-06-30T08:21:13.000Z",
        cert_encryption_asym: false,
        active,
        lastUpdateTime: "2026-03-09T15:39:26.921Z",
        lastUpdateUser: "test-main",
        exam_selection: [],
    }),
);

// Mirrors the V200 per-browser user rows plus fillers so the paging and
// items-per-page steps of the read template have something to page over.
function userAccountRows(browser: string) {
    const getAll = (kind: "active" | "inactive") => ({
        uuid: `seb-user-account-getall-${kind}-${browser}`,
        institutionId: 11,
        creationDate: "2019-01-01T00:00:00.000Z",
        name: "Institutional",
        surname: `000-testgetall-${browser}`,
        username: `getall-${kind}-${browser}`,
        email: `getall-${kind}-${browser}@nomail.nomail`,
        active: kind === "active",
        directLogin: true,
        localAccount: true,
        language: "en",
        timezone: "UTC",
        userRoles: ["EXAM_SUPPORTER"],
    });

    const fillers = Array.from({ length: 10 }, (_, i) => {
        const n = String(i + 1).padStart(2, "0");
        return {
            uuid: `seb-user-filler-${n}`,
            institutionId: 11,
            creationDate: "2019-01-01T00:00:00.000Z",
            name: "Filler",
            surname: `zzz-filler-${n}`,
            username: `filler-${n}`,
            email: `filler-${n}@nomail.nomail`,
            active: true,
            directLogin: true,
            localAccount: true,
            language: "en",
            timezone: "UTC",
            userRoles: ["EXAM_SUPPORTER"],
        };
    });

    return [
        MOCK_CURRENT_USER,
        getAll("active"),
        getAll("inactive"),
        ...fillers,
    ];
}

type Row = Record<string, unknown>;

function textContains(row: Row, field: string, value: string | null) {
    if (!value) {
        return true;
    }
    const cell = row[field];
    return (
        typeof cell === "string" &&
        cell.toLowerCase().includes(value.toLowerCase())
    );
}

function matchesActive(row: Row, value: string | null) {
    if (value !== "true" && value !== "false") {
        return true;
    }
    return row.active === (value === "true");
}

function matchesInstitution(row: Row, value: string | null) {
    if (!value) {
        return true;
    }
    return String(row.institutionId) === value;
}

// Reproduces the backend's paged-list semantics: text params are
// case-insensitive contains-filters, `active` and `institutionId` are exact,
// `sort`/`-sort` order by field, `page_number`/`page_size` slice the result.
function pagedEnvelope(
    rows: Row[],
    url: URL,
    textFilterFields: string[],
): Row[] | object {
    const params = url.searchParams;

    let filtered = rows.filter(
        (row) =>
            textFilterFields.every((field) =>
                textContains(row, field, params.get(field)),
            ) &&
            matchesActive(row, params.get("active")) &&
            matchesInstitution(row, params.get("institutionId")),
    );

    const sort = params.get("sort");
    if (sort) {
        const key = sort.startsWith("-") ? sort.slice(1) : sort;
        filtered = [...filtered].sort((a, b) =>
            String(a[key] ?? "").localeCompare(String(b[key] ?? "")),
        );
        if (sort.startsWith("-")) {
            filtered.reverse();
        }
    }

    const pageSize = Number(params.get("page_size") ?? 10);
    const pageNumber = Number(params.get("page_number") ?? 1);
    const start = (pageNumber - 1) * pageSize;

    return {
        number_of_pages: Math.max(1, Math.ceil(filtered.length / pageSize)),
        page_number: pageNumber,
        page_size: pageSize,
        sort: sort ?? undefined,
        complete: true,
        content: filtered.slice(start, start + pageSize),
    };
}

function json(route: Route, body: unknown, status = 200) {
    return route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(body),
    });
}

function getOnly(
    handler: (route: Route, url: URL) => Promise<void> | void,
): (route: Route) => Promise<void> | void {
    return (route) => {
        if (route.request().method() !== "GET") {
            return route.fallback();
        }
        return handler(route, new URL(route.request().url()));
    };
}

export async function installMockBackend(page: Page, browser: string) {
    // Registered first, so it is the LAST resort after every other route:
    // anything under /api/ that nothing else served answers with an empty
    // object instead of reaching a real backend.
    await page.route(/:\/\/[^/]+\/api\//, (route) => json(route, {}));

    // --- auth ---------------------------------------------------------------
    await page.route(/\/api(?:\/sps)?\/oauth\/token(?:$|\?)/, (route) => {
        const body = new URLSearchParams(route.request().postData() ?? "");
        const grantType = body.get("grant_type");
        if (grantType === "refresh_token") {
            return json(route, TOKEN_RESPONSE);
        }
        if (
            grantType === "password" &&
            body.get("username") === MOCK_USERNAME &&
            body.get("password") === MOCK_PASSWORD
        ) {
            return json(route, TOKEN_RESPONSE);
        }
        return json(route, { error: "invalid_grant" }, 401);
    });

    await page.route(/\/api(?:\/sps)?\/useraccount\/logout(?:$|\?)/, (route) =>
        json(route, {}),
    );

    // --- session bootstrap ---------------------------------------------------
    await page.route(
        /\/api\/admin-api\/v1\/useraccount\/me\/gui-abilities(?:$|\?)/,
        getOnly((route) => json(route, GUI_ABILITIES)),
    );

    await page.route(
        /\/api\/admin-api\/v1\/useraccount\/me(?:$|\?)/,
        getOnly((route) => json(route, MOCK_CURRENT_USER)),
    );

    // --- institutions ---------------------------------------------------------
    await page.route(/\/api\/info\/institution(?:$|\?)/, (route) =>
        json(route, INSTITUTION_NAMES),
    );

    await page.route(
        /\/api\/admin-api\/v1\/institution\/\d+(?:$|\?)/,
        getOnly((route, url) => {
            const id = Number(url.pathname.split("/").pop());
            const institution =
                INSTITUTIONS.find((candidate) => candidate.id === id) ??
                INSTITUTIONS[0];
            return json(route, institution);
        }),
    );

    await page.route(
        /\/api\/admin-api\/v1\/institution(?:$|\?)/,
        getOnly((route, url) =>
            json(route, pagedEnvelope(INSTITUTIONS, url, ["name"])),
        ),
    );

    // --- user accounts ---------------------------------------------------------
    const users = userAccountRows(browser);

    await page.route(
        /\/api\/admin-api\/v1\/useraccount(?:$|\?)/,
        getOnly((route, url) =>
            json(
                route,
                pagedEnvelope(users, url, ["surname", "name", "username"]),
            ),
        ),
    );

    await page.route(
        /\/api\/admin-api\/v1\/useraccount\/(?!me(?:$|\/|\?)|password(?:$|\?)|supervisors(?:$|\?)|register(?:$|\?))[^/?]+(?:$|\?)/,
        getOnly((route, url) => {
            const uuid = decodeURIComponent(
                url.pathname.split("/").pop() ?? "",
            );
            const user = users.find((candidate) => candidate.uuid === uuid);
            if (!user) {
                return json(route, {}, 404);
            }
            return json(route, user);
        }),
    );

    // --- assessment tools (lms-setup) -------------------------------------------
    await page.route(
        /\/api\/admin-api\/v1\/lms-setup(?:$|\?)/,
        getOnly((route, url) =>
            json(route, pagedEnvelope(LMS_SETUPS, url, ["name"])),
        ),
    );

    await page.route(
        /\/api\/admin-api\/v1\/lms-setup\/\d+(?:$|\?)/,
        getOnly((route, url) => {
            const id = Number(url.pathname.split("/").pop());
            const setup = LMS_SETUPS.find((candidate) => candidate.id === id);
            if (!setup) {
                return json(route, {}, 404);
            }
            return json(route, setup);
        }),
    );

    // --- connection configurations (client_configuration) ----------------------
    await page.route(
        /\/api\/admin-api\/v1\/client_configuration(?:$|\?)/,
        getOnly((route, url) =>
            json(route, pagedEnvelope(CLIENT_CONFIGURATIONS, url, ["name"])),
        ),
    );

    await page.route(
        /\/api\/admin-api\/v1\/client_configuration\/\d+(?:$|\?)/,
        getOnly((route, url) => {
            const id = Number(url.pathname.split("/").pop());
            const configuration = CLIENT_CONFIGURATIONS.find(
                (candidate) => candidate.id === id,
            );
            if (!configuration) {
                return json(route, {}, 404);
            }
            return json(route, configuration);
        }),
    );

    // --- certificates (empty default; certificate specs mock their own list, this
    // also feeds the encryption-certificate dropdown on the connection-config form)
    await page.route(
        /\/api\/admin-api\/v1\/certificate(?:$|\?)/,
        getOnly((route, url) => json(route, pagedEnvelope([], url, ["alias"]))),
    );
}
