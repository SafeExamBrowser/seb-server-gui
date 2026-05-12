<template>
    <div
        class="d-flex flex-column bg-layout-background h-screen overflow-hidden"
    >
        <BaseAppBar
            :has-notifications="false"
            :home-route="homeRoute"
            :institution-logo="institutionLogo"
            :institution-name="institutionName"
            :user-account="user"
            @logout="handleLogout"
        >
            <template #bar-actions>
                <ContainerRouteActions :layout-context="layoutContext" />
            </template>
        </BaseAppBar>

        <div
            class="d-flex flex-1-1-0 ga-4 px-6 pb-6 pt-4"
            :style="{ minHeight: 0 }"
        >
            <BaseNavigationRail
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
                    minHeight: 0,
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
import { useLogout } from "@/composables/useLogout";
import { typedTo } from "@/router/typedTo";
import BaseAppBar from "@/components/layout/base/BaseAppBar.vue";
import BaseNavigationRail from "@/components/layout/base/BaseNavigationRail.vue";
import ContainerRouteActions from "@/components/layout/container/ContainerRouteActions.vue";
import { buildBaseNavigationLinks } from "@/components/layout/base/navigationLinks";
import { useCurrentUser } from "@/components/layout/base/api/useCurrentUser";
import { useInstitutionBranding } from "@/components/layout/base/api/useInstitutionBranding";
import ToastContainer from "@/components/widgets/toast/ToastContainer.vue";

const route = useRoute();
const { t } = useI18n();
const { logout } = useLogout();
const { user } = useCurrentUser();
const { institutionName, institutionLogo } = useInstitutionBranding();

// TODO @Andrei RBAC

const homeRoute = typedTo({ name: "/(app)/" });
const navigationOverviewRoute = typedTo({
    name: "/(app)/navigation-overview/",
});

const mainNavigationLinks = computed(() => buildBaseNavigationLinks({ t }));

const layoutContext = computed(() => route.meta.layoutContext ?? "default");

const isNavigationOverviewRoute = computed(
    () => layoutContext.value === "navigation-overview",
);

const isPageBlue = computed(() => route.meta.isPageBlue ?? false);

const pageTestId = computed(
    () => (route.meta.pageTestId as string | undefined) ?? "page",
);

async function handleLogout() {
    await logout();
}
</script>
