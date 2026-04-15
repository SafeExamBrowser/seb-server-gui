import { useFetch } from "@/composables/useFetch";
import { getSupervisorNames } from "@/services/seb-server/userAccountService";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";

export const useSupervisors = () =>
    useFetch(
        () =>
            getSupervisorNames({
                institutionId: useUserAccountStore().userAccount?.institutionId,
            }),
        { immediate: true },
    );
