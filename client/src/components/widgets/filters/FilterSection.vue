<template>
    <div :data-testid="`${dataTestId}-section`">
        <div
            class="d-flex align-center justify-space-between py-2 px-1"
            style="cursor: pointer"
            :data-testid="`${dataTestId}-section-toggle`"
            @click="open = !open"
        >
            <span
                class="text-body-small text-medium-emphasis text-uppercase font-weight-bold"
            >
                {{ title }}
            </span>
            <v-icon
                size="small"
                class="text-medium-emphasis"
                :icon="open ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            />
        </div>
        <v-expand-transition>
            <div v-show="open" class="pb-2">
                <slot></slot>
            </div>
        </v-expand-transition>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

withDefaults(
    defineProps<{
        title: string;
        dataTestId?: string;
    }>(),
    { dataTestId: undefined },
);

const open = ref(true);
</script>
