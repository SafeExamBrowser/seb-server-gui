<template>
    <ConfirmDialog
        v-model="model"
        :title="active ? deactivate.title : activate.title"
        :text="active ? deactivate.text : activate.text"
        :confirm-label="active ? deactivate.action : activate.action"
        :confirm-color="active ? 'error' : 'success'"
        :test-ids="testIds"
        @confirm="emit('confirm')"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";

import ConfirmDialog from "@/components/widgets/confirmDialog/ConfirmDialog.vue";

export type StatusDialogTexts = {
    title: string;
    text: string;
    action: string;
};

const model = defineModel<boolean>({ required: true });

const props = withDefaults(
    defineProps<{
        active: boolean;
        activate: StatusDialogTexts;
        deactivate: StatusDialogTexts;
        dataTestId?: string;
    }>(),
    { dataTestId: undefined },
);

const emit = defineEmits<{
    confirm: [];
}>();

const testIds = computed(() =>
    props.dataTestId
        ? {
              root: `${props.dataTestId}-status-dialog`,
              title: `${props.dataTestId}-status-dialog-title`,
              text: `${props.dataTestId}-status-dialog-text`,
              cancel: `${props.dataTestId}-status-cancel-button`,
              confirm: `${props.dataTestId}-status-confirm-button`,
          }
        : undefined,
);
</script>
