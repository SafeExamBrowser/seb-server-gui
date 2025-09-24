<template>
    <transition name="toast-item">
        <!-- Alert -->
        <v-alert
            v-show="alive"
            variant="tonal"
            :style="{
                backgroundColor: colors.bg,
            }"
            :border="'start'"
            :color="colors.accent"
            rounded="lg"
            class="toast-item"
            closable
            @click:close="close"
            @mouseenter="pause"
            @mouseleave="resume"
        >
            <!-- Icon -->
            <template #prepend>
                <v-sheet
                    class="toast-icon"
                    :style="{ backgroundColor: colors.accent }"
                    elevation="0"
                    rounded="md"
                >
                    <v-icon v-if="vuetifyType === 'success'">
                        mdi-check-bold
                    </v-icon>

                    <v-icon v-else-if="vuetifyType === 'warning'"
                        >mdi-alert
                    </v-icon>

                    <v-icon v-else-if="vuetifyType === 'error'"
                        >mdi-close-thick
                    </v-icon>

                    <v-icon v-else>
                        mdi-information-slab-circle-outline
                    </v-icon>
                </v-sheet>
            </template>

            <!-- Content -->
            <div class="toast-header">
                <div class="toast-header-text">
                    <div v-if="alert.title" class="toast-title">
                        {{ alert.title }}
                    </div>
                    <div v-if="alert.text" class="toast-text">
                        {{ alert.text }}
                    </div>

                    <!-- optional Action button with custom label -->
                    <v-btn
                        v-if="alert.actionLabel && alert.onAction"
                        size="small"
                        variant="text"
                        class="toast-action"
                        @click.stop="handleAction"
                    >
                        {{ alert.actionLabel }}
                    </v-btn>
                </div>
            </div>

            <!-- Duration bar / remaining time -->
            <v-progress-linear
                class="toast-progress"
                :model-value="progress"
                rounded
                striped
            />
        </v-alert>
    </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import type { Alert } from "@/stores/seb-server/notificationstore";

//passable props
const props = defineProps<{
    alert: Alert;
    onRemove: (id: string) => void;
}>();

// turning our types into types v-alert understands to use variant properties
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

const alive = ref(true);
const progress = ref(100);

let timer: number | null = null;
let remaining = props.alert.duration;
const step = 50;

// countdown functionality
function tick() {
    remaining -= step;
    progress.value = Math.max((remaining / props.alert.duration) * 100, 0);
    if (remaining <= 0) close();
}

//resume the countdown for the alert to disappear
function resume() {
    if (timer !== null) return;
    timer = window.setInterval(tick, step);
}

// used on hover, pause the countdown for the alert to disappear
function pause() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }
}

//close the alert
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

// colors

const cssVarsFor = (kind: "success" | "info" | "warning" | "error") => ({
    bg: `rgb(var(--v-theme-alert-${kind}-bg))`,
    border: `rgb(var(--v-theme-alert-${kind}-border))`,
    accent: `rgb(var(--v-theme-alert-${kind}-accent))`,
});

const colors = computed(() => {
    const t = props.alert.type;
    const kind: "success" | "info" | "warning" | "error" =
        t === "client-error" || t === "server-error"
            ? "error"
            : t === "success" || t === "info" || t === "warning"
              ? t
              : "info";
    return cssVarsFor(kind);
});
</script>

<style scoped>
.toast-item {
    position: relative;
    width: 23vw;
    max-width: calc(100vw - 2rem);
}

.toast-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.toast-action {
    align-self: flex-start;
    margin-top: 0.25rem;
}

.toast-title {
    font-weight: 600;
    line-height: 1.2;
}

.toast-text {
    opacity: 1;
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

.toast-progress :deep(.v-progress-linear__determinate) {
    transition: width 60ms linear;
}

.toast-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: white;
    flex-shrink: 0;
    border-radius: 6px;
}
</style>
