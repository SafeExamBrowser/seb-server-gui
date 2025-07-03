<template>

    <!------------top info box or alert------------->
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

    <div v-if="!isNoAssessmentTool" class="d-flex flex-column flex-grow-1" style="height: 100%; min-height: 0; width: 100%;">
        <component
            v-if="quizImportStore.steps[quizImportStore.currentStep-1].value == 2"
            :is="quizImportStore.infoBoxComponents[quizImportStore.currentStep-1]"
            @loadExamItemsCaller="loadExamItemsCaller"
        />
        <component v-else :is="quizImportStore.infoBoxComponents[quizImportStore.currentStep-1]"/>

        <!---------new stepper and content---------->
        <v-row class="d-flex">

            <v-col cols="9" class=" d-flex flex-column fill-height" style="overflow: auto;">
                <v-card elevation="4" class="d-flex flex-column fill-height rounded-lg">
                    <!-- Render the current step’s content component -->
                    <v-sheet class="pa-4 mt-lg-4 mt-md-2 mt-sm-1 flex-column fill-height">
                    <component :is="quizImportStore.mainContentComponents[quizImportStore.currentStep - 1]"/>
                    </v-sheet>
                </v-card>
            </v-col>
            <v-col cols="3" class="d-flex flex-column fill-height">
                <v-card elevation="4" class="d-flex flex-column fill-height rounded-lg">

                    <v-stepper-vertical
                        v-model="quizImportStore.currentStep"
                        class="bg-transparent clean-stepper mt-lg-16 mt-md-8 mt-sm-4 ml-4"
                        style="flex: 1; display: flex; flex-direction: row;"
                    >
                        <template v-slot:default="{ step }">
                            <template v-for="(stepItem, index) in quizImportStore.steps" :key="stepItem">
                                <v-stepper-vertical-item
                                    elevation="0"
                                    :value="index + 1"
                                    :title="stepItem.name"
                                    :complete="step > index + 1"
                                >
                                    <template v-slot:next="{ next }">
                                        <v-btn
                                            color="primary"
                                            :disabled="isNextButtonDisabled(index + 1)"
                                            @click="handleStepperNext(index, next)"
                                        >
                                            {{ index + 1 === quizImportStore.steps.length ? translate("quizImportWizard.buttons.save") : translate("quizImportWizard.buttons.next") }}
                                        </v-btn>
                                    </template>

                                    <template v-slot:prev="{ prev }">
                                        <v-btn
                                            v-if="index > 0"
                                            variant="plain"
                                            @click="prev"
                                        >
                                            {{translate("quizImportWizard.buttons.back")}}
                                        </v-btn>
                                    </template>
                                </v-stepper-vertical-item>
                            </template>
                        </template>
                    </v-stepper-vertical>
                    <!-- Empty space filler -->
                    <div style="flex-grow: 1;"></div>
                </v-card>
            </v-col>
        </v-row>
        <!------------------------------------->
    </div>

</template>


<script setup lang="ts">
import * as assessmentToolViewService from "@/services/seb-server/component-services/assessmentToolViewService";
import {useQuizImportStore} from "@/stores/seb-server/quizImportStore";
import {storeToRefs} from "pinia";
import * as constants from "@/utils/constants";
import {useAppBarStore} from "@/stores/store";
import * as generalUtils from "@/utils/generalUtils";
import {translate} from "@/utils/generalUtils";
import {useI18n} from "vue-i18n";
import * as quizImportWizardViewService from "@/services/seb-server/component-services/quizImportWizardViewService";
import {navigateTo} from "@/router/navigation";
import {useExamStore} from "@/stores/seb-server/examStore";

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


function isNextButtonDisabled(step: number): boolean {
    let addStepAssessment: number = 0;
    if (quizImportStore.availableAssessmentTools != null && quizImportStore.availableAssessmentTools.content.length > 1) {
        addStepAssessment += 1;

        if (step == 1) {
            return !quizImportStore.selectedAssessmentTool;
        }
    }

    let addStepGroup: number = 0;
    if (quizImportStore.steps.some((step: { type: string }) => step.type == constants.getQuizImportGroupStep().type)) {
        addStepGroup += 1;
    }

    if (step == 1 + addStepAssessment) {
        return !quizImportStore.selectedQuiz;
    }

    if (step == 2 + addStepAssessment) {
        return !quizImportStore.selectedExamTemplate;
    }

    if (step == 3 + addStepAssessment + addStepGroup) {
        return quizImportStore.selectedExamSupervisors.length == 0;
    }

    if (step == 5 + addStepAssessment + addStepGroup) {
        return false;
    }

    return false;
}

//call function in "ImportExamMain"
function loadExamItemsCaller() {
    //workaround es the method with "defineExpose" does not work
    quizImportStore.loadExamItemsCaller = Date.now();
}


async function loadAssessmentToolSelection() {
    const activeAssessmentTools: AssessmentTools | null = await getActiveAssessmentTools();

    //if no assessment tools connected --> show error msg
    if (activeAssessmentTools == null || activeAssessmentTools.content.length == 0) {
        isNoAssessmentTool.value = true;
        return;
    }

    quizImportStore.availableAssessmentTools = activeAssessmentTools;
    quizImportStore.forceNewSearch = true;

    //if more then one assessment tools connected --> show selection
    if (quizImportStore.availableAssessmentTools.content.length == 1) {
        //if only 1 connected --> select assessment tool & remove components from wizard
        quizImportStore.selectedAssessmentTool = activeAssessmentTools.content[0].id;

        quizImportStore.steps.shift();
        quizImportStore.infoBoxComponents.shift();
        quizImportStore.mainContentComponents.shift();

        return;
    }
}


async function getActiveAssessmentTools(): Promise<AssessmentTools | null> {
    const assessmentToolsResponse: AssessmentTools | null = await assessmentToolViewService.getAssessmentTools("active");

    if (assessmentToolsResponse == null) {
        return null;
    }

    return assessmentToolsResponse;
}

function setTabTitle() {
    document.title =
        quizImportStore.currentStep + " - " +
        quizImportStore.steps[quizImportStore.currentStep - 1].name + " | " +
        translate("titles.quizImport", i18n);
}


function handleStepperNext(index: number, next: () => void) {
    if (index + 1 === quizImportStore.steps.length) {
        createExam();
    } else {
        next();
    }

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
}


</script>

<style scoped>


.clean-stepper .v-stepper-vertical-item__icon,
.clean-stepper .v-stepper-step__step,
.clean-stepper .v-stepper-step__step .v-icon {
    box-shadow: none !important;
    border: none !important;
    background: transparent !important;
}


</style>
