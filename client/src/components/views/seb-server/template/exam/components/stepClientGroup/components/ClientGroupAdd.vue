<template>
    <!-- TODO @alain: i18n for button label -->
    <v-btn
        icon="mdi-plus-circle-outline"
        color="primary"
        density="compact"
        variant="text"
        title="Add Group"
        aria-label="Add Group"
        @click="handleOpenDialog"
    ></v-btn>
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
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";

const { addGroup } = useStepClientGroupStore();

const dialogOpen = ref(false);

const handleOpenDialog = () => {
    dialogOpen.value = true;
};

const handleCancel = () => {
    dialogOpen.value = false;
};

const handleCreate = () => {
    // TODO @alain: replace this, once form is implemented
    const newGroup: ClientGroup = {
        name: `New Group #${Math.random().toString(36).substring(0, 10)}`,
        type: ClientGroupEnum.IP_V4_RANGE,
        ipRangeStart: "192.168.1.1",
        ipRangeEnd: "192.168.1.100",
    };

    addGroup(newGroup);
    dialogOpen.value = false;
};
</script>
