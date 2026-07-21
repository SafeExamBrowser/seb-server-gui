<template>
    <v-card>
        <v-toolbar color="transparent" class="ma-3">
            <v-toolbar-title class="text-headline-small font-weight-black">
                {{ $t("monitoringDetails.monitoringASKDialog.title") }}
                <v-btn
                    icon="mdi-refresh"
                    class="mr-2"
                    color="primary"
                    :aria-label="
                        $t('monitoringDetails.monitoringASKDialog.refresh')
                    "
                    @click="refreshAsk"
                />
            </v-toolbar-title>

            <template #append>
                <v-btn
                    icon="mdi-close"
                    class="mr-8"
                    :aria-label="
                        $t('monitoringDetails.monitoringASKDialog.close')
                    "
                    @click="closeDialog"
                />
            </template>
        </v-toolbar>

        <v-card-text class="pt-0">
            <v-row no-gutters>
                <!-- LEFT: ASK key list + grant footer -->
                <v-col
                    cols="6"
                    class="d-flex flex-column border-t border-e"
                    style="height: 700px"
                >
                    <div class="flex-grow-1 overflow-y-auto px-3 pt-4 pb-3">
                        <v-item-group v-model="selectedAskIdx">
                            <v-item
                                v-for="(ask, index) in askEnriched"
                                :key="ask.keyValue"
                                :value="index"
                            >
                                <template #default="{ isSelected, toggle }">
                                    <AskKeyListItem
                                        :ask="ask"
                                        :selected="isSelected"
                                        class="mb-3"
                                        @select="toggle"
                                    />
                                </template>
                            </v-item>
                        </v-item-group>
                    </div>

                    <AskGrantFooter
                        v-model="grantKeyInput"
                        :ask="selectedAsk"
                        @grant="onGrantKey"
                        @remove="onRemoveGrant"
                    />
                </v-col>

                <!-- RIGHT: connections -->
                <v-col
                    cols="6"
                    class="d-flex flex-column border-t"
                    style="height: 700px"
                >
                    <div
                        class="d-flex align-center ga-3 px-3 pt-3 mb-3"
                        data-testid="aks-connections-header"
                        :style="hiddenWhenNoKey"
                    >
                        <div
                            class="text-title-large font-weight-bold"
                            data-testid="aks-connections-title"
                        >
                            {{
                                $t(
                                    "monitoringDetails.monitoringASKDialog.connectionsTitle",
                                )
                            }}
                        </div>
                        <div
                            class="text-medium-emphasis"
                            data-testid="aks-connections-count"
                        >
                            {{ filteredConnections.length }}
                            {{
                                filteredConnections.length === 1
                                    ? "connection"
                                    : "connections"
                            }}
                        </div>
                        <v-spacer />
                        <v-select
                            v-model="statusFilter"
                            :items="statusItems"
                            item-title="label"
                            item-value="value"
                            density="compact"
                            variant="outlined"
                            hide-details
                            data-testid="aks-status-filter"
                            :aria-label="
                                $t(
                                    'monitoringDetails.monitoringASKDialog.statusFilterLabel',
                                )
                            "
                            style="max-width: 260px"
                        >
                            <template #item="{ props, item, index }">
                                <v-list-item v-bind="props">
                                    <template #prepend>
                                        <v-chip
                                            size="x-small"
                                            variant="tonal"
                                            class="mr-2"
                                        >
                                            {{ item.count }}
                                        </v-chip>
                                    </template>
                                </v-list-item>
                                <v-divider
                                    v-if="
                                        item.value === 'ALL' &&
                                        index < statusItems.length - 1
                                    "
                                />
                            </template>
                        </v-select>
                    </div>

                    <div class="mx-3 mb-3" :style="hiddenWhenNoKey">
                        <v-text-field
                            v-model="searchQuery"
                            data-testid="connections-search-input"
                            density="compact"
                            hide-details
                            append-inner-icon="mdi-magnify"
                            :placeholder="
                                $t(
                                    'monitoringDetails.monitoringASKDialog.searchText',
                                )
                            "
                            :aria-label="
                                $t(
                                    'monitoringDetails.monitoringASKDialog.searchText',
                                )
                            "
                            type="text"
                            variant="outlined"
                        />
                    </div>

                    <template v-if="isKeySelected">
                        <div class="flex-grow-1 overflow-y-auto px-3">
                            <AskConnectionListItem
                                v-for="conn in pagedConnections"
                                :key="conn.id"
                                :connection="conn"
                                class="mb-3"
                                @show="
                                    showConnection(conn.conn?.connectionToken)
                                "
                            />
                        </div>

                        <div
                            class="d-flex align-center justify-space-between mt-2 px-3"
                        >
                            <div class="text-body-small">
                                Showing {{ pageStart + 1 }}–{{ pageEnd }} of
                                {{ totalConnections }}
                            </div>
                            <div class="d-flex ga-2">
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
                    </template>

                    <div
                        v-else
                        class="d-flex flex-column align-center justify-center text-center flex-grow-1 px-3"
                    >
                        <v-icon size="96" class="text-disabled">
                            mdi-cursor-default-click-outline
                        </v-icon>
                        <div class="text-body-large text-medium-emphasis mt-3">
                            {{
                                $t(
                                    "monitoringDetails.monitoringASKDialog.selectAskKey",
                                )
                            }}
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
import { useRouter } from "vue-router";

import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import { getAskAndStore } from "@/pages/(app)/monitoring/[examId]/client/composables/useMonitoringData.ts";
import * as examService from "@/services/seb-server/examService.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";

import AskConnectionListItem from "./ask/AskConnectionListItem.vue";
import AskGrantFooter from "./ask/AskGrantFooter.vue";
import AskKeyListItem from "./ask/AskKeyListItem.vue";

const store = useMonitoringStore();
const router = useRouter();
const emit = defineEmits<{
    closeAskDialog: [];
    refresh: [];
    grantKey: [string];
}>();

const examId = useMonitoringStore().selectedExam?.id.toString();
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

const selectedAsk = computed(() =>
    isKeySelected.value ? askEnriched.value[selectedAskIdx.value] : undefined,
);
const selectedConnections = computed(() => selectedAsk.value?.entries ?? []);

const firstConnId = computed<number | undefined>(
    () => selectedConnections.value?.[0]?.id,
);

const hiddenWhenNoKey = computed(() =>
    isKeySelected.value ? undefined : { visibility: "hidden" as const },
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
    await getAskAndStore(examId);
}

function onGrantKey() {
    const val = grantKeyInput.value;

    if (!examId || !firstConnId.value || !val) {
        return;
    }
    examService.grantExamAppSignatureKeys(
        val,
        examId,
        String(firstConnId.value),
    );
    getAskAndStore(examId);
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
        const firstConn = entries[0]?.conn;
        return {
            ...ask,
            entries,
            sebVersion: firstConn?.clientVersion ?? "",
            osName: firstConn?.clientOsName ?? "",
        };
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

function showConnection(connectionToken?: string) {
    if (!examId || !connectionToken) {
        return;
    }

    closeDialog();
    void router.push({
        name: "/(app)/monitoring/[examId]/client/[connectionToken]/",
        params: { examId, connectionToken },
    });
}

const firstConnInfo = computed(() => {
    const first = selectedConnections.value[0]?.conn;
    const os = first?.clientOsName || "";
    const ver = first?.clientVersion || "";
    // SEB version first, then OS version
    return ver || os ? `${ver}${ver && os ? " " : ""}${os}` : "";
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
    examService.removeGrantExamAppSignatureKeys(
        examId,
        selectedAsk.value?.id.toString(),
    );
    getAskAndStore(examId);
}
</script>
