import i18n from "@/i18n";
import * as timeUtils from "@/utils/timeUtils";
import { TimeRangeSelection } from "@/components/widgets/searches/timeRange/types";

export function timePeriodUnits(): { title: string; value: number }[] {
    return [
        { title: i18n.global.t("timePeriod.day"), value: 1 },
        { title: i18n.global.t("timePeriod.week"), value: 2 },
        { title: i18n.global.t("timePeriod.month"), value: 3 },
        { title: i18n.global.t("timePeriod.year"), value: 4 },
    ];
}

// Resolve a selection to [fromTime, toTime] millisecond strings. Empty strings
// mean an unbounded range: no mode selected yields them, and so does "between"
// until both dates are picked (matches the old cleared-range behaviour).
export function computeTimeRange(
    selection: TimeRangeSelection,
): [string, string] {
    if (!selection.mode) {
        return ["", ""];
    }

    if (selection.mode === "period") {
        return timeUtils.calcTimePeriod(
            selection.periodUnit,
            selection.periodAmount,
        );
    }

    if (!selection.fromDate || !selection.toDate) {
        return ["", ""];
    }

    const from = timeUtils.getTimestampFromDateAndTime(
        new Date(selection.fromDate),
        selection.fromTime,
    );
    const to = timeUtils.getTimestampFromDateAndTime(
        new Date(selection.toDate),
        selection.toTime,
    );
    return [from.toString(), to.toString()];
}

// Human readable label shown as the active time-range chip. Empty while no
// mode is selected, so hosting pages can hide the chip.
export function buildTimeRangeSummary(
    selection: TimeRangeSelection,
    fromTime: string,
    toTime: string,
): string {
    if (!selection.mode) {
        return "";
    }

    if (selection.mode === "period") {
        const unitLabel =
            timePeriodUnits().find(
                (unit) => unit.value === selection.periodUnit,
            )?.title ?? "";
        return `${i18n.global.t("searchForm.last")} ${selection.periodAmount} ${unitLabel}`;
    }

    if (!fromTime || !toTime) {
        return i18n.global.t("searchForm.between");
    }

    return `${timeUtils.formatTimestampToFullDate(
        Number(fromTime),
    )} → ${timeUtils.formatTimestampToFullDate(Number(toTime))}`;
}
