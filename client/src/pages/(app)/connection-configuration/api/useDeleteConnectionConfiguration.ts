import { useMutation } from "@/composables/useMutation.ts";
import { deleteConnectionConfiguration } from "@/services/seb-server/connectionConfigurationService.ts";

export const useDeleteConnectionConfiguration = () => {
    const {
        mutateData: removeConnectionConfiguration,
        error,
        loading,
    } = useMutation(async (id: string) => {
        const response = await deleteConnectionConfiguration(id);

        if (response === null) {
            throw new Error("Failed to delete connection configuration.");
        }
    });

    const removeConnectionConfigurationFromItem = async (
        item: Record<string, unknown>,
    ) => {
        const id = item.id;

        if (typeof id !== "number") {
            throw new Error(
                "useDeleteConnectionConfiguration: row item is missing a numeric id",
            );
        }

        await removeConnectionConfiguration(id.toString());
    };

    return {
        removeConnectionConfiguration,
        removeConnectionConfigurationFromItem,
        error,
        loading,
    };
};
