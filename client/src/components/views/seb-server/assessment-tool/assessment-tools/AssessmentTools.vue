<template>
    <BasicSettingsPage :title="$t('titles.assessmentToolConnections')">
        <template #ActionButton>
            <AddButton
                text="assessmentToolConnections.assessmentToolsPage.addAssessmentTool"
                :route="{ name: 'CreateAssessmentTool' }"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <v-row class="align-start">
                    <v-col cols="12" md="5">
                        <SearchSection
                            v-model="searchInputValue"
                            search-text="assessmentToolConnections.assessmentToolsPage.filters.searchField"
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

                <v-row>
                    <v-col>
                        <div v-if="error">{{ error }}</div>
                        <div v-else-if="deleteError">{{ deleteError }}</div>
                        <div v-else-if="statusError">{{ statusError }}</div>

                        <EntityTable
                            :headers="assessmentToolTableHeaders"
                            :items="tableData?.content ?? []"
                            :total-items="totalItems"
                            :page-count="pageCount"
                            :items-per-page="options.itemsPerPage"
                            :options="options"
                            :loading="loading || deleteLoading || statusLoading"
                            :detail-route="
                                getRouteName('AssessmentToolDetailAndView')
                            "
                            route-param-key="lmsId"
                            item-identifier-key="id"
                            translation-key-prefix="assessmentToolConnections.assessmentToolsPage"
                            :cell-formatters="cellFormatters"
                            @update:options="loadItems"
                            @delete="removeAssessmentToolFromItem"
                            @status-change="toggleAssessmentToolStatusFromItem"
                        />
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import { getRouteName } from "@/router/routeNames.ts";
import SearchSection from "@/components/layout/pages/widgets/SearchSection.vue";
import FiltersBar from "@/components/blocks/filters/FiltersBar.vue";
import EntityTable from "@/components/blocks/entity-table/EntityTable.vue";
import { useUrlTableState } from "@/components/blocks/entity-table/composables/useUrlTableState.ts";
import { useAssessmentToolsTableHeaders } from "@/components/views/seb-server/assessment-tool/assessment-tools/composables/useAssessmentToolsTableHeaders.ts";
import {
    useAssessmentToolsFilters,
    LMS_TYPE_FILTER_KEY,
} from "@/components/views/seb-server/assessment-tool/assessment-tools/composables/useAssessmentToolsFilters.ts";
import { STATUS_FILTER_KEY } from "@/components/blocks/filters/statusFilterSection.ts";
import { INSTITUTION_FILTER_KEY } from "@/components/blocks/filters/useInstitutionFilterSection.ts";
import { useAssessmentTools } from "@/components/views/seb-server/assessment-tool/assessment-tools/api/useAssessmentTools.ts";
import { useDeleteAssessmentTool } from "@/components/views/seb-server/assessment-tool/assessment-tools/api/useDeleteAssessmentTool.ts";
import { useToggleAssessmentToolStatus } from "@/components/views/seb-server/assessment-tool/assessment-tools/api/useToggleAssessmentTool.ts";
import { useTableCellFormatters } from "@/components/blocks/entity-table/composables/useTableCellFormatters.ts";
import type { AssessmentToolsResponse } from "@/models/seb-server/assessmentTool.ts";
import type { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums.ts";
import AddButton from "@/components/widgets/AddButton.vue";

const assessmentToolTableHeaders = useAssessmentToolsTableHeaders();
const filterSections = useAssessmentToolsFilters();

const tableData = ref<AssessmentToolsResponse>();

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
    await fetchAssessmentTools();
}, [STATUS_FILTER_KEY, INSTITUTION_FILTER_KEY, LMS_TYPE_FILTER_KEY]);

const selectedStatus = computed(() => selectedFilters.value.status);
const selectedInstitutionId = computed(
    () => selectedFilters.value.institutionId,
);
const selectedType = computed(
    () => selectedFilters.value.selectedType as LMSTypeEnum | null,
);

const {
    data: fetchedData,
    loading,
    error,
    fetchData: fetchAssessmentTools,
} = useAssessmentTools(
    options,
    searchField,
    selectedStatus,
    selectedType,
    selectedInstitutionId,
);

watch(
    fetchedData,
    (v) => {
        tableData.value = v;
    },
    { immediate: true },
);

const pageCount = computed(() => tableData.value?.number_of_pages ?? 0);

const {
    removeAssessmentToolFromItem,
    loading: deleteLoading,
    error: deleteError,
} = useDeleteAssessmentTool(tableData);

const {
    toggleAssessmentToolStatusFromItem,
    loading: statusLoading,
    error: statusError,
} = useToggleAssessmentToolStatus(tableData);

const { cellFormatters } = useTableCellFormatters({
    headers: assessmentToolTableHeaders,
});
</script>
