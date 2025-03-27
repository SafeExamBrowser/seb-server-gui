import { defineStore } from "pinia";
import * as constants from "@/utils/constants";
import ImportGroupInfo from "@/components/views/quiz-import/info-box-content/ImportGroupInfo.vue"; 
import ImportGroupMain from "@/components/views/quiz-import/main-content/ImportGroupMain.vue"; 


export const useQuizImportStore = defineStore("quizImport", () => {
    //steps
    const currentStep = ref<number>(1);
    const steps = ref<{name: string, value: number}[]>(constants.quizImportSteps);
    
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
    const availableAssessmentTools = ref<AssessmentTools>();


    function addGroupSelectionComponents(){
        if(steps.value.includes(constants.quizImportGroupStep)){
            return;
        }

        steps.value.splice(2, 0, constants.quizImportGroupStep);
        for(let i = 3; i < steps.value.length; i++){
            steps.value[i].value++;
        }

        infoBoxComponents.value.splice(2, 0, markRaw(ImportGroupInfo));
        mainContentComponents.value.splice(2, 0, markRaw(ImportGroupMain));
    }

    function removeGroupSelectionComponents(){
        if(!steps.value.includes(constants.quizImportGroupStep)){
            return;
        }

        steps.value.splice(2, 1);
        infoBoxComponents.value.splice(2, 1);
        mainContentComponents.value.splice(2, 1);
    }

    function clearValues(){
        currentStep.value = 1;

        steps.value = constants.quizImportSteps.map(step => step);
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
        selectedClientGroups,
        selectedExamSupervisors,
        selectedQuitPassword,
        clearValues,
        availableAssessmentTools,
        addGroupSelectionComponents,
        removeGroupSelectionComponents
    };
});