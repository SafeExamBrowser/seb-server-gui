import type { TimeRangeSelection } from "@/components/widgets/searches/timeRange/types";
import { SPExam } from "@/models/screen-proctoring/exam";

// Result of drilling into a selected exam: the exam plus the distinct
// applications found for its screen-proctoring groups.
export type ExamMetadataObject = {
    exam: SPExam;
    metadataAppList: string[];
    groupIds: number[];
};

// Payload emitted by the search form when the user runs a search. `timeRange`
// is the submitted selection (mirrored into the URL), `summary` the human
// readable label shown as the active time-range chip.
export type ApplicationsSearchQuery = {
    timeRange: TimeRangeSelection;
    fromTime: string;
    toTime: string;
    summary: string;
};
