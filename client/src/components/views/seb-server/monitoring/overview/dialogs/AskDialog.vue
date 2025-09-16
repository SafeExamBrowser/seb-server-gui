<template>
    <v-card class="">
        <v-toolbar color="transparent  ma-3">
            <v-toolbar-title class="text-h5 mb-2 title-styling">
                {{ translate("monitoringDetails.monitoringASKDialog.title") }}
            </v-toolbar-title>
            <template #append>
                <v-btn icon="mdi-close" @click="closeDialog" />
            </template>
        </v-toolbar>

        <v-card-text class="pt-0">
            <v-row>
                <v-col class="col-left" cols="6">
                    <!-- ask keys go here -->
                    <v-item-group v-model="selectedAskIdx" class="ml-3">
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
                                    <div class="px-4 pt-3 pr-3 pl-3">
                                        <div class="ask-key-box">
                                            {{ ask.keyValue }}
                                        </div>
                                    </div>
                                    <div
                                        class="d-flex align-center justify-space-between px-4 pb-3"
                                    >
                                        <v-chip
                                            class="chip-black-text"
                                            color="grey"
                                            size="small"
                                            variant="tonal"
                                        >
                                            {{ ask.entries.length }}
                                            {{
                                                translate(
                                                    "monitoringDetails.monitoringASKDialog.connections",
                                                )
                                            }}
                                        </v-chip>
                                        <div class="text-transparent">.</div>
                                    </div>
                                </v-card>
                            </template>
                        </v-item>
                    </v-item-group>
                </v-col>

                <!-- RIGHT: connections -->
                <v-col class="col-right" cols="6">
                    <div
                        :class="{ invisible: !isKeySelected }"
                        class="px-3 mb-5"
                    >
                        <v-row
                            class="pt-4 align-center"
                            data-testid="aks-connections-header"
                            no-gutters
                        >
                            <v-col cols="3">
                                <div
                                    class="text-h6 font-weight-bold"
                                    data-testid="aks-connections-title"
                                >
                                    {{
                                        translate(
                                            "monitoringDetails.monitoringASKDialog.connectionsTitle",
                                        )
                                    }}
                                </div>
                            </v-col>
                            <v-col cols="3"></v-col>

                            <v-col cols="3">
                                <!-- Connection count -->
                                <div
                                    class="count-large text-grey-darken-1 mr-4"
                                    data-testid="aks-connections-count"
                                >
                                    {{ filteredConnections.length }}
                                    {{
                                        filteredConnections.length === 1
                                            ? "connection"
                                            : "connections"
                                    }}
                                </div>
                            </v-col>
                            <v-col cols="3">
                                <div class="ml-auto d-flex align-center">
                                    <!-- Status filter -->
                                    <v-select
                                        v-model="statusFilter"
                                        class="status-select"
                                        :items="statusItems"
                                        item-title="label"
                                        item-value="value"
                                        density="comfortable"
                                        variant="outlined"
                                        hide-details
                                        data-testid="aks-status-filter"
                                        style="max-width: 240px"
                                    />
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                    <div class="px-3" :class="{ invisible: !isKeySelected }">
                        <v-text-field
                            v-model="searchQuery"
                            class="mb-3 search-input"
                            data-testid="connections-search-input"
                            density="comfortable"
                            hide-details
                            :placeholder="
                                translate(
                                    'monitoringDetails.monitoringASKDialog.searchText',
                                )
                            "
                            type="text"
                            variant="outlined"
                        >
                            <template #append-inner>
                                <v-icon
                                    class="search-icon"
                                    data-testid="userAccounts-searchIcon-button"
                                    >mdi-magnify
                                </v-icon>
                            </template>
                        </v-text-field>
                    </div>

                    <!-- Fixed-height viewport that fits 10 rows -->
                    <div v-if="isKeySelected" class="connections-viewport px-3">
                        <v-list
                            bg-color="transparent"
                            class="pt-0 connections-list"
                        >
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
                                    class="ml-2"
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
                    <div v-else class="placeholder-viewport px-3">
                        <div class="placeholder-content">
                            <v-icon size="96" class="placeholder-icon"
                                >mdi-cursor-default-click
                            </v-icon>
                            <div
                                class="text-subtitle-1 text-grey-darken-1 mt-3 text-center"
                            >
                                {{
                                    translate(
                                        "monitoringDetails.monitoringASKDialog.selectAskKey",
                                    )
                                }}
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { translate } from "@/utils/generalUtils";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum";

const store = useMonitoringStore();
const emit = defineEmits<{ closeAskDialog: [] }>();
const i18n = useI18n();

const selectedAskIdx = ref<number>(-1);
const page = ref(1);
const pageSize = 10;
const searchQuery = ref("");
const statusFilter = ref<"ALL" | ConnectionStatusEnum>(
    ConnectionStatusEnum.ACTIVE,
);

const isKeySelected = computed(
    () =>
        selectedAskIdx.value >= 0 &&
        selectedAskIdx.value < askEnriched.value.length,
);

const normalizeStatus = (s?: string): ConnectionStatusEnum => {
    const up = (s ?? ConnectionStatusEnum.UNDEFINED).toUpperCase();
    return (ConnectionStatusEnum as any)[up] ?? ConnectionStatusEnum.UNDEFINED;
};

function trStatus(value: "ALL" | ConnectionStatusEnum) {
    return i18n.t(`monitoringDetails.monitoringASKDialog.statuses.${value}`);
}

const statusItems = computed(() => {
    const values = Object.values(
        ConnectionStatusEnum,
    ) as ConnectionStatusEnum[];
    const others = values.filter(
        (v) =>
            v !== ConnectionStatusEnum.ACTIVE &&
            v !== ConnectionStatusEnum.UNDEFINED,
    );
    const ordered: Array<"ALL" | ConnectionStatusEnum> = [
        "ALL",
        ConnectionStatusEnum.ACTIVE,
        ...others,
        ConnectionStatusEnum.UNDEFINED,
    ];
    return ordered.map((v) => ({ value: v, label: trStatus(v) }));
});

watch(selectedAskIdx, () => {
    page.value = 1;
    searchQuery.value = "";
});
watch([searchQuery, statusFilter], () => {
    page.value = 1;
});

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

const selectedAsk = computed(() =>
    isKeySelected.value ? askEnriched.value[selectedAskIdx.value] : undefined,
);
const selectedConnections = computed(() => selectedAsk.value?.entries ?? []);

const statusFiltered = computed(() => {
    if (!isKeySelected.value) return [];
    if (statusFilter.value === "ALL") return selectedConnections.value;
    return selectedConnections.value.filter(
        (c) => normalizeStatus(c.conn?.status) === statusFilter.value,
    );
});

const filteredConnections = computed(() => {
    if (!isKeySelected.value) return [];
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return statusFiltered.value;
    return statusFiltered.value.filter((c) =>
        (c.name ?? "").toLowerCase().includes(q),
    );
});

const totalConnections = computed(() => filteredConnections.value.length);
const pageStart = computed(() => (page.value - 1) * pageSize);
const pageEnd = computed(() =>
    Math.min(pageStart.value + pageSize, totalConnections.value),
);
const pagedConnections = computed(() =>
    filteredConnections.value.slice(pageStart.value, pageEnd.value),
);

function closeDialog() {
    selectedAskIdx.value = -1;
    searchQuery.value = "";
    page.value = 1;
    statusFilter.value = ConnectionStatusEnum.ACTIVE;
    emit("closeAskDialog");
}

function statusColor(status?: string) {
    switch (normalizeStatus(status)) {
        case ConnectionStatusEnum.ACTIVE:
        case ConnectionStatusEnum.READY:
            return "success";
        case ConnectionStatusEnum.DISABLED:
        case ConnectionStatusEnum.CLOSED:
            return "grey";
        default:
            return "grey";
    }
}
</script>

<style scoped>
:root {
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
    font-size: 12px;
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

.chip-black-text {
    color: black !important;
    font-size: 13px;
}

.title-styling {
    font-weight: 900 !important;
    letter-spacing: 0.2px;
    line-height: 1.2;
}

.connections-viewport {
    height: 855px;
    display: flex;
    flex-direction: column;
}

.connections-list {
    flex: 1 1 auto;
    min-height: 0;
    overflow: auto;
}

.connections-viewport > .d-flex.align-center.justify-space-between {
    border-top: 1px solid #e5e7eb;
    padding-top: 8px;
}

.placeholder-viewport {
    height: 855px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.placeholder-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.placeholder-icon {
    opacity: 0.5;
}

.invisible {
    visibility: hidden;
}
</style>
