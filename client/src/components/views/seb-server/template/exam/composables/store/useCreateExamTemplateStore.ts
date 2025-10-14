import { useStepNamingStore } from "@/components/views/seb-server/template/exam/components/stepNaming/composables/store/useStepNamingStore";
import { useStepSupervisorsStore } from "@/components/views/seb-server/template/exam/components/stepSupervisors/composables/store/useStepSupervisorsStore";
import {
    ScreenProctoringCollectionStrategy,
    StepItemCreateTemplateExam,
} from "@/components/views/seb-server/template/exam/types";
import { StepItem } from "@/components/widgets/stepper/types";
import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";

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
    stepClientGroupStore: ReturnType<typeof useStepClientGroupStore>,
) => {
    switch (stepName) {
        case "StepNaming":
            return stepNamingStore.isReady;
        case "StepSupervisors":
            return stepSupervisorsStore.isReady;
        case "StepIndicators":
            return true;
        case "StepClientGroup":
            return stepClientGroupStore.isReady;
        case "StepSummary":
            return true;
        default:
            return stepName satisfies never;
    }
};

const initialState = {
    currentStepIndex: 3, // TODO @alain: remove debug (should be 0)
    screenProctoringEnabled: true, // TODO @alain: remove debug (should be false)
    screenProctoringCollectionStrategy: undefined,
};

export const useCreateExamTemplateStore = defineStore(
    "createExamTemplate",
    () => {
        const { t } = useI18n();

        const stepNamingStore = useStepNamingStore();
        const stepSupervisorsStore = useStepSupervisorsStore();
        const stepClientGroupStore = useStepClientGroupStore();

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
                    stepClientGroupStore,
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

        const screenProctoringEnabled = ref<boolean>(
            initialState.screenProctoringEnabled,
        );

        const screenProctoringCollectionStrategy =
            ref<ScreenProctoringCollectionStrategy>();

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
            screenProctoringEnabled.value =
                initialState.screenProctoringEnabled;
            screenProctoringCollectionStrategy.value =
                initialState.screenProctoringCollectionStrategy;

            // substores
            stepNamingStore.$reset();
            stepSupervisorsStore.$reset();
            stepClientGroupStore.$reset();
        };

        return {
            // state
            currentStepIndex,

            // getters
            stepperModel,
            currentStep,
            screenProctoringEnabled,
            screenProctoringCollectionStrategy,
            examTemplate,

            // actions
            increaseCurrentStepIndex,
            decreaseCurrentStepIndex,
            $reset,
        };
    },
);
