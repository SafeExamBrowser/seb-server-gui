import * as constants from "@/utils/constants";
import type { RouteLocationRaw } from "vue-router";

type I18nLike = { t: (key: string) => string };

export type ContainerNavigationLink = {
    title: string;
    route: RouteLocationRaw;
    icon: string;
    testId: string;
};

export function buildContainerNavigationLinks(
    i18n: I18nLike,
): ContainerNavigationLink[] {
    return [
        {
            title: i18n.t("titles.home"),
            route: { name: "/(app)/home/" },
            icon: "mdi-home",
            testId: "layout-home-button",
        },
        // TODO REFACTOR-ROUTER Migrate exams to typed route.
        {
            title: i18n.t("titles.exams"),
            route: constants.EXAM_ROUTE,
            icon: "mdi-file-document",
            testId: "layout-exam-button",
        },
        // TODO REFACTOR-ROUTER Migrate monitoring to typed route.
        {
            title: i18n.t("titles.monitoring"),
            route: constants.MONITORING_ROUTE,
            icon: "mdi-eye",
            testId: "layout-monitoring-button",
        },
    ];
}
