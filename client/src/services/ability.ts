import type { UserRole } from "@/models/userAccount";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum";
import { useCurrentUserQuery } from "@/composables/useCurrentUser";
import * as generalUtils from "@/utils/generalUtils";
import { Exam } from "@/models/seb-server/exam";
import { FeatureEnum, featureNameMapping } from "@/models/features";
import * as apiService from "@/services/apiService";

// NOTE: anhefti, This acts as the Ability-Interface and should be used in generic components
export type AbilityLike = {
    canView: (component: GUIComponent) => boolean;
    canDo: (action: GUIAction) => boolean;
    isExamSupporter: (exam: Exam) => boolean;
    canDoExamAction: (action: GUIAction, exam: Exam | null) => boolean;
};

export enum GUIComponent {
    // Overall components
    NavigationOverview = "NavigationOverview",
    Home = "Home",

    // Settings
    Settings = "Settings",
    Institutions = "Institutions",
    UserAccounts = "UserAccounts",
    ConnectionConfigs = "ConnectionConfigs",
    LMSSetups = "LMSSetups",
    Certificates = "Certificates",

    // Preparation
    ExamTemplate = "ExamTemplate",
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
    AnalyzeExams = "AnalyzeExams",
    ArchiveExams = "ArchiveExams",
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

const guiComponents = new Map<UserRole, Set<GUIComponent>>();
const guiActions = new Map<UserRole, Set<GUIAction>>();
const examStatusActions = new Map<ExamStatusEnum, Set<GUIAction>>();

let systemFeaturesFetched = false;
let systemFeatures = new Map<string, boolean>();

// -----------------------------------------------------------------------------
// User Role based ability mapping

// --- GUI Component Privileges -----------------------

guiComponents.set(
    "SEB_SERVER_ADMIN",
    new Set<GUIComponent>([
        GUIComponent.NavigationOverview,
        GUIComponent.Settings,
        GUIComponent.UserAccounts,
        GUIComponent.Institutions,
    ]),
);

// --- INSTITUTIONAL_ADMIN component privileges
guiComponents.set(
    "INSTITUTIONAL_ADMIN",
    new Set<GUIComponent>([
        GUIComponent.NavigationOverview,
        GUIComponent.Home,
        GUIComponent.Settings,
        GUIComponent.UserAccounts,
        GUIComponent.ConnectionConfigs,
        GUIComponent.LMSSetups,
        GUIComponent.Certificates,
        GUIComponent.ExamTemplate,
        GUIComponent.Exams,
        GUIComponent.AnalyzeExams,
        GUIComponent.ArchiveExams,
    ]),
);

// --- EXAM_ADMIN component privileges
guiComponents.set(
    "EXAM_ADMIN",
    new Set<GUIComponent>([
        GUIComponent.Home,
        GUIComponent.PrepareExam,
        GUIComponent.AddExamWithURL,
        GUIComponent.RunningExams,
        GUIComponent.ScreenProctoring,
        GUIComponent.ScreenProctoringSearch,
        GUIComponent.ScreenProctoringApplicationSearch,
        GUIComponent.AnalyzeExams,
        GUIComponent.ArchiveExams,
        GUIComponent.Exams,
    ]),
);

// --- EXAM_SUPPORTER component privileges
guiComponents.set(
    "EXAM_SUPPORTER",
    new Set<GUIComponent>([
        GUIComponent.Home,
        GUIComponent.Exams,
        GUIComponent.RunningExams,
        GUIComponent.ScreenProctoring,
        GUIComponent.ScreenProctoringSearch,
        GUIComponent.ScreenProctoringApplicationSearch,
    ]),
);

// --- GUI Action Privileges -----------------------

// // --- SEB_SERVER_ADMIN action privileges
// guiActions.set(
//     "SEB_SERVER_ADMIN",
//     new Set<GUIAction>([
//         GUIAction.CreateUserAccount,
//         GUIAction.EditUserAccount,
//         GUIAction.DeleteUserAccount,
//     ]),
// );

// --- INSTITUTIONAL_ADMIN action privileges
guiActions.set(
    "INSTITUTIONAL_ADMIN",
    new Set<GUIAction>([
        // Exam actions
        GUIAction.ArchiveExam,
        GUIAction.DeleteExam,
        GUIAction.EditFullSEBSettings, // TODO just for testing yet
        GUIAction.ViewASKSettings,
    ]),
);

// --- EXAM_ADMIN action privileges
guiActions.set(
    "EXAM_ADMIN",
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
guiActions.set(
    "EXAM_SUPPORTER",
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
guiActions.set(
    "TEACHER",
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
examStatusActions.set(
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
examStatusActions.set(
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
examStatusActions.set(
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
examStatusActions.set(
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
examStatusActions.set(
    ExamStatusEnum.ARCHIVED,
    new Set<GUIAction>([
        GUIAction.DeleteExam,
        GUIAction.ViewASKSettings,
        GUIAction.ShowFinishedExamData,
    ]),
);

async function hasSystemFeature(feature: FeatureEnum): Promise<boolean> {
    if (!systemFeaturesFetched) {
        // fetch from server
        const response: Map<string, boolean> | null = (
            await apiService.getRequest({
                url: "/quiz",
                options: { _authType: "seb" },
            })
        ).data;
        if (response) {
            systemFeatures = response;
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

    return systemFeatures.get(fName) ?? false;
}

export const useAbilities = () => {
    const { data: currentUser } = useCurrentUserQuery();

    function canView(view: GUIComponent): boolean {
        const user = currentUser.value;
        if (user == null) return false;

        for (const role of user.userRoles) {
            if (guiComponents.get(role)?.has(view)) {
                return true;
            }
        }

        return false;
    }

    function canDo(action: GUIAction): boolean {
        const user = currentUser.value;
        if (user == null) return false;

        for (const role of user.userRoles) {
            if (guiActions.get(role)?.has(action)) {
                return true;
            }
        }
        return false;
    }

    // This would be for special case, when we need to know if a user has Exam access on Exam supporter mapping
    function isExamSupporter(exam: Exam): boolean {
        const user = currentUser.value;
        if (user == null) return false;

        // check if the user is assigned as supporter
        if (exam.supporter.includes(user.uuid)) return true;

        return false;
    }

    function canDoExamAction(action: GUIAction, exam: Exam | null): boolean {
        if (exam == null) {
            return false;
        }

        const user = currentUser.value;
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

        const statusSet = examStatusActions.get(examStatus);
        if (statusSet) {
            return statusSet.has(action);
        }

        return false;
    }

    return {
        canView,
        canDo,
        isExamSupporter,
        canDoExamAction,
        hasSystemFeature,
    };
};

// In the pages or in the code we can then just use this like

// in components... :disabled="!canDo(GUIAction.CreateUserAccount)"
// in code... if (canDo(GUIAction.CreateUserAccount)) ...
// for special cases: :disabled="!(canDo(GUIAction.EditExam || isExamSupporter(exam))"
