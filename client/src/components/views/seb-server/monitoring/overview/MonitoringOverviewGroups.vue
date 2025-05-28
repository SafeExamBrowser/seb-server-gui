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
                        <template v-if="clientGroupItem.type == ClientGroupEnum.SP_FALLBACK_GROUP && isSPGroupAvailable">
                            Remaining Clients
                        </template>
                        <template v-else>
                            {{ clientGroupItem.name }}
                        </template>
                    </v-col>

                    <!--------group type-------->
                    <v-col cols="5">
                        <div v-if="clientGroupItem.type != ClientGroupEnum.SP_FALLBACK_GROUP" class="font-weight-medium">
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
                        <v-btn @click="navigation.openUrlInNewTab(linkService.getGalleryViewLink(clientGroupItem.spsGroupUUID))" variant="text" icon="mdi-video"></v-btn>
                    </v-col>

                    <!--------monitoring button-------->
                    <v-col cols="1">
                        <v-icon 
                            icon="mdi-chevron-right" 
                            @click="monitoringViewService.goToMonitoring(
                                MonitoringHeaderEnum.SHOW_CLIENT_GROUPS, 
                                generalUtils.createStringCommaList([clientGroupItem.id]), 
                                examId)">
                        </v-icon>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>

    <!--------special card if no sp group is available-------->
    <v-row v-if="!isSPGroupAvailable">
        <v-col>
            <v-sheet class="rounded-lg pa-4" elevation="4">
                <v-row align="center">
                    <!--------name-------->
                    <v-col cols="3" class="font-weight-medium primary-text-color text-h6">
                        All Clients
                    </v-col>

                    <!--------group type placeholder-------->
                    <v-col cols="5">
                    </v-col>

                    <!--------client amount-------->
                    <v-col cols="2" class="text-h6 primary-text-color">
                        <template v-if="overViewClientGroups != null && overViewClientGroups.length != 0">
                            {{ overViewClientGroups[overViewClientGroups.length-1].clientAmount }}
                        </template>
                        <template v-else>
                            0
                        </template>
                    </v-col>

                    <!--------sp button-------->
                    <v-col cols="1">
                        <v-icon icon="mdi-video">
                        </v-icon>
                    </v-col>

                    <!--------monitoring button-------->
                    <v-col cols="1">
                        <v-icon 
                            icon="mdi-chevron-right" 
                            @click="monitoringViewService.goToMonitoring(
                                MonitoringHeaderEnum.SHOW_ALL, 
                                true, 
                                examId)">
                        </v-icon>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>

    <!--------show all button-------->
    <v-row v-if="isSPGroupAvailable">
        <v-col align="right">
            <v-btn 
                color="primary" 
                @click="monitoringViewService.goToMonitoring(
                    MonitoringHeaderEnum.SHOW_ALL, 
                    true, 
                    examId)">
                Show all
            </v-btn>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
    import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
    import {translate} from "@/utils/generalUtils";
    import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";
    import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";
    import * as generalUtils from "@/utils/generalUtils";
    import * as linkService from "@/services/screen-proctoring/component-services/linkService";
    import * as navigation from "@/router/navigation";


    //stores
    const monitoringStore = useMonitoringStore();

    //exam
    const examId = useRoute().params.examId.toString();
    
    const overViewClientGroups: ComputedRef<OverviewClientGroup[] | null> = computed(() => {
        if(monitoringStore.monitoringOverviewData?.clientGroups == null){
            return null;
        }

        const normalGroups = monitoringStore.monitoringOverviewData?.clientGroups.filter(item => item.type != ClientGroupEnum.SP_FALLBACK_GROUP);

        if(isSPGroupAvailable.value){
            const fallBackGroup = monitoringStore.monitoringOverviewData?.clientGroups.filter(item => item.type == ClientGroupEnum.SP_FALLBACK_GROUP);
            return [...normalGroups, ...fallBackGroup];
        }

        return normalGroups;
    });

    const isSPGroupAvailable: ComputedRef<boolean> = computed(() => {
        const normalGroups = monitoringStore.monitoringOverviewData?.clientGroups.filter(item => item.type != ClientGroupEnum.SP_FALLBACK_GROUP);

        if(normalGroups == null){
            return false;
        }

        for(let i = 0; i < normalGroups.length; i++){
            if(normalGroups[i].spsGroupUUID != null && normalGroups[i].spsGroupUUID != ''){
                return true;
            }
        }

        return false;
    });
    
</script>

<style scoped>

</style>