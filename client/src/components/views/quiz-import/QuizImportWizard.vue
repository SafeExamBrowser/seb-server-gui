<template>

    <!------------top info box------------->
    <component :is="infoBoxComponents[currentStep-1]"/>
    <!------------------------------------->


    <!---------wizard---------->
    <v-row>
        <v-col cols="">
            <v-stepper 
                v-model="currentStep"
                elevation="4"
                class="rounded-lg"
                :items=steps
                hide-actions>

                <!-- <template v-slot:header-item="item">
                    test
                
                </template> -->

                

                <template v-slot:item.1>
                    <component :is="mainContentComponents[0]"/>

                    <v-row>
                        <v-spacer></v-spacer>

                        <v-col class="pa-4" align="right">
                            <v-btn 
                                :disabled="!quizImportStore.selectedQuiz"
                                color="primary" 
                                @click="currentStep+=1">
                                Next
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>
            
                <template v-slot:item.2>
                    <component :is="mainContentComponents[1]"/>

                    <v-row>
                        <v-col class="pa-4" align="left">
                            <v-btn 
                                color="secondary" 
                                @click="currentStep-=1">
                                Previous
                            </v-btn>
                        </v-col>

                        <v-col class="pa-4" align="right">
                            <v-btn 
                                :disabled="!quizImportStore.selectedExamTemplate"
                                color="primary" 
                                @click="currentStep+=1">
                                Next
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>
            
                <template v-slot:item.3>
                    <component :is="mainContentComponents[2]"/>

                    <v-row>
                        <v-col class="pa-4" align="left">
                            <v-btn 
                                color="secondary" 
                                @click="currentStep-=1">
                                Previous
                            </v-btn>
                        </v-col>

                        <v-col class="pa-4" align="right">
                            <v-btn 
                                :disabled="quizImportStore.selectedExamSupervisors.length == 0"
                                color="primary" 
                                @click="currentStep+=1">
                                Next
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>

                <template v-slot:item.4>
                    <component :is="mainContentComponents[3]"/>

                    <v-row>
                        <v-col class="pa-4" align="left">
                            <v-btn 
                                color="secondary" 
                                @click="currentStep-=1">
                                Previous
                            </v-btn>
                        </v-col>

                        <v-col class="pa-4" align="right">
                            <v-btn 
                                color="primary" 
                                @click="currentStep+=1">
                                Next
                            </v-btn>
                        </v-col>
                    </v-row>
                    
                </template>

                <template v-slot:item.5>
                    <component :is="mainContentComponents[4]"/>

                    <v-row>
                        <v-col class="pa-4" align="left">
                            <v-btn 
                                color="secondary" 
                                @click="currentStep-=1">
                                Previous
                            </v-btn>
                        </v-col>

                        <v-col class="pa-4" align="right">
                            <v-btn 
                                color="primary" 
                                @click="currentStep+=1">
                                Save
                            </v-btn>
                        </v-col>
                    </v-row>
                </template>

            </v-stepper>
        </v-col>
    </v-row>
    <!------------------------------------->

</template>


<script setup lang="ts">
    import InfoBoxSelect from "@/components/views/quiz-import/info-box-content/InfoBoxSelect.vue"; 
    import MainContentSelect from "@/components/views/quiz-import/main-content/MainContentSelect.vue"; 
    import InfoBoxChoose from "@/components/views/quiz-import/info-box-content/InfoBoxChoose.vue";
    import MainContentChoose from "@/components/views/quiz-import/main-content/MainContentChoose.vue"; 
    import InfoBoxAdd from "@/components/views/quiz-import/info-box-content/InfoBoxAdd.vue"; 
    import MainContentSupervisor from "@/components/views/quiz-import/main-content/MainContentSupervisor.vue"; 
    import InfoBoxSet from "@/components/views/quiz-import/info-box-content/InfoBoxSet.vue";
    import MainContentSet from "@/components/views/quiz-import/main-content/MainContentSet.vue"; 
    import InfoBoxConfig from "@/components/views/quiz-import/info-box-content/InfoBoxConfig.vue"; 
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
        InfoBoxSelect,
        InfoBoxChoose,
        InfoBoxAdd,
        InfoBoxSet,
        InfoBoxConfig
    ];

    const mainContentComponents: Component = [
        MainContentSelect,
        MainContentChoose,
        MainContentSupervisor,
        MainContentSet,
        MainContentSummary
    ];


    watch(currentStep, () => {
        console.log("current step: " + currentStep.value)
    });


    


</script>

<style scoped>

</style>