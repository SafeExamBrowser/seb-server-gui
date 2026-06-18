import type { RouteLocationAsRelative } from "vue-router";
import { typedTo } from "@/router/typedTo.ts";
import type { UserRole } from "@/models/userAccount.ts";

// Role-based landing after login. Highest role wins:
// admins land on the navigation overview, exam admins on the exams list,
// supervisors and teachers on monitoring.
export function getLandingRoute(
    userRoles: readonly UserRole[],
): RouteLocationAsRelative {
    if (
        userRoles.includes("SEB_SERVER_ADMIN") ||
        userRoles.includes("INSTITUTIONAL_ADMIN")
    ) {
        return typedTo({ name: "/(app)/navigation-overview/" });
    }

    if (userRoles.includes("EXAM_ADMIN")) {
        return typedTo({ name: "/(app)/exam/" });
    }

    if (userRoles.includes("EXAM_SUPPORTER") || userRoles.includes("TEACHER")) {
        return typedTo({ name: "/(app)/monitoring/" });
    }

    return typedTo({ name: "/(app)/navigation-overview/" });
}
