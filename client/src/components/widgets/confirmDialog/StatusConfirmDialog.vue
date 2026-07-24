<template>
    <ConfirmDialog
        v-model="model"
        :title="
            active
                ? $t(`${translationKeyPrefix}.statusDialog.deactivateTitle`)
                : $t(`${translationKeyPrefix}.statusDialog.activateTitle`)
        "
        :text="
            active
                ? $t(`${translationKeyPrefix}.statusDialog.deactivateText`)
                : $t(`${translationKeyPrefix}.statusDialog.activateText`)
        "
        :confirm-label="
            active
                ? $t(`${translationKeyPrefix}.statusDialog.deactivateAction`)
                : $t(`${translationKeyPrefix}.statusDialog.activateAction`)
        "
        :confirm-color="active ? 'error' : 'success'"
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
        active: boolean;
        translationKeyPrefix: string;
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
