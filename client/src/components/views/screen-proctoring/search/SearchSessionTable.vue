<template>
    <v-data-table-server
        show-expand
        :show-select="isUserAdmin"
        v-model="selectedSessionUuids"
        select-strategy="page"
        item-value="sessionUUID" 
        class="elevation-1"
        @update:options="loadItems"
        :loading="isLoading"
        loading-text="Loading... Please wait"
        :items="sessions?.content"
        :items-length="totalItems"
        :items-per-page="tableUtils.calcDefaultItemsPerPage(totalItems)"
        :items-per-page-options="tableUtils.calcItemsPerPage(totalItems)"
        :headers="sessionTableHeaders">

        <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort, selectAll, allSelected, someSelected }">
            <TableHeaders
                v-if="isUserAdmin"
                :columns="columns"
                :is-sorted="isSorted"
                :get-sort-icon="getSortIcon"
                :toggle-sort="toggleSort"
                :header-refs-prop="sessionTableHeadersRef"
                :day="props.day"
                :selectAll="selectAll"
                :allSelected="allSelected"
                :someSelected="someSelected"
                tableKey="session"
                @openDeleteSessionsDialog="openDeleteSessionsDialog">
            </TableHeaders>
            <TableHeaders
                v-else
                :columns="columns"
                :is-sorted="isSorted"
                :get-sort-icon="getSortIcon"
                :toggle-sort="toggleSort"
                :header-refs-prop="sessionTableHeadersRef"
                :day="props.day">
            </TableHeaders>
        </template>

        <template v-slot:item.startTime="{item}">
            <td>
                <div>
                    {{timeUtils.formatTimestampToTime(item.startTime)}}
                </div>
            </td>
        </template>

        <template v-slot:item.clientName="{item, index}">
            <td>
                <div>
                    <template v-if="!tableStore.isIpDisplayList[tableUtils.getSessionListIndex(props.day)].isIp">
                        {{ item.clientName }}
                    </template>
                    <template v-else>
                        {{ item.clientIp }}
                    </template>
                </div>
            </td>
        </template>

        <template v-slot:item.proctoringViewLink="{item}">
            <v-btn @click="searchViewService.openProctoringView(item.sessionUUID)" variant="text" icon="mdi-video"></v-btn>
        </template>

        <template v-slot:item.data-table-expand="{internalItem, isExpanded, toggleExpand}">
            <v-btn 
                tabindex="0" 
                variant="text" 
                @keydown.native.enter="searchTimeline(internalItem, isExpanded, toggleExpand)"
                @keydown.native.space="searchTimeline(internalItem, isExpanded, toggleExpand)"
                @click="searchTimeline(internalItem, isExpanded, toggleExpand)"
                :icon="isExpanded(internalItem) ? 'mdi-chevron-up' : 'mdi-chevron-down'" >
            </v-btn>
        </template>

        <template v-slot:expanded-row="{ columns, item }">
            <tr>
                <td :colspan="columns.length">
                    <SearchScreenshotsTable :timelineSearchResult="timelineSearchResults.find(i => i.sessionUUID == item.sessionUUID)"></SearchScreenshotsTable>
                </td>
            </tr>
        </template>

    </v-data-table-server>

    <!-----------delete sessions confirmation---------->      
    <v-dialog 
        v-if="isUserAdmin"
        v-model="dialog" 
        max-width="400"
    >
        <v-sheet elevation="2" class="pa-4 rounded-lg">

            <v-row justify="end">
                <v-col>
                    <div class="text-h6">
                        Delete selected sessions
                    </div>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-list>
                        <v-list-item v-for="sessionUuid in selectedSessionUuids"
                            :title="sessions?.content.find(i => i.sessionUUID == sessionUuid)?.clientName"
                            :subtitle="timeUtils.formatTimestampToTime(sessions?.content.find(i => i.sessionUUID == sessionUuid)?.startTime!)"
                            >
                        </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
            
            
            <v-row>
                <v-col align="right">
                    <v-btn 
                        rounded="sm" 
                        color="black" 
                        variant="outlined"
                        @click="closeDialog()">
                        Cancel
                    </v-btn>

                    <v-btn 
                        rounded="sm" 
                        color="error" 
                        variant="flat" 
                        class="ml-2"
                        @click="deleteSessions()">
                        Delete
                    </v-btn>
                </v-col>
            </v-row>
        </v-sheet>
    </v-dialog>
    <!------------------------------------------------->
</template>


<script setup lang="ts">
    import { ref, onBeforeMount } from "vue";
    import * as timeUtils from "@/utils/timeUtils";
    import * as tableUtils from "@/utils/table/tableUtils";
    import SearchScreenshotsTable from "./SearchScreenshotsTable.vue";
    import * as searchViewService from "@/services/screen-proctoring/component-services/searchViewService";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import { useTableStore, useUserAccountStore } from "@/stores/store";

    //store
    const tableStore = useTableStore();
    const userAccountStore = useUserAccountStore();
    const isUserAdmin = ref<boolean>();

    //props
    const props = defineProps<{
        day: string;
        searchParameters: OptionalParSearchSessions
    }>();

    //items
    const sessions = ref<SearchSessions>();
    const timelineSearchResults = ref<SearchTimeline[]>([]);

    //table - pagination, item size
    const isLoading = ref<boolean>(true);
    const totalItems = ref<number>(10);

    //table
    const selectedSessionUuids = ref<string[]>();
    const isOnLoad = ref<boolean>(true);
    const defaultSort: {key: string, order: string}[] = [{key: 'startTime', order: 'desc'}];
    const sessionTableHeadersRef = ref<any[]>();
    const sessionTableHeaders = ref([
        {title: "Start-Time", key: "startTime", width: "10%"},
        {title: "Login Name / IP", key: "clientName", width: "30%"},
        {title: "Machine Name", key: "clientMachineName", width: "20%"},
        {title: "Group Name", key: "groupName", width: "20%"},
        {title: "Exam Name", key: "exam.name", width: "20%"},
        {title: "Slides", key: "nrOfScreenshots"},
        {title: "Video", key: "proctoringViewLink", sortable: false}
    ]);           
    
    //dialog - delete sessions
    const dialog = ref(false);

    //error handling
    const errorAvailable = ref<boolean>();


    //===========================data fetching=======================
    async function loadItems(serverTablePaging: ServerTablePaging){
        isUserAdmin.value = userAccountStore.userAccount?.roles.includes('ADMIN');
        isLoading.value = true;
        //current solution to default sort the table
        //sort-by in data-table-server tag breaks the sorting as the headers are in a seperate component
        if(isOnLoad.value){
            serverTablePaging.sortBy = defaultSort;
        }

        let searchParameters: OptionalParSearchSessions = searchViewService.prepareSessionSearchParameters(props.day, props.searchParameters, serverTablePaging);

        const sessionSearchResponse: SearchSessions | null = await searchViewService.searchSessions(searchParameters);
        if(sessionSearchResponse == null){
            isLoading.value = false;
            return;
        }

        sessions.value = sessionSearchResponse;
        totalItems.value = sessionSearchResponse.numberOfPages * sessionSearchResponse.pageSize

        isOnLoad.value = false;
        isLoading.value = false;
    }


    async function searchTimeline(item: any, isExpanded: Function, toggleExpand: Function){
        if(removeTableItemFromRefs(item, isExpanded, toggleExpand)){
            return;
        }

        const timelineSearchResponse: SearchTimeline | null = await searchViewService.searchTimeline(
            item.raw.sessionUUID, 
            {   
                screenProctoringMetadataApplication: props.searchParameters.screenProctoringMetadataApplication,
                screenProctoringMetadataBrowser: props.searchParameters.screenProctoringMetadataBrowser,
                screenProctoringMetadataUserAction: props.searchParameters.screenProctoringMetadataUserAction,
                screenProctoringMetadataWindowTitle: props.searchParameters.screenProctoringMetadataWindowTitle
            });

        if(timelineSearchResponse == null){
            return;
        }

        addTableItemToRefs(timelineSearchResponse, toggleExpand, item);
    }
    //===============================================================


    //===========================session deletion=======================
    function openDeleteSessionsDialog(){
        openDialog();
    }

    async function deleteSessions(){
        errorAvailable.value = false;
        if(selectedSessionUuids.value == null){
            return;
        }

        const response = await searchViewService.deleteSessions(selectedSessionUuids.value);
        if(response.data == null || response.status == 207){
            errorAvailable.value = true;
            return;
        }

        for(let i = 0; i < selectedSessionUuids.value.length; i++){
            const index: number | any = sessions.value?.content.findIndex(y => y.sessionUUID == selectedSessionUuids.value![i]);
            sessions.value?.content.splice(index, 1);
        }

        selectedSessionUuids.value = [];
        closeDialog();
    }



    function openDialog(){
        dialog.value = true;
    }

    function closeDialog(){
        dialog.value = false;
    }
    //===============================================================


    //===========================table=======================
    function addTableItemToRefs(timelineSearchResponse: SearchTimeline, toggleExpand: Function, item: any){
        timelineSearchResults.value.push(timelineSearchResponse);
        toggleExpand(item);
    }


    function removeTableItemFromRefs(item: any, isExpanded: Function, toggleExpand: Function): boolean{
        if(isExpanded(item)){
            toggleExpand(item);
            const index: number = timelineSearchResults.value.findIndex(i => i.sessionUUID == item.sessionUUID);

            if (index !== -1) {
                timelineSearchResults.value.splice(index, 1);
            }
            return true;
        }

        return false;
    }
    //===============================================================


</script>

<style scoped>

</style>