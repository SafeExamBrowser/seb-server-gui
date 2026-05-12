<template>
    <ContainerAppBar
        :effective-title="effectiveTitle"
        :home-route="{ name: '/(app)/' }"
        :institution-logo="institutionLogo"
        :layout-context="layoutContext"
        :user-account="userAccountStore.userAccount"
        @logout="handleLogoutButtonClick"
    />

    <ContainerNavigationDrawer
        :can-view-navigation-overview="
            ability.canView(GUIComponent.NavigationOverview)
        "
        :home-route="{ name: '/(app)/' }"
        :is-navigation-overview-route="isNavigationOverviewRoute"
        :links="mainNavigationLinks"
        :navigation-overview-route="{ name: '/(app)/navigation-overview/' }"
    />

    <ContainerMainShell :is-page-blue="isPageBlue" :page-test-id="pageTestId" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { GUIComponent, useAbilities } from "@/services/ability";
import { useLogout } from "@/composables/useLogout";
import { buildContainerNavigationLinks } from "@/components/layout/container/navigationLinks";
import ContainerAppBar from "@/components/layout/container/ContainerAppBar.vue";
import ContainerMainShell from "@/components/layout/container/ContainerMainShell.vue";
import ContainerNavigationDrawer from "@/components/layout/container/ContainerNavigationDrawer.vue";
import { useInstitutionBranding } from "@/components/layout/container/useInstitutionBranding";

const route = useRoute();
const { t } = useI18n();
const userAccountStore = useUserAccountStore();
const ability = useAbilities();
const { logout } = useLogout();
const { institutionName, institutionLogo } = useInstitutionBranding();

const mainNavigationLinks = computed(() =>
    buildContainerNavigationLinks({ t }),
);

const layoutContext = computed(() => route.meta.layoutContext ?? "default");

const isNavigationOverviewRoute = computed(
    () => layoutContext.value === "navigation-overview",
);

const isPageBlue = computed(() => route.meta.isPageBlue ?? false);

const pageTestId = computed(() => route.meta.pageTestId ?? "page");

const effectiveTitle = computed(() => {
    return institutionName.value || "SEB Server";
});

async function handleLogoutButtonClick() {
    await logout();
}
</script>
