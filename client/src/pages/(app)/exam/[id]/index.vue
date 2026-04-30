<template>
    <ExamDetailInfo></ExamDetailInfo>
    <ExamDetailMain :id="id"></ExamDetailMain>
</template>

<script setup lang="ts">
import ExamDetailMain from "@/pages/(app)/exam/[id]/components/ExamDetailMain.vue";
import ExamDetailInfo from "@/pages/(app)/exam/[id]/components/ExamDetailInfo.vue";
import { useRoute } from "vue-router";

definePage({
    meta: {
        titleKey: "titles.examDetails",
        pageTestId: "exam-details-page",
    },
});

const route = useRoute();
const id = route.params.id;
</script>

<style scoped></style>
