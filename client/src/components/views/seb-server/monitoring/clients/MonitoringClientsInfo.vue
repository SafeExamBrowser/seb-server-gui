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
                        <span class="primary-text-color text-h6 font-weight-bold"> 
                            {{translate("monitoringClients.info.filters")}}
                        </span>
                        <v-chip 
                            v-if="!monitoringStore.isNoFilterSelected"
                            class="ml-4"
                            size="small" 
                            variant="tonal"
                            append-icon="mdi-close"
                            @click="monitoringViewService.applyShowAllFilter()">
                            {{translate("monitoringClients.info.clearAll")}}
                        </v-chip>
                    </v-col>
                    <v-spacer></v-spacer>

                    <v-col cols="3" class="primary-text-color text-h6 font-weight-bold">
                        {{translate("monitoringClients.info.actions")}}
                    </v-col>
                
                </v-row>

                <!------------search, filters and action buttons------------->
                <v-row>

                    <!------------search------------->
                    <v-col cols="4">
                        <v-form
                            @keyup.enter="loadMonitoringListItemsCaller()"
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
                                        @click="loadMonitoringListItemsCaller()">
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
                                        {{translate("monitoringClients.info.groups")}}
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
                                        {{translate("monitoringClients.info.clientStates")}}
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
                                        {{translate("monitoringClients.info.notifications")}}
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
                                <v-col v-if="monitoringStore.monitoringOverviewData != null && Object.keys(monitoringStore.monitoringOverviewData?.indicators).length != 0">
                                    <div class="primary-text-color text-subtitle-1">
                                        {{translate("monitoringClients.info.indicators")}}
                                    </div>
    
                                    <template v-for="(value, key) in monitoringStore.monitoringOverviewData?.indicators" :key="key">
                                        <!-- v-if="key != 'total' && value != 0" -->

                                        <v-chip 
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
                        <div>
                            <v-btn 
                                :disabled="monitoringStore.selectedMonitoringIds.length == 0"
                                class="mt-2"
                                rounded="sm" 
                                color="black" 
                                variant="outlined"
                                prepend-icon="mdi-monitor-lock"
                                @click="openInstructionConfirmDialog(InstructionEnum.SEB_FORCE_LOCK_SCREEN, false)">
                                {{translate("monitoringClients.info.lockClients")}}
                            </v-btn>
                        </div>

                        <div>
                            <v-btn 
                                :disabled="monitoringStore.selectedMonitoringIds.length == 0"
                                class="mt-2"
                                rounded="sm" 
                                color="black" 
                                variant="outlined"
                                prepend-icon="mdi-backspace-outline"
                                @click="openInstructionConfirmDialog(InstructionEnum.SEB_QUIT, false)">
                                {{translate("monitoringClients.info.quitClients")}}
                            </v-btn>
                        </div>

                        <div>
                            <v-btn 
                                :disabled="monitoringStore.selectedMonitoringIds.length == 0"
                                class="mt-2"
                                rounded="sm" 
                                color="black" 
                                variant="outlined"
                                prepend-icon="mdi-cancel"
                                @click="openInstructionConfirmDialog(null, true)">
                                {{translate("monitoringClients.info.cancelClients")}}
                            </v-btn>
                        </div>
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

    <!-----------instruction confirm dialog---------->      
    <v-dialog v-model="instructionConfirmDialog" max-width="600">
        <InstructionConfirmDialog
            @close-instruction-confirm-dialog="closeInstructionConfirmDialog"
            :instruction-type="selectedInstructionType"
            :connectionTokens="selectedConnectionTokens"
            :is-cancel-instruction="isSelectedInstructionCancel">
        </InstructionConfirmDialog>
    </v-dialog>

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
    import { InstructionEnum } from "@/models/seb-server/instructionEnum";
    import { useErrorStore } from "@/stores/seb-server/errorStore";
    
    //i18n
    const i18n = useI18n();

    //info panel (whole component)
    const isInfoExpanded = ref<boolean>(true);

    //router
    const route = useRoute();

    //stores
    const monitoringStore = useMonitoringStore();
    const monitoringStoreRef = storeToRefs(monitoringStore);
    const errorStore = useErrorStore();

    //exam
    const examId = useRoute().params.examId.toString();

    //datepicker
    const datepicker = ref();

    //instruction confirm dialog
    const instructionConfirmDialog = ref<boolean>(false);
    const selectedInstructionType = ref<InstructionEnum | null>(null);
    const isSelectedInstructionCancel = ref<boolean>(false);
    const selectedConnectionTokens = ref<string>("");

    //emits - call loadMonitoringListItemsCaller in parent
    const emit = defineEmits<{
        loadMonitoringListItemsCaller: any;
    }>();


    function loadMonitoringListItemsCaller(){ 
        if(datepicker != null && datepicker.value != null){
            monitoringStore.startDate = datepicker.value.getTime();
        }

        emit("loadMonitoringListItemsCaller");
    }

    function clearForm(){
        monitoringStore.searchField = "";

        datepicker.value = null;
        monitoringStore.startDate = null;
        
        loadMonitoringListItemsCaller();
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

    //===============instruction confirm dialog====================
    function openInstructionConfirmDialog(instructionType: InstructionEnum | null, isCancelInstruction: boolean){
        const connectionTokens: string | null = getConnectionTokens();
        if(connectionTokens == null){
            const errorProps: ErrorProps = {
                color: "error",
                textKey: "no-data",
                timeout: 5000
            }

            errorStore.showError(errorProps);
            return;
        }

        console.log(connectionTokens)

        selectedInstructionType.value = instructionType;
        selectedConnectionTokens.value = connectionTokens;
        isSelectedInstructionCancel.value = isCancelInstruction;

        instructionConfirmDialog.value = true;
    }

    function closeInstructionConfirmDialog(){
        instructionConfirmDialog.value = false;
    }

    function getConnectionTokens(): string | null{
        if(monitoringStore.staticClientDataList == null){
            return null;
        }

        //create map from static data
        const idTokenMap: Map<number, string> = new Map(
            monitoringStore.staticClientDataList.staticClientConnectionData.map(data => [data.id, data.connectionToken])
        );

        //get token and add it to list
        const connectionTokens: string[] = [];
        monitoringStore.selectedMonitoringIds.forEach((id, index) => {
            const connectionToken: string | undefined = idTokenMap.get(id);

            if(connectionToken != null){
                connectionTokens.push(connectionToken);
            }

        });

        if(connectionTokens.length == 0){
            return null;
        }

        //create string and return string comma list
        return generalUtils.createStringCommaList(connectionTokens);
    }


</script>

<style scoped>


</style>