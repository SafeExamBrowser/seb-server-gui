import { Ref } from "vue";

import { useMutation } from "@/composables/useMutation.ts";
import { Exam } from "@/models/seb-server/exam";
import { archiveExam } from "@/services/seb-server/examService";

export const useDoArchiveExams = () => {
    const {
        mutateData: _archiveExam,
        error,
        loading,
    } = useMutation(async (id: string) => {
        const response = await archiveExam(id);

        if (response === null) {
            throw new Error("Failed to archive Exam.");
        }

        return response;
    });

    const doArchiveFromItem = async (item: Record<string, unknown>) => {
        const id = item.id;

        if (typeof id !== "number") {
            throw new Error(
                "doArchiveFromItem: row item is missing a number id",
            );
        }

        await _archiveExam(id.toString());
    };

    const doArchiveFromMultiSelect = async (
        selection: Ref<string[], string[]>,
    ) => {
        if (selection.value) {
            await doBulkAwait(selection.value);
        }
    };

    const doBulkAwait = async (ids: string[]) => {
        const allCalls: Promise<Exam | undefined>[] = [];
        ids.forEach((id) => {
            allCalls.push(_archiveExam(id));
        });
        await Promise.all(allCalls);
    };

    return {
        _archiveExam,
        archiveSingleExam: doArchiveFromItem,
        archiveMultipleExams: doArchiveFromMultiSelect,
        error,
        loading,
    };
};
