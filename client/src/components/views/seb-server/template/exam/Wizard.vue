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
            <LoadingFallbackComponent
                :loading="createExamTemplateLoading"
                :errors="
                    createExamTemplateError
                        ? [createExamTemplateError]
                        : undefined
                "
            >
                <component
                    :is="stepComponents[store.currentStep.componentName]"
                />
            </LoadingFallbackComponent>
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
import { useCreateExamTemplateStore } from "./composables/store/useCreateExamTemplateStore";
import { useCreateExamTemplate } from "./composables/api/useCreateExamTemplate";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { watchEffect } from "vue";

const {
    create: createExamTemplate,
    loading: createExamTemplateLoading,
    error: createExamTemplateError,
    data: createdExamTemplate,
} = useCreateExamTemplate();

const store = useCreateExamTemplateStore();

watchEffect(() => {
    if (!createdExamTemplate.value) {
        return;
    }

    store.$reset();

    // TODO @alain: properly handle success case (redirect?)
    console.log("Exam template was successfully created!");
    console.log(createdExamTemplate.value);
});

const handleStepperNext = () => {
    store.increaseCurrentStepIndex();
};

const handleStepperPrev = () => {
    store.decreaseCurrentStepIndex();
};

const handleStepperFinish = async () => {
    createExamTemplate(store.examTemplate);
};
</script>
