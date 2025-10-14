<template>
    <ClientGroupDialog
        icon-activator="mdi-plus-circle-outline"
        color-activator="primary"
        :label-activator="$t('clientGroups.addDialogTitle')"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.createButton')"
        :client-group="getEmptyClientGroup()"
        @submit="handleCreate"
    />
</template>

<script setup lang="ts">
import {
    getEmptyClientGroup,
    useStepClientGroupStore,
} from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";

const { createGroup } = useStepClientGroupStore();

const handleCreate = (clientGroup: ClientGroup) => {
    createGroup(clientGroup);
};
</script>
