import *  as examService from "@/services/api-services/examService";
import *  as examTemplateService from "@/services/api-services/examTemplateService";


//=============api==============
export async function getExam(id: string): Promise<Exam | null>{
    try{
        return await examService.getExam(id);    
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getExams(optionalParGetExams?: OptionalParGetExams): Promise<Exams | null>{
    try{
        return await examService.getExams(optionalParGetExams);    
    }catch(error){
        console.error(error);
        return null;
    }
}

export async function getExamTemplate(id: string): Promise<ExamTemplate | null>{
    try{
        return await examTemplateService.getExamTemplate(id);    
    }catch(error){
        console.error(error);
        return null;
    }
}