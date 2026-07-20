import type { RouteLocationAsRelative } from "vue-router";
import { typedTo } from "@/router/typedTo";
import { AbilityLike, GUIComponent } from "@/services/ability";

type I18nLike = { t: (key: string) => string };

export type BaseNavigationLink = {
    title: string;
    route: RouteLocationAsRelative;
    icon: string;
    testId: string;
    disabled?: boolean;
};

export function buildBaseNavigationLinks(
    ability: AbilityLike,
    i18n: I18nLike,
): BaseNavigationLink[] {
    const result: BaseNavigationLink[] = [];

    if (ability.canView(GUIComponent.EXAMS)) {
        result.push({
            title: i18n.t("titles.exams"),
            route: typedTo({ name: "/(app)/exam/" }),
            icon: "mdi-file-document",
            testId: "layout-exam-button",
        });
    }

    if (ability.canView(GUIComponent.RUNNING_EXAMS)) {
        result.push({
            title: i18n.t("titles.monitor"),
            route: typedTo({ name: "/(app)/monitoring/" }),
            icon: "mdi-eye",
            testId: "layout-monitoring-button",
        });
    }

    if (ability.canView(GUIComponent.ANALYZE_EXAMS)) {
        result.push({
            title: i18n.t("titles.analyze"),
            route: typedTo({ name: "/(app)/analyze/" }),
            icon: "mdi-folder-eye",
            testId: "layout-analyze-button",
            disabled: true,
        });
    }

    if (ability.canView(GUIComponent.ARCHIVE_EXAMS)) {
        result.push({
            title: i18n.t("titles.archive"),
            route: typedTo({ name: "/(app)/archive/" }),
            icon: "mdi-archive",
            testId: "layout-archive-button",
            disabled: true,
        });
    }

    return result;
}
