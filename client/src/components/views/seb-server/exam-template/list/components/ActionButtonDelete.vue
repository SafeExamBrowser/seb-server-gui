<template>
    <ActionButtonLoading v-if="isDeleting" />
    <ActionButton
        v-else
        icon="mdi-delete"
        :title="$t('general.deleteButton')"
        @click="handleDelete"
    />
</template>

<script setup lang="ts">
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import { useDeleteExamTemplate } from "@/components/views/seb-server/exam-template/list/composables/api/useDeleteExamTemplate";
import ActionButton from "@/components/views/seb-server/exam-template/list/components/ActionButton.vue";
import ActionButtonLoading from "@/components/views/seb-server/exam-template/list/components/ActionButtonLoading.vue";

const props = defineProps<{
    item: ExamTemplate;
}>();

const emit = defineEmits<{
    (e: "changed"): void;
}>();

const { mutateData: deleteTemplate, loading: isDeleting } =
    useDeleteExamTemplate();

const handleDelete = async () => {
    if (!props.item.id) {
        throw new Error("ExamTemplate without id can't be deleted");
    }

    await deleteTemplate(props.item.id);
    emit("changed");
};
</script>
