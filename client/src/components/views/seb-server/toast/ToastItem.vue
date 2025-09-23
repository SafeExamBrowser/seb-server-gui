<template>
    <transition name="toast-item">
        <v-alert
            v-show="alive"
            :type="vuetifyType"
            :variant="'elevated'"
            border="start"
            class="toast-item"
            closable
            :close-label="closeLabel"
            :role="ariaRole"
            :aria-live="ariaLive"
            @click:close="close"
            @mouseenter="pause"
            @mouseleave="resume"
        >
            <div class="toast-header">
                <div class="toast-header-text">
                    <div v-if="alert.title" class="toast-title">
                        {{ alert.title }}
                    </div>
                    <div v-if="alert.text" class="toast-text">
                        {{ alert.text }}
                    </div>
                </div>
                <div class="ml-auto d-flex align-center">
                    <v-btn
                        v-if="alert.actionLabel && alert.onAction"
                        size="small"
                        variant="text"
                        @click.stop="handleAction"
                    >
                        {{ alert.actionLabel }}
                    </v-btn>
                </div>
            </div>

            <!-- Progress bar -->
            <v-progress-linear
                class="toast-progress"
                :model-value="progress"
                :height="3"
                :stream="false"
                rounded
            />
        </v-alert>
    </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import type { Alert } from "@/stores/seb-server/notificationstore";

const props = defineProps<{
    alert: Alert;
    onRemove: (id: string) => void;
}>();

const closeLabel = "Close notification";

const vuetifyType = computed<"success" | "info" | "warning" | "error">(() => {
    switch (props.alert.type) {
        case "success":
            return "success";
        case "info":
            return "info";
        case "warning":
            return "warning";
        case "client-error":
        case "server-error":
            return "error";
        default:
            return "info";
    }
});

const ariaRole = computed(() =>
    props.alert.type === "warning" ||
    props.alert.type === "client-error" ||
    props.alert.type === "server-error"
        ? "alert"
        : "status",
);

const ariaLive = computed(() =>
    ariaRole.value === "alert" ? "assertive" : "polite",
);

const alive = ref(true);
const progress = ref(100);

let timer: number | null = null;
let remaining = props.alert.duration;
const step = 50;

function tick() {
    remaining -= step;
    progress.value = Math.max((remaining / props.alert.duration) * 100, 0);
    if (remaining <= 0) close();
}

function resume() {
    if (timer !== null) return;
    timer = window.setInterval(tick, step);
}

function pause() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }
}

function close() {
    pause();
    alive.value = false;
    setTimeout(() => props.onRemove(props.alert.id), 650);
}

function handleAction() {
    props.alert.onAction?.();
    close();
}

onMounted(() => {
    resume();
});

onBeforeUnmount(() => {
    pause();
});
</script>

<style scoped>
.toast-item {
    position: relative;
    width: 500px;
    max-width: calc(100vw - 2rem);
    box-shadow: var(--v-theme-shadow-3);
}

.toast-header {
    display: flex;
    align-items: flex-start;
}

.toast-title {
    font-weight: 600;
    line-height: 1.2;
}

.toast-text {
    opacity: 0.9;
}

.toast-progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0.125rem;
}

.toast-progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0.125rem;
}

/* Smooth the inner bar width changes */
.toast-progress :deep(.v-progress-linear__determinate) {
    transition: width 120ms linear;
}
</style>
