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
                { label: currentStep.title },
            ]"
        >
            <template #PanelMain>
                <component
                    :is="stepComponents[currentStep.componentName]"
                    @ready="handleStepReady"
                />
            </template>
            <template #PanelAside>
                <Stepper
                    :steps="stepperSteps"
                    :current-step="currentStepIndex"
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
import * as constants from "@/utils/constants";
import {
    StepItemCreateTemplateExam,
    stepComponents,
} from "@/components/views/seb-server/template/exam/types";

// TODO @alain: move to store
const superVisorsReady = ref(false);

const steps: ComputedRef<StepItemCreateTemplateExam[]> = computed(() => [
    {
        componentName: "StepNaming",
        title: "Step: Naming", // TODO @alain: i18n
        nextStepEnabled: true,
    },
    {
        componentName: "StepSupervisors",
        title: "Step: Supervisors", // TODO @alain: i18n
        nextStepEnabled: superVisorsReady.value,
    },
    {
        componentName: "StepIndicators",
        title: "Step: Indicators", // TODO @alain: i18n
        nextStepEnabled: true,
    },
    {
        componentName: "StepClientGroup",
        title: "Step: Client Group", // TODO @alain: i18n
        nextStepEnabled: true,
    },
    {
        componentName: "StepSummary",
        title: "Step: Summary", // TODO @alain: i18n
        nextStepEnabled: true,
    },
]);

const currentStepIndex = ref(0);

const currentStep = computed(() => {
    const step = steps.value.at(currentStepIndex.value);

    if (!step) {
        throw new Error("Step not found");
    }

    return step;
});

const stepperSteps = computed(() => {
    return steps.value.map((step, index) => ({
        title: step.title,
        nextStepEnabled: step.nextStepEnabled,
        value: index,
    }));
});

const handleStepperNext = () => {
    if (currentStepIndex.value < steps.value.length - 1) {
        currentStepIndex.value++;
    }
};

const handleStepperPrev = () => {
    if (currentStepIndex.value > 0) {
        currentStepIndex.value--;
    }
};

const handleStepperFinish = () => {
    console.log("Wizard finished!");
};

const handleStepReady = () => {
    superVisorsReady.value = true;
};
</script>
