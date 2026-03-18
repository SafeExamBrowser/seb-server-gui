import { ref, shallowRef } from "vue";
import type { ServerTablePaging } from "@/models/types";
import type { APIMessage } from "@/models/seb-server/apiMessages";
import type {
    BaseSettingsStore,
    DateFilterStore,
} from "@/components/views/seb-server/settings-navigation/store/storeContract.ts";

export function useBaseSettingsStore<T>(): BaseSettingsStore<T> {
    const searchField = ref<string | null>(null);
    const currentPagingOptions = ref<ServerTablePaging | undefined>(undefined);
    const selectedItem = shallowRef<T | null>(null);
    const importMessages = ref<APIMessage[]>([]);

    function setSearchField(value: string | null) {
        searchField.value = value;
    }

    function clearSearchField() {
        searchField.value = null;
    }

    function clearSelectedValues() {
        selectedItem.value = null;
        importMessages.value = [];
    }

    function resetSearchState() {
        clearSearchField();
        clearSelectedValues();
    }

    return {
        searchField,
        currentPagingOptions,
        selectedItem,
        importMessages,
        setSearchField,
        clearSearchField,
        clearSelectedValues,
        resetSearchState,
    };
}

export function useDateFilterSettingsStore<T>(): DateFilterStore<T> {
    const baseStore = useBaseSettingsStore<T>();
    const startDate = ref<number | null>(null);

    return {
        ...baseStore,
        startDate,
    };
}
