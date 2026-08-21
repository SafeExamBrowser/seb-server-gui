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
import { computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import BasicPage from "@/components/layout/pages/BasicPage.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import StepperFooterActions from "@/components/widgets/stepperVertical/StepperFooterActions.vue";
import StepperSidebar from "@/components/widgets/stepperVertical/StepperSidebar.vue";
import { useCreateExamTemplateMutation } from "@/pages/(app)/exam-template/api/useCreateExamTemplateMutation.ts";
import { stepComponents } from "@/pages/(app)/exam-template/create/types/types.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

import { useCreateExamTemplateStore } from "./composables/store/useCreateExamTemplateStore.ts";

definePage({
    meta: {
        requiredComponent: "CREATE_EXAM_TEMPLATE",
    },
});

const {
    mutateAsync: createExamTemplate,
    isPending: createExamTemplateLoading,
    error: createMutationError,
} = useCreateExamTemplateMutation();
const createExamTemplateError = computed(() =>
    toAppErrorOrUndefined(createMutationError.value),
);

const store = useCreateExamTemplateStore();
const router = useRouter();

// abandoning the wizard must not leave the draft (and its temporary
// configuration-template id) in the app-lifetime stores
onUnmounted(() => {
    store.$reset();
});

const handleStepperNext = () => {
    store.increaseCurrentStepIndex();
};

const handleStepperPrev = () => {
    store.decreaseCurrentStepIndex();
};

const handleStepperFinish = async () => {
    let created;
    try {
        created = await createExamTemplate(store.examTemplate);
    } catch {
        return;
    }

    store.$reset();
    router.push({
        name: "/(app)/exam-template/[id]/",
        params: { id: created.id },
    });
};
</script>
