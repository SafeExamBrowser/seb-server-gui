<template>
    <div
        class="text-body-2 text-grey-darken-1"
        data-testid="createUserAccount-form-infoText"
    >
        {{ translate(textIdentifier) }}
    </div>
</template>

<script setup lang="ts">
defineProps<{
    textIdentifier: string;
}>();

import { translate } from "@/utils/generalUtils.ts";
</script>
