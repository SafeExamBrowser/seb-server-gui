<template>
    <ConfirmDialog
        v-model="model"
        :title="$t(`${translationKeyPrefix}.deleteDialog.title`)"
        :text="$t(`${translationKeyPrefix}.deleteDialog.text`)"
        :detail-text="detailText"
        :confirm-label="$t(`${translationKeyPrefix}.deleteDialog.action`)"
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
        detailText?: string;
        // TODO @andrei: avoid programmatic translation key generation:
        // - this is inflexible (translations need to have a certain shape)
        // - this mmakes it very hard to refactor translation keys (search and replace is impossible)
        // => accept fully translated strings instead
        translationKeyPrefix: string;
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
