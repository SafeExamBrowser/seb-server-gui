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
                <component :is="stepComponents[currentStep.componentName]" />
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

const steps: StepItemCreateTemplateExam[] = [
    {
        componentName: "StepNaming",
        title: "Step: Naming", // TODO @alain: i18n
    },
    {
        componentName: "StepSupervisors",
        title: "Step: Supervisors", // TODO @alain: i18n
    },
    {
        componentName: "StepIndicators",
        title: "Step: Indicators", // TODO @alain: i18n
    },
    {
        componentName: "StepClientGroup",
        title: "Step: Client Group", // TODO @alain: i18n
    },
    {
        componentName: "StepSummary",
        title: "Step: Summary", // TODO @alain: i18n
    },
];

// TODO @alain: move to store
const currentStepIndex = ref(0);

const currentStep = computed(() => {
    const step = steps.at(currentStepIndex.value);

    if (!step) {
        throw new Error("Step not found");
    }

    return step;
});

const stepperSteps = computed(() => {
    return steps.map((step, index) => ({
        title: step.title,
        value: index,
    }));
});

const handleStepperNext = () => {
    if (currentStepIndex.value < steps.length - 1) {
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
</script>
