<template>

    <!------------top info box------------->
    <!-- @vue-ignore -->
    <component 
        v-if="currentStep-1 == 0"
        :is="infoBoxComponents[0]"
        @loadExamItemsCaller="loadExamItemsCaller"
    />
    <!-- @vue-ignore -->
    <component v-else :is="infoBoxComponents[currentStep-1]"/>
    <!------------------------------------->


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
                            <!-- @vue-ignore -->
                            <component :is="mainContentComponents[index]"/>
                        </v-stepper-window-item>

                    </template>
                </v-stepper-window>
                
            </v-stepper>

        </v-col>
    </v-row>
    <!------------------------------------->

</template>


<script setup lang="ts">
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
    import { useQuizImportStore } from "@/stores/quizImportStore";

    //stores
    const quizImportStore = useQuizImportStore();

    const currentStep = ref<number>(1);

    const steps: string[] = [
        "Select Exam", 
        "Choose Template",
        "Add Examination Supervisor",
        "Set Quit Password",
        "Configuration Summary"
    ];

    const infoBoxComponents: Component = [
        ImportExamInfo,
        ImportTemplateInfo,
        ImportSupervisorInfo,
        ImportPasswordInfo,
        ImportSummaryInfo
    ];

    const mainContentComponents: Component = [
        ImportExamMain,
        ImportTemplateMain,
        ImportSupervisorMain,
        ImportPasswordMain,    
        ImportSummaryMain
    ];

    watch(currentStep, () => {
        // console.log("current step: " + currentStep.value)
    });


    function isNextButtonDisabled(step: number): boolean{
        if(step == 1){
            return !quizImportStore.selectedQuiz;
        }

        if(step == 2){
            return !quizImportStore.selectedExamTemplate;
        }

        if(step == 3){
            return quizImportStore.selectedExamSupervisors.length == 0;
        }

        if(step == 5){
            return true;
        }

        return false;
    }

    //call function in "ImportExamMain"
    function loadExamItemsCaller(){
        //workaround es the method with "defineExpose" does not work
        quizImportStore.loadExamItemsCaller = Date.now();
    }


</script>

<style scoped>

</style>