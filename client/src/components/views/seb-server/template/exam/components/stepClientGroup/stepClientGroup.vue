<template>
    <Step
        :title="$t('createTemplateExam.steps.clientGroup.title')"
        :subtitle="$t('createTemplateExam.steps.clientGroup.subtitle')"
    >
        <ClientGroupTable />

        <!-- TODO @alain: show screen proctoring settings form here instead -->
        <div>
            screen proctoring:
            {{ createExamTemplateStore.screenProctoringEnabled }}
        </div>
    </Step>
</template>

<script setup lang="ts">
import { useCreateExamTemplateStore } from "@/components/views/seb-server/template/exam/composables/store/useCreateExamTemplateStore";

const createExamTemplateStore = useCreateExamTemplateStore();
</script>
