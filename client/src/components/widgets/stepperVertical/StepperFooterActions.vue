<template>
    <div class="d-flex align-center justify-end ga-3 px-6 py-4">
        <v-btn v-if="currentStep > 0" variant="outlined" @click="emit('prev')">
            {{ $t("general.backButton") }}
        </v-btn>
        <v-btn
            color="primary"
            :disabled="!currentStepEnabled"
            @click="handleNext"
        >
            {{ isLast ? $t("general.saveButton") : $t("general.nextButton") }}
        </v-btn>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { StepItem } from "./types";

const props = defineProps<{
    currentStep: number;
    steps: StepItem[];
}>();

const emit = defineEmits<{
    next: [];
    prev: [];
    finish: [];
}>();

const isLast = computed(() => props.currentStep >= props.steps.length - 1);

const currentStepEnabled = computed(() => {
    const step = props.steps[props.currentStep];
    return step ? step.nextStepEnabled : false;
});

const handleNext = () => {
    if (isLast.value) {
        emit("finish");
        return;
    }
    emit("next");
};
</script>
