<template>
    <ClientGroupDialog
        icon-activator="mdi-pencil"
        color-activator="medium-emphasis"
        size-activator="small"
        :label-activator="$t('clientGroups.editDialogTitle')"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.saveButton')"
        :get-client-group="getClientGroup"
        @submit="handleUpdate"
    />
</template>

<script setup lang="ts">
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
const { updateGroup } = useStepClientGroupStore();

const props = defineProps<{
    clientGroup: ClientGroup;
}>();

const getClientGroup = () => {
    return {
        ...props.clientGroup,
        isValid: true,
    };
};

const handleUpdate = (clientGroup: ClientGroup) => {
    updateGroup(clientGroup);
};
</script>
