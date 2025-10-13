<template>
    <v-btn
        icon="mdi-delete"
        color="medium-emphasis"
        variant="text"
        density="compact"
        size="small"
        :title="$t('general.deleteButton')"
        :aria-label="$t('general.deleteButton')"
        @click="handleDeleteClick"
    ></v-btn>
</template>

<script setup lang="ts">
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";

const props = defineProps<{
    clientGroup: ClientGroup;
}>();

const { deleteGroup } = useStepClientGroupStore();

const handleDeleteClick = () => {
    deleteGroup(props.clientGroup);
};
</script>
