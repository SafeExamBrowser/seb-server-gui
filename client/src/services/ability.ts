import { defineStore } from "pinia";
import {UserRoleEnum} from "@/models/userRoleEnum";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum";
import { useUserAccountStore } from "@/stores/authentication/authenticationStore";
import * as generalUtils from "@/utils/generalUtils";

export enum GUIComponent {
    // Overall components
    NavigationOverview = "NavigationOverview",

    // User Account Components
    UserAccount = "UserAccount"
};
    
export enum GUIAction  {
    // User Account actions
    CreateUserAccount = "CreateUserAccount", 
    EditUserAccount = "EditUserAccount",
    DeleteUserAccount = "DeleteUserAccount",

    // Exam import actions

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
    EditIndicators = "EditIndicators",
    EditClientGroups = "EditClientGroups",
    ApplySEBRestriction = "ApplySEBRestriction",
    ShowMonitoring = "ShowMonitoring",
};

export const useAbilities = defineStore("ability", () => {

    const guiComponents = ref<Map<UserRoleEnum, Set<GUIComponent>>>(new Map<UserRoleEnum, Set<GUIComponent>>());
    const guiActions = ref<Map<UserRoleEnum, Set<GUIAction>>>(new Map<UserRoleEnum, Set<GUIAction>>());
    const examStatusActions = ref<Map<ExamStatusEnum, Set<GUIAction>>>(new Map<ExamStatusEnum, Set<GUIAction>>());

    // -----------------------------------------------------------------------------
    // User Role based ability mapping

    guiComponents.value.set(
    UserRoleEnum.SEB_SERVER_ADMIN, 
    new Set<GUIComponent>([ 
        GUIComponent.NavigationOverview]));

    // --- GUI Component Privileges -----------------------

    // --- INSTITUTIONAL_ADMIN component privileges
    guiComponents.value.set(
        UserRoleEnum.INSTITUTIONAL_ADMIN, 
        new Set<GUIComponent>([ 
            GUIComponent.NavigationOverview]));


    // --- GUI Action Privileges -----------------------

    // --- SEB_SERVER_ADMIN action privileges
    guiActions.value.set(
        UserRoleEnum.SEB_SERVER_ADMIN, 
        new Set<GUIAction>([ 
            GUIAction.CreateUserAccount, 
            GUIAction.EditUserAccount, 
            GUIAction.DeleteUserAccount]));

    // --- INSTITUTIONAL_ADMIN action privileges
    guiActions.value.set(
        UserRoleEnum.INSTITUTIONAL_ADMIN, 
        new Set<GUIAction>([ 
            // User Account actions
            GUIAction.CreateUserAccount, 
            GUIAction.EditUserAccount, 
            GUIAction.DeleteUserAccount,

            // Exam actions
            GUIAction.ArchiveExam,
            GUIAction.DeleteExam,
            GUIAction.ViewASKSettings]));

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
            GUIAction.ShowMonitoring]));

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
            GUIAction.ShowMonitoring]));

    // --- TEACHER action privileges
    guiActions.value.set(
        UserRoleEnum.TEACHER, 
        new Set<GUIAction>([ 
            
            // Exam actions
            GUIAction.ApplyTestRun,
            GUIAction.DisableTestRun,
            GUIAction.ViewASKSettings]));

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
            GUIAction.EditScreenProctoring ,
            GUIAction.EditSEBSettings ,
            GUIAction.EditIndicators ,
            GUIAction.EditClientGroups,
            GUIAction.ApplySEBRestriction,
        ]));

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
            GUIAction.EditScreenProctoring ,
            GUIAction.EditSEBSettings ,
            GUIAction.EditIndicators ,
            GUIAction.EditClientGroups,
            GUIAction.ApplySEBRestriction,
            GUIAction.ShowMonitoring,
        ]));

    // ExamStatusEnum.RUNNING
    examStatusActions.value.set(
        ExamStatusEnum.RUNNING,
        new Set<GUIAction>([ 
            GUIAction.EditExamSettings,
            GUIAction.DeleteExam,
            GUIAction.ExportExamClientConfig,
            GUIAction.ViewASKSettings,
            GUIAction.EditASKSettings,
            GUIAction.EditScreenProctoring ,
            GUIAction.EditSEBSettings ,
            GUIAction.EditIndicators ,
            GUIAction.EditClientGroups,
            GUIAction.ApplySEBRestriction,
            GUIAction.ShowMonitoring,
        ]));

    // ExamStatusEnum.FINISHED
    examStatusActions.value.set(
        ExamStatusEnum.FINISHED,
        new Set<GUIAction>([ 
            GUIAction.ArchiveExam,
            GUIAction.DeleteExam,
            GUIAction.ExportExamClientConfig,
            GUIAction.ViewASKSettings,
            GUIAction.ApplySEBRestriction,
            GUIAction.ShowMonitoring
        ]));

    // ExamStatusEnum.ARCHIVED
    examStatusActions.value.set(
        ExamStatusEnum.ARCHIVED,
        new Set<GUIAction>([ 
            GUIAction.DeleteExam,
            GUIAction.ViewASKSettings,
            GUIAction.ShowMonitoring
        ]));

    function canView(view: GUIComponent): boolean {
        
        const user = useUserAccountStore().userAccount;
        if (user == null)
            return false;

        for (var role of user.userRoles) {
            const roleEnum = generalUtils.findEnumValue(UserRoleEnum, role);
            if (roleEnum != null && guiComponents.value.get(roleEnum)?.has(view)) {
                return true;
            }
        }

        return false; 
    }

    function canDo(action: GUIAction): boolean {
        
        const user = useUserAccountStore().userAccount;
        if (user == null)
            return false;

        for (var role of user.userRoles) {
            const roleEnum = generalUtils.findEnumValue(UserRoleEnum, role);
            if (roleEnum != null && guiActions.value.get(roleEnum)?.has(action)) {
                return true;
            }
        };
        return false; 
    }

    // This would be for special case, when we need to know if a user has Exam access on Exam supporter mapping
    function isExamSupporter(exam: Exam): boolean {

        const user = useUserAccountStore().userAccount;
        if (user == null)
            return false;

        // check if the user is assigned as supporter
        if (exam.supporter.includes(user.uuid))
            return true;

        return false;
    }

    function canDoExamAction(action: GUIAction, examStatusString: string | undefined): boolean {
        if(examStatusString == null){
            return false;
        }

        // TODO test if this works for all cases. See: SEBSERV-685. If so, remove debug output
        if (!canDo(action)) {
            console.info("User cannot do: " + action);
            return false;
        }

        const examStatus: ExamStatusEnum | null = generalUtils.findEnumValue(ExamStatusEnum, examStatusString);
        if (examStatus == null) {
            return false;
        }

        const statusSet = examStatusActions.value.get(examStatus);
        if (statusSet) {
            return statusSet.has(action);
        }

        return false;
    }

    return {
        canView,
        canDo,
        isExamSupporter,
        canDoExamAction
    }
});


// In the pages or in the code we can then just use this like

// in components... :disabled="!canDo(GUIAction.CreateUserAccount)"
// in code... if (canDo(GUIAction.CreateUserAccount)) ...
// for special cases: :disabled="!(canDo(GUIAction.EditExam || isExamSupporter(exam))"
