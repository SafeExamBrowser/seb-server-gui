<template>


</template>

<script setup lang="ts">
    import {useQuizImportStore} from "@/stores/seb-server/quizImportStore";
    import { VDateInput } from "vuetify/labs/VDateInput";
    import {translate} from "@/utils/generalUtils";


    //stores
    const quizImportStore = useQuizImportStore();

    //emits - call loadExamItemsCaller in parent
    const emit = defineEmits<{
        loadExamItemsCaller: any;
    }>();

    //datepicker
    const datepicker = ref();


    function loadExamItemsCaller(){
        if(datepicker != null && datepicker.value != null){
            quizImportStore.startTimestamp = datepicker.value.getTime();
        }

        quizImportStore.forceNewSearch = true;
        emit("loadExamItemsCaller");
    }

    function clearForm(){
        quizImportStore.searchField = "";
        datepicker.value = null;
        quizImportStore.startTimestamp = null;
        loadExamItemsCaller();
    }

</script>

<style scoped>
</style>
