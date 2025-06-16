<template>
    <v-row>
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pl-4 pt-3 pr-4">

                <!------title and headers------->
                <v-row class="fill-height" align="center">
                    <v-col cols="2" class="primary-text-color text-h5 font-weight-bold">
                        {{monitoringStore.selectedExam?.quizName}}
                    </v-col>

                    <v-col cols="2" class="text-subtitle-1 font-weight-bold">
                        {{translate("monitoringDetails.info.userNameOrSession")}}
                    </v-col>

                    <v-col cols="2" class="text-subtitle-1 font-weight-bold">
                        {{translate("monitoringDetails.info.clientGroups")}}
                    </v-col>

                    <v-col cols="2" class="text-subtitle-1 font-weight-bold">
                        {{translate("monitoringDetails.info.connectionInfo")}}
                    </v-col>

                    <v-col cols="2" class="text-subtitle-1 font-weight-bold">
                        {{translate("monitoringDetails.info.status")}}
                    </v-col>

                    <v-col cols="2" class="text-subtitle-1 font-weight-bold">
                        {{translate("monitoringDetails.info.actions")}}
                    </v-col>
                </v-row>

                <!------url and values------->
                <v-row>
                    <!------placeholder------->
                    <v-col cols="2" class="text-h7 text-decoration-underline">
                    </v-col>

                    <!------user name or session------->
                    <v-col cols="2" class="text-h6 font-weight-bold">
                        {{monitoringStore.selectedSingleConn?.cdat.examUserSessionId}}
                    </v-col>

                    <!------client groups------->
                    <v-col cols="2" class="text-h6 font-weight-bold">
                        <div v-for="clientGroup in monitoringStore.clientGroupsSingle" :key="clientGroup.id">
                                <v-chip 
                                    size="small" 
                                    class="mr-2 mt-2"
                                    variant="tonal">
                                    {{clientGroup.name}}
                                </v-chip>
                            </div>
                    </v-col>

                    <!------connection info------->
                    <v-col cols="2">
                        {{monitoringStore.selectedSingleConn?.cdat.seb_info}}
                    </v-col>

                    <!------status------->
                    <v-col cols="2">
                        {{ translate(generalUtils.findEnumValue(ConnectionStatusEnum, monitoringStore.selectedSingleConn?.cdat.status)) }}
                    </v-col>

                    <!------actions------->
                    <v-col cols="2">
                        <div>
                            <v-btn 
                                class="mt-2"
                                rounded="sm" 
                                color="black" 
                                variant="outlined"
                                prepend-icon="mdi-monitor-lock"
                                @click="openInstructionConfirmDialog(InstructionEnum.SEB_FORCE_LOCK_SCREEN)">
                                Lock client
                            </v-btn>
                        </div>

                        <div>
                            <v-btn 
                                class="mt-2"
                                rounded="sm" 
                                color="black" 
                                variant="outlined"
                                prepend-icon="mdi-backspace-outline"
                                @click="openInstructionConfirmDialog(InstructionEnum.SEB_QUIT)">
                                Quit client
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
                                @click="navigateTo(constants.MONITORING_CLIENTS_ROUTE + '/' + examId, monitoringStore.currentMonitoringQuery)">
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
            :connectionTokens="connectionToken">
        </InstructionConfirmDialog>
    </v-dialog>


</template>

<script setup lang="ts">
    import {useMonitoringStore} from "@/stores/seb-server/monitoringStore";
    import * as generalUtils from "@/utils/generalUtils";
    import {translate} from "@/utils/generalUtils";
    import { useI18n } from "vue-i18n";
    import {ConnectionStatusEnum} from "@/models/seb-server/connectionStatusEnum";
    import { InstructionEnum } from "@/models/seb-server/instructionEnum";
    import {navigateTo} from "@/router/navigation";
    import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
    import * as constants from "@/utils/constants";
    import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";


    //i18n
    const i18n = useI18n();

    //route params
    const examId = useRoute().params.examId.toString();
    const connectionToken = useRoute().params.connectionToken.toString();

    //stores
    const monitoringStore = useMonitoringStore();

    //instruction confirm dialog
    const instructionConfirmDialog = ref<boolean>(false);
    const selectedInstructionType = ref<InstructionEnum | null>(null);




    //===============instruction confirm dialog====================
    function openInstructionConfirmDialog(instructionType: InstructionEnum){
        selectedInstructionType.value = instructionType;
        instructionConfirmDialog.value = true;
    }

    function closeInstructionConfirmDialog(){
        instructionConfirmDialog.value = false;
    }



</script>

<style scoped>


</style>