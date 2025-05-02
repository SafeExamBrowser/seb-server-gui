import * as indicatorService from "@/services/seb-server/api-services/indicatorService.ts";




export async function getIndicators(examId: string): Promise<Indicators | null>{
    try{
        return await indicatorService.getIndicators(examId);    
    }catch(error){
        return null;
    }
}