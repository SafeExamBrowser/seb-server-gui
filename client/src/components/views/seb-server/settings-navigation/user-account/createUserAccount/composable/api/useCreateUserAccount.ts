import { ref } from "vue";
import { createUserAccount } from "@/services/seb-server/userAccountService";
import type {
    CreateUserPar,
    SingleUserAccountResponse,
} from "@/models/userAccount";

export const useCreateUserAccount = () => {
    const loading = ref(false);
    const error = ref<string>();

    const submit = async (
        params: CreateUserPar,
    ): Promise<SingleUserAccountResponse | null> => {
        loading.value = true;
        error.value = undefined;

        try {
            return await createUserAccount(params);
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
            return null;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        submit,
    };
};
