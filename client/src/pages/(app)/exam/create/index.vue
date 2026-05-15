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
        <template v-if="quizStore.selectedQuiz" #PanelTop>
            <SelectedQuizPreview :quiz="quizStore.selectedQuiz" />
        </template>
        <template #PanelMain>
            <component :is="stepComponents[store.currentStep.componentName]" />
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
import { stepComponents } from "@/pages/(app)/exam/create/types/types.ts";
import { useCreateExamStore } from "./composables/store/useCreateExamStore.ts";
import { useCreateExam } from "./composables/api/useCreateExam.ts";
import { useStepQuizStore } from "./components/stepQuiz/composables/store/useStepQuizStore.ts";
import SelectedQuizPreview from "./components/stepQuiz/components/SelectedQuizPreview.vue";
import { watch, watchEffect } from "vue";
import { useRouter } from "vue-router";

const store = useCreateExamStore();
const quizStore = useStepQuizStore();
const router = useRouter();
const { create: createExam, data: createdExam } = useCreateExam();

watchEffect(() => {
    if (!createdExam.value) {
        return;
    }
    const examId = createdExam.value.id;
    store.$reset();
    router.push({
        name: "/(app)/exam/[id]/",
        params: { id: String(examId) },
    });
});

watch(
    () => store.currentStepIndex,
    (index) => {
        if (index === 0) {
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
    createExam(store.createExamPayload);
};
</script>
