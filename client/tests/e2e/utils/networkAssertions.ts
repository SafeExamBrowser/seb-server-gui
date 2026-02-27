import {
    expect,
    type Page,
    type Request,
    type Response,
} from "@playwright/test";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export function waitForRequest(
    page: Page,
    method: HttpMethod,
    urlRegex: RegExp,
): Promise<Request> {
    return page.waitForRequest(
        (req) => req.method() === method && urlRegex.test(req.url()),
    );
}

export function waitForResponse(
    page: Page,
    method: HttpMethod,
    urlRegex: RegExp,
): Promise<Response> {
    return page.waitForResponse(
        (resp) =>
            resp.request().method() === method && urlRegex.test(resp.url()),
    );
}

export async function expectRequestSucceeded(params: {
    page: Page;
    method: HttpMethod;
    urlRegex: RegExp;
    action?: () => Promise<void>;
    expectedStatus?: number;
}) {
    const expectedStatus = params.expectedStatus ?? 200;

    const requestPromise = waitForRequest(
        params.page,
        params.method,
        params.urlRegex,
    );
    const responsePromise = waitForResponse(
        params.page,
        params.method,
        params.urlRegex,
    );

    await params.action();

    const req = await requestPromise;
    const resp = await responsePromise;

    expect(req.method()).toBe(params.method);
    expect(req.url()).toMatch(params.urlRegex);

    expect(resp.url()).toMatch(params.urlRegex);
    expect(resp.status()).toBe(expectedStatus);
    expect(resp.ok()).toBeTruthy();
}

export async function expectNoRequest(params: {
    page: Page;
    method: HttpMethod;
    urlRegex: RegExp;
    action: () => Promise<void>;
    // how long to observe after action completes
    settleMs?: number;
}) {
    const settleMs = params.settleMs ?? 300;

    let called = false;

    const onRequest = (request: Request): void => {
        if (
            request.method() === params.method &&
            params.urlRegex.test(request.url())
        ) {
            called = true;
        }
    };

    params.page.on("request", onRequest);

    try {
        await params.action();
        await params.page.waitForTimeout(settleMs);
        expect(called).toBe(false);
    } finally {
        params.page.off("request", onRequest);
    }
}
