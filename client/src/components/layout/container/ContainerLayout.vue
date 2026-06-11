<template>
    <div class="d-flex flex-column bg-background h-screen overflow-hidden">
        <ContainerHeader
            :home-route="homeRoute"
            :institution-logo="institutionLogo"
            :institution-name="institutionName"
            :user-account="user"
            @logout="handleLogout"
        >
            <template #bar-actions>
                <ContainerRouteActions :layout-context="layoutContext" />
            </template>
        </ContainerHeader>

        <div
            class="d-flex flex-1-1-0 ga-4 px-6 pb-6 pt-2"
            :style="{ minHeight: 0 }"
        >
            <ContainerSidePanel
                :home-route="homeRoute"
                :is-navigation-overview-route="isNavigationOverviewRoute"
                :links="mainNavigationLinks"
                :navigation-overview-route="navigationOverviewRoute"
                :ability="ability"
            />

            <v-card
                v-if="isPageBlue"
                class="flex-1-1-0 rounded-lg overflow-y-auto pa-4"
                color="primary"
                :data-testid="`${pageTestId}-page-container`"
                elevation="1"
                :style="{ minHeight: 0, minWidth: 0 }"
            >
                <RouterView />
            </v-card>
            <div
                v-else
                class="flex-1-1-0 overflow-y-auto pa-3 ma-n3"
                :data-testid="`${pageTestId}-page-container`"
                :style="{ minHeight: 0, minWidth: 0 }"
            >
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView, useRoute } from "vue-router";
import { useLogout } from "@/composables/useLogout";
import { typedTo } from "@/router/typedTo";
import ContainerHeader from "./ContainerHeader.vue";
import ContainerSidePanel from "./ContainerSidePanel.vue";
import ContainerRouteActions from "./ContainerRouteActions.vue";
import { buildBaseNavigationLinks } from "./navigationLinks";
import { useCurrentUserQuery } from "@/composables/useCurrentUser";
import { useInstitutionBranding } from "@/composables/useInstitutionBranding";
import { useAbilities } from "@/services/ability";

const route = useRoute();
const { t } = useI18n();
const { logout } = useLogout();
const { data: user } = useCurrentUserQuery();
const { institutionName, institutionLogo } = useInstitutionBranding();
const ability = useAbilities();

// TODO @Andrei RBAC

const homeRoute = typedTo({ name: "/(app)/" });
const navigationOverviewRoute = typedTo({
    name: "/(app)/navigation-overview/",
});

const mainNavigationLinks = computed(() =>
    buildBaseNavigationLinks(ability, { t }),
);

const layoutContext = computed(() => route.meta.layoutContext ?? "default");

const isNavigationOverviewRoute = computed(
    () => layoutContext.value === "navigation-overview",
);

const isPageBlue = computed(() => route.meta.isPageBlue ?? false);

const pageTestId = computed(() => route.meta.pageTestId ?? "page");

async function handleLogout() {
    await logout();
}
</script>
