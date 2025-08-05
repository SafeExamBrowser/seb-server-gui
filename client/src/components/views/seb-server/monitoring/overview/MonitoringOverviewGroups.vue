<template>

    <!-- Title Row with Add Group Button -->
    <v-row class="mb-4" align="center">
        <v-col cols="6">
            <div class="text-h6 font-weight-bold">
                {{ translate("monitoringOverview.groups.groups") }}
            </div>
        </v-col>
        <v-col cols="6" class="text-right">
            <v-btn
                variant="text"
                class="add-group-btn font-weight-bold"
                prepend-icon="mdi-plus"
            >
                {{ translate("monitoringOverview.groups.addGroup") }}
            </v-btn>
        </v-col>
    </v-row>

    <!-- Redesigned Group Cards -->
    <v-row>
        <template v-for="(clientGroupItem, index) in overViewClientGroups" :key="clientGroupItem.id">
            <v-col cols="12" md="4">
                <v-card class="rounded-lg d-flex flex-column group-card" elevation="2">
                    <!-- Colored Section -->
                    <div
                        class="group-card-header px-4 py-3"
                        :style="{
              backgroundColor: '#f5f5f5',
              borderLeft: `6px solid #000}`

              //       backgroundColor: clientGroupItem.color ? '#' + clientGroupItem.color + '10' : '#f5f5f5',
              // borderLeft: `6px solid ${clientGroupItem.color ? '#' + clientGroupItem.color : '#000'}`
            }"
                    >
                        <div class="d-flex justify-space-between align-start align-center">
                            <div>
                                <div class="font-weight-bold text-subtitle-1">
                                    <template v-if="clientGroupItem.type === ClientGroupEnum.SP_FALLBACK_GROUP && isSPGroupAvailable">
                                        {{ translate("monitoringOverview.groups.remainingClients") }}
                                    </template>
                                    <template v-else>
                                        {{ translate("monitoringOverview.groups.group") }}
                                        {{ clientGroupItem.name }}
                                    </template>
                                </div>
                                <div class="text-caption">
                                    {{ translate(clientGroupItem.type) }}
                                </div>
                            </div>
                            <div
                                class="custom-chip"
                                :style="{
                                    color: '#000'

                                           // color: clientGroupItem.color ? '#' + clientGroupItem.color : '#000'
                                  }"
                                >
                                {{ clientGroupItem.clientAmount }} {{ translate("monitoringOverview.groups.clients") }}

                            </div>

                        </div>
                    </div>

                    <!-- Group Value Info -->
                    <div class="px-4 pt-3 group-value-info">
                        <!-- Icon -->
                        <v-icon v-if="clientGroupItem.type === ClientGroupEnum.NAME_ALPHABETICAL_RANGE" size="20">
                            mdi-sort-alphabetical-variant
                        </v-icon>
                        <v-icon v-else-if="clientGroupItem.type === ClientGroupEnum.IP_V4_RANGE" size="20">
                            mdi-lan
                        </v-icon>
                        <v-icon v-else-if="clientGroupItem.type === ClientGroupEnum.CLIENT_OS" size="20">
                            {{
                                clientGroupItem.typeValue === ClientOSEnum.WINDOWS ? 'mdi-microsoft-windows' :
                                    clientGroupItem.typeValue === ClientOSEnum.MAC_OS ? 'mdi-apple' :
                                        ['I_OS', 'IPAD_OS', 'I_OS_OR_IPAD_OS'].includes(clientGroupItem.typeValue) ? 'mdi-cellphone' :
                                            'mdi-help-circle-outline'
                            }}
                        </v-icon>
                        <v-icon
                            v-else-if="clientGroupItem.type === ClientGroupEnum.NONE || clientGroupItem.type === ClientGroupEnum.SP_FALLBACK_GROUP"
                            size="20"
                        >
                            mdi-account-multiple-remove
                        </v-icon>

                        <!-- Text -->
                        <span class="ml-1" v-if="clientGroupItem.type === ClientGroupEnum.NAME_ALPHABETICAL_RANGE">
                            Range: {{ translate(clientGroupItem.typeValue) }}
                        </span>
                        <span class="ml-1" v-else-if="clientGroupItem.type === ClientGroupEnum.NONE || clientGroupItem.type === ClientGroupEnum.SP_FALLBACK_GROUP">
                            {{ translate("monitoringOverview.groups.noGroupClients") }}
                        </span>
                        <span class="ml-1" v-else>
                            {{ translate(clientGroupItem.typeValue || '&nbsp;') }}
                        </span>
                    </div>
                    <!-- Action Buttons -->
                    <div class="d-flex align-center gap-3 px-4 py-3">
                        <v-btn
                            color="primary"
                            variant="flat"
                            prepend-icon="mdi-monitor-eye"
                            v-if="clientGroupItem.spsGroupUUID"
                            @click="navigation.openUrlInNewTab(linkService.getGalleryViewLink(clientGroupItem.spsGroupUUID, examId))"
                        >
                            {{ translate("monitoringOverview.groups.buttons.proctor") }}
                        </v-btn>

                        <v-btn
                            variant="outlined"
                            color="primary"
                            class="ml-4"
                            prepend-icon="mdi-format-list-bulleted"
                            @click="monitoringViewService.goToMonitoring(
                                MonitoringHeaderEnum.SHOW_CLIENT_GROUPS,
                                generalUtils.createStringCommaList([clientGroupItem.id]),
                                examId
                                )"
                            >
                            {{ translate("monitoringOverview.groups.buttons.viewList") }}
                        </v-btn>
                    </div>
                </v-card>
            </v-col>
        </template>
    </v-row>
    <!--------special card if no sp group is available but screen proctoring is activated on the exam-------->
    <v-row
        v-if="!isSPGroupAvailable && monitoringStore.selectedExam?.additionalAttributes.enableScreenProctoring === 'true' && generalUtils.stringToBoolean(authStore.getStorageItem(StorageItemEnum.IS_SP_AVAILABLE))"
        class="mt-4"
    >
        <v-col cols="12" md="4">
            <v-card class="rounded-lg d-flex flex-column group-card" elevation="2">
                <!-- Colored Section -->
                <div
                    class="group-card-header px-4 py-3"
                    style="background-color: #f5f5f5; border-left: 6px solid #000;"
                >
                    <div class="d-flex justify-space-between align-start align-center">
                        <div>
                            <div class="font-weight-bold text-subtitle-1">
                                {{ translate("monitoringOverview.groups.allClients") }}
                            </div>
                            <div class="text-caption">
                                {{ translate("monitoringOverview.groups.noGroupClients") }}
                            </div>
                        </div>
                        <div class="custom-chip">
                            {{
                                monitoringStore.monitoringOverviewData?.clientGroups.at(-1)?.clientAmount ?? 0
                            }}
                            {{ translate("monitoringOverview.groups.clients") }}
                        </div>
                    </div>
                </div>

                <!-- Group Value Info -->
                <div class="px-4 pt-3 group-value-info">
                    <v-icon size="20">mdi-account-multiple-remove</v-icon>
                    <span>{{ translate("monitoringOverview.groups.noGroupClients") }}</span>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex align-center gap-3 px-4 py-3">
                    <!-- SP Gallery Button -->
                    <v-btn
                        color="primary"
                        variant="flat"
                        prepend-icon="mdi-monitor-eye"
                        v-if="monitoringStore.monitoringOverviewData?.clientGroups.at(-1)?.spsGroupUUID"
                        @click="navigation.openUrlInNewTab(
                        linkService.getGalleryViewLink(
                          monitoringStore.monitoringOverviewData.clientGroups.at(-1)?.spsGroupUUID ?? '' , examId
                        )

          )"
                    >
                        {{ translate("monitoringOverview.groups.buttons.proctor") }}
                    </v-btn>

                    <!-- View All Button -->
                    <v-btn
                        variant="outlined"
                        color="primary"
                        class="ml-4"
                        prepend-icon="mdi-format-list-bulleted"
                        @click="monitoringViewService.goToMonitoring(
            MonitoringHeaderEnum.SHOW_ALL,
            true,
            examId
          )"
                    >
                        {{ translate("monitoringOverview.groups.buttons.viewList") }}
                    </v-btn>
                </div>
            </v-card>
        </v-col>
    </v-row>

    <!---------------------------->

    <!--------show all button-------->
    <v-row class="mb-3" v-if="isSPGroupAvailable || monitoringStore.monitoringOverviewData?.clientGroups.length == 0">
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
    import { ClientGroupEnum, ClientOSEnum} from "@/models/seb-server/clientGroupEnum";
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

.add-group-btn {
    color: #215caf !important;
    font-weight: bold;
}


.group-card {
    overflow: hidden;
    min-height: 170px;
}

.group-card-header {
    position: relative;
    background-color: #f5f5f5;
    padding-left: 16px;
}

.group-card-header::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: #f5f5f5;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
.custom-chip {
    background-color: white;
    border-radius: 999px;
    font-weight: 500;
    font-size: 14px;
    padding: 4px 12px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    border: none;
}

.group-value-info {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    gap: 8px;
}

.min-height-sheet {
    min-height: 354px;
}


</style>
