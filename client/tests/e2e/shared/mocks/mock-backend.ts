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
        "EDIT_INSTITUTION",
        "CREATE_INSTITUTION",
        "USER_ACCOUNTS",
        "EDIT_USER_ACCOUNT",
        "CREATE_USER_ACCOUNT",
        "CONNECTION_CONFIGURATIONS",
        "EDIT_CONNECTION_CONFIGURATION",
        "CREATE_CONNECTION_CONFIGURATION",
        "ASSESSMENT_TOOLS",
        "EDIT_ASSESSMENT_TOOL",
        "CREATE_ASSESSMENT_TOOL",
        "CERTIFICATES",
        "EXAM_TEMPLATES",
        "CREATE_EXAM_TEMPLATE",
        "EXAM_TEMPLATE_DETAIL",
        "EXAMS",
        "ADD_EXAM_WITH_URL",
        "CREATE_EXAM_WIZARD",
        "EXAM_DETAIL",
        "PROFILE",
        "MONITORING",
        "MONITORING_DETAIL",
        "MONITORING_CLIENTS",
        "MONITORING_CLIENT_DETAIL",
        "SCREEN_PROCTORING_APPLICATION_SEARCH",
        "GALLERY",
        "SCREEN_PROCTORING_RECORDING",
        "SCREEN_PROCTORING_SEARCH",
        "ANALYZE_EXAMS",
        "ARCHIVE_EXAMS",
        "SCHEDULED_DELETIONS",
        "CREATE_SCHEDULED_DELETION",
        "SCHEDULED_DELETION_REPORT",
    ],
    actions: [
        "SHOW_INSTITUTION_COLUMN",
        "OFFER_SERVER_ADMIN_ROLE",
        "CHOOSE_INSTITUTION",
        "EXCLUDE_FROM_DELETION",
        "EDIT_FULL_SEB_SETTINGS",
        "EDIT_RESTRICTED_SEB_SETTINGS",
        "EDIT_BASIC_SETTINGS",
        "EDIT_SCREEN_PROCTORING",
        "EDIT_SEB_KEYS",
        "EDIT_SUPERVISORS",
        "EDIT_CLIENT_GROUPS",
        "APPLY_DISABLE_TEST_RUN",
        "APPLY_SEB_LOCK",
        "DOWNLOAD_EXAM_CONNECTION",
        "DELETE_EXAM",
        "EDIT_PROFILE_FIELDS",
        "CHANGE_OWN_PASSWORD",
        "QUIT_ALL_CLIENTS",
        "QUIT_CLIENTS",
        "EDIT_INDICATORS",
        "SHOW_FINISHED_EXAM_DATA",
    ],
};

// Mirrors the seb-server e2e Flyway seed (V200): institutions 11-13.
const INSTITUTIONS = [
    { id: 11, name: "SEB Server", active: true },
    { id: 12, name: "Test Institution", active: false },
    { id: 13, name: "ETHZ", active: true },
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

// No spec reads exam templates directly; they exist so the exam-wizard
// prerequisite is satisfied and the Exams list "Prepare" button stays enabled.
const EXAM_TEMPLATE_NAMES = [9201, 9202].map((id) => ({
    modelId: String(id),
    entityType: "EXAM_TEMPLATE",
    name: `e2e-exam-template-${id}`,
}));

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

// e2e-authored fixture rows for the 06-exam/07-monitoring/08-analyze/09-archive
// specs (no upstream Flyway seed to mirror here: exam/monitoring/analyze/
// archive have no dedicated *ListConfig.ts and instead hit `/exam` and
// `/monitoring` directly, see examService.ts / monitoringService.ts).
const EXAMS = [
    {
        id: 9201,
        institutionId: 11,
        quizName: "e2e-getall-exam-01",
        quizStartTime: "2026-01-10T08:00:00.000Z",
        quizEndTime: "2026-01-10T10:00:00.000Z",
        type: "BYOD",
        status: "UP_COMING",
        excludeFromDeletion: false,
    },
    {
        id: 9202,
        institutionId: 11,
        quizName: "e2e-getall-exam-02",
        quizStartTime: "2026-01-11T08:00:00.000Z",
        quizEndTime: "2026-01-11T10:00:00.000Z",
        type: "MANAGED",
        status: "TEST_RUN",
        excludeFromDeletion: false,
    },
    {
        id: 9203,
        institutionId: 11,
        quizName: "e2e-getall-exam-03",
        quizStartTime: "2026-01-12T08:00:00.000Z",
        quizEndTime: "2026-01-12T10:00:00.000Z",
        type: "VDI",
        status: "RUNNING",
        excludeFromDeletion: false,
    },
    {
        id: 9204,
        institutionId: 11,
        quizName: "e2e-getall-exam-04",
        quizStartTime: "2026-01-13T08:00:00.000Z",
        quizEndTime: "2026-01-13T10:00:00.000Z",
        type: "BYOD",
        status: "FINISHED",
        excludeFromDeletion: false,
        additionalAttributes: { enableScreenProctoring: "true" },
    },
    {
        id: 9205,
        institutionId: 11,
        quizName: "e2e-getall-exam-05",
        quizStartTime: "2026-01-14T08:00:00.000Z",
        quizEndTime: "2026-01-14T10:00:00.000Z",
        type: "MANAGED",
        status: "ARCHIVED",
        excludeFromDeletion: true,
    },
    {
        id: 9206,
        institutionId: 11,
        quizName: "e2e-getall-exam-06",
        quizStartTime: "2026-01-15T08:00:00.000Z",
        quizEndTime: "2026-01-15T10:00:00.000Z",
        type: "UNDEFINED",
        status: "FINISHED",
        excludeFromDeletion: false,
    },
];

// getExamsForAnalysis hits a dedicated `/monitoring/finishedexams` resource
// that only ever contains finished/archived exams, regardless of the
// `status` query param (which just narrows further within that set).
const FINISHED_EXAMS = EXAMS.filter(
    (row) => row.status === "FINISHED" || row.status === "ARCHIVED",
);

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

// The exam family (exam/monitoring/analyze/archive) filters on a comma-list
// param (e.g. `status=RUNNING,TEST_RUN` from a multi-select or the callers'
// hard-coded defaults), so a row matches if its field is any of the values.
function matchesCommaList(row: Row, field: string, value: string | null) {
    if (!value) {
        return true;
    }
    return value.split(",").includes(String(row[field]));
}

// Same shape as pagedEnvelope but for the exam family: the text filter is
// always `quizName`, and `status`/`type` are comma-list filters instead of
// the institution family's exact `active`/`institutionId` filters.
function pagedExamEnvelope(rows: Row[], url: URL): Row[] | object {
    const params = url.searchParams;

    let filtered = rows.filter(
        (row) =>
            textContains(row, "quizName", params.get("quizName")) &&
            matchesCommaList(row, "status", params.get("status")) &&
            matchesCommaList(row, "type", params.get("type")),
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

    // --- action prerequisites (SEBSERV-997): the reads behind "is this action
    // available yet". The mocked institution is fully set up, so every gated
    // action stays enabled; without these the catch-all's empty object would
    // read as "nothing exists" and disable them.
    await page.route(
        /\/api\/client_configuration\/names(?:$|\?)/,
        getOnly((route, url) =>
            json(
                route,
                CLIENT_CONFIGURATIONS.filter((configuration) =>
                    matchesActive(
                        configuration,
                        url.searchParams.get("active"),
                    ),
                ).map((configuration) => ({
                    modelId: String(configuration.id),
                    entityType: "SEB_CLIENT_CONFIGURATION",
                    name: configuration.name,
                })),
            ),
        ),
    );

    await page.route(
        /\/api\/lms-setup\/active(?:$|\?)/,
        getOnly((route, url) =>
            json(
                route,
                pagedEnvelope(
                    LMS_SETUPS.filter((setup) => setup.active),
                    url,
                    ["name"],
                ),
            ),
        ),
    );

    await page.route(
        /\/api\/admin-api\/v1\/exam-template\/names(?:$|\?)/,
        getOnly((route) => json(route, EXAM_TEMPLATE_NAMES)),
    );

    // --- certificates (empty default; certificate specs mock their own list, this
    // also feeds the encryption-certificate dropdown on the connection-config form)
    await page.route(
        /\/api\/admin-api\/v1\/certificate(?:$|\?)/,
        getOnly((route, url) => json(route, pagedEnvelope([], url, ["alias"]))),
    );

    // --- exams (06-exam and 09-archive both read the plain /exam collection) ---
    await page.route(
        /\/api\/exam(?:$|\?)/,
        getOnly((route, url) => json(route, pagedExamEnvelope(EXAMS, url))),
    );

    // --- monitoring (07-monitoring) ---------------------------------------------
    await page.route(
        /\/api\/monitoring(?:$|\?)/,
        getOnly((route, url) => json(route, pagedExamEnvelope(EXAMS, url))),
    );

    // --- analyze / finished exams (08-analyze) ----------------------------------
    await page.route(
        /\/api\/monitoring\/finishedexams(?:$|\?)/,
        getOnly((route, url) =>
            json(route, pagedExamEnvelope(FINISHED_EXAMS, url)),
        ),
    );

    // --- SEB client log export (downloadSEBLogs row action on 08-analyze) ------
    await page.route(
        /\/api\/seb-client-event\/export(?:$|\?)/,
        getOnly((route) =>
            route.fulfill({
                status: 200,
                contentType: "text/csv",
                body: "exam,client,event\n",
            }),
        ),
    );
}
