import *  as examService from "@/services/api-services/examService";


//=============api==============
export async function getExam(id: string): Promise<Exam | null>{
    try{
        return await examService.getExam(id);    
    }catch(error){
        console.error(error);
        return null;
    }
}