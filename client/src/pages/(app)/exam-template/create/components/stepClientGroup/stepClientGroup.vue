<template>
    <StepItem
        :title="$t('createTemplateExam.steps.clientGroup.title')"
        :subtitle="$t('createTemplateExam.steps.clientGroup.subtitle')"
    >
        <ClientGroupsTable :deps="tableDeps" />
    </StepItem>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";

import ClientGroupsTable from "@/components/widgets/clientGroupsTable/ClientGroupsTable.vue";
import { ClientGroupsTableDeps } from "@/components/widgets/clientGroupsTable/types.ts";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import {
    ClientGroup,
    ClientGroupExisting,
} from "@/models/seb-server/examTemplate.ts";
import { ScreenProctoringCollectionStrategy } from "@/models/seb-server/screenProctoring.ts";
import { useScreenProctoringStore } from "@/pages/(app)/exam-template/create/composables/store/useScreenProctoringStore.ts";

import { useStepClientGroupStore } from "./composables/store/useStepClientGroupStore.ts";

const screenProctoringStore = useScreenProctoringStore();
const clientGroupStore = useStepClientGroupStore();

const { enabled: screenProctoringEnabled } = storeToRefs(screenProctoringStore);
const { groups } = storeToRefs(clientGroupStore);

const tableDeps: ClientGroupsTableDeps = {
    clientGroups: groups,
    screenProctoring: {
        enabled: screenProctoringEnabled,
        collectionStrategy: computed<ScreenProctoringCollectionStrategy>(
            () => "APPLY_SEB_GROUPS",
        ),
    },
    createItem: async (item: ClientGroup) => clientGroupStore.createGroup(item),
    updateItem: async (item: ClientGroupExisting) =>
        clientGroupStore.updateGroup(item),
    deleteItem: async (item: ClientGroupExisting) =>
        clientGroupStore.deleteGroup(item),
};
</script>
