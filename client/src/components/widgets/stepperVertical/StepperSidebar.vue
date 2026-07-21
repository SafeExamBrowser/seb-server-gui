<template>
    <div class="pa-6 mt-2">
        <div
            class="text-body-small text-medium-emphasis text-uppercase mb-3 font-weight-bold"
        >
            {{ title }}
        </div>
        <v-progress-linear
            :model-value="progress"
            color="primary"
            height="6"
            rounded
            class="mt-2 mb-1"
        />
        <div
            class="text-body-small text-medium-emphasis font-weight-medium mt-2 mb-4"
        >
            {{
                $t("general.stepProgress", {
                    current: currentStep + 1,
                    total: steps.length,
                })
            }}
        </div>
        <v-divider class="mb-2" />
        <StepperVertical :current-step="currentStep" :steps="steps" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import StepperVertical from "./StepperVertical.vue";
import { StepItem } from "./types";

const props = defineProps<{
    title: string;
    currentStep: number;
    steps: StepItem[];
}>();

const progress = computed(
    () => ((props.currentStep + 1) / props.steps.length) * 100,
);
</script>
