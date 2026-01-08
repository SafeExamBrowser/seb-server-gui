<template>
    <!-- Raised Hand Popup  -->
    <v-row
        v-if="raiseHandNotification != null"
        class="rounded-lg pa-4 raise-hand-row mb-1"
        elevation="4"
        style="background-color: #fffffe; border: 2px solid #215caf"
    >
        <v-row align="center" justify="center">
            <v-col cols="1">
                <v-icon
                    class="ml-5"
                    icon="mdi-hand-back-right"
                    style="color: #215caf"
                ></v-icon>
            </v-col>
            <v-col>
                {{ raiseHandNotification.text }}
            </v-col>
            <v-col align="right">
                <v-btn
                    color="primary"
                    :loading="resolveRaiseHandSent"
                    rounded="sm"
                    variant="flat"
                    @click="
                        confirmNotification(raiseHandNotification.id.toString())
                    "
                >
                    {{ translate("monitoringDetails.main.resolveRaiseHand") }}
                </v-btn>
            </v-col>
        </v-row>
    </v-row>

    <!-- Messages -->
    <v-row>
        <v-col class="mb-1" cols="12">
            <template v-if="messages != null">
                <v-row
                    v-for="message in messages"
                    :key="message.id"
                    class="rounded-lg pa-4 message-card"
                    elevation="4"
                    style="background-color: #fffffe; border: 2px solid #215caf"
                >
                    <v-row align="center" justify="center">
                        <v-col cols="1">
                            <v-icon
                                icon="ml-5 mdi-monitor-lock"
                                style="color: #215caf"
                            ></v-icon>
                        </v-col>
                        <v-col>
                            {{ message.text }}
                        </v-col>
                        <v-col align="right">
                            <v-btn
                                color="primary"
                                :loading="resolveLockScreenSent"
                                rounded="sm"
                                variant="flat"
                                @click="
                                    confirmNotification(message.id.toString())
                                "
                            >
                                {{
                                    translate(
                                        "monitoringDetails.main.unlockScreen",
                                    )
                                }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-row>
            </template>

            <div v-else align="center">
                {{ translate("monitoringDetails.main.noNotifications") }}
            </div>
        </v-col>
    </v-row>

    <v-row>
        <v-col>
            <div
                class="rounded-lg pr-4 pl-4"
                elevation="4"
                style="position: relative"
            >
                <!-- Top-right toggle, shown only if screen proctoring is enabled -->
                <div
                    v-if="screenProctoringEnabled"
                    class="d-flex justify-end mb-2"
                >
                    <v-btn-toggle v-model="currentView" mandatory>
                        <v-btn color="primary" size="small" value="proctoring">
                            {{
                                translate(
                                    "monitoringDetails.main.screenProctoring",
                                )
                            }}
                        </v-btn>
                        <v-btn color="primary" size="small" value="logs">
                            {{ translate("monitoringDetails.main.clientLogs") }}
                        </v-btn>
                    </v-btn-toggle>
                </div>

                <!-- Proctoring view -->
                <div v-if="currentView === 'proctoring'" class="view-container">
                    <ProctoringViewPageOld :session-id-prop="connectionToken" />
                </div>

                <!-- Logs view -->
                <div v-else class="view-container">
                    <MonitoringClientLogsContainer>
                    </MonitoringClientLogsContainer>
                </div>
            </div>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
import { NotificationEnum } from "@/models/seb-server/monitoringEnums";
import { translate } from "@/utils/generalUtils";
import { ref, computed, watch, nextTick } from "vue";
import { useRoute } from "vue-router";
import type { ComputedRef } from "vue";
import { ClientNotification } from "@/models/seb-server/monitoring";
import ProctoringViewPageOld from "@/components/views/screen-proctoring/proctoring/ProctoringViewPageOld.vue";
import MonitoringClientLogsContainer from "@/components/views/seb-server/monitoring/client-detail/MonitoringClientLogsContainer.vue";

// route params
const examId = useRoute().params.examId.toString();
const connectionToken = useRoute().params.connectionToken.toString();

// ui control
const resolveRaiseHandSent = ref<boolean>(false);
const resolveLockScreenSent = ref<boolean>(false);

// stores
const monitoringStore = useMonitoringStore();

// attributes for switch between logs and screen proctor view
const screenProctoringEnabled = computed(() => {
    return (
        monitoringStore.selectedExam?.additionalAttributes
            .enableScreenProctoring === "true"
    );
});
const currentView = ref<"proctoring" | "logs">(
    screenProctoringEnabled.value ? "proctoring" : "logs",
);

// emits
const emit = defineEmits<{
    (e: "updatePageMain"): void;
}>();

const raiseHandNotification: ComputedRef<ClientNotification | null> = computed(
    () =>
        monitoringStore.pendingNotifications.find(
            (item) => item.notificationType === NotificationEnum.RAISE_HAND,
        ) ?? null,
);

watch(raiseHandNotification, (val) => {
    if (val) {
        resolveRaiseHandSent.value = false;
        scrollToTop();
    }
});

const messages: ComputedRef<ClientNotification[] | null> = computed(() => {
    const messages: ClientNotification[] | undefined =
        monitoringStore.pendingNotifications.filter(
            (item) => item.notificationType !== NotificationEnum.RAISE_HAND,
        );
    if (messages != null) {
        // notificationSent.value = false;
        return messages;
    }

    return null;
});

watch(raiseHandNotification, (newVal) => {
    if (newVal !== null) {
        scrollToTop();
    }
});

// Watch messages
watch(messages, (newVal) => {
    if (newVal !== null && newVal.length > 0) {
        scrollToTop();
    }
});

watch(screenProctoringEnabled, (enabled) => {
    currentView.value = enabled ? "proctoring" : "logs";
});

function scrollToTop() {
    nextTick(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
}

async function confirmNotification(notificationId: string) {
    await monitoringViewService.confirmNotification(
        examId,
        notificationId,
        connectionToken,
    );
    emit("updatePageMain");
}
</script>

<style scoped></style>
