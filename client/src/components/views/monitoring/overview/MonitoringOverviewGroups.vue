<template>
    <!------title------->
    <v-row>
        <v-col class="primary-text-color text-h5 font-weight-bold">
            Groups
        </v-col>
    </v-row>


    <v-row v-for="clientGroupItem in clientGroups">
        <v-col>
            <v-sheet class="rounded-lg pa-4" elevation="4">
                <v-row>
                    <v-col cols="4">
                        {{ clientGroupItem.clientGroup.name }}
                    </v-col>
                    <v-col cols="4">
                        {{ translate(clientGroupItem.clientGroup.type) }}
                    </v-col>
                    <v-col cols="2">
                        {{ clientGroupItem.amount }}
                    </v-col>

                    <v-col cols="1" v-if="clientGroupItem.clientGroup.isSPSGroup">
                        <v-icon icon="mdi-video">
                        </v-icon>
                    </v-col>

                    <v-col cols="1">
                        <v-icon icon="mdi-chevron-right">
                        </v-icon>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="4">
                    </v-col>
                    <v-col cols="4">
                        {{ getGroupDetails(clientGroupItem.clientGroup) }}
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>


    <v-row>
        <v-col>
            <v-btn @click="navigateTo(constants.MONITORING_CLIENTS_ROUTE + '/' + examId)">
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

    //client groups
    const clientGroups = ref<{clientGroup: ClientGroup; amount: number;}[]>([]);

    //exam
    const examId = useRoute().params.examId.toString();




    watch(() => monitoringStore.monitoringOverviewData?.clientGroups, async () => {

        console.log("it got here client groups")

        console.log(monitoringStore.monitoringOverviewData?.clientGroups)

        const clientGroupIds: {id: number; clientAmount: number}[] = [];
        if(monitoringStore.monitoringOverviewData?.clientGroups != null){
            clientGroupIds.push(...monitoringStore.monitoringOverviewData.clientGroups);
        }


        for(let i = 0; i < clientGroupIds.length; i++){

            //check if the client groups array already contains the client group
            if(!clientGroups.value.some(clientGroupObject => clientGroupObject.clientGroup.id == clientGroupIds[i].id)){
                
                const clientGroupApi: ClientGroup | null = await getGroup(clientGroupIds[i].id.toString());
                
                if(clientGroupApi == null){
                    return;
                }
                
                clientGroups.value.push({
                    clientGroup: clientGroupApi,
                    amount: clientGroupIds[i].clientAmount
                });

            }else{

                const index: number = clientGroups.value.findIndex(clientGroupObject => clientGroupObject.clientGroup.id == clientGroupIds[i].id);
                clientGroups.value[index].amount = clientGroupIds[i].clientAmount;
            }


        }




    },{deep: true});



    async function getGroup(groupId: string): Promise<ClientGroup | null>{
        return await clientGroupViewService.getClientGroup(groupId);
    }


    function getGroupDetails(clientGroup: ClientGroup): string{
        if(clientGroup.type == ClientGroupEnum.CLIENT_OS){
            return translate(clientGroup.clientOS);
        }

        if(clientGroup.type == ClientGroupEnum.IP_V4_RANGE){
            return clientGroup.ipRangeStart + " - " + clientGroup.ipRangeEnd;
        }

        if(clientGroup.type == ClientGroupEnum.NAME_ALPHABETICAL_RANGE){
            return clientGroup.nameRangeStartLetter + " - " + clientGroup.nameRangeEndLetter;
        }

        return "";
    }


    



</script>

<style scoped>

</style>