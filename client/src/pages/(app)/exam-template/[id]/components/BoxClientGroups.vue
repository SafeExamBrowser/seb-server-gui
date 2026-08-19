<template>
    <DetailBox>
        <ClientGroupsTable :deps="tableDeps" />
    </DetailBox>
</template>

<script setup lang="ts">
import { computed } from "vue";

import ClientGroupsTable from "@/components/widgets/clientGroupsTable/ClientGroupsTable.vue";
import { ClientGroupsTableDeps } from "@/components/widgets/clientGroupsTable/types.ts";
import DetailBox from "@/components/widgets/DetailBox.vue";
import { ClientGroupExisting } from "@/models/seb-server/examTemplate.ts";
import { useClientGroups } from "@/pages/(app)/exam-template/[id]/composables/api/useClientGroups.ts";

const { examTemplateId, clientGroups, screenProctoring } = defineProps<{
    examTemplateId: number;
    clientGroups: ClientGroupExisting[];
    screenProctoring: ClientGroupsTableDeps["screenProctoring"];
}>();

const { createItem, updateItem, deleteItem } = useClientGroups(examTemplateId);

const tableDeps = {
    clientGroups: computed(() => clientGroups),
    screenProctoring,
    createItem,
    updateItem,
    deleteItem,
    confirmDelete: true,
};
</script>
