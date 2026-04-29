import "vue-router";

export {};

declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean;
        titleKey?: string;
        isPageBlue?: boolean;
        pageTestId?: string;
        layoutContext?:
            | "default"
            | "exams-overview"
            | "gallery-view"
            | "monitoring";
    }
}
