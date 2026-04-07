<template>
    <BasicPage
        :title="$t('titles.createTemplateExam')"
        :bread-crumb="[
            {
                label: $t('titles.createTemplateExam'),
                link: resolveRoutePath('CreateExamTemplateWizard'),
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
            <StepperVertical
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
import StepperVertical from "@/components/widgets/stepperVertical/StepperVertical.vue";
import { stepComponents } from "@/components/views/seb-server/exam-template/wizard/types";
import { useCreateExamTemplateStore } from "./composables/store/useCreateExamTemplateStore";
import { useCreateExamTemplate } from "./composables/api/useCreateExamTemplate";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { watchEffect } from "vue";
import { navigateToRoute, resolveRoutePath } from "@/router/navigation";

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

    navigateToRoute({ name: "ExamTemplateList" });
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
