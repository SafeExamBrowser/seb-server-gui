<template>
    <v-chip
        size="small"
        :color="active ? (color ?? 'primary') : undefined"
        :variant="active ? 'flat' : 'tonal'"
        class="cursor-pointer font-weight-medium"
        @click="emit('toggle')"
    >
        {{ label }}
    </v-chip>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
    active: boolean;
    color?: string;
}>();

const emit = defineEmits<{
    toggle: [];
}>();
</script>
