<template>
    <v-main class="d-flex flex-column fill-height">
        <div
            :class="[
                'fill-height pa-4 overflow-y-auto',
                isPageBlue ? 'bg-primary' : 'bg-layout-background',
            ]"
            :data-testid="`${pageTestId}-page-container`"
        >
            <RouterView />
        </div>

        <ToastContainer />
    </v-main>
</template>

<script setup lang="ts">
import ToastContainer from "@/components/widgets/toast/ToastContainer.vue";
import { RouterView } from "vue-router";

defineProps<{
    isPageBlue: boolean;
    pageTestId: string;
}>();
</script>
