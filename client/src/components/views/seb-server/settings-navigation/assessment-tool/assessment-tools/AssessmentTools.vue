<template>
    <BasicSettingsPage :title="$t('titles.assessmentToolConnections')">
        <template #ActionButton>
            <AddButton
                text="assessmentToolConnections.assessmentToolsPage.addAssessmentTool"
                :route="CREATE_ASSESSMENT_TOOL_CONNECTION_ROUTE"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <v-row class="align-start">
                    <v-col cols="12" md="5">
                        <SearchSection
                            :store="assessmentToolStore"
                            search-text="userAccount.userAccountPage.filters.searchField"
                            @search="onSearch"
                            @clear="onClearSearch"
                        />
                    </v-col>

                    <v-col cols="12" md="7">
                        <SettingsFilters
                            v-if="filtersReady"
                            :key="filtersRenderKey"
                            v-model="selectedFilters"
                            :filters="filters"
                        />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <div v-if="error">
                            {{ error }}
                        </div>

                        <div v-else-if="deleteError">
                            {{ deleteError }}
                        </div>

                        <div v-else-if="statusError">
                            {{ statusError }}
                        </div>

                        <SettingsTable
                            :headers="assessmentToolTableHeaders"
                            :items="tableData?.content ?? []"
                            :total-items="totalItems"
                            :page-count="pageCount"
                            :items-per-page="options.itemsPerPage"
                            :options="options"
                            :loading="loading || deleteLoading || statusLoading"
                            :route="ASSESSMENT_TOOL_CONNECTIONS_ROUTE"
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
import AddButton from "@/components/views/seb-server/settings-navigation/widgets/AddButton.vue";
import {
    ASSESSMENT_TOOL_CONNECTIONS_ROUTE,
    CREATE_ASSESSMENT_TOOL_CONNECTION_ROUTE,
} from "@/utils/constants.ts";
import SearchSection from "@/components/views/seb-server/settings-navigation/components/SearchSection.vue";
import SettingsFilters from "@/components/views/seb-server/settings-navigation/components/SettingsFilters.vue";
import SettingsTable from "@/components/views/seb-server/settings-navigation/components/SettingsTable/SettingsTable.vue";

import { useServerSettingsTable } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useServerSettingsTable.ts";
import { useAssessmentToolsStore } from "@/components/views/seb-server/settings-navigation/assessment-tool/assessment-tools/store/assessmentToolsStore.ts";
import { useAssessmentToolsTableHeaders } from "@/components/views/seb-server/settings-navigation/assessment-tool/assessment-tools/composables/useAssessmentToolsTableHeaders.ts";
import { useAssessmentTools } from "@/components/views/seb-server/settings-navigation/assessment-tool/assessment-tools/api/useAssessmentTools.ts";
import { useDeleteAssessmentTool } from "@/components/views/seb-server/settings-navigation/assessment-tool/assessment-tools/api/useDeleteAssessmentTool.ts";
import { useToggleAssessmentToolStatus } from "@/components/views/seb-server/settings-navigation/assessment-tool/assessment-tools/api/useToggleAssessmentTool.ts";
import { useSettingsTableFilters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableFilters.ts";
import { useSettingsTableCellFormatters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableCellFormatters.ts";
import type {
    AssessmentToolsResponse,
    LMSTypeEnum,
} from "@/models/seb-server/assessmentTool.ts";

const assessmentToolStore = useAssessmentToolsStore();
const assessmentToolTableHeaders = useAssessmentToolsTableHeaders();

const tableData = ref<AssessmentToolsResponse>();

const {
    selectedFilters,
    options,
    totalItems,
    loadItems,
    onSearch,
    onClearSearch,
} = useServerSettingsTable(
    assessmentToolStore,
    tableData,
    async () => {
        await fetchAssessmentTools();
    },
    undefined,
    {
        status: null,
        institutionId: null,
        selectedType: null,
    },
);

const searchField = computed(() => assessmentToolStore.searchField ?? null);

const selectedStatus = computed(
    () => (selectedFilters.value.status as string | null) ?? null,
);

const selectedInstitutionId = computed(
    () => (selectedFilters.value.institutionId as string | null) ?? null,
);

const selectedType = computed(
    () => (selectedFilters.value.selectedType as LMSTypeEnum | null) ?? null,
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
    (newValue) => {
        tableData.value = newValue;
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

const { filters, filtersReady, filtersRenderKey } = useSettingsTableFilters({
    headers: assessmentToolTableHeaders,
    translationPrefix: "assessmentToolConnections.assessmentToolsPage",
});

const { cellFormatters } = useSettingsTableCellFormatters({
    headers: assessmentToolTableHeaders,
});

watch(
    selectedFilters,
    async () => {
        options.value = {
            ...options.value,
            page: 1,
        };

        await loadItems();
    },
    { deep: true },
);
</script>
