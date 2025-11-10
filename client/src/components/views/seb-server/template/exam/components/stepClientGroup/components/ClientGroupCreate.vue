<template>
    <CrudDialog
        :disabled="!allowCreateNewClientGroup"
        icon-activator="mdi-plus-circle-outline"
        color-activator="primary"
        :label-activator="$t('clientGroups.addDialogTitle')"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.createButton')"
        form-id="client-group-form"
        :get-form-fields="getFormFields"
        :get-item="getEmptyClientGroup"
        @submit="handleCreate"
    />
</template>

<script setup lang="ts">
import {
    getEmptyClientGroup,
    useStepClientGroupStore,
} from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import CrudDialog from "@/components/widgets/crud/CrudDialog.vue";
import {
    ClientGroupTransient,
    clientGroupTransientToClientGroup,
} from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { storeToRefs } from "pinia";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
import { computed } from "vue";
import { useFormFields } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/useFormFields";

const { createGroup } = useStepClientGroupStore();
const { getFormFields } = useFormFields();

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

const handleCreate = (clientGroup: ClientGroupTransient) => {
    createGroup(clientGroupTransientToClientGroup(clientGroup));
};
</script>
