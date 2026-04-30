import type { RouteLocationAsRelative } from "vue-router";

export interface BreadCrumbItem {
    label: string;
    link?: RouteLocationAsRelative;
}
