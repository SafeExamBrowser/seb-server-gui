<template>
    <FormDialog
        icon-activator="mdi-pencil"
        color-activator="medium-emphasis"
        size-activator="small"
        :label-activator="$t('clientGroups.editDialogTitle')"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.saveButton')"
        form-id="client-group-form"
        :get-form-fields="getFormFields"
        :get-item="getClientGroup"
        @submit="handleUpdate"
    />
</template>

<script setup lang="ts">
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { useFormFields } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/useFormFields";
import {
    ClientGroupTransient,
    clientGroupTransientToClientGroup,
} from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
const { updateGroup } = useStepClientGroupStore();
const { getFormFields } = useFormFields();

const props = defineProps<{
    clientGroup: ClientGroup;
}>();

const getClientGroup = () => {
    return {
        ...props.clientGroup,
    };
};

const handleUpdate = (clientGroup: ClientGroupTransient) => {
    updateGroup(clientGroupTransientToClientGroup(clientGroup));
};
</script>
