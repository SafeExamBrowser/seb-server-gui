<template>
    <v-card>
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

                    <!-- Footer -->
                    <div class="ask-footer px-6 py-2 mt-3">
                        <!-- If NOT granted: show input + grant -->
                        <template v-if="!selectedAsk?.tag">
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
                        </template>

                        <!-- If granted: show 'Remove grant' -->
                        <template v-else>
                            <v-btn
                                class="ask-footer-btn"
                                color="error"
                                variant="outlined"
                                size="small"
                                data-testid="aks-removeGrant-button"
                                @click="onRemoveGrant"
                            >
                                Remove Grant
                            </v-btn>
                        </template>
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
                                    <v-select
                                        v-model="statusFilter"
                                        :items="statusItems"
                                        item-title="label"
                                        item-value="value"
                                        density="compact"
                                        variant="outlined"
                                        hide-details
                                        data-testid="aks-status-filter"
                                        style="max-width: 350px"
                                    >
                                        <!-- Dropdown items -->
                                        <template
                                            #item="{ props, item, index }"
                                        >
                                            <v-list-item v-bind="props">
                                                <template #title>
                                                    <div class="status-option">
                                                        <span
                                                            class="status-count"
                                                            >{{
                                                                item.raw.count
                                                            }}</span
                                                        >
                                                        <span
                                                            class="status-sep"
                                                            aria-hidden="true"
                                                        ></span>
                                                        <span
                                                            class="status-label"
                                                            >{{
                                                                item.raw.label
                                                            }}</span
                                                        >
                                                    </div>
                                                </template>
                                            </v-list-item>

                                            <!-- Divider -->
                                            <v-divider
                                                v-if="
                                                    item.raw.value === 'ALL' &&
                                                    index <
                                                        statusItems.length - 1
                                                "
                                                class="status-divider"
                                                color="#e5e5e5"
                                            />
                                        </template>

                                        <!-- Selected value -->
                                        <template #selection="{ item }">
                                            <div class="status-option">
                                                <span class="status-label">{{
                                                    item.raw.label
                                                }}</span>
                                            </div>
                                        </template>
                                    </v-select>
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
import * as examViewService from "@/services/seb-server/component-services/examViewService";

const store = useMonitoringStore();
const emit = defineEmits<{
    closeAskDialog: [];
    refresh: [];
    grantKey: [string];
}>();

const examId = useMonitoringStore().selectedExam?.id.toString();

const selectedAsk = computed(() =>
    isKeySelected.value ? askEnriched.value[selectedAskIdx.value] : undefined,
);
const selectedConnections = computed(() => selectedAsk.value?.entries ?? []);

const i18n = useI18n();

const selectedAskIdx = ref<number>(-1);
const page = ref(1);
const pageSize = 10;
const searchQuery = ref("");
const statusFilter = ref<"ALL" | ConnectionStatusEnum>(
    ConnectionStatusEnum.ACTIVE,
);
const grantKeyInput = ref("");

const firstConnId = computed<number | undefined>(
    () => selectedConnections.value?.[0]?.id,
);

const isKeySelected = computed(
    () =>
        selectedAskIdx.value >= 0 &&
        selectedAskIdx.value < askEnriched.value.length,
);

const allStatuses = Object.values(
    ConnectionStatusEnum,
) as ConnectionStatusEnum[];

const statusCounts = computed<Record<"ALL" | ConnectionStatusEnum, number>>(
    () => {
        const counts = { ALL: 0 } as Record<
            "ALL" | ConnectionStatusEnum,
            number
        >;

        for (const s of allStatuses) counts[s] = 0;

        const conns = selectedConnections.value ?? [];
        counts.ALL = conns.length;

        for (const c of conns) {
            const norm = normalizeStatus(c.conn?.status);
            counts[norm] = (counts[norm] ?? 0) + 1;
        }
        return counts;
    },
);

const statusItems = computed(() => {
    const others = allStatuses.filter(
        (s) =>
            s !== ConnectionStatusEnum.ACTIVE &&
            s !== ConnectionStatusEnum.UNDEFINED,
    );
    const ordered: Array<"ALL" | ConnectionStatusEnum> = [
        "ALL",
        ConnectionStatusEnum.ACTIVE,
        ...others,
        ConnectionStatusEnum.UNDEFINED,
    ];

    return ordered.map((v) => ({
        value: v,
        label: trStatus(v),
        count: statusCounts.value[v],
    }));
});
const normalizeStatus = (s?: string): ConnectionStatusEnum => {
    const up = (s ?? ConnectionStatusEnum.UNDEFINED).toUpperCase();
    return isStatusKey(up)
        ? ConnectionStatusEnum[up]
        : ConnectionStatusEnum.UNDEFINED;
};

function isStatusKey(k: string): k is keyof typeof ConnectionStatusEnum {
    return k in ConnectionStatusEnum;
}

async function refreshAsk() {
    if (!examId) return;
    await monitoringViewService.getAskAndStore(examId);
}

function onGrantKey() {
    const val = grantKeyInput.value;

    if (!examId || !firstConnId.value || !val) {
        console.log("failed");
        console.log(examId, selectedAsk.value?.keyValue, val);
        return;
    }
    examViewService.grantExamAppSignatureKeys(
        val,
        examId,
        String(firstConnId.value),
    );
    monitoringViewService.getAskAndStore(examId);
}

function trStatus(value: "ALL" | ConnectionStatusEnum) {
    return i18n.t(`monitoringDetails.monitoringASKDialog.statuses.${value}`);
}

watch(selectedAskIdx, () => {
    page.value = 1;
    searchQuery.value = "";
});
watch([searchQuery, statusFilter], () => {
    page.value = 1;
});

//aks key ordering
const askEnriched = computed(() => {
    const keys = store.appSignatureKeys ?? [];
    const byId = store.clientConnectionsById;

    const enriched = keys.map((ask) => {
        const entries = Object.entries(ask.connectionIds ?? {}).map(
            ([idStr, name]) => {
                const id = Number(idStr);
                return { id, name, conn: byId[id] };
            },
        );
        return { ...ask, entries };
    });

    return enriched.sort((a, b) => {
        // 1) not granted first
        const aRank = a.tag ? 1 : 0;
        const bRank = b.tag ? 1 : 0;
        if (aRank !== bRank) return aRank - bRank;

        // 2) by connection count
        const ac = a.entries.length;
        const bc = b.entries.length;
        if (ac !== bc) return ac - bc;

        // finally
        return String(a.keyValue ?? "").localeCompare(String(b.keyValue ?? ""));
    });
});

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

const firstConnInfo = computed(() => {
    const first = selectedConnections.value[0]?.conn;
    const os = first?.clientOsName || "";
    const ver = first?.clientVersion || "";
    return os || ver ? `${os}${os && ver ? " " : ""}${ver}` : "";
});

watch(selectedAsk, (ask) => {
    if (!ask) {
        grantKeyInput.value = "";
        return;
    }
    if (!ask.tag) {
        grantKeyInput.value = firstConnInfo.value || "";
    }
});

watch(firstConnInfo, (val) => {
    if (selectedAsk.value && !selectedAsk.value.tag) {
        grantKeyInput.value = val || "";
    }
});

function onRemoveGrant() {
    if (!examId || !selectedAsk.value?.id) return;
    examViewService.removeGrantExamAppSignatureKeys(
        examId,
        selectedAsk.value?.id.toString(),
    );
    monitoringViewService.getAskAndStore(examId);
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
    border-width: 3px;
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
    font-size: 11px;
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
    height: 620px;
    display: flex;
    flex-direction: column;
    position: relative;
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

.status-option {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.status-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
    height: 20px;
    padding: 0 8px;
    font-size: 12px;
    font-weight: 700;
    border-radius: 6px;
    background: #f5f5f5;
    border: 1px solid #ececec;
    line-height: 1;
}

.status-sep {
    width: 1px;
    height: 16px;
    background: #dcdcdc;
}

.status-label {
    line-height: 1.2;
}

.status-divider {
    margin: 4px;
    background: #f5f5f5 !important;
    height: 1px !important;
    opacity: 1;
}
</style>
