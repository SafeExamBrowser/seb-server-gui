import { ERROR_CODE_NAMES } from "@/services/errors/backendErrorText.ts";
import type { APIMessage, AppError } from "@/services/errors/types.ts";

function describeMessage(message: APIMessage): string {
    const code = [message.messageCode, ERROR_CODE_NAMES[message.messageCode]]
        .filter(Boolean)
        .join(" ");
    const parts = [
        code,
        message.systemMessage,
        message.details ? `details: ${message.details}` : undefined,
        message.attributes?.length
            ? `attributes: ${JSON.stringify(message.attributes)}`
            : undefined,
    ].filter(Boolean);
    return `  - ${parts.join(" | ")}`;
}

function statusOf(error: AppError): number | undefined {
    return "status" in error ? error.status : undefined;
}

export function formatErrorReport(
    error: AppError,
    now: Date = new Date(),
): string {
    const request = [error.method, error.url].filter(Boolean).join(" ");
    const lines = [
        "SEB Server GUI error report",
        `Time:    ${now.toISOString()}`,
        `Request: ${request || "unknown"}`,
        `Status:  ${statusOf(error) ?? "none"}`,
        `Kind:    ${error.kind}`,
    ];
    if (error.kind === "backend") {
        lines.push("Messages:", ...error.messages.map(describeMessage));
    } else if (error.kind === "rate-limit") {
        lines.push(`Code:    ${error.code ?? "none"}`);
    } else {
        lines.push(`Message: ${error.message}`);
    }
    return lines.join("\n");
}
