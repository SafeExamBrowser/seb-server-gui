<template>
    <div :class="{ 'border-t mt-4 pt-4': !isFirst }">
        <template v-for="(subItem, index) in item.items" :key="subItem.label">
            <KeyValueItemBasic :item="subItem" :is-first="index === 0" />
        </template>
    </div>
</template>
<script setup lang="ts">
import KeyValueItemBasic from "./KeyValueItemBasic.vue";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";

defineProps<{
    item: KeyValueItem & { type: "collection" };
    isFirst: boolean;
}>();
</script>
