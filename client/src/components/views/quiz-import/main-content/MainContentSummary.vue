<template>
    <v-row>
        <v-spacer></v-spacer>
        <v-col cols=6>

            <v-row class="mb-4">
                <v-col>
                    <AlertMsg 
                        v-if="saveError"
                        :alertProps="{
                            title: '',
                            color: 'error',
                            type: 'snackbar',
                            textKey: 'api-error'
                        }">
                    </AlertMsg>
                </v-col>
            </v-row>

            <!--------Title------>
            <v-row class="mb-10">
                <v-col>
                    <div class="primary-text-color text-h6 font-weight-bold">
                        Configuration Summary
                    </div>
                    <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                </v-col>
            </v-row>
            <!------------------->

            <!--------Template------>
            <v-row>
                <v-col>
                    <div class="primary-text-color text-subtitle-1">
                        {{ quizImportStore.selectedExamTemplate?.name }}
                    </div>
                    <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                </v-col>
            </v-row>
            <v-row class="mb-10">
                <v-col>
                    <!-- @vue-ignore -->
                    <div v-if="quizImportStore.selectedExamTemplate.description != null && quizImportStore.selectedExamTemplate?.description != ''">
                            {{ quizImportStore.selectedExamTemplate?.description }}
                    </div>
                    <div v-else>
                        <!-- No Description available -->
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tortor mi, tincidunt nec nibh placerat, aliquet luctus nulla. Vestibulum aliquam aliquet augue, eget laoreet purus ultrices sit amet. Donec fermentum congue elit, et egestas enim volutpat a. Vivamus finibus ante non mauris consectetur, lacinia accumsan ante ullamcorper. Ut ultricies augue tortor, ut dignissim ante interdum at. Pellentesque quis mi faucibus, tristique libero vel, auctor nunc. Fusce nec sapien consequat, finibus dui non, fermentum dolor.
                    </div>
                </v-col>
            </v-row>
            <!------------------->


            <!--------supervisors------>
            <v-row>
                <v-col>
                    <div class="primary-text-color text-subtitle-1">
                        Examination Supervisors
                    </div>
                    <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                </v-col>
            </v-row>
            <v-row class="mb-10">
                <v-col>
                    <v-list>
                        <template 
                            v-for="supervisor in quizImportStore.selectedExamSupervisors"
                            :key="supervisor.modelId"
                            :value="supervisor.modelId">
                        
                            <v-list-item>
                                <v-list-item-title>{{ supervisor.name }}</v-list-item-title>
                            </v-list-item>

                            <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                        </template>
                    </v-list>
                </v-col>
            </v-row>
            <!------------------->

            <!--------quit password------>
            <v-row>
                <v-col>
                    <div class="primary-text-color text-subtitle-1">
                        Quit Password
                    </div>
                    <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-text-field
                        :type="passwordVisible ? 'text' : 'password'"
                        prepend-inner-icon="mdi-lock-outline"
                        density="compact"
                        placeholder="Password"
                        variant="outlined"
                        v-model="quizImportStore.selectedQuitPassword"
                        readonly>

                        <template v-slot:append-inner>
                            <v-btn
                                density="compact"
                                variant="text"
                                :icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                @click="passwordVisible = !passwordVisible">
                            </v-btn>
                        </template>

                    </v-text-field>
                </v-col>
            </v-row>
            <!------------------->

            <!--------save button------>
            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="2" align="right">
                    <v-btn 
                        rounded="sm" 
                        color="primary" 
                        variant="flat" 
                        class="mt-8"
                        @click="createExam()">
                        Save
                    </v-btn>
                </v-col>
            </v-row>
            <!------------------->


        </v-col>
        <v-spacer></v-spacer>
    </v-row>
    




</template>


<script setup lang="ts">
    import * as quizImportWizardViewService from "@/services/component-services/quizImportWizardViewService";
    import { useQuizImportStore } from "@/stores/quizImportStore";
    import {navigateTo} from "@/router/navigation";
    import * as constants from "@/utils/constants";



    //stores
    const quizImportStore = useQuizImportStore();

    //pw field
    const passwordVisible = ref<boolean>(false);

    //error
    const saveError = ref<boolean>(false);


    onBeforeMount(async () => {

    });

    async function createExam(){
        saveError.value = false;

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

        let exam: Exam;
        try{
            exam = await quizImportWizardViewService.createExam(createExamParams);

        }catch(error: any){
            //todo improve error handling
            console.log(error.response.data[0].details)

            saveError.value = true;
            return;
        }

        navigateTo(constants.EXAM_ROUTE + "/" + exam.id);
    }



</script>



<style scoped>



</style>