<template>
    <v-app-bar data-testid="layout-app-bar">
        <template #prepend>
            <RouterLink
                class="text-decoration-none text-black"
                data-testid="layout-appLogo-link"
                :to="homeRoute"
            >
                <v-img
                    :alt="translate('navigation.screenReader.titleImage')"
                    src="/img/seb-logo-no-border.png"
                    width="50"
                />
            </RouterLink>
        </template>

        <v-app-bar-title class="d-flex align-center justify-center flex-grow-1">
            <div class="d-flex align-center justify-center">
                <v-avatar
                    v-if="institutionLogo"
                    class="mr-3"
                    rounded="0"
                    size="36"
                >
                    <v-img alt="Institution Logo" :src="institutionLogo" />
                </v-avatar>

                <h1
                    class="mb-0 text-h6 font-weight-bold"
                    data-testid="layout-institutionTitle-text"
                >
                    {{ effectiveTitle }}
                </h1>
            </div>
        </v-app-bar-title>

        <template #append>
            <ContainerRouteActions :layout-context="layoutContext" />

            <ContainerPreferences
                :language-toggle="languageToggle"
                :theme-toggle="themeToggle"
                @update:language-toggle="emit('update:languageToggle', $event)"
                @update:theme-toggle="emit('update:themeToggle', $event)"
            />

            <ContainerProfileMenu
                :user-account="userAccount"
                @logout="$emit('logout')"
            />
        </template>
    </v-app-bar>
</template>

<script setup lang="ts">
import type { UserAccount } from "@/models/userAccount";
import { translate } from "@/utils/generalUtils";
import ContainerPreferences from "@/components/layout/container/ContainerPreferences.vue";
import ContainerProfileMenu from "@/components/layout/container/ContainerProfileMenu.vue";
import ContainerRouteActions from "@/components/layout/container/ContainerRouteActions.vue";
import type { RouteLocationAsRelative } from "vue-router";

defineProps<{
    homeRoute: RouteLocationAsRelative;
    effectiveTitle: string;
    institutionLogo: string | null;
    layoutContext?: string;
    userAccount: UserAccount | null | undefined;
    languageToggle: number;
    themeToggle: number;
}>();

const emit = defineEmits<{
    "update:languageToggle": [number];
    "update:themeToggle": [number];
    logout: [];
}>();
</script>
