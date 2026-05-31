import { computed, type Ref } from "vue";
import type { AppError } from "@/services/errors/types.ts";
import type { ServerTablePaging } from "@/models/types.ts";

type PagedResponse<T> = {
    content?: T[];
    number_of_pages?: number;
};

export const usePagedListData = <T>(config: {
    data: Ref<PagedResponse<T> | undefined>;
    error: Ref<AppError | undefined>;
    options: Ref<ServerTablePaging>;
    fetchData: () => Promise<void>;
}) => {
    const items = computed(() => config.data.value?.content ?? []);
    const pageCount = computed(() => config.data.value?.number_of_pages ?? 0);
    const errors = computed(() =>
        config.error.value ? [config.error.value] : [],
    );

    const reloadList = async () => {
        await config.fetchData();

        const maxPage = Math.max(1, pageCount.value);

        if (config.options.value.page <= maxPage) {
            return;
        }

        config.options.value.page = maxPage;

        await config.fetchData();
    };

    return { items, pageCount, errors, reloadList };
};
