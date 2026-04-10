<template>
    <BasicSettingsPage :title="$t('titles.connectionConfigurations')">
        <template #ActionButton>
            <AddButton
                text="connectionConfigurations.connectionConfigurationsPage.addConnectionConfiguration"
                :route="{ name: 'CreateConnectionConfiguration' }"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <v-row class="align-start">
                    <v-col cols="12" md="5">
                        <SearchSection
                            v-model="searchInputValue"
                            search-text="connectionConfigurations.connectionConfigurationsPage.filters.searchField"
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

                        <SettingsTable
                            :headers="connectionConfigurationTableHeaders"
                            :items="tableData?.content ?? []"
                            :total-items="totalItems"
                            :page-count="pageCount"
                            :items-per-page="options.itemsPerPage"
                            :options="options"
                            :loading="loading || deleteLoading || statusLoading"
                            :route="CONNECTION_CONFIGURATIONS_ROUTE"
                            item-identifier-key="id"
                            translation-key-prefix="connectionConfigurations.connectionConfigurationsPage"
                            :cell-formatters="cellFormatters"
                            @update:options="loadItems"
                            @delete="removeConnectionConfigurationFromItem"
                            @status-change="
                                toggleConnectionConfigurationStatusFromItem
                            "
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
import { CONNECTION_CONFIGURATIONS_ROUTE } from "@/utils/constants.ts";
import SearchSection from "@/components/views/seb-server/settings-navigation/components/SearchSection.vue";
import FiltersBar from "@/components/views/seb-server/settings-navigation/components/filters/FiltersBar.vue";
import SettingsTable from "@/components/views/seb-server/settings-navigation/components/SettingsTable/SettingsTable.vue";
import { useUrlSettingsTable } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useUrlSettingsTable.ts";
import { useConnectionConfigurationsTableHeaders } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/composables/useConnectionConfigurationsTableHeaders.ts";
import { useConnectionConfigurationsFilters } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/composables/useConnectionConfigurationsFilters.ts";
import { STATUS_FILTER_KEY } from "@/components/views/seb-server/settings-navigation/components/filters/statusFilterSection";
import { INSTITUTION_FILTER_KEY } from "@/components/views/seb-server/settings-navigation/components/filters/useInstitutionFilterSection";
import { useConnectionConfigurations } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/api/useConnectionConfigurations.ts";
import { useDeleteConnectionConfiguration } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/api/useDeleteConnectionConfiguration.ts";
import { useToggleConnectionConfigurationStatus } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/api/useToggleConnectionConfigurationStatus.ts";
import { useSettingsTableCellFormatters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableCellFormatters.ts";
import type { ConnectionConfigurations } from "@/models/seb-server/connectionConfiguration.ts";

const connectionConfigurationTableHeaders =
    useConnectionConfigurationsTableHeaders();
const filterSections = useConnectionConfigurationsFilters();

const tableData = ref<ConnectionConfigurations>();

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
} = useUrlSettingsTable(tableData, async () => {
    await fetchConnectionConfigurations();
}, [STATUS_FILTER_KEY, INSTITUTION_FILTER_KEY]);

const selectedStatus = computed(() => selectedFilters.value.status);
const selectedInstitutionId = computed(
    () => selectedFilters.value.institutionId,
);

const {
    data: fetchedData,
    loading,
    error,
    fetchData: fetchConnectionConfigurations,
} = useConnectionConfigurations(
    options,
    searchField,
    selectedStatus,
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
    removeConnectionConfigurationFromItem,
    loading: deleteLoading,
    error: deleteError,
} = useDeleteConnectionConfiguration(tableData);

const {
    toggleConnectionConfigurationStatusFromItem,
    loading: statusLoading,
    error: statusError,
} = useToggleConnectionConfigurationStatus(tableData);

const { cellFormatters } = useSettingsTableCellFormatters({
    headers: connectionConfigurationTableHeaders,
});
</script>
