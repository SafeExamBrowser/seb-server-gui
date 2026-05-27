<template>
    <v-card
        class="d-flex flex-column flex-shrink-0 align-center pa-2 rounded-lg"
        data-testid="layout-nav-rail"
        elevation="1"
    >
        <v-btn
            v-if="ability.canView(GUIComponent.NavigationOverview)"
            :active="false"
            class="mb-2 rounded-lg overflow-hidden"
            :class="
                isNavigationOverviewRoute ? undefined : 'text-medium-emphasis'
            "
            :color="isNavigationOverviewRoute ? 'primary' : undefined"
            data-testid="layout-navOverview-toggle"
            :icon="isNavigationOverviewRoute ? 'mdi-close' : 'mdi-menu'"
            size="large"
            :to="
                isNavigationOverviewRoute ? homeRoute : navigationOverviewRoute
            "
            :variant="isNavigationOverviewRoute ? 'flat' : 'text'"
        />

        <v-divider class="align-self-stretch mb-4 mx-2" :opacity="0.2" />

        <v-btn
            v-for="link in links"
            :key="link.testId"
            :active="false"
            class="my-1 rounded-lg overflow-hidden"
            :class="isLinkActive(link) ? undefined : 'text-medium-emphasis'"
            :color="isLinkActive(link) ? 'primary' : undefined"
            :data-testid="link.testId"
            icon
            size="large"
            :to="link.route"
            :variant="isLinkActive(link) ? 'flat' : 'text'"
        >
            <span
                class="d-flex flex-column align-center justify-center text-center text-wrap w-100"
            >
                <v-icon :icon="link.icon" />
                <span class="text-body-small text-break">
                    {{ link.title }}
                </span>
            </span>
        </v-btn>
    </v-card>
</template>

<script setup lang="ts">
import { useRoute, type RouteLocationAsRelative } from "vue-router";
import type { BaseNavigationLink } from "./navigationLinks";
import { GUIComponent, AbilityLike } from "@/services/ability";

defineProps<{
    links: BaseNavigationLink[];
    isNavigationOverviewRoute: boolean;
    navigationOverviewRoute: RouteLocationAsRelative;
    homeRoute: RouteLocationAsRelative;
    ability: AbilityLike;
}>();

const route = useRoute();

function isLinkActive(link: BaseNavigationLink): boolean {
    return route.name === link.route.name;
}
</script>
