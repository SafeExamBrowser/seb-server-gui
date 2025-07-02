<template>
    <v-sheet elevation="4" class="rounded-lg pa-8">
        <!-- Filters & Search Row -->
        <v-row>
            <v-col cols="3">
                <v-tabs v-model="statusFilter" fixed-tabs color="primary" class="mb-4">
                    <v-tab value="all">All</v-tab>
                    <v-tab value="info">Info</v-tab>
                    <v-tab value="warn">Warning</v-tab>
                    <v-tab value="error">Error</v-tab>
                </v-tabs>
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="7">
                <v-row align="center" class="mb-4">
                    <v-col cols="12" md="8">
                        <v-text-field
                            v-model="searchQuery"
                            label="Search"
                            prepend-inner-icon="mdi-magnify"
                            clearable
                            variant="outlined"
                            dense
                        />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-- Data Table of Log Entries -->
        <v-data-table
            v-model:options="options"
            :headers="clientEventsTableHeaders"
            :items="filteredEvents"
            :items-per-page="options.itemsPerPage"
            :items-per-page-options="[5, 10, 15]"
            class="mt-2"
        >
            <!-- Custom cell for Event Type (icon + text) -->
            <template v-slot:item.type="{ item }">
                <div class="d-flex align-center">
                    <v-icon :icon="severityMap[item.severity].icon"
                            :color="severityMap[item.severity].color"
                            class="mr-2" />
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
        </v-data-table>
    </v-sheet>

</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeMount } from 'vue';
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { getSingleConnectionEvents } from "@/services/seb-server/component-services/monitoringViewService";
import * as tableUtils from "@/utils/table/tableUtils";

const monitoringStore = useMonitoringStore();

const searchQuery = ref<string>('');
const statusFilter = ref<string>('all');

// Severity mapping for icons/colors
const severityMap: Record<string, { icon: string; color: string }> = {
    info:  { icon: 'mdi-information',    color: 'blue' },
    warn:  { icon: 'mdi-alert',         color: 'orange' },
    error: { icon: 'mdi-alert-circle',  color: 'red' }
};

const clientEventsTableHeaders = [
    { title: 'Event Type', key: 'type', sortable: false },
    { title: 'SEB Client Time', key: 'timestamp', sortable: false },
    { title: 'SEB Server Time', key: 'serverTime', sortable: false },
    { title: 'Value', key: 'value', sortable: false },
    { title: 'Message', key: 'text', sortable: false }
];

const options = ref({
    page: 1,
    itemsPerPage: 10
});




async function getClientEvents(clientConnectionId: string) {
    const serverTablePaging = {
        page: 1,
        itemsPerPage: 10, // Or any large enough value to get all
        sortBy: []
    };
    monitoringStore.currentMonitoringDetailPagingOptions = {
        ...serverTablePaging
    };
    const params = tableUtils.buildClientEventQueryParams(serverTablePaging);
    const response = await getSingleConnectionEvents(clientConnectionId, params);

    console.log("Response from getSingleConnectionEvents", response);

    if (response) {
        monitoringStore.clientLogEvents = response.content;
    }
}

onBeforeMount(async () => {
    const connectionId = monitoringStore.selectedSingleConn?.cdat.id?.toString() || "";
    if (connectionId) {
        await getClientEvents(connectionId);
    }
});


const filteredEvents = computed(() => {
    let items = monitoringStore.clientLogEvents || [];

    // Apply status filter
    if (statusFilter.value !== 'all') {
        items = items.filter(ev =>
            ev.type.replace('_LOG', '').toLowerCase() === statusFilter.value
        );
    }

    // Apply search filter
    if (searchQuery.value) {
        const q = searchQuery.value.trim().toLowerCase();
        items = items.filter(ev =>
            ev.text.toLowerCase().includes(q) ||
            ev.type.toLowerCase().includes(q)
        );
    }

    // Attach severity for icon
    return items.map(ev => ({
        ...ev,
        severity: ev.type.replace('_LOG', '').toLowerCase()
    }));
});


function formatTimeLabel(ts: number): string {
    const date = new Date(ts);
    return date.toLocaleString(); // or customize as you wish
}

</script>

<style scoped>
/* (existing styling as needed) */
</style>
