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

        <v-col cols="7" class="pl-16 pr-16 pb-4">

            <v-row v-for="(row, rowIndex) in examTemplateRows" :key="rowIndex">
                <v-col cols="4" v-for="(examTemplate, colIndex) in row" :key="`${rowIndex}-${colIndex}`">

                    <v-card 
                        class="rounded-lg"
                        color="primary"
                        :ripple="false"
                        :variant="quizImportStore.selectedExamTemplate?.id == examTemplate.id ? 'flat' : 'tonal'"
                        :hover="true"
                        @click="onTemplateCardClick(examTemplate)">

                        <v-toolbar color="transparent">
                            <v-toolbar-title class="text-h6" :text="examTemplate.name"></v-toolbar-title>

                            <template v-slot:append>
                                <v-btn icon="mdi-information"></v-btn>
                            </template>
                        </v-toolbar>

                        <v-card-text></v-card-text>

                        <v-card-actions>
                        </v-card-actions>
                    </v-card>


                </v-col>
            </v-row>

        </v-col>
    </v-row>



</template>


<script setup lang="ts">
    import * as quizImportWizardViewService from "@/services/component-services/quizImportWizardViewService";
    import { useQuizImportStore } from "@/stores/quizImportStore";

    //stores
    const quizImportStore = useQuizImportStore();

    //items
    const examTemplates = ref<ExamTemplates>();

    //=======================events & watchers=======================
    onBeforeMount(async () => {

        const examTemplatesResponse: ExamTemplates | null = await quizImportWizardViewService.getExamTemplates();

        if(examTemplatesResponse == null){
            //todo: add error handling
            return;
        }

        examTemplates.value = examTemplatesResponse;

        console.log(await quizImportWizardViewService.getExamTemplates());

    });


    function onTemplateCardClick(examTemplate: ExamTemplate){
        if(examTemplate.id == quizImportStore.selectedExamTemplate?.id){
            quizImportStore.selectedExamTemplate = null;
            return;
        }

        quizImportStore.selectedExamTemplate = examTemplate;
    }



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