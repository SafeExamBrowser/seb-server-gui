<template>
    <ExamDetailInfo></ExamDetailInfo>
    <ExamDetailMain></ExamDetailMain>
</template>

<script setup lang="ts">
    import { useAppBarStore } from '@/stores/store';
    import * as constants from "@/utils/constants";
    import * as examViewService from "@/services/component-services/examViewService";
    import { useI18n } from "vue-i18n";
    import {translate} from "@/utils/generalUtils";

    //stores
    const appBarStore = useAppBarStore();

    //i18n
    const i18n = useI18n();

    onBeforeMount(async () => {
        appBarStore.title = translate("titles.examDetails");
    });


</script>

<style scoped>

</style>