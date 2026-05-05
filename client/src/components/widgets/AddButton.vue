<template>
    <div
        class="d-flex justify-end align-center mx-6 mt-6 cursor-pointer ga-2"
        data-testid="userAccounts-addUser-button"
        @click="handleClick"
    >
        <span class="text-primary font-weight-medium">
            {{ translate(text) }}
        </span>

        <div
            class="rounded-circle d-flex align-center justify-center border border-primary"
            style="width: 2.25rem; height: 2.25rem; border-width: 2px"
        >
            <v-icon color="primary" size="28">mdi-plus</v-icon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";
import { useRouter } from "vue-router";
import type { RouteLocationAsRelative } from "vue-router";

const router = useRouter();
const props = defineProps<{
    route?: RouteLocationAsRelative;
    text: string;
}>();

const emit = defineEmits<{
    (e: "click"): void;
}>();

function handleClick() {
    if (props.route) {
        router.push(props.route);
    } else {
        emit("click");
    }
}
</script>
