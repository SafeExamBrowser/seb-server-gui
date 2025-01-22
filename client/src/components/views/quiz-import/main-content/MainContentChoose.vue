<template>

    <v-row>
        <v-col>
            Choose Exam Template
        </v-col>
    </v-row>
    
    <v-row>
        <v-col cols="5">
            Select an exam template to automatically create the exam,
            exam configuration and indicators defined by the template.
        </v-col>

        <v-col cols="7" class="pr-4 pb-4">

            <v-row v-for="(row, rowIndex) in examTemplateRows" :key="rowIndex">
                <v-col cols="4" v-for="(examTemplate, colIndex) in row" :key="`${rowIndex}-${colIndex}`">

                    <v-card 
                        elevation="4"
                        class="rounded-lg"
                        min-height="150px"
                        color="primary">

                        <v-card-title>{{ examTemplate.name }}</v-card-title>
                    
                    </v-card>


                </v-col>
            </v-row>

        </v-col>
    </v-row>



</template>


<script setup lang="ts">
    import * as quizImportWizardViewService from "@/services/component-services/quizImportWizardViewService";


    //items
    const examTemplates = ref<ExamTemplates>();


    onBeforeMount(async () => {

        const examTemplatesResponse: ExamTemplates | null = await quizImportWizardViewService.getExamTemplates();

        if(examTemplatesResponse == null){
            //todo: add error handling
            return;
        }

        examTemplates.value = examTemplatesResponse;

        console.log(await quizImportWizardViewService.getExamTemplates());

    });


    const examTemplateRows = computed(() => {
        const chunkSize = 3;
        return examTemplates.value?.content.reduce<ExamTemplate[][]>((acc, item, index) => {
            const chunkIndex = Math.floor(index / chunkSize);

            if (!acc[chunkIndex]){
                acc[chunkIndex] = [];
            } 

            acc[chunkIndex].push(item);

            return acc;
        }, []);
    });




</script>

<style scoped>


</style>