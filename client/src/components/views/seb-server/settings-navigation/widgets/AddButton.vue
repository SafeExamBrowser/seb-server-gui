<template>
    <div
        class="d-flex justify-end align-center mx-6 mt-6 cursor-pointer add-button-container"
        data-testid="userAccounts-addUser-button"
        @click="handleClick"
    >
        <span class="text-primary font-weight-medium mr-2">
            {{ translate(text) }}
        </span>

        <div class="add-button-icon d-flex align-center justify-center">
            <v-icon size="28">mdi-plus</v-icon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";
import { RouteName } from "@/router/routeNames.ts";
import { navigateToRoute } from "@/router/navigation.ts";
import type { LocationQueryRaw } from "vue-router";

const props = defineProps<{
    route?: { name: RouteName; query?: LocationQueryRaw };
    text: string;
}>();

const emit = defineEmits<{
    (e: "click"): void;
}>();

function handleClick() {
    if (props.route) {
        navigateToRoute(props.route);
    } else {
        emit("click");
    }
}
</script>

<style scoped>
.add-button-container {
    font-size: 1.1rem;
    gap: 0.5rem;
}
.add-button-icon {
    border: 2px solid #1976d2;
    border-radius: 999px;
    width: 2.25rem;
    height: 2.25rem;
    color: #1976d2;
}
</style>
