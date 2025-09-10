<template>
    <!-- Path -->
    <v-row style="background-color: #fffffe">
        <div class="path-text ml-10 mt-4">
            <span
                class="monitoring-link"
                @click="navigateTo(constants.MONITORING_ROUTE)"
            >
                {{ translate("titles.monitoring") }}
            </span>
            &nbsp;>&nbsp;

            <span
                class="exam-name"
                @click="
                    navigateTo(
                        constants.MONITORING_CLIENTS_ROUTE + '/' + examId,
                        monitoringStore.currentMonitoringQuery,
                    )
                "
            >
                {{ monitoringStore.selectedExam?.quizName }}
            </span>
        </div>
    </v-row>

    <v-row style="background-color: #fffffe">
        <!-- User Name -->
        <v-col cols="12" md="3">
            <!-- Name split across lines -->
            <div v-if="nameParts.length" class="top-container ml-10">
                <div
                    v-for="(part, index) in nameParts"
                    :key="index"
                    class="name-part"
                >
                    {{ part }}
                </div>
            </div>
        </v-col>

        <!--TODO check with christina on design -->
        <v-col class="user-info-col" cols="12" md="3">
            <div class="top-container">
                <!-- Status -->
                <div v-if="currentStatus">
                    <v-card
                        class="rounded-lg pa-2 text-center"
                        :color="getConnectionStatusColor(currentStatus)"
                        max-width="130"
                        variant="flat"
                    >
                        <v-row>
                            <v-col class="text-body-3">
                                {{ translate(currentStatus) }}
                            </v-col>
                            <v-col align="right">
                                <v-icon
                                    :icon="
                                        getConnectionStatusIcon(currentStatus)
                                    "
                                ></v-icon>
                            </v-col>
                        </v-row>
                    </v-card>
                </div>

                <!-- Group -->
                <div class="mt-2 d-flex align-center flex-wrap group-container">
                    <span class="group-label mr-2">Group:</span>
                    <v-chip
                        v-for="clientGroup in monitoringStore.clientGroupsSingle"
                        :key="clientGroup.id"
                        class="mr-1 pl-5 pr-5 text-body-4"
                        size="default"
                        variant="tonal"
                    >
                        {{ clientGroup.name }}
                    </v-chip>
                </div>

                <!-- SEB info tags -->
                <div class="mt-2">
                    <v-chip
                        v-for="(info, index) in sebInfoParts"
                        :key="index"
                        class="mr-1 mb-1 text-body-3"
                        size="default"
                        variant="outlined"
                    >
                        {{ info }}
                    </v-chip>
                </div>
            </div>
        </v-col>

        <!-- Indicators -->
        <v-col cols="12" md="3">
            <v-card
                v-if="
                    filteredIndicators.length > 0 &&
                    currentStatus !== ConnectionStatusEnum.CLOSED &&
                    currentStatus !== ConnectionStatusEnum.DISABLED
                "
                class="ml-4 top-container pa-3"
                style="
                    height: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    align-content: flex-start;
                "
            >
                <div
                    v-for="indicator in filteredIndicators"
                    :key="indicator.id"
                    class="indicator-item d-flex align-center mb-5 mt-5"
                    style="width: 33%"
                >
                    <v-icon
                        class="mr-1"
                        :color="indicator.color"
                        :icon="indicator.icon"
                    />
                    <span>{{ indicator.displayValue }}</span>
                </div>
            </v-card>
        </v-col>

        <!-- Action Buttons -->
        <v-col class="button-col" cols="12" md="3">
            <div
                class="top-container d-flex flex-column align-end justify-center h-100 mr-5"
            >
                <v-btn
                    class="action-btn mb-2"
                    color="black"
                    :disabled="
                        !connectionStateBehavior[currentStatus || 'UNKNOWN']
                            ?.cancel
                    "
                    prepend-icon="mdi-monitor-lock"
                    rounded="sm"
                    variant="outlined"
                    @click="
                        openInstructionConfirmDialog(
                            InstructionEnum.SEB_MARK_AS_CANCELLED,
                        )
                    "
                >
                    {{ translate("monitoringDetails.info.mark-cancelled") }}
                </v-btn>

                <v-btn
                    class="action-btn mb-2"
                    color="black"
                    :disabled="
                        !connectionStateBehavior[currentStatus || 'UNKNOWN']
                            ?.lock
                    "
                    prepend-icon="mdi-monitor-lock"
                    rounded="sm"
                    variant="outlined"
                    @click="
                        openInstructionConfirmDialog(
                            InstructionEnum.SEB_FORCE_LOCK_SCREEN,
                        )
                    "
                >
                    {{ translate("monitoringDetails.info.lock") }}
                </v-btn>

                <v-btn
                    class="action-btn"
                    color="black"
                    :disabled="
                        !connectionStateBehavior[currentStatus || 'UNKNOWN']
                            ?.quit
                    "
                    prepend-icon="mdi-backspace-outline"
                    rounded="sm"
                    variant="outlined"
                    @click="
                        openInstructionConfirmDialog(InstructionEnum.SEB_QUIT)
                    "
                >
                    {{ translate("monitoringDetails.info.quit") }}
                </v-btn>
            </div>
        </v-col>
    </v-row>

    <v-row class="pb-4 pr-4 pl-4" style="background-color: #fffffe">
        <v-col class="d-flex justify-start">
            <v-icon
                icon="mdi-arrow-left"
                @click="
                    navigateTo(
                        constants.MONITORING_CLIENTS_ROUTE + '/' + examId,
                        monitoringStore.currentMonitoringQuery,
                    )
                "
            />
        </v-col>
    </v-row>

    <v-dialog v-model="instructionConfirmDialog" max-width="600">
        <InstructionConfirmDialog
            :connection-tokens="connectionToken"
            :instruction-type="selectedInstructionType"
            :is-cancel-instruction="isSelectedInstructionCancel"
            @close-instruction-confirm-dialog="closeInstructionConfirmDialog"
        />
    </v-dialog>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import * as generalUtils from "@/utils/generalUtils";
import { translate } from "@/utils/generalUtils";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum";
import { InstructionEnum } from "@/models/seb-server/instructionEnum";
import { navigateTo } from "@/router/navigation";
import * as constants from "@/utils/constants";
import { IndicatorEnum } from "@/models/seb-server/monitoringEnums";

// route params
const examId = useRoute().params.examId.toString();
const connectionToken = useRoute().params.connectionToken.toString();

// stores
const monitoringStore = useMonitoringStore();

// instruction confirm dialog
const instructionConfirmDialog = ref<boolean>(false);
const selectedInstructionType = ref<InstructionEnum | null>(null);
const isSelectedInstructionCancel = ref<boolean>(false);

//= ==============instruction confirm dialog====================
function openInstructionConfirmDialog(instructionType: InstructionEnum) {
    selectedInstructionType.value = instructionType;
    instructionConfirmDialog.value = true;
    isSelectedInstructionCancel.value =
        instructionType == InstructionEnum.SEB_MARK_AS_CANCELLED;
}

function closeInstructionConfirmDialog() {
    instructionConfirmDialog.value = false;
}

//= ==============split name in parts====================
const nameParts = computed(() => {
    const rawName =
        monitoringStore.selectedSingleConn?.cdat.examUserSessionId || "";
    return rawName.split(" ").filter((p) => p.trim() !== "");
});

//= ==============groups, tags, and status====================

const sebInfoParts = computed(() => {
    const rawInfo = monitoringStore.selectedSingleConn?.cdat.seb_info || "";
    return rawInfo
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p !== "");
});

const currentStatus = computed(() => {
    if (monitoringStore.selectedSingleConn?.miss) {
        return "MISSING";
    }
    return monitoringStore.selectedSingleConn?.cdat.status ?? null;
});

//= ==============indicators====================
const mergedIndicators = computed(() => {
    const definitions = monitoringStore.indicators?.content || [];
    const values = monitoringStore.selectedSingleConn?.iVal || [];

    return definitions.map((def) => {
        const valObj = values.find((v) => v.id === def.id);
        let displayValue: string | number | null = valObj ? valObj.val : null;

        if (
            def.type === IndicatorEnum.LAST_PING &&
            typeof displayValue === "number"
        ) {
            displayValue = generalUtils.formatPing(displayValue);
        } else if (displayValue !== null) {
            displayValue = `${displayValue}${indicatorTypeConfig[def.type]?.unit || ""}`;
        }

        return {
            ...def,
            rawValue: valObj ? valObj.val : null,
            displayValue,
            ...indicatorTypeConfig[def.type],
        };
    });
});

function getConnectionStatusColor(connectionStatus: String | null): string {
    if (connectionStatus == null) return "#000000";

    switch (connectionStatus) {
        case ConnectionStatusEnum.CONNECTION_REQUESTED:
            return "#d7fad9";
        case ConnectionStatusEnum.READY:
            return "#abf7af";
        case ConnectionStatusEnum.ACTIVE:
            return "#66BB6A";
        case ConnectionStatusEnum.CLOSED:
            return "#d4f7ff";
        case ConnectionStatusEnum.DISABLED:
            return "#9E9E9E";
        case ConnectionStatusEnum.MISSING:
            return "#EF5350";
        default:
            return "#000000";
    }
}

type ConnectionStateBehavior = {
    wlan: boolean;
    battery: boolean;
    quit: boolean;
    lock: boolean;
    cancel: boolean;
};

const connectionStateBehavior: Record<string, ConnectionStateBehavior> = {
    CONNECTION_REQUESTED: {
        wlan: true,
        battery: true,
        quit: true,
        lock: true,
        cancel: false,
    },
    READY: { wlan: true, battery: true, quit: true, lock: true, cancel: false },
    ACTIVE: {
        wlan: true,
        battery: true,
        quit: true,
        lock: true,
        cancel: false,
    },
    CLOSED: {
        wlan: false,
        battery: false,
        quit: false,
        lock: false,
        cancel: true,
    },
    MISSING: {
        wlan: true,
        battery: true,
        quit: false,
        lock: false,
        cancel: true,
    },
    DISABLED: {
        wlan: false,
        battery: false,
        quit: false,
        lock: false,
        cancel: false,
    },
};

const filteredIndicators = computed(() => {
    const definitions = monitoringStore.indicators?.content || [];
    const values = monitoringStore.selectedSingleConn?.iVal || [];
    const state = currentStatus.value ?? "UNKNOWN";
    const behavior = connectionStateBehavior[
        state as keyof typeof connectionStateBehavior
    ] || {
        wlan: false,
        battery: false,
        quit: false,
        lock: false,
        cancel: false,
    };

    return definitions
        .filter((def) => {
            if (def.type === IndicatorEnum.BATTERY_STATUS && !behavior.battery)
                return false;
            if (def.type === IndicatorEnum.WLAN_STATUS && !behavior.wlan)
                return false;
            return true; // always show other indicators
        })
        .map((def) => {
            const valObj = values.find((v) => v.id === def.id);
            let displayValue: string | number | null = valObj
                ? valObj.val
                : null;

            if (
                def.type === IndicatorEnum.LAST_PING &&
                typeof displayValue === "number"
            ) {
                displayValue = generalUtils.formatPing(displayValue);
            } else if (displayValue !== null) {
                displayValue = `${displayValue}${indicatorTypeConfig[def.type]?.unit || ""}`;
            }

            return {
                ...def,
                rawValue: valObj ? valObj.val : null,
                displayValue,
                ...indicatorTypeConfig[def.type],
            };
        });
});

function getConnectionStatusIcon(connectionStatus: String | null): string {
    if (connectionStatus == null) return "mdi-chevron-right";

    switch (connectionStatus) {
        case ConnectionStatusEnum.CONNECTION_REQUESTED:
            return "mdi-signal-distance-variant";
        case ConnectionStatusEnum.READY:
            return "mdi-check";
        case ConnectionStatusEnum.ACTIVE:
            return "mdi-check-underline";
        case ConnectionStatusEnum.CLOSED:
            return "mdi-close";
        case ConnectionStatusEnum.DISABLED:
            return "mdi-send-lock";
        case ConnectionStatusEnum.MISSING:
            return "mdi-signal-off";
        default:
            return "mdi-chevron-right";
    }
}

const indicatorTypeConfig: Record<
    string,
    { icon: string; unit?: string; color?: string }
> = {
    [IndicatorEnum.BATTERY_STATUS]: { icon: "mdi-battery", unit: "%" },
    [IndicatorEnum.LAST_PING]: { icon: "mdi-wifi", unit: "s ago" },
    [IndicatorEnum.ERROR_COUNT]: { icon: "mdi-alert-circle", color: "red" },
    [IndicatorEnum.WARN_COUNT]: { icon: "mdi-alert", color: "orange" },
    [IndicatorEnum.INFO_COUNT]: { icon: "mdi-information", color: "blue" },
    [IndicatorEnum.WLAN_STATUS]: { icon: "mdi-wifi", color: "green" },
};
</script>

<style scoped>
/* buttons */
.action-btn {
    min-width: 180px;
    max-width: 220px;
    width: 100%;
}

/* path */

.path-text {
    font-size: 1rem;
    margin-bottom: 1rem;
}

.monitoring-link {
    color: black;
    cursor: pointer;
}

/* name */
.exam-name {
    color: #215caf;
    cursor: pointer;
}

.top-container {
    margin-top: 1rem;
}

.name-part {
    font-size: 2rem;
    font-weight: bold;
    color: #215caf;
}

/* groups, tags and status */
.user-info-col .v-chip {
    font-size: 0.95rem;
}

/* indicators */
.indicator-item span {
    font-size: 1.1rem;
}
</style>
