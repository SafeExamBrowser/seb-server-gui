import { ExamStatusEnum, ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { defineStore } from "pinia";

export const useErrorStore = defineStore("error", () => {
    const isError = ref<boolean>(false);
    
    const errorProps = ref<ErrorProps>({
        textKey: 'api-error',
        color: 'error',
        timeout: 5000,
    });

    function showError(errorPropsParam: ErrorProps){
        isError.value = false;
        errorProps.value = errorPropsParam;
        isError.value = true;
    }

    function hideError(){
        isError.value = false;
    }

    return {
        isError,
        errorProps,
        showError,
        hideError
    };
});