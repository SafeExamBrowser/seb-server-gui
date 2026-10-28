import type { Page, Route } from "@playwright/test";
import {
    CLIENT_CONFIGURATIONS,
    EXAMS,
    EXAM_TEMPLATES,
    FINISHED_EXAMS,
    GUI_ABILITIES,
    INSTITUTION_NAMES,
    INSTITUTIONS,
    LMS_SETUPS,
    MOCK_CURRENT_USER,
    MOCK_PASSWORD,
    MOCK_USERNAME,
    TOKEN_RESPONSE,
    userAccountRows,
} from "./mock-data";

// A fully mocked SEB Server backend: auth, session bootstrap and the list /
// detail reads of every domain are served from in-memory data, so the suite
// runs hermetically against the dev server alone. Spec-level page.route
// handlers are registered AFTER these and therefore win (Playwright matches
// routes in reverse registration order); handlers that route.fallback() on
// non-matching methods drop through to the routes below.

// Re-exported so existing spec imports keep working.
export { MOCK_USERNAME, MOCK_PASSWORD, MOCK_CURRENT_USER };

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

function examRows(rows: Row[], params: URLSearchParams): Row[] {
    return rows.filter(
        (row) =>
            textContains(row, "quizName", params.get("quizName")) &&
            matchesCommaList(row, "status", params.get("status")) &&
            matchesCommaList(row, "type", params.get("type")),
    );
}

function examTemplateRows(rows: Row[], params: URLSearchParams): Row[] {
    return rows.filter(
        (row) =>
            textContains(row, "name", params.get("name")) &&
            matchesCommaList(row, "description", params.get("description")) &&
            matchesCommaList(row, "examType", params.get("examType")),
    );
}

// Same shape as pagedEnvelope but for the exam & exam-template family: the text filter is
// always `quizName`, and `status`/`type` are comma-list filters instead of
// the institution family's exact `active`/`institutionId` filters.
// or name`, and `description`, `exam-type`
function pagedSpecificEnvelope(
    rows: Row[],
    url: URL,
    type: string,
): Row[] | object {
    const params = url.searchParams;

    let filtered: Row[] = [];
    if (type == "exam") {
        filtered = examRows(rows, params);
    }

    if (type == "examTemplate") {
        filtered = examTemplateRows(rows, params);
    }

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
    await page.route(
        /\/api\/admin-api\/v1\/info\/institution(?:$|\?)/,
        (route) => json(route, INSTITUTION_NAMES),
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

    // --- exam-template---------------------------------------------
    // (EXAM_TEMPLATE_NAMES lives in ./mockData; import it again if you re-enable this route)
    // await page.route(
    //     /\/api\/admin-api\/v1\/exam-template\/names(?:$|\?)/,
    //     getOnly((route) => json(route, EXAM_TEMPLATE_NAMES)),

    // );
    await page.route(
        /\/api\/admin-api\/v1\/exam-template(?:$|\?)/i,
        getOnly((route, url) =>
            json(
                route,
                pagedSpecificEnvelope(EXAM_TEMPLATES, url, "examTemplate"),
            ),
        ),
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
        getOnly((route, url) =>
            json(route, pagedSpecificEnvelope(EXAMS, url, "exam")),
        ),
    );

    // --- monitoring (07-monitoring) ---------------------------------------------
    await page.route(
        /\/api\/monitoring(?:$|\?)/,
        getOnly((route, url) =>
            json(route, pagedSpecificEnvelope(EXAMS, url, "exam")),
        ),
    );

    // --- analyze / finished exams (08-analyze) ----------------------------------
    await page.route(
        /\/api\/monitoring\/finishedexams(?:$|\?)/,
        getOnly((route, url) =>
            json(route, pagedSpecificEnvelope(FINISHED_EXAMS, url, "exam")),
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
