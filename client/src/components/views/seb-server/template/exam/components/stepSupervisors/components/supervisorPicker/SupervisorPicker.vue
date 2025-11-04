<template>
    <v-row class="fill-height w-100 overflow-y-auto">
        <v-col
            class="fill-height overflow-y-auto d-flex flex-column ga-2"
            cols="6"
        >
            <ListHeader :label="titleSupervisorsAvailable" />
            <SearchField v-model="searchText" />
            <ListBody
                :supervisors="supervisorsAvailable"
                :with-pagination="true"
                @select="handleSupervisorSelected"
            >
                <template #icon>
                    <v-icon color="primary">mdi-plus</v-icon>
                </template>
            </ListBody>
        </v-col>
        <v-col
            class="fill-height overflow-y-auto d-flex flex-column ga-2"
            cols="6"
        >
            <ListHeader :label="titleSupervisorsSelected" />
            <ListBody
                :supervisors="supervisorsSelected"
                :with-pagination="false"
                @select="handleSupervisorUnselected"
            >
                <template #icon>
                    <v-icon color="error">mdi-minus</v-icon>
                </template>
            </ListBody>
        </v-col>
    </v-row>
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
    searchText,
    supervisorsAvailable,
    supervisorsSelected,
    handleSupervisorSelected,
    handleSupervisorUnselected,
} = usePicker(props.supervisors, supervisorIdsSelected);
</script>
