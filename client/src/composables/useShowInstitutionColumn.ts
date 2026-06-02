import { computed } from "vue";
import { useCurrentUser } from "@/composables/useCurrentUser.ts";
import { UserRole } from "@/models/userAccount.ts";

export const useShowInstitutionColumn = () => {
    const { data: currentUser } = useCurrentUser();

    return computed(() => {
        const roles = currentUser.value?.userRoles ?? [];
        return roles.includes(UserRole.SEB_SERVER_ADMIN);
    });
};
