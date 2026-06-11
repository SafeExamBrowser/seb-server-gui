import { computed } from "vue";
import { storeToRefs } from "pinia";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import i18n from "@/i18n";
import { useStepWithURLStore } from "@/pages/(app)/exam/create/components/stepWithURL/composables/store/useStepWithURLStore";
import { getTimestampFromDateTime } from "@/utils/timeUtils";

export const useFormFields = () => {
    const { examName, examDescription, startDate, endDate, examURL } =
        storeToRefs(useStepWithURLStore());

    const checkDateRule = (): true | string => {
        if (
            getTimestampFromDateTime(startDate.value) <
            getTimestampFromDateTime(endDate.value)
        ) {
            return true;
        }
        return "Invalid date";
    };

    const formFields = computed<FormField[]>(() => [
        {
            type: "text" as const,
            name: "examName",
            model: examName,
            label: i18n.global.t(
                "createExam.steps.withURL.fields.examName.label",
            ),
            required: true,
        },
        {
            type: "textarea" as const,
            name: "examDescription",
            model: examDescription,
            label: i18n.global.t(
                "createExam.steps.withURL.fields.examDescription.label",
            ),
            required: false,
        },
        {
            type: "date-time" as const,
            name: "startDate",
            model: startDate,
            label: i18n.global.t(
                "createExam.steps.withURL.fields.startDate.label",
            ),
            required: true,
            rules: [checkDateRule],
        },
        {
            type: "date-time" as const,
            name: "endDate",
            model: endDate,
            label: i18n.global.t(
                "createExam.steps.withURL.fields.endDate.label",
            ),
            required: false,
            rules: [checkDateRule],
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
                    const regex =
                        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}/gm;
                    return (
                        regex.test(val) ||
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
