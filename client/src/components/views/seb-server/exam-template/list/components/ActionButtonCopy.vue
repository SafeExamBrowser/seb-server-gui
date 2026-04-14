<template>
    <ActionButtonLoading v-if="isCopying" />
    <ActionButton
        v-else
        icon="mdi-content-copy"
        :title="$t('general.copyButton')"
        @click="handleCopy"
    />
</template>

<script setup lang="ts">
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import { useCopyExamTemplate } from "@/components/views/seb-server/exam-template/list/composables/api/useCopyExamTemplate";
import ActionButton from "@/components/views/seb-server/exam-template/list/components/ActionButton.vue";
import ActionButtonLoading from "@/components/views/seb-server/exam-template/list/components/ActionButtonLoading.vue";

const props = defineProps<{
    item: ExamTemplate;
}>();

const emit = defineEmits<{
    (e: "changed"): void;
}>();

const { mutateData: copyTemplate, loading: isCopying } = useCopyExamTemplate();

const handleCopy = async () => {
    if (!props.item.id) {
        throw new Error("ExamTemplate without id can't be copied");
    }

    await copyTemplate(props.item.id);
    emit("changed");
};
</script>
