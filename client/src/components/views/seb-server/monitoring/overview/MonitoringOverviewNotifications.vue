<template>
    <v-row>
        <!-- Notifications -->
        <v-col cols="12">
            <template
                v-if="monitoringStore.monitoringOverviewData?.notifications"
            >
                <div class="text-h6 font-weight-bold mb-4">
                    {{
                        translate(
                            "monitoringOverview.notifications.notifications",
                        )
                    }}
                </div>

                <template
                    v-for="(value, key) in monitoringStore
                        .monitoringOverviewData?.notifications"
                    :key="key"
                >
                    <v-card
                        v-if="key !== 'total'"
                        class="rounded-lg mb-3 px-4 py-3 d-flex align-center justify-space-between"
                        :color="getNotificationCardBackground(key, value)"
                        :hover="true"
                        :ripple="false"
                        variant="flat"
                        @click="
                            monitoringViewService.goToMonitoring(
                                MonitoringHeaderEnum.SHOW_NOTIFCATION,
                                generalUtils.findEnumValue(
                                    NotificationEnum,
                                    key,
                                )!,
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
                                "
                                :style="{
                                    backgroundColor:
                                        getNotificationIconBackground(
                                            key,
                                            value,
                                        ),
                                }"
                            >
                                <v-icon
                                    :color="
                                        getNotificationIconColor(key, value)
                                    "
                                    size="28"
                                >
                                    {{
                                        getNotificationIcon(
                                            generalUtils.findEnumValue(
                                                NotificationEnum,
                                                key,
                                            ),
                                        )
                                    }}
                                </v-icon>
                            </div>

                            <!-- Text -->
                            <div>
                                <div
                                    class="text-body-2 font-weight-bold text-grey-darken-1"
                                >
                                    {{ translate(key) }}
                                </div>
                                <div class="font-weight-bold text-body-1">
                                    {{
                                        key === "RAISE_HAND"
                                            ? "Students requesting assistance"
                                            : "Temporarily restricted access"
                                    }}
                                </div>
                            </div>
                        </div>

                        <!-- Count -->
                        <v-avatar
                            :color="getNotificationAvatarColor(key, value)"
                            size="45"
                        >
                            <span
                                class="text-white text-subtitle-1 font-weight-bold"
                                >{{ value }}</span
                            >
                        </v-avatar>
                    </v-card>
                </template>
            </template>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import {
    MonitoringHeaderEnum,
    NotificationEnum,
} from "@/models/seb-server/monitoringEnums";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { translate } from "@/utils/generalUtils";
import * as generalUtils from "@/utils/generalUtils";
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
import { useRoute } from "vue-router";

// exam
const examId = useRoute().params.examId.toString();

// stores
const monitoringStore = useMonitoringStore();

const NEUTRAL_BG = "#f0f0f0";
const NEUTRAL_ICON = "#000000";
const NEUTRAL_AVATAR = "#BDBDBD";

function isActiveNotification(value: unknown): boolean {
    return typeof value === "number" && value > 0;
}

function getNotificationIconColor(key: string, value: unknown): string {
    if (!isActiveNotification(value)) return NEUTRAL_ICON;
    switch (key) {
        case "RAISE_HAND":
            return "#1565C0";
        case "LOCK_SCREEN":
            return "#F9A825";
        default:
            return NEUTRAL_ICON;
    }
}

function getNotificationIconBackground(key: string, value: unknown): string {
    if (!isActiveNotification(value)) return NEUTRAL_BG;
    switch (key) {
        case "RAISE_HAND":
            return "#E3F2FD";
        case "LOCK_SCREEN":
            return "#FFF8E1";
        default:
            return NEUTRAL_BG;
    }
}

function getNotificationCardBackground(key: string, value: unknown): string {
    return getNotificationIconBackground(key, value);
}

function getNotificationAvatarColor(key: string, value: unknown): string {
    return isActiveNotification(value)
        ? getNotificationIconColor(key, value)
        : NEUTRAL_AVATAR;
}

function getNotificationIcon(notification: NotificationEnum | null): string {
    if (notification == null) return "mdi-chevron-right";
    switch (notification) {
        case NotificationEnum.LOCK_SCREEN:
            return "mdi-monitor-lock";
        case NotificationEnum.RAISE_HAND:
            return "mdi-hand-back-right";
        default:
            return "mdi-chevron-right";
    }
}
</script>

<style scoped></style>
