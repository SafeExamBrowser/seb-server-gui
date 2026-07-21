<template>
    <v-card
        class="d-flex flex-column flex-shrink-0 align-center pa-2 rounded-lg"
        data-testid="layout-nav-rail"
        elevation="1"
    >
        <!-- This used to show either x or menu icon based on whether the navigation overview was opened or closed. Because now the nav overview is default page, this cant be the case anymore, cause after login, there is no other page to return to (used to be  home)
         Until a home page is implemented I removed the x icon showing and itll now just be burger
         //TODO Reimplement with Home-Page-->

        <v-btn
            v-if="ability.canView(GUIComponent.NAVIGATION_OVERVIEW)"
            :active="false"
            class="rounded-lg overflow-hidden"
            :class="
                isNavigationOverviewRoute ? undefined : 'text-medium-emphasis'
            "
            :color="isNavigationOverviewRoute ? 'primary' : undefined"
            data-testid="layout-navOverview-toggle"
            icon="mdi-menu"
            size="large"
            :to="navigationOverviewRoute"
            :variant="isNavigationOverviewRoute ? 'flat' : 'text'"
        />

        <v-divider
            v-if="ability.canView(GUIComponent.NAVIGATION_OVERVIEW)"
            class="align-self-stretch mb-2 mx-2"
            :opacity="0.2"
        />

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
import { type RouteLocationAsRelative, useRoute } from "vue-router";

import { AbilityLike, GUIComponent } from "@/services/ability";

import type { BaseNavigationLink } from "./navigationLinks";

defineProps<{
    links: BaseNavigationLink[];
    isNavigationOverviewRoute: boolean;
    navigationOverviewRoute: RouteLocationAsRelative;
    ability: AbilityLike;
}>();

const route = useRoute();

function isLinkActive(link: BaseNavigationLink): boolean {
    return route.name === link.route.name;
}
</script>
