<template>
    <BasicPage
        :title="$t('titles.createTemplateExam')"
        :bread-crumb="[
            {
                label: $t('titles.examTemplateList'),
                link: { name: '/(app)/exam-template/' },
            },
            {
                label: $t('titles.createTemplateExam'),
                link: { name: '/(app)/exam-template/create/' },
            },
            { label: store.currentStep.title },
        ]"
    >
        <template #PanelLeft>
            <StepperSidebar
                :title="$t('titles.createTemplateExam')"
                :current-step="store.currentStepIndex"
                :steps="store.stepperModel"
            />
        </template>
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
        <template #PanelFooter>
            <StepperFooterActions
                :current-step="store.currentStepIndex"
                :steps="store.stepperModel"
                @next="handleStepperNext"
                @prev="handleStepperPrev"
                @finish="handleStepperFinish"
            />
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import StepperSidebar from "@/components/widgets/stepperVertical/StepperSidebar.vue";
import StepperFooterActions from "@/components/widgets/stepperVertical/StepperFooterActions.vue";
import { stepComponents } from "@/pages/(app)/exam-template/create/types/types.ts";
import { useCreateExamTemplateStore } from "./composables/store/useCreateExamTemplateStore.ts";
import { useCreateExamTemplate } from "./composables/api/useCreateExamTemplate.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { watchEffect } from "vue";
import { useRouter } from "vue-router";

const {
    create: createExamTemplate,
    loading: createExamTemplateLoading,
    error: createExamTemplateError,
    data: createdExamTemplate,
} = useCreateExamTemplate();

const store = useCreateExamTemplateStore();
const router = useRouter();

watchEffect(() => {
    if (!createdExamTemplate.value) {
        return;
    }
    store.$reset();
    router.push({ name: "/(app)/exam-template/" });
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
