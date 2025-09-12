<template>
    <v-card>
        <v-toolbar color="transparent mb-3">
            <v-toolbar-title class="text-h6"
                >App Signature Keys</v-toolbar-title
            >
            <template #append>
                <v-btn icon="mdi-close" @click="emit('closeAskDialog')" />
            </template>
        </v-toolbar>

        <v-card-text class="pt-0">
            <v-row>
                <v-col class="col-left" cols="6">
                    <!-- ask keys go here -->
                    <v-item-group
                        v-model="selectedAskIdx"
                        class="ml-3"
                        mandatory
                    >
                        <v-item
                            v-for="(ask, index) in askEnriched"
                            :key="ask.keyValue"
                            :value="index"
                        >
                            <template #default="{ isSelected, toggle }">
                                <v-card
                                    class="ask-card mb-3"
                                    :class="{
                                        'ask-card--selected': isSelected,
                                    }"
                                    variant="outlined"
                                    @click="toggle"
                                >
                                    <div
                                        class="d-flex align-center justify-space-between px-4 py-3"
                                    >
                                        <div class="text-transparent">.</div>
                                        <v-chip
                                            color="grey"
                                            size="small"
                                            variant="tonal"
                                        >
                                            {{ ask.entries.length }} connections
                                        </v-chip>
                                    </div>

                                    <div class="px-4 py-3">
                                        <div class="ask-key-box">
                                            {{ ask.keyValue }}
                                        </div>
                                    </div>
                                </v-card>
                            </template>
                        </v-item>
                    </v-item-group>
                </v-col>

                <!-- RIGHT: connections -->
                <v-col class="col-right" cols="6">
                    <div class="px-3">
                        <!-- keep your search -->
                        <v-text-field
                            class="mb-3"
                            data-testid="connections-search-input"
                            density="comfortable"
                            hide-details
                            :placeholder="
                                translate(
                                    'userAccount.userAccountPage.filters.searchField',
                                )
                            "
                            type="text"
                            variant="outlined"
                        />
                    </div>

                    <!-- Fixed-height viewport that fits 10 rows -->
                    <div class="connections-viewport px-3">
                        <v-list bg-color="transparent" class="pt-0">
                            <v-list-item
                                v-for="conn in pagedConnections"
                                :key="conn.id"
                                class="conn-card mb-3"
                            >
                                <v-list-item-title
                                    class="font-weight-medium conn-card-title"
                                >
                                    {{ conn.name || `Connection ${conn.id}` }}
                                </v-list-item-title>

                                <v-list-item-subtitle
                                    class="mt-1 conn-card-subtitle"
                                >
                                    <div class="d-flex align-center">
                                        SEB:
                                        {{ conn.conn?.clientVersion || "—" }} -
                                        {{ conn.conn?.clientOsName || "—" }} -
                                        IP:
                                        {{ conn.conn?.clientAddress || "—" }}
                                    </div>
                                </v-list-item-subtitle>

                                <template #append>
                                    <v-chip
                                        class="text-uppercase"
                                        :color="statusColor(conn.conn?.status)"
                                        size="small"
                                        variant="tonal"
                                    >
                                        {{ conn.conn?.status || "UNKNOWN" }}
                                    </v-chip>
                                </template>
                            </v-list-item>
                        </v-list>

                        <!-- Pagination stays under the list inside the fixed viewport -->
                        <div
                            class="d-flex align-center justify-space-between mt-2 px-1"
                        >
                            <div class="text-caption">
                                Showing {{ pageStart + 1 }}–{{ pageEnd }} of
                                {{ totalConnections }}
                            </div>
                            <div class="d-flex gap-2">
                                <v-btn
                                    :disabled="page === 1"
                                    size="small"
                                    variant="outlined"
                                    @click="page--"
                                >
                                    Previous
                                </v-btn>
                                <v-btn
                                    :disabled="pageEnd >= totalConnections"
                                    size="small"
                                    variant="outlined"
                                    @click="page++"
                                >
                                    Next
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { translate } from "@/utils/generalUtils";

const store = useMonitoringStore();
const emit = defineEmits<{ closeAskDialog: [] }>();
const selectedAskIdx = ref(0);

const page = ref(1);
const pageSize = 10;

watch(selectedAskIdx, () => {
    page.value = 1; // reset when user picks another ask
});

/** selected ask + connections */
const selectedAsk = computed(() => askEnriched.value[selectedAskIdx.value]);
const selectedConnections = computed(() => selectedAsk.value?.entries ?? []);

/** total + paged slice */
const totalConnections = computed(() => selectedConnections.value.length);
const pageStart = computed(() => (page.value - 1) * pageSize);
const pageEnd = computed(() =>
    Math.min(pageStart.value + pageSize, totalConnections.value),
);
const pagedConnections = computed(() =>
    selectedConnections.value.slice(pageStart.value, pageEnd.value),
);

/** status -> chip color mapper */
function statusColor(status?: string) {
    // match screenshot vibe: OPEN green, CLOSED grey, CANCELLED red
    switch ((status || "").toUpperCase()) {
        case "OPEN":
            return "success";
        case "CANCELLED":
            return "error";
        case "CLOSED":
        default:
            return "grey";
    }
}

const askEnriched = computed(() => {
    const keys = store.appSignatureKeys ?? [];
    const byId = store.clientConnectionsById;

    return keys.map((ask) => {
        const entries = Object.entries(ask.connectionIds ?? {}).map(
            ([idStr, name]) => {
                const id = Number(idStr);
                return { id, name, conn: byId[id] };
            },
        );
        return { ...ask, entries };
    });
});
</script>

<style scoped>
:root {
}

.connections-viewport {
    height: 760px;
    overflow: auto;
}

.conn-card {
    border: 2px solid #d1d5db;
    border-radius: 10px !important;
    padding: 10px 14px;
    min-height: 64px;
}

.conn-card-title,
.conn-card-subtitle {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.ask-card {
    border-radius: 10px;
    border: 2px solid #d1d5db;
}
.ask-card--selected {
    border-color: #215caf;
    background: #edf5ff;
}
.ask-key-box {
    font-family:
        ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        "Liberation Mono", "Courier New", monospace;
    border-radius: 4px;
    padding: 8px 12px;
    white-space: nowrap;
    overflow: hidden;
    font-size: 11px;
    background: #f2f4f6;
    text-overflow: ellipsis;
}

.col-left {
    border-top: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
}
.col-right {
    border-top: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
}
</style>
