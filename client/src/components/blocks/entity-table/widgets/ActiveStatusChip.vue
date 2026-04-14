<template>
    <v-chip
        class="text-white font-weight-medium cursor-pointer"
        :color="active ? 'success' : 'error'"
        size="small"
        style="min-width: 4.7rem; justify-content: center"
        @click="emit('click')"
    >
        {{ active ? activeLabel : inactiveLabel }}
    </v-chip>
</template>

<script setup lang="ts">
defineProps<{
    active: boolean;
    activeLabel: string;
    inactiveLabel: string;
}>();

const emit = defineEmits<{
    click: [];
}>();
</script>
