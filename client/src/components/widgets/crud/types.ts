import { Ref, UnwrapRef } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";

export type GetFormFields<T> = (
    item: Ref<UnwrapRef<T>> | Ref<T>,
) => FormField[];

export type GetItem<T> = () => T;
