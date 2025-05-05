<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-8">

                total items: {{ monitoringDataTable.length }}

                <v-data-table
                    hide-default-footer
                    item-value="id" 
                    :hover="true"
                    :items="monitoringDataTable"
                    :items-length="monitoringDataTable.length"
                    :items-per-page="monitoringDataTable.length"
                    :headers="clientsTableHeaders">

                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                        <TableHeaders
                            :columns="columns"
                            :is-sorted="isSorted"
                            :get-sort-icon="getSortIcon"
                            :toggle-sort="toggleSort"
                            :header-refs-prop="clientsTableHeadersRef">
                        </TableHeaders>
                    </template>

                    <template v-slot:item="{item}">
                        <tr>
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
                            <td>{{ item.status }}</td>
                            <td v-for="indicator in monitoringStore.indicators?.content" :key="indicator.id">
                                {{ item.indicators?.get(indicator.id)?.indicatorValue }}
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
    import { useMonitoringStore } from "@/stores/monitoringStore";
    import { useAppBarStore } from "@/stores/store";
    import {translate} from "@/utils/generalUtils";
    import * as monitoringViewService from "@/services/component-services/monitoringViewService";
    import * as generalUtils from "@/utils/generalUtils";
    import * as examViewService from "@/services/component-services/examViewService";
    import * as indicatorViewService from "@/services/component-services/indicatorViewService";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import { IndicatorEnum, IndicatorObject, MonitoringHeaderEnum } from "@/models/monitoringEnums";
    import { MonitoringRow } from "@/models/monitoringClients";
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
    const staticClientDataList = ref<MonitoringStaticClientData>();
    const monitoringDataTable = ref<MonitoringRow[]>([]);
    const monitoringData = ref<Map<number, MonitoringRow>>(new Map());

    //table - pagination, item size, search
    const isLoading = ref<boolean>(true);
    const totalItems = ref<number>(10);

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
        {title: translate("monitoringClients.main.tableHeaderStatus"), key: "status", sortable: true}
    ]);  


    //=========events & watchers================
    onMounted(async () => {
        await initalize();  
    });

    onBeforeUnmount(() => {
        stopIntervalRefresh();
    });

    onUpdated(() => {
        console.log("dom got updated")
    })

    function updateTableData(){
        monitoringDataTable.value = Array.from(monitoringData.value, ([key, value]) => ({
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
        if(connections.value?.monitoringConnectionData.cons.length! > monitoringData.value.size){
            // await addNewClients();
            addNewClients();
        }

        if(connections.value?.monitoringConnectionData.cons.length! < monitoringData.value.size){
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
        const fullPageResponse: MonitoringConnections | null = await monitoringViewService.getConnections(
            examId, 
            {   
                [MonitoringHeaderEnum.SHOW_ALL]: route.query[MonitoringHeaderEnum.SHOW_ALL] || [],
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
        const staticClientDataResponse: MonitoringStaticClientData | null = await monitoringViewService.getStaticClientData(examId, generalUtils.createStringIdList(modelIds));
        if(staticClientDataResponse == null){
            return;
        }

        staticClientDataList.value = staticClientDataResponse;
    }

    async function getStaticClientData(modelIds: number[]): Promise<MonitoringStaticClientData | null>{
        return await monitoringViewService.getStaticClientData(examId, generalUtils.createStringIdList(modelIds));
    }



    //==============data update=================
    async function updateConnections(){
        if(connections.value == null || staticClientDataList.value == null){
            return;
        }

        const idsToUpdateMap = new Map<number, number>();

        connections.value.monitoringConnectionData.cons.forEach((dynamicData, index) => {

            const monitoringRowData: MonitoringRow | undefined = monitoringData.value.get(dynamicData.id);

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
                monitoringData.value.set(
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
        if(connections.value == null || staticClientDataList.value == null){
            return;
        }

        const fullPageDataConnections: MonitoringClientConnection[] = connections.value.monitoringConnectionData.cons;

        const newIdsMap = new Map<number, number>();
        fullPageDataConnections.forEach((connection, index) => {
            if (!monitoringData.value.has(connection.id)) {
                newIdsMap.set(connection.id, index);
            }
        });

        // await addFreshData(newIdsMap);
        addFreshData(newIdsMap);

        updateTableData();
    }

    function removeClients(){
        if(connections.value == null || staticClientDataList.value == null){
            return;
        }

        const dynamicDataSet: Set<number> = new Set(connections.value.monitoringConnectionData.cons.map(connection => connection.id));

        //check current data contains fresh data
        for (const key of monitoringData.value.keys()) {
            if (!dynamicDataSet.has(key)) {
                monitoringData.value.delete(key);
            }
        }

        updateTableData();
    }


    //=================data preparing===================
    function initalizeTableData(){
        if(connections.value == null || staticClientDataList.value == null){
            return;
        }

        const staticDataMap: Map<number, StaticClientConnectionData> = new Map(
            staticClientDataList.value.staticClientConnectionData.map(data => [data.id, data])
        );

        connections.value.monitoringConnectionData.cons.forEach((dynamicData, index) => {

            const staticClientData: StaticClientConnectionData | undefined = staticDataMap.get(dynamicData.id);

            if(staticClientData != null){
                const monitoringRow: MonitoringRow = createMonitoringRowData(dynamicData, staticClientData);
                monitoringData.value.set(monitoringRow.id, monitoringRow);
            }
            
        });

        updateTableData();
    }

    function createMonitoringRowData(fullPageDataConnection: MonitoringClientConnection, staticClientData: StaticClientConnectionData): MonitoringRow{
        return {
            id: fullPageDataConnection.id,
            connectionToken: staticClientData.conectionToken,
            nameOrSession: staticClientData.examUserSessionId,
            clientGroups: extractClientGroupNames(staticClientData.cg),
            connectionInfo: staticClientData.seb_info,
            status: fullPageDataConnection.st,
            indicators: extractIndicators(fullPageDataConnection.iv),
        }
    }

    function extractClientGroupNames(clientGroupIds: number[]): ClientGroup[]{
        const clientGroups: ClientGroup[] = [];

        for(let i = 0; i < clientGroupIds.length; i++){
            const clientGroup: ClientGroup | undefined = monitoringStore.clientGroups?.content.find(clientGroup => clientGroup.id == clientGroupIds[i]);

            if(clientGroup != null){
                clientGroups.push(clientGroup);
            }
        }

        return clientGroups;
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
            clientsTableHeaders.value.push(
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
            console.log("before call")
            const start = performance.now();

            await getAndSetConnections();

            console.log("after call")
            const end = performance.now();
            console.log(`Execution time: ${(end - start)/1000} ms`);

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