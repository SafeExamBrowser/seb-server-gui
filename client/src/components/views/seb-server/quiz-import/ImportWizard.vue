<template>

    <!------------top info box------------->
    <template v-if="isNoAssessmentTool">
        <AlertMsg
            :alertProps="{
                title: translate('quizImportWizard.warning.title'),
                color: 'warning',
                type: 'alert',
                textKey: 'no-assessment-tool'
            }">
        </AlertMsg>
    </template>

    <template v-if="!isNoAssessmentTool">
        <component 
            v-if="quizImportStore.steps[quizImportStore.currentStep-1].value == 2"
            :is="quizImportStore.infoBoxComponents[quizImportStore.currentStep-1]"
            @loadExamItemsCaller="loadExamItemsCaller"
        />
        <component v-else :is="quizImportStore.infoBoxComponents[quizImportStore.currentStep-1]"/>

        <!---------wizard---------->
        <v-row>
            <v-col>
                <v-stepper 
                    editable
                    v-model="quizImportStore.currentStep"
                    elevation="4"
                    class="rounded-lg">

                    <v-stepper-header>
                        <template v-for="(step, index) in quizImportStore.steps" :key="step">
                            <v-stepper-item :value="index+1">
                                {{ step.name }}
                            </v-stepper-item>
                            <v-divider class="border-opacity-25" :thickness="2" v-if="index != quizImportStore.steps.length-1"></v-divider>
                        </template>

                        <v-icon 
                            icon="mdi-chevron-left"
                            style="font-size: 40px;"
                            :aria-label="translate('quizImportWizard.steps.previousStep')"
                            @keyup.enter="quizImportStore.currentStep-=1"
                            @click="quizImportStore.currentStep-=1"
                            :disabled="quizImportStore.currentStep == 1">
                        </v-icon>

                        <v-icon 
                            class="mr-6"
                            icon="mdi-chevron-right"
                            style="font-size: 40px;"
                            :aria-label="translate('quizImportWizard.steps.nextStep')"
                            @keyup.enter="quizImportStore.currentStep+=1"
                            @click="quizImportStore.currentStep+=1"
                            :disabled="isNextButtonDisabled(quizImportStore.currentStep)">
                        </v-icon>

                    </v-stepper-header>

                    <v-stepper-window>
                        <template v-for="(step, index) in quizImportStore.steps" :key="step">

                            <v-stepper-window-item :value="index+1">
                                <component :is="quizImportStore.mainContentComponents[index]"/>
                            </v-stepper-window-item>

                        </template>
                    </v-stepper-window>
                    
                </v-stepper>

            </v-col>
        </v-row>
        <!------------------------------------->
    </template>

</template>


<script setup lang="ts">
    import * as assessmentToolViewService from "@/services/seb-server/component-services/assessmentToolViewService";
    import { useQuizImportStore } from "@/stores/seb-server/quizImportStore";
    import { storeToRefs } from "pinia";
    import * as constants from "@/utils/constants";
    import { useAppBarStore } from "@/stores/store";
    import * as generalUtils from "@/utils/generalUtils";
    import {translate} from "@/utils/generalUtils";
    import { useI18n } from "vue-i18n";

    //i18n
    const i18n = useI18n();

    //stores
    const appBarStore = useAppBarStore();
    const quizImportStore = useQuizImportStore();
    const quizImportStoreRef = storeToRefs(quizImportStore);

    //error msg
    const isNoAssessmentTool = ref<boolean>(false);

    onBeforeMount(async () => {
        appBarStore.title = translate('titles.quizImport');

        quizImportStore.clearValues();
        await loadAssessmentToolSelection();
        setTabTitle();
    });

    //modify title in tab display current step
    watch(quizImportStoreRef.currentStep, () => {
        setTabTitle(); 
    });


    function isNextButtonDisabled(step: number): boolean{
        let addStepAssessment: number = 0;
        if(quizImportStore.availableAssessmentTools != null && quizImportStore.availableAssessmentTools.content.length > 1){
            addStepAssessment+=1;

            if(step == 1){
                return !quizImportStore.selectedAssessmentTool;
            }
        }

        let addStepGroup: number = 0;
        if(quizImportStore.steps.some(step => step.type == constants.getQuizImportGroupStep().type)){
            addStepGroup+=1;
        }

        if(step == 1 + addStepAssessment){
            return !quizImportStore.selectedQuiz;
        }

        if(step == 2 + addStepAssessment){
            return !quizImportStore.selectedExamTemplate;
        }

        if(step == 3 + addStepAssessment + addStepGroup){
            return quizImportStore.selectedExamSupervisors.length == 0;
        }

        if(step == 5 + addStepAssessment + addStepGroup){
            return true;
        }

        return false;
    }

    //call function in "ImportExamMain"
    function loadExamItemsCaller(){
        //workaround es the method with "defineExpose" does not work
        quizImportStore.loadExamItemsCaller = Date.now();
    }


    async function loadAssessmentToolSelection(){
        const activeAssessmentTools: AssessmentTools | null = await getActiveAssessmentTools();

        //if no assessment tools connected --> show error msg
        if(activeAssessmentTools == null || activeAssessmentTools.content.length == 0){
            isNoAssessmentTool.value = true;
            return;
        }

        quizImportStore.availableAssessmentTools = activeAssessmentTools;
        quizImportStore.forceNewSearch = true;

        //if more then one assessment tools connected --> show selection
        if(quizImportStore.availableAssessmentTools.content.length == 1){
            //if only 1 connected --> select assessment tool & remove components from wizard
            quizImportStore.selectedAssessmentTool = activeAssessmentTools.content[0].id;

            quizImportStore.steps.shift();
            quizImportStore.infoBoxComponents.shift();
            quizImportStore.mainContentComponents.shift();

            return;
        }
    }


    async function getActiveAssessmentTools(): Promise<AssessmentTools | null>{
        const assessmentToolsResponse: AssessmentTools | null = await assessmentToolViewService.getAssessmentTools("active");

        if(assessmentToolsResponse == null) {
            return null;
        }

        return assessmentToolsResponse;
    }

    function setTabTitle(){
        document.title = 
            quizImportStore.currentStep + " - " + 
            quizImportStore.steps[quizImportStore.currentStep-1].name + " | " + 
            translate("titles.quizImport", i18n);
    }


</script>

<style scoped>

</style>