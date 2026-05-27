import type { AppError } from "@/services/errors/types.ts";

export function transportErrorDedupeKey(error: AppError): string | undefined {
    if (error.kind === "network") {
        return "transport:offline";
    }
    if (error.kind === "rate-limit") {
        return "transport:rate-limit";
    }
    const status =
        error.kind === "backend" || error.kind === "unknown"
            ? error.status
            : undefined;
    if (status !== undefined && status >= 500) {
        return "transport:server";
    }
    return undefined;
}
