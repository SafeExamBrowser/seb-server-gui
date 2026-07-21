<template>
    <div class="d-flex justify-center align-center ga-1">
        <div v-for="action in visibleActions" :key="action.key">
            <v-hover v-slot="{ isHovering, props: hoverProps }">
                <v-btn
                    v-bind="hoverProps"
                    :icon="action.icon"
                    :disabled="action.disabled?.(item) ?? false"
                    :aria-label="action.label"
                    variant="text"
                    density="comfortable"
                    size="small"
                    rounded="lg"
                    :class="getBGColor(action)"
                    :color="
                        isHovering ? (action.color ?? 'primary') : undefined
                    "
                    :data-testid="`${dataTestId}-${action.key}-button`"
                    @click.stop="action.onClick(item)"
                />

                <v-tooltip
                    v-if="tooltipText(action)"
                    activator="parent"
                    location="top left"
                    :text="tooltipText(action)"
                />
            </v-hover>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import type {
    TableAction,
    TableItem,
} from "@/components/widgets/entity-table/types.ts";

const props = defineProps<{
    item: TableItem;
    actions: TableAction[];
    dataTestId: string;
}>();

const visibleActions = computed(() =>
    props.actions.filter((a) => a.visible?.(props.item) ?? true),
);

// Resolve the tooltip per row: an action may expose a static string or a
// function of the item (e.g. a hint shown only on rows where it is disabled).
function tooltipText(action: TableAction): string | undefined {
    return typeof action.tooltip === "function"
        ? action.tooltip(props.item)
        : action.tooltip;
}

function getBGColor(action: TableAction): string {
    return action.bgcolor
        ? `text-medium-emphasis bg-${action.bgcolor}`
        : "text-medium-emphasis";
}
</script>
