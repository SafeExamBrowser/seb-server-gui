export type SearchTimeMode = "period" | "between";

// Model of the shared "Period / Between" time-range selector. `mode` is
// undefined while the hosting form allows both options to be de-selected.
export type TimeRangeSelection = {
    mode?: SearchTimeMode;
    periodAmount: number;
    periodUnit: number;
    fromDate?: Date;
    fromTime: string;
    toDate?: Date;
    toTime: string;
};
