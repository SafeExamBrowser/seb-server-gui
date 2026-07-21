<template>
    <v-card border elevation="1" rounded="lg" class="h-100 d-flex flex-column">
        <div class="d-flex align-center px-5 py-4 bg-background">
            <span class="text-body-medium font-weight-bold">
                {{ $t("monitoringOverview.notifications.notifications") }}
            </span>
        </div>
        <v-divider />

        <div class="flex-grow-1 pa-5">
            <template
                v-for="(entry, index) in notificationEntries"
                :key="entry.key"
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
                                MonitoringHeaderEnum.SHOW_NOTIFCATION,
                                generalUtils.findEnumValue(
                                    NotificationEnum,
                                    entry.key,
                                )!,
                                examId,
                            )
                        "
                    >
                        <v-avatar
                            :color="
                                getNotificationIconBackground(
                                    entry.key,
                                    entry.value,
                                )
                            "
                            size="42"
                            rounded="lg"
                        >
                            <v-icon
                                :color="
                                    getNotificationIconColor(
                                        entry.key,
                                        entry.value,
                                    )
                                "
                                size="22"
                            >
                                {{
                                    getNotificationIcon(
                                        generalUtils.findEnumValue(
                                            NotificationEnum,
                                            entry.key,
                                        ),
                                    )
                                }}
                            </v-icon>
                        </v-avatar>

                        <div class="flex-grow-1">
                            <div class="text-body-medium font-weight-bold">
                                {{ translate(entry.key) }}
                            </div>
                            <div class="text-body-small text-medium-emphasis">
                                {{ getNotificationSub(entry.key) }}
                            </div>
                        </div>

                        <v-avatar
                            :color="
                                getNotificationAvatarColor(
                                    entry.key,
                                    entry.value,
                                )
                            "
                            size="36"
                        >
                            <span
                                class="text-body-medium font-weight-bold text-white"
                            >
                                {{ entry.value }}
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
    MonitoringHeaderEnum,
    NotificationEnum,
} from "@/models/seb-server/monitoringEnums.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { translate } from "@/utils/generalUtils.ts";
import * as generalUtils from "@/utils/generalUtils.ts";
import { goToMonitoring } from "@/pages/(app)/monitoring/[examId]/composables/useMonitoringNavigation.ts";
import { computed } from "vue";

const props = defineProps<{
    examId: string;
}>();

const examId = props.examId;
const monitoringStore = useMonitoringStore();

const notificationEntries = computed(() =>
    Object.entries(monitoringStore.monitoringOverviewData?.notifications ?? {})
        .filter(([key]) => key !== "total")
        .map(([key, value]) => ({ key, value })),
);

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

function getNotificationAvatarColor(key: string, value: unknown): string {
    return isActiveNotification(value)
        ? getNotificationIconColor(key, value)
        : NEUTRAL_AVATAR;
}

function getNotificationSub(key: string): string {
    return key === "RAISE_HAND"
        ? "Students requesting assistance"
        : "Temporarily restricted access";
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
