<template>
    <!------notifications------->
    <template v-if="monitoringStore.monitoringOverviewData?.notifications">
        <v-row>
            <v-col class="primary-text-color text-h5 font-weight-bold">
                {{ translate("monitoringOverview.notifications.notifications") }}
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
                {{ translate("monitoringOverview.notifications.indicators") }}
            </v-col>
        </v-row>
    
        <v-row>
            <v-col>

                <!------batter status------>
                <v-card
                    class="rounded-lg mb-3 pa-2" 
                    variant="flat"
                    :hover="true"
                    :ripple="false"
                    :color="getIndicatorColor(monitoringStore.monitoringOverviewData.indicators.BATTERY_STATUS?.color)"   
                    @click="monitoringViewService.goToMonitoring(
                                MonitoringHeaderEnum.SHOW_INDICATORS, 
                                IndicatorEnum.BATTERY_STATUS, 
                                examId)">
                    
                    <v-row>
                        <v-col align="left">
                            {{ getIndicatorText(
                                    monitoringStore.monitoringOverviewData.indicators.BATTERY_STATUS?.incident,
                                    monitoringStore.monitoringOverviewData.indicators.BATTERY_STATUS?.warning,
                                    IndicatorEnum.BATTERY_STATUS
                                ) 
                            }}
                        </v-col>
                        <v-col align="right">
                            <v-icon icon="mdi-battery-alert-variant-outline"></v-icon>
                        </v-col>
                    </v-row>
                </v-card>

                <!------wlan status------>
                <v-card
                    class="rounded-lg mb-3 pa-2" 
                    variant="flat"
                    :hover="true"
                    :ripple="false"
                    :color="getIndicatorColor(monitoringStore.monitoringOverviewData.indicators.WLAN_STATUS?.color)"   
                    @click="monitoringViewService.goToMonitoring(
                                MonitoringHeaderEnum.SHOW_INDICATORS, 
                                IndicatorEnum.WLAN_STATUS, 
                                examId)">
                    
                    <v-row>
                        <v-col align="left">
                            {{ getIndicatorText(
                                    monitoringStore.monitoringOverviewData.indicators.WLAN_STATUS?.incident,
                                    monitoringStore.monitoringOverviewData.indicators.WLAN_STATUS?.warning,
                                    IndicatorEnum.WLAN_STATUS
                                ) 
                            }}
                        </v-col>
                        <v-col align="right">
                            <v-icon icon="mdi-wifi-alert"></v-icon>
                        </v-col>
                    </v-row>
                </v-card>


            </v-col>
        </v-row>
    </template>

</template>

<script setup lang="ts">
    import { NotificationEnum, IndicatorEnum } from "@/models/seb-server/monitoringEnums";
    import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
    import {translate} from "@/utils/generalUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import {ConnectionStatusEnum} from "@/models/seb-server/connectionStatusEnum";
    import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
    import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";

    //exam
    const examId = useRoute().params.examId.toString();

    //stores
    const monitoringStore = useMonitoringStore();


    function getNotificationColor(notification: NotificationEnum | null): string {
        if (notification == null) return "#000000";

        switch (notification) {
            case NotificationEnum.LOCK_SCREEN:
                return "#f0f0f0";
            case NotificationEnum.RAISE_HAND:
                return "#f0f0f0";
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

    function getIndicatorColor(color: string | undefined): string {
        if(color == null){
            return "#f0f0f0";
        }

        return "#" + color;
    }

    function getIndicatorText(incident: number | undefined, warning: number | undefined, indicatorType: IndicatorEnum): string{
        const indicatorTypeTranslated: string = translate(indicatorType);

        let text: string = "";
        if(incident != 0 && incident != null){
            text = incident.toString();
        }

        if(warning != 0 && warning != null){
            text = warning.toString();
        }

        if(incident != 0 && warning != 0){
            text = incident + " | " + warning;
        }

        if(incident == 0 && warning == 0){
            text = "0";
        }

        if(incident == null || warning == null){
            text = "0";
        }

        return text + " " + indicatorTypeTranslated;
    }



</script>

<style scoped>

</style>