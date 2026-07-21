<template>
    <BasicPage
        :title="$t('titles.createExam')"
        :bread-crumb="[
            {
                label: $t('titles.exams'),
                link: { name: '/(app)/exam/' },
            },
            {
                label: $t('titles.createExam'),
                link: { name: '/(app)/exam/create/' },
            },
            { label: store.currentStep.title },
        ]"
    >
        <template #PanelLeft>
            <StepperSidebar
                :title="$t('titles.createExam')"
                :current-step="store.currentStepIndex"
                :steps="store.stepperModel"
            />
        </template>
        <template #PanelMain>
            <div v-if="quizStore.selectedQuiz" class="pa-4 pb-0">
                <v-card class="bg-surface-tint" rounded="lg" border>
                    <SelectedQuizPreview :quiz="quizStore.selectedQuiz" />
                </v-card>
            </div>
            <component :is="stepComponents[store.currentStep.componentName]" />
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
import { watch, watchEffect } from "vue";
import { useRouter } from "vue-router";

import BasicPage from "@/components/layout/pages/BasicPage.vue";
import StepperFooterActions from "@/components/widgets/stepperVertical/StepperFooterActions.vue";
import StepperSidebar from "@/components/widgets/stepperVertical/StepperSidebar.vue";
import SelectedQuizPreview from "@/pages/(app)/exam/create/components/stepQuiz/components/SelectedQuizPreview.vue";
import { useStepQuizStore } from "@/pages/(app)/exam/create/components/stepQuiz/composables/store/useStepQuizStore.ts";
import { useCreateExam } from "@/pages/(app)/exam/create/composables/api/useCreateExam.ts";
import { useCreateExamWithURL } from "@/pages/(app)/exam/create/composables/api/useCreateExamWithURL";
import { useCreateExamStore } from "@/pages/(app)/exam/create/composables/store/useCreateExamStore";
import { stepComponents } from "@/pages/(app)/exam/create/types/types.ts";

defineProps<{
    createWithURL: boolean;
}>();

const store = useCreateExamStore();
const quizStore = useStepQuizStore();
const router = useRouter();
const { create: createExam, data: createExamResult } = useCreateExam();
const { createWithURL: createExamWithURL, data: createExamWithURLResult } =
    useCreateExamWithURL();

watchEffect(() => {
    if (!createExamResult.value) {
        return;
    }
    const { examId } = createExamResult.value;
    store.$reset();
    router.push({
        name: "/(app)/exam/[id]/",
        params: { id: examId },
    });
});

watchEffect(() => {
    if (!createExamWithURLResult.value) {
        return;
    }
    const { examId } = createExamWithURLResult.value;
    store.$reset();
    router.push({
        name: "/(app)/exam/[id]/",
        params: { id: examId },
    });
});

watch(
    () => store.currentStep.componentName,
    (componentName) => {
        if (componentName === "StepAssessmentTool") {
            quizStore.$reset();
        }
    },
);

const handleStepperNext = () => {
    store.increaseCurrentStepIndex();
};

const handleStepperPrev = () => {
    store.decreaseCurrentStepIndex();
};

const handleStepperFinish = async () => {
    if (store.createWithURL) {
        createExamWithURL(store.createExamWithURLPayload);
    } else {
        createExam(store.createExamPayload);
    }
};
</script>
