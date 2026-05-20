<template>
    <UserAvatar
        v-if="compact"
        :name="name"
        :surname="surname"
        :size="size"
        tonal
        class="text-body-large"
    />

    <v-card v-else class="pa-6 rounded-lg" variant="flat">
        <div class="d-flex justify-center mb-8">
            <UserAvatar
                :name="name"
                :surname="surname"
                :size="size"
                tonal
                class="text-display-medium"
            />
        </div>

        <v-card variant="tonal" :text="selectedUserRoleDescription ?? ''" />
    </v-card>
</template>

<script setup lang="ts">
import UserAvatar from "@/components/widgets/UserAvatar.vue";

withDefaults(
    defineProps<{
        name: string | undefined;
        surname: string | undefined;
        selectedUserRoleDescription?: string;
        compact?: boolean;
        size?: number;
    }>(),
    {
        selectedUserRoleDescription: undefined,
        compact: false,
        size: 208,
    },
);
</script>
