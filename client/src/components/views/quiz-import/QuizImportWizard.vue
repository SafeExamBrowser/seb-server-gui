<template>

    <!------------top info box------------->
    <!-- @vue-ignore -->
    <component :is="infoBoxComponents[currentStep-1]"/>
    <!------------------------------------->


    <!---------wizard---------->
    <v-row>
        <v-col cols="">
            <v-stepper 
                v-model="currentStep"
                elevation="4"
                class="rounded-lg">

                <v-stepper-header>
                    <template v-for="(step, index) in steps" :key="step">
                        <v-stepper-item :value="index+1">
                            {{ step }}
                        </v-stepper-item>
                        <v-divider v-if="index != steps.length-1"></v-divider>
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
    import InfoBoxExam from "@/components/views/quiz-import/info-box-content/InfoBoxExam.vue"; 
    import MainContentExam from "@/components/views/quiz-import/main-content/MainContentExam.vue"; 
    import InfoBoxTemplate from "@/components/views/quiz-import/info-box-content/InfoBoxTemplate.vue";
    import MainContentTemplate from "@/components/views/quiz-import/main-content/MainContentTemplate.vue"; 
    import InfoBoxSupervisor from "@/components/views/quiz-import/info-box-content/InfoBoxSupervisor.vue"; 
    import MainContentSupervisor from "@/components/views/quiz-import/main-content/MainContentSupervisor.vue"; 
    import InfoBoxPassword from "@/components/views/quiz-import/info-box-content/InfoBoxPassword.vue";
    import MainContentPassword from "@/components/views/quiz-import/main-content/MainContentPassword.vue"; 
    import InfoBoxSummary from "@/components/views/quiz-import/info-box-content/InfoBoxSummary.vue"; 
    import MainContentSummary from "@/components/views/quiz-import/main-content/MainContentSummary.vue"; 
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
        InfoBoxExam,
        InfoBoxTemplate,
        InfoBoxSupervisor,
        InfoBoxPassword,
        InfoBoxSummary
    ];

    const mainContentComponents: Component = [
        MainContentExam,
        MainContentTemplate,
        MainContentSupervisor,
        MainContentPassword,    
        MainContentSummary
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


</script>

<style scoped>

</style>