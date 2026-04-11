<template>
    <BasicPage :title="$t('titles.exams')" :bread-crumb="breadCrumb">
        <template #PanelMain>
            <v-col>
                <v-row class="mb-4">
                    <v-col>
                        <v-card elevation="4" rounded="lg">
                            <v-row class="align-start pa-2">
                                <v-col cols="12" md="5">
                                    <SearchSection
                                        v-model="searchInputValue"
                                        search-text="examList.info.examName"
                                        @search="onSearch"
                                        @clear="onClearSearch"
                                    />
                                </v-col>

                                <v-col cols="12" md="7">
                                    <FiltersBar
                                        :model-value="selectedFilters"
                                        :sections="filterSections"
                                        @update:model-value="setFilters"
                                        @clear="resetFilters"
                                    />
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-card elevation="4" rounded="lg">
                            <div v-if="error" class="pa-4">{{ error }}</div>

                            <LoadingFallbackComponent
                                :loading="false"
                                :errors="[]"
                            >
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
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SearchSection from "@/components/layout/pages/widgets/SearchSection.vue";
import FiltersBar from "@/components/blocks/filters/FiltersBar.vue";
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
    options,
    totalItems,
    loadItems,
    onSearch,
    onClearSearch,
    setFilters,
    resetFilters,
} = useUrlTableState(tableData, async () => {
    await fetchExams();
}, [TYPE_FILTER_KEY, EXAM_STATUS_FILTER_KEY]);

const selectedType = computed(() => selectedFilters.value[TYPE_FILTER_KEY]);
const selectedStatus = computed(
    () => selectedFilters.value[EXAM_STATUS_FILTER_KEY],
);

const {
    data: fetchedData,
    loading,
    error,
    fetchData: fetchExams,
} = useExams(options, searchField, selectedType, selectedStatus);

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
