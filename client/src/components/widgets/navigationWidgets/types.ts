import type { RouteLocationAsRelative, RouteLocationRaw } from "vue-router";

export type NavigationSectionTarget = RouteLocationRaw;
export interface NavigationSectionItem {
    label: string;
    to?: RouteLocationAsRelative;
    testId?: string;
    visible?: boolean;
    thickDivider?: boolean;
}
