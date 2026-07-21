<template>
    <div class="d-flex flex-column h-100">
        <div
            class="flex-grow-1 overflow-y-auto px-4 pt-6 pb-3 d-flex flex-column ga-4"
            :style="{ minHeight: 0 }"
        >
            <ExamSidePanelInfo :exam="exam" />
        </div>

        <template v-if="exam">
            <v-divider />

            <div class="pa-4 d-flex flex-column ga-2">
                <TestRunAction :exam="exam" @toggle="handleTestRunToggle" />

                <MonitorExamAction :exam="exam" />

                <DownloadConnectionAction :exam="exam" />

                <SebLockAction
                    :exam="exam"
                    :seb-lock-active="sebLockActive"
                    @toggle="handleSebLockToggle"
                />

                <ExcludeFromDeletionAction
                    :exam="exam"
                    @toggle="handleExcludeFromDeletionToggle"
                />

                <DeleteExamAction :exam="exam" @delete="handleDeleteExam" />
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { Exam } from "@/models/seb-server/exam.ts";

import DeleteExamAction from "./components/DeleteExamAction.vue";
import DownloadConnectionAction from "./components/DownloadConnectionAction/DownloadConnectionAction.vue";
import ExamSidePanelInfo from "./components/ExamSidePanelInfo.vue";
import ExcludeFromDeletionAction from "./components/ExcludeFromDeletionAction.vue";
import MonitorExamAction from "./components/MonitorExamAction.vue";
import SebLockAction from "./components/SebLockAction/SebLockAction.vue";
import TestRunAction from "./components/TestRunAction.vue";

defineProps<{
    exam?: Exam;
    sebLockActive?: boolean;
}>();

const emit = defineEmits<{
    toggleTestRun: [];
    toggleSebLock: [];
    toggleExcludeFromDeletion: [];
    deleteExam: [];
}>();

const handleTestRunToggle = () => {
    emit("toggleTestRun");
};

const handleSebLockToggle = () => {
    emit("toggleSebLock");
};

const handleExcludeFromDeletionToggle = () => {
    emit("toggleExcludeFromDeletion");
};

const handleDeleteExam = () => {
    emit("deleteExam");
};
</script>
