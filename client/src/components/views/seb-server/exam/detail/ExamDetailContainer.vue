<template>
    <ExamDetailInfo></ExamDetailInfo>
    <ExamDetailMain></ExamDetailMain>
</template>

<script setup lang="ts">
import { useAppBarStore } from "@/stores/store";
import { translate } from "@/utils/generalUtils";

// stores
const appBarStore = useAppBarStore();

onBeforeMount(async () => {
    appBarStore.title = translate("titles.examDetails");
});
</script>

<style scoped></style>
