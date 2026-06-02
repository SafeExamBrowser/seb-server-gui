import { useFetch } from "@/composables/useFetch";
import { getUserAccountSupervisors } from "@/services/seb-server/userAccountService";
import { getCurrentUser } from "@/composables/useCurrentUser";

export const useSupervisors = () =>
    useFetch(
        () =>
            getUserAccountSupervisors({
                institutionId: getCurrentUser()?.institutionId,
            }),
        { immediate: true },
    );
