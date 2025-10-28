<template>
    <SupervisorsAvailable
        v-if="supervisorsAvailable"
        :supervisors="supervisorsAvailable"
        @select="handleSupervisorSelected"
    />
</template>

<script setup lang="ts">
import { UserAccountName } from "@/models/userAccount";
import { computed } from "vue";

const props = defineProps<{
    supervisors: UserAccountName[];
}>();

const superVisorIdsSelected = defineModel<string[]>({
    required: true,
});

const supervisorsAvailable = computed(() =>
    props.supervisors.filter(
        (supervisor) =>
            !superVisorIdsSelected.value.includes(supervisor.modelId),
    ),
);

const handleSupervisorSelected = (supervisorId: string) => {
    if (superVisorIdsSelected.value.includes(supervisorId)) {
        throw new Error("Supervisor already selected");
    }

    superVisorIdsSelected.value = [
        ...superVisorIdsSelected.value,
        supervisorId,
    ];
};
</script>
