<template>
    <ContainerAppBar
        :effective-title="effectiveTitle"
        :home-route="homeRoute"
        :institution-logo="institutionLogo"
        :language-toggle="languageToggle"
        :layout-context="layoutContext"
        :profile-route="profileRoute"
        :theme-toggle="themeToggle"
        :user-account="userAccountStore.userAccount"
        @logout="handleLogoutButtonClick"
        @update:language-toggle="languageToggle = $event"
        @update:theme-toggle="themeToggle = $event"
    />

    <ContainerNavigationDrawer
        :can-view-navigation-overview="
            ability.canView(GUIComponent.NavigationOverview)
        "
        :home-route="homeRoute"
        :is-navigation-overview-route="isNavigationOverviewRoute"
        :links="mainNavigationLinks"
        :navigation-overview-route="navigationOverviewRoute"
    />

    <ContainerMainShell :is-page-blue="isPageBlue" :page-test-id="pageTestId" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import { useTheme } from "vuetify";
import { useI18n } from "vue-i18n";
import * as constants from "@/utils/constants";
import { useRoute } from "vue-router";
import { GUIComponent, useAbilities } from "@/services/ability";
import { useLogout } from "@/composables/useLogout";
import { buildContainerNavigationLinks } from "@/components/layout/container/navigationLinks";
import ContainerAppBar from "@/components/layout/container/ContainerAppBar.vue";
import ContainerMainShell from "@/components/layout/container/ContainerMainShell.vue";
import ContainerNavigationDrawer from "@/components/layout/container/ContainerNavigationDrawer.vue";
import { useInstitutionBranding } from "@/components/layout/container/useInstitutionBranding";

const route = useRoute();
const { locale, t } = useI18n();
const userAccountStore = useUserAccountStore();
const ability = useAbilities();
const { institutionName, institutionLogo } = useInstitutionBranding();

locale.value = localStorage.getItem("locale") ?? "en";

const languageToggle = ref<number>(locale.value === "en" ? 0 : 1);

const theme = useTheme();
const initialTheme = localStorage.getItem("theme") ?? "light";
theme.change(initialTheme);
const themeToggle = ref<number>(initialTheme === "dark" ? 1 : 0);

const homeRoute = { name: "/(app)/home/" } as const;
const navigationOverviewRoute = {
    name: "/(app)/navigation-overview/",
} as const;

// TODO REFACTOR-ROUTER Migrate profile to typed route.
const profileRoute = constants.PROFILE_ROUTE;

const mainNavigationLinks = computed(() =>
    locale.value === "de"
        ? buildContainerNavigationLinks({ t })
        : buildContainerNavigationLinks({ t }),
);

const layoutContext = computed(() => route.meta.layoutContext ?? "default");

const isNavigationOverviewRoute = computed(
    () => route.meta.layoutContext === "navigation-overview",
);

const isPageBlue = computed(() => route.meta.isPageBlue ?? false);

const pageTestId = computed(
    () => (route.meta.pageTestId as string | undefined) ?? "page",
);

const effectiveTitle = computed(() => {
    return institutionName.value || "SEB Server";
});

watch(languageToggle, () => {
    locale.value = languageToggle.value === 0 ? "en" : "de";
    localStorage.setItem("locale", locale.value);
});

watch(themeToggle, () => {
    const next = themeToggle.value === 0 ? "light" : "dark";
    theme.change(next);
    localStorage.setItem("theme", next);
});

async function handleLogoutButtonClick() {
    await useLogout().logout();
}
</script>
