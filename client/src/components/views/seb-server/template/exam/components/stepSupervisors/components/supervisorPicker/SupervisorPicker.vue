<template>
    <v-container clas="ma-0 pa-0">
        <v-row>
            <v-col cols="6">
                <ListHeader :label="titleSupervisorsAvailable" />
                <ListBody
                    :supervisors="supervisorsAvailable"
                    @select="handleSupervisorSelected"
                />
            </v-col>
            <v-col cols="6">
                <ListHeader :label="titleSupervisorsSelected" />
                <ListBody
                    :supervisors="supervisorsSelected"
                    @select="handleSupervisorUnselected"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import ListHeader from "./components/ListHeader.vue";
import ListBody from "./components/ListBody.vue";
import { UserAccountName } from "@/models/userAccount";
import { usePicker } from "@/components/views/seb-server/template/exam/components/stepSupervisors/components/supervisorPicker/composables/usePicker";

const props = defineProps<{
    supervisors: UserAccountName[];
}>();

const supervisorIdsSelected = defineModel<string[]>({
    required: true,
});

const {
    titleSupervisorsAvailable,
    titleSupervisorsSelected,
    supervisorsAvailable,
    supervisorsSelected,
    handleSupervisorSelected,
    handleSupervisorUnselected,
} = usePicker(props.supervisors, supervisorIdsSelected);
</script>
