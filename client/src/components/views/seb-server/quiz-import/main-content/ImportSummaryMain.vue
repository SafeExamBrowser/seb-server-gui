<template>
    <v-row>
        <v-spacer></v-spacer>
        <v-col cols="8" xl="6">
            <!--------Title------>
            <v-row class="mb-10">
                <v-col>
                    <div class="primary-text-color text-h6 font-weight-bold">
                        {{translate("quizImportWizard.summaryMain.configurationSummary")}}
                    </div>
                    <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                </v-col>
            </v-row>

            <!--------Template------>
            <v-row>
                <v-col>
                    <div class="primary-text-color text-subtitle-1">
                        {{translate("quizImportWizard.summaryMain.examTemplate")}}
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
                        {{translate("quizImportWizard.summaryMain.clientGroups")}}
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
                        {{translate("quizImportWizard.summaryMain.supervisors")}}
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
                        {{translate("quizImportWizard.summaryMain.password")}}
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
                        :placeholder="translate('quizImportWizard.passwordMain.password')"
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
                        {{translate("general.saveButton")}}
                    </v-btn>
                </v-col>
            </v-row>

        </v-col>
        <v-spacer></v-spacer>
    </v-row>
</template>


<script setup lang="ts">
    import * as quizImportWizardViewService from "@/services/seb-server/component-services/quizImportWizardViewService";
    import { useQuizImportStore } from "@/stores/seb-server/quizImportStore";
    import { useExamStore } from '@/stores/seb-server/examStore';
    import {navigateTo} from "@/router/navigation";
    import * as constants from "@/utils/constants";
    import {translate} from "@/utils/generalUtils";
    import * as generalUtils from "@/utils/generalUtils";


    //stores
    const quizImportStore = useQuizImportStore();

    //pw field
    const passwordVisible = ref<boolean>(false);

    async function createExam(){
        if(quizImportStore.selectedQuiz == null || quizImportStore.selectedExamTemplate == null){
            return;
        }

        const testArr: string[] = quizImportStore.selectedClientGroups.map(clientGroup => clientGroup.id!.toString());

        console.log(quizImportStore.selectedClientGroups)
        console.log(testArr)
        
        const createExamParams: CreateExamPar = {
            lmsSetupId: quizImportStore.selectedQuiz.lms_setup_id,
            lms_setup_id: quizImportStore.selectedQuiz.lms_setup_id,
            externalId: quizImportStore.selectedQuiz.quiz_id,
            quiz_id: quizImportStore.selectedQuiz.quiz_id,
            examTemplateId: quizImportStore.selectedExamTemplate.id,
            quitPassword: quizImportStore.selectedQuitPassword,
            supporter: quizImportStore.selectedExamSupervisors.map(userAccountName => userAccountName.modelId),
            clientGroupIds: generalUtils.createStringCommaList(quizImportStore.selectedClientGroups.map(clientGroup => clientGroup.id!))
        }

        const createExamResponse: Exam | null = await quizImportWizardViewService.createExam(createExamParams);
        if(createExamResponse == null){
            return;
        }

        if (createExamResponse.id == undefined) {
            console.log(createExamResponse);
            const msg: unknown = createExamResponse;
            const message: APIMessage[] = msg as APIMessage[];
            
            navigateTo(constants.EXAM_ROUTE + "/" + message[0].details);
            quizImportStore.clearValues();
            const examStore = useExamStore();
            examStore.importMessages = message;
        } else {
            navigateTo(constants.EXAM_ROUTE + "/" + createExamResponse.id);
            quizImportStore.clearValues();
        }
    }



</script>



<style scoped>



</style>