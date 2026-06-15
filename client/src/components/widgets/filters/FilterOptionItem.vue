<template>
    <v-list-item
        :active="selected"
        color="primary"
        rounded="lg"
        density="compact"
        class="px-2"
        :data-testid="dataTestId"
        @click="emit('toggle')"
    >
        <div class="d-flex align-center ga-2">
            <v-icon
                :color="selected ? 'primary' : undefined"
                :class="{ 'text-medium-emphasis': !selected }"
                :icon="controlIcon"
            />
            <v-icon v-if="color" :color="color" icon="mdi-circle" :size="8" />
            <span class="text-body-medium font-weight-medium">{{ label }}</span>
            <span
                v-if="count !== undefined"
                class="ms-auto text-body-small font-weight-bold text-medium-emphasis"
            >
                {{ count }}
            </span>
        </div>
    </v-list-item>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        label: string;
        selected: boolean;
        multiple?: boolean;
        color?: string;
        count?: number;
        dataTestId?: string;
    }>(),
    {
        multiple: false,
        color: undefined,
        count: undefined,
        dataTestId: undefined,
    },
);

const controlIcon = computed(() => {
    if (props.multiple) {
        return props.selected
            ? "mdi-checkbox-marked"
            : "mdi-checkbox-blank-outline";
    }
    return props.selected ? "mdi-radiobox-marked" : "mdi-radiobox-blank";
});

const emit = defineEmits<{
    toggle: [];
}>();
</script>
