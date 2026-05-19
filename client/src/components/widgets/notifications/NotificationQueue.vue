<template>
    <v-snackbar-queue
        v-model="notificationQueue"
        location="bottom end"
        variant="tonal"
        :total-visible="4"
        :timeout="10000"
        timer="bottom"
        rounded="lg"
        min-height="90"
        width="450"
        collapsed
        :content-props="{
            class: 'mr-6 mb-6 border',
            style: 'border-color: currentColor; border-width: 2px',
        }"
        :close-on-back="false"
    >
        <template #actions="{ item, props: snackbarProps }">
            <v-btn
                v-if="item.actionLabel && item.onAction"
                variant="text"
                @click="
                    () => {
                        item.onAction?.();
                        snackbarProps.onClick();
                    }
                "
            >
                {{ item.actionLabel }}
            </v-btn>
            <v-btn variant="text" @click="snackbarProps.onClick">
                {{ $t("general.closeButton") }}
            </v-btn>
        </template>
    </v-snackbar-queue>
</template>

<script setup lang="ts">
import { notificationQueue } from "@/services/notifications/notify.ts";
</script>
