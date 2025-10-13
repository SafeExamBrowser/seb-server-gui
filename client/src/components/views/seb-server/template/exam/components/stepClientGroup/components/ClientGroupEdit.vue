<template>
    <ClientGroupDialog
        icon-trigger="mdi-pencil"
        color-trigger="medium-emphasis"
        size-trigger="small"
        :label-trigger="$t('clientGroups.editDialogTitle')"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.saveButton')"
        :client-group="clientGroup"
        @submit="handleUpdate"
    />
</template>

<script setup lang="ts">
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
const { updateGroup } = useStepClientGroupStore();

defineProps<{
    clientGroup: ClientGroup;
}>();

const handleUpdate = (clientGroup: ClientGroup) => {
    updateGroup(clientGroup);
};
</script>
