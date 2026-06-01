<template>
    <v-card border="thin" flat rounded="lg" class="h-100 d-flex flex-column">
        <div class="px-5 py-3 d-flex align-center">
            <span class="text-subtitle-1 font-weight-bold">
                {{ $t("monitoringOverview.indicators.indicators") }}
            </span>
        </div>
        <v-divider />

        <div class="pa-5 flex-grow-1 d-flex flex-column">
            <template
                v-for="(indicator, index) in indicators"
                :key="indicator.type"
            >
                <v-divider v-if="index > 0" class="my-1" />
                <v-hover v-slot="{ isHovering, props: hoverProps }">
                    <div
                        v-bind="hoverProps"
                        class="d-flex align-center ga-3 px-2 py-3 rounded-lg"
                        :class="isHovering ? 'bg-surface-light' : ''"
                        :style="{ cursor: 'pointer' }"
                        @click="
                            goToMonitoring(
                                MonitoringHeaderEnum.SHOW_INDICATORS,
                                indicator.type,
                                examId,
                            )
                        "
                    >
                        <div
                            class="d-flex align-center justify-center rounded-lg flex-shrink-0"
                            :style="{
                                width: '46px',
                                height: '46px',
                                backgroundColor: '#f0f0f0',
                            }"
                        >
                            <v-icon color="#000000" size="24">
                                {{ indicator.icon }}
                            </v-icon>
                        </div>

                        <div class="flex-grow-1" :style="{ minWidth: 0 }">
                            <div class="text-body-2 font-weight-bold">
                                {{ translate(indicator.type) }}
                            </div>
                            <div class="text-caption text-medium-emphasis">
                                {{ translate(indicator.info) }}
                            </div>
                        </div>

                        <v-avatar color="#BDBDBD" size="38">
                            <span
                                class="text-white text-body-2 font-weight-bold"
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
import {
    IndicatorEnum,
    MonitoringHeaderEnum,
} from "@/models/seb-server/monitoringEnums.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { translate } from "@/utils/generalUtils.ts";
import { goToMonitoring } from "../composables/useMonitoringNavigation.ts";
import { computed } from "vue";

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
