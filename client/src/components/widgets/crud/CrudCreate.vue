<template>
    <CrudDialog
        icon-activator="mdi-plus-circle-outline"
        color-activator="primary"
        :label-activator="props.label"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.createButton')"
        :form-id="props.formId"
        :get-form-fields="props.getFormFields"
        :get-item="props.getItem"
        @submit="props.createItem"
    />
</template>

<script setup lang="ts" generic="TItem, TTransient">
import CrudDialog from "./CrudDialog.vue";
import { CrudTableConfig } from "./types";

const props = defineProps<{
    label: string;
    formId: string;
    getFormFields: CrudTableConfig<TItem, TTransient>["getFormFields"];
    getItem: () => TTransient;
    createItem: CrudTableConfig<
        TItem,
        TTransient
    >["createConfig"]["createItem"];
}>();
</script>
