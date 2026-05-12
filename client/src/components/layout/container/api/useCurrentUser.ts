import { ref } from "vue";
import type { UserAccount } from "@/models/userAccount";
import { getPersonalUserAccount } from "@/services/seb-server/userAccountService";

const user = ref<UserAccount>();
const loading = ref(false);
const error = ref<string>();
let hasFetched = false;
let pendingRequest: Promise<void> | undefined;

const fetchCurrentUser = async (): Promise<void> => {
    if (pendingRequest) {
        return pendingRequest;
    }

    loading.value = true;
    error.value = undefined;

    pendingRequest = (async () => {
        try {
            user.value = await getPersonalUserAccount();
            hasFetched = true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
        } finally {
            loading.value = false;
            pendingRequest = undefined;
        }
    })();

    return pendingRequest;
};

export const clearCurrentUser = (): void => {
    user.value = undefined;
    error.value = undefined;
    hasFetched = false;
};

export const useCurrentUser = () => {
    if (!hasFetched && !pendingRequest) {
        fetchCurrentUser();
    }

    return {
        user,
        loading,
        error,
        refetch: fetchCurrentUser,
    };
};
