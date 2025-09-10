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
                    :color="
                        getBatteryStatusColor(
                            monitoringStore.monitoringOverviewData.indicators
                                .BATTERY_STATUS?.color,
                        )
                    "
                    :hover="true"
                    :ripple="false"
                    variant="flat"
                    @click="
                        monitoringViewService.goToMonitoring(
                            MonitoringHeaderEnum.SHOW_INDICATORS,
                            IndicatorEnum.BATTERY_STATUS,
                            examId,
                        )
                    "
                >
                    <div class="d-flex align-center">
                        <!-- Icon Box -->
                        <div
                            class="mr-3 d-flex align-center justify-center"
                            style="
                                width: 52px;
                                height: 52px;
                                border-radius: 10px;
                                padding: 8px;
                                background-color: #f0f0f0;
                            "
                        >
                            <v-icon color="#000000" size="28">
                                mdi-battery-alert-variant-outline
                            </v-icon>
                        </div>

                        <div>
                            <div class="text-body-2 font-weight-bold">
                                {{ translate("BATTERY_STATUS") }}
                            </div>
                            <div class="font-weight-bold text-body-1">
                                {{
                                    translate(
                                        "monitoringOverview.indicators.batteryStatusInfo",
                                    )
                                }}
                            </div>
                        </div>
                    </div>

                    <v-avatar color="#BDBDBD" size="45">
                        <span
                            class="text-white text-subtitle-1 font-weight-bold"
                        >
                            {{
                                getIndicatorNumber(
                                    monitoringStore.monitoringOverviewData
                                        .indicators.BATTERY_STATUS?.incident,
                                    monitoringStore.monitoringOverviewData
                                        .indicators.BATTERY_STATUS?.warning,
                                )
                            }}
                        </span>
                    </v-avatar>
                </v-card>

                <!-- WLAN Status -->
                <v-card
                    class="rounded-lg mb-3 px-4 py-3 d-flex align-center justify-space-between"
                    :color="
                        getWLANStatusColor(
                            monitoringStore.monitoringOverviewData.indicators
                                .WLAN_STATUS?.color,
                        )
                    "
                    :hover="true"
                    :ripple="false"
                    variant="flat"
                    @click="
                        monitoringViewService.goToMonitoring(
                            MonitoringHeaderEnum.SHOW_INDICATORS,
                            IndicatorEnum.WLAN_STATUS,
                            examId,
                        )
                    "
                >
                    <div class="d-flex align-center">
                        <!-- Icon Box -->
                        <div
                            class="mr-3 d-flex align-center justify-center"
                            style="
                                width: 52px;
                                height: 52px;
                                border-radius: 10px;
                                padding: 8px;
                                background-color: #f0f0f0;
                            "
                        >
                            <v-icon color="#000000" size="28">
                                mdi-wifi-alert
                            </v-icon>
                        </div>

                        <div>
                            <div class="text-body-2 font-weight-bold">
                                {{ translate("WLAN_STATUS") }}
                            </div>
                            <div class="font-weight-bold text-body-1">
                                {{
                                    translate(
                                        "monitoringOverview.indicators.wlanStatusInfo",
                                    )
                                }}
                            </div>
                        </div>
                    </div>

                    <v-avatar color="#BDBDBD" size="45">
                        <span
                            class="text-white text-subtitle-1 font-weight-bold"
                        >
                            {{
                                getIndicatorNumber(
                                    monitoringStore.monitoringOverviewData
                                        .indicators.WLAN_STATUS?.incident,
                                    monitoringStore.monitoringOverviewData
                                        .indicators.WLAN_STATUS?.warning,
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
import {
    IndicatorEnum,
    MonitoringHeaderEnum,
} from "@/models/seb-server/monitoringEnums";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { translate } from "@/utils/generalUtils";
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";

const examId = useRoute().params.examId.toString();
const monitoringStore = useMonitoringStore();

function getBatteryStatusColor(color: string | undefined): string {
    if (color == null) {
        return monitoringStore.batteryStatusDefaultColor ?? "#f0f0f0";
    }

    return "#" + color;
}

function getWLANStatusColor(color: string | undefined): string {
    if (color == null) {
        return monitoringStore.wlanStatusDefaultColor ?? "#f0f0f0";
    }

    return "#" + color;
}

function getIndicatorNumber(
    incident: number | undefined,
    warning: number | undefined,
): number {
    let num = 0;
    if (incident != null && incident > 0) {
        num = incident;
    }

    if (warning != null && warning > 0) {
        num += warning;
    }

    return num;
}
</script>
