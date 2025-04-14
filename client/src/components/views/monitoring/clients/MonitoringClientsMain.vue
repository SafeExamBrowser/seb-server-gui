<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-8">

                total items: {{ monitoringData.length }}

                <v-data-table
                    hide-default-footer
                    item-value="id" 
                    :hover="true"
                    :items="monitoringData"
                    :items-length="monitoringData.length"
                    :items-per-page="monitoringData.length"
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

    const monitoringData = ref<MonitoringRow[]>([]);

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
        if(fullPageData.value?.monitoringConnectionData.cons.length != monitoringData.value.length){
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
        // const staticDataConnections: StaticClientConnectionData[] = staticClientDataList.value.staticClientConnectionData;

        for(let i = 0; i < monitoringData.value.length; i++){
            if(monitoringData.value[i].id == fullPageDataConnections[i].id){

                if(fullPageDataConnections[i].st != monitoringData.value[i].status){

                    const newStaticClientDataObject: MonitoringStaticClientData | null = await getStaticClientData([monitoringData.value[i].id]);
                    if(newStaticClientDataObject != null){

                        const newStaticClientData = newStaticClientDataObject.staticClientConnectionData.find(staticClientData => staticClientData.id == monitoringData.value[i].id)
                        if(newStaticClientData != null){

                            console.log("it got here full update")

                            monitoringData.value[i] = createMonitoringRowData(fullPageDataConnections[i], newStaticClientData);
                        }

                    }

                }else{
                    //update indicator only
                    //todo: change ping to generic array
                    updateIndicator(monitoringData.value[i].ping, fullPageDataConnections[i].iv);
                }

            }

        }
    }

    async function addNewClients(){
        if(fullPageData.value == null || staticClientDataList.value == null){
            return;
        }

        const fullPageDataConnections: MonitoringClientConnection[] = fullPageData.value.monitoringConnectionData.cons;

        console.log("start monitoringData.value: " + monitoringData.value.length)
        console.log("end length dynamic data: " + fullPageDataConnections.length)

        const monitoringDataLocal: MonitoringRow[] = [];

        for(let i = monitoringData.value.length; i < fullPageDataConnections.length; i++){

            const newStaticClientDataObject: MonitoringStaticClientData | null = await getStaticClientData([fullPageDataConnections[i].id]);
            if(newStaticClientDataObject != null){
                
                const newStaticClientData = newStaticClientDataObject.staticClientConnectionData.find(staticClientData => staticClientData.id == fullPageDataConnections[i].id)
                if(newStaticClientData != null){

                    console.log("it got here length update")

                    monitoringDataLocal.push(
                        createMonitoringRowData(
                            fullPageDataConnections[i], 
                            newStaticClientData
                        )
                    );
                }
            }
        }

        monitoringData.value = monitoringData.value.concat(monitoringDataLocal);

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
        // for(let i = 0; i < 1; i++){

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
                monitoringData.value.push(monitoringRow);
            }
            
        }
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