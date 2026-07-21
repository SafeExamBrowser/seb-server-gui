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

    <v-dialog v-model="dialogOpen" persistent height="80vh" max-width="1200">
        <SebSettingsDialog
            :context="context"
            :active-s-e-b-client-connection="activeSebClients"
            :dialog-title="dialogTitleKey"
            @close-seb-settings-dialog="handleCloseSebSettingsDialog"
        />
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import BoxActionButton from "@/components/widgets/BoxActionButton.vue";
import SebSettingsDialog from "@/components/widgets/sebSettings/SebSettingsDialog.vue";
import { SEBSettingsContext } from "@/components/widgets/sebSettings/types.ts";
import * as sebSettingsService from "@/services/seb-server/sebSettingsService.ts";

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

const handleCloseSebSettingsDialog = async (apply: boolean) => {
    dialogOpen.value = false;

    if (apply) {
        await sebSettingsService.publish(String(examId), true);
        return;
    }

    await sebSettingsService.undoChanges(String(examId), true);
};
</script>
