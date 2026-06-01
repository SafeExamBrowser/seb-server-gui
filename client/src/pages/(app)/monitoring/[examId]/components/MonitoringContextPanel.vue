<template>
    <div class="d-flex flex-column h-100">
        <div class="flex-grow-1 overflow-y-auto pa-5 d-flex flex-column ga-4">
            <div
                class="d-flex align-center ga-2 text-success text-body-small font-weight-bold text-uppercase"
            >
                <v-avatar
                    color="success"
                    size="8"
                    :style="{
                        opacity: blinkOn ? 1 : 0.2,
                        transition: 'opacity 0.7s ease-in-out',
                    }"
                />
                {{
                    $t("monitoringOverview.infos.live", {
                        seconds: refreshSeconds,
                    })
                }}
            </div>

            <div class="d-flex flex-column ga-1">
                <span
                    class="text-body-small font-weight-bold text-uppercase text-medium-emphasis"
                >
                    {{ $t("monitoringOverview.infos.status") }}
                </span>
                <span
                    class="d-inline-flex align-center ga-2 text-body-large font-weight-bold"
                    :style="{ color: statusColor }"
                >
                    <v-avatar :color="statusColor" size="9" />
                    {{ statusLabel }}
                </span>
            </div>

            <v-divider />

            <div class="d-flex ga-4">
                <div class="flex-grow-1 d-flex flex-column ga-1">
                    <span
                        class="text-body-small font-weight-bold text-uppercase text-medium-emphasis"
                    >
                        {{ $t("monitoringOverview.infos.start") }}
                    </span>
                    <span class="text-body-large font-weight-bold">
                        {{ startDate }}
                    </span>
                </div>
                <div class="flex-grow-1 d-flex flex-column ga-1">
                    <span
                        class="text-body-small font-weight-bold text-uppercase text-medium-emphasis"
                    >
                        {{ $t("monitoringOverview.infos.end") }}
                    </span>
                    <span class="text-body-large font-weight-bold">
                        {{ endDate }}
                    </span>
                </div>
            </div>

            <v-divider />

            <div class="d-flex flex-column ga-2">
                <span
                    class="text-body-small font-weight-bold text-uppercase text-medium-emphasis"
                >
                    {{ $t("monitoringOverview.infos.security") }}
                </span>
                <MonitoringOverviewASK />
            </div>
        </div>

        <div class="flex-shrink-0">
            <v-divider />
            <div class="px-5 py-4">
                <v-btn
                    block
                    color="error"
                    variant="flat"
                    height="44"
                    prepend-icon="mdi-power"
                    @click="openQuitAllDialog()"
                >
                    {{ $t("monitoringOverview.quitAll.button") }}
                </v-btn>
                <v-dialog v-model="quitAllDialog" max-width="800">
                    <QuitAllDialog
                        @close-quit-all-dialog="closeQuitAllDialog"
                    />
                </v-dialog>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum.ts";
import * as generalUtils from "@/utils/generalUtils.ts";
import * as timeUtils from "@/utils/timeUtils.ts";
import { quitAll } from "@/services/seb-server/monitoringService.ts";
import MonitoringOverviewASK from "./MonitoringOverviewASK.vue";
import QuitAllDialog from "./dialogs/QuitAllDialog.vue";

withDefaults(defineProps<{ refreshSeconds?: number }>(), { refreshSeconds: 5 });

const monitoringStore = useMonitoringStore();

const statusLabel = computed(() =>
    generalUtils.translate(
        generalUtils.findEnumValue(
            ExamStatusEnum,
            monitoringStore.selectedExam?.status,
        ),
    ),
);

const statusColor = computed(() =>
    generalUtils.getExamStatusFilterColor(
        generalUtils.findEnumValue(
            ExamStatusEnum,
            monitoringStore.selectedExam?.status,
        ),
    ),
);

const startDate = computed(() =>
    timeUtils.formatIsoToReadableDateTime(
        monitoringStore.selectedExam?.quizStartTime,
    ),
);

const endDate = computed(() =>
    monitoringStore.selectedExam?.quizEndTime
        ? timeUtils.formatIsoToReadableDateTime(
              monitoringStore.selectedExam.quizEndTime,
          )
        : "-",
);

const blinkOn = ref(true);
const blinkInterval = setInterval(() => {
    blinkOn.value = !blinkOn.value;
}, 700);

onUnmounted(() => {
    clearInterval(blinkInterval);
});

const quitAllDialog = ref(false);

function openQuitAllDialog() {
    quitAllDialog.value = true;
}

async function closeQuitAllDialog(apply: string) {
    if (apply === "YES") {
        quitAllDialog.value = false;
        if (monitoringStore.selectedExam != null) {
            await quitAll(monitoringStore.selectedExam.id.toString());
        }
    } else if (apply === "NO") {
        quitAllDialog.value = false;
    }
}
</script>
