<template>
    <!------notifications------->
    <template v-if="monitoringStore.monitoringOverviewData?.notifications">
        <v-row>
            <v-col class="primary-text-color text-h5 font-weight-bold">
                Notifications
            </v-col>
        </v-row>
    
        <v-row>
            <v-col>
                <template v-for="(value, key) in monitoringStore.monitoringOverviewData?.notifications" :key="key">
                    <v-card
                        v-if="key != 'total'"
                        class="rounded-lg mb-3 pa-2" 
                        variant="flat"
                        :hover="true"
                        :ripple="false"
                        :color="getNotificationColor(generalUtils.findEnumValue(NotificationEnum, key))"
                        @click="monitoringViewService.goToMonitoring(
                                    MonitoringHeaderEnum.SHOW_NOTIFCATION, 
                                    generalUtils.findEnumValue(NotificationEnum, key)!, 
                                    examId)">
                        
                        <v-row>
                            <v-col align="left">{{ value }} {{ translate(key) }}</v-col>
                            <v-col align="right">
                                <v-icon :icon="getNotificationIcon(generalUtils.findEnumValue(NotificationEnum, key))"></v-icon>
                            </v-col>
                        </v-row>
                    </v-card>
                </template>
            </v-col>
        </v-row>
    </template>

    
    <!------indicators------->
    <template v-if="monitoringStore.monitoringOverviewData?.indicators">
        <v-row>
            <v-col class="primary-text-color text-h5 font-weight-bold">
                Indicators
            </v-col>
        </v-row>
    
        <v-row>
            <v-col>
                <template v-for="(value, key) in monitoringStore.monitoringOverviewData?.indicators" :key="key">
                    <v-card
                        v-if="key != 'total'"
                        class="rounded-lg mb-3 pa-2" 
                        variant="flat"
                        :hover="true"
                        :ripple="false"
                        :color="getIndicatorColor(generalUtils.findEnumValue(IndicatorEnum, key))"
                        @click="monitoringViewService.goToMonitoring(
                                    MonitoringHeaderEnum.SHOW_INDICATORS, 
                                    generalUtils.findEnumValue(IndicatorEnum, key)!, 
                                    examId)">
                        
                        <v-row>
                            <v-col align="left">{{ value }} {{ translate(key) }}</v-col>
                            <v-col align="right">
                                <v-icon :icon="getIndicatorIcon(generalUtils.findEnumValue(IndicatorEnum, key))"></v-icon>
                            </v-col>
                        </v-row>
                    </v-card>
                </template>
            </v-col>
        </v-row>
    </template>

</template>

<script setup lang="ts">
    import { NotificationEnum, IndicatorEnum } from "@/models/monitoringEnums";
    import { useMonitoringStore } from "@/stores/monitoringStore";
    import {translate} from "@/utils/generalUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import {ConnectionStatusEnum} from "@/models/connectionStatusEnum";
    import * as monitoringViewService from "@/services/component-services/monitoringViewService";
    import { MonitoringHeaderEnum } from "@/models/monitoringEnums";

    //exam
    const examId = useRoute().params.examId.toString();

    //stores
    const monitoringStore = useMonitoringStore();


    function getNotificationColor(notification: NotificationEnum | null): string {
        if (notification == null) return "#000000";

        switch (notification) {
            case NotificationEnum.LOCK_SCREEN:
                return "#FFB300";
            case NotificationEnum.RAISE_HAND:
                return "#f5f242";
            default:
                return "#000000";
        }
    }

    function getNotificationIcon(notification: NotificationEnum | null): string {
        if (notification == null) return "mdi-chevron-right";

        switch (notification) {
            case NotificationEnum.LOCK_SCREEN:
                return "mdi-monitor-lock";
            case NotificationEnum.RAISE_HAND:
                return "mdi-hand-back-right";
            default:
                return "mdi-chevron-right";
        }
    }

    function getIndicatorColor(indicator: IndicatorEnum | null): string {
        if (indicator == null) return "#000000";

        switch (indicator) {
            case IndicatorEnum.BATTERY_STATUS:
                return "#26C6DA";
            case IndicatorEnum.WLAN_STATUS:
                return "#66BB6A";
            default:
                return "#000000";
        }
    }

    function getIndicatorIcon(indicator: IndicatorEnum | null): string {
        if (indicator == null) return "mdi-chevron-right";

        switch (indicator) {
            case IndicatorEnum.BATTERY_STATUS:
                return "mdi-battery-alert-variant-outline";
            case IndicatorEnum.WLAN_STATUS:
                return "mdi-wifi-alert";
            default:
                return "mdi-chevron-right";
        }
    }


</script>

<style scoped>

</style>