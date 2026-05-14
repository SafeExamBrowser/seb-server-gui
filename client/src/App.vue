<template>
    <v-app>
        <ErrorMsg></ErrorMsg>
        <RouterView />
    </v-app>
</template>

<script setup lang="ts">
import "@vuepic/vue-datepicker/dist/main.css";
import ErrorMsg from "@/components/widgets/ErrorMsg.vue";
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useTokenRefresh } from "@/composables/useTokenRefresh";

onMounted(() => {
    useTokenRefresh();
});
// TODO @Andrei Dependencies
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

.disabled-text-color {
    color: #aaaaaa;
}
</style>
