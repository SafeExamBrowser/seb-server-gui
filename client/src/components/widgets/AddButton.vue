<template>
    <div class="d-flex justify-end">
        <v-btn
            :active="false"
            class="text-none bg-primary pa-1 rounded-lg"
            variant="text"
            height="auto"
            :data-testid="`${dataTestId}-add-button`"
            @click="handleClick"
        >
            <div class="d-flex align-center ga-2 pr-4 pl-2">
                <v-icon size="25">mdi-plus</v-icon>

                <span class="text-title-medium" style="letter-spacing: normal">
                    {{ $t("general.addButton") }}
                </span>
            </div>
        </v-btn>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { RouteLocationAsRelative } from "vue-router";

const router = useRouter();
const props = defineProps<{
    route?: RouteLocationAsRelative;
    dataTestId?: string;
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
