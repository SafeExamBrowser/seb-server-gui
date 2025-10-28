<template>
    <ul>
        <li v-for="supervisor in supervisors" :key="supervisor.modelId">
            {{ supervisor.name }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { UserAccountName } from "@/models/userAccount";

defineProps<{
    supervisors: UserAccountName[];
}>();
</script>
