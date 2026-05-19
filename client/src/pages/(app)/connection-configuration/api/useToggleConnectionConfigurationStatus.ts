import { notify } from "@/services/notifications/notify.ts";
import type { Ref } from "vue";
import { ref } from "vue";
import { ConnectionConfigurations } from "@/models/seb-server/connectionConfiguration.ts";
import {
    activateConnectionConfiguration,
    deactivateConnectionConfiguration,
} from "@/services/seb-server/connectionConfigurationService.ts";

export const useToggleConnectionConfigurationStatus = (
    connectionConfigurations: Ref<ConnectionConfigurations | undefined>,
) => {
    const loading = ref(false);

    const changeConnectionConfigurationStatus = async (
        id: string,
        active: boolean,
    ): Promise<boolean> => {
        loading.value = true;

        try {
            const response = active
                ? await deactivateConnectionConfiguration(id)
                : await activateConnectionConfiguration(id);

            if (response === null) {
                throw new Error(
                    "Failed to change connection configuration status.",
                );
            }

            if (connectionConfigurations.value?.content) {
                connectionConfigurations.value.content =
                    connectionConfigurations.value.content.map(
                        (connectionConfiguration) =>
                            connectionConfiguration.id.toString() === id
                                ? {
                                      ...connectionConfiguration,
                                      active: !active,
                                  }
                                : connectionConfiguration,
                    );
            }

            return true;
        } catch (err) {
            notify.serverError(err, {
                contextLabel: "connectionconfiguration",
            });
            return false;
        } finally {
            loading.value = false;
        }
    };

    const changeConnectionConfigurationStatusFromItem = async (
        item: Record<string, unknown>,
    ): Promise<boolean> => {
        const id = item.id;
        const active = item.active;

        if (typeof id !== "number") {
            notify.serverError(
                new Error("Invalid connection config identifier."),
            );
            return false;
        }

        if (typeof active !== "boolean") {
            notify.serverError(new Error("Invalid connection config status."));
            return false;
        }

        return changeConnectionConfigurationStatus(id.toString(), active);
    };

    return {
        changeConnectionConfigurationStatus,
        toggleConnectionConfigurationStatusFromItem:
            changeConnectionConfigurationStatusFromItem,
        loading,
    };
};
