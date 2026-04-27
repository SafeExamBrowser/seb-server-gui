<template>
    <FormDialog
        icon-activator="mdi-pencil"
        color-activator="medium-emphasis"
        size-activator="small"
        :label-activator="props.label"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.saveButton')"
        :form-id="props.formId"
        :get-form-fields="getFormFields"
        :get-item="props.getItem"
        :on-submit="props.updateItem"
    />
</template>

<script setup lang="ts" generic="TItem, TTransient">
import FormDialog from "@/components/widgets/formDialog/FormDialog.vue";
import { CrudTableConfig } from "@/components/widgets/crudTable/types";

const props = defineProps<{
    label: string;
    formId: string;
    getFormFields: CrudTableConfig<TItem, TTransient>["getFormFields"];
    getItem: () => TTransient;
    updateItem: CrudTableConfig<
        TItem,
        TTransient
    >["updateConfig"]["updateItem"];
}>();
</script>
