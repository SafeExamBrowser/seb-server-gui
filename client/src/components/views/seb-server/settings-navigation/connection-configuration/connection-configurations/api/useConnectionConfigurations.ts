import { useFetch } from "@/composables/useFetch";
import * as tableUtils from "@/utils/table/tableUtils";
import { ConnectionConfigurations } from "@/models/seb-server/connectionConfiguration.ts";
import { getConnectionConfigurations } from "@/services/seb-server/connectionConfigurationService.ts";

export const useConnectionConfigurations = () =>
    useFetch<ConnectionConfigurations>(() =>
        getConnectionConfigurations(
            tableUtils.assignConnectionConfigurationSelectPagingOptions(
                {
                    page: 1,
                    itemsPerPage: 5,
                    sortBy: [{ key: "name", order: "asc" }],
                },
                null,
                null,
                null,
            ),
        ),
    );
