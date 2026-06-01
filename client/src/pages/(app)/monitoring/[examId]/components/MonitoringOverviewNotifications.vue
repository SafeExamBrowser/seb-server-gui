<template>
    <v-card border="thin" flat rounded="lg" class="h-100 d-flex flex-column">
        <div class="px-5 py-3 d-flex align-center">
            <span class="text-subtitle-1 font-weight-bold">
                {{ $t("monitoringOverview.notifications.notifications") }}
            </span>
        </div>
        <v-divider />

        <div class="pa-5 flex-grow-1 d-flex flex-column">
            <template
                v-for="(entry, index) in notificationEntries"
                :key="entry.key"
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
                                MonitoringHeaderEnum.SHOW_NOTIFCATION,
                                generalUtils.findEnumValue(
                                    NotificationEnum,
                                    entry.key,
                                )!,
                                examId,
                            )
                        "
                    >
                        <div
                            class="d-flex align-center justify-center rounded-lg flex-shrink-0"
                            :style="{
                                width: '46px',
                                height: '46px',
                                backgroundColor: getNotificationIconBackground(
                                    entry.key,
                                    entry.value,
                                ),
                            }"
                        >
                            <v-icon
                                :color="
                                    getNotificationIconColor(
                                        entry.key,
                                        entry.value,
                                    )
                                "
                                size="24"
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
                        </div>

                        <div class="flex-grow-1" :style="{ minWidth: 0 }">
                            <div class="text-body-2 font-weight-bold">
                                {{ translate(entry.key) }}
                            </div>
                            <div class="text-caption text-medium-emphasis">
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
                            size="38"
                        >
                            <span
                                class="text-white text-body-2 font-weight-bold"
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
import { goToMonitoring } from "../composables/useMonitoringNavigation.ts";
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
