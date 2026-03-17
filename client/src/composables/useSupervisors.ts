import { useFetch } from "@/composables/useFetch";
import { getSupervisorNames } from "@/services/seb-server/userAccountService";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";

export const useSupervisors = () => {
    const userAccountStore = useUserAccountStore();

    return useFetch(() =>
        getSupervisorNames({
            institutionId: userAccountStore.userAccount?.institutionId,
        }),
    );
};
