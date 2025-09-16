<template>
    <!-- TODO: 63vh here is arbitrary (inspired by the ImportWizard). Shouldn't the container in the main layout grow to fill the height so we could do "fill-height" here? -->
    <div style="height: 63vh">
        <BasicPage
            :title="$t('titles.createTemplateExam')"
            :breadcrumb="[
                {
                    label: $t('titles.createTemplate'),
                    link: constants.CREATE_EXAM_TEMPLATE_ROUTE,
                },
                { label: currentStepTitle },
            ]"
        >
            <template #PanelMain>
                <!-- TODO @alain: replace with the respective content -->
                Current step: {{ currentStepTitle }}
            </template>
            <template #PanelAside>
                <Stepper
                    :steps="steps"
                    :current-step="currentStep"
                    @next="handleStepperNext"
                    @prev="handleStepperPrev"
                    @finish="handleStepperFinish"
                />
            </template>
        </BasicPage>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import Stepper from "@/components/widgets/stepper/Stepper.vue";
import { StepItem } from "@/components/widgets/stepper/types";
import * as constants from "@/utils/constants";

// TODO @alain: use correct values, i18n
const steps: StepItem[] = [
    {
        value: 0,
        title: "Step One",
    },
    {
        value: 1,
        title: "Step Two",
    },
    {
        value: 2,
        title: "Step Three",
    },
];

// TODO @alain: move to store
const currentStep = ref(0);

const currentStepTitle = computed(() => {
    const step = steps.find((s) => s.value === currentStep.value);

    if (!step) {
        throw new Error("Step not found");
    }

    return step.title;
});

const handleStepperNext = () => {
    if (currentStep.value < steps.length - 1) {
        currentStep.value++;
    }
};

const handleStepperPrev = () => {
    if (currentStep.value > 0) {
        currentStep.value--;
    }
};

const handleStepperFinish = () => {
    console.log("Wizard finished!");
};
</script>
