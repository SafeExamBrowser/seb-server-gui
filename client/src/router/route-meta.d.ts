import "vue-router";

import type { GUIComponent } from "@/models/guiAbilities";

export {};

declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean;
        requiredComponent?: GUIComponent;
        titleKey?: string;
        isPageBlue?: boolean;
        pageTestId?: string;
        layoutContext?:
            | "default"
            | "exams-overview"
            | "gallery-view"
            | "monitoring"
            | "navigation-overview";
    }
}
