<template>
    <nav
        aria-label="Breadcrumb"
        class="d-flex align-center flex-wrap ga-2 pl-5 text-body-medium"
    >
        <v-hover v-slot="{ isHovering, props: hoverProps }">
            <RouterLink
                v-bind="hoverProps"
                :to="{ name: '/(app)/' }"
                :aria-label="$t('titles.home')"
                class="d-inline-flex align-center text-decoration-none"
                :class="isHovering ? 'text-primary' : 'text-medium-emphasis'"
            >
                <v-icon icon="mdi-home-outline" size="20" />
            </RouterLink>
        </v-hover>

        <template
            v-for="(item, index) in items"
            :key="`${item.label}-${index}`"
        >
            <span aria-hidden="true" class="text-disabled">›</span>

            <v-hover
                v-if="item.link"
                v-slot="{ isHovering, props: hoverProps }"
            >
                <RouterLink
                    v-bind="hoverProps"
                    :to="item.link"
                    class="text-decoration-none font-weight-medium"
                    :class="
                        isHovering ? 'text-primary' : 'text-medium-emphasis'
                    "
                >
                    {{ item.label }}
                </RouterLink>
            </v-hover>

            <span v-else class="text-primary font-weight-medium">
                {{ item.label }}
            </span>
        </template>
    </nav>
</template>

<script setup lang="ts">
import type { BreadCrumbItem } from "./types";
import { RouterLink } from "vue-router";

defineProps<{
    items?: BreadCrumbItem[];
}>();
</script>
