<template>
    <v-row>
        <v-col cols="12">
            <template v-if="indicators">
                <div class="text-h6 font-weight-bold mb-4">
                    {{ translate("monitoringOverview.indicators.indicators") }}
                </div>

                <!-- Battery Status -->
                <v-card
                    class="rounded-lg mb-3 px-4 py-3 d-flex align-center justify-space-between"
                    variant="flat"
                    :hover="true"
                    :ripple="false"
                    :color="getIndicatorCardBackground('BATTERY_STATUS')"
                    @click="monitoringViewService.goToMonitoring(
            MonitoringHeaderEnum.SHOW_INDICATORS,
            IndicatorEnum.BATTERY_STATUS,
            examId
          )"
                >
                    <div class="d-flex align-center">
                        <!-- Icon Box -->
                        <div
                            class="mr-3 d-flex align-center justify-center"
                            style="width: 52px; height: 52px; border-radius: 10px; padding: 8px;"
                            :style="{ backgroundColor: getIndicatorIconBackground('BATTERY_STATUS') }"
                        >
                            <v-icon size="28" :color="getIndicatorIconColor('BATTERY_STATUS')">
                                mdi-battery-alert-variant-outline
                            </v-icon>
                        </div>

                        <div>
                            <div class="text-body-2 font-weight-bold text-grey-darken-1">
                                {{ translate('BATTERY_STATUS') }}
                            </div>
                            <div class="font-weight-bold text-body-1">
                                {{ translate("monitoringOverview.indicators.batteryStatusInfo") }}
                            </div>
                        </div>
                    </div>

                    <v-avatar size="45" :color="getIndicatorAvatarColor('BATTERY_STATUS')">
            <span class="text-white text-subtitle-1 font-weight-bold">
              {{ indicators.BATTERY_STATUS?.incident ?? 0 }}
            </span>
                    </v-avatar>
                </v-card>

                <!-- WLAN Status -->
                <v-card
                    class="rounded-lg mb-3 px-4 py-3 d-flex align-center justify-space-between"
                    variant="flat"
                    :hover="true"
                    :ripple="false"
                    :color="getIndicatorCardBackground('WLAN_STATUS')"
                    @click="monitoringViewService.goToMonitoring(
            MonitoringHeaderEnum.SHOW_INDICATORS,
            IndicatorEnum.WLAN_STATUS,
            examId
          )"
                >
                    <div class="d-flex align-center">
                        <!-- Icon Box -->
                        <div
                            class="mr-3 d-flex align-center justify-center"
                            style="width: 52px; height: 52px; border-radius: 10px; padding: 8px;"
                            :style="{ backgroundColor: getIndicatorIconBackground('WLAN_STATUS') }"
                        >
                            <v-icon size="28" :color="getIndicatorIconColor('WLAN_STATUS')">
                                mdi-wifi-alert
                            </v-icon>
                        </div>

                        <div>
                            <div class="text-body-2 font-weight-bold text-grey-darken-1">
                                {{ translate('WLAN_STATUS') }}
                            </div>
                            <div class="font-weight-bold text-body-1">
                                {{ translate("monitoringOverview.indicators.wlanStatusInfo") }}
                            </div>
                        </div>
                    </div>

                    <v-avatar size="45" :color="getIndicatorAvatarColor('WLAN_STATUS')">
            <span class="text-white text-subtitle-1 font-weight-bold">
              {{ indicators.WLAN_STATUS?.incident ?? 0 }}
            </span>
                    </v-avatar>
                </v-card>
            </template>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { IndicatorEnum, MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { translate } from "@/utils/generalUtils";
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";

const examId = useRoute().params.examId.toString();
const monitoringStore = useMonitoringStore();
const indicators = monitoringStore.monitoringOverviewData?.indicators;

function getIndicatorCardBackground(key: string): string {
    return getIndicatorIconBackground(key);
}


function getIndicatorIconColor(key: string): string {
    const hasColor = null //todo add colors
    console.log("fsdfas" , indicators?.BATTERY_STATUS?.color)
    switch (key) {
        case "BATTERY_STATUS":
            return hasColor ? "#E53935" : "#000000";
        case "WLAN_STATUS":
            return hasColor ? "#F9A825" : "#000000";
        default:
            return "#000000";
    }
}

function getIndicatorIconBackground(key: string): string {
    const hasColor = null //todo add colors
    switch (key) {
        case "BATTERY_STATUS":
            return hasColor ? "#FFEBEE" : "#f0f0f0";
        case "WLAN_STATUS":
            return hasColor ? "#FFF8E1" : "#f0f0f0";
        default:
            return "#f0f0f0";
    }
}

function getIndicatorAvatarColor(key: string): string {
    const hasColor = null //todo add colors
    switch (key) {
        case "BATTERY_STATUS":
            return hasColor ? "#E53935" : "#BDBDBD";
        case "WLAN_STATUS":
            return hasColor ? "#F9A825" : "#BDBDBD";
        default:
            return "#BDBDBD";
    }
}
</script>
