import * as userAccountService from "@/services/seb-server/api-services/userAccountService";
import * as institutionService from "@/services/seb-server/api-services/institutionService";


export async function registerUserAccount(
    institutionId: string,
    name: string,
    surname: string,
    username: string,
    newPassword: string,
    confirmNewPassword: string,
    email?: string,
    timezone?: string
): Promise<UserAccount | null> {
    try {
        return await userAccountService.registerUserAccount(
            institutionId,
            name,
            surname,
            username,
            newPassword,
            confirmNewPassword,
            email,
            timezone
        );
    } catch (error) {
        return null;
    }
}


export async function getInstitutions(): Promise<Institution[] | null>{
    try{
        return await institutionService.getInstitutions()

    }catch(error){
        return null;
    }
}
