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
                :icon="selected ? 'mdi-radiobox-marked' : 'mdi-radiobox-blank'"
            />
            <v-icon v-if="color" :color="color" icon="mdi-circle" :size="8" />
            <span class="text-body-medium font-weight-medium">{{ label }}</span>
        </div>
    </v-list-item>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        label: string;
        selected: boolean;
        color?: string;
        dataTestId?: string;
    }>(),
    { color: undefined, dataTestId: undefined },
);

const emit = defineEmits<{
    toggle: [];
}>();
</script>
