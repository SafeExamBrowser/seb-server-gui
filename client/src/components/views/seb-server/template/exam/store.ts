import { StepItemCreateTemplateExam } from "@/components/views/seb-server/template/exam/types";
import { useStepSupervisorsStore } from "@/components/views/seb-server/template/exam/stepSupervisors/store";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const staticStepData: StepItemCreateTemplateExam[] = [
    {
        componentName: "StepNaming",
        title: "Step: Naming", // TODO @alain: i18n
    },
    {
        componentName: "StepSupervisors",
        title: "Step: Supervisors", // TODO @alain: i18n
    },
    {
        componentName: "StepIndicators",
        title: "Step: Indicators", // TODO @alain: i18n
    },
    {
        componentName: "StepClientGroup",
        title: "Step: Client Group", // TODO @alain: i18n
    },
    {
        componentName: "StepSummary",
        title: "Step: Summary", // TODO @alain: i18n
    },
];

export const useCreateExamTemplateStore = defineStore(
    "createExamTemplate",
    () => {
        const stepSupervisorsStore = useStepSupervisorsStore();

        // state
        const currentStepIndex = ref(0);

        // getters
        const stepperModel = computed(() =>
            staticStepData.map((step, index) => ({
                title: step.title,
                nextStepEnabled:
                    step.componentName === "StepSupervisors"
                        ? stepSupervisorsStore.ready
                        : true,
                value: index,
            })),
        );

        const currentStep = computed(() => {
            const step = staticStepData.at(currentStepIndex.value);

            if (!step) {
                throw new Error("Step not found");
            }

            return step;
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
