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
            <template #next>
                <v-btn
                    color="primary"
                    :disabled="!stepItem.nextStepEnabled"
                    @click="handleNextClick"
                >
                    {{
                        stepItem.value === steps.length - 1
                            ? $t("general.saveButton")
                            : $t("general.nextButton")
                    }}
                </v-btn>
            </template>

            <template #prev>
                <v-btn
                    v-if="stepItem.value > 0"
                    variant="outlined"
                    @click="handlePrevClick"
                >
                    {{ $t("general.backButton") }}
                </v-btn>
            </template>
        </v-stepper-vertical-item>
    </v-stepper-vertical>
</template>

<script setup lang="ts">
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

const handleNextClick = () => {
    props.currentStep >= props.steps.length - 1 ? emit("finish") : emit("next");
};

const handlePrevClick = () => {
    emit("prev");
};
</script>
