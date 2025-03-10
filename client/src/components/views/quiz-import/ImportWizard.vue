<template>

    <!------------top info box------------->
    <template v-if="isNoAssessmentTool">
        <AlertMsg
            :alertProps="{
                title: 'No Assessment Tool',
                color: 'warning',
                type: 'alert',
                textKey: 'no-assessment-tool'
            }">
        ></AlertMsg>
    </template>

    <template v-if="!isNoAssessmentTool">
        <component 
            v-if="currentStep-1 == 0"
            :is="infoBoxComponents[0]"
            @loadExamItemsCaller="loadExamItemsCaller"
        />
        <component v-else :is="infoBoxComponents[currentStep-1]"/>


        <!---------wizard---------->
        <v-row>
            <v-col>
                <v-stepper 
                    v-model="currentStep"
                    elevation="4"
                    class="rounded-lg">

                    <v-stepper-header>
                        <template v-for="(step, index) in steps" :key="step">
                            <v-stepper-item :value="index+1">
                                {{ step }}
                            </v-stepper-item>
                            <v-divider class="border-opacity-25" :thickness="2" v-if="index != steps.length-1"></v-divider>
                        </template>

                        <v-icon 
                            icon="mdi-chevron-left"
                            style="font-size: 40px;"
                            @click="currentStep-=1"
                            :disabled="currentStep == 1">
                        </v-icon>

                        <v-icon 
                            class="mr-6"
                            icon="mdi-chevron-right"
                            style="font-size: 40px;"
                            @click="currentStep+=1"
                            :disabled="isNextButtonDisabled(currentStep)">
                        </v-icon>

                    </v-stepper-header>

                    <v-stepper-window>
                        <template v-for="(step, index) in steps" :key="step">

                            <v-stepper-window-item :value="index+1">
                                <component :is="mainContentComponents[index]"/>
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
    import ImportAssessmentInfo from "@/components/views/quiz-import/info-box-content/ImportAssessmentInfo.vue";
    import ImportAssessmentMain from "@/components/views/quiz-import/main-content/ImportAssessmentMain.vue";
    import ImportExamInfo from "@/components/views/quiz-import/info-box-content/ImportExamInfo.vue"; 
    import ImportExamMain from "@/components/views/quiz-import/main-content/ImportExamMain.vue"; 
    import ImportTemplateInfo from "@/components/views/quiz-import/info-box-content/ImportTemplateInfo.vue";
    import ImportTemplateMain from "@/components/views/quiz-import/main-content/ImportTemplateMain.vue"; 
    import ImportSupervisorInfo from "@/components/views/quiz-import/info-box-content/ImportSupervisorInfo.vue"; 
    import ImportSupervisorMain from "@/components/views/quiz-import/main-content/ImportSupervisorMain.vue"; 
    import ImportPasswordInfo from "@/components/views/quiz-import/info-box-content/ImportPasswordInfo.vue";
    import ImportPasswordMain from "@/components/views/quiz-import/main-content/ImportPasswordMain.vue"; 
    import ImportSummaryInfo from "@/components/views/quiz-import/info-box-content/ImportSummaryInfo.vue"; 
    import ImportSummaryMain from "@/components/views/quiz-import/main-content/ImportSummaryMain.vue"; 
    import * as assessmentToolViewService from "@/services/component-services/assessmentToolViewService";
    import { useQuizImportStore } from "@/stores/quizImportStore";

    //stores
    const quizImportStore = useQuizImportStore();

    //steps
    const currentStep = ref<number>(1);
    const steps = ref<string[]>([
        "Select Exam", 
        "Choose Template",
        "Add Examination Supervisor",
        "Set Quit Password",
        "Configuration Summary"
    ]);

    //error msg
    const isNoAssessmentTool = ref<boolean>(false);

    //stepper components
    const infoBoxComponents = ref<Component[]>([
        markRaw(ImportExamInfo),
        markRaw(ImportTemplateInfo),
        markRaw(ImportSupervisorInfo),
        markRaw(ImportPasswordInfo),
        markRaw(ImportSummaryInfo)
    ]);
    const mainContentComponents = ref<Component[]>([
        markRaw(ImportExamMain),
        markRaw(ImportTemplateMain),
        markRaw(ImportSupervisorMain),
        markRaw(ImportPasswordMain),    
        markRaw(ImportSummaryMain)
    ]);

    watch(currentStep, () => {
        // console.log("current step: " + currentStep.value)
    });

    onBeforeMount(async () => {
        await loadAssessmentToolSelection();
    });


    function isNextButtonDisabled(step: number): boolean{
        let additionalStep: number = 0;
        if(quizImportStore.availableAssessmentTools != null && quizImportStore.availableAssessmentTools.content.length > 1){
            additionalStep+=1;

            if(step == 1){
                return !quizImportStore.selectedAssessmentTool;
            }
        }
        

        if(step == 1 + additionalStep){
            return !quizImportStore.selectedQuiz;
        }

        if(step == 2 + additionalStep){
            return !quizImportStore.selectedExamTemplate;
        }

        if(step == 3 + additionalStep){
            return quizImportStore.selectedExamSupervisors.length == 0;
        }

        if(step == 5 + additionalStep){
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

        //if more then one assessment tools connected --> show selection
        if(quizImportStore.availableAssessmentTools.content.length > 1){
            steps.value.unshift("Select Assessment Tool");
            infoBoxComponents.value.unshift(markRaw(ImportAssessmentInfo));
            mainContentComponents.value.unshift(markRaw(ImportAssessmentMain));

            return;
        }

        //if only 1 connected --> select assessment tool
        quizImportStore.selectedAssessmentTool = activeAssessmentTools.content[0];
    }


    async function getActiveAssessmentTools(): Promise<AssessmentTools | null>{
        const assessmentToolsResponse: AssessmentTools | null = await assessmentToolViewService.getAssessmentTools("active");

        if(assessmentToolsResponse == null) {
            return null;
        }

        return assessmentToolsResponse;
    }


</script>

<style scoped>

</style>