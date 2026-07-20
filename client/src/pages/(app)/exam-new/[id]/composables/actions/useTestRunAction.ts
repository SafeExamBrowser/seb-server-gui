import type { Ref } from "vue";
import { Exam } from "@/models/seb-server/exam.ts";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import { useMutation } from "@/composables/useMutation.ts";

export const useTestRunAction = (
    exam: Ref<Exam | undefined>,
    examId?: number,
) => {
    // Calling the test-run endpoint again while the test run is active, disables it
    const testRunMutation = useMutation((id: number) =>
        monitoringService.applyTestRun(String(id)),
    );

    const handleTestRunToggle = async () => {
        if (examId === undefined) {
            return;
        }

        const updatedExam = await testRunMutation.mutateData(examId);

        if (!updatedExam) {
            return;
        }

        exam.value = updatedExam;
    };

    return { handleTestRunToggle };
};
