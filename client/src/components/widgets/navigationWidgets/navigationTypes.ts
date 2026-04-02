import type { RouteLocationRaw } from "vue-router";

export interface NavigationSectionItem {
    label: string;
    to?: RouteLocationRaw;
    testId?: string;
    visible?: boolean;
    thickDivider?: boolean;
}
