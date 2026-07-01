import { computed, ref } from "vue";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";

export const useCreateScheduledDeleteFields = () => {
    const deleteDueTime = ref<Date>(new Date());

    const formFields = computed<FormField[]>(() => [
        {
            type: "date" as const,
            name: "adminPassword",
            model: deleteDueTime,
            label: i18n.global.t("scheduledDelete.fields.deleteDueTime"),
            required: true,
        },
    ]);

    const reset = () => {
        deleteDueTime.value = new Date();
    };

    return {
        formFields,
        deleteDueTime,
        reset,
    };
};
