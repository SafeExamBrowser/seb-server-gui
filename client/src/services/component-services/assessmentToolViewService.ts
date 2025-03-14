import * as assessmentToolService from "@/services/api-services/assessmentToolService";


export async function getAssessmentTools(active: string): Promise<AssessmentTools | null>{
    try{
        return await assessmentToolService.getAssessmentTools(active);        
    }catch(error){
        return null;
    }
}