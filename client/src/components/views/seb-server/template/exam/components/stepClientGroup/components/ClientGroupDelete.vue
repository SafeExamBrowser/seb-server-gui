<template>
    <!-- TODO @alain: i18n for button label -->
    <v-btn
        icon="mdi-delete"
        color="medium-emphasis"
        variant="text"
        density="compact"
        size="small"
        title="Delete"
        aria-label="Delete"
        @click="handleDeleteClick"
    ></v-btn>
</template>

<script setup lang="ts">
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";

const props = defineProps<{
    item: ClientGroup;
}>();

const { deleteGroup } = useStepClientGroupStore();

const handleDeleteClick = () => {
    deleteGroup(props.item);
};
</script>
