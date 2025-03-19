import * as clientGroupService from "@/services/api-services/clientGroupService";



export async function getClientGroups(examId?: string): Promise<ClientGroups | null>{
    try{
        return await clientGroupService.getClientGroups(examId);    
    }catch(error){
        return null;
    }
}