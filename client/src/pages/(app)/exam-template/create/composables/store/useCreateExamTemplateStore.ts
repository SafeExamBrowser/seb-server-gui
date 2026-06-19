import { useStepNamingStore } from "@/pages/(app)/exam-template/create/components/stepNaming/composables/store/useStepNamingStore.ts";
import { useStepSupervisorsStore } from "@/pages/(app)/exam-template/create/components/stepSupervisors/composables/store/useStepSupervisorsStore.ts";
import { StepItemCreateTemplateExam } from "@/pages/(app)/exam-template/create/types/types.ts";
import { StepItem } from "@/components/widgets/stepperVertical/types.ts";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useStepClientGroupStore } from "@/pages/(app)/exam-template/create/components/stepClientGroup/composables/store/useStepClientGroupStore.ts";
import { useScreenProctoringStore } from "@/pages/(app)/exam-template/create/composables/store/useScreenProctoringStore.ts";
import { buildScreenProctoringExamAttributes } from "@/models/seb-server/screenProctoring.ts";
import i18n from "@/i18n";
import { ExamTemplate } from "@/models/seb-server/examTemplate.ts";
import { toApiClientConfigurationId } from "@/models/seb-server/connectionConfiguration.ts";
import { useStepIndicatorsStore } from "@/pages/(app)/exam-template/create/components/stepIndicators/composables/store/useStepIndicatorsStore.ts";

const staticStepData = [
    {
        componentName: "StepNaming" as const,
        i18nKey: "createTemplateExam.steps.naming.title",
    },
    {
        componentName: "StepSEBSettings" as const,
        i18nKey: "createTemplateExam.steps.seb-settings.title",
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
    stepIndicatorsStore: ReturnType<typeof useStepIndicatorsStore>,
    stepClientGroupStore: ReturnType<typeof useStepClientGroupStore>,
) => {
    switch (stepName) {
        case "StepNaming":
            return stepNamingStore.isReady;
        case "StepSEBSettings":
            return true;
        case "StepSupervisors":
            return stepSupervisorsStore.isReady;
        case "StepIndicators":
            return stepIndicatorsStore.isReady;
        case "StepClientGroup":
            return stepClientGroupStore.isReady;
        case "StepSummary":
            return true;
        default:
            return stepName satisfies never;
    }
};

const getInitialState = () => ({
    currentStepIndex: 0,
});

export const useCreateExamTemplateStore = defineStore(
    "createExamTemplate",
    () => {
        const screenProctoringStore = useScreenProctoringStore();
        const stepNamingStore = useStepNamingStore();
        const stepSupervisorsStore = useStepSupervisorsStore();
        const stepClientGroupStore = useStepClientGroupStore();
        const stepIndicatorsStore = useStepIndicatorsStore();

        // state
        const currentStepIndex = ref(getInitialState().currentStepIndex);

        // getters
        const stepperModel = computed<StepItem[]>(() =>
            staticStepData.map((step, index) => ({
                title: i18n.global.t(step.i18nKey),
                nextStepEnabled: isStepReady(
                    step.componentName,
                    stepNamingStore,
                    stepSupervisorsStore,
                    stepIndicatorsStore,
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
                title: i18n.global.t(step.i18nKey),
            };
        });

        const examTemplate = computed<ExamTemplate>(() => ({
            name: stepNamingStore.name ?? "",
            description: stepNamingStore.description,
            examType: stepNamingStore.examType,
            supporter: stepSupervisorsStore.selectedSupervisorIds,
            configurationTemplateId: stepNamingStore.configurationTemplate
                ? parseInt(stepNamingStore.configurationTemplate)
                : undefined,
            clientConfigurationId: toApiClientConfigurationId(
                stepNamingStore.clientConfiguration,
            ),
            institutionalDefault: stepNamingStore.institutionalDefault,
            lmsIntegration: stepNamingStore.lmsIntegration,
            indicatorTemplates: stepIndicatorsStore.indicators,
            CLIENT_GROUP_TEMPLATES: stepClientGroupStore.groups,
            EXAM_ATTRIBUTES: {
                ...buildScreenProctoringExamAttributes({
                    enabled: screenProctoringStore.enabled,
                    collectionStrategy:
                        screenProctoringStore.collectionStrategy,
                }),
                spsSEBGroupsSelection:
                    screenProctoringStore.screenProctoringAllowedForGroups
                        ? stepClientGroupStore.groups
                              .map((group, index) =>
                                  group.screenProctoringEnabled
                                      ? index.toString()
                                      : undefined,
                              )
                              .filter(Boolean)
                              .join(",")
                        : undefined,
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
            currentStepIndex.value = getInitialState().currentStepIndex;

            // substores
            screenProctoringStore.$reset();
            stepNamingStore.$reset();
            stepSupervisorsStore.$reset();
            stepIndicatorsStore.$reset();
            stepClientGroupStore.$reset();
        };

        return {
            // getters
            currentStepIndex: computed(() => currentStepIndex.value),
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
