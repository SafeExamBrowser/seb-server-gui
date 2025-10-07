<template>
    <!-- TODO @alain: i18n for button label & correct styling for button -->
    <v-btn @click="handleOpenDialog">Add new Group</v-btn>
    <v-dialog v-model="dialogOpen" width="auto" @close="handleCancel">
        <!-- TODO @alain: i18n for title -->
        <v-card title="Add group">
            <template #text>
                <!-- TODO @alain: add form here -->
                <div>This is the form</div>
            </template>
            <template #actions>
                <!-- TODO @alain: i18n for button labels -->
                <v-btn text="Cancel" @click="handleCancel"></v-btn>
                <v-btn text="Create" @click="handleCreate"></v-btn>
            </template>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";

const dialogOpen = ref(false);

const handleOpenDialog = () => {
    dialogOpen.value = true;
};

const handleCancel = () => {
    dialogOpen.value = false;
};

const handleCreate = () => {
    const newGroup: ClientGroup = {
        name: "New Group",
        type: ClientGroupEnum.IP_V4_RANGE,
        ipRangeStart: "192.168.1.1",
        ipRangeEnd: "192.168.1.100",
    };

    // TODO @alain: add this to store instead
    console.log("create:", newGroup);
};
</script>
