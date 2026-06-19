import { computed } from "vue";
import { storeToRefs } from "pinia";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import i18n from "@/i18n";
import { useRules } from "vuetify/labs/rules";
import { useStepWithURLStore } from "@/pages/(app)/exam/create/components/stepWithURL/composables/store/useStepWithURLStore";
import { isURL } from "@/utils/generalUtils";

export const useFormFields = () => {
    const { examName, examDescription, timeRange, examURL } = storeToRefs(
        useStepWithURLStore(),
    );

    const formFields = computed<FormField[]>(() => [
        {
            type: "text" as const,
            name: "examName",
            model: examName,
            label: i18n.global.t(
                "createExam.steps.withURL.fields.examName.label",
            ),
            required: true,
            rules: [useRules().minLength(3), useRules().maxLength(255)],
        },
        {
            type: "textarea" as const,
            name: "examDescription",
            model: examDescription,
            label: i18n.global.t(
                "createExam.steps.withURL.fields.examDescription.label",
            ),
            required: false,
            rules: [useRules().maxLength(4000)],
        },
        {
            type: "time-range" as const,
            name: "timeRange",
            model: timeRange,
            label: "createExam.steps.withURL.fields.timeRange",
            required: true,
        },
        {
            type: "text" as const,
            name: "examURL",
            model: examURL,
            label: i18n.global.t(
                "createExam.steps.withURL.fields.examURL.label",
            ),
            required: true,
            rules: [
                (val: string) => {
                    return (
                        isURL(val) ||
                        i18n.global.t(
                            "createExam.steps.withURL.fields.examURL.invalid",
                        )
                    );
                },
            ],
        },
    ]);

    return { formFields };
};
