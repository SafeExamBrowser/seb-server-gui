<template>
    <v-card class="pa-6 rounded-lg" variant="flat">
        <div class="d-flex justify-center mb-8">
            <div class="user-circle">
                {{ initials }}
            </div>
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

<style scoped>
.user-circle {
    background-color: transparent;
    border: 0.5rem solid #215caf;
    width: 13rem;
    height: 13rem;
    min-width: 13rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 4rem;
    color: #215caf;
}
</style>
