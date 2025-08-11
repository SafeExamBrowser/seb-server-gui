import * as assessmentToolService from "@/services/seb-server/api-services/assessmentToolService";
import * as userAccountService from "@/services/seb-server/api-services/userAccountService";


export async function getAssessmentToolsActive(): Promise<AssessmentToolsResponse | null>{
    try{
        return await assessmentToolService.getAssessmentToolsActive();
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



export async function getAssessmentTools(optionalParameters?: OptionalParGetAssessmentTool): Promise<AssessmentToolsResponse | null>{
    try{
        return await assessmentToolService.getAssessmentTools(optionalParameters);
    }catch(error){
        return null;
    }
}


export async function activateUserAccount(accountId: string): Promise<UserAccount | null>{
    try{
        return await userAccountService.activateUserAccount(accountId)

    }catch(error){
        return null;
    }
}

export async function deactivateUserAccount(accountId: string): Promise<UserAccount | null>{
    try{
        return await userAccountService.deactivateUserAccount(accountId)

    }catch(error){
        return null;
    }
}


export async function deleteUserAccount(accountId: string): Promise<any | null>{
    try{
        return await userAccountService.deleteUserAccount(accountId)
    }catch(error){
        return null;
    }
}
