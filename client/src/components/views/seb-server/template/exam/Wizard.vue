<template>
    <BasicPage
        :title="$t('titles.createTemplateExam')"
        :breadcrumb="[
            {
                label: $t('titles.createTemplate'),
                link: constants.CREATE_EXAM_TEMPLATE_ROUTE,
            },
            { label: store.currentStep.title },
        ]"
    >
        <template #PanelMain>
            <component :is="stepComponents[store.currentStep.componentName]" />
        </template>
        <template #PanelAside>
            <Stepper
                :steps="store.stepperModel"
                :current-step="store.currentStepIndex"
                @next="handleStepperNext"
                @prev="handleStepperPrev"
                @finish="handleStepperFinish"
            />
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import Stepper from "@/components/widgets/stepper/Stepper.vue";
import * as constants from "@/utils/constants";
import { stepComponents } from "@/components/views/seb-server/template/exam/types";
import { useCreateExamTemplateStore } from "./store";

const store = useCreateExamTemplateStore();

const handleStepperNext = () => {
    store.increaseCurrentStepIndex();
};

const handleStepperPrev = () => {
    store.decreaseCurrentStepIndex();
};

const handleStepperFinish = () => {
    // TODO @alain: implement
    console.log("Wizard finished!");
};
</script>
