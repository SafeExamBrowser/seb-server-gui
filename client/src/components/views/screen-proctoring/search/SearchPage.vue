<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg"
                title="Search">

                <SearchForm 
                    @searchSessions="searchSessions"
                    @closeAllPanels="closeAllPanels"
                >
                </SearchForm>
                
            </v-sheet>
        </v-col>
    </v-row>

    <v-row v-if="searchResultAvailable">
        <v-col v-if="noResutsFound">
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-4"
                title="No results match your search criteria">
                <v-row>
                    <v-col align="left" class="text-h6">
                        No results match your search criteria
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
        
        <v-col v-else>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-4"
                :title="$t('searchPage.title')">

                    <!------------title and buttons------------->
                    <v-row>
                        <v-col align="left">
                            <h2 class="title-inherit-styling text-h6">{{ $t('searchPage.title') }}</h2>
                        </v-col>

                        <v-col align="right" class="mb-2">
                            <v-btn
                                class="mr-2"
                                variant="text"
                                :ripple="false"
                                @click="changeSortOrder()">
                                Date
                                <template v-slot:prepend>
                                    <v-icon size="x-large" :icon="isSearchDescending ? 'mdi-chevron-down' : 'mdi-chevron-up'"></v-icon>
                                </template>
                            </v-btn>
                            <v-btn
                                class="mr-2"
                                variant="text"
                                :color="closeAllPanelsDisabled ? 'grey' : 'black'"
                                :ripple="false"
                                @click="closeAllPanels()">
                                {{ $t('searchPage.collapse') }}
                                <template v-slot:prepend>
                                    <v-icon size="x-large" icon="mdi-unfold-less-horizontal"></v-icon>
                                </template>
                            </v-btn>
                        </v-col>
                    </v-row>
                    <!----------------------------------->

                    <v-expansion-panels v-model="sessionPanels" multiple>
                        <v-expansion-panel
                            v-for="day in sessionsDays"
                            :key="day"
                            :value="'sessionPanel' + day">

                            <v-expansion-panel-title class="font-weight-bold">
                                {{ timeUtils.formatSqlDateToString(day) }}
                            </v-expansion-panel-title>
                            
                            <v-expansion-panel-text>
                                <SearchSessionTable 
                                    :day="day"
                                    :search-parameters="searchParameters!">
                                </SearchSessionTable>
                            </v-expansion-panel-text>

                        </v-expansion-panel>
                    </v-expansion-panels>

            </v-sheet>
        </v-col>
    </v-row>
            
    <AlertMsg 
        v-if="loadingStore.isTimeout"
        :alertProps="{
            title: 'title',
            color: 'error',
            type: 'snackbar',
            textKey: 'timeout-error'
        }">
    </AlertMsg>
</template>

<script setup lang="ts">
    import { ref, onBeforeMount, watch } from "vue";
    import { useAppBarStore, useTableStore, useLoadingStore } from "@/stores/store";
    import * as searchViewService from "@/services/screen-proctoring/component-services/searchViewService";
    import SearchForm from "./SearchForm.vue";
    import SearchSessionTable from "./SearchSessionTable.vue";
    import * as groupingUtils from "@/utils/groupingUtils";
    import * as timeUtils from "@/utils/timeUtils";

    //error handling
    const searchResultAvailable = ref<boolean>(false);
    const noResutsFound = ref<boolean>(false);
    const errorAvailable = ref<boolean>();

    //main data
    const sessionsDays = ref<string[]>([]);

    //ui control
    const isSearchDescending = ref<boolean>(true);
    const sessionPanels = ref<string[]>([]);
    const closeAllPanelsDisabled = ref<boolean>(true);

    //store
    const appBarStore = useAppBarStore();
    const tableStore = useTableStore();
    const loadingStore = useLoadingStore();

    //form data
    const searchParameters = ref<OptionalParSearchSessions>();
    let examNameSearch: string | null;
    let groupNameSearch: string | null;

    let metadataSearchApplication: string | null;
    let metadataSearchBrowserTitle: string | null;
    let metadataSearchActivityDetails: string | null;
    let metadataSearchWindowTitle: string | null;

    let loginNameSearch: string | null;
    let ipAddressSearch: string | null;
    let machineNameSearch: string | null;


    onBeforeMount(async () => {
        appBarStore.title = "Search"
    });

    watch(sessionPanels, () => {
        if(sessionPanels.value.length == 0){
            closeAllPanelsDisabled.value = true;
            return;
        }

        closeAllPanelsDisabled.value = false;
    });

    async function searchSessions(
        examName: string,
        groupName: string, 
        loginName: string, 
        ipAddress: string,
        machineName: string, 

        metadataApplication: string,
        metadataBrowserTitle: string,
        metadataActivityDetails: string,
        metadataWindowTitle: string,

        fromTime: string, 
        toTime: string,
        pageNumber: number
    ){
        errorAvailable.value = false;
        noResutsFound.value = false;

        examNameSearch = examName == "" ? null : examName;
        groupNameSearch = groupName == "" ? null : groupName;

        metadataSearchApplication = metadataApplication == "" ? null : metadataApplication;
        metadataSearchBrowserTitle = metadataBrowserTitle == "" ? null : metadataBrowserTitle;
        metadataSearchActivityDetails = metadataActivityDetails == "" ? null : metadataActivityDetails;
        metadataSearchWindowTitle = metadataWindowTitle == "" ? null : metadataWindowTitle;

        loginNameSearch = loginName == "" ? null : loginName;
        ipAddressSearch = ipAddress == "" ? null : ipAddress;
        machineNameSearch = machineName == "" ? null : machineName;

        searchParameters.value = {   
            examName: examNameSearch,
            groupName: groupNameSearch,
            clientName: loginNameSearch,
            clientIp: ipAddressSearch,
            clientMachineName: machineNameSearch,

            screenProctoringMetadataApplication: metadataSearchApplication,
            screenProctoringMetadataBrowser: metadataSearchBrowserTitle,
            screenProctoringMetadataUserAction: metadataSearchActivityDetails,
            screenProctoringMetadataWindowTitle: metadataSearchWindowTitle,

            fromTime: fromTime, 
            toTime: toTime,
            pageSize: 500,
            pageNumber: pageNumber
        }

        const sessionSearchResponse: string[] | null = await searchViewService.searchSessionsDay(searchParameters.value);
        
        if(sessionSearchResponse == null){
            errorAvailable.value = true;
            return;
        }

        sessionsDays.value = sessionSearchResponse;

        if(sessionsDays.value.length == 0){
            noResutsFound.value = true;
            searchResultAvailable.value = true;
            return;
        }

        loginNameIpToggleListFillUp();
    
        searchResultAvailable.value = true;
        isSearchDescending.value = true;
    }

    function loginNameIpToggleListFillUp(){
        if(sessionsDays.value == null){
            return;
        }

        for(var i = 0; i < sessionsDays.value.length; i++){
            tableStore.isIpDisplayList.push(
                {
                    day: sessionsDays.value[i],
                    isIp: false
                }
            );
        }
    }

    function changeSortOrder(){
        isSearchDescending.value = !isSearchDescending.value;
        sessionsDays.value.reverse();
    }

    function closeAllPanels(){
        sessionPanels.value = [];
    }

</script>