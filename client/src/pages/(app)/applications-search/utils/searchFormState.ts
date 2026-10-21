import type { TimeRangeSelection } from "@/components/widgets/searches/timeRange/types";

export const createDefaultTimeRange = (): TimeRangeSelection => ({
    mode: undefined,
    periodAmount: 1,
    periodUnit: 4,
    fromDate: undefined,
    fromTime: "00:00",
    toDate: undefined,
    toTime: "23:59",
});
