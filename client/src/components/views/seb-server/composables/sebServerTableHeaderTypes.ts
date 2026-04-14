import type { TableHeader } from "@/components/blocks/entity-table/types.ts";

export type SebHeaderTranslateType =
    | "institutionName"
    | "dateTime"
    | "assessmentToolType"
    | "certificateTypes"
    | "examType"
    | "examStatus";

export type SebTableHeader = TableHeader & {
    translateType?: SebHeaderTranslateType;
};
