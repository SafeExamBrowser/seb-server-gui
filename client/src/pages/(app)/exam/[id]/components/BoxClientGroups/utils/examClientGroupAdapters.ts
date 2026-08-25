import { ClientGroup as ExamClientGroup } from "@/models/seb-server/clientGroup.ts";
import {
    ClientGroup,
    ClientGroupExisting,
    clientGroupExistingSchema,
} from "@/models/seb-server/examTemplate.ts";

// TODO @andrei: shrink these adapters once hey-api generated ClientGroup
// types/schemas exist — the exam wire flag isSPSGroup maps to the widget's
// screenProctoringEnabled.

export const parseExamClientGroup = (
    group: ExamClientGroup,
): ClientGroupExisting | undefined => {
    const parsed = clientGroupExistingSchema.safeParse({
        ...group,
        screenProctoringEnabled: group.isSPSGroup ?? false,
    });

    if (!parsed.success) {
        // eslint-disable-next-line no-console
        console.warn("Dropping invalid client group:", group, parsed.error);
        return undefined;
    }

    return parsed.data;
};

export const toExamClientGroup = (
    examId: number,
    group: ClientGroup | ClientGroupExisting,
): ExamClientGroup => {
    const { screenProctoringEnabled, ...rest } = group;

    return {
        ...rest,
        examId,
        // the backend ignores isSPSGroup on POST/PUT — the apply-groups call
        // after each mutation is what actually persists the flag
        isSPSGroup: screenProctoringEnabled,
    };
};
