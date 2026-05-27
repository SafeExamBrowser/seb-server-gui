<template>
    <BasicPage
        :title="$t('titles.analyze')"
        :bread-crumb="[{ label: $t('titles.analyze') }]"
        :data-test-id="dataTestId"
    >
        <template #PanelTop>
            <SearchBar
                v-model="searchInputValue"
                search-text="examList.info.examNameSearchPlaceholder"
                date-title="examList.info.examStartSearchPlaceholder"
                :date-value="dateValue"
                :filter-sections="filterSections"
                :filter-values="selectedFilters"
                :data-test-id="dataTestId"
                @search="onSearch"
                @clear="onClearSearch"
                @update:date-value="setDate"
                @update:filter-values="setFilters"
                @clear-filters="clearAll"
            />
        </template>
        <template #PanelMain>
            <LoadingFallbackComponent
                :loading="false"
                :errors="error ? [error] : []"
            >
                <EntityTable
                    class="pl-6 pr-6 pt-3"
                    :headers="examTableHeaders"
                    :items="tableData?.content ?? []"
                    :page-count="pageCount"
                    :items-per-page="options.itemsPerPage"
                    :options="options"
                    :loading="loading"
                    :cell-formatters="cellFormatters"
                    :actions="tableActions"
                    :data-test-id="dataTestId"
                    item-key="id"
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
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import EnumChip from "@/components/widgets/EnumChip.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState";
import { useAnalyzeExams } from "@/pages/(app)/analyze/api/useAnalyzeExams";
import { useAnalyzeTableFilters } from "@/pages/(app)/analyze/composables/useAnalyzeTableFilters";
import {
    EXAM_STATUS_FILTER_KEY,
    TYPE_FILTER_KEY,
} from "@/pages/(app)/exam/composables/useExamFilters";
import { computed, ref, watch } from "vue";
import { useExamTableHeaders } from "@/pages/(app)/exam/composables/useExamTableHeaders";
import { useAnalyzeTableActions } from "@/pages/(app)/analyze/composables/useAnalyzeTableActions";
import {
    examStatusColor,
    ExamStatusEnum,
} from "@/models/seb-server/examFiltersEnum";
import { RouteLocationAsRelative, useRouter } from "vue-router";
import { TableItem } from "@/components/widgets/entity-table/types";

const router = useRouter();
const dataTestId = "analyze";

const filterSections = useAnalyzeTableFilters();
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
    clearAll,
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
} = useAnalyzeExams(
    options,
    searchField,
    dateTimestamp,
    selectedType,
    selectedStatus,
);

const { headers: examTableHeaders, cellFormatters } = useExamTableHeaders();
const tableData = ref<import("@/models/seb-server/exam").Exams>();
const pageCount = computed(() => tableData.value?.number_of_pages ?? 0);
const tableActions = useAnalyzeTableActions({ onShowSPS: showSPS });

watch(
    fetchedData,
    (v) => {
        tableData.value = v;
    },
    { immediate: true },
);

async function showSPS(item: TableItem) {
    if (!item.quizName) return;

    const target: RouteLocationAsRelative = {
        name: "/(app)/sp-search/",
        query: {
            examName: String(item.quizName),
            startDate: String(item.startDate),
        },
    };

    await router.push(target);
}
</script>
