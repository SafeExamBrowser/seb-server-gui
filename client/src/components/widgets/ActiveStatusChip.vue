<template>
    <v-chip
        class="text-white font-weight-medium cursor-pointer"
        :color="active ? 'success' : 'error'"
        size="small"
        style="min-width: 4.7rem; justify-content: center"
        @click.stop="emit('click')"
    >
        {{ active ? $t("general.active") : $t("general.inactive") }}
    </v-chip>
</template>

<script setup lang="ts">
defineProps<{
    active: boolean;
}>();

const emit = defineEmits<{
    click: [];
}>();
</script>
