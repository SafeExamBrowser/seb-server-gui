<template>
    <StepItem
        :title="$t('createTemplateExam.steps.clientGroup.title')"
        :subtitle="$t('createTemplateExam.steps.clientGroup.subtitle')"
    >
        <div class="d-flex flex-column ga-8">
            <ScreenProctoringForm v-if="useScreenProctoringStore().enabled" />
            <ClientGroupTable />
        </div>
    </StepItem>
</template>

<script setup lang="ts">
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
</script>
