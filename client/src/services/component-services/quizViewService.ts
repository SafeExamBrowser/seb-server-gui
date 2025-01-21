import * as quizService from "@/services/api-services/quizService";


//=============api==============
export async function getQuizzes(optionalParamters?: OptionalParGeneric): Promise<Quizzes | null>{
    try{
        return await quizService.getQuizzes(optionalParamters);        
    }catch(error){
        console.error(error);
        return null;
    }
}