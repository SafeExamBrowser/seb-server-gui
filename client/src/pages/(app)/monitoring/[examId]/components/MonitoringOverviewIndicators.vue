<template>
    <v-card border elevation="1" rounded="lg" class="h-100 d-flex flex-column">
        <div class="d-flex align-center px-5 py-4 bg-background">
            <span class="text-body-medium font-weight-bold">
                {{ $t("monitoringOverview.indicators.indicators") }}
            </span>
        </div>
        <v-divider />

        <div class="flex-grow-1 pa-5">
            <template
                v-for="(indicator, index) in indicators"
                :key="indicator.type"
            >
                <v-divider v-if="index > 0" />
                <v-hover v-slot="{ isHovering, props: hoverProps }">
                    <div
                        v-bind="hoverProps"
                        class="d-flex align-center ga-3 px-2 py-3 rounded-lg"
                        :class="isHovering ? 'bg-background' : ''"
                        :style="{ cursor: 'pointer' }"
                        @click="
                            goToMonitoring(
                                MonitoringHeaderEnum.SHOW_INDICATORS,
                                indicator.type,
                                examId,
                            )
                        "
                    >
                        <v-avatar color="#f0f0f0" size="42" rounded="lg">
                            <v-icon color="#000000" size="22">
                                {{ indicator.icon }}
                            </v-icon>
                        </v-avatar>

                        <div class="flex-grow-1">
                            <div class="text-body-medium font-weight-bold">
                                {{ translate(indicator.type) }}
                            </div>
                            <div class="text-body-small text-medium-emphasis">
                                {{ translate(indicator.info) }}
                            </div>
                        </div>

                        <v-avatar color="#BDBDBD" size="36">
                            <span
                                class="text-body-medium font-weight-bold text-white"
                            >
                                {{ indicator.count }}
                            </span>
                        </v-avatar>
                    </div>
                </v-hover>
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

import {
    IndicatorEnum,
    MonitoringHeaderEnum,
} from "@/models/seb-server/monitoringEnums.ts";
import { goToMonitoring } from "@/pages/(app)/monitoring/[examId]/composables/useMonitoringNavigation.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { translate } from "@/utils/generalUtils.ts";

const props = defineProps<{
    examId: string;
}>();

const examId = props.examId;
const monitoringStore = useMonitoringStore();

const indicators = computed(() => {
    const data = monitoringStore.monitoringOverviewData?.indicators;
    if (data == null) {
        return [];
    }

    const result: {
        type: IndicatorEnum;
        icon: string;
        info: string;
        count: number;
    }[] = [];

    if (data.BATTERY_STATUS != null) {
        result.push({
            type: IndicatorEnum.BATTERY_STATUS,
            icon: "mdi-battery-alert-variant-outline",
            info: "monitoringOverview.indicators.batteryStatusInfo",
            count: getIndicatorNumber(
                data.BATTERY_STATUS.incident,
                data.BATTERY_STATUS.warning,
            ),
        });
    }

    if (data.WLAN_STATUS != null) {
        result.push({
            type: IndicatorEnum.WLAN_STATUS,
            icon: "mdi-wifi-alert",
            info: "monitoringOverview.indicators.wlanStatusInfo",
            count: getIndicatorNumber(
                data.WLAN_STATUS.incident,
                data.WLAN_STATUS.warning,
            ),
        });
    }

    return result;
});

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
