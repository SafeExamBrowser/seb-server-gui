<template>
    <ClientGroupDialog
        :disabled="!allowCreateNewClientGroup"
        icon-activator="mdi-plus-circle-outline"
        color-activator="primary"
        :label-activator="$t('clientGroups.addDialogTitle')"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.createButton')"
        :get-client-group="getClientGroup"
        @submit="handleCreate"
    />
</template>

<script setup lang="ts">
import {
    getEmptyClientGroup,
    useStepClientGroupStore,
} from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { storeToRefs } from "pinia";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
import { computed } from "vue";
import ClientGroupDialog from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/clientGroupDialog/ClientGroupDialog.vue";

const { createGroup } = useStepClientGroupStore();

const {
    enabled: screenProctoringEnabled,
    collectionStrategy: screenProctoringCollectionStrategy,
} = storeToRefs(useScreenProctoringStore());

const allowCreateNewClientGroup = computed<boolean>(() => {
    return !(
        screenProctoringEnabled.value &&
        screenProctoringCollectionStrategy.value === undefined
    );
});

const getClientGroup = () => {
    return getEmptyClientGroup();
};

const handleCreate = (clientGroup: ClientGroup) => {
    createGroup(clientGroup);
};
</script>
