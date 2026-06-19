<template>
    <ExamTemplateBox>
        <ClientGroupsTable :deps="tableDeps" />
    </ExamTemplateBox>
</template>

<script setup lang="ts">
import ExamTemplateBox from "./ExamTemplateBox.vue";
import ClientGroupsTable from "@/components/widgets/clientGroupsTable/ClientGroupsTable.vue";
import { ClientGroupsTableDeps } from "@/components/widgets/clientGroupsTable/types.ts";
import { ClientGroupExisting } from "@/models/seb-server/examTemplate.ts";
import { useClientGroups } from "@/pages/(app)/exam-template/[id]/composables/api/useClientGroups.ts";

const {
    examTemplateId,
    clientGroups: initialClientGroups,
    screenProctoring,
} = defineProps<{
    examTemplateId: number;
    clientGroups: ClientGroupExisting[];
    screenProctoring: ClientGroupsTableDeps["screenProctoring"];
}>();

const { clientGroups, createItem, updateItem, deleteItem } = useClientGroups(
    examTemplateId,
    initialClientGroups,
);

const tableDeps = {
    clientGroups,
    screenProctoring,
    createItem,
    updateItem,
    deleteItem,
    confirmDelete: true,
};
</script>
