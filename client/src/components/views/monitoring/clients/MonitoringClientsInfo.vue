<template>
    <v-row v-if="isInfoExpanded">
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pl-4 pt-3 pr-4">
                
                <!------------title row------------->
                <v-row> 
                    <v-col cols="4">
                        <div class="primary-text-color text-h5 font-weight-bold">
                            {{monitoringStore.selectedExam?.quizName}}
                        </div>
                    </v-col>

                    <v-col cols="5">
                        <div class="primary-text-color text-h6 font-weight-bold">
                            Filters
                        </div>
                    </v-col>

                    <v-col cols="3">
                        <div class="primary-text-color text-h6 font-weight-bold">
                            Actions
                        </div>
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

                                    <v-btn 
                                        rounded="sm" 
                                        color="secondary" 
                                        variant="flat" 
                                        size="small"
                                        class="ml-2"
                                        @click="monitoringViewService.applyShowAllFilter()">
                                        Show All
                                    </v-btn>

                                </v-col>
                            </v-row>
                        </v-form>

                    </v-col>

                    <!------------filters------------->
                    <v-col cols="5">
                        <v-card 
                            variant="outlined"
                            class="rounded-lg pa-4">

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
                            </v-row>

                        </v-card>
                    </v-col>

                    <!------------action buttons------------->
                    <v-col cols="3">
                        <v-card
                            variant="outlined"
                            class="rounded-lg pa-4"
                            height="100%">

                            <div>
                                <v-btn 
                                    class="mt-2"
                                    rounded="sm" 
                                    color="primary" 
                                    variant="flat"
                                    size="small"
                                    @click="clearForm()">
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
                                    @click="clearForm()">
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
    import {useMonitoringStore} from "@/stores/monitoringStore";
    import {translate} from "@/utils/generalUtils";
    import { useI18n } from "vue-i18n";
    import { storeToRefs } from "pinia";
    import * as generalUtils from "@/utils/generalUtils";
    import { MonitoringHeaderEnum } from "@/models/monitoringEnums";
    import * as monitoringViewService from "@/services/component-services/monitoringViewService";
    import { LocationQuery } from "vue-router";
    import {navigateTo} from "@/router/navigation";
    import * as constants from "@/utils/constants";
    


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

    function getCurrentRouteQueries(): LocationQuery{
        return route.query;
    }

    function isFilterSelected(filterType: MonitoringHeaderEnum, filterValue: string): boolean{
        if(route.query[filterType]?.includes(filterValue)){
            return true;
        }

        return false;
    }



</script>

<style scoped>


</style>