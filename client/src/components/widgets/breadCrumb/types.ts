import type { RouteName } from "@/router/routeNames.ts";

export interface BreadCrumbItem {
    label: string;
    link?: RouteName;
}
