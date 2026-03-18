<template>
    <div
        class="text-caption text-grey-darken-1 mt-1 mb-1"
        data-testid="userAccounts-search-label"
    >
        {{ translate(text) }}
    </div>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";

defineProps<{
    text: string;
}>();
</script>
