import { ref } from "vue";
import { createConnectionConfiguration } from "@/services/seb-server/connectionConfigurationService";
import type {
    ConnectionConfiguration,
    CreateConnectionConfigurationPar,
} from "@/models/seb-server/connectionConfiguration";

export const useCreateConnectionConfiguration = () => {
    const loading = ref(false);
    const error = ref<string | undefined>(undefined);

    const submit = async (
        params: CreateConnectionConfigurationPar,
    ): Promise<ConnectionConfiguration | null> => {
        loading.value = true;
        error.value = undefined;
        try {
            return await createConnectionConfiguration(params);
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
            return null;
        } finally {
            loading.value = false;
        }
    };

    return { loading, error, submit };
};
