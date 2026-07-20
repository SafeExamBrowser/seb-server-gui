<template>
    <div>
        <!-- Filters & Search Row -->
        <div class="d-flex flex-wrap align-center ga-4 mb-4">
            <v-tabs
                v-model="statusFilter"
                color="primary"
                density="comfortable"
                class="flex-grow-1"
            >
                <v-tab value="all">
                    {{
                        $t(
                            "monitoringDetails.logContainer.sortingAndFilter.all",
                        )
                    }}
                </v-tab>
                <v-tab value="info">
                    {{
                        $t(
                            "monitoringDetails.logContainer.sortingAndFilter.info",
                        )
                    }}
                </v-tab>
                <v-tab value="warn">
                    {{
                        $t(
                            "monitoringDetails.logContainer.sortingAndFilter.warning",
                        )
                    }}
                </v-tab>
                <v-tab value="error">
                    {{
                        $t(
                            "monitoringDetails.logContainer.sortingAndFilter.error",
                        )
                    }}
                </v-tab>
            </v-tabs>

            <div class="d-flex align-center ga-2">
                <v-text-field
                    v-model="searchQuery"
                    append-inner-icon="mdi-magnify"
                    density="compact"
                    hide-details
                    :placeholder="
                        $t(
                            'monitoringDetails.logContainer.sortingAndFilter.searchForLogs',
                        )
                    "
                    single-line
                    style="min-width: 220px"
                    type="text"
                    variant="outlined"
                    @keydown.enter="handleSearch"
                    @keydown.esc="handleClearSearch"
                />
                <v-btn
                    color="black"
                    rounded="sm"
                    variant="outlined"
                    @click="handleClearSearch"
                >
                    {{ $t("general.cancelButton") }}
                </v-btn>
                <v-btn
                    color="primary"
                    rounded="sm"
                    variant="flat"
                    @click="handleSearch"
                >
                    {{ $t("general.searchButton") }}
                </v-btn>
            </div>
        </div>

        <!-- Data Table of Log Entries -->
        <EntityTable
            class="px-2 pt-2"
            :headers="clientEventsTableHeaders"
            :items="monitoringStore.clientLogEvents ?? []"
            :page-count="pageCount"
            :items-per-page="options.itemsPerPage"
            :options="monitoringStore.currentMonitoringDetailPagingOptions"
            :loading="isLoading"
            data-test-id=""
            item-key="id"
            @update:options="getClientEvents"
        >
            <template #loading>
                <v-skeleton-loader class="mx-4" type="table" />
            </template>
            <!-- Custom cell for Event Type (icon + text) -->
            <template #cell-type="{ value }">
                <div class="d-flex align-center">
                    <v-icon
                        class="mr-2"
                        :color="logSeverity(String(value))?.color ?? 'grey'"
                        :icon="
                            logSeverity(String(value))?.icon ??
                            'mdi-help-circle'
                        "
                    />
                    {{ String(value) }}
                </div>
            </template>

            <!-- Client Time column formatting -->
            <template #cell-timestamp="{ value }">
                {{ formatTimeLabel(Number(value)) }}
            </template>

            <!-- Server Time column formatting -->
            <template #cell-serverTime="{ value }">
                {{ formatTimeLabel(Number(value)) }}
            </template>

            <!-- Value column (show '-' if empty) -->
            <template #cell-value="{ value }">
                {{ value || "-" }}
            </template>
        </EntityTable>
    </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from "vue";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as tableUtils from "@/utils/table/tableUtils.ts";
import { translate } from "@/utils/generalUtils.ts";
import { ServerTablePaging } from "@/models/types.ts";
import { OptionalParGetMonitoringClientLogs } from "@/models/seb-server/optionalParamters.ts";
import { getSingleConnectionEvents } from "@/services/seb-server/monitoringService.ts";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";

// Store instance
const monitoringStore = useMonitoringStore();

// Default sort configuration
const defaultSort = [{ key: "serverTime", order: "desc" }];

const getDefaultOptions = (): ServerTablePaging => ({
    page: 1,
    itemsPerPage: 10,
    sortBy: defaultSort,
});
const options = ref<ServerTablePaging>(getDefaultOptions());

// Reactive state
const searchQuery = ref("");
const statusFilter = ref("all");
const isLoading = shallowRef(false);
const pageCount = ref(0);

// Severity mapping for icons and colors
const severityMap: Record<string, { icon: string; color: string }> = {
    info: { icon: "mdi-information", color: "blue" },
    warn: { icon: "mdi-alert", color: "orange" },
    error: { icon: "mdi-alert-circle", color: "red" },
};

function logSeverity(type: string) {
    return severityMap[type.replace("_LOG", "").toLowerCase()];
}

// Table headers
const clientEventsTableHeaders = [
    {
        title: translate(
            "monitoringDetails.logContainer.tableHeaders.eventType",
        ),
        key: "type",
        sortable: false,
    },
    {
        title: translate(
            "monitoringDetails.logContainer.tableHeaders.sebClientTime",
        ),
        key: "timestamp",
        sortable: true,
    },
    {
        title: translate(
            "monitoringDetails.logContainer.tableHeaders.sebServerTime",
        ),
        key: "serverTime",
        sortable: true,
    },
    {
        title: translate("monitoringDetails.logContainer.tableHeaders.value"),
        key: "value",
        sortable: false,
    },
    {
        title: translate("monitoringDetails.logContainer.tableHeaders.message"),
        key: "text",
        sortable: false,
    },
];

// Expose getClientEvents so parent components can call it
defineExpose({
    getClientEvents,
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
function mapStatusFilter(status: string): string | undefined {
    switch (status) {
        case "info":
            return "INFO_LOG";
        case "warn":
            return "WARN_LOG";
        case "error":
            return "ERROR_LOG";
        default:
            return undefined;
    }
}

// Fetches log events from the server based on table options, search, and filter
async function getClientEvents(serverTablePaging: ServerTablePaging) {
    const connectionId =
        monitoringStore.selectedSingleConn?.cdat.id?.toString() || "";
    if (!connectionId) {
        return;
    }

    monitoringStore.currentPagingOptions = serverTablePaging;
    isLoading.value = true;

    const parameters: OptionalParGetMonitoringClientLogs =
        tableUtils.assignClientLogDetailsPagingOptions(
            serverTablePaging,
            monitoringStore.logSearchField ?? undefined,
            mapStatusFilter(statusFilter.value),
        );

    try {
        monitoringStore.currentMonitoringDetailPagingOptions = {
            ...serverTablePaging,
        };
        const response = await getSingleConnectionEvents(
            connectionId,
            parameters,
        );
        if (response) {
            monitoringStore.clientLogEvents = response.content;
            pageCount.value = response.number_of_pages;
            serverTablePaging.page = response.page_number;
        }
    } finally {
        isLoading.value = false;
    }
}

// Handles search button click — applies search query and refreshes data
function handleSearch() {
    monitoringStore.logSearchField = searchQuery.value;
    options.value.page = 1;
    getClientEvents(options.value);
    isLoading.value = false;
}

// Handles clear button click — resets search, filters, and reloads data
function handleClearSearch() {
    monitoringStore.logSearchField = "";
    searchQuery.value = "";
    statusFilter.value = "all";
    options.value.page = 1;
    getClientEvents(options.value);
    isLoading.value = false;
}
</script>
