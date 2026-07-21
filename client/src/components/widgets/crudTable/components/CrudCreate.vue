<template>
    <FormDialog
        icon-activator="mdi-plus-circle-outline"
        color-activator="primary"
        :disabled="props.disabled"
        :label-activator="props.label"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.createButton')"
        :form-id="props.formId"
        :get-form-fields="props.getFormFields"
        :get-item="props.getItem"
        :on-submit="props.createItem"
    />
</template>

<script setup lang="ts" generic="TItem, TTransient">
import { CrudTableConfig } from "@/components/widgets/crudTable/types";
import FormDialog from "@/components/widgets/formDialog/FormDialog.vue";

const props = defineProps<{
    label: string;
    formId: string;
    disabled?: boolean;
    getFormFields: CrudTableConfig<TItem, TTransient>["getFormFields"];
    getItem: () => TTransient;
    createItem: CrudTableConfig<
        TItem,
        TTransient
    >["createConfig"]["createItem"];
}>();
</script>
