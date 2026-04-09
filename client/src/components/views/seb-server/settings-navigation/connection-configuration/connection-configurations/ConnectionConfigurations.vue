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
import SettingsFilters from "@/components/views/seb-server/settings-navigation/components/SettingsFilters.vue";
import SettingsTable from "@/components/views/seb-server/settings-navigation/components/SettingsTable/SettingsTable.vue";

import { useUrlSettingsTable } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useUrlSettingsTable.ts";
import { useConnectionConfigurationsTableHeaders } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/composables/useConnectionConfigurationsTableHeaders.ts";
import { useConnectionConfigurations } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/api/useConnectionConfigurations.ts";
import { useDeleteConnectionConfiguration } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/api/useDeleteConnectionConfiguration.ts";
import { useToggleConnectionConfigurationStatus } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/api/useToggleConnectionConfigurationStatus.ts";
import { useSettingsTableFilters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableFilters.ts";
import { useSettingsTableCellFormatters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableCellFormatters.ts";
import type { ConnectionConfigurations } from "@/models/seb-server/connectionConfiguration.ts";

const connectionConfigurationTableHeaders =
    useConnectionConfigurationsTableHeaders();

const tableData = ref<ConnectionConfigurations>();

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
    await fetchConnectionConfigurations();
}, ["status", "institutionId"]);

const selectedStatus = computed(
    () => (selectedFilters.value.status as string | null) ?? null,
);

const selectedInstitutionId = computed(
    () => (selectedFilters.value.institutionId as string | null) ?? null,
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
    (newValue) => {
        tableData.value = newValue;
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

const { filters, filtersReady, filtersRenderKey } = useSettingsTableFilters({
    headers: connectionConfigurationTableHeaders,
    translationPrefix: "connectionConfigurations.connectionConfigurationsPage",
});

const { cellFormatters } = useSettingsTableCellFormatters({
    headers: connectionConfigurationTableHeaders,
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
