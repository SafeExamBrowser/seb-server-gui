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
                <v-icon :icon="statusIcon" size="18" start />
                {{ $t(currentStatus) }}
            </v-chip>

            <!-- notifications (shown right under the status — they are important) -->
            <template v-if="hasNotifications">
                <div ref="notificationsRef" class="d-flex flex-column ga-2">
                    <span
                        class="text-body-small font-weight-bold text-uppercase text-medium-emphasis"
                    >
                        {{ $t("monitoringDetails.main.notifications") }}
                    </span>

                    <!-- raised hand -->
                    <v-card
                        v-if="raiseHandNotification"
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
                            @click="handleResolveRaiseHand"
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
                            @click="handleResolveMessage(message)"
                        >
                            {{ $t("monitoringDetails.main.unlockScreen") }}
                        </v-btn>
                    </v-card>
                </div>
                <v-divider />
            </template>

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
        </div>

        <!-- actions -->
        <div class="flex-shrink-0">
            <v-divider />
            <div class="px-5 py-4 d-flex flex-column ga-2">
                <v-btn
                    block
                    color="black"
                    :disabled="isLockDisabled"
                    height="44"
                    prepend-icon="mdi-monitor-lock"
                    variant="outlined"
                    @click="handleLockClient"
                >
                    {{ $t("monitoringDetails.info.lock") }}
                </v-btn>
                <v-btn
                    block
                    color="black"
                    :disabled="isQuitDisabled"
                    height="44"
                    prepend-icon="mdi-backspace-outline"
                    variant="outlined"
                    @click="handleQuitClient"
                >
                    {{ $t("monitoringDetails.info.quit") }}
                </v-btn>
                <v-btn
                    block
                    color="error"
                    :disabled="isCancelDisabled"
                    height="44"
                    prepend-icon="mdi-cancel"
                    variant="flat"
                    @click="handleCancelClient"
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
                    handleCloseInstructionConfirmDialog
                "
            />
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties, nextTick, ref, watch } from "vue";

import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import { InstructionEnum } from "@/models/seb-server/instructionEnum.ts";
import { ClientNotification } from "@/models/seb-server/monitoring.ts";
import {
    IndicatorEnum,
    NotificationEnum,
} from "@/models/seb-server/monitoringEnums.ts";
import InstructionConfirmDialog from "@/pages/(app)/monitoring/[examId]/client/components/InstructionConfirmDialog.vue";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as generalUtils from "@/utils/generalUtils.ts";
import { getConnectionStatusColor } from "@/utils/monitoringUtils.ts";

const props = defineProps<{
    examId: string;
    connectionToken: string;
}>();

const emit = defineEmits<{
    (e: "updatePageInfo"): void;
}>();

const examId = props.examId;
const connectionToken = props.connectionToken;

const monitoringStore = useMonitoringStore();

// slightly larger, heavier client name than the M3 title-medium token
const clientNameStyle: CSSProperties = {
    fontSize: "1.125rem",
    fontWeight: 800,
};

//= ==============connection state behavior====================
type ConnectionStateBehavior = {
    wlan: boolean;
    battery: boolean;
    quit: boolean;
    lock: boolean;
    cancel: boolean;
};

const NO_BEHAVIOR: ConnectionStateBehavior = {
    wlan: false,
    battery: false,
    quit: false,
    lock: false,
    cancel: false,
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

//= ==============client info====================
const nameParts = computed(() => {
    const rawName =
        monitoringStore.selectedSingleConn?.cdat.examUserSessionId ?? "";
    return rawName.split("|").filter((part) => part.trim() !== "");
});

const sebInfoParts = computed(() => {
    const rawInfo = monitoringStore.selectedSingleConn?.cdat.seb_info ?? "";
    return rawInfo
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part !== "");
});

const currentStatus = computed(() => {
    if (monitoringStore.selectedSingleConn?.miss) {
        return ConnectionStatusEnum.MISSING;
    }
    return monitoringStore.selectedSingleConn?.cdat.status ?? undefined;
});

const currentBehavior = computed(
    () =>
        connectionStateBehavior[currentStatus.value ?? "UNKNOWN"] ??
        NO_BEHAVIOR,
);

const connectionStatusIcons: Record<string, string> = {
    [ConnectionStatusEnum.CONNECTION_REQUESTED]: "mdi-signal-distance-variant",
    [ConnectionStatusEnum.READY]: "mdi-check",
    [ConnectionStatusEnum.ACTIVE]: "mdi-check-underline",
    [ConnectionStatusEnum.CLOSED]: "mdi-close",
    [ConnectionStatusEnum.DISABLED]: "mdi-send-lock",
    [ConnectionStatusEnum.MISSING]: "mdi-signal-off",
};

const statusIcon = computed(
    () =>
        connectionStatusIcons[currentStatus.value ?? ""] ?? "mdi-chevron-right",
);

//= ==============indicators====================
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

const filteredIndicators = computed(() => {
    const definitions = monitoringStore.indicators?.content ?? [];
    const values = monitoringStore.selectedSingleConn?.iVal ?? [];
    const behavior = currentBehavior.value;

    return definitions
        .filter((definition) => {
            if (
                definition.type === IndicatorEnum.BATTERY_STATUS &&
                !behavior.battery
            ) {
                return false;
            }
            if (
                definition.type === IndicatorEnum.WLAN_STATUS &&
                !behavior.wlan
            ) {
                return false;
            }
            return true;
        })
        .map((definition) => {
            const config = indicatorTypeConfig[definition.type];
            const valueEntry = values.find(
                (entry) => entry.id === definition.id,
            );
            let displayValue: string | number | undefined = valueEntry?.val;

            if (
                definition.type === IndicatorEnum.LAST_PING &&
                typeof displayValue === "number"
            ) {
                displayValue = generalUtils.formatPing(displayValue);
            } else if (displayValue !== undefined) {
                displayValue = `${displayValue}${config?.unit ?? ""}`;
            }

            return { ...definition, displayValue, ...config };
        });
});

const showIndicators = computed(
    () =>
        filteredIndicators.value.length > 0 &&
        currentStatus.value !== ConnectionStatusEnum.CLOSED &&
        currentStatus.value !== ConnectionStatusEnum.DISABLED,
);

//= ==============instruction confirm dialog====================
const instructionConfirmDialog = ref(false);
const selectedInstructionType = ref<InstructionEnum | null>(null);
const isSelectedInstructionCancel = ref(false);

const hasPendingLockScreen = computed(() =>
    monitoringStore.pendingNotifications.some(
        (item) => item.notificationType === NotificationEnum.LOCK_SCREEN,
    ),
);

const isLockDisabled = computed(
    () => hasPendingLockScreen.value || !currentBehavior.value.lock,
);
const isQuitDisabled = computed(() => !currentBehavior.value.quit);
const isCancelDisabled = computed(() => !currentBehavior.value.cancel);

function openInstructionConfirmDialog(instructionType: InstructionEnum) {
    selectedInstructionType.value = instructionType;
    isSelectedInstructionCancel.value =
        instructionType === InstructionEnum.SEB_MARK_AS_CANCELLED;
    instructionConfirmDialog.value = true;
}

function handleLockClient() {
    openInstructionConfirmDialog(InstructionEnum.SEB_FORCE_LOCK_SCREEN);
}

function handleQuitClient() {
    openInstructionConfirmDialog(InstructionEnum.SEB_QUIT);
}

function handleCancelClient() {
    openInstructionConfirmDialog(InstructionEnum.SEB_MARK_AS_CANCELLED);
}

function handleCloseInstructionConfirmDialog() {
    instructionConfirmDialog.value = false;
    emit("updatePageInfo");
}

//= ==============pending notifications====================
const resolveRaiseHandSent = ref(false);
const resolveLockScreenSent = ref(false);
const notificationsRef = ref<HTMLElement>();

const raiseHandNotification = computed(() =>
    monitoringStore.pendingNotifications.find(
        (item) => item.notificationType === NotificationEnum.RAISE_HAND,
    ),
);

const messages = computed(() =>
    monitoringStore.pendingNotifications.filter(
        (item) => item.notificationType !== NotificationEnum.RAISE_HAND,
    ),
);

const hasNotifications = computed(
    () =>
        raiseHandNotification.value !== undefined || messages.value.length > 0,
);

const notificationCount = computed(
    () =>
        (raiseHandNotification.value !== undefined ? 1 : 0) +
        messages.value.length,
);

// scroll a freshly arrived notification into view within the panel
watch(notificationCount, (count, previousCount) => {
    if (count > previousCount) {
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

function handleResolveRaiseHand() {
    if (raiseHandNotification.value === undefined) {
        return;
    }
    confirmNotification(raiseHandNotification.value.id.toString());
}

function handleResolveMessage(message: ClientNotification) {
    confirmNotification(message.id.toString());
}
</script>
