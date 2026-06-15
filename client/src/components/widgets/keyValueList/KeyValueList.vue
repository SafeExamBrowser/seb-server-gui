<template>
    <div>
        <template v-for="(item, index) in items" :key="item.key">
            <KeyValueItemBasic
                v-if="item.type === 'basic'"
                :item="item"
                :is-first="index === 0"
            />
            <KeyValueItemCollection
                v-if="item.type === 'collection'"
                :item="item"
                :is-first="index === 0"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import KeyValueItemBasic from "./components/KeyValueItemBasic.vue";
import KeyValueItemCollection from "./components/KeyValueItemCollection.vue";
import { KeyValueItem } from "./types.ts";

defineProps<{
    items: KeyValueItem[];
}>();
</script>
