<template>
    <div class="d-flex justify-end mx-6">
        <v-btn
            :active="false"
            class="text-none"
            color="primary"
            variant="text"
            height="auto"
            :data-testid="`${dataTestId}-add-button`"
            @click="handleClick"
        >
            <div class="d-flex align-center ga-2">
                <span
                    class="text-title-large font-weight-medium"
                    style="letter-spacing: normal"
                >
                    {{ $t("general.addButton") }}
                </span>

                <v-icon color="primary" size="38"
                    >mdi-plus-circle-outline</v-icon
                >
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
