<template>
    <v-app>
        <ErrorMsg></ErrorMsg>
        <loading
            :active="loadingStore.isLoading"
            color="#215CAF"
            :width="100"
        />

        <router-view />
    </v-app>
</template>

<script setup lang="ts">
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
import { useLoadingStore } from "@/stores/store";
import "@vuepic/vue-datepicker/dist/main.css";
import ErrorMsg from "@/components/widgets/ErrorMsg.vue";

const loadingStore = useLoadingStore();
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
