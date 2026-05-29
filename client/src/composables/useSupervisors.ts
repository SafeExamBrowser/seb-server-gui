import { useFetch } from "@/composables/useFetch";
import { getUserAccountSupervisors } from "@/services/seb-server/userAccountService";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";

export const useSupervisors = () =>
    useFetch(
        () =>
            getUserAccountSupervisors({
                institutionId: useUserAccountStore().userAccount?.institutionId,
            }),
        { immediate: true },
    );
