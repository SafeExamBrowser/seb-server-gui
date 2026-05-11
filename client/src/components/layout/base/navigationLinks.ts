import type { RouteLocationAsRelative } from "vue-router";
import { typedTo } from "@/router/typedTo";

type I18nLike = { t: (key: string) => string };

export type BaseNavigationLink = {
    title: string;
    route: RouteLocationAsRelative;
    icon: string;
    testId: string;
};

export function buildBaseNavigationLinks(i18n: I18nLike): BaseNavigationLink[] {
    return [
        {
            title: i18n.t("titles.home"),
            route: typedTo({ name: "/(app)/" }),
            icon: "mdi-home",
            testId: "layout-home-button",
        },
        {
            title: i18n.t("titles.exams"),
            route: typedTo({ name: "/(app)/exam/" }),
            icon: "mdi-file-document",
            testId: "layout-exam-button",
        },
        {
            title: i18n.t("titles.monitor"),
            route: typedTo({ name: "/(app)/monitoring/" }),
            icon: "mdi-eye",
            testId: "layout-monitoring-button",
        },
    ];
}
