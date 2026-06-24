import { useMutation } from "@/composables/useMutation.ts";
import { AssessmentToolTestResult } from "@/models/seb-server/assessmentTool";
import { testAssessmentTool } from "@/services/seb-server/assessmentToolService.ts";
import { ref } from "vue";

export const useTestAssessmentTool = () => {
    const testResult = ref<AssessmentToolTestResult>();

    const { mutateData, error, loading } = useMutation(async (id: string) => {
        const response = await testAssessmentTool(id);

        if (response === null) {
            throw new Error("Failed to test assessment tool.");
        }

        if (error.value) {
            return;
        }

        testResult.value = response;

        // if (response.errors.length > 0) {
        //     response.errors.forEach(err => {
        //         appErrors.value.push({
        //             kind: "assessmentToolTest" as const,
        //             message: err.errorMessage,// t(`assessmentToolConnections.test.error.message.${err.errorType}`),
        //             raw: err,
        //         });
        //     });
        // }
    });

    const testeAssessmentToolFromItem = async (
        item: Record<string, unknown>,
    ) => {
        const id = item.id;

        if (typeof id !== "number") {
            throw new Error(
                "testAssessmentTool: row item is missing a numeric id",
            );
        }

        await mutateData(id.toString());
    };

    return {
        testAssessmenTool: mutateData,
        testeAssessmentToolFromItem: testeAssessmentToolFromItem,
        testResult: testResult,
        error: error,
        loading,
    };
};
