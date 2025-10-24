import { useStepNamingStore } from "@/components/views/seb-server/template/exam/components/stepNaming/composables/store/useStepNamingStore";
import { useStepSupervisorsStore } from "@/components/views/seb-server/template/exam/components/stepSupervisors/composables/store/useStepSupervisorsStore";
import { StepItemCreateTemplateExam } from "@/components/views/seb-server/template/exam/types";
import { StepItem } from "@/components/widgets/stepperVertical/types";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { ExamTemplate } from "@/models/seb-server/examTemplate";

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

const isStepReady = (
    stepName: StepItemCreateTemplateExam["componentName"],
    stepNamingStore: ReturnType<typeof useStepNamingStore>,
    stepSupervisorsStore: ReturnType<typeof useStepSupervisorsStore>,
) => {
    switch (stepName) {
        case "StepNaming":
            return stepNamingStore.isReady;
        case "StepSupervisors":
            return stepSupervisorsStore.isReady;
        case "StepIndicators":
            return true;
        case "StepClientGroup":
            return true;
        case "StepSummary":
            return true;
        default:
            return stepName satisfies never;
    }
};

const initialState = {
    currentStepIndex: 0,
};

export const useCreateExamTemplateStore = defineStore(
    "createExamTemplate",
    () => {
        const { t } = useI18n();

        const stepNamingStore = useStepNamingStore();
        const stepSupervisorsStore = useStepSupervisorsStore();

        // state
        const currentStepIndex = ref(initialState.currentStepIndex);

        // getters
        const stepperModel = computed<StepItem[]>(() =>
            staticStepData.map((step, index) => ({
                title: t(step.i18nKey),
                nextStepEnabled: isStepReady(
                    step.componentName,
                    stepNamingStore,
                    stepSupervisorsStore,
                ),
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

        const examTemplate = computed<ExamTemplate>(() => ({
            name: stepNamingStore.name,
            description: stepNamingStore.description,
            examType: stepNamingStore.examType,
            supporter: [],
            configurationTemplateId: stepNamingStore.configurationTemplate
                ? parseInt(stepNamingStore.configurationTemplate)
                : undefined,
            clientConfigurationId: stepNamingStore.clientConfiguration
                ? parseInt(stepNamingStore.clientConfiguration)
                : undefined,
            institutionalDefault: stepNamingStore.institutionalDefault,
            lmsIntegration: stepNamingStore.lmsIntegration,
            indicatorTemplates: [],
            CLIENT_GROUP_TEMPLATES: [],
            EXAM_ATTRIBUTES: {
                enableScreenProctoring: "false",
            },
        }));

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

        const $reset = () => {
            // own state
            currentStepIndex.value = initialState.currentStepIndex;

            // substores
            stepNamingStore.$reset();
            stepSupervisorsStore.$reset();
        };

        return {
            // state
            currentStepIndex,

            // getters
            stepperModel,
            currentStep,
            examTemplate,

            // actions
            increaseCurrentStepIndex,
            decreaseCurrentStepIndex,
            $reset,
        };
    },
);
