<template>
    <ConfirmDialog
        v-model="model"
        :icon="props.icon"
        :sub-title="props.subTitle"
        :title="$t(`${props.translationKeyPrefix}.confirm.title`)"
        :text="
            props.textProps
                ? $t(
                      `${props.translationKeyPrefix}.confirm.text`,
                      props.textProps,
                  )
                : $t(`${props.translationKeyPrefix}.confirm.text`)
        "
        :confirm-label="$t(`${props.translationKeyPrefix}.confirm.action`)"
        confirm-color="primary"
        @confirm="emit('confirm')"
    />
</template>

<script setup lang="ts">
import ConfirmDialog from "@/components/widgets/confirmDialog/ConfirmDialog.vue";

const model = defineModel<boolean>({ required: true });

const props = defineProps<{
    icon?: string;
    subTitle?: string;
    translationKeyPrefix: string;
    textProps?: Record<string, unknown>;
}>();

const emit = defineEmits<{
    confirm: [];
}>();
</script>
