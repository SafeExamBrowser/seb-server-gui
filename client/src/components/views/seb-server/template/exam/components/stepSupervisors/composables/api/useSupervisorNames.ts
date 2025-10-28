import { useFetch } from "@/composables/useFetch";
import { getSupervisorNames } from "@/services/seb-server/component-services/userAccountViewService";
import { useUserAccountStore } from "@/stores/authentication/authenticationStore";

export const useSupervisorNames = () => {
    const userAccountStore = useUserAccountStore();

    return useFetch(() =>
        getSupervisorNames({
            institutionId: userAccountStore.userAccount?.institutionId,
        }),
    );
};
