<template>
    <v-row>
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pl-4 pt-3 pr-4">

                <v-row class="fill-height" align="center">
                    <!-- {{monitoringStore.selectedClientData?.staticClientConnectionData[0].examUserSessionId}} -->
                    <v-col>

                        <!------title and headers------->
                        <v-row>
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
                                {{monitoringStore.selectedSingleConns?.cdat.examUserSessionId}}
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
                                {{monitoringStore.selectedSingleConns?.cdat.seb_info}}
                            </v-col>

                            <!------status------->
                            <v-col cols="2">
                                {{ translate(generalUtils.findEnumValue(ConnectionStatusEnum, monitoringStore.selectedSingleConns?.cdat.status)) }}
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
                                        @click="">
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
                                        @click="">
                                        Quit client
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>

            </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import {useMonitoringStore} from "@/stores/seb-server/monitoringStore";
    import { ExamStatusEnum, ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
    import * as generalUtils from "@/utils/generalUtils";
    import { VDateInput } from "vuetify/labs/VDateInput";
    import * as timeUtils from "@/utils/timeUtils";
    import {translate} from "@/utils/generalUtils";
    import { useI18n } from "vue-i18n";
    import {ConnectionStatusEnum} from "@/models/seb-server/connectionStatusEnum";


    //i18n
    const i18n = useI18n();

    //stores
    const monitoringStore = useMonitoringStore();





</script>

<style scoped>


</style>