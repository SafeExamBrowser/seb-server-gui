<template>
    <CrudDialog
        icon-activator="mdi-pencil"
        color-activator="medium-emphasis"
        size-activator="small"
        :label-activator="props.label"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.saveButton')"
        form-id="indicator-form"
        :get-form-fields="getFormFields"
        :get-item="props.getItem"
        @submit="handleUpdate"
    />
</template>

<script setup lang="ts" generic="T">
import CrudDialog from "@/components/widgets/crud/CrudDialog.vue";

import { GetFormFields, GetItem } from "@/components/widgets/crud/types";

const props = defineProps<{
    label: string;
    getFormFields: GetFormFields<T>;
    getItem: GetItem<T>;
    updateItem: (item: T) => void;
}>();

const handleUpdate = (item: T) => {
    props.updateItem(item);
};
</script>
