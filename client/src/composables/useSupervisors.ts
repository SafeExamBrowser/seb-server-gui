import { useCurrentUserQuery } from "@/composables/useCurrentUser";
import { useFetch } from "@/composables/useFetch";
import { getUserAccountSupervisors } from "@/services/seb-server/userAccountService";

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
