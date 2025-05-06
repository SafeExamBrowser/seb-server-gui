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
                        <v-icon v-if="clientGroupItem.spsGroupUUID != null && clientGroupItem.spsGroupUUID != ''" icon="mdi-video">
                        </v-icon>
                    </v-col>

                    <!--------monitoring button-------->
                    <v-col cols="1">
                        <v-icon 
                            icon="mdi-chevron-right" 
                            @click="monitoringViewService.goToMonitoring(
                                MonitoringHeaderEnum.SHOW_CLIENT_GROUPS, 
                                generalUtils.createStringIdList([clientGroupItem.id]), 
                                examId)">
                        </v-icon>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>

    <v-row>
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
    import { useMonitoringStore } from "@/stores/monitoringStore";
    import * as monitoringViewService from "@/services/component-services/monitoringViewService";
    import {translate} from "@/utils/generalUtils";
    import { ClientGroupEnum } from "@/models/clientGroupEnum";
    import { MonitoringHeaderEnum } from "@/models/monitoringEnums";
    import * as generalUtils from "@/utils/generalUtils";

    //stores
    const monitoringStore = useMonitoringStore();

    //exam
    const examId = useRoute().params.examId.toString();
    
    const overViewClientGroups: ComputedRef<OverviewClientGroup[] | null> = computed(() => {
        if(monitoringStore.monitoringOverviewData?.clientGroups == null){
            return null;
        }

        const normalItems = monitoringStore.monitoringOverviewData?.clientGroups.filter(item => item.type != ClientGroupEnum.SP_FALLBACK_GROUP);
        const fallBackGroups = monitoringStore.monitoringOverviewData?.clientGroups.filter(item => item.type == ClientGroupEnum.SP_FALLBACK_GROUP);

        return [...normalItems, ...fallBackGroups];
    });
    
</script>

<style scoped>

</style>