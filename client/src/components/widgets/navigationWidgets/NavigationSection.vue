<template>
    <div>
        <h4 v-if="showTitle" class="text-subtitle-1 font-weight-bold mb-3">
            {{ title.toUpperCase() }}
        </h4>

        <NavigationItem
            v-for="item in visibleItems"
            :key="item.testId ?? `${title}-${item.label}`"
            :label="item.label"
            :test-id="item.testId"
            :to="item.to"
            :visible="item.visible"
            :thick-divider="item.thickDivider"
        />

        <v-divider class="section-divider" />
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import NavigationItem from "@/components/widgets/navigationWidgets/NavigationItem.vue";
import { NavigationSectionItem } from "@/components/widgets/navigationWidgets/navigationTypes";

const props = withDefaults(
    defineProps<{
        title: string;
        items: NavigationSectionItem[];
        showTitle?: boolean;
    }>(),
    {
        showTitle: true,
    },
);

const visibleItems = computed(() =>
    props.items.filter((item) => item.visible !== false),
);
</script>

<style scoped>
.section-divider {
    background-color: white !important;
    height: 1px !important;
    opacity: 1 !important;
    width: 85% !important;
}
</style>
