<template>
    <div class="d-flex align-center justify-end px-5 py-4">
        <span class="text-body-small text-medium-emphasis">
            {{
                isFiltered
                    ? $t("monitoringClients.main.filtered")
                    : $t("monitoringClients.main.allConnections")
            }}
        </span>
    </div>
    <v-divider />

    <div class="overflow-hidden">
        <v-data-table
            :style="tableSlideStyle"
            :headers="clientsTableHeaders"
            hide-default-footer
            :hover="true"
            item-value="id"
            :items="monitoringDataTable"
            :items-length="monitoringDataTable.length"
            :items-per-page="monitoringDataTable.length"
            :loading="loading"
            :loading-text="$t('general.loading')"
            :no-data-text="$t('general.noData')"
        >
            <template #loading>
                <v-skeleton-loader type="table-row@8" />
            </template>

            <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
                <TableHeaders
                    :all-selected="allEligibleSelected"
                    :columns="columns"
                    :get-sort-icon="getSortIcon"
                    :header-refs-prop="clientsTableHeadersRef"
                    :is-sorted="isSorted"
                    :select-all="toggleSelectAll"
                    :selection-active="isActionArmed"
                    :some-selected="someEligibleSelected"
                    table-key="monitoringClients"
                    :toggle-sort="toggleSort"
                    @add-indicator-headers="handleAddIndicatorHeaders"
                    @remove-indicator-headers="handleRemoveIndicatorHeaders"
                >
                </TableHeaders>
            </template>

            <template #item="{ item, index }">
                <tr
                    :class="isRowSelected(item) ? 'bg-surface-tint' : ''"
                    :style="getRowStyle(item)"
                    @click="handleRowClick(item)"
                >
                    <!------selection checkbox------->
                    <td :style="SELECTION_CELL_STYLE">
                        <div
                            :style="
                                selectionCellInnerStyle(isActionArmed, index)
                            "
                        >
                            <v-checkbox-btn
                                v-if="isActionArmed && isRowEligible(item)"
                                :model-value="isRowSelected(item)"
                                @click.stop
                                @update:model-value="toggleRowSelection(item)"
                            >
                            </v-checkbox-btn>
                        </div>
                    </td>

                    <!------notification icons------->
                    <td width="2%">
                        <div class="d-flex align-center ga-1">
                            <v-icon
                                v-if="item.pendingLockScreen"
                                :color="NOTIFICATION_META.LOCK_SCREEN.color"
                                :icon="NOTIFICATION_META.LOCK_SCREEN.icon"
                            ></v-icon>
                            <v-icon
                                v-if="item.pendingRaiseHand"
                                :color="NOTIFICATION_META.RAISE_HAND.color"
                                :icon="NOTIFICATION_META.RAISE_HAND.icon"
                            ></v-icon>
                        </div>
                    </td>

                    <!------client name------->
                    <td>
                        <span class="font-weight-bold">
                            {{ item.nameOrSession }}
                        </span>
                    </td>

                    <!------client groups------->
                    <td>
                        <template
                            v-for="(
                                clientGroup, groupIndex
                            ) in item.clientGroups"
                            :key="clientGroup.id"
                        >
                            <div>
                                <v-chip
                                    class="mb-2"
                                    :class="[groupIndex == 0 ? 'mt-2' : '']"
                                    color="primary"
                                    size="small"
                                    variant="tonal"
                                    @click.stop="
                                        openClientGroupDialog(clientGroup)
                                    "
                                >
                                    {{ clientGroup.name }}
                                </v-chip>
                            </div>
                        </template>
                    </td>

                    <!------connection info------->
                    <td>
                        <span class="text-medium-emphasis">
                            {{ item.connectionInfo }}
                        </span>
                    </td>

                    <!------status------->
                    <td>
                        <EnumChip
                            :color="getStatusColor(item)"
                            :label="translateStatus(item)"
                        />
                    </td>

                    <!------battery indicator------->
                    <td v-if="showBatteryColumn">
                        <v-chip
                            :color="
                                getIndicatorColor(getBatteryIndicator(item))
                            "
                            size="small"
                        >
                            {{ getBatteryIndicator(item)?.indicatorValue }}
                        </v-chip>
                    </td>

                    <!------wlan indicator------->
                    <td v-if="showWlanColumn">
                        <v-chip
                            :color="getIndicatorColor(getWlanIndicator(item))"
                            size="small"
                        >
                            {{ getWlanIndicator(item)?.indicatorValue }}
                        </v-chip>
                    </td>

                    <!------navigation button------->
                    <td align="right">
                        <v-icon
                            icon="mdi-chevron-right"
                            style="font-size: 30px"
                            @click.stop="
                                goToMonitoringDetails(
                                    examId,
                                    item.connectionToken,
                                    route.query,
                                )
                            "
                        >
                        </v-icon>
                    </td>
                </tr>
            </template>
        </v-data-table>
    </div>
    <!-----------group dialog---------->
    <v-dialog v-model="clientGroupDialog" max-width="800">
        <ClientGroupInfoDialog
            :client-group="clientGroupToView"
            @close-client-group-dialog="closeClientGroupDialog"
        >
        </ClientGroupInfoDialog>
    </v-dialog>
</template>

<script setup lang="ts">
import {
    computed,
    onBeforeUnmount,
    onMounted,
    onUnmounted,
    ref,
    watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { LocationQueryValue, useRoute } from "vue-router";
import {
    VCheckboxBtn,
    VChip,
    VDataTable,
    VDialog,
    VDivider,
    VIcon,
    VSkeletonLoader,
} from "vuetify/components";

import EnumChip from "@/components/widgets/EnumChip.vue";
import { ClientGroup } from "@/models/seb-server/clientGroup.ts";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import { Indicator } from "@/models/seb-server/indicators.ts";
import {
    MonitoringClientConnection,
    MonitoringConnections,
    MonitoringStaticClientData,
    StaticClientConnectionData,
} from "@/models/seb-server/monitoring.ts";
import { MonitoringRow } from "@/models/seb-server/monitoringClients.ts";
import {
    IndicatorEnum,
    IndicatorObject,
    MonitoringHeaderEnum,
} from "@/models/seb-server/monitoringEnums.ts";
import {
    SELECTION_CELL_STYLE,
    SELECTION_COLUMN_WIDTH,
    SELECTION_EASE,
    selectionCellInnerStyle,
    useMonitoringClientsActions,
} from "@/pages/(app)/monitoring/[examId]/client/composables/useMonitoringClientsActions.ts";
import { goToMonitoringDetails } from "@/pages/(app)/monitoring/[examId]/composables/useMonitoringNavigation.ts";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { useTableStore } from "@/stores/store.ts";
import * as generalUtils from "@/utils/generalUtils.ts";
import { translate } from "@/utils/generalUtils.ts";
import {
    extractClientGroupNames,
    getConnectionStatusColor,
    NOTIFICATION_META,
} from "@/utils/monitoringUtils.ts";
import TableHeaders from "@/utils/table/TableHeaders.vue";

import ClientGroupInfoDialog from "./ClientGroupInfoDialog.vue";

const props = defineProps<{
    examId: string;
}>();

const loading = ref<boolean>(false);

// exam
const examId = props.examId;

// router
const route = useRoute();

// i18n
const i18n = useI18n();

// stores
const monitoringStore = useMonitoringStore();
const tableStore = useTableStore();

// items
const connections = ref<MonitoringConnections>();
const monitoringDataTable = ref<MonitoringRow[]>([]);

// indicators
const isBatteryIndicator = ref<boolean>(false);
const isWlanIndicator = ref<boolean>(false);

// interval
let intervalRefresh: ReturnType<typeof setTimeout> | null = null;
const REFRESH_INTERVAL: number = 2000;

// dialogs
const clientGroupDialog = ref<boolean>(false);
const clientGroupToView = ref<ClientGroup | null>(null);

// table
const clientsTableHeadersRef = ref<(HTMLElement | null)[] | null>(null);

const showBatteryColumn = computed(
    () =>
        (tableStore.isIndicatorsExpanded || isBatteryIndicator.value) &&
        monitoringStore.batteryIndicatorId != null,
);

const showWlanColumn = computed(
    () =>
        (tableStore.isIndicatorsExpanded || isWlanIndicator.value) &&
        monitoringStore.wlanIndicatorId != null,
);

// The headers are derived from the same conditions as the body cells, so the
// indicator columns always end up between "Status" and the navigation column.
const clientsTableHeaders = computed(() => [
    { title: "", key: "select", width: "52px", sortable: false },
    { title: "", key: "icons", width: "2%", sortable: false },
    {
        title: translate("monitoringClients.main.tableHeaderNameSession"),
        key: "nameOrSession",
        width: "53%",
        sortable: true,
    },
    {
        title: translate("monitoringClients.main.tableHeaderClientGroups"),
        key: "clientGroups",
        width: "10%",
        sortable: true,
    },
    {
        title: translate("monitoringClients.main.tableHeaderConnectionInfo"),
        key: "connectionInfo",
        width: "20%",
        sortable: true,
    },
    {
        title: translate("monitoringClients.main.tableHeaderStatus"),
        key: "status",
        width: "10%",
        sortable: true,
    },
    ...(showBatteryColumn.value
        ? [
              {
                  title: translate(
                      "monitoringClients.main.tableHeaderBattery",
                      i18n,
                  ),
                  key: "battery",
                  width: "8%",
                  sortable: false,
              },
          ]
        : []),
    ...(showWlanColumn.value
        ? [
              {
                  title: translate(
                      "monitoringClients.main.tableHeaderWlan",
                      i18n,
                  ),
                  key: "wlan",
                  width: "8%",
                  sortable: false,
              },
          ]
        : []),
    { title: "", key: "link", width: "5%", sortable: false },
]);

// selection & bulk actions
const {
    armedAction,
    allEligibleSelected,
    someEligibleSelected,
    isRowEligible,
    isRowSelected,
    toggleRowSelection,
    toggleSelectAll,
} = useMonitoringClientsActions(examId);

const isActionArmed = computed(() => armedAction.value != null);

// While no action is armed the table is shifted left, hiding the fixed-width
// selection column behind the overflow-hidden wrapper.
const tableSlideStyle = computed(() => ({
    marginLeft: isActionArmed.value ? "0px" : `-${SELECTION_COLUMN_WIDTH}px`,
    transition: `margin-left 0.3s ${SELECTION_EASE}`,
}));

function getRowStyle(row: MonitoringRow) {
    const eligible = isActionArmed.value && isRowEligible(row);
    return {
        opacity: isActionArmed.value && !eligible ? 0.4 : 1,
        cursor: eligible ? "pointer" : "auto",
    };
}

function handleRowClick(row: MonitoringRow) {
    if (!isActionArmed.value || !isRowEligible(row)) {
        return;
    }
    toggleRowSelection(row);
}

const isFiltered = computed(
    () => !monitoringStore.isNoFilterSelected || !!monitoringStore.searchName,
);

//= ========events & watchers================
onMounted(async () => {
    loading.value = true;
    await initalize();
    loading.value = false;
});

onBeforeUnmount(() => {
    stopIntervalRefresh();
});

onUnmounted(() => {
    tableStore.isIndicatorsExpanded = false;
});

function updateTableData() {
    monitoringDataTable.value = Array.from(
        monitoringStore.monitoringData,
        ([key, value]) => ({
            key,
            ...value,
        }),
    ).filter((row) => {
        if (monitoringStore.searchName != null) {
            return row.nameOrSession
                .toLowerCase()
                .includes(monitoringStore.searchName.toLowerCase());
        }
        return true;
    });
}

async function initalize() {
    await getAndSetConnections();
    await getAndSetStaticClientData(getAllConnectionIds());

    initalizeTableData();
    startIntervalRefresh();
}

watch(connections, async () => {
    const consLength = connections.value?.monitoringConnectionData.cons.length;

    if (
        consLength !== undefined &&
        consLength > monitoringStore.monitoringData.size
    ) {
        addNewClients();
    }

    if (
        consLength !== undefined &&
        consLength < monitoringStore.monitoringData.size
    ) {
        removeClients();
    }

    await updateConnections();
});

//= =============data fetching================
const displayedCount = computed(() => monitoringDataTable.value.length);
defineExpose({ updatePage, displayedCount });

async function updatePage() {
    setTimeout(getAndSetConnections, 100);
}

async function getAndSetConnections() {
    if (
        Object.keys(route.query).length === 0 ||
        route.query[MonitoringHeaderEnum.SHOW_ALL]
    ) {
        monitoringStore.isNoFilterSelected = true;
    } else {
        monitoringStore.isNoFilterSelected = false;
    }

    const clientGroups = route.query[MonitoringHeaderEnum.SHOW_CLIENT_GROUPS];
    const states = route.query[MonitoringHeaderEnum.SHOW_STATES];
    const notifications = route.query[MonitoringHeaderEnum.SHOW_NOTIFCATION];
    const indicators = route.query[MonitoringHeaderEnum.SHOW_INDICATORS];

    const fullPageResponse = await monitoringService.getConnections(examId, {
        [MonitoringHeaderEnum.SHOW_ALL]: monitoringStore.isNoFilterSelected,
        [MonitoringHeaderEnum.SHOW_CLIENT_GROUPS]:
            typeof clientGroups === "string" ? clientGroups.split(",") : [],
        [MonitoringHeaderEnum.SHOW_STATES]:
            typeof states === "string" ? states.split(",") : [],
        [MonitoringHeaderEnum.SHOW_NOTIFCATION]:
            typeof notifications === "string" ? notifications.split(",") : [],
        [MonitoringHeaderEnum.SHOW_INDICATORS]:
            typeof indicators === "string" ? indicators.split(",") : [],
    });

    if (fullPageResponse == null) {
        return;
    }

    // add / remove indicators
    modifyIndicatorHeaders(route.query[MonitoringHeaderEnum.SHOW_INDICATORS]);

    connections.value = fullPageResponse;
}

async function getAndSetStaticClientData(modelIds: number[]) {
    const staticClientDataResponse: MonitoringStaticClientData | null =
        await monitoringService.getStaticClientData(
            examId,
            generalUtils.createStringCommaList(modelIds),
        );
    if (staticClientDataResponse == null) {
        return;
    }

    monitoringStore.staticClientDataList = staticClientDataResponse;
}

async function getStaticClientData(
    modelIds: number[],
): Promise<MonitoringStaticClientData | null> {
    return monitoringService.getStaticClientData(
        examId,
        generalUtils.createStringCommaList(modelIds),
    );
}

//= =============data update=================
async function updateConnections() {
    if (
        connections.value == null ||
        monitoringStore.staticClientDataList == null
    ) {
        return;
    }

    const idsToUpdateMap = new Map<number, number>();

    connections.value.monitoringConnectionData.cons.forEach(
        (dynamicData, index) => {
            const monitoringRowData: MonitoringRow | undefined =
                monitoringStore.monitoringData.get(dynamicData.id);

            if (monitoringRowData != null) {
                if (dynamicData.st !== monitoringRowData.status) {
                    idsToUpdateMap.set(monitoringRowData.id, index);
                } else {
                    updateConnectionRow(monitoringRowData, dynamicData);
                }
            }
        },
    );

    if (idsToUpdateMap.size !== 0) {
        addFreshData(idsToUpdateMap);
    }

    updateTableData();
}

async function addFreshData(ids: Map<number, number>) {
    const newStaticClients: MonitoringStaticClientData | null =
        await getStaticClientData(Array.from(ids.keys()));
    if (newStaticClients == null) {
        return;
    }

    newStaticClients?.staticClientConnectionData.forEach((staticData) => {
        const fullPageItemIndex: number | undefined = ids.get(staticData.id);

        if (fullPageItemIndex != null && connections.value != null) {
            monitoringStore.monitoringData.set(
                staticData.id,
                createMonitoringRowData(
                    connections.value.monitoringConnectionData.cons[
                        fullPageItemIndex
                    ],
                    staticData,
                ),
            );
        }
    });
}

async function addNewClients() {
    if (
        connections.value == null ||
        monitoringStore.staticClientDataList == null
    ) {
        return;
    }

    const fullPageDataConnections: MonitoringClientConnection[] =
        connections.value.monitoringConnectionData.cons;

    const newIdsMap = new Map<number, number>();
    fullPageDataConnections.forEach((connection, index) => {
        if (!monitoringStore.monitoringData.has(connection.id)) {
            newIdsMap.set(connection.id, index);
        }
    });

    await addFreshData(newIdsMap);

    updateTableData();
}

function removeClients() {
    if (
        connections.value == null ||
        monitoringStore.staticClientDataList == null
    ) {
        return;
    }

    const dynamicDataSet: Set<number> = new Set(
        connections.value.monitoringConnectionData.cons.map(
            (connection) => connection.id,
        ),
    );

    // check current data contains fresh data
    for (const key of monitoringStore.monitoringData.keys()) {
        if (!dynamicDataSet.has(key)) {
            monitoringStore.monitoringData.delete(key);
        }
    }

    updateTableData();
}

//= ================data preparing===================
function initalizeTableData() {
    if (
        connections.value == null ||
        monitoringStore.staticClientDataList == null
    ) {
        return;
    }

    const staticDataMap: Map<number, StaticClientConnectionData> = new Map(
        monitoringStore.staticClientDataList.staticClientConnectionData.map(
            (data) => [data.id, data],
        ),
    );

    connections.value.monitoringConnectionData.cons.forEach((dynamicData) => {
        const staticClientData: StaticClientConnectionData | undefined =
            staticDataMap.get(dynamicData.id);

        if (staticClientData != null) {
            const monitoringRow: MonitoringRow = createMonitoringRowData(
                dynamicData,
                staticClientData,
            );
            monitoringStore.monitoringData.set(monitoringRow.id, monitoringRow);
        }
    });

    updateTableData();
}

function createMonitoringRowData(
    fullPageDataConnection: MonitoringClientConnection,
    staticClientData: StaticClientConnectionData,
): MonitoringRow {
    return {
        id: fullPageDataConnection.id,
        connectionToken: staticClientData.connectionToken,
        nameOrSession: staticClientData.examUserSessionId,
        clientGroups: extractClientGroupNames(staticClientData.cg),
        connectionInfo: staticClientData.seb_info,
        status: fullPageDataConnection.st,
        missing: (fullPageDataConnection.nf & 1) > 0,
        invalidSEBVersion: (fullPageDataConnection.nf & 16) > 0,
        indicators: extractIndicators(fullPageDataConnection.iv),
        pendingLockScreen: (fullPageDataConnection.nf & 2) > 0,
        pendingRaiseHand: (fullPageDataConnection.nf & 32) > 0,
    };
}

function translateStatus(row: MonitoringRow): string {
    if (row.missing) {
        return translate("MISSING", i18n);
    }
    return translate(row.status, i18n);
}

function getStatusColor(row: MonitoringRow): string {
    return getConnectionStatusColor(
        row.missing ? ConnectionStatusEnum.MISSING : row.status,
    );
}

function getAllConnectionIds(): number[] {
    if (connections.value == null) {
        return [];
    }

    return connections.value.monitoringConnectionData.cons.map(
        (cons: { id: number }) => cons.id,
    );
}

//= ================indicators===================
function extractIndicators(
    indicatorValues: Record<string, string>,
): Map<number, IndicatorObject> {
    const indicatorsMap: Map<number, IndicatorObject> = new Map();

    for (const [key, value] of Object.entries(indicatorValues)) {
        const indicator: Indicator | undefined =
            monitoringStore.indicators?.content.find(
                (indicator) => indicator.id === parseInt(key),
            );

        if (indicator != null) {
            const indicatorFullObject: IndicatorObject = {
                indicatorType: generalUtils.findEnumValue(
                    IndicatorEnum,
                    indicator.type,
                ),
                indicatorValue: generalUtils.parseIfNumber(value),
                indicatorObject: indicator,
            };

            if (
                indicatorFullObject.indicatorType ===
                IndicatorEnum.BATTERY_STATUS
            ) {
                monitoringStore.batteryIndicatorId = indicator.id;
            }

            if (
                indicatorFullObject.indicatorType === IndicatorEnum.WLAN_STATUS
            ) {
                monitoringStore.wlanIndicatorId = indicator.id;
            }

            indicatorsMap.set(indicator.id, indicatorFullObject);
        }
    }

    return indicatorsMap;
}

function handleAddIndicatorHeaders() {
    tableStore.isIndicatorsExpanded = true;
}

function handleRemoveIndicatorHeaders() {
    tableStore.isIndicatorsExpanded = false;
}

function modifyIndicatorHeaders(
    indicatorString: LocationQueryValue | LocationQueryValue[],
) {
    if (indicatorString == null) {
        indicatorString = "";
    }

    // at least 1 indicator filter is selected: the expand toggle is disabled
    // and the filtered indicators are shown as fixed columns instead
    if (indicatorString !== "") {
        tableStore.isIndicatorExpandButtonDisabled = true;
        tableStore.isIndicatorsExpanded = false;
    } else {
        tableStore.isIndicatorExpandButtonDisabled = false;
    }

    isBatteryIndicator.value = indicatorString.includes(
        IndicatorEnum.BATTERY_STATUS.toString(),
    );
    isWlanIndicator.value = indicatorString.includes(
        IndicatorEnum.WLAN_STATUS.toString(),
    );
}

function updateConnectionRow(
    row: MonitoringRow,
    data: MonitoringClientConnection,
) {
    updateIndicator(row.indicators, data.iv);
    row.missing = (data.nf & 1) > 0;
    row.pendingLockScreen = (data.nf & 2) > 0;
    row.pendingRaiseHand = (data.nf & 32) > 0;
}

function updateIndicator(
    indicatorMap: Map<number, IndicatorObject> | undefined,
    indicatorValues: Record<string, string>,
) {
    if (indicatorMap == null) {
        return;
    }

    indicatorMap.forEach((indicatorObject, key) => {
        indicatorObject.indicatorValue = generalUtils.parseIfNumber(
            indicatorValues[key.toString()],
        );
    });
}

function getBatteryIndicator(row: MonitoringRow): IndicatorObject | undefined {
    const indicatorId = monitoringStore.batteryIndicatorId;
    if (indicatorId == null) {
        return undefined;
    }
    return row.indicators?.get(indicatorId);
}

function getWlanIndicator(row: MonitoringRow): IndicatorObject | undefined {
    const indicatorId = monitoringStore.wlanIndicatorId;
    if (indicatorId == null) {
        return undefined;
    }
    return row.indicators?.get(indicatorId);
}

function getIndicatorColor(indicatorObj: IndicatorObject | undefined): string {
    if (
        indicatorObj == null ||
        indicatorObj.indicatorObject.thresholds == null
    ) {
        return "";
    }

    let color: string = "";
    for (let i = 0; i < indicatorObj.indicatorObject.thresholds.length; i++) {
        if (
            typeof indicatorObj.indicatorValue === "number" &&
            indicatorObj.indicatorValue <=
                indicatorObj.indicatorObject.thresholds[i].value
        ) {
            color = indicatorObj.indicatorObject.thresholds[i].color;
        }
    }

    return "#" + color;
}

//= ================interval===================
async function startIntervalRefresh() {
    await getAndSetConnections();
    intervalRefresh = setTimeout(startIntervalRefresh, REFRESH_INTERVAL);
}

function stopIntervalRefresh() {
    if (intervalRefresh) {
        clearInterval(intervalRefresh);
    }
}

//= =======client group dialog========
function openClientGroupDialog(clientGroup: ClientGroup) {
    clientGroupToView.value = clientGroup;
    clientGroupDialog.value = true;
}

function closeClientGroupDialog() {
    clientGroupDialog.value = false;
}
</script>
