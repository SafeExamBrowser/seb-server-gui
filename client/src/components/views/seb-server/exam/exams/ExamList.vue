<template>
    <BasicPage :title="$t('titles.exams')" :bread-crumb="breadCrumb">
        <template #PanelTop>
            <SearchBar
                v-model="searchInputValue"
                search-text="examList.info.examName"
                search-title="examList.info.examNameSearchPlaceholder"
                date-title="examList.info.examStartSearchPlaceholder"
                :date-value="dateValue"
                :filter-sections="filterSections"
                :filter-values="selectedFilters"
                @search="onSearch"
                @clear="onClear"
                @update:date-value="setDate"
                @update:filter-values="setFilters"
                @clear-filters="resetFilters"
            />
        </template>
        <template #PanelMain>
            <div v-if="error" class="pa-4">{{ error }}</div>
            <LoadingFallbackComponent :loading="false" :errors="[]">
                <EntityTable
                    :headers="examTableHeaders"
                    :items="tableData?.content ?? []"
                    :total-items="totalItems"
                    :page-count="pageCount"
                    :items-per-page="options.itemsPerPage"
                    :options="options"
                    :loading="loading"
                    :detail-route="getRouteName('ExamDetail')"
                    route-param-key="id"
                    item-identifier-key="id"
                    translation-key-prefix="examList"
                    :cell-formatters="cellFormatters"
                    @update:options="loadItems"
                />
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SearchBar from "@/components/blocks/searches/SearchBar.vue";
import EntityTable from "@/components/blocks/entity-table/EntityTable.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUrlTableState } from "@/components/blocks/entity-table/composables/useUrlTableState.ts";
import { useExamTableHeaders } from "@/components/views/seb-server/exam/exams/composables/useExamTableHeaders.ts";
import {
    useExamFilters,
    TYPE_FILTER_KEY,
    EXAM_STATUS_FILTER_KEY,
} from "@/components/views/seb-server/exam/exams/composables/useExamFilters.ts";
import { useExams } from "@/components/views/seb-server/exam/exams/api/useExams.ts";
import { useTableCellFormatters } from "@/components/blocks/entity-table/composables/useTableCellFormatters.ts";
import { getRouteName } from "@/router/routeNames.ts";
import { translate } from "@/utils/generalUtils.ts";
import type { Exams } from "@/models/seb-server/exam.ts";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";

const breadCrumb: BreadCrumbItem[] = [
    { label: translate("titles.home"), link: "/" },
];

const examTableHeaders = useExamTableHeaders();
const filterSections = useExamFilters();

const tableData = ref<Exams>();

const {
    searchInputValue,
    searchField,
    selectedFilters,
    dateValue,
    dateTimestamp,
    options,
    totalItems,
    loadItems,
    onSearch,
    setFilters,
    resetFilters,
    clearAll,
    setDate,
} = useUrlTableState(
    tableData,
    async () => {
        await fetchExams();
    },
    [TYPE_FILTER_KEY, EXAM_STATUS_FILTER_KEY],
    "startDate",
);

async function onClear() {
    await clearAll();
}

const selectedType = computed(() => selectedFilters.value[TYPE_FILTER_KEY]);
const selectedStatus = computed(
    () => selectedFilters.value[EXAM_STATUS_FILTER_KEY],
);

const {
    data: fetchedData,
    loading,
    error,
    fetchData: fetchExams,
} = useExams(options, searchField, dateTimestamp, selectedType, selectedStatus);

watch(
    fetchedData,
    (v) => {
        tableData.value = v;
    },
    { immediate: true },
);

const pageCount = computed(() => tableData.value?.number_of_pages ?? 0);

const { cellFormatters } = useTableCellFormatters({
    headers: examTableHeaders,
});
</script>
