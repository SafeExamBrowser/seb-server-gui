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
import ScreenProctoringForm from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/screenProctoringForm/ScreenProctoringForm.vue";
import ClientGroupTable from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/clientGroupTable/ClientGroupTable.vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
</script>
