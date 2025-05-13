<template>
    <v-row v-if="isInfoExpanded">
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pl-4 pt-3 pr-4">
                
                <!------------title row------------->
                <v-row> 
                    <v-col cols="4" class="primary-text-color text-h5 font-weight-bold">
                        {{monitoringStore.selectedExam?.quizName}}
                    </v-col>

                    <v-spacer></v-spacer>
                    <v-col cols="4">
                        <span class="primary-text-color text-h6 font-weight-bold">Filters</span>
                        <v-chip 
                            v-if="!monitoringStore.isNoFilterSelected"
                            class="ml-4"
                            size="small" 
                            variant="tonal"
                            append-icon="mdi-close"
                            @click="monitoringViewService.applyShowAllFilter()">
                            Clear All
                        </v-chip>
                    </v-col>
                    <v-spacer></v-spacer>

                    <v-col cols="3" class="primary-text-color text-h6 font-weight-bold">
                        Actions
                    </v-col>
                
                </v-row>

                <!------------search, filters and action buttons------------->
                <v-row>

                    <!------------search------------->
                    <v-col cols="4">
                        <v-form
                            @keyup.enter="loadmonitoringListItemsCaller()"
                            @keyup.esc="clearForm()">

                            <!------------field------------->
                            <v-row align="center"> 
                                <!-- <v-col>
                                    {{translate("monitoringExams.info.search")}}
                                </v-col> -->
                                <v-col>
                                    <v-text-field
                                        single-line
                                        hide-details
                                        v-model="monitoringStore.searchField"
                                        type="text"
                                        append-inner-icon="mdi-magnify"
                                        density="compact"
                                        placeholder="Search Clients"
                                        variant="outlined">
                                    </v-text-field>
                                </v-col>
                            </v-row>

                            <!------------Buttons------------->
                            <v-row>
                                <v-col align="right">
                                    <v-btn 
                                        rounded="sm" 
                                        color="black" 
                                        variant="outlined"
                                        size="small"
                                        @click="clearForm()">
                                        {{translate("general.cancelButton")}}
                                    </v-btn>

                                    <v-btn 
                                        rounded="sm" 
                                        color="primary" 
                                        variant="flat" 
                                        size="small"
                                        class="ml-2"
                                        @click="loadmonitoringListItemsCaller()">
                                        {{translate("general.searchButton")}}
                                    </v-btn>

                                    <!-- <v-btn 
                                        rounded="sm" 
                                        color="secondary" 
                                        variant="flat" 
                                        size="small"
                                        class="ml-2"
                                        @click="monitoringViewService.applyShowAllFilter()">
                                        Show All
                                    </v-btn> -->

                                </v-col>
                            </v-row>
                        </v-form>

                    </v-col>

                    <!------------filters------------->
                    <v-spacer></v-spacer>
                    <v-col cols="4">
                        <v-card 
                            variant="flat"
                            class="rounded-lg">

                            <v-row>

                                <!------------group filters------------->
                                <v-col v-if="monitoringStore.monitoringOverviewData?.clientGroups.length != 0">
                                    <div class="primary-text-color text-subtitle-1">
                                        Groups
                                    </div>
    
                                    <div v-for="clientGroup in monitoringStore.monitoringOverviewData?.clientGroups" :key="clientGroup.id">
                                        <v-chip 
                                            size="small" 
                                            class="mr-2 mt-2"
                                            :variant="isFilterSelected(MonitoringHeaderEnum.SHOW_CLIENT_GROUPS, clientGroup.id.toString()) ? 'flat' : 'tonal'"
                                            @click="monitoringViewService.applyFilter(
                                                getCurrentRouteQueries(),
                                                MonitoringHeaderEnum.SHOW_CLIENT_GROUPS,
                                                clientGroup.id.toString())">
                                            {{clientGroup.name}}
                                        </v-chip>
                                    </div>
                                </v-col>
    
                                <!------------client states filters------------->
                                <v-col v-if="monitoringStore.monitoringOverviewData?.clientStates.total != 0">
                                    <div class="primary-text-color text-subtitle-1">
                                        Client States
                                    </div>
    
                                    <template v-for="(value, key) in monitoringStore.monitoringOverviewData?.clientStates" :key="key">
                                        <v-chip 
                                            v-if="key != 'total' && value != 0"
                                            size="small" 
                                            class="mr-2 mt-2"
                                            :variant="isFilterSelected(MonitoringHeaderEnum.SHOW_STATES, key) ? 'flat' : 'tonal'"
                                            @click="monitoringViewService.applyFilter(
                                                getCurrentRouteQueries(),
                                                MonitoringHeaderEnum.SHOW_STATES,
                                                key)">
                                            {{translate(key)}}
                                        </v-chip>
                                    </template>
                                </v-col>
    
                                <!------------notification filters------------->
                                <v-col v-if="monitoringStore.monitoringOverviewData?.notifications.total != 0">
                                    <div class="primary-text-color text-subtitle-1">
                                        Notifications
                                    </div>
    
                                    <template v-for="(value, key) in monitoringStore.monitoringOverviewData?.notifications" :key="key">
                                        <v-chip 
                                            v-if="key != 'total' && value != 0"
                                            size="small" 
                                            class="mr-2 mt-2"
                                            :variant="isFilterSelected(MonitoringHeaderEnum.SHOW_NOTIFCATION, key) ? 'flat' : 'tonal'"
                                            @click="monitoringViewService.applyFilter(
                                                getCurrentRouteQueries(),
                                                MonitoringHeaderEnum.SHOW_NOTIFCATION,
                                                key)">
                                            {{translate(key)}}
                                        </v-chip>
                                    </template>
                                </v-col>
    
                                <!------------indicators filters------------->
                                <v-col v-if="monitoringStore.monitoringOverviewData?.indicators.total != 0">
                                    <div class="primary-text-color text-subtitle-1">
                                        Indicators
                                    </div>
    
                                    <template v-for="(value, key) in monitoringStore.monitoringOverviewData?.indicators" :key="key">
                                        <v-chip 
                                            v-if="key != 'total' && value != 0"
                                            size="small" 
                                            class="mr-2 mt-2"
                                            :variant="isFilterSelected(MonitoringHeaderEnum.SHOW_INDICATORS, key) ? 'flat' : 'tonal'"
                                            @click="monitoringViewService.applyFilter(
                                                getCurrentRouteQueries(),
                                                MonitoringHeaderEnum.SHOW_INDICATORS,
                                                key)">
                                            {{translate(key)}}
                                        </v-chip>
                                    </template>
                                </v-col>

                                <!-- <v-col v-if="!monitoringStore.isNoFilterSelected">
                                    <div v-show="false" class="primary-text-color text-subtitle-1">
                                        placeholder
                                    </div>
                                    <v-chip 
                                        class="mt-2"
                                        size="small" 
                                        variant="tonal"
                                        append-icon="mdi-close"
                                        @click="monitoringViewService.applyShowAllFilter()">
                                        Clear All
                                    </v-chip>
                                </v-col> -->
                            </v-row>

                        </v-card>
                    </v-col>
                    <v-spacer></v-spacer>

                    <!------------action buttons------------->
                    <v-col cols="3">
                        <v-card
                            variant="flat"
                            class="rounded-lg"
                            height="100%">

                            <div>
                                <v-btn 
                                    class="mt-2"
                                    rounded="sm" 
                                    color="primary" 
                                    variant="flat"
                                    size="small"
                                    @click="">
                                    Quit selected clients
                                </v-btn>
                            </div>

                            <div>
                                <v-btn 
                                    class="mt-2"
                                    rounded="sm" 
                                    color="primary" 
                                    variant="flat"
                                    size="small"
                                    @click="registerInstruction()">
                                    Lock selected clients
                                </v-btn>
                            </div>
                        </v-card>
                    </v-col>

                </v-row>

                <!------------navigation row------------->
                <v-row>
                    <!------------back button------------->
                    <v-col class="d-flex flex-column">
                        <div class="d-flex justify-start mt-auto">
                            <v-icon 
                                variant="flat" 
                                icon="mdi-arrow-left"
                                @click="navigateTo(constants.MONITORING_OVERVIEW_ROUTE + '/' + examId)">
                            </v-icon>
                        </div>
                    </v-col>

                    <!------------collapse button------------->
                    <v-col class="d-flex flex-column">
                        <div class="d-flex justify-end mt-auto">
                            <v-icon 
                                variant="flat" 
                                icon="mdi-chevron-up"
                                @click="isInfoExpanded = !isInfoExpanded">
                            </v-icon>
                        </div>
                    </v-col>
                </v-row>

            </v-sheet>
        </v-col>
    </v-row>

    <!------------collapsed info panel------------->
    <v-row v-else>
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pl-4 pt-3 pr-4">
                <v-row>
                    <v-col>
                        <div class="primary-text-color text-h5 font-weight-bold">
                            {{monitoringStore.selectedExam?.quizName}}
                        </div>
                    </v-col>
                    <v-col class="d-flex flex-column">
                        <div class="d-flex justify-end mt-auto">
                            <v-icon 
                                variant="flat" 
                                icon="mdi-chevron-down"
                                @click="isInfoExpanded = !isInfoExpanded">
                            </v-icon>
                        </div>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import {useMonitoringStore} from "@/stores/seb-server/monitoringStore";
    import {translate} from "@/utils/generalUtils";
    import { useI18n } from "vue-i18n";
    import { storeToRefs } from "pinia";
    import * as generalUtils from "@/utils/generalUtils";
    import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";
    import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
    import { LocationQuery } from "vue-router";
    import {navigateTo} from "@/router/navigation";
    import * as constants from "@/utils/constants";
    import { InstructionEnum } from "@/models/instructionEnum";
    
    //i18n
    const i18n = useI18n();

    //info panel (whole component)
    const isInfoExpanded = ref<boolean>(true);

    //router
    const route = useRoute();

    //stores
    const monitoringStore = useMonitoringStore();
    const monitoringStoreRef = storeToRefs(monitoringStore);

    //exam
    const examId = useRoute().params.examId.toString();

    //datepicker
    const datepicker = ref();

    //emits - call loadmonitoringListItemsCaller in parent
    const emit = defineEmits<{
        loadmonitoringListItemsCaller: any;
    }>();


    function loadmonitoringListItemsCaller(){ 
        if(datepicker != null && datepicker.value != null){
            monitoringStore.startDate = datepicker.value.getTime();
        }

        emit("loadmonitoringListItemsCaller");
    }

    function clearForm(){
        monitoringStore.searchField = "";

        datepicker.value = null;
        monitoringStore.startDate = null;
        
        loadmonitoringListItemsCaller();
    }

    //=================filters===================
    function getCurrentRouteQueries(): LocationQuery{
        return route.query;
    }

    function isFilterSelected(filterType: MonitoringHeaderEnum, filterValue: string): boolean{
        if(route.query[filterType]?.includes(filterValue)){
            return true;
        }

        return false;
    }


    //=================client instructions===================
    async function registerInstruction(){





        const clientInstruction: ClientInstruction = {
            examId: parseInt(examId),
            connectionToken: generalUtils.createStringIdList([
                "7ebfc95f-517b-4500-8e9c-5f099d447469", 
                "bf5d46c8-68f0-46a2-b62f-de4f352a15f5", 
                "da4f6c87-6c90-4fba-b09f-3c0ee706f184"
            ]),
            type: InstructionEnum.SEB_QUIT,
            attributes: {
                "message": "test 1234"
            }
        }

        console.log(await monitoringViewService.registerInstruction(examId, clientInstruction));

    }



</script>

<style scoped>


</style>