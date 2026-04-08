import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch";
import * as tableUtils from "@/utils/table/tableUtils";
import type { ServerTablePaging } from "@/models/types";
import type { AssessmentToolsResponse } from "@/models/seb-server/assessmentTool.ts";
import { getAssessmentTools } from "@/services/seb-server/assessmentToolService.ts";
import { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums.ts";

export const useAssessmentTools = (
    paging: Readonly<Ref<ServerTablePaging>>,
    searchField: Readonly<Ref<string | null>>,
    selectedStatus: Readonly<Ref<string | null>>,
    selectedType: Readonly<Ref<LMSTypeEnum | null>>,
    selectedInstitutionId: Readonly<Ref<string | null>>,
) => {
    return useFetch<AssessmentToolsResponse>(() =>
        getAssessmentTools(
            tableUtils.assignAssessmentToolSelectPagingOptions(
                paging.value,
                selectedStatus.value,
                selectedType.value,
                selectedInstitutionId.value,
                searchField.value,
            ),
        ),
    );
};
