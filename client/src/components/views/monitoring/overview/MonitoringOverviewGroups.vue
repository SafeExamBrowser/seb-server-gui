<template>
    <!------title------->
    <v-row>
        <v-col class="primary-text-color text-h5 font-weight-bold">
            Groups
        </v-col>
    </v-row>

    <v-row v-for="clientGroupItem in overViewClientGroups">
        <v-col>
            <v-sheet class="rounded-lg pa-4" elevation="4">
                <v-row align="center">
                    <!--------name-------->
                    <v-col cols="3" class="font-weight-medium primary-text-color text-h6">
                        {{ clientGroupItem.name }}
                    </v-col>

                    <!--------group type-------->
                    <v-col cols="5">
                        <div class="font-weight-medium">
                            {{ translate(clientGroupItem.type) }}
                        </div>
                        <div v-if="clientGroupItem.typeValue != ''" class="mt-4">
                            {{ translate(clientGroupItem.typeValue) }}
                        </div>
                    </v-col>

                    <!--------client amount-------->
                    <v-col cols="2" class="text-h6 primary-text-color">
                        {{ clientGroupItem.clientAmount }}
                    </v-col>

                    <!--------sp button-------->
                    <v-col cols="1">
                        <v-icon v-if="clientGroupItem.screenProctoring" icon="mdi-video">
                        </v-icon>
                    </v-col>

                    <!--------monitoring button-------->
                    <v-col cols="1">
                        <v-icon v-if="clientGroupItem.type != ClientGroupEnum.SP_FALLBACK_GROUP" icon="mdi-chevron-right">
                        </v-icon>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>

    <v-row>
        <v-col align="right">
            <v-btn color="primary" @click="showAllClients()">
                Show all
            </v-btn>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import { useMonitoringStore } from "@/stores/monitoringStore";
    import * as clientGroupViewService from "@/services/component-services/clientGroupViewService";
    import {translate} from "@/utils/generalUtils";
    import { ClientGroupEnum } from "@/models/clientGroupEnum";
    import {navigateTo} from "@/router/navigation";
    import * as constants from "@/utils/constants";

    //stores
    const monitoringStore = useMonitoringStore();

    //exam
    const examId = useRoute().params.examId.toString();

    
    const overViewClientGroups: ComputedRef<OverviewClientGroup[] | undefined> = computed(() => {

        // console.log("got called")

        return monitoringStore.monitoringOverviewData?.clientGroups.filter(item => {
            if(item.type != ClientGroupEnum.SP_FALLBACK_GROUP){
                return true;
            }

            if(item.clientAmount == 0){
                return false;
            }

            return true;
        })
    });
    

    function showAllClients(){
        navigateTo(
            constants.MONITORING_CLIENTS_ROUTE + '/' + examId
            // {"hidden-client-group": generalUtils.createStringIdList(clientGroupsToHide)}
        );
    }

</script>

<style scoped>

</style>