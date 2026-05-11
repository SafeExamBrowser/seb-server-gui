<template>
    <div
        class="d-flex flex-column bg-layout-background h-screen overflow-hidden"
    >
        <BaseAppBar
            :has-notifications="false"
            :home-route="homeRoute"
            :institution-logo="institutionLogo"
            :institution-name="institutionName"
            :user-account="userAccountStore.userAccount"
            @logout="handleLogout"
        />

        <div
            class="d-flex flex-1-1-0 ga-4 px-6 pb-6 pt-4"
            :style="{ minHeight: 0 }"
        >
            <BaseNavigationRail
                :can-view-navigation-overview="
                    ability.canView(GUIComponent.NavigationOverview)
                "
                :home-route="homeRoute"
                :is-navigation-overview-route="isNavigationOverviewRoute"
                :links="mainNavigationLinks"
                :navigation-overview-route="navigationOverviewRoute"
            />

            <v-card
                class="flex-1-1-0 overflow-y-auto"
                :class="isPageBlue ? '' : 'pa-6'"
                :color="isPageBlue ? 'primary' : undefined"
                :data-testid="`${pageTestId}-page-container`"
                elevation="1"
                :style="{
                    borderRadius: '14px',
                    minWidth: 0,
                }"
            >
                <RouterView />
            </v-card>
        </div>

        <ToastContainer />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView, useRoute } from "vue-router";
import { GUIComponent, useAbilities } from "@/services/ability";
import { useLogout } from "@/composables/useLogout";
import { typedTo } from "@/router/typedTo";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import BaseAppBar from "@/components/layout/base/BaseAppBar.vue";
import BaseNavigationRail from "@/components/layout/base/BaseNavigationRail.vue";
import { buildBaseNavigationLinks } from "@/components/layout/base/navigationLinks";
import { useInstitutionBranding } from "@/components/layout/base/useInstitutionBranding";
import ToastContainer from "@/components/widgets/toast/ToastContainer.vue";

const route = useRoute();
const { t } = useI18n();
const userAccountStore = useUserAccountStore();
const ability = useAbilities();
const { logout } = useLogout();
const { institutionName, institutionLogo } = useInstitutionBranding();

const homeRoute = typedTo({ name: "/(app)/" });
const navigationOverviewRoute = typedTo({
    name: "/(app)/navigation-overview/",
});

const mainNavigationLinks = computed(() => buildBaseNavigationLinks({ t }));

const isNavigationOverviewRoute = computed(
    () => route.meta.layoutContext === "navigation-overview",
);

const isPageBlue = computed(() => route.meta.isPageBlue ?? false);

const pageTestId = computed(
    () => (route.meta.pageTestId as string | undefined) ?? "page",
);

async function handleLogout() {
    await logout();
}
</script>
