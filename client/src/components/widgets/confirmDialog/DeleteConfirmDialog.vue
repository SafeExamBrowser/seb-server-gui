<template>
    <ConfirmDialog
        v-model="model"
        :title="title"
        :text="text"
        :detail-text="detailText"
        :confirm-label="confirmLabel"
        confirm-color="error"
        :loading="loading"
        :test-ids="testIds"
        @confirm="emit('confirm')"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";

import ConfirmDialog from "@/components/widgets/confirmDialog/ConfirmDialog.vue";

const model = defineModel<boolean>({ required: true });

const props = withDefaults(
    defineProps<{
        title: string;
        text: string;
        confirmLabel: string;
        detailText?: string;
        dataTestId?: string;
        loading?: boolean;
    }>(),
    { detailText: undefined, dataTestId: undefined },
);

const emit = defineEmits<{
    confirm: [];
}>();

const testIds = computed(() =>
    props.dataTestId
        ? {
              root: `${props.dataTestId}-delete-dialog`,
              title: `${props.dataTestId}-delete-dialog-title`,
              text: `${props.dataTestId}-delete-dialog-text`,
              cancel: `${props.dataTestId}-delete-cancel-button`,
              confirm: `${props.dataTestId}-delete-confirm-button`,
          }
        : undefined,
);
</script>
