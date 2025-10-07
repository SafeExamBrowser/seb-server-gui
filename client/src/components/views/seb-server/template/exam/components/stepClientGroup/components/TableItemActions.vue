<template>
    <div class="d-flex ga-2 justify-end">
        <!-- TODO @alain: i18n for button labels -->
        <v-btn
            icon="mdi-pencil"
            color="medium-emphasis"
            variant="text"
            density="compact"
            size="small"
            title="Edit"
            aria-label="Edit"
            @click="handleEditClick(item)"
        ></v-btn>
        <v-btn
            icon="mdi-delete"
            color="medium-emphasis"
            variant="text"
            density="compact"
            size="small"
            title="Delete"
            aria-label="Delete"
            @click="handleDeleteClick(item)"
        ></v-btn>
    </div>
</template>

<script setup lang="ts">
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";

const handleEditClick = (item: ClientGroup) => {
    emit("edit", item);
};

const handleDeleteClick = (item: ClientGroup) => {
    emit("delete", item);
};

defineProps<{
    item: ClientGroup;
}>();

const emit = defineEmits<{
    edit: [item: ClientGroup];
    delete: [item: ClientGroup];
}>();
</script>
