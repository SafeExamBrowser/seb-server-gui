import { computed } from "vue";
import { useCurrentUser } from "@/composables/useCurrentUser.ts";

export const useShowInstitutionColumn = () => {
    const { data: currentUser } = useCurrentUser();

    return computed(() => {
        const roles = currentUser.value?.userRoles ?? [];
        return roles.includes("SEB_SERVER_ADMIN");
    });
};
