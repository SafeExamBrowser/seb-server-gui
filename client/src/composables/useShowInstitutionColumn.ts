import { computed } from "vue";
import { useCurrentUserQuery } from "@/composables/useCurrentUser.ts";

export const useShowInstitutionColumn = () => {
    const { data: currentUser } = useCurrentUserQuery();

    return computed(() => {
        const roles = currentUser.value?.userRoles ?? [];
        return roles.includes("SEB_SERVER_ADMIN");
    });
};
