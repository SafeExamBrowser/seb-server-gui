import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import * as tableUtils from "@/utils/table/tableUtils.ts";
import type { ServerTablePaging } from "@/models/types.ts";
import type { AssessmentToolsResponse } from "@/models/seb-server/assessmentTool.ts";
import { getAssessmentTools } from "@/services/seb-server/assessmentToolService.ts";
import { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums.ts";

export const useAssessmentTools = (
    paging: Readonly<Ref<ServerTablePaging>>,
    searchField: Readonly<Ref<string | undefined>>,
    selectedStatus: Readonly<Ref<string | undefined>>,
    selectedType: Readonly<Ref<LMSTypeEnum | null>>,
    selectedInstitutionId: Readonly<Ref<string | undefined>>,
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
