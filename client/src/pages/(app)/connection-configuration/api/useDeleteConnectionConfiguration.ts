import type { Ref } from "vue";
import { ref } from "vue";
import { ConnectionConfigurations } from "@/models/seb-server/connectionConfiguration.ts";
import { deleteConnectionConfiguration } from "@/services/seb-server/connectionConfigurationService.ts";

export const useDeleteConnectionConfiguration = (
    connectionConfigurations: Ref<ConnectionConfigurations | undefined>,
) => {
    const loading = ref(false);
    const error = ref<string>();

    const removeConnectionConfiguration = async (
        id: string,
    ): Promise<boolean> => {
        loading.value = true;
        error.value = undefined;

        try {
            const response = await deleteConnectionConfiguration(id);

            if (response === null) {
                throw new Error("Failed to delete connection configuration.");
            }

            if (connectionConfigurations.value?.content) {
                connectionConfigurations.value.content =
                    connectionConfigurations.value.content.filter(
                        (connectionConfiguration) =>
                            connectionConfiguration.id.toString() !== id,
                    );
            }

            return true;
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
            return false;
        } finally {
            loading.value = false;
        }
    };

    const removeConnectionConfigurationFromItem = async (
        item: Record<string, unknown>,
    ): Promise<boolean> => {
        const id = item.id;

        if (typeof id !== "number") {
            error.value = "Invalid Connection Configuration identifier.";
            return false;
        }

        return removeConnectionConfiguration(id.toString());
    };

    return {
        removeConnectionConfiguration,
        removeConnectionConfigurationFromItem,
        loading,
        error,
    };
};
