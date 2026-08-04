<template>
    <ActionButton
        color="error"
        variant="outlined"
        :disabled="!deleteEnabled"
        @click="handleClick"
    >
        <v-icon start>mdi-delete-outline</v-icon>
        {{ $t("examDetail.sidePanel.actions.deleteExam") }}
    </ActionButton>

    <DeleteConfirmDialog
        v-model="deleteDialogOpen"
        :title="$t('examDetail.deleteDialog.title')"
        :text="$t('examDetail.deleteDialog.text')"
        :confirm-label="$t('examDetail.deleteDialog.action')"
        :detail-text="exam?.quizName"
        @confirm="handleConfirm"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { VIcon } from "vuetify/components";

import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import { Exam } from "@/models/seb-server/exam.ts";
import { GUIAction, useAbilities } from "@/services/ability.ts";

import ActionButton from "./ActionButton.vue";

const props = defineProps<{
    exam?: Exam;
}>();

const emit = defineEmits<{
    delete: [];
}>();

const ability = useAbilities();

const excludedFromDeletion = computed(
    () => props.exam?.excludeFromDeletion ?? false,
);

const deleteEnabled = computed(
    () =>
        ability.canDoExamAction(GUIAction.DELETE_EXAM, props.exam ?? null) &&
        !excludedFromDeletion.value,
);

const deleteDialogOpen = ref(false);

const handleClick = () => {
    deleteDialogOpen.value = true;
};

const handleConfirm = () => {
    deleteDialogOpen.value = false;
    emit("delete");
};
</script>
