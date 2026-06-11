import { DateTime } from "@/components/widgets/formBuilder/types";
import { getTimestampFromDateTime } from "@/utils/timeUtils";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const getInitialState = () => ({
    examName: "",
    examDescription: "",
    startDate: {
        date: new Date(Date.now()),
        time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`,
    },
    endDate: {
        date: new Date(Date.now()),
        time: `${new Date(Date.now()).getHours() + 1}:${new Date(Date.now()).getMinutes()}`,
    },
    examURL: "",
});

export const useStepWithURLStore = defineStore("createExam_stepWithURL", () => {
    const examName = ref<string>(getInitialState().examName);
    const examDescription = ref<string>(getInitialState().examDescription);
    const startDate = ref<DateTime>(getInitialState().startDate);
    const endDate = ref<DateTime>(getInitialState().endDate);
    const examURL = ref<string>(getInitialState().examURL);

    const $reset = () => {
        examName.value = getInitialState().examName;
    };

    const isReady = computed<boolean>(
        () =>
            examName.value.length > 3 &&
            examURL.value.length > 3 &&
            getTimestampFromDateTime(startDate.value) <
                getTimestampFromDateTime(endDate.value),
    );

    return {
        isReady,
        examName,
        examDescription,
        startDate,
        endDate,
        examURL,

        $reset,
    };
});
