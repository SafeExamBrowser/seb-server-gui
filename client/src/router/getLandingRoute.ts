import type { RouteLocationAsRelative } from "vue-router";
import { typedTo } from "@/router/typedTo.ts";
import { UserRoleEnum } from "@/models/userRoleEnum.ts";

// Role-based landing after login. Highest role wins:
// admins land on the navigation overview, exam admins on the exams list,
// supervisors and teachers on monitoring.
export function getLandingRoute(userRoles: string[]): RouteLocationAsRelative {
    if (
        userRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN) ||
        userRoles.includes(UserRoleEnum.INSTITUTIONAL_ADMIN)
    ) {
        return typedTo({ name: "/(app)/navigation-overview/" });
    }

    if (userRoles.includes(UserRoleEnum.EXAM_ADMIN)) {
        return typedTo({ name: "/(app)/exam/" });
    }

    if (
        userRoles.includes(UserRoleEnum.EXAM_SUPPORTER) ||
        userRoles.includes(UserRoleEnum.TEACHER)
    ) {
        return typedTo({ name: "/(app)/monitoring/" });
    }

    return typedTo({ name: "/(app)/navigation-overview/" });
}
