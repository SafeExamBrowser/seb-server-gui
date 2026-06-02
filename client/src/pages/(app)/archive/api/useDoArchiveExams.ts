import { useMutation } from "@/composables/useMutation.ts";
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

    return {
        _archiveExam,
        archiveSingleExam: doArchiveFromItem,
        error,
        loading,
    };
};
