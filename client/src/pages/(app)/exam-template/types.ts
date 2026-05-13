import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import type { ExamTemplate } from "@/models/seb-server/examTemplate.ts";

export type ExamTemplateTableItem = ExamTemplate & {
    id: number;
};

// TODO @andrei: this type guard can be removed, once the EntityTable uses a generic type for the item
export const isExamTemplateTableItem = (
    item: TableItem,
): item is ExamTemplateTableItem => typeof item.id === "number";
