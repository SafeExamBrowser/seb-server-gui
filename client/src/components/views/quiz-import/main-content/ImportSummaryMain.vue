<template>
    <v-row>
        <v-spacer></v-spacer>
        <v-col cols="8" xl="6">
            <!--------Title------>
            <v-row class="mb-10">
                <v-col>
                    <div class="primary-text-color text-h6 font-weight-bold">
                        Configuration Summary
                    </div>
                    <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                </v-col>
            </v-row>

            <!--------Template------>
            <v-row>
                <v-col>
                    <div class="primary-text-color text-subtitle-1">
                        Exam Template
                    </div>
                    <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                </v-col>
            </v-row>
            <v-row class="mb-10">
                <v-col>
                    {{ quizImportStore.selectedExamTemplate?.name }}
                </v-col>
            </v-row>

            <!--------client groups------>
            <v-row v-if="quizImportStore.selectedClientGroups.length != 0">
                <v-col>
                    <div class="primary-text-color text-subtitle-1">
                        Client Groups
                    </div>
                    <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                </v-col>
            </v-row>
            <v-row v-if="quizImportStore.selectedClientGroups.length != 0" class="mb-10">
                <v-col>
                    <v-list>
                        <template 
                            v-for="clientGroup in quizImportStore.selectedClientGroups"
                            :key="clientGroup.id"
                            :value="clientGroup.id">
                        
                            <v-list-item>
                                <v-list-item-title>{{ clientGroup.name }}</v-list-item-title>
                            </v-list-item>

                            <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                        </template>
                    </v-list>
                </v-col>
            </v-row>

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
            supporter: quizImportStore.selectedExamSupervisors.map(userAccountName => userAccountName.modelId),
            clientGroupIds: quizImportStore.selectedClientGroups.map(clientGroup => clientGroup.id!.toString())
        }

        const createExamResponse: Exam | null = await quizImportWizardViewService.createExam(createExamParams);
        if(createExamResponse == null){
            return;
        }

        navigateTo(constants.EXAM_ROUTE + "/" + createExamResponse.id);
        quizImportStore.clearValues();
    }



</script>



<style scoped>



</style>