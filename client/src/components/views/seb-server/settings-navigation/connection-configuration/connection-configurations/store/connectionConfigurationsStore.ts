import { defineStore } from "pinia";
import { useBaseSettingsStore } from "@/components/views/seb-server/settings-navigation/store/useBaseSettingsStore.ts";
import { ConnectionConfiguration } from "@/models/seb-server/connectionConfiguration.ts";

export const useConnectionConfigurationsStore = defineStore(
    "connectionConfigurations",
    () => {
        return useBaseSettingsStore<ConnectionConfiguration>();
    },
);
