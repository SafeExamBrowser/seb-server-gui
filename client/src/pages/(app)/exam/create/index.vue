<template>
    <CreateExamStepper :create-with-u-r-l="store.initStore(false)" />
</template>

<script setup lang="ts">
import CreateExamStepper from "@/pages/(app)/exam/create/components/CreateExamStepper.vue";
import { useStepAssessmentToolStore } from "@/pages/(app)/exam/create/components/stepAssessmentTool/composables/store/useStepAssessmentToolStore.ts";
import { useStepQuizStore } from "@/pages/(app)/exam/create/components/stepQuiz/composables/store/useStepQuizStore.ts";
import { useCreateExamStore } from "@/pages/(app)/exam/create/composables/store/useCreateExamStore";

const store = useCreateExamStore();

// re-fetch on every navigation so tools created in the meantime show up
useStepAssessmentToolStore().fetchAssessmentTools();
// likewise force a fresh LMS quiz lookup instead of the backend's cached search
useStepQuizStore().searchInitialized = false;
</script>
