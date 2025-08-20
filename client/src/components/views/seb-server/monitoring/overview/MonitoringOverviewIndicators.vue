<template>
    <v-row>
        <v-col cols="12">
            <template v-if="monitoringStore.monitoringOverviewData?.indicators">
                <div class="text-h6 font-weight-bold mb-4">
                    {{ translate("monitoringOverview.indicators.indicators") }}
                </div>

                <!-- Battery Status -->
                <v-card
                    class="rounded-lg mb-3 px-4 py-3 d-flex align-center justify-space-between"
                    variant="flat"
                    :hover="true"
                    :ripple="false"
                    :color="getBatteryStatusColor(monitoringStore.monitoringOverviewData.indicators.BATTERY_STATUS?.color)"
                    @click="monitoringViewService.goToMonitoring(MonitoringHeaderEnum.SHOW_INDICATORS, IndicatorEnum.BATTERY_STATUS, examId)">
                    <div class="d-flex align-center">
                        <!-- Icon Box -->
                        <div
                            class="mr-3 d-flex align-center justify-center"
                            style="width: 52px; height: 52px; border-radius: 10px; padding: 8px; background-color: #f0f0f0"
                        >
                            <v-icon size="28" color="#000000">
                                mdi-battery-alert-variant-outline
                            </v-icon>
                        </div>

                        <div>
                            <div class="text-body-2 font-weight-bold">
                                {{ translate('BATTERY_STATUS') }}
                            </div>
                            <div class="font-weight-bold text-body-1">
                                {{ translate("monitoringOverview.indicators.batteryStatusInfo") }}
                            </div>
                        </div>
                    </div>

                    <v-avatar size="45" color="#BDBDBD">
                        <span class="text-white text-subtitle-1 font-weight-bold">
                        {{ getIndicatorNumber(
                                monitoringStore.monitoringOverviewData.indicators.BATTERY_STATUS?.incident,
                                monitoringStore.monitoringOverviewData.indicators.BATTERY_STATUS?.warning,
                            ) 
                        }}
                        </span>
                    </v-avatar>
                </v-card>

                <!-- WLAN Status -->
                <v-card
                    class="rounded-lg mb-3 px-4 py-3 d-flex align-center justify-space-between"
                    variant="flat"
                    :hover="true"
                    :ripple="false"
                    :color="getWLANStatusColor(monitoringStore.monitoringOverviewData.indicators.WLAN_STATUS?.color)"
                    @click="monitoringViewService.goToMonitoring(MonitoringHeaderEnum.SHOW_INDICATORS, IndicatorEnum.WLAN_STATUS, examId)"
                >
                    <div class="d-flex align-center">
                        <!-- Icon Box -->
                        <div
                            class="mr-3 d-flex align-center justify-center"
                            style="width: 52px; height: 52px; border-radius: 10px; padding: 8px; background-color: #f0f0f0"
                        >
                            <v-icon size="28" color="#000000">
                                mdi-wifi-alert
                            </v-icon>
                        </div>

                        <div>
                            <div class="text-body-2 font-weight-bold">
                                {{ translate('WLAN_STATUS') }}
                            </div>
                            <div class="font-weight-bold text-body-1">
                                {{ translate("monitoringOverview.indicators.wlanStatusInfo") }}
                            </div>
                        </div>
                    </div>

                    <v-avatar size="45" color="#BDBDBD">
                        <span class="text-white text-subtitle-1 font-weight-bold">
                            {{ getIndicatorNumber(
                                    monitoringStore.monitoringOverviewData.indicators.WLAN_STATUS?.incident,
                                    monitoringStore.monitoringOverviewData.indicators.WLAN_STATUS?.warning,
                                ) 
                            }}
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
import * as indicatorService from "@/services/seb-server/component-services/indicatorViewService";

const examId = useRoute().params.examId.toString();
const monitoringStore = useMonitoringStore();
let batteryStatusDefaultColor: string | null = null;
let wlanStatusDefaultColor: string | null = null;

onBeforeMount(async () => {
    await getIndicatorData();
    batteryStatusDefaultColor = getBatteryStatusDefaultColor();
    wlanStatusDefaultColor = getWLANStatusDefaultColor();
});

async function getIndicatorData() {
    const indicatorResponse: Indicators | null = await indicatorService.getIndicators(examId);
    if (!indicatorResponse) 
        return;

    monitoringStore.indicators = indicatorResponse;
}

function getBatteryStatusDefaultColor(): string {
    if (monitoringStore.indicators?.content) {
        for (var indicator of monitoringStore.indicators?.content) {
            if (indicator.type == "BATTERY_STATUS") {
                if (indicator.color) {
                    return "#" + indicator.color
                }
            }
        }
    }

    return "#f0f0f0";
}

function getWLANStatusDefaultColor(): string {
    if (monitoringStore.indicators?.content) {
        for (var indicator of monitoringStore.indicators?.content) {
            if (indicator.type == "WLAN_STATUS") {
                if (indicator.color) {
                    return "#" + indicator.color
                }
            }
        }
    }
    
    return "#f0f0f0";
}

function getBatteryStatusColor(color: string | undefined): string {
    if(color == null) {
        return batteryStatusDefaultColor ?? "#f0f0f0";
    }

    return "#" + color;
}

function getWLANStatusColor(color: string | undefined): string {
    if(color == null){
        return wlanStatusDefaultColor ?? "#f0f0f0";
    }

    return "#" + color;
}

function getIndicatorNumber(incident: number | undefined, warning: number | undefined): number {
    if (incident != null && incident > 0) {
        return incident;
    }

    if (warning != null && warning > 0) {
        return warning;
    }

    return 0;
}

</script>
