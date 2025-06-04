<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-8">

                <div class="mb-2">
                    Displayed clients: {{ monitoringDataTable.length }}
                </div>
                <div 
                    v-if="monitoringStore.selectedMonitoringIds.length != 0"
                    class="mb-2">
                    Selected clients: {{ monitoringStore.selectedMonitoringIds.length }}
                </div>

                <v-data-table
                    hide-default-footer
                    show-select
                    select-strategy="all"
                    v-model="monitoringStore.selectedMonitoringIds"
                    item-value="id" 
                    :hover="true"
                    :items="monitoringDataTable"
                    :items-length="monitoringDataTable.length"
                    :items-per-page="monitoringDataTable.length"
                    :headers="clientsTableHeaders">

                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort, selectAll, allSelected, someSelected}">
                        <TableHeaders
                            :selectAll="selectAll"
                            :allSelected="allSelected"
                            :someSelected="someSelected"
                            :columns="columns"
                            :is-sorted="isSorted"
                            :get-sort-icon="getSortIcon"
                            :toggle-sort="toggleSort"
                            :header-refs-prop="clientsTableHeadersRef">
                        </TableHeaders>
                    </template>

                    <template v-slot:item="{item, isSelected, toggleSelect, internalItem}">
                        <tr>
                            <td>
                                <v-checkbox-btn 
                                    :model-value="isSelected(internalItem)"
                                    @update:model-value="toggleSelect(internalItem)">
                                </v-checkbox-btn>
                            </td>

                            <td>{{ item.nameOrSession }}</td>
                            
                            <td>
                                <template v-for="(clientGroup, index) in item.clientGroups" :key="clientGroup.id">
                                    <div>
                                        <v-chip 
                                            :class="[index == 0 ? 'mt-2' : '']"
                                            class="mb-2"
                                            variant="tonal"
                                            size="small"
                                            @click="openClientGroupDialog(clientGroup)">
                                            {{ clientGroup.name }}
                                        </v-chip>
                                    </div>
                                </template>
                            </td>
                            
                            <td>{{ item.connectionInfo }}</td>
                            <td>{{ translate(item.status) }}</td>
                            <td v-for="indicator in monitoringStore.indicators?.content" :key="indicator.id">
                                {{ item.indicators?.get(indicator.id)?.indicatorValue }}
                            </td>

                            <td align="right">
                                <v-icon 
                                    icon="mdi-chevron-right"
                                    style="font-size: 30px;"
                                    @click="monitoringViewService.goToMonitoringDetails(examId, item.connectionToken)">
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
            @closeClientGroupDialog="closeClientGroupDialog">
        </ClientGroupInfoDialog>
    </v-dialog>

</template>

<script setup lang="ts">
    import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
    import { useAppBarStore } from "@/stores/store";
    import {translate} from "@/utils/generalUtils";
    import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
    import * as generalUtils from "@/utils/generalUtils";
    import * as examViewService from "@/services/seb-server/component-services/examViewService";
    import * as indicatorViewService from "@/services/seb-server/component-services/indicatorViewService";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import { IndicatorEnum, IndicatorObject, MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";
    import { MonitoringRow } from "@/models/seb-server/monitoringClients";
    import * as tableUtils from "@/utils/table/tableUtils";
    import { storeToRefs } from "pinia";

    //exam
    const examId = useRoute().params.examId.toString();

    //router
    const route = useRoute();

    //stores
    const monitoringStore = useMonitoringStore();
    const monitoringStoreRef = storeToRefs(monitoringStore);
    const appBarStore = useAppBarStore();

    //items
    const connections = ref<MonitoringConnections>();
    const monitoringDataTable = ref<MonitoringRow[]>([]);
    // const staticClientDataList = ref<MonitoringStaticClientData>();
    // const monitoringData = ref<Map<number, MonitoringRow>>(new Map());

    //interval
    let intervalRefresh: any | null = null;
    const REFRESH_INTERVAL: number = 1 * 1000;

    //dialogs
    const clientGroupDialog = ref<boolean>(false);
    const clientGroupToView = ref<ClientGroup | null>(null);

    //table
    const clientsTableHeadersRef = ref<any[]>();
    const clientsTableHeaders = ref([
        {title: translate("monitoringClients.main.tableHeaderNameSession"), key: "nameOrSession", width: "30%", sortable: true},
        {title: translate("monitoringClients.main.tableHeaderClientGroups"), key: "clientGroups", width: "20%", sortable: true},
        {title: translate("monitoringClients.main.tableHeaderConnectionInfo"), key: "connectionInfo", width: "20%", sortable: true},
        {title: translate("monitoringClients.main.tableHeaderStatus"), key: "status", sortable: true},
        {title: "", key: "link", width: "5%"}
    ]);  

    watch(monitoringStoreRef.selectedMonitoringIds, () => {
        // console.log(monitoringStore.selectedMonitoringIds)
    });


    //=========events & watchers================
    onMounted(async () => {
        await initalize();  
    });

    onBeforeUnmount(() => {
        stopIntervalRefresh();
    });

    onUpdated(() => {
        // console.log("dom got updated")
    })

    function updateTableData(){
        monitoringDataTable.value = Array.from(monitoringStore.monitoringData, ([key, value]) => ({
            key,
            ...value
        }));
    }


    async function initalize(){
        // const start = performance.now();

        await getAndSetConnections();
        await getAndSetStaticClientData(getAllConnectionIds());

        initalizeTableData();
        addIndicatorHeaders();

        // const end = performance.now();
        // console.log(`Execution time: ${(end - start)/1000} ms`);

        startIntervalRefresh();
    }

    watch(connections, async () => {

        //check if sessions got added / removed
        if(connections.value?.monitoringConnectionData.cons.length! > monitoringStore.monitoringData.size){
            // await addNewClients();
            addNewClients();
        }

        if(connections.value?.monitoringConnectionData.cons.length! < monitoringStore.monitoringData.size){
            removeClients();
        }

        await updateConnections();
    });

    // watch(() => route.query, () => {
    //     getAndSetFullPageData();
    //   },{ deep: true }
    // );


    //==============data fetching================
    async function getAndSetConnections(){
        //add show all filter if no filter is selected
        if(Object.keys(route.query).length == 0 || route.query[MonitoringHeaderEnum.SHOW_ALL]){
            monitoringStore.isNoFilterSelected = true;
        }else{
            monitoringStore.isNoFilterSelected = false;
        }

        const fullPageResponse: MonitoringConnections | null = await monitoringViewService.getConnections(
            examId, 
            {   
                [MonitoringHeaderEnum.SHOW_ALL]: monitoringStore.isNoFilterSelected,
                [MonitoringHeaderEnum.SHOW_CLIENT_GROUPS]: route.query[MonitoringHeaderEnum.SHOW_CLIENT_GROUPS] || [],
                [MonitoringHeaderEnum.SHOW_STATES]: route.query[MonitoringHeaderEnum.SHOW_STATES] || [],
                [MonitoringHeaderEnum.SHOW_NOTIFCATION]: route.query[MonitoringHeaderEnum.SHOW_NOTIFCATION] || [],
                [MonitoringHeaderEnum.SHOW_INDICATORS]: route.query[MonitoringHeaderEnum.SHOW_INDICATORS] || [],
            }
        );

        if(fullPageResponse == null){
            return;
        }

        connections.value = fullPageResponse;
    }

    async function getAndSetStaticClientData(modelIds: number[]){
        const staticClientDataResponse: MonitoringStaticClientData | null = await monitoringViewService.getStaticClientData(examId, generalUtils.createStringCommaList(modelIds));
        if(staticClientDataResponse == null){
            return;
        }

        monitoringStore.staticClientDataList = staticClientDataResponse;
    }

    async function getStaticClientData(modelIds: number[]): Promise<MonitoringStaticClientData | null>{
        return await monitoringViewService.getStaticClientData(examId, generalUtils.createStringCommaList(modelIds));
    }



    //==============data update=================
    async function updateConnections(){
        if(connections.value == null || monitoringStore.staticClientDataList == null){
            return;
        }

        const idsToUpdateMap = new Map<number, number>();

        connections.value.monitoringConnectionData.cons.forEach((dynamicData, index) => {

            const monitoringRowData: MonitoringRow | undefined = monitoringStore.monitoringData.get(dynamicData.id);

            if(monitoringRowData != null){
                if(dynamicData.st != monitoringRowData.status){
                    idsToUpdateMap.set(monitoringRowData.id, index);

                }else{
                    updateIndicator(monitoringRowData.indicators, dynamicData.iv);
                }
            }
        });

        if(idsToUpdateMap.size != 0){
            // await addFreshData(idsToUpdateMap);
            addFreshData(idsToUpdateMap);

        }

        updateTableData();
    }

    async function addFreshData(ids: Map<number, number>){
        const newStaticClients: MonitoringStaticClientData | null = await getStaticClientData(Array.from(ids.keys()));
        if(newStaticClients == null){
            return;
        }

        newStaticClients?.staticClientConnectionData.forEach((staticData) => {
            const fullPageItemIndex: number | undefined = ids.get(staticData.id);

            if(fullPageItemIndex != null && connections.value != null){
                monitoringStore.monitoringData.set(
                    staticData.id,
                    createMonitoringRowData(
                        connections.value.monitoringConnectionData.cons[fullPageItemIndex], 
                        staticData
                    )
                );
            }
        });
    }

    async function addNewClients(){
        if(connections.value == null || monitoringStore.staticClientDataList == null){
            return;
        }

        const fullPageDataConnections: MonitoringClientConnection[] = connections.value.monitoringConnectionData.cons;

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

    function removeClients(){
        if(connections.value == null || monitoringStore.staticClientDataList == null){
            return;
        }

        const dynamicDataSet: Set<number> = new Set(connections.value.monitoringConnectionData.cons.map(connection => connection.id));

        //check current data contains fresh data
        for (const key of monitoringStore.monitoringData.keys()) {
            if (!dynamicDataSet.has(key)) {
                monitoringStore.monitoringData.delete(key);
            }
        }

        updateTableData();
    }


    //=================data preparing===================
    function initalizeTableData(){
        if(connections.value == null || monitoringStore.staticClientDataList == null){
            return;
        }

        const staticDataMap: Map<number, StaticClientConnectionData> = new Map(
            monitoringStore.staticClientDataList.staticClientConnectionData.map(data => [data.id, data])
        );

        connections.value.monitoringConnectionData.cons.forEach((dynamicData, index) => {

            const staticClientData: StaticClientConnectionData | undefined = staticDataMap.get(dynamicData.id);

            if(staticClientData != null){
                const monitoringRow: MonitoringRow = createMonitoringRowData(dynamicData, staticClientData);
                monitoringStore.monitoringData.set(monitoringRow.id, monitoringRow);
            }
            
        });

        updateTableData();
    }

    function createMonitoringRowData(fullPageDataConnection: MonitoringClientConnection, staticClientData: StaticClientConnectionData): MonitoringRow{
        return {
            id: fullPageDataConnection.id,
            connectionToken: staticClientData.connectionToken,
            nameOrSession: staticClientData.examUserSessionId,
            clientGroups: monitoringViewService.extractClientGroupNames(staticClientData.cg),
            connectionInfo: staticClientData.seb_info,
            status: fullPageDataConnection.st,
            indicators: extractIndicators(fullPageDataConnection.iv),
        }
    }

    function getAllConnectionIds(): number[]{
        if(connections.value == null){
            return [];
        }

        return connections.value.monitoringConnectionData.cons.map(
            (cons: { id: number}) => cons.id
        );
    }

    //=================indicators===================
    function extractIndicators(indicatorValues: Record<string, string>): Map<number, IndicatorObject>{
        const indicatorsMap: Map<number, IndicatorObject> = new Map();

        for (const [key, value] of Object.entries(indicatorValues)) {

            const indicator: Indicator | undefined = monitoringStore.indicators?.content.find(indicator => indicator.id == parseInt(key));

            if(indicator != null){
                const indicatorFullObject: IndicatorObject = {
                    indicatorType: generalUtils.findEnumValue(IndicatorEnum, indicator.type),
                    indicatorValue: parseInt(value),
                    indicatorObject: indicator,
                }

                indicatorsMap.set(indicator.id, indicatorFullObject);
            }
        }

        return indicatorsMap;
    }

    function addIndicatorHeaders(){
        monitoringStore.indicators?.content.forEach((indicator) => {
            clientsTableHeaders.value.splice(
                clientsTableHeaders.value.length-1,
                0,
                {
                    title: indicator.name, 
                    key: indicator.id.toString(),
                    sortable: false
                }
            );
        });
    }

    function updateIndicator(indicatorMap: Map<number, IndicatorObject> | undefined, indicatorValues: Record<string, string>){
        if(indicatorMap == null){
            return;
        }

        indicatorMap.forEach((indicatorObject, key) => {
            indicatorObject.indicatorValue = parseInt(indicatorValues[key.toString()]);

        });
    }

    //=================interval===================
    async function startIntervalRefresh(){
        // console.log("before call")
        const start = performance.now();

        await getAndSetConnections();

        // console.log("after call")
        const end = performance.now();
        // console.log(`Execution time: ${(end - start)/1000} ms`);

        intervalRefresh = setTimeout(startIntervalRefresh, REFRESH_INTERVAL);
    }

    // async function startIntervalRefresh(){
    //     intervalRefresh = setInterval(async () => {

    //         //todo: check when request is finished
    //         await getAndSetConnections();

    //     }, REFRESH_INTERVAL);
    // }



    function stopIntervalRefresh(){
        if (intervalRefresh) {
            clearInterval(intervalRefresh);
        }
    }


    //========client group dialog========
    function openClientGroupDialog(clientGroup: ClientGroup){
        clientGroupToView.value = clientGroup;
        clientGroupDialog.value = true;
    }

    function closeClientGroupDialog(){
        clientGroupDialog.value = false;
    }

</script>

<style scoped>
    .default-color {
        color: #2196F3;
    }

</style>