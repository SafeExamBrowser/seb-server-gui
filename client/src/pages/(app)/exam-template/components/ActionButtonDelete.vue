<template>
    <ActionButtonLoading v-if="isDeleting" />
    <ActionButton
        v-else
        icon="mdi-delete"
        :title="$t('general.deleteButton')"
        @click="showDialog = true"
    />

    <v-dialog
        v-model="showDialog"
        :max-width="useDisplay().thresholds.value.sm"
    >
        <DeleteConfirmDialog
            :title="$t('examTemplateList.deleteDialog.title')"
            :info-text="$t('examTemplateList.deleteDialog.infoText')"
            :question-text="$t('examTemplateList.deleteDialog.questionText')"
            @close-delete-dialog="showDialog = false"
            @delete-function="handleDelete"
        />
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ExamTemplate } from "@/models/seb-server/examTemplate.ts";
import { useDeleteExamTemplate } from "@/pages/(app)/exam-template/composables/api/useDeleteExamTemplate.ts";
import ActionButton from "@/pages/(app)/exam-template/components/ActionButton.vue";
import ActionButtonLoading from "@/pages/(app)/exam-template/components/ActionButtonLoading.vue";
import DeleteConfirmDialog from "@/components/widgets/DeleteConfirmDialog.vue";
import { useDisplay } from "vuetify";

const props = defineProps<{
    item: ExamTemplate;
}>();

const emit = defineEmits<{
    (e: "changed"): void;
}>();

const showDialog = ref(false);

const { mutateData: deleteTemplate, loading: isDeleting } =
    useDeleteExamTemplate();

const handleDelete = async () => {
    showDialog.value = false;

    if (!props.item.id) {
        throw new Error("ExamTemplate without id can't be deleted");
    }

    await deleteTemplate(props.item.id);
    emit("changed");
};
</script>
