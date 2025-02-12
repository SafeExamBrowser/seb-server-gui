<template>
    <InfoBoxExamDetail></InfoBoxExamDetail>
    <MainContentExamDetail></MainContentExamDetail>
</template>

<script setup lang="ts">
    import { useAppBarStore } from '@/stores/store';
    import * as constants from "@/utils/constants";
    import * as examViewService from "@/services/component-services/examViewService";

    //stores
    const appBarStore = useAppBarStore();

    onBeforeMount(async () => {
        appBarStore.title = constants.EXAMS_DETAIL_TITLE;
    });


</script>

<style scoped>

</style>