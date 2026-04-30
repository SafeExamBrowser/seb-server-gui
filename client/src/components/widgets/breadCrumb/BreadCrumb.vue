<template>
    <nav
        aria-label="Breadcrumb"
        class="d-flex align-center flex-wrap pl-5 mb-2 text-body-1"
    >
        <v-hover v-slot="{ isHovering, props: hoverProps }">
            <RouterLink
                v-bind="hoverProps"
                :to="{ name: '/(app)/home/' }"
                class="px-1 py-1 text-decoration-none font-weight-medium"
                :class="isHovering ? 'text-primary' : 'text-medium-emphasis'"
            >
                {{ $t("titles.home") }}
            </RouterLink>
        </v-hover>

        <template
            v-for="(item, index) in items"
            :key="`${item.label}-${index}`"
        >
            <span aria-hidden="true" class="mx-1 text-h5 text-medium-emphasis">
                ›
            </span>

            <v-hover
                v-if="item.link"
                v-slot="{ isHovering, props: hoverProps }"
            >
                <RouterLink
                    v-bind="hoverProps"
                    :to="item.link"
                    class="px-1 py-1 text-decoration-none font-weight-medium"
                    :class="
                        isHovering ? 'text-primary' : 'text-medium-emphasis'
                    "
                >
                    {{ item.label }}
                </RouterLink>
            </v-hover>

            <span v-else class="px-1 py-1 text-primary font-weight-medium">
                {{ item.label }}
            </span>
        </template>
    </nav>
</template>

<script setup lang="ts">
import type { BreadCrumbItem } from "./types";

defineProps<{
    items?: BreadCrumbItem[];
}>();
</script>
