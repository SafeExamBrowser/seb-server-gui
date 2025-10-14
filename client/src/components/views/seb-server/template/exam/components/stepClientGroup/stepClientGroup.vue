<template>
    <Step
        :title="$t('createTemplateExam.steps.clientGroup.title')"
        :subtitle="$t('createTemplateExam.steps.clientGroup.subtitle')"
    >
        <ClientGroupTable />
        <ScreenProctoringForm
            v-if="createExamTemplateStore.screenProctoringEnabled"
        />
    </Step>
</template>

<script setup lang="ts">
import { useCreateExamTemplateStore } from "@/components/views/seb-server/template/exam/composables/store/useCreateExamTemplateStore";

const createExamTemplateStore = useCreateExamTemplateStore();
</script>
