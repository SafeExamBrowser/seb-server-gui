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


                </v-data-table>

                
            </v-sheet>
        </v-col>
    </v-row>
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
    import { IndicatorEnum, IndicatorObject } from "@/models/indicatorEnum";
    import { MonitoringRow } from "@/models/monitoringClients";

    //exam
    const examId = useRoute().params.examId.toString();

    //stores
    const monitoringStore = useMonitoringStore();
    const appBarStore = useAppBarStore();

    //items
    const fullPageData = ref<MonitoringFullPageData>();
    const staticClientDataList = ref<MonitoringStaticClientData>();

    // const monitoringData = ref<MonitoringRow[]>([]);
    const monitoringDataTable = ref<MonitoringRow[]>([]);
    const monitoringData = ref<Map<number, MonitoringRow>>(new Map());


    //table - pagination, item size, search
    const isLoading = ref<boolean>(true);
    const totalItems = ref<number>(10);

    //interval
    let intervalRefresh: any | null = null;
    const REFRESH_INTERVAL: number = 1 * 2000;


    //table
    const isOnLoad = ref<boolean>(true);
    const defaultSort: {key: string, order: string}[] = [{key: 'quizStartTime', order: 'desc'}];
    const clientsTableHeadersRef = ref<any[]>();
    const clientsTableHeaders = ref([
        {title: translate("monitoringClients.main.tableHeaderNameSession"), key: "nameOrSession", width: "30%"},
        {title: translate("monitoringClients.main.tableHeaderClientGroups"), key: "clientGroups", width: "20%"},
        {title: translate("monitoringClients.main.tableHeaderConnectionInfo"), key: "connectionInfo", width: "20%"},
        {title: translate("monitoringClients.main.tableHeaderStatus"), key: "status", width: "12.5%"},
        {title: translate("monitoringClients.main.tableHeaderPing"), key: "ping.indicatorValue", width: "12.5%"},
    ]);  


    //=========events & watchers================
    onMounted(async () => {
        await initalize();  
    });

    onBeforeUnmount(() => {
        stopIntervalRefresh();
    });

    function updateTableData(){
        monitoringDataTable.value = Array.from(monitoringData.value, ([key, value]) => ({
            key,
            ...value
        }));
    }


    async function initalize(){

        const start = performance.now();

        await getAndSetFullPageData();
        await getAndSetStaticClientData(getAllConnectionIds());


        initalizeTableData();

        const end = performance.now();
        console.log(`Execution time: ${(end - start)/1000} ms`);

        startIntervalRefresh();

        

        // console.log(fullPageData.value)
        // console.log(staticClientDataList.value)
    }

    watch(fullPageData, async () => {
        // console.log(fullPageData.value)

        //check if sessions got added / removed
        if(fullPageData.value?.monitoringConnectionData.cons.length != monitoringData.value.entries.length){
            await addNewClients();
        }

        await updateFullPageData();
    });

    //==============data update=================
    async function updateFullPageData(){
        if(fullPageData.value == null || staticClientDataList.value == null){
            return;
        }

        const fullPageDataConnections: MonitoringClientConnection[] = fullPageData.value.monitoringConnectionData.cons;
        const idsToUpdateMap = new Map<number, number>();

        for(let i = 0; i < fullPageDataConnections.length; i++){

            const monitoringRowData: MonitoringRow | undefined = monitoringData.value.get(fullPageDataConnections[i].id);

            if(monitoringRowData != null){
                if(fullPageDataConnections[i].st != monitoringRowData.status){
                    idsToUpdateMap.set(monitoringRowData.id, i);

                }else{
                    //update indicator only
                    //todo: change ping to generic array
                    updateIndicator(monitoringRowData.ping, fullPageDataConnections[i].iv);
                }
            }
        }

        await addFreshData(idsToUpdateMap);
        updateTableData();
    }

    async function addFreshData(ids: Map<number, number>){
        const newStaticClients: MonitoringStaticClientData | null = await getStaticClientData(Array.from(ids.keys()));
        if(newStaticClients == null){
            return;
        }

        newStaticClients?.staticClientConnectionData.forEach((staticData) => {
            const fullPageItemIndex: number | undefined = ids.get(staticData.id);

            if(fullPageItemIndex != null && fullPageData.value != null){
                monitoringData.value.set(
                    staticData.id,
                    createMonitoringRowData(
                        fullPageData.value.monitoringConnectionData.cons[fullPageItemIndex], 
                        staticData
                    )
                );
            }
        });
    }

    async function addNewClients(){
        if(fullPageData.value == null || staticClientDataList.value == null){
            return;
        }

        const fullPageDataConnections: MonitoringClientConnection[] = fullPageData.value.monitoringConnectionData.cons;

        const newIdsMap = new Map<number, number>();
        fullPageDataConnections.forEach((connection, index) => {
            if (!monitoringData.value.has(connection.id)) {
                newIdsMap.set(connection.id, index);
            }
        });

        await addFreshData(newIdsMap);
        updateTableData();
    }

    function removeClients(){

    }

    //currently only ping
    function updateIndicator(pingObject: IndicatorObject | undefined, indicatorSet: Record<string, string>){
        if(pingObject != null && pingObject.indicatorType == IndicatorEnum.LAST_PING){
            pingObject.indicatorValue = parseInt(indicatorSet[pingObject.indicatorObject.id]);
        }
    }
    




    //==============data fetching================
    async function getAndSetFullPageData(){
        const fullPageResponse: MonitoringFullPageData | null = await monitoringViewService.getFullPage(examId)
        if(fullPageResponse == null){
            return;
        }

        fullPageData.value = fullPageResponse;
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



    //=================data preparing===================
    function initalizeTableData(){
        if(fullPageData.value == null || staticClientDataList.value == null){
            return;
        }

        const fullPageDataConnections: MonitoringClientConnection[] = fullPageData.value.monitoringConnectionData.cons;
        const staticDataConnections: StaticClientConnectionData[] = staticClientDataList.value.staticClientConnectionData;

        for(let i = 0; i < fullPageDataConnections.length; i++){

            let staticClientData: StaticClientConnectionData | null = null;

            //check first if static data has the same index
            if(fullPageDataConnections[i].id == staticDataConnections[i].id){
                console.log("by index")
                staticClientData = staticDataConnections[i];

            //get static data by id   
            }else{
                console.log("by id")
                const staticClientDataLocal: StaticClientConnectionData | undefined = staticDataConnections.find(staticClientData => staticClientData.id == fullPageDataConnections[i].id);
                if(staticClientDataLocal != null){
                    staticClientData = staticClientDataLocal;
                }
            }

            if(staticClientData != null){
                const monitoringRow: MonitoringRow = createMonitoringRowData(fullPageDataConnections[i], staticClientData);
                monitoringData.value.set(monitoringRow.id, monitoringRow);
            }
            
        }

        updateTableData();
    }

    function createMonitoringRowData(fullPageDataConnection: MonitoringClientConnection, staticClientData: StaticClientConnectionData): MonitoringRow{

        const indicatorsFullList: IndicatorObject[] = extractIndicators(fullPageDataConnection.iv);
        const pingObject = indicatorsFullList.find(indicatorObject => indicatorObject.indicatorType = IndicatorEnum.LAST_PING);

        return {
            id: fullPageDataConnection.id,
            connectionToken: staticClientData.conectionToken,
            nameOrSession: staticClientData.examUserSessionId,
            clientGroups: extractClientGroupNames(staticClientData.cg),
            connectionInfo: staticClientData.seb_info,
            status: fullPageDataConnection.st,
            ping: pingObject,
        }
    }

    function extractClientGroupNames(clientGroupIds: number[]): string{
        let clientGroupNames: string = "";

        for(let i = 0; i < clientGroupIds.length; i++){
            const clientGroupName: string | undefined = monitoringStore.clientGroups?.content.find(clientGroup => clientGroup.id == clientGroupIds[i])?.name;

            if(clientGroupName != null){
                clientGroupNames += clientGroupName + " ";
            }
        }

        if(clientGroupNames == ""){
            return "";
        }

        return clientGroupNames.substring(0, clientGroupNames.length-1);
    }

    function extractIndicators(indicatorValues: Record<string, string>): IndicatorObject[]{
        const indicatorsFullList: IndicatorObject[] = [];

        for (const [key, value] of Object.entries(indicatorValues)) {

            const indicator: Indicator | undefined = monitoringStore.indicators?.content.find(indicator => indicator.id == parseInt(key));

            if(indicator != null){
                const indicatorFullObject: IndicatorObject = {
                    indicatorType: generalUtils.findEnumValue(IndicatorEnum, indicator.type),
                    indicatorValue: parseInt(value),
                    indicatorObject: indicator
                }

                indicatorsFullList.push(indicatorFullObject);
            }
        }

        return indicatorsFullList;
    }

    function getAllConnectionIds(): number[]{
        if(fullPageData.value == null){
            return [];
        }

        return fullPageData.value.monitoringConnectionData.cons.map(
            (cons: { id: number}) => cons.id
        );
    }

    //=================interval===================
    async function startIntervalRefresh(){
        intervalRefresh = setInterval(async () => {

            await getAndSetFullPageData();

        }, REFRESH_INTERVAL);
    }

    function stopIntervalRefresh(){
        if (intervalRefresh) {
            clearInterval(intervalRefresh);
        }
    }








</script>

<style scoped>

</style>