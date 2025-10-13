<template>
    <v-btn
        icon="mdi-pencil"
        color="medium-emphasis"
        variant="text"
        density="compact"
        size="small"
        :title="$t('clientGroups.editDialogTitle')"
        :aria-label="$t('clientGroups.editDialogTitle')"
        @click="handleOpenDialog"
    ></v-btn>

    <v-dialog v-model="dialogOpen" width="auto" @close="handleCancel">
        <v-card :title="$t('clientGroups.editDialogTitle')">
            <template #text>
                <ClientGroupForm v-model="editedClientGroup" />
            </template>
            <template #actions>
                <v-btn
                    :text="$t('general.cancelButton')"
                    @click="handleCancel"
                ></v-btn>
                <v-btn
                    :text="$t('general.saveButton')"
                    @click="handleUpdate"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
const { updateGroup } = useStepClientGroupStore();

const props = defineProps<{
    item: ClientGroup;
}>();

const dialogOpen = ref(false);
const editedClientGroup = ref(props.item);

const handleOpenDialog = () => {
    dialogOpen.value = true;
};

const handleCancel = () => {
    dialogOpen.value = false;
    editedClientGroup.value = props.item;
};

const handleUpdate = () => {
    updateGroup(editedClientGroup.value);
    dialogOpen.value = false;
    editedClientGroup.value = props.item;
};
</script>
