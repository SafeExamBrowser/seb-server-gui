<template>
    <!-- Breadcrumb & Title -->
    <v-row dense>
        <v-col class="pl-5 mb-1" cols="12" md="10">
            <div class="path-text d-flex align-center">
                <span
                    class="breadcrumb-link"
                    @click="navigateTo(constants.HOME_PAGE_ROUTE)"
                >
                    {{ translate("titles.home") }}
                </span>

                <span class="breadcrumb-arrow">›</span>
            </div>
        </v-col>

        <v-col class="pl-10 mb-7" cols="12" md="10">
            <div class="primary-text-color text-h4 font-weight-bold">
                {{ translate("titles.quizImport") }}
            </div>
        </v-col>

        <v-col class="pl-10" cols="12" md="2"></v-col>
    </v-row>

    <!------------top info box or alert------------->
    <template v-if="isNoAssessmentTool">
        <AlertMsg
            :alert-props="{
                title: translate('quizImportWizard.warning.title'),
                color: 'warning',
                type: 'alert',
                textKey: 'no-assessment-tool',
            }"
        >
        </AlertMsg>
    </template>

    <div v-if="!isNoAssessmentTool" class="d-flex flex-column flex-grow-1">
        <component
            :is="
                quizImportStore.infoBoxComponents[
                    quizImportStore.currentStep - 1
                ]
            "
            v-if="
                quizImportStore.steps[quizImportStore.currentStep - 1].value ==
                2
            "
            @load-exam-items-caller="loadExamItemsCaller"
        />
        <component
            :is="
                quizImportStore.infoBoxComponents[
                    quizImportStore.currentStep - 1
                ]
            "
            v-else
        />

        <!---------new stepper and content---------->
        <v-row class="d-flex align-stretch mt-3">
            <!-- Left side -->
            <v-col class="d-flex flex-column" cols="9">
                <v-card
                    class="d-flex flex-column rounded-lg"
                    elevation="4"
                    style="min-height: 63vh"
                >
                    <v-sheet
                        class="pa-4 mt-lg-4 mt-md-2 mt-sm-1 d-flex flex-column flex-grow-1"
                        style="overflow-y: hidden"
                    >
                        <component
                            :is="
                                quizImportStore.mainContentComponents[
                                    quizImportStore.currentStep - 1
                                ]
                            "
                        />
                    </v-sheet>
                </v-card>
            </v-col>

            <!-- Right side -->
            <v-col class="d-flex flex-column" cols="3">
                <v-card
                    class="d-flex flex-column rounded-lg"
                    elevation="4"
                    style="min-height: 100%"
                >
                    <v-stepper-vertical
                        v-model="quizImportStore.currentStep"
                        class="bg-transparent clean-stepper mt-lg-10 mt-md-8 mt-sm-4 ml-4 mb-16"
                        style="flex: 1; display: flex; flex-direction: row"
                    >
                        <template #default="{ step }">
                            <template
                                v-for="(
                                    stepItem, index
                                ) in quizImportStore.steps"
                                :key="stepItem"
                            >
                                <v-stepper-vertical-item
                                    color="#215CAF"
                                    :complete="step > index + 1"
                                    elevation="0"
                                    :title="stepItem.name"
                                    :value="index + 1"
                                >
                                    <template #next="{ next }">
                                        <v-btn
                                            color="primary"
                                            :disabled="
                                                isNextButtonDisabled(index + 1)
                                            "
                                            @click="
                                                handleStepperNext(index, next)
                                            "
                                        >
                                            {{
                                                index + 1 ===
                                                quizImportStore.steps.length
                                                    ? translate(
                                                          "quizImportWizard.buttons.save",
                                                      )
                                                    : translate(
                                                          "quizImportWizard.buttons.next",
                                                      )
                                            }}
                                        </v-btn>
                                    </template>

                                    <template #prev="{ prev }">
                                        <v-btn
                                            v-if="index > 0"
                                            variant="plain"
                                            @click="prev"
                                        >
                                            {{
                                                translate(
                                                    "quizImportWizard.buttons.back",
                                                )
                                            }}
                                        </v-btn>
                                    </template>
                                </v-stepper-vertical-item>
                            </template>
                        </template>
                    </v-stepper-vertical>
                    <div style="flex-grow: 1"></div>
                </v-card>
            </v-col>
        </v-row>

        <!------------------------------------->
    </div>
</template>

<script setup lang="ts">
import * as assessmentToolViewService from "@/services/seb-server/component-services/assessmentToolViewService";
import { useQuizImportStore } from "@/stores/seb-server/quizImportStore";
import { storeToRefs } from "pinia";
import * as constants from "@/utils/constants";
import { useAppBarStore } from "@/stores/store";
import * as generalUtils from "@/utils/generalUtils";
import { translate } from "@/utils/generalUtils";
import { useI18n } from "vue-i18n";
import * as quizImportWizardViewService from "@/services/seb-server/component-services/quizImportWizardViewService";
import { navigateTo } from "@/router/navigation";
import { useExamStore } from "@/stores/seb-server/examStore";
import { ref, onBeforeMount, watch } from "vue";
// i18n
const i18n = useI18n();

// stores
const appBarStore = useAppBarStore();
const quizImportStore = useQuizImportStore();
const quizImportStoreRef = storeToRefs(quizImportStore);

// error msg
const isNoAssessmentTool = ref<boolean>(false);

onBeforeMount(async () => {
    appBarStore.title = translate("titles.quizImport");

    quizImportStore.clearValues();
    await loadAssessmentToolSelection();
    setTabTitle();
});

// modify title in tab display current step
watch(quizImportStoreRef.currentStep, () => {
    setTabTitle();
});

function isNextButtonDisabled(step: number): boolean {
    let addStepAssessment: number = 0;
    if (
        quizImportStore.availableAssessmentTools != null &&
        quizImportStore.availableAssessmentTools.content.length > 1
    ) {
        addStepAssessment += 1;

        if (step === 1) {
            return !quizImportStore.selectedAssessmentTool;
        }
    }

    let addStepGroup: number = 0;
    if (
        quizImportStore.steps.some(
            (step) => step.type === constants.getQuizImportGroupStep().type,
        )
    ) {
        addStepGroup += 1;
    }

    if (step === 1 + addStepAssessment) {
        return !quizImportStore.selectedQuiz;
    }

    if (step === 2 + addStepAssessment) {
        return !quizImportStore.selectedExamTemplate;
    }

    if (step === 3 + addStepAssessment + addStepGroup) {
        return quizImportStore.selectedExamSupervisors.length === 0;
    }

    if (step === 5 + addStepAssessment + addStepGroup) {
        return false;
    }

    return false;
}

// call function in "ImportExamMain"
function loadExamItemsCaller() {
    // workaround es the method with "defineExpose" does not work
    quizImportStore.loadExamItemsCaller = Date.now();
}

async function loadAssessmentToolSelection() {
    const activeAssessmentTools: AssessmentToolsResponse | null =
        await getActiveAssessmentTools();

    // if no assessment tools connected --> show error msg
    if (
        activeAssessmentTools == null ||
        activeAssessmentTools.content.length === 0
    ) {
        isNoAssessmentTool.value = true;
        return;
    }

    quizImportStore.availableAssessmentTools = activeAssessmentTools;
    quizImportStore.forceNewSearch = true;

    // if more than one assessment tools connected --> show selection
    if (quizImportStore.availableAssessmentTools.content.length === 1) {
        // if only 1 connected --> select assessment tool & remove components from wizard
        quizImportStore.selectedAssessmentTool =
            activeAssessmentTools.content[0].id;

        quizImportStore.steps.shift();
        quizImportStore.infoBoxComponents.shift();
        quizImportStore.mainContentComponents.shift();
    }
}

async function getActiveAssessmentTools(): Promise<AssessmentToolsResponse | null> {
    const assessmentToolsResponse: AssessmentToolsResponse | null =
        await assessmentToolViewService.getAssessmentToolsActive();

    if (assessmentToolsResponse == null) {
        return null;
    }

    return assessmentToolsResponse;
}

function setTabTitle() {
    document.title =
        quizImportStore.currentStep +
        " - " +
        quizImportStore.steps[quizImportStore.currentStep - 1].name +
        " | " +
        translate("titles.quizImport", i18n);
}

function handleStepperNext(index: number, next: () => void) {
    if (index + 1 === quizImportStore.steps.length) {
        createExam();
    } else {
        next();
    }

    async function createExam() {
        if (
            quizImportStore.selectedQuiz == null ||
            quizImportStore.selectedExamTemplate == null ||
            quizImportStore.selectedExamTemplate?.id == undefined
        ) {
            return;
        }

        const testArr: string[] = quizImportStore.selectedClientGroups.map(
            (clientGroup) => clientGroup.id!.toString(),
        );

        console.log(quizImportStore.selectedClientGroups);
        console.log(testArr);

        const createExamParams: CreateExamPar = {
            lmsSetupId: quizImportStore.selectedQuiz.lms_setup_id,
            lms_setup_id: quizImportStore.selectedQuiz.lms_setup_id,
            externalId: quizImportStore.selectedQuiz.quiz_id,
            quiz_id: quizImportStore.selectedQuiz.quiz_id,
            //TODO - BUG possibly undefined ? add null check?
            examTemplateId: quizImportStore.selectedExamTemplate.id,
            type: quizImportStore.selectedExamTemplate.examType,
            quitPassword: quizImportStore.selectedQuitPassword,
            supporter: quizImportStore.selectedExamSupervisors.map(
                (userAccountName) => userAccountName.modelId,
            ),
            clientGroupIds: generalUtils.createStringCommaList(
                quizImportStore.selectedClientGroups.map(
                    (clientGroup) => clientGroup.id!,
                ),
            ),
        };

        const createExamResponse: Exam | null =
            await quizImportWizardViewService.createExam(createExamParams);
        if (createExamResponse == null) {
            return;
        }

        if (
            createExamResponse.id === undefined ||
            createExamResponse.id === null
        ) {
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

.link-color {
    color: #215caf;
    cursor: pointer;
}
</style>
