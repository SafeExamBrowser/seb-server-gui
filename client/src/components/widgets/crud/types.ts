import { Ref, UnwrapRef } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { DataTableHeader } from "vuetify";
import { MaybeRef } from "@vueuse/core";

export type CrudTableConfig<TItem, TTransient> = {
    name: string;
    title: string;
    headers: DataTableHeader<TItem>[];
    items: Ref<TItem[]>;
    getFormFields: (
        item: Ref<UnwrapRef<TTransient>> | Ref<TTransient>,
    ) => FormField[];
    hasActions?: ((item: TItem) => boolean) | undefined;
    createConfig: {
        title: string;
        allowed: MaybeRef<boolean>;
        getNewItem: () => TTransient;
        createItem: (item: TTransient) => void;
    };
    updateConfig: {
        title: string;
        getExistingItem: (item: TItem) => TTransient;
        updateItem: (item: TTransient) => void;
    };
    deleteConfig: {
        deleteItem: (item: TItem) => void;
    };
};
