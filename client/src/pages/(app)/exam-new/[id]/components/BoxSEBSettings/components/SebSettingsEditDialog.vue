<template>
    <BoxActionButton
        :icon="actionIcon"
        :label="
            readonly
                ? $t('examDetail.boxes.sebSettings.view')
                : $t('examDetail.boxes.sebSettings.edit')
        "
        @click="handleButtonEditClick"
    />

    <SebSettingsDialog
        v-model="dialogOpen"
        :context="context"
        :active-s-e-b-client-connection="activeSebClients"
        :dialog-title="dialogTitleKey"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import BoxActionButton from "@/components/widgets/BoxActionButton.vue";
import SebSettingsDialog from "@/components/widgets/sebSettings/SebSettingsDialog.vue";
import { SEBSettingsContext } from "@/components/widgets/sebSettings/types.ts";

const { examId, editDisabled, activeSebClients } = defineProps<{
    examId: number;
    editDisabled: boolean;
    activeSebClients: number;
}>();

const dialogOpen = ref(false);

const readonly = computed(() => editDisabled || activeSebClients > 0);

const actionIcon = computed(() => (readonly.value ? "mdi-eye" : "mdi-pencil"));

const dialogTitleKey = computed(() =>
    readonly.value
        ? "examDetail.boxes.sebSettings.view"
        : "examDetail.boxes.sebSettings.edit",
);

const context = computed<SEBSettingsContext>(() => ({
    isExam: true,
    containerId: String(examId),
    readonly: readonly.value,
}));

const handleButtonEditClick = () => {
    dialogOpen.value = true;
};
</script>
