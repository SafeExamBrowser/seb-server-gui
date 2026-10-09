import { AxiosError, AxiosHeaders } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reactive, ref } from "vue";

import { markErrorHandled } from "@/services/errors/handledErrors.ts";
import { toAppError } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import {
    needsUnhandledFallback,
    scheduleUnhandledErrorToast,
    UNHANDLED_ERROR_GRACE_MS,
} from "@/services/errors/unhandledErrors.ts";
import { notificationQueue, notify } from "@/services/notifications/notify.ts";

const FIELD_VALIDATION_MESSAGE = {
    messageCode: "1200",
    systemMessage: "Field validation error",
    attributes: ["indicatorTemplate", "name", "name.notunique"],
};

function httpError(method: string, status: number, data: unknown): AppError {
    const config = { method, url: "/api/x", headers: new AxiosHeaders() };
    return toAppError(
        new AxiosError(
            `Request failed with status code ${status}`,
            status >= 500
                ? AxiosError.ERR_BAD_RESPONSE
                : AxiosError.ERR_BAD_REQUEST,
            config,
            {},
            { status, statusText: "", data, headers: {}, config },
        ),
    );
}

const post400 = () => httpError("post", 400, [FIELD_VALIDATION_MESSAGE]);

describe("needsUnhandledFallback", () => {
    it("accepts a write 4xx", () => {
        expect(needsUnhandledFallback(post400(), false)).toBe(true);
        expect(
            needsUnhandledFallback(httpError("patch", 409, "<html/>"), false),
        ).toBe(true);
        expect(
            needsUnhandledFallback(httpError("delete", 404, []), false),
        ).toBe(true);
    });

    it("skips reads", () => {
        expect(needsUnhandledFallback(httpError("get", 400, []), false)).toBe(
            false,
        );
    });

    it("skips 401, transport errors, missing method and _skipErrorToast", () => {
        expect(needsUnhandledFallback(httpError("post", 401, []), false)).toBe(
            false,
        );
        expect(needsUnhandledFallback(httpError("post", 500, []), false)).toBe(
            false,
        );
        expect(
            needsUnhandledFallback(toAppError(new Error("No token")), false),
        ).toBe(false);
        expect(needsUnhandledFallback(post400(), true)).toBe(false);
    });
});

describe("scheduleUnhandledErrorToast", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        notify.clearAll();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it("toasts an unhandled write error after the grace window", () => {
        scheduleUnhandledErrorToast(post400());

        vi.advanceTimersByTime(UNHANDLED_ERROR_GRACE_MS - 1);
        expect(notificationQueue.value).toHaveLength(0);

        vi.advanceTimersByTime(1);
        expect(notificationQueue.value).toHaveLength(1);
        expect(notificationQueue.value[0].kind).toBe("client-error");
    });

    it("stays silent when the error was marked handled", () => {
        const error = post400();
        scheduleUnhandledErrorToast(error);
        markErrorHandled(error);

        vi.advanceTimersByTime(UNHANDLED_ERROR_GRACE_MS);
        expect(notificationQueue.value).toHaveLength(0);
    });

    it("does not duplicate a toast a handler already showed", () => {
        const error = post400();
        scheduleUnhandledErrorToast(error);
        notify.serverError(error, { contextLabel: "examtemplate" });

        vi.advanceTimersByTime(UNHANDLED_ERROR_GRACE_MS);
        expect(notificationQueue.value).toHaveLength(1);
    });

    it("recognises the error through Vue reactive proxies", () => {
        const viaReactive = post400();
        const viaRef = post400();
        scheduleUnhandledErrorToast(viaReactive);
        scheduleUnhandledErrorToast(viaRef);

        markErrorHandled(reactive(viaReactive));
        markErrorHandled(ref(viaRef).value);

        vi.advanceTimersByTime(UNHANDLED_ERROR_GRACE_MS);
        expect(notificationQueue.value).toHaveLength(0);
    });

    it("collapses identical unhandled errors into one toast", () => {
        scheduleUnhandledErrorToast(post400());
        scheduleUnhandledErrorToast(post400());

        vi.advanceTimersByTime(UNHANDLED_ERROR_GRACE_MS);
        expect(notificationQueue.value).toHaveLength(1);
    });
});
