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
                <ClientGroupAdd />
            </TableHeader>
        </template>
        <template #item.actions="{ item }">
            <TableItemActions
                :item="item"
                @edit="handleItemEdit"
                @delete="handleItemDelete"
            />
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import TableItemActions from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/TableItemActions.vue";
import { storeToRefs } from "pinia";

const { deleteGroup } = useStepClientGroupStore();
const { groups } = storeToRefs(useStepClientGroupStore());

// TODO @alain: i18n for table headers
const headers = [
    { title: "Name", value: "name" },
    { title: "Type", value: "type" },
    { title: "Actions", value: "actions", align: "end" as const },
];

const handleItemEdit = (group: ClientGroup) => {
    // TODO @alain: implement edit form
    console.log("edit", group);
};

const handleItemDelete = (group: ClientGroup) => {
    deleteGroup(group);
};
</script>
