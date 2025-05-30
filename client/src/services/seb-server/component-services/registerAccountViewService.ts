import * as userAccountService from "@/services/seb-server/api-services/userAccountService";
import * as institutionService from "@/services/seb-server/api-services/institutionService";


// export async function registerUserAccount(uuid: string, password: string, newPassword: string, confirmNewPassword: string): Promise<UserAccount[] | null>{
//     try{
//         return await userAccountService.registerUserAccount(uuid, password, newPassword, confirmNewPassword)
//
//     }catch(error){
//         return null;
//     }
// }


export async function getInstitutions(): Promise<Institution[] | null>{
    try{
        return await institutionService.getInstitutions()

    }catch(error){
        return null;
    }
}
