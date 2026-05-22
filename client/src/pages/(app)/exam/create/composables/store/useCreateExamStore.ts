import { defineStore } from "pinia";
import { computed, ref } from "vue";
import i18n from "@/i18n";
import { StepItem } from "@/components/widgets/stepperVertical/types.ts";
import { StepItemCreateExam } from "@/pages/(app)/exam/create/types/types.ts";
import { CreateExamPar } from "@/models/seb-server/exam.ts";
import { useStepAssessmentToolStore } from "@/pages/(app)/exam/create/components/stepAssessmentTool/composables/store/useStepAssessmentToolStore.ts";
import { useStepQuizStore } from "@/pages/(app)/exam/create/components/stepQuiz/composables/store/useStepQuizStore.ts";
import { useStepExamTemplateStore } from "@/pages/(app)/exam/create/components/stepExamTemplate/composables/store/useStepExamTemplateStore.ts";
import { useStepClientGroupsStore } from "@/pages/(app)/exam/create/components/stepClientGroups/composables/store/useStepClientGroupsStore.ts";
import { useStepSupervisorsStore } from "@/pages/(app)/exam/create/components/stepSupervisors/composables/store/useStepSupervisorsStore.ts";
import { useStepQuitPasswordStore } from "@/pages/(app)/exam/create/components/stepQuitPassword/composables/store/useStepQuitPasswordStore.ts";

const staticStepData = [
    {
        componentName: "StepAssessmentTool" as const,
        i18nKey: "createExam.steps.assessmentTool.title",
    },
    {
        componentName: "StepQuiz" as const,
        i18nKey: "createExam.steps.quiz.title",
    },
    {
        componentName: "StepExamTemplate" as const,
        i18nKey: "createExam.steps.examTemplate.title",
    },
    {
        componentName: "StepClientGroups" as const,
        i18nKey: "createExam.steps.clientGroups.title",
    },
    {
        componentName: "StepSupervisors" as const,
        i18nKey: "createExam.steps.supervisors.title",
    },
    {
        componentName: "StepQuitPassword" as const,
        i18nKey: "createExam.steps.quitPassword.title",
    },
    {
        componentName: "StepSummary" as const,
        i18nKey: "createExam.steps.summary.title",
    },
];

const isStepReady = (
    stepName: StepItemCreateExam["componentName"],
    stepAssessmentToolStore: ReturnType<typeof useStepAssessmentToolStore>,
    stepQuizStore: ReturnType<typeof useStepQuizStore>,
    stepExamTemplateStore: ReturnType<typeof useStepExamTemplateStore>,
    stepSupervisorsStore: ReturnType<typeof useStepSupervisorsStore>,
) => {
    switch (stepName) {
        case "StepAssessmentTool":
            return stepAssessmentToolStore.isReady;
        case "StepQuiz":
            return stepQuizStore.isReady;
        case "StepExamTemplate":
            return stepExamTemplateStore.isReady;
        case "StepClientGroups":
            return true;
        case "StepSupervisors":
            return stepSupervisorsStore.isReady;
        case "StepQuitPassword":
            return true;
        case "StepSummary":
            return true;
        default:
            return stepName satisfies never;
    }
};

const getInitialState = () => ({
    currentStepIndex: 0,
});

export const useCreateExamStore = defineStore("createExam", () => {
    const stepAssessmentToolStore = useStepAssessmentToolStore();
    const stepQuizStore = useStepQuizStore();
    const stepExamTemplateStore = useStepExamTemplateStore();
    const stepClientGroupsStore = useStepClientGroupsStore();
    const stepSupervisorsStore = useStepSupervisorsStore();
    const stepQuitPasswordStore = useStepQuitPasswordStore();

    const currentStepIndex = ref(getInitialState().currentStepIndex);

    const visibleStepData = computed(() => {
        const clientGroupCount =
            stepExamTemplateStore.selectedExamTemplate?.CLIENT_GROUP_TEMPLATES
                .length ?? 0;
        const assessmentToolCount =
            stepAssessmentToolStore.assessmentTools?.content.length ?? 0;

        return staticStepData.filter((step) => {
            if (step.componentName === "StepAssessmentTool") {
                return assessmentToolCount !== 1;
            }
            if (step.componentName === "StepClientGroups") {
                return clientGroupCount >= 2;
            }
            return true;
        });
    });

    const stepperModel = computed<StepItem[]>(() =>
        visibleStepData.value.map((step, index) => ({
            title: i18n.global.t(step.i18nKey),
            nextStepEnabled: isStepReady(
                step.componentName,
                stepAssessmentToolStore,
                stepQuizStore,
                stepExamTemplateStore,
                stepSupervisorsStore,
            ),
            value: index,
        })),
    );

    const currentStep = computed<StepItemCreateExam>(() => {
        const step = visibleStepData.value.at(currentStepIndex.value);

        if (!step) {
            throw new Error("Step not found");
        }

        return {
            componentName: step.componentName,
            title: i18n.global.t(step.i18nKey),
        };
    });

    const createExamPayload = computed<CreateExamPar>(() => {
        const quiz = stepQuizStore.selectedQuiz;
        const examTemplate = stepExamTemplateStore.selectedExamTemplate;

        if (!quiz || !examTemplate || examTemplate.id === undefined) {
            throw new Error(
                "Cannot assemble create exam payload before quiz and template are selected",
            );
        }

        const clientGroupIds = stepClientGroupsStore.selectedClientGroups
            .map((group) => group.id)
            .filter((id): id is number => typeof id === "number")
            .map(String)
            .join(",");

        return {
            lmsSetupId: quiz.lms_setup_id,
            lms_setup_id: quiz.lms_setup_id,
            externalId: quiz.quiz_id,
            quiz_id: quiz.quiz_id,
            examTemplateId: examTemplate.id,
            type: examTemplate.examType,
            quitPassword: stepQuitPasswordStore.quitPassword,
            supporter: stepSupervisorsStore.selectedSupervisorIds,
            clientGroupIds,
        };
    });

    const increaseCurrentStepIndex = () => {
        if (currentStepIndex.value < visibleStepData.value.length - 1) {
            currentStepIndex.value++;
        }
    };

    const decreaseCurrentStepIndex = () => {
        if (currentStepIndex.value > 0) {
            currentStepIndex.value--;
        }
    };

    const $reset = () => {
        currentStepIndex.value = getInitialState().currentStepIndex;

        stepAssessmentToolStore.$reset();
        stepQuizStore.$reset();
        stepExamTemplateStore.$reset();
        stepClientGroupsStore.$reset();
        stepSupervisorsStore.$reset();
        stepQuitPasswordStore.$reset();
    };

    return {
        currentStepIndex: computed(() => currentStepIndex.value),
        stepperModel,
        currentStep,
        createExamPayload,

        increaseCurrentStepIndex,
        decreaseCurrentStepIndex,
        $reset,
    };
});
