<template>
    <v-sheet elevation="4" class="rounded-lg pa-8">
        <!-- Filters & Search Row -->
        <v-row class="mb-4" align="center">
            <v-col cols="4">
                <v-tabs v-model="statusFilter" fixed-tabs color="primary" class="mb-4">
                    <v-tab value="all">{{ translate("monitoringDetails.logContainer.sortingAndFilter.all") }}</v-tab>
                    <v-tab value="info">{{ translate("monitoringDetails.logContainer.sortingAndFilter.info") }}</v-tab>
                    <v-tab value="warn">{{
                            translate("monitoringDetails.logContainer.sortingAndFilter.warning")
                        }}
                    </v-tab>
                    <v-tab value="error">{{
                            translate("monitoringDetails.logContainer.sortingAndFilter.error")
                        }}
                    </v-tab>
                </v-tabs>
            </v-col>
            <v-col cols="2">
            </v-col>
            <v-col cols="6">
                <div class="d-flex align-center justify-end">
                    <v-btn
                        rounded="sm"
                        color="black"
                        variant="outlined"
                        @click="onClearSearch()"
                    >
                        {{ translate("general.cancelButton") }}
                    </v-btn>

                    <v-btn
                        rounded="sm"
                        color="primary"
                        variant="flat"
                        class="ml-2"
                        @click="onSearch()"

                    >
                        {{ translate("general.searchButton") }}
                    </v-btn>

                    <v-text-field
                        v-model="searchQuery"
                        :placeholder="translate('monitoringDetails.logContainer.sortingAndFilter.searchForLogs')"
                        variant="outlined"
                        density="comfortable"
                        type="text"
                        class="search-input ml-4"
                        hide-details
                        @keydown.enter="onSearch"
                        @keydown.esc="onClearSearch"
                    />
                </div>
            </v-col>
        </v-row>


        <!-- Data Table of Log Entries -->
        <v-data-table-server
            v-model:options="options"
            :headers="clientEventsTableHeaders"
            :items="monitoringStore.clientLogEvents || []"
            :items-length="totalItems"
            :items-per-page="10"
            :loading="isLoading"
            :items-per-page-options="[10]"
            @update:options="getClientEvents"
        >
            <template v-slot:loading>
                <v-skeleton-loader
                    type="table"
                    class="mx-4"
                />
            </template>
            <!-- Custom cell for Event Type (icon + text) -->
            <template v-slot:item.type="{ item }">
                <div class="d-flex align-center">
                    <v-icon
                        :icon="severityMap[item.type.replace('_LOG', '').toLowerCase()]?.icon || 'mdi-help-circle'"
                        :color="severityMap[item.type.replace('_LOG', '').toLowerCase()]?.color || 'grey'"
                        class="mr-2"
                    />
                    {{ item.type }}
                </div>
            </template>

            <!-- Client Time column formatting -->
            <template v-slot:item.timestamp="{ item }">
                {{ formatTimeLabel(item.timestamp) }}
            </template>

            <!-- Server Time column formatting -->
            <template v-slot:item.serverTime="{ item }">
                {{ formatTimeLabel(item.serverTime) }}
            </template>

            <!-- Value column (show '-' if empty) -->
            <template v-slot:item.value="{ item }">
                {{ item.value || '-' }}
            </template>
        </v-data-table-server>
    </v-sheet>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue';
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { getSingleConnectionEvents } from "@/services/seb-server/component-services/monitoringViewService";
import * as tableUtils from "@/utils/table/tableUtils";
import { translate } from "@/utils/generalUtils";

// Store instance
const monitoringStore = useMonitoringStore();

// Default sort configuration
const defaultSort: { key: string; order: string }[] = [{ key: 'serverTime', order: 'desc' }];

// Table options (pagination, sorting)
const options = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: defaultSort
});

// Reactive state
const searchQuery = ref<string>('');
const statusFilter = ref<string>('all');
const isLoading = shallowRef(false);
const totalItems = ref(0);

// Severity mapping for icons and colors
const severityMap: Record<string, { icon: string; color: string }> = {
    info: { icon: 'mdi-information', color: 'blue' },
    warn: { icon: 'mdi-alert', color: 'orange' },
    error: { icon: 'mdi-alert-circle', color: 'red' }
};

// Table headers
const clientEventsTableHeaders = [
    { title: translate("monitoringDetails.logContainer.tableHeaders.eventType"), key: 'type', sortable: false },
    { title: translate("monitoringDetails.logContainer.tableHeaders.sebClientTime"), key: 'timestamp', sortable: true },
    { title: translate("monitoringDetails.logContainer.tableHeaders.sebServerTime"), key: 'serverTime', sortable: true },
    { title: translate("monitoringDetails.logContainer.tableHeaders.value"), key: 'value', sortable: false },
    { title: translate("monitoringDetails.logContainer.tableHeaders.message"), key: 'text', sortable: false }
];

// Expose getClientEvents so parent components can call it
defineExpose({
    getClientEvents
});

// Watch status filter changes and reload data
watch(statusFilter, () => {
    options.value.page = 1;
    getClientEvents(options.value);
});

// Formats a timestamp into a locale date string
function formatTimeLabel(ts: number): string {
    const date = new Date(ts);
    return date.toLocaleString();
}

// Maps status filter value to backend log type
function mapStatusFilter(status: string): string | null {
    switch (status) {
        case "info": return "INFO_LOG";
        case "warn": return "WARN_LOG";
        case "error": return "ERROR_LOG";
        default: return null;
    }
}

// Fetches log events from the server based on table options, search, and filter
async function getClientEvents(serverTablePaging: ServerTablePaging) {
    const connectionId = monitoringStore.selectedSingleConn?.cdat.id?.toString() || "";
    if (!connectionId) {
        return;
    }

    monitoringStore.currentPagingOptions = serverTablePaging;
    isLoading.value = true;

    const parameters: OptionalParGetMonitoringClientLogs = tableUtils.assignClientLogDetailsPagingOptions(
        serverTablePaging,
        monitoringStore.logSearchField,
        mapStatusFilter(statusFilter.value)
    );

    try {
        monitoringStore.currentMonitoringDetailPagingOptions = { ...serverTablePaging };
        const response = await getSingleConnectionEvents(connectionId, parameters);
        if (response) {
            monitoringStore.clientLogEvents = response.content;
            totalItems.value = response.number_of_pages * response.page_size; // Adjust if needed
        }
    } finally {
        isLoading.value = false;
    }
}

// Handles search button click — applies search query and refreshes data
function onSearch() {
    monitoringStore.logSearchField = searchQuery.value;
    options.value.page = 1;
    getClientEvents(options.value);
    isLoading.value = false;
}

// Handles clear button click — resets search, filters, and reloads data
function onClearSearch() {
    monitoringStore.logSearchField = "";
    searchQuery.value = "";
    statusFilter.value = "all";
    options.value.page = 1;
    getClientEvents(options.value);
    isLoading.value = false;
}
</script>

<style scoped>
/* (existing styling as needed) */
</style>
