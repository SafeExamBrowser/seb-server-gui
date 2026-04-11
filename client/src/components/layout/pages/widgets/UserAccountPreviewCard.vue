<template>
    <v-card class="pa-6 rounded-lg" variant="flat">
        <div class="d-flex justify-center mb-8">
            <v-avatar
                size="208"
                class="font-weight-bold text-primary text-h2"
                :style="{ border: '0.5rem solid rgb(var(--v-theme-primary))' }"
            >
                {{ initials }}
            </v-avatar>
        </div>

        <v-card variant="tonal" :text="selectedUserRoleDescription" />
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    name: string | undefined;
    surname: string | undefined;
    selectedUserRoleDescription: string;
}>();

const initials = computed(
    () => `${props.name?.[0] || ""}${props.surname?.[0] || ""}`,
);
</script>
