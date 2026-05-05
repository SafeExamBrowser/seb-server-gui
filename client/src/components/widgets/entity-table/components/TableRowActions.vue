<template>
    <div class="d-flex justify-center align-center ga-1">
        <v-hover
            v-for="action in visibleActions"
            :key="action.key"
            v-slot="{ isHovering, props: hoverProps }"
        >
            <v-btn
                v-bind="hoverProps"
                :icon="action.icon"
                :disabled="action.disabled?.(item) ?? false"
                :aria-label="action.label"
                variant="text"
                density="comfortable"
                size="small"
                rounded="lg"
                class="text-medium-emphasis"
                :color="isHovering ? (action.color ?? 'primary') : undefined"
                :data-testid="`${dataTestId}-${action.key}-button`"
                @click.stop="action.onClick(item)"
            />
        </v-hover>
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
</script>
