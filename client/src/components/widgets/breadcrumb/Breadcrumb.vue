<template>
    <nav class="d-flex align-center text-body-2">
        <div class="d-flex align-center item">
            <RouterLink
                :to="HOME_PAGE_ROUTE"
                class="text-primary font-weight-bold item__link"
            >
                {{ $t("titles.home") }}
            </RouterLink>
        </div>

        <template v-for="item in items" :key="item.label">
            <div class="d-flex align-center item">
                <RouterLink
                    v-if="item.link"
                    :to="item.link"
                    class="text-primary item__link"
                >
                    {{ item.label }}
                </RouterLink>

                <span v-else class="text-subtitle">
                    {{ item.label }}
                </span>
            </div>
        </template>
    </nav>
</template>

<script setup lang="ts">
import { HOME_PAGE_ROUTE } from "@/utils/constants";
import { BreadcrumbItem } from "./types";

defineProps<{
    items: BreadcrumbItem[];
}>();
</script>

<style scoped>
.item:not(:last-child)::after {
    content: "›";
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    color: rgba(var(--v-theme-subtitle), 0.6);
    font-size: 1.25rem;
}

.item__link {
    text-decoration: none;
}

.item__link:hover {
    text-decoration: underline;
}
</style>
