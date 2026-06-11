import { useFetch } from "@/composables/useFetch";
import { getUserAccountSupervisors } from "@/services/seb-server/userAccountService";
import { useCurrentUserQuery } from "@/composables/useCurrentUser";

export const useSupervisors = () => {
    const { data: currentUser } = useCurrentUserQuery();

    return useFetch(
        () =>
            getUserAccountSupervisors({
                institutionId: currentUser.value?.institutionId,
            }),
        { immediate: true },
    );
};
