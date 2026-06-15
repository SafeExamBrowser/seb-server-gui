<template>
    <div class="d-flex flex-column h-100">
        <div class="flex-grow-1 overflow-y-auto pa-5 d-flex flex-column ga-4">
            <!-- client name -->
            <div class="d-flex flex-column ga-1">
                <span
                    class="text-body-small font-weight-bold text-uppercase text-medium-emphasis"
                >
                    {{ $t("monitoringDetails.info.client") }}
                </span>
                <span
                    v-for="(part, index) in nameParts"
                    :key="index"
                    :class="
                        index === 0
                            ? 'text-primary'
                            : 'text-body-medium font-weight-medium text-medium-emphasis'
                    "
                    :style="index === 0 ? clientNameStyle : undefined"
                >
                    {{ part }}
                </span>
            </div>

            <!-- status -->
            <v-chip
                v-if="currentStatus"
                :color="getConnectionStatusColor(currentStatus)"
                class="w-100 font-weight-bold"
                label
                size="large"
                variant="tonal"
            >
                <v-icon
                    :icon="getConnectionStatusIcon(currentStatus)"
                    size="18"
                    start
                />
                {{ translate(currentStatus) }}
            </v-chip>

            <!-- groups -->
            <div
                v-if="monitoringStore.clientGroupsSingle.length > 0"
                class="d-flex flex-column ga-2"
            >
                <span
                    class="text-body-small font-weight-bold text-uppercase text-medium-emphasis"
                >
                    {{ $t("monitoringDetails.info.groups") }}
                </span>
                <div class="d-flex flex-wrap ga-2">
                    <v-chip
                        v-for="clientGroup in monitoringStore.clientGroupsSingle"
                        :key="clientGroup.id"
                        size="small"
                        variant="tonal"
                    >
                        {{ clientGroup.name }}
                    </v-chip>
                </div>
            </div>

            <!-- SEB info -->
            <div v-if="sebInfoParts.length > 0" class="d-flex flex-column ga-2">
                <span
                    class="text-body-small font-weight-bold text-uppercase text-medium-emphasis"
                >
                    {{ $t("monitoringDetails.info.sebInfo") }}
                </span>
                <div class="d-flex flex-wrap ga-2">
                    <v-chip
                        v-for="(info, index) in sebInfoParts"
                        :key="index"
                        color="surface-light"
                        size="small"
                        variant="flat"
                    >
                        {{ info }}
                    </v-chip>
                </div>
            </div>

            <!-- indicators -->
            <template v-if="showIndicators">
                <v-divider />
                <div class="d-flex flex-column ga-1">
                    <span
                        class="text-body-small font-weight-bold text-uppercase text-medium-emphasis"
                    >
                        {{ $t("monitoringDetails.info.indicators") }}
                    </span>
                    <div
                        v-for="indicator in filteredIndicators"
                        :key="indicator.id"
                        class="d-flex align-center ga-3 py-2"
                    >
                        <v-sheet
                            color="background"
                            rounded="lg"
                            class="d-flex align-center justify-center flex-shrink-0"
                            height="30"
                            width="30"
                        >
                            <v-icon
                                :color="indicator.color"
                                :icon="indicator.icon"
                            />
                        </v-sheet>
                        <span class="flex-grow-1 text-body-medium">
                            {{ indicator.name }}
                        </span>
                        <span class="text-body-medium font-weight-bold">
                            {{ indicator.displayValue }}
                        </span>
                    </div>
                </div>
            </template>

            <!-- notifications -->
            <template v-if="hasNotifications">
                <v-divider />
                <div ref="notificationsRef" class="d-flex flex-column ga-2">
                    <span
                        class="text-body-small font-weight-bold text-uppercase text-medium-emphasis"
                    >
                        {{ $t("monitoringDetails.main.notifications") }}
                    </span>

                    <!-- raised hand -->
                    <v-card
                        v-if="raiseHandNotification != null"
                        class="pa-3"
                        color="primary"
                        rounded="lg"
                        variant="tonal"
                    >
                        <div class="d-flex align-center ga-2 mb-1">
                            <v-icon
                                color="primary"
                                icon="mdi-hand-back-right"
                                size="20"
                            />
                            <span class="text-body-medium font-weight-bold">
                                {{ $t("monitoringDetails.main.raiseHand") }}
                            </span>
                        </div>
                        <div class="text-body-small mb-3">
                            {{ raiseHandNotification.text }}
                        </div>
                        <v-btn
                            block
                            color="primary"
                            :loading="resolveRaiseHandSent"
                            size="small"
                            variant="flat"
                            @click="
                                confirmNotification(
                                    raiseHandNotification.id.toString(),
                                )
                            "
                        >
                            {{ $t("monitoringDetails.main.resolveRaiseHand") }}
                        </v-btn>
                    </v-card>

                    <!-- lock screen messages -->
                    <v-card
                        v-for="message in messages"
                        :key="message.id"
                        class="pa-3"
                        color="primary"
                        rounded="lg"
                        variant="tonal"
                    >
                        <div class="d-flex align-center ga-2 mb-1">
                            <v-icon
                                color="primary"
                                icon="mdi-monitor-lock"
                                size="20"
                            />
                            <span class="text-body-medium font-weight-bold">
                                {{ $t("monitoringDetails.main.lockScreen") }}
                            </span>
                        </div>
                        <div class="text-body-small mb-3">
                            {{ message.text }}
                        </div>
                        <v-btn
                            block
                            color="primary"
                            :loading="resolveLockScreenSent"
                            size="small"
                            variant="flat"
                            @click="confirmNotification(message.id.toString())"
                        >
                            {{ $t("monitoringDetails.main.unlockScreen") }}
                        </v-btn>
                    </v-card>
                </div>
            </template>
        </div>

        <!-- actions -->
        <div class="flex-shrink-0">
            <v-divider />
            <div class="px-5 py-4 d-flex flex-column ga-2">
                <v-btn
                    block
                    color="black"
                    :disabled="!canLockScreen()"
                    height="44"
                    prepend-icon="mdi-monitor-lock"
                    variant="outlined"
                    @click="
                        openInstructionConfirmDialog(
                            InstructionEnum.SEB_FORCE_LOCK_SCREEN,
                        )
                    "
                >
                    {{ $t("monitoringDetails.info.lock") }}
                </v-btn>
                <v-btn
                    block
                    color="black"
                    :disabled="
                        !connectionStateBehavior[currentStatus || 'UNKNOWN']
                            ?.quit
                    "
                    height="44"
                    prepend-icon="mdi-backspace-outline"
                    variant="outlined"
                    @click="
                        openInstructionConfirmDialog(InstructionEnum.SEB_QUIT)
                    "
                >
                    {{ $t("monitoringDetails.info.quit") }}
                </v-btn>
                <v-btn
                    block
                    color="error"
                    :disabled="
                        !connectionStateBehavior[currentStatus || 'UNKNOWN']
                            ?.cancel
                    "
                    height="44"
                    prepend-icon="mdi-cancel"
                    variant="flat"
                    @click="
                        openInstructionConfirmDialog(
                            InstructionEnum.SEB_MARK_AS_CANCELLED,
                        )
                    "
                >
                    {{ $t("monitoringDetails.info.mark-cancelled") }}
                </v-btn>
            </div>
        </div>

        <v-dialog v-model="instructionConfirmDialog" max-width="600">
            <InstructionConfirmDialog
                :exam-id="examId"
                :connection-tokens="connectionToken"
                :instruction-type="selectedInstructionType"
                :is-cancel-instruction="isSelectedInstructionCancel"
                @close-instruction-confirm-dialog="
                    closeInstructionConfirmDialog
                "
            />
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch, type CSSProperties } from "vue";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import * as generalUtils from "@/utils/generalUtils.ts";
import { translate } from "@/utils/generalUtils.ts";
import { getConnectionStatusColor } from "@/utils/monitoringUtils.ts";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import { InstructionEnum } from "@/models/seb-server/instructionEnum.ts";
import {
    IndicatorEnum,
    NotificationEnum,
} from "@/models/seb-server/monitoringEnums.ts";
import InstructionConfirmDialog from "@/pages/(app)/monitoring/[examId]/client/components/InstructionConfirmDialog.vue";

const props = defineProps<{
    examId: string;
    connectionToken: string;
}>();

const emit = defineEmits<{
    (e: "updatePageInfo"): void;
}>();

// route params
const examId = props.examId;
const connectionToken = props.connectionToken;

// stores
const monitoringStore = useMonitoringStore();

// slightly larger, heavier client name than the M3 title-medium token
const clientNameStyle: CSSProperties = {
    fontSize: "1.125rem",
    fontWeight: 800,
};

// instruction confirm dialog
const instructionConfirmDialog = ref<boolean>(false);
const selectedInstructionType = ref<InstructionEnum | null>(null);
const isSelectedInstructionCancel = ref<boolean>(false);

//= ==============instruction confirm dialog====================
function openInstructionConfirmDialog(instructionType: InstructionEnum) {
    selectedInstructionType.value = instructionType;
    instructionConfirmDialog.value = true;
    isSelectedInstructionCancel.value =
        instructionType === InstructionEnum.SEB_MARK_AS_CANCELLED;
}

function closeInstructionConfirmDialog() {
    instructionConfirmDialog.value = false;
    emit("updatePageInfo");
}

//= ==============pending notifications====================
const resolveRaiseHandSent = ref<boolean>(false);
const resolveLockScreenSent = ref<boolean>(false);
const notificationsRef = ref<HTMLElement>();

const raiseHandNotification = computed(
    () =>
        monitoringStore.pendingNotifications.find(
            (item) => item.notificationType === NotificationEnum.RAISE_HAND,
        ) ?? null,
);

const messages = computed(() =>
    monitoringStore.pendingNotifications.filter(
        (item) => item.notificationType !== NotificationEnum.RAISE_HAND,
    ),
);

const hasNotifications = computed(
    () => raiseHandNotification.value != null || messages.value.length > 0,
);

const notificationCount = computed(
    () => (raiseHandNotification.value != null ? 1 : 0) + messages.value.length,
);

// scroll a freshly arrived notification into view within the panel
watch(notificationCount, (count, previousCount) => {
    if (count > (previousCount ?? 0)) {
        nextTick(() => {
            notificationsRef.value?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        });
    }
});

async function confirmNotification(notificationId: string) {
    await monitoringService.confirmNotification(
        examId,
        notificationId,
        connectionToken,
    );
    emit("updatePageInfo");
}

//= ==============split name in parts====================
const nameParts = computed(() => {
    const rawName =
        monitoringStore.selectedSingleConn?.cdat.examUserSessionId || "";
    return rawName.split("|").filter((p) => p.trim() !== "");
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

function canLockScreen(): boolean {
    const hasLS =
        monitoringStore.pendingNotifications.find(
            (item) => item.notificationType === NotificationEnum.LOCK_SCREEN,
        ) ?? null;

    if (hasLS != null) {
        return false;
    }

    return connectionStateBehavior[currentStatus.value || "UNKNOWN"]?.lock;
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
            return !(def.type === IndicatorEnum.WLAN_STATUS && !behavior.wlan);
            // always show other indicators
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

const showIndicators = computed(
    () =>
        filteredIndicators.value.length > 0 &&
        currentStatus.value !== ConnectionStatusEnum.CLOSED &&
        currentStatus.value !== ConnectionStatusEnum.DISABLED,
);

function getConnectionStatusIcon(connectionStatus: string | null): string {
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
    [IndicatorEnum.LAST_PING]: {
        icon: "mdi-network-strength-2",
        unit: "s ago",
    },
    [IndicatorEnum.ERROR_COUNT]: { icon: "mdi-alert-circle", color: "red" },
    [IndicatorEnum.WARN_COUNT]: { icon: "mdi-alert", color: "orange" },
    [IndicatorEnum.INFO_COUNT]: { icon: "mdi-information", color: "blue" },
    [IndicatorEnum.WLAN_STATUS]: { icon: "mdi-wifi", color: "green" },
};
</script>
