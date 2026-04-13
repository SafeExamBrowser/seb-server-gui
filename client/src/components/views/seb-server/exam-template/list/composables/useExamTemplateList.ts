import { useExamTemplateSearch } from "./useExamTemplateSearch";
import { useExamTemplateTable } from "./useExamTemplateTable";
import type { TableFilters } from "@/components/blocks/entity-table/types";
import type { TableOptions } from "../types";

export const useExamTemplateList = () => {
    const search = useExamTemplateSearch();
    const table = useExamTemplateTable(search.searchQuery, search.examType);

    const handleSearch = () => {
        search.commitSearch();
        table.fetchFromFirstPage();
    };

    const handleResetAndFetch = () => {
        search.resetFilters();
        table.fetchFromFirstPage();
    };

    const handleFiltersUpdate = (newFilters: TableFilters) => {
        search.updateFilters(newFilters);
        table.fetchFromFirstPage();
    };

    const handleOptionsUpdate = (newOptions: TableOptions) => {
        table.updateOptions(newOptions);
    };

    const handleItemsUpdate = () => {
        table.fetchExamTemplates();
    };

    return {
        search: {
            filterSections: search.filterSections,
            searchInput: search.searchInput,
            selectedFilters: search.selectedFilters,
        },
        table: {
            headers: table.headers,
            examTemplates: table.examTemplates,
            totalItems: table.totalItems,
            isLoading: table.isLoading,
            errors: table.errors,
            sortBy: table.sortBy,
        },
        handleSearch,
        handleClear: handleResetAndFetch,
        handleFiltersUpdate,
        handleFiltersReset: handleResetAndFetch,
        handleOptionsUpdate,
        handleItemsUpdate,
    };
};
