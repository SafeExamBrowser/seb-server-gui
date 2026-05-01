import { translate } from "@/utils/generalUtils";
import { GUIComponent } from "@/services/ability";
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
            label: translate("titles.assessmentToolConnections"),
            to: { name: "/(app)/assessment-tool/" },
            testId: `${testIdPrefix}-assessmentToolConnections-link`,
            visible: ability.canView(GUIComponent.LMSSetups),
        },
        {
            label: translate("navigation.routeNames.connectionConfiguration"),
            to: { name: "/(app)/connection-configuration/" },
            testId: `${testIdPrefix}-connectionConfigurations-link`,
            visible: ability.canView(GUIComponent.ConnectionConfigs),
        },
        {
            label: translate("navigation.routeNames.certificates"),
            to: { name: "/(app)/certificate/" },
            testId: `${testIdPrefix}-certificates-link`,
            visible: ability.canView(GUIComponent.Certificates),
        },
        {
            label: translate("navigation.routeNames.userAccounts"),
            to: { name: "/(app)/user-account/" },
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
            to: { name: "/(app)/exam-template/create/" },
            testId: `${testIdPrefix}-createTemplate-link`,
        },
        {
            label: translate("titles.quizImport"),
            to: { name: "/(app)/quiz-import/" },
            testId: `${testIdPrefix}-quizImport-link`,
        },
        {
            label: translate("titles.addExamWithURL"),
            testId: `${testIdPrefix}-addExamWithURL-text`,
        },
        {
            label: translate("titles.examTemplateList"),
            to: { name: "/(app)/exam-template/" },
            testId: `${testIdPrefix}-examTemplateList-link`,
        },
    ];
}

export function buildMonitoringNavigationItems(
    testIdPrefix: string,
): NavigationSectionItem[] {
    return [
        //TODO REFACTOR-ROUTER
        {
            label: translate("titles.monitoring"),
            to: { name: "/(app)/monitoring/" },
            testId: `${testIdPrefix}-runningExams-link`,
        },
        {
            label: translate("titles.screenProctoring"),
            to: { name: "/(app)/running-sp-exams/" },
            testId: `${testIdPrefix}-screenProctoring-link`,
            thickDivider: true,
        },
        {
            label: translate("titles.spSearch"),
            testId: `${testIdPrefix}-spSearch-link`,
        },
        {
            label: translate("titles.spApplications"),
            to: { name: "/(app)/applications-search/" },
            testId: `${testIdPrefix}-spApplications-link`,
        },
    ];
}

export function buildFollowUpNavigationItems(
    testIdPrefix: string,
): NavigationSectionItem[] {
    // TODO REFACTOR-ROUTER
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
