import { defineStore } from "pinia";
import {navigateTo} from "@/router/navigation";
import * as constants from "@/utils/constants";
import ImportAssessmentInfo from "@/components/views/quiz-import/info-box-content/ImportAssessmentInfo.vue";
import ImportAssessmentMain from "@/components/views/quiz-import/main-content/ImportAssessmentMain.vue";
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

export const useQuizImportStore = defineStore("quizImport", () => {
    //steps
    const currentStep = ref<number>(1);
    const steps = ref<{name: string, value: number}[]>([
        {name: "Select Assessment Tool", value: 1},
        {name: "Select Exam", value: 2},
        {name: "Choose Template", value: 3},
        {name: "Add Examination Supervisor", value: 4},
        {name: "Set Quit Password", value: 5},
        {name: "Configuration Summary", value: 6}
    ]);
    
    //stepper components
    const infoBoxComponents = ref<Component[]>([
        markRaw(ImportAssessmentInfo),
        markRaw(ImportExamInfo),
        markRaw(ImportTemplateInfo),
        markRaw(ImportSupervisorInfo),
        markRaw(ImportPasswordInfo),
        markRaw(ImportSummaryInfo)
    ]);
    const mainContentComponents = ref<Component[]>([
        markRaw(ImportAssessmentMain),
        markRaw(ImportExamMain),
        markRaw(ImportTemplateMain),
        markRaw(ImportSupervisorMain),
        markRaw(ImportPasswordMain),    
        markRaw(ImportSummaryMain)
    ]);

    //exam table
    const searchField = ref<string | null>(null);
    const startTimestamp = ref<number | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();
    const loadExamItemsCaller = ref<number>();

    //selected values
    const selectedAssessmentTool = ref<number | null>(null);
    const selectedQuiz = ref<Quiz | null>();
    const selectedExamTemplate = ref<ExamTemplate | null>(null);
    const selectedExamSupervisors = ref<UserAccountName[]>([]);
    const selectedQuitPassword = ref<string>();

    //other values
    const availableAssessmentTools = ref<AssessmentTools>();

    function clearValues(){
        console.log("it got here")

        currentStep.value = 1;
        searchField.value = null;
        startTimestamp.value = null;
        selectedQuiz.value = null;
        selectedExamTemplate.value = null;
        selectedExamSupervisors.value = [];
        selectedQuitPassword.value = "";

        console.log(currentStep.value)
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
        selectedExamSupervisors,
        selectedQuitPassword,
        clearValues,
        availableAssessmentTools
    };
});