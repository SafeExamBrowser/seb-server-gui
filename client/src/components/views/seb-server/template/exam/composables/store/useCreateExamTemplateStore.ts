import { useStepNamingStore } from "@/components/views/seb-server/template/exam/components/stepNaming/composables/store/useStepNamingStore";
import { useStepSupervisorsStore } from "@/components/views/seb-server/template/exam/components/stepSupervisors/composables/store/useStepSupervisorsStore";
import { StepItemCreateTemplateExam } from "@/components/views/seb-server/template/exam/types";
import { StepItem } from "@/components/widgets/stepperVertical/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
import i18n from "@/i18n";
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";

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
    currentStepIndex: 1, // TODO @alain: reset debug value (should be 0)
};

export const useCreateExamTemplateStore = defineStore(
    "createExamTemplate",
    () => {
        const screenProctoringStore = useScreenProctoringStore();
        const stepNamingStore = useStepNamingStore();
        const stepSupervisorsStore = useStepSupervisorsStore();
        const stepClientGroupStore = useStepClientGroupStore();

        // state
        const currentStepIndex = ref(initialState.currentStepIndex);

        // getters
        const stepperModel = computed<StepItem[]>(() =>
            staticStepData.map((step, index) => ({
                title: i18n.global.t(step.i18nKey),
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
            clientConfigurationId: stepNamingStore.clientConfiguration
                ? parseInt(stepNamingStore.clientConfiguration)
                : undefined,
            institutionalDefault: stepNamingStore.institutionalDefault,
            lmsIntegration: stepNamingStore.lmsIntegration,
            indicatorTemplates: [],
            CLIENT_GROUP_TEMPLATES: stepClientGroupStore.groups.map(
                (group) => ({
                    name: group.name,
                    type: group.type,
                    ipRangeStart:
                        group.type === ClientGroupEnum.IP_V4_RANGE
                            ? group.ipRangeStart
                            : undefined,
                    ipRangeEnd:
                        group.type === ClientGroupEnum.IP_V4_RANGE
                            ? group.ipRangeEnd
                            : undefined,
                    clientOS:
                        group.type === ClientGroupEnum.CLIENT_OS
                            ? group.clientOS
                            : undefined,
                    nameRangeStartLetter:
                        group.type === ClientGroupEnum.NAME_ALPHABETICAL_RANGE
                            ? group.nameRangeStartLetter
                            : undefined,
                    nameRangeEndLetter:
                        group.type === ClientGroupEnum.NAME_ALPHABETICAL_RANGE
                            ? group.nameRangeEndLetter
                            : undefined,
                }),
            ),
            EXAM_ATTRIBUTES: {
                enableScreenProctoring: screenProctoringStore.enabled
                    ? "true"
                    : "false",
                spsCollectingStrategy: screenProctoringStore.collectionStrategy,
                spsCollectingGroupName: screenProctoringStore.enabled
                    ? screenProctoringStore.collectionStrategy === "EXAM"
                        ? i18n.global.t(
                              "createTemplateExam.steps.clientGroup.screenProctoringSingleGroupName",
                          )
                        : i18n.global.t(
                              "createTemplateExam.steps.clientGroup.screenProctoringFallbackGroupName",
                          )
                    : undefined,
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
            currentStepIndex.value = initialState.currentStepIndex;

            // substores
            screenProctoringStore.$reset();
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
            examTemplate,

            // actions
            increaseCurrentStepIndex,
            decreaseCurrentStepIndex,
            $reset,
        };
    },
);
