import { defineStore } from "pinia";
import { ref } from "vue";

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
