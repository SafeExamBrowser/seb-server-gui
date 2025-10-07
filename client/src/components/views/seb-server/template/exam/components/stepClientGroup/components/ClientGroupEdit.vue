<template>
    <!-- TODO @alain: i18n for button label -->
    <v-btn
        icon="mdi-pencil"
        color="medium-emphasis"
        variant="text"
        density="compact"
        size="small"
        title="Edit"
        aria-label="Edit"
        @click="handleOpenDialog"
    ></v-btn>

    <v-dialog v-model="dialogOpen" width="auto" @close="handleCancel">
        <!-- TODO @alain: i18n for title -->
        <v-card title="Edit group">
            <template #text>
                <!-- TODO @alain: add form here -->
                <div>This is the form</div>
            </template>
            <template #actions>
                <!-- TODO @alain: i18n for button labels -->
                <v-btn text="Cancel" @click="handleCancel"></v-btn>
                <v-btn text="Save" @click="handleUpdate"></v-btn>
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
