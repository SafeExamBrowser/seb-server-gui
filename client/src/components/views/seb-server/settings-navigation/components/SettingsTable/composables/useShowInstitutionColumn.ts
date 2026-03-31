import { computed } from "vue";
import { useUserAccountStore as useAuthenticatedUserAccountStore } from "@/stores/authentication/userAccountStore";
import { UserRoleEnum } from "@/models/userRoleEnum";

export const useShowInstitutionColumn = () => {
    const authenticatedUserAccountStore = useAuthenticatedUserAccountStore();

    return computed(() => {
        const roles =
            authenticatedUserAccountStore.userAccount?.userRoles ?? [];
        return roles.includes(UserRoleEnum.SEB_SERVER_ADMIN);
    });
};
