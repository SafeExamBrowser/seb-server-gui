<template>
    <Step
        :title="$t('createTemplateExam.steps.supervisors.title')"
        :subtitle="$t('createTemplateExam.steps.supervisors.subtitle')"
    >
        <!-- TODO @alain: implement -->
        <div>Step Supervisors</div>
        <v-btn @click="handleButtonReadyClick">Ready!</v-btn>
        <div style="height: 2000px; background: salmon">
            Demo: Very long content
        </div>
    </Step>
</template>

<script setup lang="ts">
import { useStepSupervisorsStore } from "./store";

const store = useStepSupervisorsStore();

const handleButtonReadyClick = () => {
    store.markAsReady();
};
</script>
