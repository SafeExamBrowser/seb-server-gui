<template>
    <v-app>
        <RouterView />
        <NotificationQueue />
    </v-app>
</template>

<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";

import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { VApp } from "vuetify/components";

import NotificationQueue from "@/components/widgets/notifications/NotificationQueue.vue";
import { useTokenRefresh } from "@/composables/useTokenRefresh";

onMounted(() => {
    useTokenRefresh();
});
// TODO @Andrei Dependencies
</script>
