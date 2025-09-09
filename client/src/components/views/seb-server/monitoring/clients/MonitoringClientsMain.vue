<template>
    <v-row>
        <v-col>
            <v-sheet class="rounded-lg pa-8" elevation="4">
                <div class="mb-2">
                    {{ translate("monitoringClients.main.displayedClients") }}
                    {{ monitoringDataTable.length }}
                </div>
                <div
                    v-if="monitoringStore.selectedMonitoringIds.length != 0"
                    class="mb-2"
                >
                    {{ translate("monitoringClients.main.selectedClients") }}
                    {{ monitoringStore.selectedMonitoringIds.length }}
                </div>

                <v-data-table
                    v-model="monitoringStore.selectedMonitoringIds"
                    :headers="clientsTableHeaders"
                    hide-default-footer
                    :hover="true"
                    item-value="id"
                    :items="monitoringDataTable"
                    :items-length="monitoringDataTable.length"
                    :items-per-page="monitoringDataTable.length"
                    select-strategy="all"
                    show-select
                >
                    <template
                        #headers="{
                            columns,
                            isSorted,
                            getSortIcon,
                            toggleSort,
                            selectAll,
                            allSelected,
                            someSelected,
                        }"
                    >
                        <TableHeaders
                            :all-selected="allSelected"
                            :columns="columns"
                            :get-sort-icon="getSortIcon"
                            :header-refs-prop="clientsTableHeadersRef"
                            :is-sorted="isSorted"
                            :select-all="selectAll"
                            :some-selected="someSelected"
                            table-key="monitoringClients"
                            :toggle-sort="toggleSort"
                            @add-indicator-headers="addIndicatorHeaders"
                            @remove-indicator-headers="removeIndicatorHeaders"
                        >
                        </TableHeaders>
                    </template>

                    <template
                        #item="{ item, isSelected, toggleSelect, internalItem }"
                    >
                        <tr>
                            <!------selection checkbox------->
                            <td>
                                <v-checkbox-btn
                                    :model-value="isSelected(internalItem)"
                                    @update:model-value="
                                        toggleSelect(internalItem)
                                    "
                                >
                                </v-checkbox-btn>
                            </td>

                            <!------client name------->
                            <td>{{ item.nameOrSession }}</td>

                            <!------client groups------->
                            <td>
                                <template
                                    v-for="(
                                        clientGroup, index
                                    ) in item.clientGroups"
                                    :key="clientGroup.id"
                                >
                                    <div>
                                        <v-chip
                                            class="mb-2"
                                            :class="[index == 0 ? 'mt-2' : '']"
                                            size="small"
                                            variant="tonal"
                                            @click="
                                                openClientGroupDialog(
                                                    clientGroup,
                                                )
                                            "
                                        >
                                            {{ clientGroup.name }}
                                        </v-chip>
                                    </div>
                                </template>
                            </td>

                            <!------connection info------->
                            <td>{{ item.connectionInfo }}</td>

                            <!------status------->
                            <td>{{ translateStatus(item) }}</td>

                            <!------battery indicator------->
                            <td
                                v-if="
                                    (tableStore.isIndicatorsExpanded ||
                                        isBatteryIndicator) &&
                                    monitoringStore.batteryIndicatorId != null
                                "
                            >
                                <v-chip
                                    :color="
                                        getIndicatorColor(
                                            item.indicators?.get(
                                                monitoringStore.batteryIndicatorId,
                                            ),
                                        )
                                    "
                                >
                                    {{
                                        item.indicators?.get(
                                            monitoringStore.batteryIndicatorId,
                                        )?.indicatorValue
                                    }}
                                </v-chip>
                            </td>

                            <!------wlan indicator------->
                            <td
                                v-if="
                                    (tableStore.isIndicatorsExpanded ||
                                        isWlanIndicator) &&
                                    monitoringStore.wlanIndicatorId != null
                                "
                            >
                                <v-chip
                                    :color="
                                        getIndicatorColor(
                                            item.indicators?.get(
                                                monitoringStore.wlanIndicatorId,
                                            ),
                                        )
                                    "
                                >
                                    {{
                                        item.indicators?.get(
                                            monitoringStore.wlanIndicatorId,
                                        )?.indicatorValue
                                    }}
                                </v-chip>
                            </td>

                            <!------navigation button------->
                            <td align="right">
                                <v-icon
                                    icon="mdi-chevron-right"
                                    style="font-size: 30px"
                                    @click="
                                        monitoringViewService.goToMonitoringDetails(
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
            </v-sheet>
        </v-col>
    </v-row>

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
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { useAppBarStore, useTableStore } from "@/stores/store";
import { translate } from "@/utils/generalUtils";
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
import * as generalUtils from "@/utils/generalUtils";
import * as examViewService from "@/services/seb-server/component-services/examViewService";
import * as indicatorViewService from "@/services/seb-server/component-services/indicatorViewService";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import {
    IndicatorEnum,
    IndicatorObject,
    MonitoringHeaderEnum,
} from "@/models/seb-server/monitoringEnums";
import { MonitoringRow } from "@/models/seb-server/monitoringClients";
import * as tableUtils from "@/utils/table/tableUtils";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

// exam
const examId = useRoute().params.examId.toString();

// router
const route = useRoute();

// i18n
const i18n = useI18n();

// stores
const monitoringStore = useMonitoringStore();
const monitoringStoreRef = storeToRefs(monitoringStore);
const appBarStore = useAppBarStore();
const tableStore = useTableStore();

// items
const connections = ref<MonitoringConnections>();
const monitoringDataTable = ref<MonitoringRow[]>([]);
// const staticClientDataList = ref<MonitoringStaticClientData>();
// const monitoringData = ref<Map<number, MonitoringRow>>(new Map());

// indicators
const isBatteryIndicator = ref<boolean>(false);
const isWlanIndicator = ref<boolean>(false);

// interval
let intervalRefresh: any | null = null;
const REFRESH_INTERVAL: number = 1 * 2000;

// dialogs
const clientGroupDialog = ref<boolean>(false);
const clientGroupToView = ref<ClientGroup | null>(null);

// table
const clientsTableHeadersRef = ref<any[]>();
const clientsTableHeaders = ref([
    {
        title: translate("monitoringClients.main.tableHeaderNameSession"),
        key: "nameOrSession",
        width: "30%",
        sortable: true,
    },
    {
        title: translate("monitoringClients.main.tableHeaderClientGroups"),
        key: "clientGroups",
        width: "20%",
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
    { title: "", key: "link", width: "5%" },
]);

watch(monitoringStoreRef.selectedMonitoringIds, () => {
    // console.log(monitoringStore.selectedMonitoringIds)
});

//= ========events & watchers================
onMounted(async () => {
    await initalize();
});

onBeforeUnmount(() => {
    stopIntervalRefresh();
});

onUnmounted(() => {
    tableStore.isIndicatorsExpanded = false;
});

onUpdated(() => {
    // console.log("dom got updated")
});

function updateTableData() {
    monitoringDataTable.value = Array.from(
        monitoringStore.monitoringData,
        ([key, value]) => ({
            key,
            ...value,
        }),
    );
}

async function initalize() {
    // const start = performance.now();

    await getAndSetConnections();
    await getAndSetStaticClientData(getAllConnectionIds());

    initalizeTableData();
    // addIndicatorHeaders();

    // const end = performance.now();
    // console.log(`Execution time: ${(end - start)/1000} ms`);

    startIntervalRefresh();
}

watch(connections, async () => {
    // check if sessions got added / removed
    if (
        connections.value?.monitoringConnectionData.cons.length! >
        monitoringStore.monitoringData.size
    ) {
        // await addNewClients();
        addNewClients();
    }

    if (
        connections.value?.monitoringConnectionData.cons.length! <
        monitoringStore.monitoringData.size
    ) {
        removeClients();
    }

    await updateConnections();
});

// watch(() => route.query, () => {
//     getAndSetFullPageData();
//   },{ deep: true }
// );

//= =============data fetching================
async function getAndSetConnections() {
    // add show all filter if no filter is selected
    if (
        Object.keys(route.query).length == 0 ||
        route.query[MonitoringHeaderEnum.SHOW_ALL]
    ) {
        monitoringStore.isNoFilterSelected = true;
    } else {
        monitoringStore.isNoFilterSelected = false;
    }

    const fullPageResponse: MonitoringConnections | null =
        await monitoringViewService.getConnections(examId, {
            [MonitoringHeaderEnum.SHOW_ALL]: monitoringStore.isNoFilterSelected,
            [MonitoringHeaderEnum.SHOW_CLIENT_GROUPS]:
                route.query[MonitoringHeaderEnum.SHOW_CLIENT_GROUPS] || [],
            [MonitoringHeaderEnum.SHOW_STATES]:
                route.query[MonitoringHeaderEnum.SHOW_STATES] || [],
            [MonitoringHeaderEnum.SHOW_NOTIFCATION]:
                route.query[MonitoringHeaderEnum.SHOW_NOTIFCATION] || [],
            [MonitoringHeaderEnum.SHOW_INDICATORS]:
                route.query[MonitoringHeaderEnum.SHOW_INDICATORS] || [],
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
        await monitoringViewService.getStaticClientData(
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
    return await monitoringViewService.getStaticClientData(
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
                if (dynamicData.st != monitoringRowData.status) {
                    idsToUpdateMap.set(monitoringRowData.id, index);
                } else {
                    updateConnectionRow(monitoringRowData, dynamicData);
                }
            }
        },
    );

    if (idsToUpdateMap.size != 0) {
        // await addFreshData(idsToUpdateMap);
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

    // await addFreshData(newIdsMap);
    addFreshData(newIdsMap);

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

    connections.value.monitoringConnectionData.cons.forEach(
        (dynamicData, index) => {
            const staticClientData: StaticClientConnectionData | undefined =
                staticDataMap.get(dynamicData.id);

            if (staticClientData != null) {
                const monitoringRow: MonitoringRow = createMonitoringRowData(
                    dynamicData,
                    staticClientData,
                );
                monitoringStore.monitoringData.set(
                    monitoringRow.id,
                    monitoringRow,
                );
            }
        },
    );

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
        clientGroups: monitoringViewService.extractClientGroupNames(
            staticClientData.cg,
        ),
        connectionInfo: staticClientData.seb_info,
        status: fullPageDataConnection.st,
        missing: (fullPageDataConnection.nf & 1) > 0,
        invalidSEBVersion: (fullPageDataConnection.nf & 16) > 0,
        indicators: extractIndicators(fullPageDataConnection.iv),
    };
}

function translateStatus(row: MonitoringRow): string {
    if (row.missing) {
        return translate("MISSING", i18n);
    }
    return translate(row.status, i18n);
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
                (indicator) => indicator.id == parseInt(key),
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
                indicatorFullObject.indicatorType ==
                IndicatorEnum.BATTERY_STATUS
            ) {
                monitoringStore.batteryIndicatorId = indicator.id;
            }

            if (
                indicatorFullObject.indicatorType == IndicatorEnum.WLAN_STATUS
            ) {
                monitoringStore.wlanIndicatorId = indicator.id;
            }

            indicatorsMap.set(indicator.id, indicatorFullObject);
        }
    }

    return indicatorsMap;
}

function addIndicatorHeaders() {
    tableStore.isIndicatorsExpanded = true;

    if (monitoringStore.batteryIndicatorId != null) {
        clientsTableHeaders.value.splice(4, 0, {
            title: translate("monitoringClients.main.tableHeaderBattery", i18n),
            key: "",
            width: "8%",
            sortable: false,
        });
    }

    if (monitoringStore.wlanIndicatorId != null) {
        clientsTableHeaders.value.splice(5, 0, {
            title: translate("monitoringClients.main.tableHeaderWlan", i18n),
            key: "",
            width: "8%",
            sortable: false,
        });
    }
}

function removeIndicatorHeaders() {
    if (
        monitoringStore.batteryIndicatorId == null &&
        monitoringStore.wlanIndicatorId == null
    ) {
        return;
    }

    tableStore.isIndicatorsExpanded = false;

    if (
        monitoringStore.batteryIndicatorId != null &&
        monitoringStore.wlanIndicatorId != null
    ) {
        clientsTableHeaders.value.splice(4, 2);
        return;
    }

    clientsTableHeaders.value.splice(4, 1);
}

function modifyIndicatorHeaders(indicatorString: any | null) {
    if (indicatorString == null) {
        indicatorString = "";
    }

    // at least 1 filter is selected
    if (indicatorString != "") {
        if (tableStore.isIndicatorsExpanded) {
            removeIndicatorHeaders();
        }
        tableStore.isIndicatorExpandButtonDisabled = true;
        tableStore.isIndicatorsExpanded = false;
    } else {
        tableStore.isIndicatorExpandButtonDisabled = false;
    }

    // remove battery indicator
    if (
        !indicatorString.includes(IndicatorEnum.BATTERY_STATUS.toString()) &&
        isBatteryIndicator.value
    ) {
        removeBatteryHeader(4);
    }

    // add battery indicator
    if (
        indicatorString.includes(IndicatorEnum.BATTERY_STATUS.toString()) &&
        !tableStore.isIndicatorsExpanded &&
        !isBatteryIndicator.value
    ) {
        addBatteryHeader(4);
    }

    // remove wlan indicator
    if (
        !indicatorString.includes(IndicatorEnum.WLAN_STATUS.toString()) &&
        isWlanIndicator.value
    ) {
        const index: number = isBatteryIndicator.value ? 5 : 4;
        removeWlanHeader(index);
    }

    // add wlan indicator
    if (
        indicatorString.includes(IndicatorEnum.WLAN_STATUS.toString()) &&
        !tableStore.isIndicatorsExpanded &&
        !isWlanIndicator.value
    ) {
        const index: number = isBatteryIndicator.value ? 5 : 4;
        addWlanHeader(index);
    }
}

function addBatteryHeader(index: number) {
    isBatteryIndicator.value = true;
    clientsTableHeaders.value.splice(index, 0, {
        title: translate("monitoringClients.main.tableHeaderBattery", i18n),
        key: "",
        width: "8%",
        sortable: false,
    });
}

function removeBatteryHeader(index: number) {
    isBatteryIndicator.value = false;
    clientsTableHeaders.value.splice(index, 1);
}

function addWlanHeader(index: number) {
    isWlanIndicator.value = true;
    clientsTableHeaders.value.splice(index, 0, {
        title: translate("monitoringClients.main.tableHeaderWlan", i18n),
        key: "",
        width: "8%",
        sortable: false,
    });
}

function removeWlanHeader(index: number) {
    isWlanIndicator.value = false;
    clientsTableHeaders.value.splice(index, 1);
}

function updateConnectionRow(
    row: MonitoringRow,
    data: MonitoringClientConnection,
) {
    updateIndicator(row.indicators, data.iv);
    row.missing = (data.nf & 1) > 0;
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
    // console.log("before call")
    const start = performance.now();

    await getAndSetConnections();

    // console.log("after call")
    const end = performance.now();
    // console.log(`Execution time: ${(end - start)/1000} ms`);

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

<style scoped>
.default-color {
    color: #2196f3;
}

.test-bg {
    background-color: red;
}
</style>
