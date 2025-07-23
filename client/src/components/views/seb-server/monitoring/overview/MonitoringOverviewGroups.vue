<template>


    <v-row>
        <v-col cols="12">
            <!------title------->
            <div class="text-h6 font-weight-bold mb-4">
                {{ translate("monitoringOverview.groups.groups") }}
            </div>

            <!-- New Redesigned Groups -->
            <v-row>



            </v-row>
        </v-col>
    </v-row>

    <!--------old group cards-------->
    <template v-for="(clientGroupItem, index) in overViewClientGroups">
        <!--@vue-ignore-->
        <v-row no-gutters :class="[index != overViewClientGroups.length-1 ? 'mb-4' : '']">
            <v-col>
                <v-sheet class="rounded-lg pa-4" elevation="4">
                    <v-row align="center">

                        <!--------name-------->
                        <v-col cols="4" class="font-weight-medium primary-text-color text-h6">
                            <template v-if="clientGroupItem.type == ClientGroupEnum.SP_FALLBACK_GROUP && isSPGroupAvailable">
                                {{translate("monitoringOverview.groups.remainingClients")}}
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

    <!--------special card if no sp group is available but screen proctoring is activated on the exam-------->
    <v-row v-if="!isSPGroupAvailable && monitoringStore.selectedExam?.additionalAttributes.enableScreenProctoring == 'true' && generalUtils.stringToBoolean(authStore.getStorageItem(StorageItemEnum.IS_SP_AVAILABLE))" class="mt-4" no-gutters>
        <v-col>
            <v-sheet class="rounded-lg pa-4" elevation="4">
                <v-row align="center">
                    <!--------name-------->
                    <v-col cols="4" class="font-weight-medium primary-text-color text-h6">
                        {{translate("monitoringOverview.groups.allClients")}}
                    </v-col>

                    <!--------group type placeholder-------->
                    <v-col cols="6">
                    </v-col>

                    <!--------client amount-------->
                    <v-col cols="1" class="text-h6 primary-text-color">
                        <template v-if="monitoringStore.monitoringOverviewData != null && monitoringStore.monitoringOverviewData.clientGroups.length != 0">
                            {{ monitoringStore.monitoringOverviewData.clientGroups[monitoringStore.monitoringOverviewData.clientGroups.length-1].clientAmount }}
                        </template>
                        <template v-else>
                            0
                        </template>
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
          <v-col v-if="monitoringStore.monitoringOverviewData != null && monitoringStore.monitoringOverviewData.clientGroups.length != 0" cols="1" class="ml-4">
            <v-sheet class="rounded-lg d-flex align-center justify-center fill-height" elevation="4">
                <v-btn
                    variant="text"
                    icon="mdi-video"
                    @click="
                    navigation.openUrlInNewTab(
                        linkService.getGalleryViewLink(
                            monitoringStore.monitoringOverviewData.clientGroups[
                                monitoringStore.monitoringOverviewData.clientGroups.length-1
                            ].spsGroupUUID!))"
                >
                </v-btn>
            </v-sheet>
        </v-col>
    </v-row>
    <!---------------------------->

    <!--------show all button-------->
    <v-row v-if="isSPGroupAvailable || monitoringStore.monitoringOverviewData?.clientGroups.length == 0">
        <v-col align="right">
            <v-btn
                color="primary"
                @click="monitoringViewService.goToMonitoring(
                    MonitoringHeaderEnum.SHOW_ALL,
                    true,
                    examId)">
                {{translate("monitoringOverview.groups.showAll")}}
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
    import { useAuthStore } from "@/stores/authentication/authenticationStore";
    import { StorageItemEnum } from "@/models/StorageItemEnum";

    //stores
    const monitoringStore = useMonitoringStore();
    const authStore = useAuthStore()

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
