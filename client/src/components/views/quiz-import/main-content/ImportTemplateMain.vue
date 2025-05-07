<template>

    <v-row>
        <v-spacer></v-spacer>
        <v-col cols="6" xl="4">
            <v-row>
                <v-col class="text-h6">
                    {{translate('quizImportWizard.templateMain.description')}}
                </v-col>
            </v-row>
        </v-col>

        <v-col cols="6" xl="4">

            <v-row v-for="(row, rowIndex) in examTemplateRows" :key="rowIndex">
                <v-col cols="4" v-for="(examTemplate, colIndex) in row" :key="`${rowIndex}-${colIndex}`">

                    <v-card 
                        class="rounded-lg"
                        :color="examTemplate.name == 'System Template' ? 'green' : 'primary'"
                        :ripple="false"
                        :variant="quizImportStore.selectedExamTemplate?.id == examTemplate.id ? 'flat' : 'tonal'"
                        :aria-label="translate('quizImportWizard.templateMain.templateSelect')"
                        tabindex="0"
                        :hover="true"
                        @keyup.enter="onTemplateCardClick(examTemplate)"
                        @click="onTemplateCardClick(examTemplate)">

                        <v-toolbar color="transparent">
                            <v-toolbar-title class="text-subtitle-1" :text="examTemplate.name"></v-toolbar-title>

                            <template v-slot:append>
                                <v-btn 
                                    :aria-label="translate('quizImportWizard.templateMain.templateInfo')"
                                    @click.stop="openExamTemplateDialog(examTemplate)" 
                                    icon="mdi-information">
                                </v-btn>
                            </template>
                        </v-toolbar>

                        <v-card-text></v-card-text>

                        <!-- <v-card-actions>
                        </v-card-actions> -->
                    </v-card>

                </v-col>
            </v-row>

        </v-col>
        <v-spacer></v-spacer>
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
    import {translate} from "@/utils/generalUtils";
    import * as generalUtils from "@/utils/generalUtils";

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


    async function onTemplateCardClick(examTemplate: ExamTemplate){
        quizImportStore.selectedClientGroups = [];
        if(examTemplate.id == quizImportStore.selectedExamTemplate?.id){
            quizImportStore.selectedExamTemplate = null;
            quizImportStore.removeGroupSelectionComponents();
            return;
        }

        quizImportStore.selectedExamTemplate = examTemplate;

        if(quizImportStore.selectedExamTemplate.CLIENT_GROUP_TEMPLATES != null && quizImportStore.selectedExamTemplate.CLIENT_GROUP_TEMPLATES.length > 1){
            quizImportStore.addGroupSelectionComponents();

            if(quizImportStore.selectedExamTemplate.EXAM_ATTRIBUTES.enableScreenProctoring){
                await getExamTemplateSpGroups();
            }

            return;
        }

        if(quizImportStore.selectedExamTemplate.CLIENT_GROUP_TEMPLATES != null && quizImportStore.selectedExamTemplate.CLIENT_GROUP_TEMPLATES.length == 1){
            quizImportStore.selectedClientGroups.push(quizImportStore.selectedExamTemplate.CLIENT_GROUP_TEMPLATES[0]);
            return;
        }

        quizImportStore.removeGroupSelectionComponents();
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

    async function getExamTemplateSpGroups(){
        const examTemplateSp: ScreenProctoringSettings | null = await quizImportWizardViewService.getExamTemplateSp(quizImportStore.selectedExamTemplate!.id.toString());
    
        if(examTemplateSp == null){
            return;
        }

        quizImportStore.availableSpClientGroupIds = generalUtils.createNumberIdList(examTemplateSp.spsSEBGroupsSelection);
    }

</script>

<style scoped>
</style>