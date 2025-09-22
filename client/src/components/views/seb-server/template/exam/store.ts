import { useStepSupervisorsStore } from "@/components/views/seb-server/template/exam/stepSupervisors/store";
import { StepItemCreateTemplateExam } from "@/components/views/seb-server/template/exam/types";
import { StepItem } from "@/components/widgets/stepper/types";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";

const staticStepData = [
    {
        componentName: "StepNaming" as const,
        i18nKey: "createTemplateExam.steps.naming.title",
    },
    {
        componentName: "StepSupervisors" as const,
        i18nKey: "createTemplateExam.steps.supervisors.title",
    },
    {
        componentName: "StepIndicators" as const,
        i18nKey: "createTemplateExam.steps.indicators.title",
    },
    {
        componentName: "StepClientGroup" as const,
        i18nKey: "createTemplateExam.steps.clientGroup.title",
    },
    {
        componentName: "StepSummary" as const,
        i18nKey: "createTemplateExam.steps.summary.title",
    },
];

export const useCreateExamTemplateStore = defineStore(
    "createExamTemplate",
    () => {
        const { t } = useI18n();

        const stepSupervisorsStore = useStepSupervisorsStore();

        // state
        const currentStepIndex = ref(0);

        // getters
        const stepperModel = computed<StepItem[]>(() =>
            staticStepData.map((step, index) => ({
                title: t(step.i18nKey),
                nextStepEnabled:
                    step.componentName === "StepSupervisors"
                        ? stepSupervisorsStore.ready
                        : true,
                value: index,
            })),
        );

        const currentStep = computed<StepItemCreateTemplateExam>(() => {
            const step = staticStepData.at(currentStepIndex.value);

            if (!step) {
                throw new Error("Step not found");
            }

            return {
                componentName: step.componentName,
                title: t(step.i18nKey),
            };
        });

        // actions
        const increaseCurrentStepIndex = () => {
            if (currentStepIndex.value < stepperModel.value.length - 1) {
                currentStepIndex.value++;
            }
        };

        const decreaseCurrentStepIndex = () => {
            if (currentStepIndex.value > 0) {
                currentStepIndex.value--;
            }
        };

        return {
            // state
            currentStepIndex,

            // getters
            stepperModel,
            currentStep,

            // actions
            increaseCurrentStepIndex,
            decreaseCurrentStepIndex,
        };
    },
);
