import { defineStore } from "pinia";
import {UserRoleEnum} from "@/models/userRoleEnum";
import { useUserAccountStore } from "@/stores/authentication/authenticationStore";
import * as generalUtils from "@/utils/generalUtils";

export enum GUIComponents {
    NavigationOverview = "NavigationOverview",
    UserAccount = "UserAccount"
};
    
export enum GUIAction  {
    CreateUserAccount = "CreateUserAccount", 
    EditUserAccount = "EditUserAccount",
    DeleteUserAccount = "DeleteUserAccount",

    EditExam = "EditExam",

};

export const useAbilities = defineStore("ability", () => {

    const guiComponents = ref<Map<UserRoleEnum, Set<GUIComponents>>>(new Map<UserRoleEnum, Set<GUIComponents>>());
    const guiActions = ref<Map<UserRoleEnum, Set<GUIAction>>>(new Map<UserRoleEnum, Set<GUIAction>>());

    guiComponents.value.set(
    UserRoleEnum.SEB_SERVER_ADMIN, 
    new Set<GUIComponents>([ 
        GUIComponents.NavigationOverview]));

    // SEB_SERVER_ADMIN action privileges
    guiActions.value.set(
        UserRoleEnum.SEB_SERVER_ADMIN, 
        new Set<GUIAction>([ 
            GUIAction.CreateUserAccount, 
            GUIAction.EditUserAccount, 
            GUIAction.DeleteUserAccount]));

    // INSTITUTIONAL_ADMIN component privileges
    guiComponents.value.set(
        UserRoleEnum.INSTITUTIONAL_ADMIN, 
        new Set<GUIComponents>([ 
            GUIComponents.NavigationOverview]));

    // INSTITUTIONAL_ADMIN action privileges
    guiActions.value.set(
        UserRoleEnum.INSTITUTIONAL_ADMIN, 
        new Set<GUIAction>([ 
            GUIAction.CreateUserAccount, 
            GUIAction.EditUserAccount, 
            GUIAction.DeleteUserAccount]));

    function canView(view: GUIComponents): boolean {
        
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

    return {
        canView,
        canDo,
        isExamSupporter
    }
});


// In the pages or in the code we can then just use this like

// in components... :disabled="!canDo(GUIAction.CreateUserAccount)"
// in code... if (canDo(GUIAction.CreateUserAccount)) ...
// for special cases: :disabled="!(canDo(GUIAction.EditExam || isExamSupporter(exam))"
