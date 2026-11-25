import { AxiosError, AxiosHeaders } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

import i18n from "@/i18n";
import {
    getBackendMessageLines,
    getBackendMessageTitle,
    hasUntranslatableContent,
} from "@/services/errors/backendErrorText.ts";
import { formatErrorReport } from "@/services/errors/errorReport.ts";
import { toAppError } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";
import { notificationQueue, notify } from "@/services/notifications/notify.ts";

const t = (key: string) => i18n.global.t(key);

const KNOWN = {
    messageCode: "1101",
    systemMessage: "Integrity violation",
    details: "row 7",
};
const UNKNOWN = {
    messageCode: "9999",
    systemMessage: "Something internal exploded",
    details: "NullPointerException at Foo.java:42",
};

const config = { method: "post", url: "/api/x", headers: new AxiosHeaders() };

function httpError(status: number, data: unknown): AppError {
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

const networkError = (): AppError =>
    toAppError(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config));

describe("untranslatable backend errors", () => {
    it("translates a known code and appends the details", () => {
        const error = httpError(400, [KNOWN]);

        expect(getBackendMessageLines(error)).toEqual([
            `${t("errors.backend.codes.INTEGRITY_VALIDATION")} (row 7)`,
        ]);
        expect(getBackendMessageTitle(error)).toBe(
            t("errors.backend.http.400"),
        );
        expect(hasUntranslatableContent(error)).toBe(false);
    });

    it("hides an unknown code behind the unexpected-error text", () => {
        const error = httpError(400, [UNKNOWN]);
        const lines = getBackendMessageLines(error);

        expect(lines).toEqual([t("errors.backend.unexpected.text")]);
        expect(lines.join()).not.toContain("exploded");
        expect(getBackendMessageTitle(error)).toBe(
            t("errors.backend.unexpected.title"),
        );
        expect(hasUntranslatableContent(error)).toBe(true);
    });

    it("keeps translated lines and collapses the unknown ones in a mixed response", () => {
        const error = httpError(400, [
            KNOWN,
            UNKNOWN,
            { ...UNKNOWN, messageCode: "9998" },
        ]);

        expect(getBackendMessageLines(error)).toEqual([
            `${t("errors.backend.codes.INTEGRITY_VALIDATION")} (row 7)`,
            t("errors.backend.unexpected.text"),
        ]);
        expect(getBackendMessageTitle(error)).toBe(
            t("errors.backend.http.400"),
        );
        expect(hasUntranslatableContent(error)).toBe(true);
    });

    it("keeps a matching domain title for untranslatable content", () => {
        const error = httpError(400, [UNKNOWN]);

        expect(
            getBackendMessageTitle(error, {
                contextLabel: "useraccount",
                method: "POST",
            }),
        ).toBe(t("errors.backend.title.useraccount.post"));
    });

    it("treats a body without ApiMessages as unexpected", () => {
        const badRequest = httpError(400, "<html>nope</html>");
        const gateway = httpError(502, "<html>bad gateway</html>");

        expect(badRequest.kind).toBe("unknown");
        expect(getBackendMessageTitle(badRequest)).toBe(
            t("errors.backend.unexpected.title"),
        );
        expect(getBackendMessageLines(badRequest)).toEqual([
            t("errors.backend.unexpected.text"),
        ]);
        expect(getBackendMessageTitle(gateway)).toBe(
            t("errors.backend.http.502"),
        );
        expect(hasUntranslatableContent(gateway)).toBe(true);
    });

    it("gives network failures their own text", () => {
        const error = networkError();

        expect(error.kind).toBe("network");
        expect(getBackendMessageTitle(error)).toBe(
            t("errors.backend.network.title"),
        );
        expect(getBackendMessageLines(error)).toEqual([
            t("errors.backend.network.text"),
        ]);
        expect(hasUntranslatableContent(error)).toBe(false);
    });
});

describe("formatErrorReport", () => {
    it("lists request, status and every raw message for support", () => {
        const report = formatErrorReport(
            httpError(400, [KNOWN, UNKNOWN]),
            new Date("2026-09-22T09:00:00.000Z"),
        );

        expect(report).toContain("2026-09-22T09:00:00.000Z");
        expect(report).toContain("Request: POST /api/x");
        expect(report).toContain("Status:  400");
        expect(report).toContain(
            "1101 INTEGRITY_VALIDATION | Integrity violation",
        );
        expect(report).toContain("9999 | Something internal exploded");
        expect(report).toContain(
            "details: NullPointerException at Foo.java:42",
        );
    });
});

describe("notify.serverError copy-details action", () => {
    beforeEach(() => {
        notify.clearAll();
    });

    it("adds the action for untranslatable errors only", () => {
        notify.serverError(httpError(400, [UNKNOWN]));
        notify.serverError(httpError(400, [KNOWN]));

        const [untranslatable, translatable] = notificationQueue.value;
        expect(untranslatable.actionLabel).toBe(
            t("errors.backend.unexpected.copyAction"),
        );
        expect(untranslatable.onAction).toBeTypeOf("function");
        expect(translatable.actionLabel).toBeUndefined();
        expect(translatable.onAction).toBeUndefined();
    });

    it("prefers an action supplied by the caller", () => {
        const onAction = vi.fn();
        notify.serverError(httpError(400, [UNKNOWN]), {
            actionLabel: "Retry",
            onAction,
        });

        expect(notificationQueue.value[0].actionLabel).toBe("Retry");
        expect(notificationQueue.value[0].onAction).toBe(onAction);
    });

    it("copies the report to the clipboard and confirms", async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, "clipboard", {
            value: { writeText },
            configurable: true,
        });

        notify.serverError(httpError(400, [UNKNOWN]));
        notificationQueue.value[0].onAction?.();

        await vi.waitFor(() => {
            expect(
                notificationQueue.value.some((item) => item.kind === "success"),
            ).toBe(true);
        });
        expect(writeText).toHaveBeenCalledTimes(1);
        expect(writeText.mock.calls[0][0]).toContain("9999");
        expect(writeText.mock.calls[0][0]).toContain(
            "Something internal exploded",
        );
    });
});
