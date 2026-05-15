import { translate } from "@/utils/generalUtils";
import { GUIComponent } from "@/services/ability";
import { typedTo } from "@/router/typedTo";
import type { NavigationSectionItem } from "@/components/widgets/navigationWidgets/types.ts";

type AbilityLike = {
    canView: (component: GUIComponent) => boolean;
};

export function buildSettingsNavigationItems(
    ability: AbilityLike,
    testIdPrefix: string,
): NavigationSectionItem[] {
    return [
        {
            label: translate("titles.institutions"),
            to: typedTo({ name: "/(app)/institution/" }),
            testId: `${testIdPrefix}-institutions-link`,
        },
        {
            label: translate("titles.assessmentToolConnections"),
            to: typedTo({ name: "/(app)/assessment-tool/" }),
            testId: `${testIdPrefix}-assessmentToolConnections-link`,
            visible: ability.canView(GUIComponent.LMSSetups),
        },
        {
            label: translate("navigation.routeNames.connectionConfiguration"),
            to: typedTo({ name: "/(app)/connection-configuration/" }),
            testId: `${testIdPrefix}-connectionConfigurations-link`,
            visible: ability.canView(GUIComponent.ConnectionConfigs),
        },
        {
            label: translate("navigation.routeNames.certificates"),
            to: typedTo({ name: "/(app)/certificate/" }),
            testId: `${testIdPrefix}-certificates-link`,
            visible: ability.canView(GUIComponent.Certificates),
        },
        {
            label: translate("navigation.routeNames.userAccounts"),
            to: typedTo({ name: "/(app)/user-account/" }),
            testId: `${testIdPrefix}-userAccounts-link`,
            visible: ability.canView(GUIComponent.UserAccounts),
        },
    ];
}

export function buildPreparationNavigationItems(
    testIdPrefix: string,
): NavigationSectionItem[] {
    return [
        {
            label: translate("titles.createTemplateExam"),
            to: typedTo({ name: "/(app)/exam-template/create/" }),
            testId: `${testIdPrefix}-createTemplate-link`,
        },
        {
            label: translate("titles.editExamTemplates"),
            to: typedTo({ name: "/(app)/exam-template/" }),
            testId: `${testIdPrefix}-examTemplateList-link`,
        },
        {
            label: translate("titles.quizImport"),
            to: typedTo({ name: "/(app)/quiz-import/" }),
            testId: `${testIdPrefix}-quizImport-link`,
        },
        {
            label: translate("titles.createExam"),
            to: typedTo({ name: "/(app)/exam/create/" }),
            testId: `${testIdPrefix}-createExam-link`,
        },
        {
            label: translate("titles.addExamWithURL"),
            testId: `${testIdPrefix}-addExamWithURL-text`,
        },
    ];
}

export function buildMonitoringNavigationItems(
    testIdPrefix: string,
): NavigationSectionItem[] {
    return [
        {
            label: translate("titles.monitoring"),
            to: typedTo({ name: "/(app)/monitoring/" }),
            testId: `${testIdPrefix}-runningExams-link`,
        },
        {
            label: translate("titles.spSearch"),
            to: typedTo({ name: "/(app)/sp-search/" }),
            thickDivider: true,

            testId: `${testIdPrefix}-spSearch-link`,
        },
        {
            label: translate("titles.spApplications"),
            to: typedTo({ name: "/(app)/applications-search/" }),
            testId: `${testIdPrefix}-spApplications-link`,
        },
    ];
}

export function buildFollowUpNavigationItems(
    testIdPrefix: string,
): NavigationSectionItem[] {
    return [
        {
            label: translate("navigation.routeNames.finishedExams"),
            testId: `${testIdPrefix}-finishedExams-text`,
        },
        {
            label: translate("titles.archiveExams"),
            testId: `${testIdPrefix}-archiveExams-text`,
        },
    ];
}
