<template>
    <BasicPage
        :title="$t('titles.exams')"
        :bread-crumb="[{ label: $t('titles.exams') }]"
        :data-test-id="dataTestId"
        :panel-left-collapsed="!filtersOpen"
    >
        <template #PanelLeft>
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
                @collapse="filtersOpen = false"
            />
        </template>
        <template #PanelMain>
            <FilterControlsRow
                :open="filtersOpen"
                :pills="activePills"
                :data-test-id="dataTestId"
                @toggle="filtersOpen = !filtersOpen"
                @remove="onRemovePill"
                @clear-all="clearAll"
            />
            <LoadingFallbackComponent
                :loading="false"
                :errors="error ? [error] : []"
            >
                <EntityTable
                    class="px-2 pt-2"
                    :headers="examTableHeaders"
                    :items="tableData?.content ?? []"
                    :page-count="pageCount"
                    :items-per-page="options.itemsPerPage"
                    :options="options"
                    :loading="loading"
                    :detail-route="examDetailRoute"
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
import { computed, ref, watch } from "vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import EnumChip from "@/components/widgets/EnumChip.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import FilterControlsRow from "@/components/widgets/filters/FilterControlsRow.vue";
import { useActiveFilterPills } from "@/components/widgets/filters/useActiveFilterPills.ts";
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
import { useRouter, type RouteLocationAsRelative } from "vue-router";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

definePage({
    meta: {
        titleKey: "titles.exams",
        pageTestId: "exams-page",
    },
});

const router = useRouter();

const dataTestId = "exams";

const examDetailRoute = (item: TableItem): RouteLocationAsRelative | null =>
    item.id != null
        ? {
              name: "/(app)/exam/[id]/",
              params: { id: String(item.id) },
          }
        : null;

const { headers: examTableHeaders, cellFormatters } = useExamTableHeaders();
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
    clearAll,
    setDate,
} = useUrlTableState(
    async () => {
        await fetchExams();
    },
    [TYPE_FILTER_KEY, EXAM_STATUS_FILTER_KEY],
    "startDate",
);

const filtersOpen = ref(true);

const activePills = useActiveFilterPills(filterSections, selectedFilters);

function onRemovePill(sectionKey: string) {
    void setFilters({ ...selectedFilters.value, [sectionKey]: null });
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

const tableActions = useExamTableActions({
    onNavigate: (item) => {
        const target = examDetailRoute(item);
        if (!target) {
            // TODO @andrei implement error handling
            return;
        }
        void router.push(target);
    },
});
</script>
