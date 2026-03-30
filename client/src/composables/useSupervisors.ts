import { useFetch } from "@/composables/useFetch";
import { getSupervisorNames } from "@/services/seb-server/userAccountService";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import { onMounted } from "vue";

export const useSupervisors = () => {
    const userAccountStore = useUserAccountStore();
    const supervisorsFetch = useFetch(() =>
        getSupervisorNames({
            institutionId: userAccountStore.userAccount?.institutionId,
        }),
    );
    onMounted(supervisorsFetch.fetchData);
    return supervisorsFetch;
};
