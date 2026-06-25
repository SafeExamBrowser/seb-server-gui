import type { Ref } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import type { ServerTablePaging } from "@/models/types.ts";
import { ScheduledDeletions } from "@/models/seb-server/sheduled-deletion";
import { getScheduledDeletions } from "@/services/seb-server/scheduledDeletionService";
import { SortOrder } from "@/services/types";

// TODO @andrei: this function won't be needed anymore, once ServerTablePaging uses the SortOrder type
const toSortOrder = (
    sortBy: ServerTablePaging["sortBy"],
): SortOrder | undefined => {
    const first = sortBy[0];

    if (!first) {
        return undefined;
    }

    if (first.order !== "asc" && first.order !== "desc") {
        return undefined;
    }

    return { key: first.key, order: first.order };
};

export const fetchSchedueledDeletions = (
    paging: Readonly<Ref<ServerTablePaging>>,
    dueTimestamp: Readonly<Ref<number | null>>,
    selectedStatus: Readonly<Ref<string | undefined>>,
) => {
    return useFetch<ScheduledDeletions>(() =>
        getScheduledDeletions({
            basicListParams: {
                pageNumber: paging.value.page,
                pageSize: paging.value.itemsPerPage,
                sortOrder: toSortOrder(paging.value.sortBy),
            },
            dueTimestamp: dueTimestamp.value ?? undefined,
            status: selectedStatus.value,
        }),
    );
};
