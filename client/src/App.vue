<template>
    <v-app>
        <ErrorMsg></ErrorMsg>
        <router-view />
    </v-app>
</template>

<script setup lang="ts">
import "vue-loading-overlay/dist/css/index.css";
import "@vuepic/vue-datepicker/dist/main.css";
import ErrorMsg from "@/components/widgets/ErrorMsg.vue";
import { onMounted } from "vue";
import { useTokenRefresh } from "@/composables/useTokenRefresh";

onMounted(() => {
    useTokenRefresh();
});
</script>

<style>
.text-decoration-underline a:visited {
    color: #0000ee !important;
}

.title-inherit-styling {
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
}

.title-no-line-break {
    display: inline;
}

.primary-text-color {
    color: #215caf;
}

.secondary-text-color {
    color: #f5a623;
}

.disabled-text-color {
    color: #aaaaaa;
}
</style>
