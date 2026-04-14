<template>
    <BasicPage
        :title="$t('titles.examTemplateList')"
        :bread-crumb="[
            {
                label: $t('titles.examTemplateList'),
            },
        ]"
    >
        <template #PanelTop>
            <SearchBar
                v-model="searchInput"
                search-text="examTemplateList.info.nameSearchPlaceholder"
                search-title="examTemplateList.info.name"
                :filter-sections="filterSections"
                :filter-values="selectedFilters"
                @search="handleSearch"
                @clear="handleClear"
                @update:filter-values="handleFiltersUpdate"
                @clear-filters="handleFiltersReset"
            />
        </template>
        <template #PanelMain>
            <LoadingFallbackComponent :loading="false" :errors="errors">
                <ExamTemplateTable
                    :headers="headers"
                    :items="examTemplates"
                    :items-length="totalItems"
                    :is-loading="isLoading"
                    :sort-by="sortBy"
                    @update:items="handleItemsUpdate"
                    @update:options="handleOptionsUpdate"
                />
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SearchBar from "@/components/blocks/searches/SearchBar.vue";
import ExamTemplateTable from "./components/ExamTemplateTable.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useExamTemplateList } from "./composables/useExamTemplateList";

const {
    search: { filterSections, searchInput, selectedFilters },
    table: { headers, examTemplates, totalItems, isLoading, errors, sortBy },
    handleSearch,
    handleClear,
    handleFiltersUpdate,
    handleFiltersReset,
    handleOptionsUpdate,
    handleItemsUpdate,
} = useExamTemplateList();
</script>
