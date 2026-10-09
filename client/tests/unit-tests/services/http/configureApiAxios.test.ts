import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { UNHANDLED_ERROR_GRACE_MS } from "@/services/errors/unhandledErrors.ts";
import { configureApiAxios } from "@/services/http/configureApiAxios.ts";
import { notificationQueue, notify } from "@/services/notifications/notify.ts";

const BAD_REQUEST_BODY = [
    {
        messageCode: "1200",
        systemMessage: "Field validation error",
        attributes: ["indicatorTemplate", "name", "name.notunique"],
    },
];

function apiFailingWith(status: number, data: unknown) {
    return configureApiAxios(
        axios.create({
            adapter: (config: InternalAxiosRequestConfig) =>
                Promise.reject(
                    new AxiosError(
                        `Request failed with status code ${status}`,
                        status >= 500
                            ? AxiosError.ERR_BAD_RESPONSE
                            : AxiosError.ERR_BAD_REQUEST,
                        config,
                        {},
                        { status, statusText: "", data, headers: {}, config },
                    ),
                ),
        }),
    );
}

describe("configureApiAxios response interceptor", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        notify.clearAll();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    it("rejects with an AppError and toasts an unhandled write 400 after the grace window", async () => {
        const api = apiFailingWith(400, BAD_REQUEST_BODY);

        await expect(api.post("/x", {})).rejects.toMatchObject({
            kind: "backend",
            status: 400,
            method: "POST",
        });
        expect(notificationQueue.value).toHaveLength(0);

        vi.advanceTimersByTime(UNHANDLED_ERROR_GRACE_MS);
        expect(notificationQueue.value).toHaveLength(1);
        expect(notificationQueue.value[0].kind).toBe("client-error");
    });

    it("shows exactly one toast when the caller handles the write 400 itself", async () => {
        const api = apiFailingWith(400, BAD_REQUEST_BODY);

        try {
            await api.post("/x", {});
        } catch (error) {
            notify.serverError(error, { contextLabel: "examtemplate" });
        }
        expect(notificationQueue.value).toHaveLength(1);

        vi.advanceTimersByTime(UNHANDLED_ERROR_GRACE_MS);
        expect(notificationQueue.value).toHaveLength(1);
    });

    it("toasts a 500 immediately as a transport error and not again later", async () => {
        const api = apiFailingWith(500, BAD_REQUEST_BODY);

        await expect(api.post("/x", {})).rejects.toMatchObject({ status: 500 });
        expect(notificationQueue.value).toHaveLength(1);
        expect(notificationQueue.value[0].kind).toBe("server-error");

        vi.advanceTimersByTime(UNHANDLED_ERROR_GRACE_MS);
        expect(notificationQueue.value).toHaveLength(1);
    });

    it("leaves read errors to the page", async () => {
        const api = apiFailingWith(400, BAD_REQUEST_BODY);

        await expect(api.get("/x")).rejects.toMatchObject({ method: "GET" });

        vi.advanceTimersByTime(UNHANDLED_ERROR_GRACE_MS);
        expect(notificationQueue.value).toHaveLength(0);
    });

    it("honours _skipErrorToast for the fallback as well", async () => {
        const api = apiFailingWith(400, BAD_REQUEST_BODY);

        await expect(
            api.post("/x", {}, { _skipErrorToast: true }),
        ).rejects.toMatchObject({ status: 400 });

        vi.advanceTimersByTime(UNHANDLED_ERROR_GRACE_MS);
        expect(notificationQueue.value).toHaveLength(0);
    });
});
