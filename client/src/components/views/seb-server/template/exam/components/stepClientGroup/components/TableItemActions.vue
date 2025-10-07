<template>
    <div class="d-flex ga-2 justify-end">
        <ClientGroupEdit :item="item" />
        <ClientGroupDelete :item="item" />
    </div>
</template>

<script setup lang="ts">
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";

defineProps<{
    item: ClientGroup;
}>();
</script>
