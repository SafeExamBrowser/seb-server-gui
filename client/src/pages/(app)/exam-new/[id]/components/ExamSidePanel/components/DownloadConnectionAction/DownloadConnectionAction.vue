<template>
    <ActionButton
        :disabled="!downloadConnectionEnabled || !available || loading"
        :loading="loading"
        @click="handleClick"
    >
        {{ $t("examDetail.sidePanel.actions.downloadExamConnection") }}
    </ActionButton>

    <ConnectionConfigDialog
        v-model="dialogOpen"
        :connection-configurations="connectionConfigurations"
        @confirm="handleConnectionConfigConfirm"
    />
</template>

<script setup lang="ts">
import { computed } from "vue";

import { Exam } from "@/models/seb-server/exam.ts";
import ActionButton from "@/pages/(app)/exam-new/[id]/components/ExamSidePanel/components/ActionButton.vue";
import { GUIAction, useAbilities } from "@/services/ability.ts";

import ConnectionConfigDialog from "./components/ConnectionConfigDialog.vue";
import { useDownloadExamConnection } from "./composables/useDownloadExamConnection.ts";

const props = defineProps<{
    exam?: Exam;
}>();

const ability = useAbilities();

const downloadConnectionEnabled = computed(() =>
    ability.canDoExamAction(GUIAction.EDIT_SEB_SETTINGS, props.exam ?? null),
);

const {
    dialogOpen,
    connectionConfigurations,
    available,
    loading,
    start: startConnectionDownload,
    download: downloadConnection,
} = useDownloadExamConnection({
    exam: () => props.exam,
    enabled: () => downloadConnectionEnabled.value,
});

const handleClick = () => startConnectionDownload();

const handleConnectionConfigConfirm = (connectionId: number) =>
    downloadConnection(connectionId);
</script>
