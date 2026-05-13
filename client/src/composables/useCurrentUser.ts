import { useFetch } from "@/composables/useFetch";
import type { UserAccount } from "@/models/userAccount";
import { getPersonalUserAccount } from "@/services/seb-server/userAccountService";

const {
    data: user,
    loading,
    error,
    fetchData,
} = useFetch<UserAccount>(getPersonalUserAccount);

export function clearCurrentUser(): void {
    user.value = undefined;
    error.value = undefined;
    loading.value = false;
}

export function useCurrentUser() {
    if (
        user.value === undefined &&
        !loading.value &&
        error.value === undefined
    ) {
        void fetchData();
    }

    return {
        user,
        loading,
        error,
        refetch: fetchData,
    };
}
