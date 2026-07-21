import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { TimeRange } from "@/components/widgets/formBuilder/types";
import { isURL } from "@/utils/generalUtils";
import { getTimestampFromDateAndTime } from "@/utils/timeUtils";

const getInitialState = () => ({
    examName: "",
    examDescription: "",
    timeRange: {
        fromDate: new Date(Date.now()),
        fromTime: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}`,
        toDate: new Date(Date.now()),
        toTime: `${new Date(Date.now()).getHours() + 1}:${new Date(Date.now()).getMinutes()}`,
    },
    examURL: "",
});

export const useStepWithURLStore = defineStore("createExam_stepWithURL", () => {
    const initState = getInitialState();
    const examName = ref<string>(initState.examName);
    const examDescription = ref<string>(initState.examDescription);
    const timeRange = ref<TimeRange>(initState.timeRange);
    const examURL = ref<string>(initState.examURL);

    const $reset = () => {
        const initState = getInitialState();
        examName.value = initState.examName;
        examDescription.value = initState.examDescription;
        timeRange.value = initState.timeRange;
        examURL.value = initState.examURL;
    };

    const isReady = computed<boolean>(
        () =>
            examName.value.length > 3 &&
            isURL(examURL.value) &&
            getTimestampFromDateAndTime(
                timeRange.value.fromDate,
                timeRange.value.fromTime,
            ) <
                getTimestampFromDateAndTime(
                    timeRange.value.toDate,
                    timeRange.value.toTime,
                ),
    );

    return {
        isReady,
        examName,
        examDescription,
        timeRange,
        examURL,

        $reset,
    };
});
