<template>
    <v-btn
        icon="mdi-plus-circle-outline"
        color="primary"
        density="compact"
        variant="text"
        :title="$t('clientGroups.addDialogTitle')"
        :aria-label="$t('clientGroups.addDialogTitle')"
        @click="handleOpenDialog"
    ></v-btn>
    <v-dialog v-model="dialogOpen" width="auto" @close="handleCancel">
        <v-card :title="$t('clientGroups.addDialogTitle')">
            <template #text>
                <ClientGroupForm v-model="newClientGroup" />
            </template>
            <template #actions>
                <v-btn
                    :text="$t('general.cancelButton')"
                    @click="handleCancel"
                ></v-btn>
                <v-btn
                    :text="$t('general.createButton')"
                    @click="handleCreate"
                ></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
    getEmptyClientGroup,
    useStepClientGroupStore,
} from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";

const { createGroup } = useStepClientGroupStore();

const dialogOpen = ref(false);
const newClientGroup = ref(getEmptyClientGroup());

const handleOpenDialog = () => {
    dialogOpen.value = true;
};

const handleCancel = () => {
    dialogOpen.value = false;
    newClientGroup.value = getEmptyClientGroup();
};

const handleCreate = () => {
    createGroup(newClientGroup.value);
    dialogOpen.value = false;
    newClientGroup.value = getEmptyClientGroup();
};
</script>
