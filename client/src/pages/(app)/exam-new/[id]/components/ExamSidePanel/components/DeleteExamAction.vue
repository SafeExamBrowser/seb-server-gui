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
        :detail-text="exam?.quizName"
        translation-key-prefix="examDetail"
        @confirm="handleConfirm"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { GUIAction, useAbilities } from "@/services/ability.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
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
