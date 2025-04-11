<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-8">

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


    //table
    const isOnLoad = ref<boolean>(true);
    const defaultSort: {key: string, order: string}[] = [{key: 'quizStartTime', order: 'desc'}];
    const clientsTableHeadersRef = ref<any[]>();
    const clientsTableHeaders = ref([
        {title: translate("monitoringClients.main.tableHeaderNameSession"), key: "nameOrSession", width: "30%"},
        {title: translate("monitoringClients.main.tableHeaderClientGroups"), key: "clientGroups", width: "20%"},
        {title: translate("monitoringClients.main.tableHeaderConnectionInfo"), key: "connectionInfo", width: "20%"},
        {title: translate("monitoringClients.main.tableHeaderStatus"), key: "status", sortable: false, width: "12.5%"},
        {title: translate("monitoringClients.main.tableHeaderPing"), key: "ping.indicatorValue", sortable: false, width: "12.5%"},
    ]);  


    onMounted(async () => {
        await initalize();
    });


    async function initalize(){
        await getFullPageData();
        await getStaticClientData(getAllConnectionIds());


        initalizeTableData();

        // console.log(fullPageData.value)
        // console.log(staticClientDataList.value)
    }

    async function getFullPageData(){
        const fullPageResponse: MonitoringFullPageData | null = await monitoringViewService.getFullPage(examId)
        if(fullPageResponse == null){
            return;
        }

        fullPageData.value = fullPageResponse;
    }

    async function getStaticClientData(modelIds: number[]){
        const staticClientDataResponse: MonitoringStaticClientData | null = await monitoringViewService.getStaticClientData(examId, generalUtils.createStringIdList(modelIds));
        if(staticClientDataResponse == null){
            return;
        }

        staticClientDataList.value = staticClientDataResponse;
    }

    function getAllConnectionIds(): number[]{
        if(fullPageData.value == null){
            return [];
        }

        return fullPageData.value.monitoringConnectionData.cons.map(
            (cons: { id: number}) => cons.id
        );
    }

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
                staticClientData = staticDataConnections[i];

            //get static data by id   
            }else{

                const staticClientDataLocal: StaticClientConnectionData | undefined = staticDataConnections.find(staticClientData => staticClientData.id == fullPageDataConnections[i].id);
                
                if(staticClientDataLocal != null){
                    staticClientData = staticClientDataLocal;
                }

            }

            // nameOrSession: string;
            // clientGroups: string[];
            // connectionInfo: string;
            // status: string;
            // ping: number;

            const indicatorsFullList: IndicatorObject[] = extractIndicators(fullPageDataConnections[i].iv);
            const pingObject = indicatorsFullList.find(indicatorObject => indicatorObject.indicatorType = IndicatorEnum.LAST_PING);


            if(staticClientData != null){
                const monitoringRow: MonitoringRow = {
                    nameOrSession: staticClientData.examUserSessionId,
                    clientGroups: extractClientGroupNames(staticClientData.cg),
                    connectionInfo: staticClientData.seb_info,
                    status: fullPageDataConnections[i].st,
                    ping: pingObject || ""
                }

                monitoringData.value.push(monitoringRow);
            }

           
        }

        // console.log(monitoringData.value);

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



    //=======================data fetching===================
    async function loadFullPage(){
        isLoading.value = true;

        //current solution to default sort the table
        //sort-by in data-table-server tag breaks the sorting as the headers are in a seperate component
        // if(isOnLoad.value){
        //     serverTablePaging.sortBy = defaultSort;
        // }


        const fullPageResponse: MonitoringFullPageData | null = await monitoringViewService.getFullPage(examId)

        if(fullPageResponse == null){
            isLoading.value = false;
            return;
        }

        fullPageData.value = fullPageResponse;
        totalItems.value = fullPageData?.value.monitoringConnectionData.cons.length;

        isOnLoad.value = false;
        isLoading.value = false;
    }




    







</script>

<style scoped>

</style>