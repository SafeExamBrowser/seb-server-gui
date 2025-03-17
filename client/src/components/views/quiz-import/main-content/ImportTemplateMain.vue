<template>

    <v-row>
        <v-col cols="5">
            <v-row>
                <v-col class="text-h6">
                    Click on the Exam Template you want to use for the exam
                </v-col>
            </v-row>
        </v-col>

        <v-col cols="7" class="pl-16 pr-16 pb-4">

            <v-row v-for="(row, rowIndex) in examTemplateRows" :key="rowIndex">
                <v-col cols="4" v-for="(examTemplate, colIndex) in row" :key="`${rowIndex}-${colIndex}`">

                    <v-card 
                        class="rounded-lg"
                        :color="examTemplate.name == 'System Template' ? 'green' : 'primary'"
                        :ripple="false"
                        :variant="quizImportStore.selectedExamTemplate?.id == examTemplate.id ? 'flat' : 'tonal'"
                        :hover="true"
                        @click="onTemplateCardClick(examTemplate)">

                        <v-toolbar color="transparent">
                            <v-toolbar-title class="text-h6" :text="examTemplate.name"></v-toolbar-title>

                            <template v-slot:append>
                                <v-btn @click.stop="openExamTemplateDialog(examTemplate)" icon="mdi-information"></v-btn>
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


    <!-----------description popup---------->      
    <v-dialog v-model="dialog" max-width="600">
        <ExamTemplateDialog 
            :exam-template="selectedTemplate"
            @close-exam-template-dialog="closeExamTemplateDialog()">
        </ExamTemplateDialog>
    </v-dialog>

</template>


<script setup lang="ts">
    import ExamTemplateDialog from "@/components/widgets/ExamTemplateDialog.vue";
    import * as quizImportWizardViewService from "@/services/component-services/quizImportWizardViewService";
    import { useQuizImportStore } from "@/stores/quizImportStore";

    //stores
    const quizImportStore = useQuizImportStore();

    //items
    const examTemplates = ref<ExamTemplates>();

    //dialog - description popup
    const dialog = ref(false);
    const selectedTemplate = ref<ExamTemplate | null>(null);

    //=======================events & watchers=======================
    onBeforeMount(async () => {

        const examTemplatesResponse: ExamTemplates | null = await quizImportWizardViewService.getExamTemplates();

        if(examTemplatesResponse == null){
            return;
        }

        examTemplates.value = examTemplatesResponse;
    });


    function onTemplateCardClick(examTemplate: ExamTemplate){
        if(examTemplate.id == quizImportStore.selectedExamTemplate?.id){
            quizImportStore.selectedExamTemplate = null;
            return;
        }

        quizImportStore.selectedExamTemplate = examTemplate;
    }

    function openExamTemplateDialog(examTemplate: ExamTemplate){
        selectedTemplate.value = examTemplate;
        dialog.value = true;
    }

    function closeExamTemplateDialog(){
        dialog.value = false;
    }

    //===================================================


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