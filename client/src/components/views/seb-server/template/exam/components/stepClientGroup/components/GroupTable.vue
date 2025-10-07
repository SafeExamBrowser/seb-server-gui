<template>
    <v-data-table
        :headers="headers"
        :items="groups"
        item-key="name"
        hide-default-footer
    >
        <template #top>
            <!-- TODO @alain: i18n for label -->
            <TableHeader label="Groups">
                <!-- TODO @alain: i18n for button label -->
                <v-btn
                    icon="mdi-plus-circle-outline"
                    color="primary"
                    density="compact"
                    variant="text"
                    title="Add Group"
                    aria-label="Add Group"
                    @click="handleAddClick"
                ></v-btn>
            </TableHeader>
        </template>
        <template #item.actions="{ item }">
            <div class="d-flex ga-2 justify-end">
                <!-- TODO @alain: i18n for button labels -->
                <v-btn
                    icon="mdi-pencil"
                    color="medium-emphasis"
                    variant="text"
                    size="small"
                    title="Edit"
                    aria-label="Edit"
                    @click="handleEditClick(item)"
                ></v-btn>
                <v-btn
                    icon="mdi-delete"
                    color="medium-emphasis"
                    variant="text"
                    size="small"
                    title="Delete"
                    aria-label="Delete"
                    @click="handleDeleteClick(item)"
                ></v-btn>
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { storeToRefs } from "pinia";

const { deleteGroup } = useStepClientGroupStore();
const { groups } = storeToRefs(useStepClientGroupStore());

// TODO @alain: i18n for table headers
const headers = [
    { title: "Name", value: "name" },
    { title: "Type", value: "type" },
    { title: "Actions", value: "actions", align: "end" as const },
];

const handleAddClick = () => {
    // TODO @alain: use this for add form
    console.log("add clicked");
};

const handleEditClick = (group: ClientGroup) => {
    // TODO @alain: implement edit form
    console.log("edit", group);
};

const handleDeleteClick = (group: ClientGroup) => {
    deleteGroup(group);
};
</script>
