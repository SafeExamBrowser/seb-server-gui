import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import * as tableUtils from "@/utils/table/tableUtils.ts";
import type { ConnectionConfigurations } from "@/models/seb-server/connectionConfiguration.ts";
import { getConnectionConfigurations } from "@/services/seb-server/connectionConfigurationService.ts";
import type { ServerTablePaging } from "@/models/types.ts";

export const useConnectionConfigurations = (
    paging: Readonly<Ref<ServerTablePaging>>,
    searchField: Readonly<Ref<string | null>>,
    selectedStatus: Readonly<Ref<string | null>>,
    selectedInstitutionId: Readonly<Ref<string | null>>,
) => {
    return useFetch<ConnectionConfigurations>(() =>
        getConnectionConfigurations(
            tableUtils.assignConnectionConfigurationSelectPagingOptions(
                paging.value,
                searchField.value,
                selectedStatus.value,
                selectedInstitutionId.value,
            ),
        ),
    );
};
