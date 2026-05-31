<template>
    <nav
        class="d-inline-flex flex-wrap align-center ga-1 pa-1 rounded-pill"
        :style="{
            border: '1px solid rgba(var(--v-theme-on-primary), 0.18)',
            backgroundColor: 'rgba(var(--v-theme-on-primary), 0.1)',
        }"
        aria-label="Settings sections"
        data-testid="settings-navigation"
    >
        <v-btn
            v-for="item in visibleItems"
            :key="item.testId"
            :to="item.to"
            :active="false"
            :variant="isActive(item) ? 'flat' : 'text'"
            :class="isActive(item) ? 'bg-white text-primary' : 'text-white'"
            class="text-none px-4 py-4 text-body-medium"
            rounded="pill"
            size="small"
            density="comfortable"
            :data-testid="item.testId"
        >
            {{ item.label }}
        </v-btn>
    </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAbilities } from "@/services/ability.ts";
import { buildSettingsNavigationItems } from "@/components/widgets/navigationWidgets/navigationSections.ts";
import type { NavigationSectionItem } from "@/components/widgets/navigationWidgets/types.ts";

const route = useRoute();
const ability = useAbilities();

const visibleItems = computed(() =>
    buildSettingsNavigationItems(ability, "settingsNavigation").filter(
        (item) => item.visible !== false && item.to,
    ),
);

function sectionName(item: NavigationSectionItem): string {
    return String(item.to?.name ?? "");
}

function isActive(item: NavigationSectionItem): boolean {
    const base = sectionName(item);
    return base !== "" && String(route.name ?? "").startsWith(base);
}
</script>
