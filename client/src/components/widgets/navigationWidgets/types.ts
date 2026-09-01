import type { RouteLocationAsRelative } from "vue-router";

import type { Prerequisite } from "@/composables/useActionPrerequisites.ts";

export type NavigationSectionTarget = RouteLocationAsRelative;
export interface NavigationSectionItem {
    label: string;
    to?: RouteLocationAsRelative;
    testId?: string;
    visible?: boolean;
    thickDivider?: boolean;
    requires?: Prerequisite[];
    prerequisiteMessages?: Partial<Record<Prerequisite, string>>;
}

export interface ResolvedNavigationSectionItem extends NavigationSectionItem {
    disabled: boolean;
    unmetMessages: string[];
}
