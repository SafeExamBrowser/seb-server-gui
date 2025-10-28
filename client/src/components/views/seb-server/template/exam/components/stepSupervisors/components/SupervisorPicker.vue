<template>
    <v-container clas="ma-0 pa-0">
        <v-row>
            <v-col cols="6">
                <h4 class="text-subtitle-1 font-weight-medium">
                    {{
                        $t(
                            "createTemplateExam.steps.supervisors.labelSupervisorsAvailable",
                        )
                    }}
                </h4>
                <SupervisorList
                    :supervisors="supervisorsAvailable"
                    @select="handleSupervisorSelected"
                />
            </v-col>
            <v-col cols="6">
                <h4 class="text-subtitle-1 font-weight-medium">
                    {{
                        $t(
                            "createTemplateExam.steps.supervisors.labelSupervisorsSelected",
                        )
                    }}
                </h4>
                <SupervisorList
                    :supervisors="supervisorsSelected"
                    @select="handleSupervisorUnselected"
                />
            </v-col>
        </v-row>
    </v-container>
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
