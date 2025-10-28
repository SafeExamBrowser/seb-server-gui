<template>
    <v-container clas="ma-0 pa-0">
        <v-row>
            <v-col cols="6">
                <ListTitle :label="titleSupervisorsAvailable" />
                <List
                    :supervisors="supervisorsAvailable"
                    @select="handleSupervisorSelected"
                />
            </v-col>
            <v-col cols="6">
                <ListTitle :label="titleSupervisorsSelected" />
                <List
                    :supervisors="supervisorsSelected"
                    @select="handleSupervisorUnselected"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import ListTitle from "./ListTitle.vue";
import List from "./List.vue";
import { UserAccountName } from "@/models/userAccount";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
    supervisors: UserAccountName[];
}>();

const supervisorIdsSelected = defineModel<string[]>({
    required: true,
});

const titleSupervisorsAvailable = computed(() =>
    t("createTemplateExam.steps.supervisors.labelSupervisorsAvailable"),
);

const titleSupervisorsSelected = computed(() =>
    t("createTemplateExam.steps.supervisors.labelSupervisorsSelected"),
);

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
