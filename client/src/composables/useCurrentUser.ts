import { ref } from "vue";
import type { UserAccount } from "@/models/userAccount";
import { getPersonalUserAccount } from "@/services/seb-server/userAccountService";

const user = ref<UserAccount>();
const loading = ref(false);
const error = ref<string>();
let hasFetched = false;
let pendingRequest: Promise<void> | undefined;

let generation = 0;

function startFetch(): Promise<void> {
    const fetchGeneration = ++generation;
    loading.value = true;
    error.value = undefined;

    const request = (async () => {
        try {
            const fetched = await getPersonalUserAccount();
            if (fetchGeneration === generation) {
                user.value = fetched;
                hasFetched = true;
            }
        } catch (err) {
            if (fetchGeneration === generation) {
                error.value =
                    err instanceof Error ? err.message : "Unknown error";
            }
        } finally {
            if (fetchGeneration === generation) {
                loading.value = false;
                pendingRequest = undefined;
            }
        }
    })();

    pendingRequest = request;
    return request;
}

export function clearCurrentUser(): void {
    generation++;
    user.value = undefined;
    error.value = undefined;
    loading.value = false;
    hasFetched = false;
    pendingRequest = undefined;
}

export function useCurrentUser() {
    if (!hasFetched && !pendingRequest) {
        void startFetch();
    }

    return {
        user,
        loading,
        error,
        refetch: startFetch,
    };
}
