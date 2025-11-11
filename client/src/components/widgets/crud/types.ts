import { Ref, UnwrapRef } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { DataTableHeader } from "vuetify";

export type GetFormFields<T> = (
    item: Ref<UnwrapRef<T>> | Ref<T>,
) => FormField[];

export type GetItem<T> = () => T;

export type CrudTableConfig<TItem, TTransient> = {
    name: string;
    title: string;
    headers: DataTableHeader<TItem>[];
    items: Ref<TItem[]>;
    getFormFields: GetFormFields<TTransient>;
    hasActions: (item: TItem) => boolean;
    createConfig: {
        title: string;
        allowed: Ref<boolean>;
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
