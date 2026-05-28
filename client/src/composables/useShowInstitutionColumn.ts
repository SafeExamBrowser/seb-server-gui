import { computed } from "vue";
import { useUserAccountStore as useAuthenticatedUserAccountStore } from "@/stores/authentication/userAccountStore.ts";
import { UserRole } from "@/models/userAccount.ts";

export const useShowInstitutionColumn = () => {
    const authenticatedUserAccountStore = useAuthenticatedUserAccountStore();

    return computed(() => {
        const roles =
            authenticatedUserAccountStore.userAccount?.userRoles ?? [];
        return roles.includes(UserRole.SEB_SERVER_ADMIN);
    });
};
