import type { RouteLocationAsRelative } from "vue-router";

export type NavigationSectionTarget = RouteLocationAsRelative;
export interface NavigationSectionItem {
    label: string;
    to?: RouteLocationAsRelative;
    testId?: string;
    visible?: boolean;
    thickDivider?: boolean;
}
