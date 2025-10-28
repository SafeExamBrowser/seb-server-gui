<template>
    <!-- TODO @alain: proper layout -->
    <div>
        <h3>Available supervisors:</h3>
        <SupervisorList
            :supervisors="supervisorsAvailable"
            @select="handleSupervisorSelected"
        />
        <h3>Selected supervisors:</h3>
        <SupervisorList
            :supervisors="supervisorsSelected"
            @select="handleSupervisorUnselected"
        />
    </div>
</template>

<script setup lang="ts">
import { UserAccountName } from "@/models/userAccount";
import { computed } from "vue";

const props = defineProps<{
    supervisors: UserAccountName[];
}>();

const supervisorIdsSelected = defineModel<string[]>({
    required: true,
});

const supervisorsAvailable = computed(() =>
    props.supervisors.filter(
        (supervisor) =>
            !supervisorIdsSelected.value.includes(supervisor.modelId),
    ),
);

const supervisorsSelected = computed(() =>
    props.supervisors.filter((supervisor) =>
        supervisorIdsSelected.value.includes(supervisor.modelId),
    ),
);

const handleSupervisorSelected = (supervisorId: string) => {
    if (supervisorIdsSelected.value.includes(supervisorId)) {
        throw new Error("Supervisor already selected");
    }

    supervisorIdsSelected.value = [
        ...supervisorIdsSelected.value,
        supervisorId,
    ];
};

const handleSupervisorUnselected = (supervisorId: string) => {
    if (!supervisorIdsSelected.value.includes(supervisorId)) {
        throw new Error("Supervisor not selected");
    }

    supervisorIdsSelected.value = [
        ...supervisorIdsSelected.value.filter((id) => id !== supervisorId),
    ];
};
</script>
