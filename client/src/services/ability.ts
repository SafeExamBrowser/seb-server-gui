import { defineStore } from "pinia";
import { UserRoleEnum } from "@/models/userRoleEnum";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum";
import { useUserAccountStore } from "@/stores/authentication/authenticationStore";
import * as generalUtils from "@/utils/generalUtils";
import { ref } from "vue";
import { Exam } from "@/models/seb-server/exam";
import { FeatureEnum, featureNameMapping } from "@/models/features";
import * as apiService from "@/services/apiService";

export enum GUIComponent {
    // Overall components
    NavigationOverview = "NavigationOverview",

    // Settings
    Settings = "Settings",
    UserAccounts = "UserAccounts",
    ConnectionConfigs = "ConnectionConfigs",
    LMSSetups = "LMSSetups",
    Certificates = "Certificates",

    // Preparation
    ExamTemplate = "ExamTemplate",
    SEBTemplate = "SEBTemplate",
    PrepareExam = "PrepareExam",
    AddExamWithURL = "AddExamWithURL",

    // Exams
    Exams = "Exams",

    // Monitoring
    RunningExams = "RunningExams",
    ScreenProctoring = "ScreenProctoring",
    ScreenProctoringSearch = "ScreenProctoringSearch",
    ScreenProctoringApplicationSearch = "ScreenProctoringApplicationSearch",

    // Followup
    FinishedExams = "FinishedExams",
    ArchivedExams = "ArchivedExams",
}

export enum GUIAction {
    // Exam actions
    EditExamSettings = "EditExamSettings",
    ArchiveExam = "ArchiveExam",
    DeleteExam = "DeleteExam",
    ApplyTestRun = "ApplyTestRun",
    DisableTestRun = "DisableTestRun",
    ExportExamClientConfig = "ExportExamClientConfig",
    ViewASKSettings = "ViewASKSettings",
    EditASKSettings = "EditASKSettings",
    EditScreenProctoring = "EditScreenProctoring",
    EditSEBSettings = "EditSEBSettings",
    EditFullSEBSettings = "EditFullSEBSettings",
    EditIndicators = "EditIndicators",
    EditClientGroups = "EditClientGroups",
    ApplySEBRestriction = "ApplySEBRestriction",
    ShowMonitoring = "ShowMonitoring",
    ShowFinishedExamData = "ShowFinishedExamData",
}

export const useAbilities = defineStore("ability", () => {
    const guiComponents = ref<Map<UserRoleEnum, Set<GUIComponent>>>(
        new Map<UserRoleEnum, Set<GUIComponent>>(),
    );
    const guiActions = ref<Map<UserRoleEnum, Set<GUIAction>>>(
        new Map<UserRoleEnum, Set<GUIAction>>(),
    );
    const examStatusActions = ref<Map<ExamStatusEnum, Set<GUIAction>>>(
        new Map<ExamStatusEnum, Set<GUIAction>>(),
    );

    let systemFeaturesFetched = false;
    const systemFeatures = ref<Map<string, boolean>>(
        new Map<string, boolean>(),
    );

    // -----------------------------------------------------------------------------
    // User Role based ability mapping

    // --- GUI Component Privileges -----------------------

    guiComponents.value.set(
        UserRoleEnum.SEB_SERVER_ADMIN,
        new Set<GUIComponent>([
            GUIComponent.NavigationOverview,
            GUIComponent.Settings,
            GUIComponent.UserAccounts,
            GUIComponent.ConnectionConfigs,
            GUIComponent.LMSSetups,
            GUIComponent.Certificates,
        ]),
    );

    // --- INSTITUTIONAL_ADMIN component privileges
    guiComponents.value.set(
        UserRoleEnum.INSTITUTIONAL_ADMIN,
        new Set<GUIComponent>([
            GUIComponent.NavigationOverview,
            GUIComponent.Settings,
            GUIComponent.UserAccounts,
            GUIComponent.ConnectionConfigs,
            GUIComponent.LMSSetups,
            GUIComponent.Certificates,
            GUIComponent.ExamTemplate,
            GUIComponent.SEBTemplate,
            GUIComponent.Exams,
        ]),
    );

    // --- EXAM_ADMIN component privileges
    guiComponents.value.set(
        UserRoleEnum.EXAM_ADMIN,
        new Set<GUIComponent>([
            GUIComponent.PrepareExam,
            GUIComponent.AddExamWithURL,
            GUIComponent.RunningExams,
            GUIComponent.ScreenProctoring,
            GUIComponent.ScreenProctoringSearch,
            GUIComponent.ScreenProctoringApplicationSearch,
            GUIComponent.FinishedExams,
            GUIComponent.ArchivedExams,
            GUIComponent.Exams,
        ]),
    );

    // --- EXAM_SUPPORTER component privileges
    guiComponents.value.set(
        UserRoleEnum.EXAM_SUPPORTER,
        new Set<GUIComponent>([
            GUIComponent.Exams,
            GUIComponent.RunningExams,
            GUIComponent.ScreenProctoring,
            GUIComponent.ScreenProctoringSearch,
            GUIComponent.ScreenProctoringApplicationSearch,
            GUIComponent.FinishedExams,
            GUIComponent.ArchivedExams,
        ]),
    );

    // --- GUI Action Privileges -----------------------

    // // --- SEB_SERVER_ADMIN action privileges
    // guiActions.value.set(
    //     UserRoleEnum.SEB_SERVER_ADMIN,
    //     new Set<GUIAction>([
    //         GUIAction.CreateUserAccount,
    //         GUIAction.EditUserAccount,
    //         GUIAction.DeleteUserAccount,
    //     ]),
    // );

    // --- INSTITUTIONAL_ADMIN action privileges
    guiActions.value.set(
        UserRoleEnum.INSTITUTIONAL_ADMIN,
        new Set<GUIAction>([
            // Exam actions
            GUIAction.ArchiveExam,
            GUIAction.DeleteExam,
            GUIAction.EditFullSEBSettings, // TODO just for testing yet
            GUIAction.ViewASKSettings,
        ]),
    );

    // --- EXAM_ADMIN action privileges
    guiActions.value.set(
        UserRoleEnum.EXAM_ADMIN,
        new Set<GUIAction>([
            // Exam actions
            GUIAction.EditExamSettings,
            GUIAction.ArchiveExam,
            GUIAction.DeleteExam,
            GUIAction.ApplyTestRun,
            GUIAction.DisableTestRun,
            GUIAction.ExportExamClientConfig,
            GUIAction.ViewASKSettings,
            GUIAction.EditASKSettings,
            GUIAction.EditScreenProctoring,
            GUIAction.EditSEBSettings,
            GUIAction.EditIndicators,
            GUIAction.EditClientGroups,
            GUIAction.ApplySEBRestriction,
            GUIAction.ShowMonitoring,
            GUIAction.ShowFinishedExamData,
        ]),
    );

    // --- EXAM_SUPPORTER action privileges
    guiActions.value.set(
        UserRoleEnum.EXAM_SUPPORTER,
        new Set<GUIAction>([
            // Exam actions
            GUIAction.EditExamSettings,
            GUIAction.ApplyTestRun,
            GUIAction.DisableTestRun,
            GUIAction.ExportExamClientConfig,
            GUIAction.ViewASKSettings,
            GUIAction.EditASKSettings,
            GUIAction.EditScreenProctoring,
            GUIAction.EditSEBSettings,
            GUIAction.EditIndicators,
            GUIAction.EditClientGroups,
            GUIAction.ApplySEBRestriction,
            GUIAction.ShowMonitoring,
            GUIAction.ShowFinishedExamData,
        ]),
    );

    // --- TEACHER action privileges
    guiActions.value.set(
        UserRoleEnum.TEACHER,
        new Set<GUIAction>([
            // Exam actions
            GUIAction.ApplyTestRun,
            GUIAction.DisableTestRun,
            GUIAction.ViewASKSettings,
        ]),
    );

    // -----------------------------------------------------------------------
    // Exam Status ability mapping (SEBSERV-685)

    // ExamStatusEnum.UP_COMING
    examStatusActions.value.set(
        ExamStatusEnum.UP_COMING,
        new Set<GUIAction>([
            GUIAction.EditExamSettings,
            GUIAction.DeleteExam,
            GUIAction.ApplyTestRun,
            GUIAction.ExportExamClientConfig,
            GUIAction.ViewASKSettings,
            GUIAction.EditASKSettings,
            GUIAction.EditScreenProctoring,
            GUIAction.EditSEBSettings,
            GUIAction.EditIndicators,
            GUIAction.EditClientGroups,
            GUIAction.ApplySEBRestriction,
        ]),
    );

    // ExamStatusEnum.TEST_RUN
    examStatusActions.value.set(
        ExamStatusEnum.TEST_RUN,
        new Set<GUIAction>([
            GUIAction.EditExamSettings,
            GUIAction.DeleteExam,
            GUIAction.DisableTestRun,
            GUIAction.ExportExamClientConfig,
            GUIAction.ViewASKSettings,
            GUIAction.EditASKSettings,
            GUIAction.EditScreenProctoring,
            GUIAction.EditSEBSettings,
            GUIAction.EditIndicators,
            GUIAction.EditClientGroups,
            GUIAction.ApplySEBRestriction,
            GUIAction.ShowMonitoring,
        ]),
    );

    // ExamStatusEnum.RUNNING
    examStatusActions.value.set(
        ExamStatusEnum.RUNNING,
        new Set<GUIAction>([
            GUIAction.EditExamSettings,
            GUIAction.DeleteExam,
            GUIAction.ExportExamClientConfig,
            GUIAction.ViewASKSettings,
            GUIAction.EditASKSettings,
            GUIAction.EditScreenProctoring,
            GUIAction.EditSEBSettings,
            GUIAction.EditIndicators,
            GUIAction.EditClientGroups,
            GUIAction.ApplySEBRestriction,
            GUIAction.ShowMonitoring,
        ]),
    );

    // ExamStatusEnum.FINISHED
    examStatusActions.value.set(
        ExamStatusEnum.FINISHED,
        new Set<GUIAction>([
            GUIAction.ArchiveExam,
            GUIAction.DeleteExam,
            GUIAction.ExportExamClientConfig,
            GUIAction.ViewASKSettings,
            GUIAction.ApplySEBRestriction,
            GUIAction.ShowFinishedExamData,
        ]),
    );

    // ExamStatusEnum.ARCHIVED
    examStatusActions.value.set(
        ExamStatusEnum.ARCHIVED,
        new Set<GUIAction>([
            GUIAction.DeleteExam,
            GUIAction.ViewASKSettings,
            GUIAction.ShowFinishedExamData,
        ]),
    );

    function canView(view: GUIComponent): boolean {
        const user = useUserAccountStore().userAccount;
        if (user == null) return false;

        for (const role of user.userRoles) {
            const roleEnum = generalUtils.findEnumValue(UserRoleEnum, role);
            if (
                roleEnum != null &&
                guiComponents.value.get(roleEnum)?.has(view)
            ) {
                return true;
            }
        }

        return false;
    }

    function canDo(action: GUIAction): boolean {
        const user = useUserAccountStore().userAccount;
        if (user == null) return false;

        for (const role of user.userRoles) {
            const roleEnum = generalUtils.findEnumValue(UserRoleEnum, role);
            if (
                roleEnum != null &&
                guiActions.value.get(roleEnum)?.has(action)
            ) {
                return true;
            }
        }
        return false;
    }

    // This would be for special case, when we need to know if a user has Exam access on Exam supporter mapping
    function isExamSupporter(exam: Exam): boolean {
        const user = useUserAccountStore().userAccount;
        if (user == null) return false;

        // check if the user is assigned as supporter
        if (exam.supporter.includes(user.uuid)) return true;

        return false;
    }

    function canDoExamAction(action: GUIAction, exam: Exam | null): boolean {
        if (exam == null) {
            return false;
        }

        const user = useUserAccountStore().userAccount;
        if (user == null) return false;
        if (user.institutionId != exam.institutionId) {
            return false;
        }

        if (!canDo(action)) {
            return false;
        }

        const examStatus: ExamStatusEnum | null = generalUtils.findEnumValue(
            ExamStatusEnum,
            exam.status,
        );
        if (examStatus == null) {
            return false;
        }

        const statusSet = examStatusActions.value.get(examStatus);
        if (statusSet) {
            return statusSet.has(action);
        }

        return false;
    }

    async function hasSystemFeature(feature: FeatureEnum): Promise<boolean> {
        if (!systemFeaturesFetched) {
            // fetch from server
            const response: Map<string, boolean> | null = (
                await apiService.api.get("/info/features")
            ).data;
            if (response) {
                systemFeatures.value = response;
                systemFeaturesFetched = true;
            }
        }

        if (!systemFeaturesFetched) {
            return false;
        }

        const fName = featureNameMapping.get(feature);
        if (!fName) {
            return false;
        }

        return systemFeatures.value.get(fName) ?? false;
    }

    return {
        canView,
        canDo,
        isExamSupporter,
        canDoExamAction,
        hasSystemFeature,
    };
});

// In the pages or in the code we can then just use this like

// in components... :disabled="!canDo(GUIAction.CreateUserAccount)"
// in code... if (canDo(GUIAction.CreateUserAccount)) ...
// for special cases: :disabled="!(canDo(GUIAction.EditExam || isExamSupporter(exam))"
