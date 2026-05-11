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
                aria-label="Profile"
                class="text-none rounded-lg pa-0 pe-2 ps-1"
                color="surface"
                data-testid="layout-profile-button"
                height="44"
                :ripple="false"
                :style="{
                    background: isOpen ? primaryTint : 'transparent',
                }"
                variant="flat"
            >
                <div class="d-flex align-center ga-3">
                    <div
                        class="bg-primary d-flex align-center justify-center text-white font-weight-black"
                        :style="{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            letterSpacing: '0.4px',
                        }"
                    >
                        {{ initials }}
                    </div>

                    <div class="text-left">
                        <div
                            class="text-body-2 font-weight-bold"
                            style="line-height: 1.15"
                        >
                            {{ fullName }}
                        </div>
                        <div
                            class="text-medium-emphasis"
                            style="font-size: 11px; line-height: 1.15"
                        >
                            {{ primaryRoleLabel }}
                        </div>
                    </div>

                    <v-icon
                        :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                        size="20"
                    />
                </div>
            </v-btn>
        </template>

        <v-card
            class="overflow-hidden"
            :style="{
                width: '400px',
                borderRadius: '16px',
            }"
            elevation="16"
        >
            <div class="bg-primary pa-5 text-white">
                <div class="d-flex align-center ga-4">
                    <div
                        class="d-flex align-center justify-center font-weight-black text-white"
                        :style="{
                            width: '52px',
                            height: '52px',
                            borderRadius: '14px',
                            background: 'rgba(255,255,255,0.18)',
                            border: '1.5px solid rgba(255,255,255,0.3)',
                            fontSize: '18px',
                            letterSpacing: '0.4px',
                        }"
                    >
                        {{ initials }}
                    </div>

                    <div>
                        <div class="text-h6 font-weight-black">
                            {{ fullName }}
                        </div>
                        <div class="text-caption" style="opacity: 0.85">
                            {{ userAccount?.username }}
                        </div>
                    </div>
                </div>

                <div
                    v-if="translatedRoles.length > 0"
                    class="d-flex flex-wrap ga-2 mt-3"
                >
                    <span
                        v-for="role in translatedRoles"
                        :key="role"
                        class="font-weight-bold rounded text-white"
                        :style="{
                            fontSize: '11px',
                            padding: '3px 9px',
                            background: 'rgba(255,255,255,0.18)',
                            border: '1px solid rgba(255,255,255,0.25)',
                        }"
                    >
                        {{ role }}
                    </span>
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
                            class="d-flex flex-column flex-grow-1 ga-2 pa-4 text-decoration-none"
                            :class="{ 'bg-grey-lighten-4': isHovering }"
                            :style="{
                                flexBasis: 0,
                                minWidth: 0,
                                color: 'inherit',
                            }"
                            :to="action.to"
                            @click="closeMenu"
                        >
                            <v-icon
                                color="primary"
                                :icon="action.icon"
                                size="20"
                            />
                            <span class="font-weight-medium text-body-2">
                                {{ action.label }}
                            </span>
                        </RouterLink>
                    </v-hover>
                </template>
            </div>

            <div class="py-1">
                <div
                    class="d-flex align-center ga-3 px-4 py-2"
                    style="cursor: pointer"
                >
                    <v-icon
                        class="text-medium-emphasis"
                        icon="mdi-translate"
                        size="18"
                    />
                    <span class="font-weight-medium text-body-2">Language</span>
                </div>

                <div class="d-flex align-center ga-3 px-4 py-2">
                    <v-icon
                        class="text-medium-emphasis"
                        icon="mdi-theme-light-dark"
                        size="18"
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
                    class="d-flex align-center ga-3 px-4 py-2 text-error"
                    style="cursor: pointer"
                    @click="handleLogout"
                >
                    <v-icon icon="mdi-logout" size="18" />
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

const primaryTint = "rgba(33, 92, 175, 0.08)";

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
