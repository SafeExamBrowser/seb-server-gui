<template>
    <!-- Teleport by default so it never gets clipped by layout/overflow -->
    <component :is="teleportToBody ? 'teleport' : 'div'" :to="teleportTarget">
        <div class="toast-container" aria-live="polite" aria-atomic="false">
            <transition-group name="toast-stack" tag="div">
                <ToastItem
                    v-for="a in store.visible"
                    :key="a.id"
                    :alert="a"
                    :on-remove="store.remove"
                    class="mt-2"
                />
            </transition-group>

            <div v-if="store.queued.length" class="toast-queue-indicator">
                +{{ store.queued.length }} more
            </div>
        </div>
    </component>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from "vue";
import ToastItem from "./ToastItem.vue";
import { useNotificationsStore } from "@/stores/seb-server/notificationstore";

withDefaults(
    defineProps<{
        teleportToBody?: boolean;
        teleportTarget?: string;
    }>(),
    { teleportToBody: true, teleportTarget: "body" },
);

const store = useNotificationsStore();
</script>

<style scoped>
.toast-container {
    position: fixed;
    right: 1.25rem;
    bottom: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    z-index: 9999;
}

/* Stack transition for list items */
.toast-stack-enter-from,
.toast-stack-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.toast-stack-enter-active,
.toast-stack-leave-active {
    transition: all 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-queue-indicator {
    font-size: 0.75rem;
    opacity: 0.7;
    text-align: right;
    padding-right: 0.25rem;
}
</style>
