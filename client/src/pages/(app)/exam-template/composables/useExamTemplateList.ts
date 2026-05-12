import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { useExamTemplates } from "./api/useExamTemplates.ts";
import {
    useExamTemplateFilters,
    EXAM_TYPE_FILTER_KEY,
} from "./useExamTemplateFilters.ts";

export const useExamTemplateList = () => {
    const filterSections = useExamTemplateFilters();

    const {
        searchInputValue,
        searchField,
        selectedFilters,
        options,
        loadItems,
        onSearch,
        onClearSearch,
        setFilters,
        clearAll,
    } = useUrlTableState(async () => {
        await fetchExamTemplates();
    }, [EXAM_TYPE_FILTER_KEY]);

    options.value.sortBy = [{ key: "name", order: "asc" }];

    const searchQuery = computed(() => searchField.value ?? undefined);
    const selectedExamType = computed(
        () => selectedFilters.value[EXAM_TYPE_FILTER_KEY] ?? undefined,
    );

    const {
        data,
        loading,
        error,
        fetchData: fetchExamTemplates,
    } = useExamTemplates(options, searchQuery, selectedExamType);

    const items = computed(() => data.value?.content ?? []);
    const pageCount = computed(() => data.value?.number_of_pages ?? 0);
    const errors = computed(() => (error.value ? [error.value] : []));

    const reload = async () => {
        await fetchExamTemplates();

        const total = pageCount.value;

        if (options.value.page <= total) {
            return;
        }

        options.value.page = Math.max(1, total);

        await fetchExamTemplates();
    };

    return {
        items,
        pageCount,
        loading,
        errors,
        options,
        searchInputValue,
        selectedFilters,
        filterSections,
        onSearch,
        onClearSearch,
        setFilters,
        clearAll,
        loadItems,
        reload,
    };
};
