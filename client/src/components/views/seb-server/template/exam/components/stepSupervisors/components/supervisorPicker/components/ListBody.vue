<template>
    <v-data-table
        :headers="[]"
        :hover="supervisors.length > 0"
        :items="supervisors"
        item-key="modelId"
        hide-default-header
        class="fill-height border rounded-lg"
    >
        <template #item="{ item }">
            <tr class="cursor-pointer" @click="handleSupervisorClick(item)">
                <td class="d-flex align-center">
                    <span class="flex-grow-1 flex-shrink-1">{{
                        item.name
                    }}</span>
                    <span class="flex-grow-0 flex-shrink-0">
                        <slot name="icon"></slot>
                    </span>
                </td>
            </tr>
        </template>
        <template #no-data></template>
    </v-data-table>
</template>

<script setup lang="ts">
import { UserAccountName } from "@/models/userAccount";

defineProps<{
    supervisors: UserAccountName[];
}>();

const emit = defineEmits<{
    (e: "select", supervisorId: string): void;
}>();

const handleSupervisorClick = (supervisor: UserAccountName) => {
    emit("select", supervisor.modelId);
};
</script>
