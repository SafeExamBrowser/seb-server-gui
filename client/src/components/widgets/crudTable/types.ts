import { MaybeRef, Ref, UnwrapRef } from "vue";
import { DataTableHeader } from "vuetify";

import { FormField } from "@/components/widgets/formBuilder/types";

export type CrudDeleteConfig<TItem> = {
    deleteItem: (item: TItem) => Promise<void>;
    confirm?: {
        title: string;
        text: string;
        confirmLabel: string;
        getDetailText?: (item: TItem) => string | undefined;
    };
};

export type CrudTableAccess = {
    hidden: MaybeRef<boolean>;
    disabled: MaybeRef<boolean>;
};

export type CrudTableConfig<TItem, TTransient> = {
    name: string;
    title: string;
    headers: DataTableHeader[];
    access?: CrudTableAccess;
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
