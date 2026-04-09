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
                            search-text="userAccount.userAccountPage.filters.searchField"
                            @search="onSearch"
                            @clear="onClearSearch"
                        />
                    </v-col>

                    <v-col cols="12" md="7">
                        <div class="filters-row">
                            <SettingsFilters
                                v-if="filtersReady"
                                :key="filtersRenderKey"
                                v-model="selectedFilters"
                                :filters="filters"
                            />
                            <v-btn
                                variant="text"
                                size="small"
                                class="clear-filters-btn"
                                :style="{
                                    visibility: hasActiveFilters
                                        ? 'visible'
                                        : 'hidden',
                                }"
                                @click="resetFilters"
                            >
                                <v-icon start size="small">mdi-close</v-icon>
                                {{ $t("general.clearFilters") }}
                            </v-btn>
                        </div>
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
import { ASSESSMENT_TOOL_CONNECTIONS_ROUTE } from "@/utils/constants.ts";
import SearchSection from "@/components/views/seb-server/settings-navigation/components/SearchSection.vue";
import SettingsFilters from "@/components/views/seb-server/settings-navigation/components/SettingsFilters.vue";
import SettingsTable from "@/components/views/seb-server/settings-navigation/components/SettingsTable/SettingsTable.vue";

import { useUrlSettingsTable } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useUrlSettingsTable.ts";
import { useAssessmentToolsTableHeaders } from "@/components/views/seb-server/settings-navigation/assessment-tool/assessment-tools/composables/useAssessmentToolsTableHeaders.ts";
import { useAssessmentTools } from "@/components/views/seb-server/settings-navigation/assessment-tool/assessment-tools/api/useAssessmentTools.ts";
import { useDeleteAssessmentTool } from "@/components/views/seb-server/settings-navigation/assessment-tool/assessment-tools/api/useDeleteAssessmentTool.ts";
import { useToggleAssessmentToolStatus } from "@/components/views/seb-server/settings-navigation/assessment-tool/assessment-tools/api/useToggleAssessmentTool.ts";
import { useSettingsTableFilters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableFilters.ts";
import { useSettingsTableCellFormatters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableCellFormatters.ts";
import { AssessmentToolsResponse } from "@/models/seb-server/assessmentTool.ts";
import { SettingsFilterDefinition } from "@/models/types.ts";
import { translate } from "@/utils/generalUtils.ts";
import { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums.ts";

const assessmentToolTableHeaders = useAssessmentToolsTableHeaders();

const tableData = ref<AssessmentToolsResponse>();

const lmsTypeFilter = computed<SettingsFilterDefinition[]>(() => [
    {
        key: "selectedType",
        title: translate(
            "assessmentToolConnections.assessmentToolsPage.filters.assessmentToolTypeFilter",
        ),
        options: Object.values(LMSTypeEnum).map((type) => ({
            value: type,
            label: translate(`assessmentToolConnections.lmsTypes.${type}`),
        })),
    },
]);

const {
    searchInputValue,
    searchField,
    selectedFilters,
    options,
    totalItems,
    hasActiveFilters,
    loadItems,
    onSearch,
    onClearSearch,
    resetFilters,
} = useUrlSettingsTable(tableData, async () => {
    await fetchAssessmentTools();
}, ["status", "institutionId", "selectedType"]);

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
    customFilters: lmsTypeFilter,
});

const { cellFormatters } = useSettingsTableCellFormatters({
    headers: assessmentToolTableHeaders,
});
</script>

<style scoped>
.filters-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 0.25rem;
}

.clear-filters-btn {
    color: #757575;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: none;
    letter-spacing: 0;
    padding: 0 0.5rem;
    min-height: 28px;
    transition: color 0.2s ease;
}

.clear-filters-btn:hover {
    color: #215caf;
}
</style>
