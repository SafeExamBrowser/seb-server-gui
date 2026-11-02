import type { TimeRangeSelection } from "@/components/widgets/searches/timeRange/types";
import type { SearchQueryValues } from "@/components/widgets/searches/types";
import * as timeUtils from "@/utils/timeUtils";

export const TIME_RANGE_QUERY_KEYS = [
    "timeMode",
    "periodAmount",
    "periodUnit",
    "from",
    "to",
] as const;

const PERIOD_UNIT_QUERY_VALUES: Record<number, string> = {
    1: "day",
    2: "week",
    3: "month",
    4: "year",
};

// "period" keeps the relative period, so a restored search is a rolling
// window again; "between" stores its bounds as millisecond timestamps.
export function timeRangeToQuery(
    selection: TimeRangeSelection,
): SearchQueryValues {
    if (selection.mode === "period") {
        return {
            timeMode: selection.mode,
            periodAmount: String(selection.periodAmount),
            periodUnit: PERIOD_UNIT_QUERY_VALUES[selection.periodUnit],
        };
    }

    if (selection.mode === "between") {
        return {
            timeMode: selection.mode,
            from: toQueryTimestamp(selection.fromTime, selection.fromDate),
            to: toQueryTimestamp(selection.toTime, selection.toDate),
        };
    }

    return {};
}

// Missing or invalid values fall back to `defaults`.
export function timeRangeFromQuery(
    values: SearchQueryValues,
    defaults: TimeRangeSelection,
): TimeRangeSelection {
    if (values.timeMode === "period") {
        return {
            ...defaults,
            mode: "period",
            periodAmount:
                parsePeriodAmount(values.periodAmount) ?? defaults.periodAmount,
            periodUnit:
                parsePeriodUnit(values.periodUnit) ?? defaults.periodUnit,
        };
    }

    if (values.timeMode === "between") {
        const from = parseQueryTimestamp(values.from);
        const to = parseQueryTimestamp(values.to);

        return {
            ...defaults,
            mode: "between",
            fromDate: from?.date,
            fromTime: from?.time ?? defaults.fromTime,
            toDate: to?.date,
            toTime: to?.time ?? defaults.toTime,
        };
    }

    return defaults;
}

function toQueryTimestamp(time: string, date?: Date) {
    if (!date) {
        return undefined;
    }

    return timeUtils
        .getTimestampFromDateAndTime(new Date(date), time)
        .toString();
}

// Splits a timestamp into the selector's local date (midnight, as the date
// picker yields it) and "HH:mm" time, the inverse of toQueryTimestamp.
function parseQueryTimestamp(value?: string) {
    if (!value) {
        return undefined;
    }

    const dateTime = new Date(Number(value));
    if (Number.isNaN(dateTime.getTime())) {
        return undefined;
    }

    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");

    return {
        date: new Date(
            dateTime.getFullYear(),
            dateTime.getMonth(),
            dateTime.getDate(),
        ),
        time: `${hours}:${minutes}`,
    };
}

function parsePeriodAmount(value?: string) {
    if (!value) {
        return undefined;
    }

    const amount = Number(value);
    return Number.isFinite(amount) ? amount : undefined;
}

function parsePeriodUnit(value?: string) {
    const entry = Object.entries(PERIOD_UNIT_QUERY_VALUES).find(
        ([, queryValue]) => queryValue === value,
    );
    return entry ? Number(entry[0]) : undefined;
}
