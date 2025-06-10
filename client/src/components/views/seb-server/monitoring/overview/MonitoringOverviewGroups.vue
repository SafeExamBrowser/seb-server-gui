<template>
    <!------title------->
    <v-row class="mb-3">
        <v-col class="primary-text-color text-h5 font-weight-bold">
            Groups
        </v-col>
    </v-row>

    <!--------group cards-------->
    <template v-for="(clientGroupItem, index) in overViewClientGroups">
        <!--@vue-ignore-->
        <v-row no-gutters :class="[index != overViewClientGroups.length-1 ? 'mb-4' : '']">
            <v-col>
                <v-sheet class="rounded-lg pa-4" elevation="4">
                    <v-row align="center">

                        <!--------name-------->
                        <v-col cols="4" class="font-weight-medium primary-text-color text-h6">
                            <template v-if="clientGroupItem.type == ClientGroupEnum.SP_FALLBACK_GROUP && isSPGroupAvailable">
                                Remaining Clients
                            </template>
                            <template v-else>
                                {{ clientGroupItem.name }}
                            </template>
                        </v-col>
    
                        <!--------group type-------->
                        <v-col cols="6">
                            <div v-if="clientGroupItem.type != ClientGroupEnum.SP_FALLBACK_GROUP" class="font-weight-medium">
                                {{ translate(clientGroupItem.type) }}
                            </div>
                            <div class="mt-4">
                                {{ translate(clientGroupItem.typeValue) }}
                            </div>
                        </v-col>
    
                        <!--------client amount-------->
                        <v-col cols="1" class="text-h6 primary-text-color">
                            {{ clientGroupItem.clientAmount }}
                        </v-col>
    
                        <!--------sp button-------->
                        <!-- <v-col cols="1">
                            <v-btn 
                                v-if="clientGroupItem.spsGroupUUID"
                                variant="text" 
                                icon="mdi-video"
                                @click="navigation.openUrlInNewTab(linkService.getGalleryViewLink(clientGroupItem.spsGroupUUID))">
                            </v-btn>
                        </v-col> -->
    
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
    
            <!--------sp button-------->
            <v-col v-if="clientGroupItem.spsGroupUUID" cols="1" class="ml-4">
                <v-sheet class="rounded-lg d-flex align-center justify-center fill-height" elevation="4">
                    <v-btn 
                        variant="text" 
                        icon="mdi-video"
                        @click="navigation.openUrlInNewTab(linkService.getGalleryViewLink(clientGroupItem.spsGroupUUID))">
                    </v-btn>
                </v-sheet>
            </v-col>

        </v-row>
    </template>
    <!---------------------------->

    <!--------special card if no sp group is available-------->
    <v-row v-if="spFallbackGroup" no-gutters>
        <v-col>
            <v-sheet class="rounded-lg pa-4" elevation="4">
                <v-row align="center">
                    <!--------name-------->
                    <v-col cols="4" class="font-weight-medium primary-text-color text-h6">
                        All Clients
                    </v-col>

                    <!--------group type placeholder-------->
                    <v-col cols="6">
                    </v-col>

                    <!--------client amount-------->
                    <v-col cols="1" class="text-h6 primary-text-color">
                        {{ spFallbackGroup.clientAmount }}
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

        <!--------sp button-------->
        <v-col cols="1" class="ml-4">
            <v-sheet class="rounded-lg d-flex align-center justify-center fill-height" elevation="4">
                <v-btn 
                    variant="text" 
                    icon="mdi-video"
                    @click="navigation.openUrlInNewTab(linkService.getGalleryViewLink(spFallbackGroup.spsGroupUUID!))">
                </v-btn>
            </v-sheet>
        </v-col>
    </v-row>
    <!---------------------------->

    <!--------show all button if sp is activated-------->
    <v-row v-if="isSPGroupAvailable || monitoringStore.monitoringOverviewData?.clientGroups.length == 0">
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
    import { StorageItemEnum } from "@/models/StorageItemEnum";
    import { useAuthStore } from "@/stores/authentication/authenticationStore";

    //stores
    const monitoringStore = useMonitoringStore();
    const authStore = useAuthStore();

    //exam
    const examId = useRoute().params.examId.toString();

    //data
    const spFallbackGroup = ref<OverviewClientGroup | null>(null);

    
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
        if(!generalUtils.stringToBoolean(authStore.getStorageItem(StorageItemEnum.IS_SP_AVAILABLE))){
            setSpFallbackGroup();
            return false; 
        }

        const normalGroups = monitoringStore.monitoringOverviewData?.clientGroups.filter(item => item.type != ClientGroupEnum.SP_FALLBACK_GROUP);
        if(normalGroups == null){
            setSpFallbackGroup();
            return false;
        }

        for(let i = 0; i < normalGroups.length; i++){
            if(normalGroups[i].spsGroupUUID != null && normalGroups[i].spsGroupUUID != ''){
                spFallbackGroup.value = null;
                return true;
            }
        }

        setSpFallbackGroup();
        return false;
    });

    function setSpFallbackGroup(){
        spFallbackGroup.value = monitoringStore.monitoringOverviewData?.clientGroups.find(item => item.type == ClientGroupEnum.SP_FALLBACK_GROUP) || null;
    }
    
</script>

<style scoped>

</style>