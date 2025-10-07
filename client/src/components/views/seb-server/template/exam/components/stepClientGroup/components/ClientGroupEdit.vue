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
                <!-- TODO @alain: add form here -->
                <div>This is the form</div>
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

const props = defineProps<{
    item: ClientGroup;
}>();

const dialogOpen = ref(false);

const handleOpenDialog = () => {
    dialogOpen.value = true;
};

const handleCancel = () => {
    dialogOpen.value = false;
};

const handleUpdate = () => {
    // TODO @alain: update group in store
    console.log("update group:", props.item);
    dialogOpen.value = false;
};
</script>
