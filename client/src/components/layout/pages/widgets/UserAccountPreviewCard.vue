<template>
    <v-avatar
        v-if="compact"
        :class="compactAvatarClasses"
        :size="avatarSize"
        :style="{ border: '0.2rem solid rgb(var(--v-theme-primary))' }"
    >
        {{ initials }}
    </v-avatar>

    <v-card v-else class="pa-6 rounded-lg" variant="flat">
        <div class="d-flex justify-center mb-8">
            <v-avatar
                :class="defaultAvatarClasses"
                :size="avatarSize"
                :style="{ border: '0.5rem solid rgb(var(--v-theme-primary))' }"
            >
                {{ initials }}
            </v-avatar>
        </div>

        <v-card variant="tonal" :text="selectedUserRoleDescription ?? ''" />
    </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
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

const initials = computed(
    () => `${props.name?.[0] || ""}${props.surname?.[0] || ""}`,
);

const avatarSize = computed(() => props.size);

const compactAvatarClasses = computed(
    () => "font-weight-bold text-primary text-body-large  ",
);

const defaultAvatarClasses = computed(
    () => "font-weight-bold text-primary text-display-medium",
);
</script>
