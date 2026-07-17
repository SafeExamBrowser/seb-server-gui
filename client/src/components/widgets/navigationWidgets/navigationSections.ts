import { translate } from "@/utils/generalUtils";
import { AbilityLike, GUIAction, GUIComponent } from "@/services/ability";
import { typedTo } from "@/router/typedTo";
import type { NavigationSectionItem } from "@/components/widgets/navigationWidgets/types.ts";

export function buildSettingsNavigationItems(
    ability: AbilityLike,
    testIdPrefix: string,
): NavigationSectionItem[] {
    return [
        {
            label: translate("titles.institutions"),
            to: typedTo({ name: "/(app)/institution/" }),
            testId: `${testIdPrefix}-institutions-link`,
            visible: ability.canView(GUIComponent.INSTITUTIONS),
        },
        {
            label: translate("titles.assessmentToolConnections"),
            to: typedTo({ name: "/(app)/assessment-tool/" }),
            testId: `${testIdPrefix}-assessmentToolConnections-link`,
            visible: ability.canView(GUIComponent.LMS_SETUPS),
        },
        {
            label: translate("navigation.routeNames.connectionConfiguration"),
            to: typedTo({ name: "/(app)/connection-configuration/" }),
            testId: `${testIdPrefix}-connectionConfigurations-link`,
            visible: ability.canView(GUIComponent.CONNECTION_CONFIGS),
        },
        {
            label: translate("navigation.routeNames.certificates"),
            to: typedTo({ name: "/(app)/certificate/" }),
            testId: `${testIdPrefix}-certificates-link`,
            visible: ability.canView(GUIComponent.CERTIFICATES),
        },
        {
            label: translate("navigation.routeNames.userAccounts"),
            to: typedTo({ name: "/(app)/user-account/" }),
            testId: `${testIdPrefix}-userAccounts-link`,
            visible: ability.canView(GUIComponent.USER_ACCOUNTS),
        },
    ];
}

export function buildPreparationNavigationItems(
    ability: AbilityLike,
    testIdPrefix: string,
): NavigationSectionItem[] {
    return [
        {
            label: translate("titles.createTemplateExam"),
            to: typedTo({ name: "/(app)/exam-template/create/" }),
            testId: `${testIdPrefix}-createTemplate-link`,
            visible: ability.canView(GUIComponent.EXAM_TEMPLATE),
        },
        {
            label: translate("titles.examTemplateList"),
            to: typedTo({ name: "/(app)/exam-template/" }),
            testId: `${testIdPrefix}-examTemplateList-link`,
            visible: ability.canView(GUIComponent.EXAM_TEMPLATE),
        },
        {
            label: translate("titles.createExam"),
            to: typedTo({ name: "/(app)/exam/create/" }),
            testId: `${testIdPrefix}-prepareExam-link`,
            visible: ability.canView(GUIComponent.EXAMS),
        },
        {
            label: translate("titles.addExamWithURL"),
            to: typedTo({ name: "/(app)/exam/create/withURL/" }),
            testId: `${testIdPrefix}-addExamWithURL-text`,
            visible: ability.canView(GUIComponent.EXAMS),
        },
    ];
}

export function buildMonitoringNavigationItems(
    ability: AbilityLike,
    testIdPrefix: string,
): NavigationSectionItem[] {
    return [
        {
            label: translate("titles.monitoring"),
            to: typedTo({ name: "/(app)/monitoring/" }),
            testId: `${testIdPrefix}-runningExams-link`,
            visible:
                ability.canDo(GUIAction.SHOW_MONITORING) ||
                ability.canView(GUIComponent.EXAMS),
        },
        {
            label: translate("titles.spSearch"),
            to: typedTo({ name: "/(app)/sp-search/" }),
            thickDivider: true,
            testId: `${testIdPrefix}-spSearch-link`,
            visible: ability.canView(GUIComponent.EXAMS),
        },
        {
            label: translate("titles.spApplications"),
            to: typedTo({ name: "/(app)/applications-search/" }),
            testId: `${testIdPrefix}-spApplications-link`,
            visible: ability.canView(GUIComponent.EXAMS),
        },
    ];
}

export function buildFollowUpNavigationItems(
    ability: AbilityLike,
    testIdPrefix: string,
): NavigationSectionItem[] {
    return [
        {
            label: translate("navigation.routeNames.analyzeExams"),
            to: typedTo({ name: "/(app)/analyze/" }),
            visible: ability.canView(GUIComponent.ANALYZE_EXAMS),
            testId: `${testIdPrefix}-analyzeExams-test`,
        },
        {
            label: translate("navigation.routeNames.archiveExams"),
            to: typedTo({ name: "/(app)/archive/" }),
            visible: ability.canView(GUIComponent.ARCHIVE_EXAMS),
            testId: `${testIdPrefix}-archiveExams-test`,
        },
        {
            label: translate("navigation.routeNames.scheduledDeletion"),
            to: typedTo({ name: "/(app)/scheduled-deletion/" }),
            visible: ability.canView(GUIComponent.SCHEDULED_DELETION),
            testId: `${testIdPrefix}-scheduledDelete-test`,
        },
    ];
}
