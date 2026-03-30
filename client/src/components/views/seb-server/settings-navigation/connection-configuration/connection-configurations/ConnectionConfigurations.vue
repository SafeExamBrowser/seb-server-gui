<template>
    <BasicSettingsPage :title="$t('titles.connectionConfigurations')">
        <template #ActionButton>
            <AddButton
                text="connectionConfigurations.connectionConfigurationsPage.addConnectionConfiguration"
                :route="CREATE_CONNECTION_CONFIGURATION_ROUTE"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <v-row class="align-start">
                    <v-col cols="12" md="5">
                        <SearchSection
                            :store="connectionConfigurationsStore"
                            search-text="connectionConfigurations.connectionConfigurationsPage.filters.searchField"
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
                            :headers="connectionConfigurationTableHeaders"
                            :items="data?.content ?? []"
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
import { computed, watch } from "vue";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import AddButton from "@/components/views/seb-server/settings-navigation/widgets/AddButton.vue";
import {
    CONNECTION_CONFIGURATIONS_ROUTE,
    CREATE_CONNECTION_CONFIGURATION_ROUTE,
} from "@/utils/constants.ts";
import SearchSection from "@/components/views/seb-server/settings-navigation/components/SearchSection.vue";
import SettingsFilters from "@/components/views/seb-server/settings-navigation/components/SettingsFilters.vue";
import SettingsTable from "@/components/views/seb-server/settings-navigation/components/SettingsTable/SettingsTable.vue";

import { useServerSettingsTable } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useServerSettingsTable.ts";
import { useConnectionConfigurationsTableHeaders } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/composables/useConnectionConfigurationsTableHeaders.ts";
import { useConnectionConfigurationsStore } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/store/connectionConfigurationsStore.ts";
import { useConnectionConfigurations } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/api/useConnectionConfigurations.ts";
import { useDeleteConnectionConfiguration } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/api/useDeleteConnectionConfiguration.ts";
import { useToggleConnectionConfigurationStatus } from "@/components/views/seb-server/settings-navigation/connection-configuration/connection-configurations/api/useToggleConnectionConfigurationStatus.ts";
import { useSettingsTableFilters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableFilters.ts";
import { useSettingsTableCellFormatters } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsTableCellFormatters.ts";

const connectionConfigurationsStore = useConnectionConfigurationsStore();
const connectionConfigurationTableHeaders =
    useConnectionConfigurationsTableHeaders();

const { data, loading, error, fetchConnectionConfigurations } =
    useConnectionConfigurations();
const pageCount = computed(() => data.value?.number_of_pages ?? 0);

const {
    removeConnectionConfigurationFromItem,
    loading: deleteLoading,
    error: deleteError,
} = useDeleteConnectionConfiguration(data);

const {
    toggleConnectionConfigurationStatusFromItem,
    loading: statusLoading,
    error: statusError,
} = useToggleConnectionConfigurationStatus(data);

const {
    selectedFilters,
    options,
    totalItems,
    loadItems,
    onSearch,
    onClearSearch,
} = useServerSettingsTable(
    connectionConfigurationsStore,
    data,
    async ({ options, searchField, filters }) => {
        await fetchConnectionConfigurations(
            options,
            searchField,
            filters.status,
            filters.institutionId,
        );
    },
    undefined,
    {
        status: null,
        institutionId: null,
    },
);

const { filters, filtersReady, filtersRenderKey } = useSettingsTableFilters({
    headers: connectionConfigurationTableHeaders,
    translationPrefix: "connectionConfigurations.connectionConfigurationsPage",
});

const { cellFormatters } = useSettingsTableCellFormatters({
    headers: connectionConfigurationTableHeaders,
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
