import { useMutation } from "@/composables/useMutation.ts";
import {
    activateConnectionConfiguration,
    deactivateConnectionConfiguration,
} from "@/services/seb-server/connectionConfigurationService.ts";

export const useToggleConnectionConfigurationStatus = () => {
    const {
        mutateData: changeConnectionConfigurationStatus,
        error,
        loading,
    } = useMutation(async (id: string, active: boolean) => {
        const response = active
            ? await deactivateConnectionConfiguration(id)
            : await activateConnectionConfiguration(id);

        if (response === null) {
            throw new Error(
                "Failed to change connection configuration status.",
            );
        }
    });

    const changeConnectionConfigurationStatusFromItem = async (
        item: Record<string, unknown>,
    ) => {
        const id = item.id;
        const active = item.active;

        if (typeof id !== "number") {
            throw new Error(
                "useToggleConnectionConfigurationStatus: row item is missing a numeric id",
            );
        }

        if (typeof active !== "boolean") {
            throw new Error(
                "useToggleConnectionConfigurationStatus: row item is missing a boolean active flag",
            );
        }

        await changeConnectionConfigurationStatus(id.toString(), active);
    };

    return {
        changeConnectionConfigurationStatus,
        toggleConnectionConfigurationStatusFromItem:
            changeConnectionConfigurationStatusFromItem,
        error,
        loading,
    };
};
