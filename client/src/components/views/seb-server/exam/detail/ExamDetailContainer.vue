<template>
    <ExamDetailInfo></ExamDetailInfo>
    <ExamDetailMain></ExamDetailMain>
</template>

<script setup lang="ts">
import { useAppBarStore } from "@/stores/store";
import { translate } from "@/utils/generalUtils";
import { onBeforeMount } from "vue";
import ExamDetailMain from "@/components/views/seb-server/exam/detail/ExamDetailMain.vue";
import ExamDetailInfo from "@/components/views/seb-server/exam/detail/ExamDetailInfo.vue";

// stores
const appBarStore = useAppBarStore();

onBeforeMount(async () => {
    appBarStore.title = translate("titles.examDetails");
});
</script>

<style scoped></style>
