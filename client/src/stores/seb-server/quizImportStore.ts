import { defineStore } from "pinia";
import * as constants from "@/utils/constants";
import ImportGroupInfo from "@/components/views/seb-server/quiz-import/info-box-content/ImportGroupInfo.vue";
import ImportGroupMain from "@/components/views/seb-server/quiz-import/main-content/ImportGroupMain.vue";
import { useI18n } from "vue-i18n";


export const useQuizImportStore = defineStore("quizImport", () => {
    //i18n
    const i18n = useI18n();

    //steps
    const currentStep = ref<number>(1);
    const steps = ref<ImportWizardSteps[]>(constants.getQuizImportSteps(i18n));

    //stepper components
    const infoBoxComponents = ref<Component[]>(constants.quizImportInfoBoxComponents.map(component => markRaw(component)));
    const mainContentComponents = ref<Component[]>(constants.quizImportMainContentComponents.map(component => markRaw(component)));


    //exam table
    const searchField = ref<string | null>(null);
    const startTimestamp = ref<number | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();
    const loadExamItemsCaller = ref<number>();

    //selected values
    const selectedAssessmentTool = ref<number | null>(null);
    const selectedQuiz = ref<Quiz | null>();
    const selectedExamTemplate = ref<ExamTemplate | null>(null);
    const selectedClientGroups = ref<ClientGroup[]>([]);
    const selectedExamSupervisors = ref<UserAccountName[]>([]);
    const selectedQuitPassword = ref<string>();

    //other values
    const availableSpClientGroupIds = ref<number[]>([]);
    const availableAssessmentTools = ref<AssessmentToolsResponse>();
    const forceNewSearch = ref<boolean>(false);


    function addGroupSelectionComponents(){
        if(steps.value.some(step => step.type == constants.getQuizImportGroupStep(i18n).type)){
            return;
        }

        //if there are more than 1 assessmnet tools add +1 to the index
        let arrayIndex: number = 2;
        if(availableAssessmentTools.value != null && availableAssessmentTools.value.content.length > 1){
            arrayIndex += 1;
        }

        steps.value.splice(arrayIndex, 0, constants.getQuizImportGroupStep(i18n));
        for(let i = 3; i < steps.value.length; i++){
            steps.value[i].value++;
        }

        infoBoxComponents.value.splice(arrayIndex, 0, markRaw(ImportGroupInfo));
        mainContentComponents.value.splice(arrayIndex, 0, markRaw(ImportGroupMain));
    }

    function removeGroupSelectionComponents(){
        if(!steps.value.some(step => step.type == constants.getQuizImportGroupStep(i18n).type)){
            return;
        }

        //if there are more than 1 assessmnet tools add +1 to the index
        let arrayIndex: number = 2;
        if(availableAssessmentTools.value != null && availableAssessmentTools.value.content.length > 1){
            arrayIndex += 1;
        }

        steps.value.splice(arrayIndex, 1);
        infoBoxComponents.value.splice(arrayIndex, 1);
        mainContentComponents.value.splice(arrayIndex, 1);
    }

    function clearValues(){
        currentStep.value = 1;

        steps.value = constants.getQuizImportSteps(i18n).map(step => step);
        infoBoxComponents.value = constants.quizImportInfoBoxComponents.map(component => markRaw(component));
        mainContentComponents.value = constants.quizImportMainContentComponents.map(component => markRaw(component))

        searchField.value = null;
        startTimestamp.value = null;
        selectedQuiz.value = null;
        selectedExamTemplate.value = null;
        selectedClientGroups.value = [];
        selectedExamSupervisors.value = [];
        selectedQuitPassword.value = "";
    }


    return {
        currentStep,
        steps,
        infoBoxComponents,
        mainContentComponents,
        searchField,
        startTimestamp,
        currentPagingOptions,
        loadExamItemsCaller,
        selectedAssessmentTool,
        selectedQuiz,
        selectedExamTemplate,
        availableSpClientGroupIds,
        selectedClientGroups,
        selectedExamSupervisors,
        selectedQuitPassword,
        clearValues,
        availableAssessmentTools,
        addGroupSelectionComponents,
        removeGroupSelectionComponents,
        forceNewSearch
    };
});
