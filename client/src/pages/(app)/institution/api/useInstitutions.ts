import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import type { InstitutionResponse } from "@/models/seb-server/institution.ts";
import { getInstitutionsAdmin } from "@/services/seb-server/institutionService.ts";
import * as tableUtils from "@/utils/table/tableUtils.ts";
import type { ServerTablePaging } from "@/models/types.ts";

export const useInstitutions = (
    paging: Readonly<Ref<ServerTablePaging>>,
    searchField: Readonly<Ref<string | null>>,
    selectedStatus: Readonly<Ref<string | null>>,
) => {
    return useFetch<InstitutionResponse>(() =>
        getInstitutionsAdmin(
            tableUtils.assignInstitutionsPagingOptions(
                paging.value,
                searchField.value,
                selectedStatus.value,
            ),
        ),
    );
};
