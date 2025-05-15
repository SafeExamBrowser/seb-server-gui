import * as groupService from "@/services/screen-proctoring/api-services/groupService";
import * as spConstants from "@/utils/sp-constants";

//=============api==============
export async function getGroups(optionalParamters?: OptionalParGroups): Promise<GroupObject | null>{
    try{
        return await groupService.getGroups(optionalParamters); 
    }catch(error){
        return null;
    }
}