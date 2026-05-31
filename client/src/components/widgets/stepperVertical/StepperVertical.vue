<template>
    <v-stepper-vertical :model-value="currentStep + 1">
        <v-stepper-vertical-item
            v-for="stepItem in steps"
            :key="stepItem.value"
            :value="stepItem.value + 1"
            :title="stepItem.title"
            :complete="stepItem.value < currentStep"
            elevation="0"
            color="primary"
        >
            <template #actions></template>
        </v-stepper-vertical-item>
    </v-stepper-vertical>
</template>

<script setup lang="ts">
import { StepItem } from "./types";

defineProps<{
    currentStep: number;
    steps: StepItem[];
}>();
</script>
