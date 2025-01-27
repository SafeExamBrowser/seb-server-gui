<template>

    main content config

</template>


<script setup lang="ts">
    import * as quizImportWizardViewService from "@/services/component-services/quizImportWizardViewService";
    import { useQuizImportStore } from "@/stores/quizImportStore";


    //stores
    const quizImportStore = useQuizImportStore();


    onBeforeMount(async () => {

        if(quizImportStore.selectedQuiz == null || quizImportStore.selectedExamTemplate == null){
            return;
        }

        
        const createExamParams: CreateExamPar = {
            lmsSetupId: quizImportStore.selectedQuiz.lms_setup_id,
            lms_setup_id: quizImportStore.selectedQuiz.lms_setup_id,
            externalId: quizImportStore.selectedQuiz.quiz_id,
            quiz_id: quizImportStore.selectedQuiz.quiz_id,
            examTemplateId: quizImportStore.selectedExamTemplate.id,
            quitPassword: quizImportStore.selectedQuitPassword,
            supporter: quizImportStore.selectedExamSupervisors.map(userAccountName => userAccountName.modelId)
        }

        console.log(await quizImportWizardViewService.createExam(createExamParams))

    });



</script>



<style scoped>


</style>