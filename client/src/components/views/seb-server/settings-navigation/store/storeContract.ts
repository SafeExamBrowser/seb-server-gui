import type { Ref, ShallowRef } from "vue";
import type { ServerTablePaging } from "@/models/types";
import type { APIMessage } from "@/models/seb-server/apiMessages";

export interface BaseSettingsStore<T> {
    searchField: Ref<string | null>;
    currentPagingOptions: Ref<ServerTablePaging | undefined>;
    selectedItem: ShallowRef<T | null>;
    importMessages: Ref<APIMessage[]>;
    setSearchField: (value: string | null) => void;
    clearSearchField: () => void;
    clearSelectedValues: () => void;
    resetSearchState: () => void;
}

export interface DateFilterStore<T> extends BaseSettingsStore<T> {
    startDate: Ref<number | null>;
}

export interface BaseSettingsStoreView<T> {
    searchField: string | null;
    currentPagingOptions: ServerTablePaging | undefined;
    selectedItem: T | null;
    importMessages: APIMessage[];
    setSearchField: (value: string | null) => void;
    clearSearchField: () => void;
    clearSelectedValues: () => void;
    resetSearchState: () => void;
}

export interface DateFilterStoreView<T> extends BaseSettingsStoreView<T> {
    startDate: number | null;
}
