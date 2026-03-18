import * as constants from "@/utils/constants";
import * as spConstants from "@/utils/sp-constants";
import { translate } from "@/utils/generalUtils";
import { GUIComponent } from "@/services/ability";
import { NavigationSectionItem } from "@/components/widgets/navigationWidgets/navigationTypes.ts";

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
            to: constants.ASSESSMENT_TOOL_CONNECTIONS_ROUTE,
            testId: `${testIdPrefix}-assessmentToolConnections-link`,
            visible: ability.canView(GUIComponent.LMSSetups),
        },
        {
            label: translate("navigation.routeNames.connectionConfiguration"),
            to: constants.CONNECTION_CONFIGURATIONS_ROUTE,
            testId: `${testIdPrefix}-connectionConfigurations-link`,
            visible: ability.canView(GUIComponent.ConnectionConfigs),
        },
        {
            label: translate("navigation.routeNames.certificates"),
            to: constants.CERTIFICATES_ROUTE,
            testId: `${testIdPrefix}-certificates-link`,
            visible: ability.canView(GUIComponent.Certificates),
        },
        {
            label: translate("navigation.routeNames.userAccounts"),
            to: constants.USER_ACCOUNTS_ROUTE,
            testId: `${testIdPrefix}-userAccounts-link`,
            visible: ability.canView(GUIComponent.UserAccounts),
        },
        {
            label: translate("navigation.routeNames.oldUserAccounts"),
            to: constants.OLD_USER_ACCOUNTS_ROUTE,
            testId: `${testIdPrefix}-newUserAccounts-link`,
            visible: ability.canView(GUIComponent.UserAccounts),
        },
    ];
}

export function buildPreparationNavigationItems(
    testIdPrefix: string,
): NavigationSectionItem[] {
    return [
        {
            label: translate("titles.createTemplate"),
            to: constants.CREATE_TEMPLATE_ROUTE,
            testId: `${testIdPrefix}-createTemplate-link`,
        },
        {
            label: translate("titles.quizImport"),
            to: constants.QUIZ_IMPORT_ROUTE,
            testId: `${testIdPrefix}-quizImport-link`,
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
            label: translate("navigation.routeNames.runningExams"),
            to: constants.MONITORING_ROUTE,
            testId: `${testIdPrefix}-runningExams-link`,
        },
        {
            label: translate("titles.screenProctoring"),
            to: spConstants.RUNNING_EXAMS_ROUTE,
            testId: `${testIdPrefix}-screenProctoring-link`,
            thickDivider: true,
        },
        {
            label: translate("titles.spSearch"),
            to: spConstants.SEARCH_ROUTE,
            testId: `${testIdPrefix}-spSearch-link`,
        },
        {
            label: translate("titles.spApplications"),
            to: spConstants.APPLICATIONS_ROUTE,
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
