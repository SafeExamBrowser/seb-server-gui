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
                @clear="onClearSearch"
                @update:date-value="setDate"
                @update:filter-values="setFilters"
                @clear-filters="resetFilters"
            />
        </template>
        <template #PanelMain>
            <div v-if="error" class="pa-4">{{ error }}</div>
            <LoadingFallbackComponent :loading="false" :errors="[]">
                <EntityTable
                    class="pl-6 pr-6 pt-3"
                    :headers="examTableHeaders"
                    :items="tableData?.content ?? []"
                    :page-count="pageCount"
                    :items-per-page="options.itemsPerPage"
                    :options="options"
                    :loading="loading"
                    :detail-route="getRouteName('ExamDetail')"
                    route-param-key="examId"
                    item-identifier-key="id"
                    :cell-formatters="cellFormatters"
                    @update:options="loadItems"
                >
                    <template #cell-type="{ formattedValue }">
                        <EnumChip :label="formattedValue" />
                    </template>

                    <template #cell-status="{ value, formattedValue }">
                        <EnumChip
                            :label="formattedValue"
                            :color="examStatusColor[value as ExamStatusEnum]"
                        />
                    </template>
                </EntityTable>
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SearchBar from "@/components/blocks/searches/SearchBar.vue";
import EntityTable from "@/components/blocks/entity-table/EntityTable.vue";
import EnumChip from "@/components/blocks/entity-table/widgets/EnumChip.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUrlTableState } from "@/components/blocks/entity-table/composables/useUrlTableState.ts";
import { useExamTableHeaders } from "@/components/views/seb-server/exam/exams/composables/useExamTableHeaders.ts";
import {
    useExamFilters,
    TYPE_FILTER_KEY,
    EXAM_STATUS_FILTER_KEY,
} from "@/components/views/seb-server/exam/exams/composables/useExamFilters.ts";
import { useExams } from "@/components/views/seb-server/exam/exams/api/useExams.ts";
import { useSebServerCellFormatters } from "@/components/views/seb-server/composables/useSebServerCellFormatters.ts";
import { getRouteName } from "@/router/routeNames.ts";
import { translate } from "@/utils/generalUtils.ts";
import type { Exams } from "@/models/seb-server/exam.ts";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";
import {
    ExamStatusEnum,
    examStatusColor,
} from "@/models/seb-server/examFiltersEnum.ts";

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
    loadItems,
    onSearch,
    onClearSearch,
    setFilters,
    resetFilters,
    setDate,
} = useUrlTableState(
    async () => {
        await fetchExams();
    },
    [TYPE_FILTER_KEY, EXAM_STATUS_FILTER_KEY],
    "startDate",
);

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

const { cellFormatters } = useSebServerCellFormatters(examTableHeaders);
</script>
