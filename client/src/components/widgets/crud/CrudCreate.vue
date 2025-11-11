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
        @submit="handleCreate"
    />
</template>

<script setup lang="ts" generic="T">
import CrudDialog from "@/components/widgets/crud/CrudDialog.vue";
import { GetFormFields, GetItem } from "@/components/widgets/crud/types";

const props = defineProps<{
    label: string;
    formId: string;
    getFormFields: GetFormFields<T>;
    getItem: GetItem<T>;
    createItem: (item: T) => void;
}>();

const handleCreate = (item: T) => {
    props.createItem(item);
};
</script>
