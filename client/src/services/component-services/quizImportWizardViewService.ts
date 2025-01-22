import * as quizService from "@/services/api-services/quizService";
import * as examTemplateService from "@/services/api-services/examTemplateService";


//=============api==============
export async function getQuizzes(optionalParamters?: OptionalParGeneric): Promise<Quizzes | null>{
    try{
        return await quizService.getQuizzes(optionalParamters);        
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getExamTemplates(optionalParamters?: OptionalParGeneric): Promise<ExamTemplates | null>{
    try{
        return await examTemplateService.getExamTemplates(optionalParamters);        
    }catch(error){
        console.error(error);
        return null;
    }
}

