import { ref } from "vue";
import * as tableUtils from "@/utils/table/tableUtils";
import type { ServerTablePaging } from "@/models/types";
import {
    AssessmentToolsResponse,
    LMSTypeEnum,
} from "@/models/seb-server/assessmentTool.ts";
import { getAssessmentTools } from "@/services/seb-server/assessmentToolService.ts";

export const useAssessmentTools = () => {
    const data = ref<AssessmentToolsResponse>();
    const loading = ref(false);
    const error = ref<string>();

    const fetchAssessmentTools = async (
        paging: ServerTablePaging,
        searchField: string | null,
        selectedStatus: string | null,
        selectedType: LMSTypeEnum | null,
        selectedInstitutionId: string | null,
    ) => {
        loading.value = true;
        error.value = undefined;

        try {
            const response = await getAssessmentTools(
                tableUtils.assignAssessmentToolSelectPagingOptions(
                    paging,
                    selectedStatus,
                    selectedType,
                    selectedInstitutionId,
                    searchField,
                ),
            );

            if (!response) {
                throw new Error("Failed to fetch assessment tools.");
            }
            data.value = response;
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Unknown error";
        } finally {
            loading.value = false;
        }
    };

    return {
        data,
        loading,
        error,
        fetchAssessmentTools,
    };
};
