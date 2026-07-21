import { MaybeRef, Ref, UnwrapRef } from "vue";
import { DataTableHeader } from "vuetify";

import { FormField } from "@/components/widgets/formBuilder/types";

export type CrudDeleteConfig<TItem> = {
    deleteItem: (item: TItem) => Promise<void>;
    confirm?: {
        translationKeyPrefix: string;
        getDetailText?: (item: TItem) => string | undefined;
    };
};

export type CrudTableConfig<TItem, TTransient> = {
    name: string;
    title: string;
    headers: DataTableHeader[];
    items: MaybeRef<TItem[]>;
    getFormFields: (
        item: Ref<UnwrapRef<TTransient>> | Ref<TTransient>,
    ) => FormField[];
    hasActions?: ((item: TItem) => boolean) | undefined;
    createConfig: {
        title: string;
        allowed: MaybeRef<boolean>;
        getItem: () => TTransient;
        createItem: (item: TTransient) => Promise<void>;
    };
    updateConfig: {
        title: string;
        getItem: (item: TItem) => TTransient;
        updateItem: (item: TTransient) => Promise<void>;
    };
    deleteConfig: CrudDeleteConfig<TItem>;
};
