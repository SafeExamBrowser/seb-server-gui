<template>
    <v-app>
        <ErrorMsg></ErrorMsg>
        <RouterView />
        <NotificationQueue />
    </v-app>
</template>

<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";

import { onMounted } from "vue";
import { RouterView } from "vue-router";

import ErrorMsg from "@/components/widgets/ErrorMsg.vue";
import NotificationQueue from "@/components/widgets/notifications/NotificationQueue.vue";
import { useTokenRefresh } from "@/composables/useTokenRefresh";

onMounted(() => {
    useTokenRefresh();
});
// TODO @Andrei Dependencies
</script>
