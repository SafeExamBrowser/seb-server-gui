<template>
    <v-menu
        v-model="isOpen"
        :close-on-content-click="false"
        location="bottom end"
        offset="8"
        transition="fade-transition"
    >
        <template #activator="{ props: menuProps }">
            <v-btn
                v-bind="menuProps"
                :active="false"
                aria-label="Profile"
                class="text-none overflow-hidden pa-0 pe-2 ps-1"
                :color="isOpen ? 'primary' : 'surface'"
                data-testid="layout-profile-button"
                :ripple="false"
                size="large"
                :style="{ borderRadius: '14px' }"
                :variant="isOpen ? 'tonal' : 'flat'"
            >
                <div class="d-flex align-center ga-3">
                    <v-avatar
                        class="font-weight-black text-body-2"
                        color="primary"
                        density="comfortable"
                        rounded="lg"
                    >
                        {{ initials }}
                    </v-avatar>

                    <div class="text-left">
                        <div class="text-body-2 font-weight-bold">
                            {{ fullName }}
                        </div>
                        <div class="text-caption text-medium-emphasis">
                            {{ primaryRoleLabel }}
                        </div>
                    </div>

                    <v-icon
                        :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                        size="small"
                    />
                </div>
            </v-btn>
        </template>

        <v-card
            class="overflow-hidden"
            elevation="16"
            :style="{ borderRadius: '14px' }"
        >
            <div class="bg-primary pa-5 text-white">
                <div class="d-flex align-center ga-4">
                    <v-avatar
                        class="font-weight-black text-h6"
                        color="white"
                        density="comfortable"
                        size="x-large"
                        :style="{ borderRadius: '14px' }"
                        variant="tonal"
                    >
                        {{ initials }}
                    </v-avatar>

                    <div>
                        <div class="text-h6 font-weight-black">
                            {{ fullName }}
                        </div>
                        <div class="text-caption opacity-80">
                            {{ userAccount?.username }}
                        </div>
                    </div>
                </div>

                <div
                    v-if="translatedRoles.length > 0"
                    class="d-flex flex-wrap ga-2 mt-3"
                >
                    <v-chip
                        v-for="role in translatedRoles"
                        :key="role"
                        class="font-weight-bold"
                        color="white"
                        size="small"
                        variant="tonal"
                    >
                        {{ role }}
                    </v-chip>
                </div>
            </div>

            <div class="d-flex border-b-thin">
                <template
                    v-for="(action, idx) in quickActions"
                    :key="action.label"
                >
                    <v-divider v-if="idx > 0" vertical />
                    <v-hover v-slot="{ isHovering, props: hoverProps }">
                        <RouterLink
                            v-bind="hoverProps"
                            class="d-flex flex-column flex-1-1-0 ga-2 pa-4 text-decoration-none text-high-emphasis"
                            :class="{ 'bg-grey-lighten-4': isHovering }"
                            :to="action.to"
                            @click="closeMenu"
                        >
                            <v-icon
                                color="primary"
                                :icon="action.icon"
                                size="small"
                            />
                            <span class="font-weight-medium text-body-2">
                                {{ action.label }}
                            </span>
                        </RouterLink>
                    </v-hover>
                </template>
            </div>

            <div class="py-1">
                <div class="d-flex align-center ga-3 px-4 py-2 cursor-pointer">
                    <v-icon
                        class="text-medium-emphasis"
                        icon="mdi-translate"
                        size="small"
                    />
                    <span class="font-weight-medium text-body-2">Language</span>
                </div>

                <div class="d-flex align-center ga-3 px-4 py-2">
                    <v-icon
                        class="text-medium-emphasis"
                        icon="mdi-theme-light-dark"
                        size="small"
                    />
                    <span class="font-weight-medium text-body-2">Theme</span>
                    <v-spacer />
                    <v-btn-toggle
                        v-model="themePreference"
                        color="primary"
                        density="compact"
                        divided
                        mandatory
                        variant="outlined"
                    >
                        <v-btn size="x-small" value="light">Light</v-btn>
                        <v-btn size="x-small" value="system">System</v-btn>
                        <v-btn size="x-small" value="dark">Dark</v-btn>
                    </v-btn-toggle>
                </div>

                <v-divider class="my-1" />

                <div
                    class="d-flex align-center ga-3 px-4 py-2 text-error cursor-pointer"
                    @click="handleLogout"
                >
                    <v-icon icon="mdi-logout" size="small" />
                    <span class="font-weight-bold text-body-2">Log out</span>
                </div>
            </div>
        </v-card>
    </v-menu>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
import type { UserAccount } from "@/models/userAccount";
import { typedTo } from "@/router/typedTo";
import { useThemePreference } from "@/components/layout/base/useThemePreference";

const props = defineProps<{
    userAccount: UserAccount | null | undefined;
}>();

const emit = defineEmits<{
    logout: [];
}>();

const { t } = useI18n();
const { preference: themePreference } = useThemePreference();

const isOpen = ref(false);

const rolePriority = [
    "SEB_SERVER_ADMIN",
    "INSTITUTIONAL_ADMIN",
    "EXAM_ADMIN",
    "EXAM_SUPPORTER",
    "TEACHER",
];

const sortedUserRoles = computed(() => {
    const userRoles = props.userAccount?.userRoles ?? [];

    return [...userRoles].sort((a, b) => {
        const indexA = rolePriority.indexOf(a);
        const indexB = rolePriority.indexOf(b);
        return indexA - indexB;
    });
});

const primaryRoleLabel = computed(() => {
    const primaryRole = sortedUserRoles.value[0];
    return primaryRole ? translateUserRole(primaryRole) : "";
});

const translatedRoles = computed(() =>
    sortedUserRoles.value.map((role) => translateUserRole(role)),
);

const initials = computed(() => {
    const nameInitial = props.userAccount?.name?.[0] ?? "";
    const surnameInitial = props.userAccount?.surname?.[0] ?? "";
    return (nameInitial + surnameInitial).toUpperCase();
});

const fullName = computed(() => {
    const name = props.userAccount?.name ?? "";
    const surname = props.userAccount?.surname ?? "";
    return `${name} ${surname}`.trim();
});

const quickActions = computed(() => [
    {
        icon: "mdi-account-cog-outline",
        label: t("titles.profileSettings"),
        to: typedTo({ name: "/(app)/user-account/profile/" }),
    },
    {
        icon: "mdi-file-document-outline",
        label: "Docs",
        to: typedTo({ name: "/(app)/" }),
    },
]);

function translateUserRole(role: string): string {
    const translationKey = `general.userRoles.${role}`;
    const translatedRole = t(translationKey);
    return translatedRole === translationKey ? role : translatedRole;
}

function closeMenu() {
    isOpen.value = false;
}

function handleLogout() {
    closeMenu();
    emit("logout");
}
</script>
