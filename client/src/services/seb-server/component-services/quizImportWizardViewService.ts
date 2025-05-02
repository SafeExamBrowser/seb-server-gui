import * as quizService from "@/services/seb-server/api-services/quizService";
import * as examTemplateService from "@/services/seb-server/api-services/examTemplateService";
import * as examService from "@/services/seb-server/api-services/examService";


//=============api==============
export async function getQuizzes(optionalParamters?: OptionalParGetQuizzes): Promise<Quizzes | null>{
    try{
        return await quizService.getQuizzes(optionalParamters);        
    }catch(error){
        return null;
    }
}

export async function getExamTemplates(optionalParamters?: OptionalParGeneric): Promise<ExamTemplates | null>{
    try{
        return await examTemplateService.getExamTemplates(optionalParamters);        
    }catch(error){
        return null;
    }
}

export async function createExam(createExamPar: CreateExamPar): Promise<Exam | null>{
    try{
        return await examService.createExam(createExamPar);        
    }catch(error){
        return null;
    }
}