<template>
    <StepItem
        :title="$t('createTemplateExam.steps.clientGroup.title')"
        :subtitle="$t('createTemplateExam.steps.clientGroup.subtitle')"
    >
        <ClientGroupTable />
        <ScreenProctoringForm
            v-if="useScreenProctoringStore().enabled"
            class="mt-8"
        />
    </StepItem>
</template>

<script setup lang="ts">
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
</script>
