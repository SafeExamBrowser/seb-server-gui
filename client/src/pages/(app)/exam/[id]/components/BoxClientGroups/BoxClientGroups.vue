<template>
    <DetailBox>
        <LoadingFallbackComponent :loading="loading" :errors="boxErrors">
            <ClientGroupsTable :deps="tableDeps" />
        </LoadingFallbackComponent>
    </DetailBox>
</template>

<script setup lang="ts">
import { computed } from "vue";

import ClientGroupsTable from "@/components/widgets/clientGroupsTable/ClientGroupsTable.vue";
import DetailBox from "@/components/widgets/DetailBox.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { Exam } from "@/models/seb-server/exam.ts";

import { useClientGroupsBox } from "./composables/useClientGroupsBox.ts";

const {
    examId,
    exam = undefined,
    refetchExam,
} = defineProps<{
    examId: number;
    exam?: Exam;
    refetchExam: () => Promise<void>;
}>();

const examRef = computed(() => exam);

const { tableDeps, loading, error } = useClientGroupsBox(
    examId,
    examRef,
    refetchExam,
);

const boxErrors = computed(() => (error.value ? [error.value] : []));
</script>
