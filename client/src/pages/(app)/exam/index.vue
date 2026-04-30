<template>
    <BasicPage
        :title="$t('titles.exams')"
        :bread-crumb="[{ label: $t('titles.exams') }]"
    >
        <template #PanelTop>
            <SearchBar
                v-model="searchInputValue"
                search-text="examList.info.examNameSearchPlaceholder"
                date-title="examList.info.examStartSearchPlaceholder"
                :date-value="dateValue"
                :filter-sections="filterSections"
                :filter-values="selectedFilters"
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
                    :detail-route="examDetailRoute"
                    :item-identifier-key="examItemIdentifierKey"
                    :cell-formatters="cellFormatters"
                    :actions="tableActions"
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
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import EnumChip from "@/components/widgets/EnumChip.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { useExamTableHeaders } from "@/pages/(app)/exam/composables/useExamTableHeaders.ts";
import { useExamTableActions } from "@/pages/(app)/exam/composables/useExamTableActions.ts";
import {
    useExamFilters,
    TYPE_FILTER_KEY,
    EXAM_STATUS_FILTER_KEY,
} from "@/pages/(app)/exam/composables/useExamFilters.ts";
import { useExams } from "@/pages/(app)/exam/api/useExams.ts";
import type { Exams } from "@/models/seb-server/exam.ts";
import {
    ExamStatusEnum,
    examStatusColor,
} from "@/models/seb-server/examFiltersEnum.ts";
import { useDetailRouteNavigation } from "@/router/detailRoute.ts";
import type { RouteLocationAsRelative } from "vue-router";

definePage({
    meta: {
        titleKey: "titles.exams",
        pageTestId: "exams-page",
    },
});
const examDetailRoute: RouteLocationAsRelative = {
    name: "/(app)/exam/[id]/",
};

const examItemIdentifierKey = "id";

const { headers: examTableHeaders, cellFormatters } = useExamTableHeaders();
const filterSections = useExamFilters();
const { pushDetailRoute } = useDetailRouteNavigation();

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
} = useExams(options, searchField, dateTimestamp, selectedType, selectedStatus);

watch(
    fetchedData,
    (v) => {
        tableData.value = v;
    },
    { immediate: true },
);

const pageCount = computed(() => tableData.value?.number_of_pages ?? 0);

const tableActions = useExamTableActions({
    onNavigate: (item) =>
        pushDetailRoute(examDetailRoute, item, examItemIdentifierKey),
});
</script>
