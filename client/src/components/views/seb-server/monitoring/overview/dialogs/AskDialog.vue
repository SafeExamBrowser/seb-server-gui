<template>
    <v-card class="">
        <v-toolbar color="transparent  ma-3">
            <v-toolbar-title class="text-h5 mb-2 title-styling">
                {{ translate("monitoringDetails.monitoringASKDialog.title") }}
                <v-btn
                    icon="mdi-refresh"
                    class="mr-2"
                    color="primary"
                    @click="refreshAsk"
                />
            </v-toolbar-title>

            <template #append>
                <v-btn icon="mdi-close" class="mr-8" @click="closeDialog" />
            </template>
        </v-toolbar>

        <v-card-text class="pt-0">
            <v-row>
                <v-col class="col-left" cols="6">
                    <div class="ask-viewport ml-3">
                        <v-item-group
                            v-model="selectedAskIdx"
                            class="ml-3 ask-list"
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
                                        <!-- ROW 1: status (far left) + title … connections (far right) -->
                                        <div class="ask-row ask-row-top">
                                            <div
                                                class="d-flex align-center gap-2"
                                            >
                                                <!-- Status (forced green when granted) -->
                                                <v-chip
                                                    :class="
                                                        ask.tag
                                                            ? 'chip-granted'
                                                            : 'chip-not-granted'
                                                    "
                                                    size="small"
                                                    variant="flat"
                                                >
                                                    {{
                                                        ask.tag
                                                            ? i18n.t(
                                                                  "monitoringDetails.monitoringASKDialog.granted",
                                                              )
                                                            : i18n.t(
                                                                  "monitoringDetails.monitoringASKDialog.notGranted",
                                                              )
                                                    }}
                                                </v-chip>
                                            </div>

                                            <v-chip
                                                class="chip-count"
                                                size="small"
                                                variant="tonal"
                                            >
                                                {{ ask.entries.length }}
                                                {{
                                                    i18n.t(
                                                        "monitoringDetails.monitoringASKDialog.connections",
                                                    )
                                                }}
                                            </v-chip>
                                        </div>

                                        <!-- ROW 2: optional tag line -->
                                        <div
                                            v-if="ask.tag"
                                            class="ask-row ask-row-tag"
                                        >
                                            <span
                                                class="text-caption text-grey-darken-1 mr-1"
                                            >
                                                {{
                                                    i18n.t(
                                                        "monitoringDetails.monitoringASKDialog.tag",
                                                    )
                                                }}
                                            </span>
                                            <span class="text-body-2">{{
                                                ask.tag
                                            }}</span>
                                        </div>

                                        <!-- ROW 3: key value (smaller, bold, fully visible) -->
                                        <div class="ask-row ask-row-key">
                                            <div
                                                class="ask-key-box ask-key--compact"
                                                :title="ask.keyValue"
                                            >
                                                {{ ask.keyValue }}
                                            </div>
                                        </div>
                                    </v-card>
                                </template>
                            </v-item>
                        </v-item-group>
                    </div>

                    <!-- Footer: grant input -->
                    <div class="ask-footer px-6 py-2 mt-3">
                        <v-text-field
                            v-model="grantKeyInput"
                            class="mr-2 ask-footer-input"
                            variant="outlined"
                            density="compact"
                            hide-details
                            :placeholder="
                                i18n.t(
                                    'monitoringDetails.monitoringASKDialog.grantKeyPlaceholder',
                                )
                            "
                            data-testid="aks-grantKey-input"
                        />
                        <v-btn
                            class="ask-footer-btn"
                            color="primary"
                            variant="flat"
                            size="small"
                            data-testid="aks-grantKey-button"
                            @click="onGrantKey"
                        >
                            {{
                                i18n.t(
                                    "monitoringDetails.monitoringASKDialog.grantKeyButton",
                                )
                            }}
                        </v-btn>
                    </div>
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
                                        density="compact"
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
                                >mdi-cursor-default-click-outline
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
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";

const store = useMonitoringStore();
const emit = defineEmits<{
    closeAskDialog: [];
    refresh: [];
    grantKey: [string];
}>();

const i18n = useI18n();

const selectedAskIdx = ref<number>(-1);
const page = ref(1);
const pageSize = 10;
const searchQuery = ref("");
const statusFilter = ref<"ALL" | ConnectionStatusEnum>(
    ConnectionStatusEnum.ACTIVE,
);
const grantKeyInput = ref("");

const isKeySelected = computed(
    () =>
        selectedAskIdx.value >= 0 &&
        selectedAskIdx.value < askEnriched.value.length,
);

const normalizeStatus = (s?: string): ConnectionStatusEnum => {
    const up = (s ?? ConnectionStatusEnum.UNDEFINED).toUpperCase();
    return (ConnectionStatusEnum as any)[up] ?? ConnectionStatusEnum.UNDEFINED;
};

async function refreshAsk() {
    const examId = useMonitoringStore().selectedExam?.id.toString();
    if (!examId) {
        return;
    }
    await monitoringViewService.getAskAndStore(examId);
}

function onGrantKey() {
    const val = grantKeyInput.value;
    if (!val) return;
    //todo Implement Grant Key
}

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
    border-radius: 12px;
    border: 2px solid #d1d5db;
    transition:
        border-color 0.15s ease,
        background 0.15s ease,
        box-shadow 0.15s ease;
    cursor: pointer;
}
.ask-card:hover {
    border-color: #b8c4d4;
    box-shadow:
        0 1px 0 rgba(0, 0, 0, 0.02),
        0 2px 6px rgba(0, 0, 0, 0.04);
}
.ask-card--selected {
    border-color: #215caf;
    background: #edf5ff;
}

.ask-row {
    padding: 10px 14px;
}
.ask-row-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 14px;
}
.ask-row-tag {
    padding: 2px 14px 3px;
    display: flex;
    align-items: center;
    gap: 6px;
}
.ask-row-tag .text-caption,
.ask-row-tag .text-body-2 {
    line-height: 1.1;
}
.ask-row-key {
    padding-top: 4px;
    padding-bottom: 12px;
}

.ask-key-box {
    font-family:
        ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        "Liberation Mono", "Courier New", monospace;
    border-radius: 6px;
    padding: 8px 12px;
    background: #f7f7f7;
    border: 1px solid #e5e7eb;
    flex: 1 1 auto;
    min-width: 0;
}
.ask-key--compact {
    font-size: 11.5px;
    font-weight: 700;
    white-space: normal;
    word-break: break-all;
    line-height: 1.3;
}

.col-left {
    border-top: 1px solid #e0e0e0;
    border-right: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
}
.col-right {
    border-top: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;
}

.title-styling {
    font-weight: 900 !important;
    letter-spacing: 0.2px;
    line-height: 1.2;
}

.connections-viewport {
    height: 600px;
    display: flex;
    flex-direction: column;
    position: relative;
}
.connections-viewport::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 24px;
    pointer-events: none;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff);
}
.connections-list {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    scrollbar-gutter: stable;
}

.placeholder-viewport {
    height: 600px;
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

.chip-count {
    color: black !important;
    font-size: 13px;
}
.chip-granted {
    background-color: #c8e6c9 !important;
    color: #1b5e20 !important;
    border: 1px solid #a5d6a7 !important;
}
.chip-not-granted {
    background-color: #eeeeee !important;
    color: #424242 !important;
    border: 1px solid #e0e0e0 !important;
}

.ask-viewport {
    height: 700px;
    display: flex;
    flex-direction: column;
    position: relative;
}

.ask-list {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    scrollbar-gutter: stable;
    padding-right: 6px;
}

.ask-footer {
    margin-top: auto;
    position: sticky;
    bottom: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fff;
    border-top: 1px solid #e5e7eb;
    padding: 8px 24px;
    z-index: 1;
}
.ask-footer-input {
    flex: 1 1 auto;
}
.ask-footer-input .v-field,
.ask-footer-input .v-field__input,
.ask-footer-btn {
    height: 40px !important;
    min-height: 40px !important;
}
.ask-footer-btn {
    padding: 0 16px;
}

/* Subtle scrollbar styling */
.ask-list::-webkit-scrollbar,
.connections-list::-webkit-scrollbar {
    width: 10px;
}
.ask-list::-webkit-scrollbar-thumb,
.connections-list::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 8px;
}
.ask-list::-webkit-scrollbar-track,
.connections-list::-webkit-scrollbar-track {
    background: #f3f4f6;
}
</style>
