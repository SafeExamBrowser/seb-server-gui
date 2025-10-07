<template>
    <div class="d-flex ga-2 justify-end">
        <!-- TODO @alain: i18n for button labels -->
        <ClientGroupEdit :item="item" />
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
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import ClientGroupEdit from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/ClientGroupEdit.vue";

const { deleteGroup } = useStepClientGroupStore();

const handleDeleteClick = (item: ClientGroup) => {
    deleteGroup(item);
};

defineProps<{
    item: ClientGroup;
}>();
</script>
