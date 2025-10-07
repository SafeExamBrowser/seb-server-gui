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
            <div class="d-flex ga-2 justify-end">
                <ClientGroupEdit :item="item" />
                <ClientGroupDelete :item="item" />
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { storeToRefs } from "pinia";

const { groups } = storeToRefs(useStepClientGroupStore());

// TODO @alain: i18n for table headers
const headers = [
    { title: "Name", value: "name" },
    { title: "Type", value: "type" },
    { title: "Actions", value: "actions", align: "end" as const },
];
</script>
