import { defineStore } from "pinia";
import { ref } from "vue";
import { ServerTablePaging } from "@/models/types";
import { ConnectionConfiguration } from "@/models/seb-server/connectionConfiguration";
import { APIMessage } from "@/models/seb-server/apiMessages";

export const useConnectionConfigurationStore = defineStore(
    "connectionConfiguration",
    () => {
        const searchField = ref<string | null>(null);
        const currentPagingOptions = ref<ServerTablePaging>();

        const selectedConnectionConfiguration =
            ref<ConnectionConfiguration | null>(null);
        const importMessages = ref<APIMessage[]>([]);

        function clearSelectedValues() {
            selectedConnectionConfiguration.value = null;
            importMessages.value = [];
        }

        return {
            searchField,
            currentPagingOptions,
            selectedConnectionConfiguration,
            importMessages,
            clearSelectedValues,
        };
    },
);
