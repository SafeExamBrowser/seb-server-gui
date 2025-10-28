<template>
    <!-- TODO @alain: proper layout -->

    <ul>
        <li
            v-for="supervisor in supervisors"
            :key="supervisor.modelId"
            @click="emit('select', supervisor.modelId)"
        >
            {{ supervisor.name }}
        </li>
    </ul>
</template>

<script setup lang="ts">
import { UserAccountName } from "@/models/userAccount";

defineProps<{
    supervisors: UserAccountName[];
}>();

const emit = defineEmits<{
    (e: "select", supervisorId: string): void;
}>();
</script>
