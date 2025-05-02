import * as assessmentToolService from "@/services/seb-server/api-services/assessmentToolService";


export async function getAssessmentTools(active: string): Promise<AssessmentTools | null>{
    try{
        return await assessmentToolService.getAssessmentTools(active);        
    }catch(error){
        return null;
    }
}

export async function getAssessmentTool(id: number): Promise<AssessmentTool | null>{
    try{
        return await assessmentToolService.getAssessmentTool(id);        
    }catch(error){
        return null;
    }
}