import { ref } from "vue";
import type { UserAccount } from "@/models/userAccount";
import { getPersonalUserAccount } from "@/services/seb-server/userAccountService";

const user = ref<UserAccount>();
const loading = ref(false);
const error = ref<string>();
let hasFetched = false;
let pendingRequest: Promise<void> | null = null;

const fetchCurrentUser = async (): Promise<void> => {
    if (pendingRequest) {
        return pendingRequest;
    }

    loading.value = true;
    error.value = undefined;

    const request: Promise<void> = (async () => {
        try {
            const result = await getPersonalUserAccount();
            if (pendingRequest !== request) return;
            user.value = result;
            hasFetched = true;
        } catch (err) {
            if (pendingRequest !== request) return;
            error.value = err instanceof Error ? err.message : "Unknown error";
        } finally {
            if (pendingRequest === request) {
                loading.value = false;
                pendingRequest = null;
            }
        }
    })();
    pendingRequest = request;

    return pendingRequest;
};

export const clearCurrentUser = (): void => {
    user.value = undefined;
    error.value = undefined;
    loading.value = false;
    hasFetched = false;
    pendingRequest = null;
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
