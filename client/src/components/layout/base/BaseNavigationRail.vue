<template>
    <!-- side pannel  -->
    <v-card
        class="d-flex flex-column flex-shrink-0 align-center py-2"
        data-testid="layout-nav-rail"
        elevation="1"
        :style="{
            width: '76px',
            borderRadius: '16px',
        }"
    >
        <v-btn
            v-if="canViewNavigationOverview"
            class="mb-2 rounded-lg"
            data-testid="layout-navOverview-toggle"
            :icon="isNavigationOverviewRoute ? 'mdi-close' : 'mdi-menu'"
            size="44"
            :style="{
                background: isNavigationOverviewRoute
                    ? 'rgba(33, 92, 175, 0.1)'
                    : 'transparent',
                color: isNavigationOverviewRoute
                    ? 'rgb(var(--v-theme-primary))'
                    : 'rgb(75, 85, 99)',
            }"
            :to="
                isNavigationOverviewRoute ? homeRoute : navigationOverviewRoute
            "
            variant="flat"
        />

        <v-divider class="align-self-stretch mx-3 mb-2" :opacity="0.6" />

        <v-btn prepend-icon="mdi-home" stacked color="primary" size="small">
            Home
        </v-btn>

        <v-btn
            v-for="link in links"
            :key="link.testId"
            :active="isLinkActive(link)"
            class="my-1 d-flex flex-column"
            :class="isLinkActive(link) ? 'bg-primary text-white' : ''"
            :data-testid="link.testId"
            :elevation="isLinkActive(link) ? 4 : 0"
            :style="{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                minWidth: '56px',
            }"
            :to="link.route"
            variant="flat"
        >
            <div class="d-flex flex-column align-center justify-center ga-0">
                <v-icon :icon="link.icon" size="22" />
                <span
                    class="text-uppercase font-weight-black mt-1"
                    :style="{
                        fontSize: '9px',
                        letterSpacing: '0.4px',
                        lineHeight: '1',
                    }"
                >
                    {{ link.title }}
                </span>
            </div>
        </v-btn>
    </v-card>
</template>

<script setup lang="ts">
import { useRoute, type RouteLocationAsRelative } from "vue-router";
import type { BaseNavigationLink } from "@/components/layout/base/navigationLinks";

defineProps<{
    links: BaseNavigationLink[];
    canViewNavigationOverview: boolean;
    isNavigationOverviewRoute: boolean;
    navigationOverviewRoute: RouteLocationAsRelative;
    homeRoute: RouteLocationAsRelative;
}>();

const route = useRoute();

function isLinkActive(link: BaseNavigationLink): boolean {
    return route.name === link.route.name;
}
</script>
