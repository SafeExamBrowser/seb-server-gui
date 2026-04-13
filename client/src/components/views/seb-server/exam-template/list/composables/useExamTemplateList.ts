import { computed, ref } from "vue";
import i18n from "@/i18n";
import { useExamTemplates } from "./api/useExamTemplates";
import {
    useExamTemplateFilters,
    EXAM_TYPE_FILTER_KEY,
} from "./useExamTemplateFilters";
import type { TableFilters } from "@/components/blocks/entity-table/types";
import type { TableOptions } from "../types";

const headers = [
    {
        title: i18n.global.t("examTemplateList.headers.name"),
        value: "name",
        width: "30%",
        sortable: true,
    },
    {
        title: i18n.global.t("examTemplateList.headers.description"),
        value: "description",
        width: "30%",
        sortable: true,
    },
    {
        title: i18n.global.t("examTemplateList.headers.examType"),
        value: "examType",
        width: "30%",
        sortable: true,
    },
    {
        title: i18n.global.t("examTemplateList.headers.actions"),
        value: "actions",
        width: "10%",
        sortable: false,
    },
];

export const useExamTemplateList = () => {
    const filterSections = useExamTemplateFilters();

    const searchInputValue = ref<string | null>(null);
    const searchQuery = ref<string | null>(null);
    const selectedFilters = ref<TableFilters>({ [EXAM_TYPE_FILTER_KEY]: null });

    const examType = computed(
        () => selectedFilters.value[EXAM_TYPE_FILTER_KEY] ?? null,
    );

    const options = ref<TableOptions>({
        page: 1,
        itemsPerPage: 10,
        sortBy: [{ key: "name", order: "asc" }],
    });

    const {
        data,
        loading: isLoading,
        error,
        fetchData: fetchExamTemplates,
    } = useExamTemplates(options, searchQuery, examType);

    const examTemplates = computed(() => data.value?.content ?? []);

    const totalItems = computed(() => {
        if (!data.value) {
            return 0;
        }

        return data.value.number_of_pages * data.value.page_size;
    });

    const sortBy = computed(() => options.value.sortBy);

    const handleSearch = () => {
        searchQuery.value = searchInputValue.value;
        options.value = { ...options.value, page: 1 };
        fetchExamTemplates();
    };

    const handleClear = () => {
        searchInputValue.value = null;
        searchQuery.value = null;
        selectedFilters.value = { [EXAM_TYPE_FILTER_KEY]: null };
        options.value = { ...options.value, page: 1 };
        fetchExamTemplates();
    };

    const handleFiltersUpdate = (newFilters: TableFilters) => {
        selectedFilters.value = newFilters;
        options.value = { ...options.value, page: 1 };
        fetchExamTemplates();
    };

    const handleFiltersReset = () => {
        selectedFilters.value = { [EXAM_TYPE_FILTER_KEY]: null };
        options.value = { ...options.value, page: 1 };
        fetchExamTemplates();
    };

    const handleOptionsUpdate = (newOptions: TableOptions) => {
        options.value = newOptions;
        fetchExamTemplates();
    };

    const handleItemsUpdate = () => {
        fetchExamTemplates();
    };

    return {
        examTemplates,
        totalItems,
        isLoading,
        errors: computed(() => [error.value].filter((e) => e !== undefined)),
        headers,
        filterSections,
        searchInputValue,
        selectedFilters,
        sortBy,
        handleSearch,
        handleClear,
        handleFiltersUpdate,
        handleFiltersReset,
        handleOptionsUpdate,
        handleItemsUpdate,
    };
};
