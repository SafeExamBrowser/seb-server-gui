<template>
    <v-navigation-drawer
        class="mt-0"
        data-testid="layout-nav-drawer"
        permanent
        width="70"
    >
        <v-list class="pt-0" lines="two">
            <v-list-item
                v-if="canViewNavigationOverview"
                class="d-flex flex-column justify-center text-center"
                :class="
                    isNavigationOverviewRoute ? 'bg-primary text-white' : ''
                "
                data-testid="layout-navOverview-toggle"
                elevation="0"
                link
                :to="
                    isNavigationOverviewRoute
                        ? homeRoute
                        : navigationOverviewRoute
                "
                value="nav-overview-toggle"
                variant="elevated"
            >
                <template v-if="isNavigationOverviewRoute">
                    <v-icon color="white" icon="mdi-close" />
                </template>

                <template v-else>
                    <v-icon color="#797979" icon="mdi-menu" />
                </template>
            </v-list-item>

            <v-divider />

            <template v-for="link in links" :key="link.testId">
                <v-list-item
                    :active="route.name === link.route.name"
                    class="d-flex flex-column justify-center text-center"
                    color="#215caf"
                    :data-testid="link.testId"
                    link
                    :to="link.route"
                    :value="link.testId"
                >
                    <template #default="{ isActive }">
                        <v-icon
                            :color="isActive ? '' : '#797979'"
                            :icon="link.icon"
                        />
                        <span class="text-caption">{{ link.title }}</span>
                    </template>
                </v-list-item>

                <v-divider />
            </template>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import type { ContainerNavigationLink } from "@/components/layout/container/navigationLinks";
import { useRoute, type RouteLocationAsRelative } from "vue-router";

defineProps<{
    links: ContainerNavigationLink[];
    canViewNavigationOverview: boolean;
    isNavigationOverviewRoute: boolean;
    navigationOverviewRoute: RouteLocationAsRelative;
    homeRoute: RouteLocationAsRelative;
}>();

const route = useRoute();
</script>
